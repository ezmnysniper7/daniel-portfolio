import type { ReactNode } from 'react';
import Link from 'next/link';
import type { NoteBlock } from '@/data/notes';
import { Diagram } from './Diagrams';

/**
 * Two inline marks only: `code` in backticks and [label](/path) links.
 * A leading slash gets the locale prefix, so articles never hard-code one.
 */
export function inline(text: string, locale: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1] !== undefined) {
      parts.push(
        <code key={match.index} className="note-code">
          {match[1]}
        </code>
      );
    } else {
      const href = match[3];
      const internal = href.startsWith('/');
      parts.push(
        internal ? (
          <Link key={match.index} href={`/${locale}${href}`} className="note-link">
            {match[2]}
          </Link>
        ) : (
          <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="note-link">
            {match[2]}
          </a>
        )
      );
    }
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const dash = <span className="mt-[0.85em] h-px w-4 shrink-0 bg-signal" aria-hidden="true" />;

export function NoteBody({ blocks, locale }: { blocks: NoteBlock[]; locale: string }) {
  return (
    <div className="note-body mt-12 text-[1.075rem] leading-[1.8] text-bone-2">
      {blocks.map((block, n) => {
        if ('h2' in block)
          return (
            <h2 key={n} className="mt-14 max-w-[68ch] font-display text-[clamp(1.45rem,2.2vw,1.9rem)] leading-snug text-bone">
              {block.h2}
            </h2>
          );
        if ('h3' in block)
          return (
            <h3 key={n} className="mt-9 max-w-[68ch] font-display text-[clamp(1.2rem,1.6vw,1.4rem)] leading-snug text-bone">
              {block.h3}
            </h3>
          );
        if ('list' in block)
          return (
            <ul key={n} className="mt-5 max-w-[68ch] space-y-3">
              {block.list.map((item) => (
                <li key={item} className="flex gap-4">
                  {dash}
                  <span>{inline(item, locale)}</span>
                </li>
              ))}
            </ul>
          );
        if ('steps' in block)
          return (
            <ol key={n} className="mt-5 max-w-[68ch] space-y-3">
              {block.steps.map((item, i) => (
                <li key={item} className="flex gap-4">
                  <span className="mt-[0.2em] w-6 shrink-0 font-mono text-[0.8rem] text-signal">{String(i + 1).padStart(2, '0')}</span>
                  <span>{inline(item, locale)}</span>
                </li>
              ))}
            </ol>
          );
        if ('code' in block)
          return (
            <figure key={n} className="mt-7 max-w-[86ch]">
              <pre className="note-pre" tabIndex={0}>
                <code data-lang={block.lang}>{block.code}</code>
              </pre>
              <figcaption className="mt-2.5 flex flex-wrap gap-x-3 text-[0.85rem] leading-relaxed text-bone-3">
                <span className="font-mono uppercase tracking-[0.1em]">{block.lang}</span>
                {block.caption ? <span>{inline(block.caption, locale)}</span> : null}
              </figcaption>
            </figure>
          );
        if ('table' in block)
          return (
            <figure key={n} className="mt-7 max-w-[86ch]">
              <div className="note-table-wrap" tabIndex={0}>
                <table className="note-table">
                  <thead>
                    <tr>
                      {block.table.head.map((h, i) => (
                        <th key={i} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.table.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) =>
                          c === 0 ? (
                            <th key={c} scope="row">
                              {inline(cell, locale)}
                            </th>
                          ) : (
                            <td key={c}>{inline(cell, locale)}</td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {block.caption ? <figcaption className="mt-2.5 text-[0.85rem] leading-relaxed text-bone-3">{inline(block.caption, locale)}</figcaption> : null}
            </figure>
          );
        if ('callout' in block)
          return (
            <aside key={n} className="mt-7 max-w-[68ch] rounded-[1rem] border border-dashed border-signal/50 bg-signal/[0.04] p-5 md:p-6">
              {block.label ? <p className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-signal">{block.label}</p> : null}
              <p className={`text-bone ${block.label ? 'mt-2' : ''}`}>{inline(block.callout, locale)}</p>
            </aside>
          );
        if ('diagram' in block)
          return (
            <figure key={n} className="mt-8 max-w-[86ch]">
              <div className="overflow-hidden rounded-[1rem] border border-line bg-ink-2/60 p-3 md:p-5">
                <Diagram id={block.diagram} label={block.caption} />
              </div>
              <figcaption className="mt-2.5 text-[0.85rem] leading-relaxed text-bone-3">{block.caption}</figcaption>
            </figure>
          );
        return (
          <p key={n} className="mt-5 max-w-[68ch] first:mt-0">
            {inline(block.p, locale)}
          </p>
        );
      })}
    </div>
  );
}
