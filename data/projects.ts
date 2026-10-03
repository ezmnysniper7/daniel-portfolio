import { Project } from '@/types';
import { projectsEn } from './projects.en';
import { projectsZhCN } from './projects.zh-CN';
import { getExperience } from './experience';

// The cards on the landing page, in order. Every other project is listed under its job in Work history.
export const SELECTED_SLUGS = [
  'solvemy',
  'tradersflow',
  'octopus-payment-microservice',
  'ocean-park-ticketing',
  'hktb-ai-trip-planner',
];

/** Which job each project was built in (experience id). Projects not listed are Daniel's own side projects. */
const experienceBySlug: Record<string, string> = {
  tradersflow: 'tradersflow-2025',
  'octopus-payment-microservice': 'appnovation-2025',
  'ocean-park-ticketing': 'appnovation-2025',
  'echealth-booking-system': 'appnovation-2025',
  'hktb-ai-trip-planner': 'appnovation-2025',
  'octopus-mobile-campaign': 'appnovation-2025',
  'ddc-recipes-platform': 'appnovation-2025',
  'ocl-loyalty-webapp': 'appnovation-2025',
  'tencent-ams-props-warehouse': 'tencent-2024',
  'tencent-ams-paas-platform': 'tencent-2024',
  'tencent-ams-points-system': 'tencent-2024',
  'tencent-ams-operations-portal': 'tencent-2024',
  'tencent-ams-monitoring': 'tencent-2024',
  'tencent-ams-i18n-system': 'tencent-2024',
  'ufootball-platform': 'corebase-2023',
  'ticketing-report-optimization': 'corebase-2023',
  'corebase-company-website': 'corebase-2023',
  'healthcare-sdks': 'corebase-2023',
};

/** Attach the employer and make ownership explicit: my own side project, a job, or a freelance contract. */
function withOwnership(projects: Project[], locale: string): Project[] {
  const jobs = getExperience(locale);
  return projects.map((p) => {
    const job = jobs.find((e) => e.id === experienceBySlug[p.slug]);
    if (!job) return { ...p, ownership: 'side' as const, kind: 'side' as const };
    return {
      ...p,
      experienceId: job.id,
      company: job.company,
      kind: 'work' as const,
      ownership: job.type === 'freelance' ? ('freelance' as const) : ('job' as const),
    };
  });
}

const visible = (projects: Project[]) => projects.filter((p) => !p.hidden);

const byLocale = {
  en: withOwnership(visible(projectsEn), 'en'),
  'zh-CN': withOwnership(visible(projectsZhCN), 'zh-CN'),
};

export function getProjects(locale: string): Project[] {
  return locale === 'zh-CN' ? byLocale['zh-CN'] : byLocale.en;
}

export function getSelectedProjects(locale: string): Project[] {
  const all = getProjects(locale);
  return SELECTED_SLUGS.map((slug) => all.find((p) => p.slug === slug)).filter(
    (p): p is Project => Boolean(p)
  );
}

/** Projects built during one job, newest first. */
export function getProjectsForJob(locale: string, experienceId: string): Project[] {
  return getProjects(locale)
    .filter((p) => p.experienceId === experienceId)
    .sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? ''));
}

export const allSlugs = visible(projectsEn).map((p) => p.slug);
