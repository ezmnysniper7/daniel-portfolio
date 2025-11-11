import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Section } from '@/components/layout/Section';
import { Timeline } from '@/components/experience/Timeline';
import { experiences } from '@/data/experience';
import { siteMetadata } from '@/data/metadata';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${siteMetadata.name}, a full-stack developer with 2.5+ years of experience building enterprise applications.`,
};

export default function AboutPage() {
  return (
    <>
      <Section>
        <Container size="md">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              I&apos;m a full-stack developer with 2.5+ years of professional experience building enterprise-grade applications,
              payment systems, and large-scale platforms. Currently based in Penang, Malaysia.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">My Journey</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              I specialize in building secure, scalable systems with a focus on payment processing, e-commerce platforms,
              and game operations infrastructure. My experience spans from architecting Type Approval compliant payment
              gateways to maintaining critical systems serving millions of users at Tencent.
            </p>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              I&apos;m passionate about solving complex technical challenges, optimizing system performance, and delivering
              solutions that drive real business impact. Whether it&apos;s achieving 95% SQL query performance improvements
              or building multi-tenant microservices, I thrive on turning ambitious requirements into production-ready code.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">What I Do</h2>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li className="flex gap-3">
                <span className="text-blue-500">•</span>
                <span>Build enterprise payment systems with security and compliance at the core</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500">•</span>
                <span>Architect scalable microservices and RESTful APIs</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500">•</span>
                <span>Optimize database performance and system architecture</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500">•</span>
                <span>Implement comprehensive security measures including JWT, OAuth2, and encryption</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-500">•</span>
                <span>Develop full-stack applications with modern frameworks (Next.js, Spring Boot, PHP)</span>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Education</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>University Tunku Abdul Rahman (UTAR)</strong><br />
              Bachelor&apos;s Degree in Computer Science<br />
              Malaysia
            </p>
          </div>
        </Container>
      </Section>

      <Section className="bg-gray-50 dark:bg-gray-900/50">
        <Container>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Work Experience</h2>
          <Timeline experiences={experiences} />
        </Container>
      </Section>
    </>
  );
}
