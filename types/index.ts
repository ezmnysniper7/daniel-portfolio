// Data Models for Daniel Chen Portfolio

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  role?: string;
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

export interface Skill {
  category: string;
  skills: SkillItem[];
}

export interface SkillItem {
  name: string;
  level?: 'expert' | 'proficient' | 'familiar';
  iconUrl?: string;
  yearsOfExperience?: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured?: boolean;
  readingTimeMinutes?: number;
  coverImage?: string;
}

export interface SiteMetadata {
  name: string;
  title: string;
  tagline: string;
  description: string;
  email: string;
  phone?: string;
  location?: string;
  availableForWork?: boolean;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  resumeUrl?: string;
  portfolioRepo?: string;
}
