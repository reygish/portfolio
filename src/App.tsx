import { useEffect, useState } from 'react';
import BootLoader from '@/components/layout/BootLoader';
import Hud from '@/components/layout/Hud';
import Modal from '@/components/layout/Modal';
import { type SectionId } from '@/components/layout/NodeNav';
import SceneBackground from '@/three/SceneBackground';
import { revealProgress } from '@/three/revealProgress';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useScrollStage } from '@/hooks/useScrollStage';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';

const PANELS: {
  id: SectionId;
  eyebrow: string;
  title: string;
  body: React.ReactNode;
}[] = [
  { id: 'about', eyebrow: 'About', title: 'A little about me', body: <About /> },
  {
    id: 'experience',
    eyebrow: 'Experience',
    title: "Where I've worked",
    body: <Experience />,
  },
  {
    id: 'projects',
    eyebrow: 'Selected work',
    title: "Things I've built",
    body: <Projects />,
  },
  { id: 'skills', eyebrow: 'Skills', title: 'Tools I work with', body: <Skills /> },
  { id: 'contact', eyebrow: 'Contact', title: "Let's talk", body: <Contact /> },
];

export default function App() {
  const reduced = useReducedMotion();
  const animated = !reduced;

  const [booted, setBooted] = useState(false);
  const [open, setOpen] = useState<SectionId | null>(null);
  const atHub = useScrollStage(animated);

  useEffect(() => {
    revealProgress.dim = open ? 1 : 0;
  }, [open]);

  return (
    <>
      <BootLoader onDone={() => setBooted(true)} />

      <SceneBackground />

      <Hud
        atHub={atHub}
        animated={animated}
        visible={booted}
        onSelect={setOpen}
      />

      {/*
        Scroll runway. Nothing renders here — it exists purely to give the
        sequence distance to play out. Everything visible is fixed above it.
      */}
      {animated && <div aria-hidden className="h-[260vh]" />}

      {PANELS.map((panel) => (
        <Modal
          key={panel.id}
          open={open === panel.id}
          onClose={() => setOpen(null)}
          marker={panel.id}
          eyebrow={panel.eyebrow}
          title={panel.title}
        >
          {panel.body}
        </Modal>
      ))}
    </>
  );
}
