import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { getProjects } from '@/data/projects';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <ProjectsPageContent locale={locale} />;
}

function ProjectsPageContent({ locale }: { locale: string }) {
  const t = useTranslations('projects');
  const projects = getProjects(locale);

  return (
    <Section className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-950/10 dark:via-purple-950/5 dark:to-pink-950/10"></div>
      <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 -left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>

      <Container className="relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-700">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">{projects.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('stats.total')}</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-700">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">{projects.filter(p => p.featured).length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('stats.featured')}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 text-center border border-green-200 dark:border-green-700">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{projects.filter(p => p.category === 'professional').length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('stats.professional')}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-xl p-6 text-center border border-pink-200 dark:border-pink-700">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">{new Set(projects.flatMap(p => p.techStack)).size}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t('stats.technologies')}</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
