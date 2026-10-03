import { getServices } from '@/data/services';
import { getSelectedProjects } from '@/data/projects';
import { siteMetadata } from '@/data/metadata';

export const dynamic = 'force-static';

// A plain-text brief for AI assistants and AI search (llmstxt.org convention).
export function GET() {
  const base = siteMetadata.baseUrl;
  const services = getServices('en');
  const projects = getSelectedProjects('en');

  const text = `# Daniel Chen (曾祈荣)

> Senior backend engineer in Kuala Lumpur, Malaysia. Builds crypto and trading platforms, payment integrations, websites, mobile apps and backend systems. Open to project work for companies and founders, and to senior backend or full-stack roles (full-time or contract). Works remotely worldwide in English and Chinese.

Currently Senior Backend Engineer at CFI Financial (crypto trading platform and payment integrations; Python, FastAPI, RabbitMQ). Previously Appnovation (payments, ticketing and web platforms for Hong Kong clients), TradersFlow (MetaTrader 5 integration and risk engine for a prop-trading platform), Tencent (overseas game operations platform) and Corebase Technologies.

Contact: ${siteMetadata.email} · LinkedIn ${siteMetadata.social.linkedin} · GitHub ${siteMetadata.social.github}

## Services

${services.map((s) => `- [${s.title}](${base}/en/services/${s.slug}): ${s.short}`).join('\n')}
- [All services](${base}/en/services)
- [Hire Daniel for a role](${base}/en/hire): open to senior backend and full-stack roles, full-time or contract, Kuala Lumpur or remote.

## Case studies

${projects.map((p) => `- [${p.title}](${base}/en/work/${p.slug}): ${p.description}`).join('\n')}

## Chinese (简体中文)

- [首页](${base}/zh-CN)
- [服务](${base}/zh-CN/services)
- [招聘我](${base}/zh-CN/hire)
`;

  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
