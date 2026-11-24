import Link from 'next/link';
import type { Dictionary } from '@/data/dictionary';
import { formatNoteDate, type Note } from '@/data/notes';
import { TraceSection } from './Trace';

/** Latest article titles near the end of the home page: crawlable links, small footprint. */
export function NotesSection({ locale, dict, notes }: { locale: string; dict: Dictionary; notes: Note[] }) {
  const copy = dict.notes;
  return (
    <TraceSection id="notes" title={copy.label} link={{ href: `/${locale}/notes`, label: copy.all }}>
      <ul className="border-t border-line">
        {notes.map((n) => (
          <li key={n.slug} className="border-b border-line">
            <Link
              href={`/${locale}/notes/${n.slug}`}
              className="flex flex-col gap-x-10 gap-y-1 py-4 text-[1.05rem] text-bone-2 transition-colors duration-300 hover:text-bone sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span>{n.title}</span>
              <span className="shrink-0 text-sm tabular-nums text-bone-3">{formatNoteDate(n.date, locale)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </TraceSection>
  );
}
