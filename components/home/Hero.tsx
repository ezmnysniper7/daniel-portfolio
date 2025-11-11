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
    <Section className="min-h-[80vh] flex items-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <Container className="relative z-10">
        <div className="max-w-3xl">
          <div className="mb-6 animate-float">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium shadow-lg animate-pulse-glow">
              ✨ Available for freelance projects
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Hi, I&apos;m <span className="gradient-text animate-gradient bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">{name}</span>
          </h1>

          <p className="text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-gray-100 dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            {title}
          </p>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 text-balance">
            {tagline}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="/projects" variant="primary" size="lg" className="group relative overflow-hidden">
              <span className="relative z-10">View Projects</span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Button>
            <Button href="/contact" variant="secondary" size="lg" className="group hover:glow transition-all duration-300">
              <span className="group-hover:scale-110 inline-block transition-transform">Get in Touch</span>
            </Button>
          </div>

          {/* Animated scroll indicator */}
          <div className="mt-16 flex justify-center">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
