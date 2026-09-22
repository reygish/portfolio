import { skills } from '@/data/skills';

export default function Skills() {
  return (
    <>
      <dl>
        {skills.map((group) => (
          <div
            key={group.category}
            className="grid gap-x-10 gap-y-3 border-t border-ink/10 py-6 md:grid-cols-[12rem_1fr]"
          >
            <dt className="meta-line pt-1">{group.category}</dt>
            <dd className="flex flex-wrap gap-x-6 gap-y-2">
              {group.items.map((item) => (
                <span key={item} className="text-ink-soft">
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      <div className="border-t border-ink/10" />
    </>
  );
}
