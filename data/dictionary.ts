import { en } from './dictionary.en';
import { zhCN } from './dictionary.zh-CN';

export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
};

/** What the contact form asks first; also the keys the API accepts. */
export type ContactNeed = 'discovery' | 'build' | 'lead' | 'role' | 'other';

export type Dictionary = {
  meta: { title: string; description: string; keywords: string[] };
  nav: {
    services: string;
    work: string;
    founders: string;
    notes: string;
    about: string;
    contact: string;
    /** The button in the header. */
    cta: string;
    switchTo: string;
  };
  hero: {
    eyebrow: string;
    lines: string[];
    sub: string;
    status: string;
    cta: string;
    cta2: string;
    /** Employers and clients the experience comes from, as plain text. */
    proofLabel: string;
    proof: string[];
  };
  /** The 3D "live system" in the hero. Flow captions follow FLOWS order in lib/system-graph.ts. */
  system: { label: string; live: string; nodes: Record<string, string>; flows: string[] };
  /** Services summary on the landing page. */
  services: { label: string; title: string; intro: string; more: string; alsoLabel: string; hireTitle: string; hireBody: string };
  /** Ways to engage, shown on the landing page and the founders page. No prices by design. */
  engagement: {
    label: string;
    title: string;
    intro: string;
    models: { title: string; tag: string; body: string }[];
    pricing: string;
    principles: string[];
  };
  servicesPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    primaryLabel: string;
    secondaryLabel: string;
    audienceLabel: string;
    processLabel: string;
    process: { title: string; body: string }[];
    offeringsLabel: string;
    capabilityLabel: string;
    capabilityNote: string;
    caveatLabel: string;
    proofLabel: string;
    notesLabel: string;
    faqLabel: string;
    faqs: { q: string; a: string }[];
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    emailSubject: string;
    otherServices: string;
  };
  workPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    featuredLabel: string;
    allLabel: string;
  };
  about: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string[];
    factsLabel: string;
    facts: { label: string; value: string }[];
    recruitersTitle: string;
    recruitersBody: string;
    recruitersLink: string;
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    emailSubject: string;
  };
  contactPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    nextLabel: string;
    next: string[];
    directLabel: string;
  };
  hire: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    bringLabel: string;
    bring: { title: string; body: string }[];
    rolesLabel: string;
    roles: string[];
    termsLabel: string;
    terms: string;
    experienceLabel: string;
    ctaTitle: string;
    ctaButton: string;
    emailSubject: string;
  };
  crumbs: { home: string };
  notes: {
    label: string;
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    all: string;
    minutes: string;
    by: string;
    updated: string;
    related: string;
    more: string;
    /** Shown on a locale's notes index when some notes exist only in another language; empty to hide. */
    moreElsewhere: string;
    /** What an article rests on: production work, or a design not yet shipped. */
    basis: { field: string; design: string };
  };
  form: {
    need: string;
    needs: Record<ContactNeed, string>;
    name: string;
    email: string;
    company: string;
    message: string;
    messagePlaceholder: string;
    timeline: string;
    timelines: string[];
    budget: string;
    budgets: string[];
    optional: string;
    choose: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    limited: string;
    privacy: string;
    direct: string;
    orEmail: string;
  };
  now: {
    label: string;
    title: string;
    intro: string;
    since: string;
    caseStudy: string;
    chapters: { kicker: string; title: string; body: string }[];
  };
  work: {
    label: string;
    title: string;
    intro: string;
    open: string;
    all: string;
    /** Ownership labels; {company} is replaced with the employer's name. */
    legend: { side: string; job: string; freelance: string; prototype: string };
    badge: { side: string; job: string; freelance: string; prototype: string };
  };
  stats: { label: string; title: string; items: Stat[] };
  method: { label: string; items: { title: string; body: string }[] };
  experience: {
    label: string;
    title: string;
    intro: string;
    glanceTitle: string;
    glanceIntro: string;
    full: string;
    present: string;
    current: string;
    projects: string;
    types: Record<string, string>;
  };
  toolbox: { label: string; groups: { name: string; items: string }[] };
  footer: {
    label: string;
    lines: [string, string];
    top: string;
    rights: string;
    servicesLabel: string;
    siteLabel: string;
    hireLink: string;
    status: string;
    city: string;
    deployed: string;
  };
  caseStudy: {
    kind: string;
    type: string;
    typeValue: { side: string; job: string; freelance: string; prototype: string };
    evidence: { production: string; prototype: string };
    backHistory: string;
    related: string;
    relatedCta: string;
    back: string;
    role: string;
    company: string;
    period: string;
    status: string;
    visit: string;
    problem: string;
    complexity: string;
    architecture: string;
    built: string;
    decisions: string;
    stories: string;
    outcomes: string;
    demonstrates: string;
    numbers: string;
    stack: string;
    next: string;
    cta: string;
  };
};

export function getDictionary(locale: string): Dictionary {
  return locale === 'zh-CN' ? zhCN : en;
}
