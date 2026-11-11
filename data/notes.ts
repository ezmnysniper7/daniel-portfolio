import { notesEn } from './notes.en';
import { notesZhCN } from './notes.zh-CN';

/** Diagrams drawn in components/notes/Diagrams.tsx. */
export type DiagramId =
  | 'bbook-architecture'
  | 'mt5-access-routes'
  | 'deposit-to-mt5-flow'
  | 'investor-portal-architecture'
  | 'ledger-entries';

/**
 * Article body blocks. Text fields accept two inline marks only:
 * `code` in backticks, and [label](/path) links (a leading slash gets the locale prefix).
 */
export type NoteBlock =
  | { h2: string }
  | { h3: string }
  | { p: string }
  | { list: string[] }
  | { steps: string[] }
  | { code: string; lang: string; caption?: string }
  | { table: { head: string[]; rows: string[][] }; caption?: string }
  | { callout: string; label?: string }
  | { diagram: DiagramId; caption: string };

export type Note = {
  slug: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  /** ISO date of the last substantial edit, if any. */
  updated?: string;
  minutes: number;
  /** The service page this article supports. */
  service: string;
  /**
   * What the article rests on: 'field' is written from systems I built or ran;
   * 'design' is an architecture proposal I have not shipped as described.
   */
  basis: 'field' | 'design';
  tags: string[];
  title: string;
  description: string;
  body: NoteBlock[];
};

const newestFirst = (notes: Note[]) => [...notes].sort((a, b) => b.date.localeCompare(a.date));

const byLocale = { en: newestFirst(notesEn), 'zh-CN': newestFirst(notesZhCN) };

export function getNotes(locale: string): Note[] {
  return locale === 'zh-CN' ? byLocale['zh-CN'] : byLocale.en;
}

/** Every note exists in English; only some have a Chinese version. */
export const noteSlugs = notesEn.map((n) => n.slug);

export function getNoteSlugs(locale: string): string[] {
  return getNotes(locale).map((n) => n.slug);
}

/** The locales a note is published in, for hreflang, the sitemap and the language switch. */
export function noteLocales(slug: string): string[] {
  return (['en', 'zh-CN'] as const).filter((locale) => byLocale[locale].some((n) => n.slug === slug));
}

/**
 * Title tags for search results (English only). Article headlines are written for readers
 * and run long; these keep the tag near 60 characters without changing the headline on the page.
 */
export const noteSeoTitles: Record<string, string> = {
  'mt5-manager-api-vs-web-api': 'MT5 Manager API vs Web API for Your Back Office',
  'mt5-deposit-credit-exactly-once': 'Crediting a Payment to an MT5 Balance Exactly Once',
  'mt5-investor-portal-ib-commissions': 'Designing an MT5 Investor Portal with IB Commissions',
  'b-book-trading-platform-architecture': 'How I Would Architect a B-Book Trading Platform',
  'double-entry-ledger-fintech-startups': 'Double-Entry Ledger Design for Fintech Startups',
  'first-fintech-engineer': 'What to Look for in Your First Fintech Engineer',
  'mt5-manager-api-lessons': 'MT5 Manager API: Five Lessons from a Risk Monitor',
  'payment-webhooks-idempotency': 'Payment Webhooks That Never Double-Credit',
  'rabbitmq-deploy-order': 'Changing a RabbitMQ Message: Consumer Ships First',
  'ai-coding-assistants-verification': 'Using AI Coding Assistants Without Shipping Mistakes',
  'app-store-rules-one-codebase': 'One Flutter App, Two App Store Rulebooks',
  'prop-firm-risk-rules': 'How Prop Firms Enforce Daily Loss and Max Loss Rules',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function formatNoteDate(iso: string, locale: string) {
  const [y, m, d] = iso.split('-');
  return locale === 'zh-CN' ? `${y}.${m}.${d}` : `${Number(d)} ${MONTHS[Number(m) - 1]} ${y}`;
}
