import { experience } from '@/data/experience';

export default function Experience() {
  return (
    <>
      <ol>
        {experience.map((item) => (
          <li key={item.id} className="border-t border-ink/10">
            <article className="grid gap-x-10 gap-y-4 py-8 md:grid-cols-[11rem_1fr]">
              <p className="meta-line pt-1.5">{item.period}</p>

              <div>
                <h3 className="text-xl font-medium tracking-tight text-ink">
                  {item.role}
                </h3>
                <p className="mt-1 text-ink-faint">{item.organization}</p>

                <p className="mt-4 leading-relaxed text-ink-soft">{item.summary}</p>

                {item.highlights.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {item.highlights.map((h, i) => (
                      <li
                        key={i}
                        className="relative pl-5 text-sm leading-relaxed text-ink-soft
                                   before:absolute before:left-0 before:top-[0.7em]
                                   before:h-px before:w-2.5 before:bg-accent/60"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}

                {item.tags && item.tags.length > 0 && (
                  <p className="meta-line mt-6">{item.tags.join('  ·  ')}</p>
                )}
              </div>
            </article>
          </li>
        ))}
      </ol>
      <div className="border-t border-ink/10" />
    </>
  );
}
