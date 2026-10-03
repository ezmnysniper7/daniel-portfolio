'use client';

import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/data/dictionary';

type Topic = 'project' | 'job' | 'other';
type Status = 'idle' | 'sending' | 'sent' | 'error' | 'limited';

const field =
  'w-full border-0 border-b border-line bg-transparent px-0 py-3 text-base text-bone outline-none transition-colors placeholder:text-bone-3 focus:border-signal focus:ring-0';

export function ContactForm({ copy, locale, email }: { copy: Dictionary['form']; locale: string; email: string }) {
  const [topic, setTopic] = useState<Topic>('project');
  const [status, setStatus] = useState<Status>('idle');
  const openedAt = useRef(0);

  useEffect(() => {
    openedAt.current = Date.now();
    // Buttons elsewhere on the page (e.g. "Tell me about your project") can preselect the topic.
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-contact-topic]');
      const next = el?.dataset.contactTopic as Topic | undefined;
      if (next) setTopic(next);
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
          message: data.get('message'),
          website: data.get('website'),
          topic,
          locale,
          submittedAt: openedAt.current,
        }),
      });
      if (res.ok) {
        setStatus('sent');
        form.reset();
      } else {
        setStatus(res.status === 429 ? 'limited' : 'error');
      }
    } catch {
      setStatus('error');
    }
  }

  const topics: Topic[] = ['project', 'job', 'other'];

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Honeypot: invisible to people, tempting to bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <fieldset>
        <legend className="text-sm text-bone-2">{copy.topic}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {topics.map((t) => (
            <label
              key={t}
              className={`inline-flex min-h-[40px] cursor-pointer items-center rounded-full border px-4 text-sm transition-colors ${
                topic === t ? 'border-bone bg-bone text-ink' : 'border-line text-bone-2 hover:border-bone-3 hover:text-bone'
              }`}
            >
              <input
                type="radio"
                name="topic"
                value={t}
                checked={topic === t}
                onChange={() => setTopic(t)}
                className="sr-only"
              />
              {copy.topics[t]}
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
        </p>
      </div>
    </form>
  );
}
