import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';

interface HeroProps {
  name: string;
  title: string;
  tagline: string;
}

export function Hero({ name, title, tagline }: HeroProps) {
  return (
    <Section className="min-h-[80vh] flex items-center">
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Hi, I'm <span className="text-blue-500">{name}</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300 mb-4">
            {title}
          </p>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-8 text-balance">
            {tagline}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/projects" variant="primary" size="lg">
              View Projects
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Get in Touch
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
