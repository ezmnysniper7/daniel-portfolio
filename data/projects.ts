import { Project } from '@/types';
import { projectsEn } from './projects.en';
import { projectsZhCN } from './projects.zh-CN';

// The cards on the landing page, in order. Everything else goes to the archive.
export const SELECTED_SLUGS = [
  'solvemy',
  'tradersflow',
  'dan',
  'octopus-payment-microservice',
  'ocean-park-ticketing',
  'hktb-ai-trip-planner',
];

const companyBySlug: Record<string, { en: string; zh: string }> = {
  'octopus-payment-microservice': { en: 'Appnovation', zh: 'Appnovation' },
  'ocean-park-ticketing': { en: 'Appnovation', zh: 'Appnovation' },
  'echealth-booking-system': { en: 'Appnovation', zh: 'Appnovation' },
  'hktb-ai-trip-planner': { en: 'Appnovation', zh: 'Appnovation' },
  'octopus-mobile-campaign': { en: 'Appnovation', zh: 'Appnovation' },
  'ddc-recipes-platform': { en: 'Appnovation', zh: 'Appnovation' },
  'ocl-loyalty-webapp': { en: 'Appnovation', zh: 'Appnovation' },
  'tencent-ams-props-warehouse': { en: 'Tencent', zh: '腾讯' },
  'tencent-ams-paas-platform': { en: 'Tencent', zh: '腾讯' },
  'tencent-ams-points-system': { en: 'Tencent', zh: '腾讯' },
  'tencent-ams-operations-portal': { en: 'Tencent', zh: '腾讯' },
  'tencent-ams-monitoring': { en: 'Tencent', zh: '腾讯' },
  'tencent-ams-i18n-system': { en: 'Tencent', zh: '腾讯' },
  'ufootball-platform': { en: 'Corebase', zh: 'Corebase' },
  'ticketing-report-optimization': { en: 'Corebase', zh: 'Corebase' },
  'corebase-company-website': { en: 'Corebase', zh: 'Corebase' },
  'healthcare-sdks': { en: 'Corebase', zh: 'Corebase' },
};

function withCompany(projects: Project[], locale: string): Project[] {
  return projects.map((p) => {
    const company = companyBySlug[p.slug];
    if (p.company || !company) return p;
    return { ...p, company: locale === 'zh-CN' ? company.zh : company.en, kind: 'work' };
  });
}

const byLocale = {
  en: withCompany(projectsEn, 'en'),
  'zh-CN': withCompany(projectsZhCN, 'zh-CN'),
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

export function getArchiveProjects(locale: string): Project[] {
  return getProjects(locale)
    .filter((p) => !SELECTED_SLUGS.includes(p.slug))
    .sort((a, b) => (b.startDate ?? '').localeCompare(a.startDate ?? ''));
}

export const allSlugs = projectsEn.map((p) => p.slug);
