import { projects } from '@/data/projects';

export default function Projects() {
  // Featured work leads; the rest follows in order.
  const ordered = [...projects].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  );

  return (
    <>
      <ol>
        {ordered.map((p, i) => (
          <li
            key={p.id}
            className="group border-t border-ink/10 transition-colors duration-500 hover:border-accent/50"
          >
            <article className="grid gap-x-10 gap-y-5 py-8 md:grid-cols-[3rem_1fr_auto]">
              <span className="meta-line pt-2 transition-colors duration-300 group-hover:text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div>
                <h3 className="text-xl font-medium tracking-tight text-ink md:text-2xl">
                  {p.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-soft">{p.summary}</p>
                {p.tags.length > 0 && (
                  <p className="meta-line mt-5">{p.tags.join('  ·  ')}</p>
                )}
              </div>

              {(p.links?.repo || p.links?.demo) && (
                <div className="flex gap-6 md:flex-col md:items-end md:gap-3 md:pt-2">
                  {p.links?.repo && (
                    <a
                      href={p.links.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="link-action group/link"
                    >
                      Code
                      <span className="link-action-arrow" aria-hidden>
                        ↗
                      </span>
                    </a>
                  )}
                  {p.links?.demo && (
                    <a
                      href={p.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="link-action group/link"
                    >
                      Live
                      <span className="link-action-arrow" aria-hidden>
                        ↗
                      </span>
                    </a>
                  )}
                </div>
              )}
            </article>
          </li>
        ))}
      </ol>
      <div className="border-t border-ink/10" />
    </>
  );
}
