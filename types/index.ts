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
  /** Set by data/projects.ts: the job it was built in, and whose it is. */
  experienceId?: string;
  ownership?: 'side' | 'job' | 'freelance';
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
  type?: 'full-time' | 'contract' | 'internship' | 'freelance';
}

export interface SiteMetadata {
  name: string;
  nameZh: string;
  title: string;
  email: string;
  location: string;
  social: {
    github: string;
    linkedin: string;
  };
  baseUrl: string;
}
