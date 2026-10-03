/**
 * Service landing pages. Each one targets what a client would actually search for,
 * and every "proof" line points at real, published work.
 */
export type ServiceProof = { text: string; slug?: string; anchor?: string };

export type Service = {
  slug: string;
  title: string;
  short: string;
  metaTitle: string;
  metaDescription: string;
  serviceType: string;
  intro: string;
  offerings: { title: string; body: string }[];
  proof: ServiceProof[];
  faqs: { q: string; a: string }[];
};

const en: Service[] = [
  {
    slug: 'crypto-trading-systems',
    title: 'Crypto & trading systems',
    short: 'Back offices for crypto brokers, MetaTrader 5 integrations, prop-firm platforms and real-time risk monitoring.',
    metaTitle: 'Crypto & Trading Platform Developer (MT5) | Daniel Chen',
    metaDescription:
      'Crypto broker back offices, MetaTrader 5 (MT5) integration, prop-firm platforms and real-time risk monitoring. Based in Kuala Lumpur, working remotely worldwide.',
    serviceType: 'Crypto and trading platform development',
    intro:
      'If you run, or are starting, a crypto brokerage, a forex/CFD broker or a prop-trading firm, the hard part is rarely the screens. It is the money paths: orders, balances, approvals, limits and the sync between systems. That is the part I work on every day.',
    offerings: [
      {
        title: 'Crypto brokerage back offices',
        body: 'Client and back-office APIs, maker-checker approvals, order and transaction views, exports with field-level permissions, KYC data sync and 8-decimal crypto precision.',
      },
      {
        title: 'MetaTrader 5 (MT5) integration',
        body: 'Services on the MT5 Manager API (C#/.NET) and Web API: accounts, positions, deals, balance operations, trading rights and fast batch reads.',
      },
      {
        title: 'Prop-firm platforms',
        body: 'From challenge purchase to funded account: phase rules, pass and fail logic, payouts, affiliate and campaign tracking, and the admin tools to run it.',
      },
      {
        title: 'Real-time risk monitoring',
        body: 'Daily-loss and max-loss checks every few seconds, idempotent fail flows, and safety checks that refuse to act on numbers that do not add up.',
      },
      {
        title: 'Deposits, withdrawals and payouts',
        body: 'Card, wallet, bank transfer and crypto payment flows with signed webhooks, refunds and reconciliation.',
      },
      {
        title: 'Trader and operations dashboards',
        body: 'React dashboards for equity, P&L, accounts and guarded admin actions.',
      },
    ],
    proof: [
      {
        text: 'Today I am a Senior Backend Engineer on a crypto trading platform at CFI Financial (Python, FastAPI, RabbitMQ).',
        anchor: 'now',
      },
      {
        text: 'I built the MetaTrader 5 integration service and real-time breach monitor for a live prop-trading platform.',
        slug: 'tradersflow',
      },
    ],
    faqs: [
      {
        q: 'Can you build a complete crypto exchange?',
        a: 'I build and extend the parts around the trading engine: client and back-office APIs, order and wallet flows, approvals, permissions, payments and data sync. Matching engines, custody and liquidity usually come from specialist providers, and I integrate them. We decide the split in the first call.',
      },
      {
        q: 'Do you work with MetaTrader 5?',
        a: 'Yes. I have built a C#/.NET service on the MT5 Manager API, used the Web API for account changes, and run a monitor that enforces loss rules on every account within seconds.',
      },
      {
        q: 'Can you help with a trading platform that is slow or buggy?',
        a: 'Yes. Tracing production bugs across services to the exact line is a big part of my day job. I reproduce the problem and prove the cause first, then make the smallest safe fix.',
      },
      {
        q: 'Do you build trading bots or strategies?',
        a: 'No. I build the platforms, integrations and risk systems that brokers and trading firms run on, not strategies or signals.',
      },
    ],
  },
  {
    slug: 'payment-integration',
    title: 'Payment gateway integration',
    short: 'Cards, Apple Pay, Google Pay, bank and crypto payments done properly: signed webhooks, idempotency, refunds and reconciliation.',
    metaTitle: 'Payment Gateway Integration Developer | Daniel Chen',
    metaDescription:
      'Payment gateway integration that never double-charges or loses a callback: Checkout.com, Stripe, Apple Pay, Google Pay, refunds and reconciliation.',
    serviceType: 'Payment gateway integration',
    intro:
      'A payment that works in the demo is easy. One that never double-charges, never loses a callback and reconciles at month end takes care. I have shipped payment integrations for a broker, a theme park and a payment provider.',
    offerings: [
      {
        title: 'Payment gateway and PSP integration',
        body: 'Checkout.com, Stripe, Octopus and other providers: payment sessions, 3-D Secure flows, webhooks and refunds.',
      },
      {
        title: 'Apple Pay and Google Pay',
        body: 'Wallet payments as separate methods, tested end to end before release.',
      },
      {
        title: 'Webhook safety',
        body: 'Signature verification before trusting a payload, idempotent processing, retries and alerts.',
      },
      {
        title: 'Reconciliation',
        body: 'Status polling and reconciliation jobs, so a missed callback never turns into lost revenue.',
      },
      {
        title: 'Payment microservices',
        body: 'A standalone, multi-tenant gateway with HMAC request signing, replay protection and key rotation.',
      },
    ],
    proof: [
      {
        text: 'Shipped Apple Pay, Google Pay and Benefit deposits through Checkout.com, live in production at CFI Financial.',
        anchor: 'now',
      },
      {
        text: 'Built a standalone Octopus payment gateway microservice with HMAC-SHA256 signing and webhook delivery.',
        slug: 'octopus-payment-microservice',
      },
      {
        text: 'Built Type Approval compliant payment polling and reconciliation for Ocean Park ticketing.',
        slug: 'ocean-park-ticketing',
      },
    ],
    faqs: [
      {
        q: 'Which payment gateways have you worked with?',
        a: 'Checkout.com (cards, Apple Pay, Google Pay, Benefit), Stripe, Octopus in Hong Kong, and Malaysia\'s FIUU in sandbox. Most providers follow the same pattern, so a new one is mostly careful reading of their docs.',
      },
      {
        q: 'Some of our payments go missing or get credited twice. Can you fix that?',
        a: 'Usually it is a webhook that failed, arrived twice or was never verified. I trace the exact payment through your logs and the provider dashboard, then add idempotency and reconciliation so it cannot happen silently again.',
      },
      {
        q: 'Will you store card numbers?',
        a: 'No. Card data stays with the payment provider through hosted fields and tokens, which keeps your PCI scope small.',
      },
    ],
  },
  {
    slug: 'web-development',
    title: 'Websites & web apps',
    short: 'Fast Next.js websites, portals and dashboards that load quickly, rank on Google and work in more than one language.',
    metaTitle: 'Website & Web App Developer in Malaysia | Daniel Chen',
    metaDescription:
      'Website and web app development in Kuala Lumpur: fast Next.js sites, customer portals, dashboards and multilingual SEO in English, Malay and Chinese.',
    serviceType: 'Website and web application development',
    intro:
      'For a business website, a customer portal or an internal dashboard, I build in Next.js and React: server-rendered for speed and search, with real attention to performance. This site scores 90+ on Google Lighthouse for mobile.',
    offerings: [
      {
        title: 'Business and marketing websites',
        body: 'Server-rendered pages, structured data, sitemaps and fast loading, so the right people can find you.',
      },
      {
        title: 'Web apps and customer portals',
        body: 'Booking flows, marketplaces, member areas and anything with logins, payments and data.',
      },
      {
        title: 'Admin dashboards',
        body: 'Back-office tools with roles, filters, exports and charts.',
      },
      {
        title: 'Multilingual sites',
        body: 'English, Malay and Chinese built in from the start, not bolted on later.',
      },
      {
        title: 'Speed and SEO fixes',
        body: 'Speeding up slow sites and fixing the technical SEO that keeps pages out of Google.',
      },
    ],
    proof: [
      { text: 'The SolveMY website: 75 routes with server-rendered SEO pages in English, Malay and Chinese.', slug: 'solvemy' },
      { text: 'An AI trip planner for the Hong Kong Tourism Board, built in Next.js 15 and AWS Amplify.', slug: 'hktb-ai-trip-planner' },
      { text: 'This site: Next.js, GSAP and a WebGL shader, and still 90+ on mobile Lighthouse.' },
    ],
    faqs: [
      {
        q: 'Can you redesign my existing website?',
        a: 'Yes. I can rebuild it on a modern stack or improve what you have. Either way we start from what the site needs to achieve for your business.',
      },
      {
        q: 'Will my website show up on Google?',
        a: 'I build the technical side properly: fast pages, clean URLs, structured data, sitemaps and language tags. Ranking also depends on your content and your competition, and I will be straight with you about that.',
      },
      {
        q: 'Do you build with WordPress?',
        a: 'I mostly build with Next.js and React. If WordPress or another CMS suits you better, I will tell you.',
      },
      {
        q: 'Can you set up hosting too?',
        a: 'Yes: Vercel, Cloudflare or your own server, with HTTPS, backups and monitoring in place.',
      },
    ],
  },
  {
    slug: 'mobile-app-development',
    title: 'Mobile apps for iOS & Android',
    short: 'Flutter apps for iPhone and Android from one codebase, with the backend, push notifications and store release handled.',
    metaTitle: 'Mobile App Developer in Malaysia (iOS & Android) | Daniel Chen',
    metaDescription:
      'Flutter apps for iOS and Android from one codebase, with the backend, push notifications and App Store / Google Play release. Based in Kuala Lumpur.',
    serviceType: 'Mobile app development',
    intro:
      'One Flutter codebase for iPhone and Android, plus the API and admin tools behind it. I have taken an app from first commit to Google Play and through Apple\'s review, with push notifications, maps, chat and sign-in.',
    offerings: [
      {
        title: 'iOS and Android apps in Flutter',
        body: 'One codebase, native feel, and three languages if you need them.',
      },
      {
        title: 'The backend behind the app',
        body: 'APIs, databases, sign-in and admin panels, so the app has something solid to talk to.',
      },
      {
        title: 'Push, maps, chat and sign-in',
        body: 'Firebase push on Android and iOS, Google Maps, in-app chat with voice notes, and Google and Apple sign-in.',
      },
      {
        title: 'App Store and Google Play release',
        body: 'Signing, versioning, store listings and getting through review.',
      },
    ],
    proof: [
      { text: 'SolveMY: a 48-screen Flutter app on Google Play, submitted to the App Store, with a Go backend.', slug: 'solvemy' },
      { text: 'Dan: a Flutter client for a Mandarin-learning platform, next to the web app and a Go API.', slug: 'dan' },
    ],
    faqs: [
      {
        q: 'Do I need separate apps for iPhone and Android?',
        a: 'No. Flutter builds both from one codebase, which keeps cost and maintenance down.',
      },
      {
        q: 'Can you publish the app to the App Store and Google Play?',
        a: 'Yes. I handle signing, builds, listings and review replies. Apple\'s rules on in-app payments are worth planning for early, and I have been through them.',
      },
      {
        q: 'Can you build the admin side as well?',
        a: 'Yes. Most apps need an admin panel for users, content and support, and I build it together with the API.',
      },
    ],
  },
  {
    slug: 'backend-development',
    title: 'Backend & system development',
    short: 'APIs, integrations, data and cloud for systems that have to be right: event-driven services, background jobs and DevOps.',
    metaTitle: 'Backend & System Developer in Malaysia | Daniel Chen',
    metaDescription:
      'APIs, integrations, event-driven services, databases, cloud and DevOps, plus fixing slow or broken systems. Python, Go, TypeScript, Java and C#.',
    serviceType: 'Backend and system development',
    intro:
      'The part users never see: APIs, databases, queues, background jobs, integrations and the servers they run on. This is my main job, in Python, Go, TypeScript, Java and C#.',
    offerings: [
      {
        title: 'APIs and system design',
        body: 'REST APIs with clear contracts, permissions and tests, designed to grow without a rewrite.',
      },
      {
        title: 'Event-driven systems',
        body: 'RabbitMQ producers and consumers that keep systems in sync, released in a safe order.',
      },
      {
        title: 'Integrations and automation',
        body: 'Connecting CRMs, payment providers, trading servers, email, SMS and WhatsApp, and automating the manual steps between them.',
      },
      {
        title: 'Cloud and DevOps',
        body: 'Docker, AWS, Cloudflare and Linux servers, with CI, backups, monitoring and alerts.',
      },
      {
        title: 'Rescue and debugging',
        body: 'Finding out why production is slow, wrong or down, proving the cause and fixing it safely.',
      },
      {
        title: 'Technical advice',
        body: 'A second opinion on architecture, a build-or-buy decision or a vendor\'s proposal.',
      },
    ],
    proof: [
      {
        text: 'Senior Backend Engineer at CFI Financial: FastAPI services and RabbitMQ consumers across 7 services and shared libraries.',
        anchor: 'now',
      },
      { text: 'SolveMY\'s Go API: 235 endpoints and 1,006 test functions, running on Hetzner with Docker and Cloudflare.', slug: 'solvemy' },
      {
        text: 'Resolved a production data-integrity incident in an MT5 integration by tracing it to a thread-unsafe SDK.',
        slug: 'tradersflow',
      },
    ],
    faqs: [
      {
        q: 'Which languages and frameworks do you use?',
        a: 'Python (FastAPI), Go, TypeScript (Node.js), Java (Spring Boot) and C# (.NET), on PostgreSQL, MySQL, Redis and RabbitMQ. I pick what fits your team and what you can hire for later.',
      },
      {
        q: 'Can you take over a system someone else built?',
        a: 'Yes. I start by reading the flows end to end and writing down how they work, then fix the riskiest parts first.',
      },
      {
        q: 'Do you offer support after launch?',
        a: 'We can agree ongoing support for fixes, updates and monitoring once the project is live.',
      },
    ],
  },
];

