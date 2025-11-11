import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { PageTransition } from '@/components/transitions/PageTransition';
import { siteMetadata } from '@/data/metadata';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: `${siteMetadata.name} - ${siteMetadata.title}`,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  keywords: [
    'Daniel Chen',
    'Full-Stack Developer',
    'Java Developer',
    'TypeScript',
    'Next.js',
    'Spring Boot',
    'PHP',
    'Malaysia Developer',
    'Portfolio',
  ],
  authors: [{ name: siteMetadata.name, url: 'https://danielchen.dev' }],
  creator: siteMetadata.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://danielchen.dev',
    title: `${siteMetadata.name} - ${siteMetadata.title}`,
    description: siteMetadata.description,
    siteName: `${siteMetadata.name} Portfolio`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteMetadata.name} - ${siteMetadata.title}`,
    description: siteMetadata.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
