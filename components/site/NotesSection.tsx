import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { formatNoteDate, type Note } from '@/data/notes';

/** A quiet list of article titles at the end of the home page: crawlable links, small footprint. */
export function NotesSection({ locale, dict, notes }: { locale: string; dict: Dictionary; notes: Note[] }) {
  const copy = dict.notes;
  return (
    <section id="notes" className="pb-20 pt-8 md:pb-28">
      <div className="gutter mx-auto grid max-w-page gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow">{copy.label}</p>
          <p className="mt-3 max-w-xs text-[0.95rem] leading-relaxed text-bone-2">{copy.intro}</p>
          <Link href={`/${locale}/notes`} className="link-underline mt-4 inline-block py-2 text-sm text-bone">
            {copy.all} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {notes.map((n) => (
            <li key={n.slug}>
              <Link
                href={`/${locale}/notes/${n.slug}`}
                className="group flex items-baseline gap-4 border-b border-line py-3.5 text-[0.95rem] transition-colors hover:text-signal"
              >
                <span className="w-24 shrink-0 font-mono text-[0.75rem] text-bone-3">{formatNoteDate(n.date, locale)}</span>
                <span className="flex-1 text-bone-2 transition-colors group-hover:text-signal">{n.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
