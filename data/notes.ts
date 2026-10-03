import { notesEn } from './notes.en';
import { notesZhCN } from './notes.zh-CN';

export type NoteBlock = { h2: string } | { p: string } | { list: string[] };

export type Note = {
  slug: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  minutes: number;
  /** The service page this article supports. */
  service: string;
  tags: string[];
  title: string;
  description: string;
  body: NoteBlock[];
};

export function getNotes(locale: string): Note[] {
  return locale === 'zh-CN' ? notesZhCN : notesEn;
}

export const noteSlugs = notesEn.map((n) => n.slug);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatNoteDate(iso: string, locale: string) {
  const [y, m, d] = iso.split('-');
  return locale === 'zh-CN' ? `${y}.${m}.${d}` : `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
