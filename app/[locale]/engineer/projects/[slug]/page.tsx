import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getProjects } from '@/data/projects';
import { formatDate } from '@/lib/utils';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjects(locale).find((item) => item.slug === slug);
  if (!project) return { title: 'Project Not Found' };
  return { title: project.title, description: project.description };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('projects.detail');
  const project = getProjects(locale).find((item) => item.slug === slug);

  if (!project) {
    notFound();
  }

  const metaItems = [
    project.role ? { label: t('role'), value: project.role } : null,
    project.startDate
      ? {
          label: t('timeline'),
          value: `${formatDate(project.startDate)} - ${
            project.endDate ? formatDate(project.endDate) : t('present')
          }`,
        }
      : null,
    project.category ? { label: t('category'), value: project.category } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Section className="pt-12 md:pt-16">
      <Container size="lg">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              {project.featured && <Badge variant="accent">{t('featured')}</Badge>}
              {project.category && (
                <Badge variant="mono" className="capitalize">
                  {project.category}
                </Badge>
              )}
            </div>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-2">{project.description}</p>
          </div>

          <div className="surface-card p-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.32em] text-accent">
              {t('detailContext')}
            </p>
            <div className="mt-5 space-y-4">
              {metaItems.map((item) => (
                <div key={item.label} className="border-b border-line pb-4 last:border-b-0 last:pb-0">
                  <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-3">{item.label}</p>
                  <p className="mt-2 text-sm font-medium capitalize text-ink">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {project.githubUrl && (
                <Button href={project.githubUrl} variant="secondary" external>
                  View on GitHub
                </Button>
              )}
              {project.demoUrl && (
                <Button href={project.demoUrl} variant="accent" external>
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        </div>

        {project.imageUrl && (
          <div className="surface-card mt-12 overflow-hidden p-2">
            <div className="relative aspect-video overflow-hidden rounded-[22px]">
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 960px"
              />
            </div>
          </div>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric} className="surface-card p-5">
                <p className="text-sm font-medium leading-7 text-ink-2">{metric}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
          <div className="space-y-8">
            {project.longDescription && (
              <div className="surface-card p-8">
                <p className="section-kicker">{t('overview')}</p>
                <p className="mt-5 text-base leading-8 text-ink-2">{project.longDescription}</p>
              </div>
            )}

            {project.responsibilities && project.responsibilities.length > 0 && (
              <div className="surface-card p-8">
                <p className="section-kicker">{t('whatIBuilt')}</p>
                <ul className="mt-5 space-y-4">
                  {project.responsibilities.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-8 text-ink-2">
                      <span className="mt-3 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.highlights.length > 0 && (
              <div className="surface-card p-8">
                <p className="section-kicker">{t('achievements')}</p>
                <ul className="mt-5 space-y-4">
                  {project.highlights.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-8 text-ink-2">
                      <span className="mt-1 text-up">+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="surface-card p-8">
              <p className="section-kicker">{t('technologies')}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="mono">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div className="surface-card p-8">
                <p className="section-kicker">{t('tags')}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="accent">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Button href={`/${locale}/engineer/projects`} variant="secondary" size="lg">
            ← {t('backToProjects')}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
