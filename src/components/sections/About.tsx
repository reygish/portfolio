import { profile } from '@/data/profile';

export default function About() {
  const { education, certifications } = profile;

  return (
    <div className="grid gap-x-10 gap-y-10 md:grid-cols-[1fr_18rem]">
      <div>
        <p className="text-lg leading-relaxed text-ink-soft">{profile.bio}</p>

        {profile.cv && (
          <a
            href={profile.cv}
            target="_blank"
            rel="noreferrer"
            className="btn-outline group/link mt-8"
          >
            Download CV
            <span className="link-action-arrow" aria-hidden>
              ↗
            </span>
          </a>
        )}
      </div>

      <dl className="space-y-6">
        {education && (
          <div className="border-t border-ink/10 pt-4">
            <dt className="meta-line">Education</dt>
            <dd className="mt-2 text-ink">{education.institution}</dd>
            <dd className="mt-1 text-sm text-ink-soft">
              {education.degree}
              {education.focus ? ` — ${education.focus}` : ''}
            </dd>
            <dd className="meta-line mt-2">
              {[education.gpa && `GPA ${education.gpa}`, education.period]
                .filter(Boolean)
                .join('  ·  ')}
            </dd>
          </div>
        )}

        {certifications && certifications.length > 0 && (
          <div className="border-t border-ink/10 pt-4">
            <dt className="meta-line">Certification</dt>
            {certifications.map((c) => (
              <dd key={c} className="mt-2 text-sm text-ink-soft">
                {c}
              </dd>
            ))}
          </div>
        )}

        {profile.location && (
          <div className="border-t border-ink/10 pt-4">
            <dt className="meta-line">Based in</dt>
            <dd className="mt-2 text-sm text-ink-soft">{profile.location}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}
