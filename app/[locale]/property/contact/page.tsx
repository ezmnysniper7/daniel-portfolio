'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Card } from '@/components/ui/Card';
import { ContactForm } from '@/components/contact/ContactForm';
import { Reveal } from '@/components/world/Reveal';
import { WhatsAppButton } from '@/components/property/WhatsAppButton';
import { propertyMeta } from '@/data/property';

export default function PropertyContactPage() {
  const t = useTranslations('property.contactPage');

  const info = [
    { label: t('infoArea'), value: propertyMeta.areas.join(' · ') },
    { label: t('infoLangs'), value: propertyMeta.languages.join(' · ') },
    { label: t('infoPhone'), value: propertyMeta.phone },
  ];

  return (
    <Section className="pt-12 md:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <Reveal>
            <p className="section-kicker">{t('kicker')}</p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink md:text-6xl">
              {t('headline')}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-2">{t('desc')}</p>

            <div className="mt-8">
              <WhatsAppButton
                message="Hi Daniel, I'm looking for a rental. Here's what I need:"
                label={t('whatsapp')}
                size="lg"
              />
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {info.map((item) => (
                <Card key={item.label} className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-3">{item.label}</p>
                  <p className="mt-2 text-sm font-medium text-ink">{item.value}</p>
                </Card>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <Card className="p-8">
              <p className="section-kicker">{t('or')}</p>
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
