import { useState, type FormEvent, type ReactNode } from 'react';
import { profile } from '@/data/profile';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [errorMsg, setErrorMsg] = useState('');

  const validate = (data: {
    name: string;
    email: string;
    message: string;
  }): Errors => {
    const next: Errors = {};
    if (!data.name.trim()) next.name = 'Please enter your name.';
    if (!EMAIL_RE.test(data.email)) next.email = 'Enter a valid email address.';
    if (data.message.trim().length < 10)
      next.message = 'Message should be at least 10 characters.';
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const data = {
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      message: String(fd.get('message') ?? ''),
      // Honeypot field — bots fill this, humans don't see it.
      company: String(fd.get('company') ?? ''),
    };

    const validation = validate(data);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    // Silently succeed if the honeypot is filled (likely a bot).
    if (data.company) {
      setStatus('success');
      form.reset();
      return;
    }

    setStatus('submitting');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div className="grid gap-x-10 gap-y-10 md:grid-cols-2">
      <div>
        <p className="text-lg leading-relaxed text-ink-soft">
          Have an opportunity, a question, or just want to say hi? Send a message
          and I&apos;ll get back to you.
        </p>

        <dl className="mt-8 space-y-5">
          <div className="border-t border-ink/10 pt-4">
            <dt className="meta-line">Email</dt>
            <dd className="mt-2">
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-accent-soft transition-colors duration-300 hover:text-ink"
              >
                {profile.email}
              </a>
            </dd>
          </div>
          <div className="border-t border-ink/10 pt-4">
            <dt className="meta-line">Elsewhere</dt>
            <dd className="mt-3 flex flex-wrap gap-6">
              {profile.socials.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="link-action group/link"
                >
                  {s.label}
                  <span className="link-action-arrow" aria-hidden>
                    ↗
                  </span>
                </a>
              ))}
            </dd>
          </div>
        </dl>
      </div>

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {/* Honeypot (hidden from users) */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />

        <Field label="Name" error={errors.name}>
          <input
            name="name"
            type="text"
            autoComplete="name"
            className={inputClass(!!errors.name)}
          />
        </Field>

        <Field label="Email" error={errors.email}>
          <input
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field label="Message" error={errors.message}>
          <textarea
            name="message"
            rows={5}
            className={inputClass(!!errors.message) + ' resize-none'}
          />
        </Field>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="btn-solid disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </button>

        <div aria-live="polite" className="min-h-[1.25rem] text-sm">
          {status === 'success' && (
            <p className="text-green-400">Thanks! Your message has been sent.</p>
          )}
          {status === 'error' && (
            <p className="text-red-400">
              Couldn&apos;t send: {errorMsg}. You can email me directly instead.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="meta-line mb-2 block">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean): string {
  return [
    'w-full border bg-base-raised px-4 py-3.5 text-sm text-ink outline-none transition-colors duration-300',
    'focus:border-accent',
    hasError ? 'border-red-500/60' : 'border-ink/15',
  ].join(' ');
}
