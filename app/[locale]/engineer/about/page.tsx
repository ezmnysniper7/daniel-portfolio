import { useTranslations } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Timeline } from '@/components/experience/Timeline';
import { Reveal } from '@/components/world/Reveal';
import { experiences } from '@/data/experience';
import { experiencesZhCN } from '@/data/experience.zh-CN';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about');
  return { title: t('title'), description: t('description') };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const experienceData = locale === 'zh-CN' ? experiencesZhCN : experiences;
  return <AboutPageContent experiences={experienceData} />;
}

interface AboutPageContentProps {
  experiences: typeof experiences;
}

function AboutPageContent({ experiences }: AboutPageContentProps) {
  const t = useTranslations('about');
  const latestExperience = experiences[0];
  const focusAreas = [
    t('expertise.payments'),
    t('expertise.microservices'),
    t('expertise.kubernetes'),
    t('expertise.databases'),
    t('expertise.infrastructure'),
    t('expertise.frontend'),
  ];
  const principles = [
    { title: t('principles.systems.title'), body: t('principles.systems.body') },
    { title: t('principles.reliability.title'), body: t('principles.reliability.body') },
    { title: t('principles.delivery.title'), body: t('principles.delivery.body') },
  ];
  const stats = [
    { value: String(experiences.length), label: t('stats.roles') },
    {
      value: String(new Set(experiences.map((e) => e.company)).size),
      label: t('stats.companies'),
    },
    { value: t('stats.productionValue'), label: t('stats.production') },
  ];

  return (
    <>
      <Section className="pt-12 md:pt-16">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)] lg:items-start">
            <Reveal className="max-w-3xl">
              <p className="section-kicker">{t('eyebrow')}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
                {t('headline')}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t('description')}</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-ink-3">{t('introBody')}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-line bg-panel/60 p-5 backdrop-blur">
                    <p className="font-mono text-2xl font-semibold text-ink">{stat.value}</p>
                    <p className="mt-1 text-sm text-ink-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="space-y-5">
              <div className="rounded-[28px] border border-line bg-zinc-950 p-7 text-zinc-100 shadow-soft">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                  {t('nowLabel')}
                </p>
                <h2 className="mt-4 text-2xl font-semibold">{latestExperience.position}</h2>
                <p className="mt-2 text-zinc-300">{latestExperience.company}</p>
                {latestExperience.location && (
                  <p className="mt-6 text-sm text-zinc-400">{latestExperience.location}</p>
                )}
                <p className="mt-4 text-sm leading-7 text-zinc-300">{latestExperience.description}</p>
              </div>

              <div className="surface-card p-7">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                  {t('education')}
                </p>
                <p className="mt-4 text-xl font-semibold text-ink">{t('degree')}</p>
                <p className="mt-2 text-ink-2">{t('university')}</p>
                <p className="mt-4 text-sm text-ink-3">{t('graduationDate')}</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section className="py-10 md:py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(260px,0.7fr)_minmax(0,1.3fr)]">
            <Reveal>
              <p className="section-kicker">{t('whatIDo')}</p>
              <h2 className="mt-4 text-3xl font-semibold text-ink md:text-4xl">{t('capabilitiesTitle')}</h2>
            </Reveal>

            <div className="grid gap-4 sm:grid-cols-2">
              {focusAreas.map((item, index) => (
                <Reveal key={item} delay={index * 0.05}>
                  <article className="h-full rounded-2xl border border-line bg-panel/60 p-5 backdrop-blur">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-accent">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-ink-2">{item}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-zinc-950 py-16 text-zinc-100">
        <Container>
          <Reveal className="mb-10 max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
              {t('approachEyebrow')}
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{t('approachTitle')}</h2>
          </Reveal>

          <div className="grid gap-5 lg:grid-cols-3">
            {principles.map((principle, i) => (
              <Reveal key={principle.title} delay={i * 0.07}>
                <article className="h-full rounded-[24px] border border-white/10 bg-white/5 p-6">
                  <h3 className="text-xl font-semibold">{principle.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-zinc-300">{principle.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <Reveal className="mb-12 max-w-2xl">
            <p className="section-kicker">{t('workExperience')}</p>
            <h2 className="mt-4 text-3xl font-semibold text-ink md:text-4xl">{t('timelineTitle')}</h2>
          </Reveal>
          <Timeline experiences={experiences} />
        </Container>
      </Section>
    </>
  );
}
