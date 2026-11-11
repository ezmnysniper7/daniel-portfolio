/**
 * Service landing pages. Each one targets what a client would actually search for,
 * and every "proof" line points at real, published work.
 */
import { servicesEn } from './services.en';
import { servicesZhCN } from './services.zh-CN';

export type ServiceProof = {
  text: string;
  /** Case study this line links to. */
  slug?: string;
  /** Shown instead of the case study title when there is no slug. */
  label?: string;
};

export type Service = {
  slug: string;
  /** Primary services lead the site; secondary ones stay findable without diluting it. */
  tier: 'primary' | 'secondary';
  title: string;
  /** Page heading, when it should say more than the list title. */
  headline?: string;
  /** Who it is for, one line. */
  audience?: string;
  short: string;
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  intro: string;
  /** Heading for the offerings list, e.g. "Delivered in production". */
  offeringsLabel?: string;
  offerings: { title: string; body: string }[];
  /**
   * Work I can design and build but have not delivered as a finished product.
   * Kept apart from offerings on purpose, with a caveat about what must be proven first.
   */
  capability?: { title: string; intro: string; items: { title: string; body: string }[]; caveat: string };
  proof: ServiceProof[];
  faqs: { q: string; a: string }[];
};

export function getServices(locale: string): Service[] {
  return locale === 'zh-CN' ? servicesZhCN : servicesEn;
}

export const serviceSlugs = servicesEn.map((s) => s.slug);
export const primaryServiceSlugs = servicesEn.filter((s) => s.tier === 'primary').map((s) => s.slug);

/** The service a case study is evidence for, used for "need something like this?" links. */
export function serviceForProject(projectSlug: string): string {
  if (projectSlug === 'tradersflow') return 'mt5-manager-api-developer';
  if (projectSlug === 'cfi-broker-payments-crypto-backend') return 'trading-platform-engineering';
  if (['octopus-payment-microservice', 'ocean-park-ticketing'].includes(projectSlug)) return 'payment-integration';
  if (projectSlug === 'solvemy') return 'fintech-technical-partner';
  if (projectSlug === 'healthcare-sdks') return 'mobile-app-development';
  if (projectSlug.startsWith('tencent-') || projectSlug === 'ticketing-report-optimization') return 'backend-development';
  return 'web-development';
}
