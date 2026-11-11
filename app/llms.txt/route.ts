import { getServices } from '@/data/services';
import { getSelectedProjects } from '@/data/projects';
import { siteMetadata } from '@/data/metadata';
import { getNotes } from '@/data/notes';

export const dynamic = 'force-static';

// A plain-text brief for AI assistants and AI search (llmstxt.org convention).
export function GET() {
  const base = siteMetadata.baseUrl;
  const services = getServices('en');
  const primary = services.filter((s) => s.tier === 'primary');
  const secondary = services.filter((s) => s.tier === 'secondary');
  const projects = getSelectedProjects('en');
  const notes = getNotes('en');
  const evidence = (p: (typeof projects)[number]) =>
    p.evidence === 'prototype' ? ' (his own prototype: not launched, simulator only)' : p.evidence === 'production' ? ' (in production)' : '';

  const text = `# Daniel Chen (曾祈荣)

> Senior fintech engineer and independent technical partner, based in Kuala Lumpur, Malaysia (GMT+8), working remotely with founders, brokers and prop-trading firms. He builds MetaTrader 5 Manager API integrations, prop-firm and broker back-office systems, and payment integrations, and takes on engagements as a founding engineer or fractional technical lead. Contracts are quoted in USD. Languages: English and Chinese.

Daniel is currently a Senior Backend Engineer at CFI Financial, a multi-asset broker (crypto trading platform and payment integrations; Python, FastAPI, RabbitMQ). Previously: Appnovation (payment, ticketing and web platforms for Hong Kong clients), TradersFlow (MetaTrader 5 Manager API integration and real-time risk monitor for a live prop-trading platform, freelance), Tencent (overseas game operations platform) and Corebase Technologies. He also built and runs SolveMY, a marketplace on web, Android and iOS.

What is production experience and what is not: the MT5 Manager API service and risk monitor, the Checkout.com wallet payments (Apple Pay, Google Pay, Benefit), the Octopus payment gateway service and SolveMY are shipped work. He has not shipped a proprietary trading engine or a double-entry wallet in production; the site describes those as designs he can build.

Contact: ${base}/en/contact · ${siteMetadata.email} · WhatsApp ${siteMetadata.whatsapp} · LinkedIn ${siteMetadata.social.linkedin} · GitHub ${siteMetadata.social.github}

## Core services

${primary.map((s) => `- [${s.title}](${base}/en/services/${s.slug}): ${s.short}`).join('\n')}

## Also available

${secondary.map((s) => `- [${s.title}](${base}/en/services/${s.slug}): ${s.short}`).join('\n')}
- [All services](${base}/en/services)
- [For hiring teams](${base}/en/hire): also open to senior backend and full-stack roles.

## Case studies

${projects.map((p) => `- [${p.title}](${base}/en/work/${p.slug})${evidence(p)}: ${p.description}`).join('\n')}
- [All case studies](${base}/en/work)

## Technical notes

${notes.map((n) => `- [${n.title}](${base}/en/notes/${n.slug}) (${n.basis === 'design' ? 'design proposal' : 'from production work'}): ${n.description}`).join('\n')}

## About

- [About Daniel Chen](${base}/en/about)

## Chinese (简体中文)

- [首页](${base}/zh-CN)
- [服务](${base}/zh-CN/services)
- [案例](${base}/zh-CN/work)
- [联系](${base}/zh-CN/contact)
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
