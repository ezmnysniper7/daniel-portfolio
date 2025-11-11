import Link from 'next/link';
import { Container } from './Container';
import { siteMetadata } from '@/data/metadata';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12 mt-auto">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} {siteMetadata.name}. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {siteMetadata.social.github && (
              <a
                href={siteMetadata.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            )}
            {siteMetadata.social.linkedin && (
              <a
                href={siteMetadata.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                LinkedIn
              </a>
            )}
            {siteMetadata.email && (
              <a
                href={`mailto:${siteMetadata.email}`}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              >
                Email
              </a>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
