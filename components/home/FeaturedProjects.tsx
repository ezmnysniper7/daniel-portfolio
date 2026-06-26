'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/world/Reveal';
import { Project } from '@/types';

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations('home');
  const params = useParams();
  const locale = params.locale as string;
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  if (featured.length === 0) {
    return null;
  }

  return (
    <Section>
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <p className="section-kicker">{t('featuredProjects')}</p>
          <h2 className="mt-4 section-title">{t('featuredSubtitle')}</h2>
          <p className="mt-4 text-base leading-7 text-ink-2">{t('featuredHint')}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12">
          <Button href={`/${locale}/engineer/projects`} variant="secondary">
            {t('viewAllProjects')} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