const zhCN: Service[] = [
  {
    slug: 'crypto-trading-systems',
    title: '加密货币与交易系统开发',
    short: '加密货币经纪商后台、MetaTrader 5 对接、自营交易（Prop Firm）平台与实时风控监控。',
    metaTitle: '加密货币与交易平台开发（MT5）| 曾祈荣 Daniel Chen',
    metaDescription:
      '需要开发加密货币或交易系统？加密货币经纪商后台、MetaTrader 5（MT5）对接、自营交易平台与实时风控监控。常驻吉隆坡，可远程合作。',
    serviceType: '加密货币与交易平台开发',
    intro:
      '无论你正在经营还是准备创办加密货币经纪商、外汇/差价合约经纪商或自营交易公司，真正难的往往不是界面，而是资金路径：订单、余额、审批、限额，以及系统之间的数据同步。这正是我每天在做的事。',
    offerings: [
      {
        title: '加密货币经纪商后台',
        body: '客户端与后台 API、“制单-复核”审批、订单与交易明细、带字段级权限的导出、KYC 数据同步，以及 8 位小数的加密货币精度。',
      },
      {
        title: 'MetaTrader 5（MT5）对接',
        body: '基于 MT5 Manager API（C#/.NET）与 Web API 的服务：账户、持仓、成交、出入金操作、交易权限和高速批量读取。',
      },
      {
        title: '自营交易（Prop Firm）平台',
        body: '从购买挑战到获得资金账户：阶段规则、通过与失败判定、利润提现、联盟与营销追踪，以及运营所需的管理工具。',
      },
      {
        title: '实时风控监控',
        body: '每隔几秒检查日亏损与最大亏损，幂等的失败流程，以及数据对不上就拒绝执行的安全校验。',
      },
      {
        title: '入金、出金与提现',
        body: '银行卡、电子钱包、银行转账和加密货币支付流程，带签名校验的 Webhook、退款与对账。',
      },
      {
        title: '交易者与运营看板',
        body: '用 React 构建的净值、盈亏、账户与受保护管理操作的看板。',
      },
    ],
    proof: [
      { text: '目前在 CFI Financial 担任加密货币交易平台的高级后端工程师（Python、FastAPI、RabbitMQ）。', anchor: 'now' },
      { text: '为一个线上自营交易平台构建了 MetaTrader 5 集成服务和实时违规监控。', slug: 'tradersflow' },
    ],
    faqs: [
      {
        q: '你能开发一个完整的加密货币交易所吗？',
        a: '我负责构建和扩展撮合引擎周边的系统：客户端与后台 API、订单与钱包流程、审批、权限、支付和数据同步。撮合引擎、托管和流动性通常由专业服务商提供，由我来对接。具体分工我们在第一次沟通时确定。',
      },
      {
        q: '你做过 MetaTrader 5 吗？',
        a: '做过。我用 C#/.NET 基于 MT5 Manager API 构建了服务，用 Web API 处理账户变更，并运行一个能在数秒内对所有账户执行亏损规则的监控器。',
      },
      {
        q: '我们的交易平台又慢又有问题，你能帮忙吗？',
        a: '可以。跨服务追踪线上问题、一直追到具体那一行代码，是我日常工作的重要部分。我会先复现问题、证明根因，再做最小且安全的修复。',
      },
      {
        q: '你做交易机器人或交易策略吗？',
        a: '不做。我开发的是经纪商和交易公司赖以运行的平台、集成与风控系统，而不是策略或信号。',
      },
    ],
  },
  {
    slug: 'payment-integration',
    title: '支付网关对接',
    short: '银行卡、Apple Pay、Google Pay、银行转账与加密货币支付，做到位：签名校验的 Webhook、幂等、退款与对账。',
    metaTitle: '支付网关对接开发 | 曾祈荣 Daniel Chen',
    metaDescription:
      '不重复扣款、不丢回调的支付网关对接：Checkout.com、Stripe、Apple Pay、Google Pay、Webhook、退款与对账。常驻吉隆坡，可远程合作。',
    serviceType: '支付网关对接',
    intro:
      '在演示里能跑通的支付很容易；永不重复扣款、永不丢失回调、月底还能对得上账的支付，需要细心。我为经纪商、主题乐园和支付服务商交付过支付对接。',
    offerings: [
      { title: '支付网关与 PSP 对接', body: 'Checkout.com、Stripe、八达通等：支付会话、3-D Secure 流程、Webhook 与退款。' },
      { title: 'Apple Pay 与 Google Pay', body: '作为独立支付方式上线，发布前完成端到端测试。' },
      { title: 'Webhook 安全', body: '先校验签名再信任数据，幂等处理、重试与告警。' },
      { title: '对账', body: '状态轮询与对账任务，避免漏掉的回调变成收入损失。' },
      { title: '支付微服务', body: '独立的多租户网关，带 HMAC 请求签名、防重放和密钥轮换。' },
    ],
    proof: [
      { text: '在 CFI Financial 通过 Checkout.com 上线 Apple Pay、Google Pay 和 Benefit 入金，已在生产环境运行。', anchor: 'now' },
      { text: '构建了带 HMAC-SHA256 签名与 Webhook 投递的独立八达通支付网关微服务。', slug: 'octopus-payment-microservice' },
      { text: '为海洋公园票务构建了符合 Type Approval 标准的支付轮询与对账。', slug: 'ocean-park-ticketing' },
    ],
    faqs: [
      {
        q: '你对接过哪些支付网关？',
        a: 'Checkout.com（银行卡、Apple Pay、Google Pay、Benefit）、Stripe、香港八达通，以及在沙盒环境中对接过马来西亚的 FIUU。大多数服务商的模式相同，对接新的网关主要是仔细读懂它的文档。',
      },
      {
        q: '我们有些付款会丢失或被重复入账，你能修吗？',
        a: '这通常是 Webhook 失败、重复到达或没有校验造成的。我会通过日志和服务商后台追踪具体那笔付款，再加上幂等和对账，确保不会再悄悄发生。',
      },
      { q: '你会存储银行卡号吗？', a: '不会。卡号通过托管字段和令牌留在支付服务商那里，让你的 PCI 合规范围保持最小。' },
    ],
  },
  {
    slug: 'web-development',
    title: '网站与 Web 应用开发',
    short: '基于 Next.js 的快速网站、门户与管理后台：加载快、能被 Google 找到、支持多语言。',
    metaTitle: '马来西亚网站与 Web 应用开发 | 曾祈荣 Daniel Chen',
    metaDescription:
      '吉隆坡网站与 Web 应用开发：快速的 Next.js 网站、客户门户、管理后台，以及英文、马来文、中文多语言 SEO。可远程合作。',
    serviceType: '网站与 Web 应用开发',
    intro:
      '无论是企业官网、客户门户还是内部管理后台，我都用 Next.js 和 React 构建：服务端渲染，兼顾速度与搜索，并认真对待性能。这个网站在 Google Lighthouse 移动端评分 90 以上。',
    offerings: [
      { title: '企业与营销网站', body: '服务端渲染页面、结构化数据、站点地图和快速加载，让对的人找到你。' },
      { title: 'Web 应用与客户门户', body: '预约流程、交易市场、会员中心，以及任何涉及登录、支付和数据的系统。' },
      { title: '管理后台', body: '带角色权限、筛选、导出和图表的后台工具。' },
      { title: '多语言网站', body: '从一开始就内置英文、马来文和中文，而不是事后补上。' },
      { title: '提速与 SEO 修复', body: '让慢网站变快，修复让页面进不了 Google 的技术 SEO 问题。' },
    ],
    proof: [
      { text: 'SolveMY 网站：75 个路由，提供英文、马来文和中文的服务端渲染 SEO 页面。', slug: 'solvemy' },
      { text: '为香港旅游发展局用 Next.js 15 与 AWS Amplify 构建的 AI 行程规划器。', slug: 'hktb-ai-trip-planner' },
      { text: '就是这个网站：Next.js、GSAP 和 WebGL 着色器，移动端 Lighthouse 依然 90 以上。' },
    ],
    faqs: [
      { q: '你能重新设计我现有的网站吗？', a: '可以。可以用现代技术栈重建，也可以在现有基础上改进。无论哪种，我们都从网站要为你的业务达成什么目标开始。' },
      {
        q: '我的网站能在 Google 上被搜到吗？',
        a: '技术层面我会做到位：快速页面、清晰的网址、结构化数据、站点地图和语言标签。排名还取决于你的内容和竞争情况，这一点我会如实告诉你。',
      },
      { q: '你用 WordPress 吗？', a: '我主要用 Next.js 和 React。如果 WordPress 或其他 CMS 更适合你，我会直接告诉你。' },
      { q: '可以帮忙部署和托管吗？', a: '可以：Vercel、Cloudflare 或你自己的服务器，并配置好 HTTPS、备份和监控。' },
    ],
  },
  {
    slug: 'mobile-app-development',
    title: '手机 App 开发（iOS 与 Android）',
    short: '用 Flutter 一套代码开发 iPhone 和 Android App，后端、推送通知和上架一并搞定。',
    metaTitle: '马来西亚手机 App 开发（iOS 与 Android）| 曾祈荣 Daniel Chen',
    metaDescription:
      '吉隆坡手机 App 开发：用 Flutter 一套代码开发 iOS 和 Android App，包括后端、推送通知、地图以及 App Store / Google Play 上架。',
    serviceType: '手机 App 开发',
    intro:
      '一套 Flutter 代码同时支持 iPhone 和 Android，再加上背后的 API 与管理工具。我曾把一个 App 从第一次提交做到上架 Google Play 并通过 Apple 审核，包含推送通知、地图、聊天和登录。',
    offerings: [
      { title: 'Flutter 开发 iOS 与 Android App', body: '一套代码、原生体验，需要的话支持三种语言。' },
      { title: 'App 背后的后端', body: 'API、数据库、登录和管理后台，让 App 有稳固的系统支撑。' },
      { title: '推送、地图、聊天与登录', body: 'Android 与 iOS 的 Firebase 推送、Google 地图、带语音消息的应用内聊天，以及 Google 和 Apple 登录。' },
      { title: '上架 App Store 与 Google Play', body: '签名、版本管理、商店页面以及通过审核。' },
    ],
    proof: [
      { text: 'SolveMY：48 个页面的 Flutter App，已上架 Google Play 并提交 App Store，后端为 Go。', slug: 'solvemy' },
      { text: 'Dan：中文学习平台的 Flutter 客户端，与 Web 应用和 Go API 一起开发。', slug: 'dan' },
    ],
    faqs: [
      { q: 'iPhone 和 Android 需要分别开发两个 App 吗？', a: '不需要。Flutter 用一套代码同时构建两个平台，降低开发和维护成本。' },
      {
        q: '你能帮忙上架 App Store 和 Google Play 吗？',
        a: '可以。签名、打包、商店页面和审核回复我都能处理。Apple 对应用内付费的规定值得提早规划，这些我都经历过。',
      },
      { q: '管理后台也能一起做吗？', a: '可以。大多数 App 都需要管理用户、内容和客服的后台，我会和 API 一起构建。' },
    ],
  },
  {
    slug: 'backend-development',
    title: '后端与系统开发',
    short: '为必须准确的系统提供 API、集成、数据与云：事件驱动服务、后台任务与 DevOps。',
    metaTitle: '马来西亚后端与系统开发 | 曾祈荣 Daniel Chen',
    metaDescription:
      '后端与系统开发：API、系统集成、事件驱动服务、数据库、云与 DevOps，以及慢系统、故障系统的排查修复。Python、Go、TypeScript、Java、C#。',
    serviceType: '后端与系统开发',
    intro: '用户看不到的那部分：API、数据库、消息队列、后台任务、系统集成以及运行它们的服务器。这是我的本职工作，使用 Python、Go、TypeScript、Java 和 C#。',
    offerings: [
      { title: 'API 与系统设计', body: '契约清晰、带权限和测试的 REST API，能持续扩展而不必推倒重来。' },
      { title: '事件驱动系统', body: '用 RabbitMQ 生产者与消费者保持系统同步，并按安全的顺序发布。' },
      { title: '系统集成与自动化', body: '对接 CRM、支付服务商、交易服务器、邮件、短信和 WhatsApp，把中间的人工步骤自动化。' },
      { title: '云与 DevOps', body: 'Docker、AWS、Cloudflare 和 Linux 服务器，配好 CI、备份、监控和告警。' },
      { title: '救火与排查', body: '查明线上为什么慢、为什么错、为什么挂，证明根因并安全修复。' },
      { title: '技术咨询', body: '对架构、自研还是采购、或供应商方案提供第二意见。' },
    ],
    proof: [
      { text: 'CFI Financial 高级后端工程师：横跨 7 个服务与共享库的 FastAPI 服务和 RabbitMQ 消费者。', anchor: 'now' },
      { text: 'SolveMY 的 Go API：235 个接口、1,006 个测试函数，运行在 Hetzner、Docker 与 Cloudflare 之上。', slug: 'solvemy' },
      { text: '通过追踪到非线程安全的 SDK，解决了 MT5 集成中的一次生产数据一致性事故。', slug: 'tradersflow' },
    ],
    faqs: [
      {
        q: '你使用哪些语言和框架？',
        a: 'Python（FastAPI）、Go、TypeScript（Node.js）、Java（Spring Boot）和 C#（.NET），配合 PostgreSQL、MySQL、Redis 和 RabbitMQ。我会选择适合你团队、将来也容易招到人的技术。',
      },
      { q: '你能接手别人做的系统吗？', a: '可以。我会先把业务流程从头到尾读一遍并记录下来，然后优先修复风险最高的部分。' },
      { q: '上线后提供维护吗？', a: '项目上线后，我们可以约定持续的修复、更新与监控支持。' },
    ],
  },
];

export function getServices(locale: string): Service[] {
  return locale === 'zh-CN' ? zhCN : en;
}

export const serviceSlugs = en.map((s) => s.slug);

/** The service a case study is evidence for, used for "need something like this?" links. */
export function serviceForProject(projectSlug: string): string {
  if (projectSlug === 'tradersflow') return 'crypto-trading-systems';
  if (['octopus-payment-microservice', 'ocean-park-ticketing'].includes(projectSlug)) return 'payment-integration';
  if (['solvemy', 'healthcare-sdks'].includes(projectSlug)) return 'mobile-app-development';
  if (projectSlug.startsWith('tencent-') || projectSlug === 'ticketing-report-optimization') return 'backend-development';
  return 'web-development';
}
