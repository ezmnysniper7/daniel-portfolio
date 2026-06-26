'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { ContactForm } from '@/components/contact/ContactForm';
import { Reveal } from '@/components/world/Reveal';
import { siteMetadata } from '@/data/metadata';

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <Section className="pt-12 md:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <Reveal>
            <p className="section-kicker">{t('title')}</p>
            <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              {t('headline')}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-2">{t('description')}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <Card className="p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.26em] text-ink-3">
                  {t('info.email')}
                </p>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  className="mt-3 block text-lg font-medium text-accent transition-colors hover:brightness-110"
                >
                  {siteMetadata.email}
                </a>
              </Card>

              <Card className="p-6">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.26em] text-ink-3">
                  {t('info.location')}
                </p>
                <p className="mt-3 text-lg font-medium text-ink">{siteMetadata.location}</p>
              </Card>
            </div>

            <Card className="mt-4 p-6">
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.26em] text-ink-3">
                {t('info.availability')}
              </p>
              <p className="mt-3 max-w-2xl text-base leading-8 text-ink-2">
                {siteMetadata.availableForWork ? t('availableForWork') : t('notAvailableForWork')}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-ink-2">
                {siteMetadata.social.github && (
                  <a
                    href={siteMetadata.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    GitHub
                  </a>
                )}
                {siteMetadata.social.linkedin && (
                  <a
                    href={siteMetadata.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </Card>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="p-8">
              <p className="section-kicker">{t('form.send')}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
                {t('conversationTitle')}
              </h2>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Card>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
