'use client';

import { useEffect, useRef, useState } from 'react';
import type { ContactNeed, Dictionary } from '@/data/dictionary';
import { track } from '@/lib/track';

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'limited';

const NEEDS: ContactNeed[] = ['discovery', 'build', 'lead', 'role', 'other'];

// A visible box on a solid fill: the border needs 3:1 against the page, and the stars must not show through.
const field =
  'mt-2 block min-h-[48px] w-full rounded-xl border border-bone-3/60 bg-ink-2 px-4 py-3 text-base text-bone outline-none transition-colors placeholder:text-bone-3 hover:border-bone-3 focus:border-signal focus:ring-1 focus:ring-signal';

export function ContactForm({ copy, locale, email }: { copy: Dictionary['form']; locale: string; email: string }) {
  const [need, setNeed] = useState<ContactNeed>('build');
  const [status, setStatus] = useState<Status>('idle');
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Date.now();
    // Buttons elsewhere on the page (e.g. "Send me a message" on the hiring page) can preselect what the visitor needs.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-contact-need]');
      const next = el?.dataset.contactNeed as ContactNeed | undefined;
      if (next && NEEDS.includes(next)) setNeed(next);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          message: data.get('message'),
          timeline: data.get('timeline'),
          budget: data.get('budget'),
          website: data.get('website'),
          need,
          locale,
          page: window.location.pathname,
          submittedAt: openedAt.current,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        track('enquiry_submitted', { need, page: window.location.pathname });
        form.reset();
      } else {
        setStatus(res.status === 429 ? 'limited' : 'error');
      }
    } catch {
      setStatus('error');
    }
  }

  const optional = <span className="text-bone-3"> {copy.optional}</span>;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Honeypot: invisible to people, tempting to bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset>
        <legend className="text-sm text-bone-2">{copy.need}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <label
              key={n}
              className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-4 text-sm transition-colors ${
                need === n ? 'border-bone bg-bone text-ink' : 'border-bone-3/60 bg-ink-2 text-bone-2 hover:border-bone-3 hover:text-bone'
              }`}
            >
              <input type="radio" name="need" value={n} checked={need === n} onChange={() => setNeed(n)} className="sr-only" />
              {copy.needs[n]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-bone-2">{copy.name}</span>
          <input name="name" type="text" required maxLength={120} autoComplete="name" className={field} />
        </label>
        <label className="block">
          <span className="text-sm text-bone-2">{copy.email}</span>
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-bone-2">
          {copy.company}
          {optional}
        </span>
        <input name="company" type="text" maxLength={160} autoComplete="organization" className={field} />
      </label>

      <label className="block">
        <span className="text-sm text-bone-2">{copy.message}</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={4}
          placeholder={copy.messagePlaceholder}
          className={`${field} resize-none`}
        />
      </label>

      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="text-sm text-bone-2">
            {copy.timeline}
            {optional}
          </span>
          <select name="timeline" defaultValue="" className={`${field} form-select`}>
            <option value="">{copy.choose}</option>
            {copy.timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm text-bone-2">
            {copy.budget}
            {optional}
          </span>
          <select name="budget" defaultValue="" className={`${field} form-select`}>
            <option value="">{copy.choose}</option>
            {copy.budgets.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          data-magnetic
          className="group inline-flex items-center gap-3 rounded-full bg-bone px-7 py-4 font-medium text-ink transition-colors hover:bg-signal disabled:opacity-60"
        >
          {status === 'sending' ? copy.sending : copy.send}
          <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1">
            →
          </span>
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === 'sent' ? <span className="text-signal">{copy.success}</span> : null}
          {status === 'error' || status === 'limited' ? (
            <span className="text-bone-2">
              {status === 'limited' ? copy.limited : copy.error}{' '}
              <a href={`mailto:${email}`} className="link-underline text-bone">
                {email}
              </a>
            </span>
          ) : null}
          {status === 'idle' || status === 'sending' ? <span className="text-bone-3">{copy.privacy}</span> : null}
        </p>
      </div>
    </form>
  );
}
