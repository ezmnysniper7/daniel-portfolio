'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Reveal } from '@/components/world/Reveal';
import { Skill } from '@/types';

interface SkillsOverviewProps {
  skills: Skill[];
}

export function SkillsOverview({ skills }: SkillsOverviewProps) {
  const t = useTranslations('home');

  return (
    <Section className="border-t border-line/60">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <p className="section-kicker">{t('skillsAndTechnologies')}</p>
          <h2 className="mt-4 section-title">{t('skillsSubtitle')}</h2>
          <p className="mt-4 text-base leading-7 text-ink-2">{t('skillsHint')}</p>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {skills.map((category, i) => (
            <Reveal key={category.category} delay={i * 0.05}>
              <Card className="h-full p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold tracking-tight text-ink">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {category.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill.name} variant="mono" size="sm">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
