import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { revealProgress } from '@/three/revealProgress';
import { profile } from '@/data/profile';

/**
 * The hub: a glowing core anchored to the bottom of the viewport, from which
 * the navigation nodes fan out.
 *
 * A faceted shell dissolves as the cursor approaches, revealing a holographic
 * portrait suspended in the particle core. The whole assembly recedes while a
 * panel is open so it never competes with the content on top of it.
 */

/** Where the assembly starts and ends over the scroll sequence. */
const START_Y = 0;
const HUB_Y = -1.15;
const START_SCALE = 1.15;
const HUB_SCALE = 0.52;

/** Half the visible world height at z=0, for mapping world Y to clip space. */
const HALF_HEIGHT = 5 * Math.tan((45 / 2) * (Math.PI / 180));

/** Shared per-frame state, written by the rig and read by its children. */
interface RigState {
  /** 0 = shell intact, 1 = fully open. */
  reveal: number;
  /** 0 → 1 as a panel opens, receding the whole assembly. */
  dim: number;
  /** 0 → 1 bloom as the core arrives at the hub. */
  shine: number;
  /**
   * 0 → 1 as the core settles into the hub. Unlike `shine` (a transient
   * flash) this is sustained, so the landed core stays lit regardless of
   * where the cursor is.
   */
  landed: number;
}

const shellVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const shellFragment = /* glsl */ `
  uniform float uReveal;
  uniform float uFade;
  uniform vec3 uColor;
  uniform vec3 uEdge;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  void main() {
    // Panels fall away one by one as the reveal climbs.
    float n = hash(floor(vPosition * 6.0));
    float threshold = uReveal * 1.15;
    if (n < threshold) discard;

    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);

    float edge = smoothstep(threshold, threshold + 0.08, n);
    vec3 col = mix(uEdge, uColor, edge);
    col += fresnel * 0.6;

    float alpha = (1.0 - uReveal * 0.6) * (0.35 + edge * 0.65) * uFade;
    gl_FragColor = vec4(col, alpha);
  }
`;

