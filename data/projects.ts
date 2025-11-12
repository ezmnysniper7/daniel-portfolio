import { Project } from '@/types';
import { projectsEn } from './projects.en';
import { projectsZhCN } from './projects.zh-CN';

// Default export for backwards compatibility
export const projects: Project[] = projectsEn;

// Get projects based on locale
export function getProjects(locale: string): Project[] {
  switch (locale) {
    case 'zh-CN':
      return projectsZhCN;
    case 'en':
    default:
      return projectsEn;
  }
}

