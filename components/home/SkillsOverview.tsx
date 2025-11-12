'use client';

import { useTranslations } from 'next-intl';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skill } from '@/types';

interface SkillsOverviewProps {
  skills: Skill[];
}

export function SkillsOverview({ skills }: SkillsOverviewProps) {
  const t = useTranslations('home');

  return (
    <Section>
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('skillsAndTechnologies')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((category) => (
            <Card key={category.category} className="p-6">
              <h3 className="text-xl font-semibold mb-4">{category.category}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill.name}>{skill.name}</Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