function Shell({ rig }: { rig: React.MutableRefObject<RigState> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uReveal: { value: 0 },
      uFade: { value: 1 },
      uColor: { value: new THREE.Color('#5b8bff') },
      uEdge: { value: new THREE.Color('#2f6bff') },
    }),
    [],
  );

  useFrame((_state, delta) => {
    const { reveal, dim } = rig.current;
    if (matRef.current) {
      matRef.current.uniforms.uReveal.value = reveal;
      matRef.current.uniforms.uFade.value = 1 - dim * 0.8;
    }
    if (meshRef.current) {
      // Fully dissolved: stop rendering rather than discarding every fragment.
      meshRef.current.visible = reveal < 0.995;
      meshRef.current.rotation.y += delta * 0.12;
      meshRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.7, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={shellVertex}
        fragmentShader={shellFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const photoVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const photoFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uReveal;
  uniform float uTime;
  uniform float uOffset;
  uniform vec3 uTint;
  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(uMap, vUv);

    // Desaturate, then push it into the accent hue: a projected hologram
    // rather than a photograph pasted into the scene.
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 holo = mix(vec3(lum), uTint * (0.35 + lum * 1.5), 0.72);

    // Fine scanlines + a slow sweeping band.
    float scan = 0.88 + 0.12 * sin(vUv.y * 320.0 + uTime * 2.2);
    holo *= scan;
    float sweep = smoothstep(0.03, 0.0, abs(fract(vUv.y * 0.5 - uTime * 0.08 + uOffset) - 0.5) - 0.47);
    holo += uTint * sweep * 0.5;

    // Occasional interlace flicker, desynced per card.
    holo *= 0.94 + 0.06 * sin(uTime * 24.0 + uOffset * 40.0);

    // Feather the rectangle away so each frame dissolves into the particles
    // instead of ending on a hard edge.
    vec2 d = abs(vUv - 0.5) * 2.0;
    float frame = (1.0 - smoothstep(0.62, 1.0, d.x)) * (1.0 - smoothstep(0.62, 1.0, d.y));

    // Cards resolve in sequence as the shell opens.
    float gate = smoothstep(0.2 + uOffset, 0.8 + uOffset, uReveal);

    float alpha = tex.a * gate * frame * 0.9;
    gl_FragColor = vec4(holo, alpha);
  }
`;

interface Photo {
  texture: THREE.Texture;
  aspect: number;
}

/**
 * Loads every gallery image, skipping any that are missing so a partial set
 * still renders. Results stream in as each file arrives.
 */
function useGallery(urls: string[]): Photo[] {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    if (urls.length === 0) return;
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    const loaded: Photo[] = [];

    urls.forEach((url) => {
      loader.load(
        url,
        (tex) => {
          if (cancelled) {
            tex.dispose();
            return;
          }
          tex.colorSpace = THREE.SRGBColorSpace;
          const img = tex.image as
            | { width?: number; height?: number }
            | undefined;
          const aspect =
            img?.width && img?.height ? img.width / img.height : 0.75;
          loaded.push({ texture: tex, aspect });
          setPhotos([...loaded]);
        },
        undefined,
        () => {
          // Missing file — skip it.
        },
      );
    });

    return () => {
      cancelled = true;
    };
  }, [urls]);

  return photos;
}

/** Base orbit radius for the photo cards. */
const PHOTO_RADIUS = 1.55;

/** Deterministic 0→1 value per index, so layout is stable across renders. */
function hashUnit(n: number): number {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

/** Evenly spaced points on a sphere, so cards never clump. */
function spherePoint(i: number, total: number, radius: number) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / total);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.sin(phi) * Math.sin(theta),
    radius * Math.cos(phi),
  );
}

function PhotoCard({
  photo,
  position,
  offset,
  rig,
}: {
  photo: Photo;
  position: THREE.Vector3;
  offset: number;
  rig: React.MutableRefObject<RigState>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uMap: { value: photo.texture },
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uOffset: { value: offset },
      uTint: { value: new THREE.Color('#7ea8ff') },
    }),
    [photo.texture, offset],
  );

  useFrame((state) => {
    const { reveal, dim } = rig.current;
    const gate = reveal * (1 - dim);

    if (matRef.current) {
      matRef.current.uniforms.uReveal.value = gate;
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (meshRef.current) {
      meshRef.current.visible = gate > 0.02;
      // Face the viewer regardless of how the core has rotated, so the photos
      // stay readable while their positions orbit.
      meshRef.current.lookAt(state.camera.position);
    }
  });

  const height = 0.62;
  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[height * photo.aspect, height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={photoVertex}
        fragmentShader={photoFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/** An album of photos suspended throughout the core. */
function PhotoCloud({ rig }: { rig: React.MutableRefObject<RigState> }) {
  const urls = useMemo(() => {
    const gallery = profile.gallery ?? [];
    if (gallery.length > 0) return gallery;
    return profile.portrait ? [profile.portrait] : [];
  }, []);

  const photos = useGallery(urls);

  const layout = useMemo(() => {
    const count = photos.length;
    const total = Math.max(count, 3);
    // Widen the orbit as the album grows so cards keep their spacing.
    const radius = PHOTO_RADIUS * Math.max(1, Math.sqrt(count / 8));

    return photos.map((_, i) => ({
      // Jitter the radius so cards sit at varied depths instead of on one
      // shell, which keeps them from stacking up when projected to screen.
      position: spherePoint(i, total, radius + (hashUnit(i) - 0.5) * 0.3),
      offset: (i / Math.max(count, 1)) * 0.15,
    }));
  }, [photos.length]);

  if (photos.length === 0) return null;

  return (
    <group>
      {photos.map((photo, i) => (
        <PhotoCard
          key={i}
          photo={photo}
          position={layout[i].position}
          offset={layout[i].offset}
          rig={rig}
        />
      ))}
    </group>
  );
}

function Core({ rig }: { rig: React.MutableRefObject<RigState> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const count = 1200;

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const base = new THREE.Color('#2f6bff');
    const alt = new THREE.Color('#a5c4ff');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 1.25 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      const c = base.clone().lerp(alt, Math.random());
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    const { reveal, dim, shine, landed } = rig.current;
    // Ease proximity so the cloud opens out faster as you close in.
    const prox = reveal * reveal * (3 - 2 * reveal);

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.18;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
      const spread = 0.8 + prox * 0.9 + shine * 0.45;
      pointsRef.current.scale.setScalar(spread * pulse);
    }
    if (matRef.current) {
      // Cursor proximity brightens it, and the landed floor keeps it lit at
      // the hub even with the cursor elsewhere.
      const lit = Math.min(1, 0.4 + reveal * 0.5 + landed * 0.35);
      matRef.current.opacity = lit * (1 - dim * 0.75);
      matRef.current.size = 0.03 + reveal * 0.02 + landed * 0.012 + shine * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.03}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  uniform float uStrength;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float glow = pow(1.0 - clamp(d, 0.0, 1.0), 3.0);
    gl_FragColor = vec4(uColor, glow * uStrength);
  }
`;

/** Persistent halo that keeps the core reading as a light source. */
function Glow({ rig }: { rig: React.MutableRefObject<RigState> }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uStrength: { value: 0.3 },
      uColor: { value: new THREE.Color('#4f86ff') },
    }),
    [],
  );

  useFrame((state) => {
    const { reveal, dim, shine, landed } = rig.current;
    const breathe = 0.9 + Math.sin(state.clock.elapsedTime * 1.1) * 0.1;
    if (matRef.current) {
      // Base + cursor proximity + a sustained floor once landed, plus the
      // transient flash on arrival.
      const base = 0.22 + reveal * 0.34 + landed * 0.5;
      matRef.current.uniforms.uStrength.value =
        base * breathe * (1 - dim * 0.8) + shine * 0.5;
    }
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + landed * 0.35 + shine * 0.9);
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[7, 7]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={glowVertex}
        fragmentShader={glowFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function RevealRig() {
  const rig = useRef<RigState>({ reveal: 0, dim: 0, shine: 0, landed: 0 });
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const s = revealProgress.scroll;
    const x = revealProgress.pointerX;
    const y = revealProgress.pointerY;

    // Smoothstep the journey so it settles rather than arriving linearly.
    const t = s * s * (3 - 2 * s);
    const posY = START_Y + (HUB_Y - START_Y) * t;
    const scale = START_SCALE + (HUB_SCALE - START_SCALE) * t;

    // Bloom as it lands, then settle — the flash fades but does not go dark.
    const up = Math.max(0, Math.min(1, (s - 0.78) / 0.13));
    const down = Math.max(0, Math.min(1, (s - 0.93) / 0.07));
    rig.current.shine = up * (1 - down * 0.7);

    // Sustained glow once settled, independent of the cursor.
    const l = Math.max(0, Math.min(1, (s - 0.8) / 0.2));
    rig.current.landed = l * l * (3 - 2 * l);

    // Proximity is measured to wherever the core currently is, so the reveal
    // keeps working as it descends.
    const coreClipY = posY / HALF_HEIGHT;
    const dist = Math.hypot(x, y - coreClipY);
    const target = Math.max(0, 1 - dist / 0.9);

    rig.current.reveal += (target - rig.current.reveal) * 0.08;
    rig.current.dim += (revealProgress.dim - rig.current.dim) * 0.1;

    if (groupRef.current) {
      const g = groupRef.current;
      const { dim } = rig.current;

      g.position.y = posY - dim * 0.35;
      g.scale.setScalar(scale * (1 - dim * 0.12));

      // Parallax eases out as it settles into the hub, and while a panel is up.
      const damp = (1 - t * 0.6) * (1 - dim);
      g.rotation.y = x * 0.3 * damp;
      g.rotation.x = -y * 0.15 * damp;
    }
  });

  return (
    <group ref={groupRef} position={[0, START_Y, 0]} scale={START_SCALE}>
      <Glow rig={rig} />
      <Core rig={rig} />
      <PhotoCloud rig={rig} />
      <Shell rig={rig} />
    </group>
  );
}

function StaticFallback() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute left-1/2 h-72 w-72 -translate-x-1/2 rounded-full
                   bg-accent/25 blur-3xl md:h-96 md:w-96"
        style={{ bottom: '-8rem' }}
      />
    </div>
  );
}

export default function RevealScene() {
  const reduced = useReducedMotion();

  if (reduced) return <StaticFallback />;

  return (
    <div className="relative h-full w-full">
      <Canvas
        aria-hidden
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} intensity={1.4} color="#5b8bff" />
        <Suspense fallback={null}>
          <RevealRig />
        </Suspense>
      </Canvas>
    </div>
  );
}
