export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  role?: string;
  company?: string;
  kind?: 'side' | 'work';
  status?: string;
  responsibilities?: string[];
  highlights: string[];
  startDate?: string;
  endDate?: string | 'Present';
  githubUrl?: string;
  demoUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  tags?: string[];
  category?: 'professional' | 'personal' | 'open-source';
  metrics?: string[];
  /** Not shown anywhere on the site (e.g. not launched yet). */
  hidden?: boolean;
  /** 'production': shipped and running. 'prototype': my own build that has never launched. Unset: client or employer work with no live claim. */
  evidence?: 'production' | 'prototype';
  /** The longer, structured write-up used for the main case studies. */
  caseStudy?: CaseStudy;
  /** Set by data/projects.ts: the job it was built in, and whose it is. */
  experienceId?: string;
  ownership?: 'side' | 'job' | 'freelance';
}

export interface CaseStudy {
  problem: string;
  complexity: string[];
  /** The shape of the system, in plain words. */
  architecture: string;
  decisions: { title: string; body: string }[];
  /** Only things that can be checked. */
  outcomes: string[];
  /** What a prospective client should take from it. */
  demonstrates: string;
}

export interface Experience {
  id: string;
  company: string;
  companyUrl?: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  responsibilities: string[];
  achievements?: string[];
  techStack: string[];
  type?: 'full-time' | 'contract' | 'internship' | 'freelance' | 'side';
}

export interface SiteMetadata {
  name: string;
  nameZh: string;
  title: string;
  email: string;
  /** WhatsApp number in international format, shown on the site. */
  whatsapp: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
  };
  baseUrl: string;
}
