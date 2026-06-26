import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Reveal } from '@/components/world/Reveal';
import { getProjects } from '@/data/projects';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('projects');
  return { title: t('title'), description: t('description') };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('projects');
  const projects = getProjects(locale);

  const stats = [
    { value: projects.length, label: t('stats.total') },
    { value: projects.filter((p) => p.featured).length, label: t('stats.featured') },
    {
      value: projects.filter((p) => p.category === 'professional').length,
      label: t('stats.professional'),
    },
    { value: new Set(projects.flatMap((p) => p.techStack)).size, label: t('stats.technologies') },
  ];

  return (
    <Section className="pt-12 md:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end">
          <Reveal className="max-w-4xl">
            <p className="section-kicker">{t('title')}</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              {t('headline')}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-2">{t('description')}</p>
          </Reveal>

          <Reveal delay={0.1} className="surface-card p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.32em] text-accent">
              {t('snapshot')}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-line bg-paper-2/50 p-4">
                  <p className="font-mono text-2xl font-semibold text-ink">{stat.value}</p>
                  <p className="mt-1 text-sm text-ink-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={(index % 3) * 0.06}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
