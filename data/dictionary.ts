export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
};

export type Dictionary = {
  meta: { title: string; description: string; keywords: string[] };
  nav: {
    now: string;
    work: string;
    services: string;
    experience: string;
    hire: string;
    contact: string;
    switchTo: string;
  };
  intro: string;
  hero: {
    eyebrow: string;
    lines: string[];
    sub: string;
    status: string;
    cta: string;
    cta2: string;
    scroll: string;
  };
  services: { index: string; label: string; title: string; intro: string; more: string; hireTitle: string; hireBody: string };
  /** The 3D "live system" in the hero. Flow captions follow FLOWS order in lib/system-graph.ts. */
  system: { label: string; live: string; nodes: Record<string, string>; flows: string[] };
  servicesPage: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    listLabel: string;
    processLabel: string;
    process: { title: string; body: string }[];
    offeringsLabel: string;
    proofLabel: string;
    faqLabel: string;
    faqs: { q: string; a: string }[];
    ctaTitle: string;
    ctaBody: string;
    ctaButton: string;
    emailSubject: string;
    otherServices: string;
  };
  hire: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    intro: string;
    bringLabel: string;
    bring: { title: string; body: string }[];
    rolesLabel: string;
    roles: string[];
    termsLabel: string;
    terms: string;
    experienceLabel: string;
    ctaTitle: string;
    ctaButton: string;
    emailSubject: string;
  };
  crumbs: { home: string };
  notes: {
    label: string;
    metaTitle: string;
    metaDescription: string;
    title: string;
    intro: string;
    all: string;
    minutes: string;
    by: string;
    related: string;
    more: string;
  };
  form: {
    topic: string;
    topics: { project: string; job: string; other: string };
    name: string;
    email: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    success: string;
    error: string;
    limited: string;
    direct: string;
    orEmail: string;
  };
  now: {
    index: string;
    label: string;
    title: string;
    intro: string;
    since: string;
    bus: [string, string, string];
    chapters: { kicker: string; title: string; body: string; tags: string[] }[];
  };
  work: {
    index: string;
    label: string;
    title: string;
    intro: string;
    hint: string;
    open: string;
    side: string;
    /** Ownership labels; {company} is replaced with the employer's name. */
    legend: { side: string; job: string; freelance: string };
    badge: { side: string; job: string; freelance: string };
  };
  stats: { index: string; label: string; title: string; items: Stat[] };
  method: { index: string; label: string; items: { title: string; body: string }[] };
  experience: {
    index: string;
    label: string;
    title: string;
    intro: string;
    present: string;
    current: string;
    projects: string;
    types: Record<string, string>;
  };
  toolbox: { label: string; groups: { name: string; items: string }[] };
  footer: {
    label: string;
    lines: [string, string];
    email: string;
    top: string;
    rights: string;
    servicesLabel: string;
    hireLink: string;
  };
  caseStudy: {
    type: string;
    typeValue: { side: string; job: string; freelance: string };
    backHistory: string;
    related: string;
    relatedCta: string;
    back: string;
    role: string;
    company: string;
    period: string;
    status: string;
    visit: string;
    built: string;
    stories: string;
    numbers: string;
    stack: string;
    next: string;
  };
};

const en: Dictionary = {
  meta: {
    title: 'Daniel Chen | Fintech & Crypto Software Engineer in Malaysia',
    description:
      'Kuala Lumpur software engineer building crypto and trading platforms, payment integrations, websites and mobile apps. Open to projects and full-time roles.',
    keywords: [
      'Daniel Chen',
      '曾祈荣',
      'software engineer Malaysia',
      'freelance software developer Kuala Lumpur',
      'hire backend engineer Malaysia',
      'crypto trading platform developer',
      'MetaTrader 5 developer',
      'MT5 integration',
      'prop firm platform development',
      'payment gateway integration',
      'web developer Malaysia',
      'mobile app developer Malaysia',
      'Flutter developer',
      'Next.js developer',
      'Python FastAPI developer',
      'fintech software engineer',
    ],
  },
  nav: {
    now: 'Now',
    work: 'Work',
    services: 'Services',
    experience: 'Work history',
    hire: 'Hire me',
    contact: 'Contact',
    switchTo: '中文',
  },
  intro: 'Loading the good parts',
  hero: {
    eyebrow: 'Daniel Chen · Senior Backend Engineer',
    lines: ['Backend systems', 'for money that', 'has to add up.'],
    sub: 'I build crypto and trading platforms, payment integrations, websites and mobile apps in Python, Go, TypeScript and C#, and I trace bugs across service boundaries to the exact line.',
    status: 'Open to projects and roles · Kuala Lumpur',
    cta: 'See the work',
    cta2: 'Start a project',
    scroll: 'Scroll',
  },
  system: {
    label: 'A fintech system like the ones I build, with messages flowing between services',
    live: 'Live',
    nodes: {
      client: 'Client app',
      api: 'Portal API',
      mq: 'RabbitMQ',
      bo: 'Back office',
      pay: 'Payments',
      trade: 'Trading engine',
      db: 'Database',
      risk: 'Risk monitor',
    },
    flows: [
      'Deposit: client app → API → payments → RabbitMQ → back office',
      'Trade: client app → API → RabbitMQ → trading engine → risk monitor',
      'KYC sync: back office → RabbitMQ → portal API → database',
    ],
  },
  services: {
    index: '03',
    label: 'Services',
    title: 'Need something built? I take on projects.',
    intro: 'For companies and founders who need software that works with money, data or customers. Tell me what you are building and we will see if I am the right fit.',
    more: 'Learn more',
    hireTitle: 'Hiring for your team?',
    hireBody: 'Open to senior backend and full-stack roles, full-time or contract.',
  },
  servicesPage: {
    metaTitle: 'Software Development Services in Malaysia | Daniel Chen',
    metaDescription:
      'Hire Kuala Lumpur software engineer Daniel Chen for crypto and trading systems, payment integration, websites, mobile apps and backends. Remote worldwide.',
    eyebrow: 'Services',
    title: 'Software development for fintech, trading and growing businesses.',
    intro:
      'I am Daniel Chen, a senior backend engineer in Kuala Lumpur. I take on project work for companies and founders: crypto and trading systems, payments, websites, mobile apps and backends. Tell me what you are building and we will work out whether I am the right fit.',
    listLabel: 'What I can build for you',
    processLabel: 'How we would work',
    process: [
      { title: 'A short call', body: 'A no-obligation conversation about what you need, what exists already and what success looks like.' },
      { title: 'A written scope', body: 'What I will build, what I will not, the risks, and a fixed quote or a time-based estimate.' },
      { title: 'Small, visible releases', body: 'You see working software early and often, on a staging site you can click through.' },
      { title: 'Handover and support', body: 'Documentation, access and a clean handover, with ongoing support if you want it.' },
    ],
    offeringsLabel: 'What I can do',
    proofLabel: 'Proof, not promises',
    faqLabel: 'Questions',
    faqs: [
      {
        q: 'Where are you based, and who do you work with?',
        a: 'Kuala Lumpur, Malaysia (GMT+8). I work remotely with companies and founders in Malaysia, Singapore and anywhere else, in English or Chinese.',
      },
      {
        q: 'How much does a project cost?',
        a: 'It depends on scope. After a short call I send a written scope with a fixed quote or a time-based estimate, so you know the cost before anything starts.',
      },
      {
        q: 'Will you sign an NDA?',
        a: 'Yes, happy to sign one before you share the details.',
      },
      {
        q: 'Are you also open to a job?',
        a: 'Yes, for the right senior backend or full-stack role, full-time or contract.',
      },
    ],
    ctaTitle: 'Tell me what you are building.',
    ctaBody: 'A few lines are enough: what it is, who it is for, and when you need it. The form is just below, or email me if you prefer. I usually reply within two working days.',
    ctaButton: 'Tell me about your project',
    emailSubject: 'Project enquiry',
    otherServices: 'Other services',
  },
  hire: {
    metaTitle: 'Hire a Senior Backend Engineer in Malaysia | Daniel Chen',
    metaDescription:
      'Kuala Lumpur senior backend engineer with fintech experience in payments, crypto trading platforms and MetaTrader 5. Open to full-time and contract roles.',
    eyebrow: 'Hire me',
    title: 'Hire a senior backend engineer.',
    intro:
      'I am open to senior backend and full-stack roles. My background is fintech: payments, crypto trading platforms, MetaTrader 5 and event-driven systems, with web and mobile work on the side.',
    bringLabel: 'What I bring',
    bring: [
      {
        title: 'Production fintech experience',
        body: 'Payment methods live in production, a crypto trading back office, an MT5 risk engine for a prop-trading platform, and payment work for clients in Hong Kong.',
      },
      {
        title: 'Debugging across services',
        body: 'I trace problems through logs, databases and queues to the exact line, prove the cause, then make the smallest safe fix.',
      },
      {
        title: 'Range across the stack',
        body: 'Python, Go, TypeScript, Java and C# on the backend; Next.js, React and Flutter on the front; Docker, AWS and Cloudflare underneath.',
      },
      {
        title: 'Ownership end to end',
        body: 'I built and run SolveMY, a marketplace on web, Android and iOS, from the database to the app stores.',
      },
    ],
    rolesLabel: 'Roles I fit',
    roles: [
      'Senior Backend Engineer',
      'Full-Stack Engineer (backend-leaning)',
      'Payments or integrations engineer',
      'Trading or crypto platform engineer',
      'Early engineer at a startup',
    ],
    termsLabel: 'How',
    terms: 'Full-time or contract · Kuala Lumpur, hybrid or remote · English and Chinese',
    experienceLabel: 'Experience at a glance',
    ctaTitle: 'Want my résumé or a chat?',
    ctaButton: 'Send me a message',
    emailSubject: 'Role opportunity',
  },
  crumbs: { home: 'Home' },
  notes: {
    label: 'Notes',
    metaTitle: 'Notes on Trading Systems, Payments and Software | Daniel Chen',
    metaDescription:
      'Short, practical notes from real work: MetaTrader 5, prop-firm risk rules, payment webhooks, RabbitMQ, AI coding assistants and shipping mobile apps.',
    title: 'Notes from the work.',
    intro: 'Short, practical write-ups from building trading platforms, payments and apps.',
    all: 'All notes',
    minutes: '{n} min read',
    by: 'By Daniel Chen',
    related: 'Related service',
    more: 'More notes',
  },
  form: {
    topic: 'What is it about?',
    topics: { project: 'A project', job: 'A job or role', other: 'Something else' },
    name: 'Your name',
    email: 'Email',
    message: 'Message',
    messagePlaceholder: 'What are you building, or what is the role? A few lines is enough.',
    send: 'Send message',
    sending: 'Sending…',
    success: 'Thanks, it’s in my inbox. I usually reply within two working days.',
    error: 'That didn’t go through. Please email me directly at',
    limited: 'Too many messages from here just now. Please try again later or email me at',
    direct: 'Prefer email?',
    orEmail: 'or email me',
  },
  now: {
    index: '01',
    label: 'Now · current job',
    title: 'Senior Backend Engineer at CFI Financial.',
    intro:
      'A crypto trading platform and payment integrations at an online multi-asset broker. Two databases, one back office, one client portal, and RabbitMQ in between.',
    since: 'Since July 2026',
    bus: ['Back office', 'RabbitMQ', 'Client portal'],
    chapters: [
      {
        kicker: 'Payments',
        title: 'Three wallets, live in production.',
        body: 'Apple Pay, Google Pay and Benefit as separate Checkout.com deposit methods. Then I wrote the guide nobody had: running deposits and refunds end to end on a laptop, traps included.',
        tags: ['PSP sessions', 'Webhooks', 'Refunds'],
      },
      {
        kicker: 'Debugging',
        title: 'Bugs traced to the exact line, on both sides.',
        body: 'An HTTP 500 on trades: correlation id, Loki, duplicate asset pairs, deterministic resolution on every order path. A KYC edit that never reached the portal: dropped at the producer and the consumer, proven on pinned versions before a line changed.',
        tags: ['Grafana / Loki', 'RabbitMQ', 'Root cause first'],
      },
      {
        kicker: 'Building',
        title: 'Endpoints with permissions down to the field.',
        body: 'Paginated, filterable lists and CSV/PDF exports behind field-level access control for the maker-checker cancellation flow. 8-decimal precision for crypto amounts across APIs, models and ACL. Braze events for first deposits.',
        tags: ['FastAPI', 'SQLAlchemy', 'Casbin'],
      },
      {
        kicker: 'Shipping',
        title: 'Learning the lead’s side of the job by doing it.',
        body: 'Splitting stories into sub-tasks by layer, sequencing shared-library releases with tags and consumer pins, writing deploy order and Notes for QA, and demoing in sprint review. 38 PRs merged through lead review.',
        tags: ['Sprint planning', 'Library releases', 'Code review'],
      },
    ],
  },
  work: {
    index: '02',
    label: 'Selected work',
    title: 'What I’ve built.',
    intro: 'My own side project, plus systems I built in my jobs and freelance contracts. Every card says which.',
    hint: 'Scroll to move',
    open: 'Read the case study',
    side: 'Side project',
    legend: { side: 'My own side project', job: 'Built in a full-time job', freelance: 'Freelance contract' },
    badge: { side: 'My side project', job: 'Job · {company}', freelance: 'Freelance · {company}' },
  },
  stats: {
    index: '04',
    label: 'By the numbers',
    title: 'Receipts, not adjectives.',
    items: [
      { value: 3, label: 'Wallet payment methods in production', note: 'Apple Pay · Google Pay · Benefit' },
      { value: 38, label: 'PRs merged through lead review', note: 'CFI, July to October 2026' },
      { value: 235, label: 'REST endpoints in one Go API', note: 'SolveMY, 31 domain services' },
      { value: 1006, label: 'Go test functions', note: 'SolveMY backend' },
    ],
  },
  method: {
    index: '05',
    label: 'How I work',
    items: [
      { title: 'Reproduce first.', body: 'On unmodified code, at the exact versions the branch pins. A stale environment lies.' },
      { title: 'Prove the cause.', body: 'A log line by correlation id, the real DB row, the message on the queue. Then design.' },
      { title: 'Smallest change, right layer.', body: 'Extend what exists, check every caller, count the cost on the hot path.' },
      { title: 'Write down the deploy order.', body: 'Libraries before apps, strict consumers before producers, Notes for QA on every ticket.' },
    ],
  },
  experience: {
    index: '06',
    label: 'Work history',
    title: 'Jobs, contracts and side projects.',
    intro: 'Everything I’ve worked on, newest first. Each row says whether it was a full-time job, a freelance contract or my own side project. Open one to see what I did and the projects built there.',
    present: 'Present',
    current: 'Current job',
    projects: 'Projects built here',
    types: { 'full-time': 'Full-time', freelance: 'Freelance', contract: 'Contract', internship: 'Internship', side: 'Side project' },
  },
  toolbox: {
    label: 'Toolbox',
    groups: [
      { name: 'Languages', items: 'Python, Go, TypeScript, Java, C#, PHP, SQL, Dart' },
      { name: 'Backend', items: 'FastAPI, Pydantic, SQLAlchemy, chi, pgx, Spring Boot, ASP.NET Core, AdonisJS' },
      { name: 'Data & messaging', items: 'PostgreSQL, PostGIS, MySQL, Redis, MongoDB, RabbitMQ' },
      { name: 'Infrastructure', items: 'Docker, Kubernetes, AWS, Cloudflare, Hetzner, Vercel, nginx, GitHub Actions' },
      { name: 'Quality', items: 'pytest, Go test, Playwright, JUnit, SonarQube, Trivy, Grafana, Loki, Sentry' },
      { name: 'Clients', items: 'Next.js, React, Flutter, Tailwind CSS, GSAP' },
      {
        name: 'Domain',
        items: 'Payments (PSP sessions, webhooks, signatures, idempotency, refunds), crypto back office, MetaTrader 5, field-level access control',
      },
    ],
  },
  footer: {
    label: 'Contact',
    lines: ['Building something?', 'Hiring? Let’s talk.'],
    email: 'Email me',
    top: 'Back to top',
    rights: 'Built from scratch with Next.js, GSAP, Lenis and one WebGL shader.',
    servicesLabel: 'Services',
    hireLink: 'Hire me full-time',
  },
  caseStudy: {
    type: 'Type',
    typeValue: {
      side: 'My own side project',
      job: 'Built in my full-time job at {company}',
      freelance: 'Freelance contract for {company}',
    },
    backHistory: 'Work history',
    related: 'Need something like this?',
    relatedCta: 'See the service',
    back: 'All work',
    role: 'Role',
    company: 'Company',
    period: 'Period',
    status: 'Status',
    visit: 'Visit the live site',
    built: 'What I built',
    stories: 'Stories worth telling',
    numbers: 'Numbers',
    stack: 'Stack',
    next: 'Next project',
  },
};

const zhCN: Dictionary = {
  meta: {
    title: '曾祈荣 Daniel Chen | 马来西亚金融科技与加密货币软件工程师',
    description:
      '吉隆坡软件工程师，开发加密货币与交易平台、支付网关对接、网站和手机 App。承接项目合作，也欢迎全职与合同工作机会。',
    keywords: [
      '曾祈荣',
      'Daniel Chen',
      '马来西亚 软件工程师',
      '吉隆坡 程序员',
      '软件外包 马来西亚',
      '加密货币交易平台开发',
      'MT5 开发',
      'MetaTrader 5 对接',
      '自营交易平台开发',
      '支付网关对接',
      '马来西亚 网站开发',
      '马来西亚 App 开发',
      'Flutter 开发',
      '后端工程师 招聘',
    ],
  },
  nav: {
    now: '现在',
    work: '作品',
    services: '服务',
    experience: '经历',
    hire: '招聘我',
    contact: '联系',
    switchTo: 'EN',
  },
  intro: '加载中',
  hero: {
    eyebrow: '曾祈荣 · 高级后端工程师',
    lines: ['写后端，', '让每一笔钱', '都对得上。'],
    sub: '我用 Python、Go、TypeScript 和 C# 开发加密货币与交易平台、支付对接、网站和手机 App，也擅长跨服务追踪问题，一直追到具体那一行代码。',
    status: '承接项目，也看工作机会 · 吉隆坡',
    cta: '看看作品',
    cta2: '聊聊你的项目',
    scroll: '向下滚动',
  },
  system: {
    label: '我所构建的金融科技系统示意：消息在各个服务之间流动',
    live: '实时',
    nodes: {
      client: '客户端 App',
      api: '门户 API',
      mq: 'RabbitMQ',
      bo: '后台系统',
      pay: '支付',
      trade: '交易引擎',
      db: '数据库',
      risk: '风控监控',
    },
    flows: [
      '入金：客户端 → API → 支付 → RabbitMQ → 后台系统',
      '交易：客户端 → API → RabbitMQ → 交易引擎 → 风控监控',
      'KYC 同步：后台系统 → RabbitMQ → 门户 API → 数据库',
    ],
  },
  services: {
    index: '03',
    label: '服务',
    title: '需要开发系统？我承接项目。',
    intro: '面向需要处理资金、数据或客户的公司与创业者。告诉我你在做什么，我们看看我是否合适。',
    more: '了解更多',
    hireTitle: '正在为团队招人？',
    hireBody: '欢迎高级后端与全栈职位，全职或合同均可。',
  },
  servicesPage: {
    metaTitle: '马来西亚软件开发服务 | 曾祈荣 Daniel Chen',
    metaDescription:
      '找吉隆坡软件工程师曾祈荣开发加密货币与交易系统、支付网关对接、网站、手机 App 和后端系统。可远程合作，中英文沟通。',
    eyebrow: '服务',
    title: '为金融科技、交易平台和成长型企业开发软件。',
    intro:
      '我是曾祈荣（Daniel Chen），吉隆坡的高级后端工程师。我为公司和创业者承接项目：加密货币与交易系统、支付、网站、手机 App 和后端。告诉我你在做什么，我们一起判断我是否合适。',
    listLabel: '我能为你做什么',
    processLabel: '合作方式',
    process: [
      { title: '简短沟通', body: '先聊聊你的需求、现有系统，以及怎样才算成功，不需要任何承诺。' },
      { title: '书面范围', body: '做什么、不做什么、有哪些风险，以及固定报价或按时间的估算。' },
      { title: '小步、可见的发布', body: '你能尽早、频繁地在预发环境里看到可用的成果。' },
      { title: '交接与支持', body: '文档、权限与清晰的交接，需要的话提供后续支持。' },
    ],
    offeringsLabel: '我能做的',
    proofLabel: '用作品说话',
    faqLabel: '常见问题',
    faqs: [
      { q: '你在哪里？和哪些客户合作？', a: '马来西亚吉隆坡（GMT+8）。我远程服务马来西亚、新加坡及其他地区的公司和创业者，可用中文或英文沟通。' },
      { q: '项目费用怎么算？', a: '取决于范围。简短沟通之后，我会发出书面范围，附固定报价或按时间的估算，开工前你就清楚费用。' },
      { q: '可以签保密协议（NDA）吗？', a: '可以，在你分享细节之前就可以签。' },
      { q: '你也考虑全职工作吗？', a: '考虑。合适的高级后端或全栈职位，全职或合同都可以。' },
    ],
    ctaTitle: '告诉我你在做什么。',
    ctaBody: '几句话就够了：做什么、给谁用、什么时候需要。表单就在下方，也可以直接发邮件。我通常会在两个工作日内回复。',
    ctaButton: '和我聊聊你的项目',
    emailSubject: '项目咨询',
    otherServices: '其他服务',
  },
  hire: {
    metaTitle: '招聘马来西亚高级后端工程师 | 曾祈荣 Daniel Chen',
    metaDescription:
      '曾祈荣（Daniel Chen），吉隆坡高级后端工程师，具备支付、加密货币交易平台、MetaTrader 5 与事件驱动系统的金融科技经验。欢迎全职与合同职位。',
    eyebrow: '招聘我',
    title: '招聘一位高级后端工程师。',
    intro:
      '我在寻找高级后端与全栈职位。我的背景是金融科技：支付、加密货币交易平台、MetaTrader 5 和事件驱动系统，同时也做网站和手机 App。',
    bringLabel: '我能带来什么',
    bring: [
      {
        title: '金融科技生产经验',
        body: '已上线生产的支付方式、加密货币交易后台、自营交易平台的 MT5 风控引擎，以及为香港客户做的支付项目。',
      },
      { title: '跨服务排查问题', body: '通过日志、数据库和消息队列追踪问题，一直追到具体那一行，证明根因后做最小且安全的修复。' },
      {
        title: '覆盖全栈',
        body: '后端用 Python、Go、TypeScript、Java 和 C#；前端用 Next.js、React 和 Flutter；底层用 Docker、AWS 和 Cloudflare。',
      },
      { title: '端到端负责', body: '我独立构建并运营 SolveMY：覆盖网页、Android 和 iOS 的服务平台，从数据库一直到应用商店。' },
    ],
    rolesLabel: '适合的职位',
    roles: ['高级后端工程师', '全栈工程师（偏后端）', '支付或系统集成工程师', '交易或加密货币平台工程师', '创业公司早期工程师'],
    termsLabel: '方式',
    terms: '全职或合同 · 吉隆坡、混合或远程 · 中英文',
    experienceLabel: '经历一览',
    ctaTitle: '想要我的简历，或者聊一聊？',
    ctaButton: '给我留言',
    emailSubject: '工作机会',
  },
  crumbs: { home: '首页' },
  notes: {
    label: '笔记',
    metaTitle: '交易系统、支付与软件开发笔记 | 曾祈荣 Daniel Chen',
    metaDescription: '来自真实项目的简短实用笔记：MetaTrader 5、自营交易风控规则、支付回调、RabbitMQ、AI 编程助手与移动 App 上架。',
    title: '工作笔记。',
    intro: '在开发交易平台、支付系统和 App 过程中总结的简短实用经验。',
    all: '全部笔记',
    minutes: '阅读约 {n} 分钟',
    by: '作者：曾祈荣',
    related: '相关服务',
    more: '更多笔记',
  },
  form: {
    topic: '想聊什么？',
    topics: { project: '项目合作', job: '工作机会', other: '其他' },
    name: '你的名字',
    email: '邮箱',
    message: '留言',
    messagePlaceholder: '你在做什么项目，或者是什么职位？几句话就够了。',
    send: '发送',
    sending: '发送中…',
    success: '收到了，谢谢！我通常会在两个工作日内回复。',
    error: '发送失败，请直接发邮件到',
    limited: '发送太频繁了，请稍后再试，或直接发邮件到',
    direct: '更喜欢邮件？',
    orEmail: '或者发邮件',
  },
  now: {
    index: '01',
    label: '现在 · 目前任职',
    title: 'CFI Financial 高级后端工程师。',
    intro: '在一家在线多资产经纪商负责加密货币交易平台和支付集成。两个数据库，一个后台，一个客户门户，中间是 RabbitMQ。',
    since: '2026 年 7 月至今',
    bus: ['后台系统', 'RabbitMQ', '客户门户'],
    chapters: [
      {
        kicker: '支付',
        title: '三种钱包支付，已在生产环境上线。',
        body: '通过 Checkout.com 上线 Apple Pay、Google Pay 和 Benefit 三种独立入金方式。之后我写了一份团队一直缺少的指南：如何在本地端到端跑通入金和退款，连常见的坑都写清楚了。',
        tags: ['PSP 会话', 'Webhook', '退款'],
      },
      {
        kicker: '排查',
        title: '问题追到具体那一行，两端都查清。',
        body: '交易接口报 HTTP 500：关联 ID、Loki、重复的交易对，最后让所有下单路径的解析都变得确定。KYC 修改始终到不了客户门户：生产者和消费者两端都丢了数据，在改任何一行代码之前，先在相同依赖版本上证明。',
        tags: ['Grafana / Loki', 'RabbitMQ', '先找根因'],
      },
      {
        kicker: '构建',
        title: '权限细到每一个字段的接口。',
        body: '为“制单-复核”撤单流程提供带字段级权限控制的分页、可筛选列表与 CSV/PDF 导出。把加密货币金额的 8 位小数精度扩展到 API、模型和权限定义。为首次入金接入 Braze 事件。',
        tags: ['FastAPI', 'SQLAlchemy', 'Casbin'],
      },
      {
        kicker: '交付',
        title: '在实践中学习技术负责人的工作。',
        body: '按层拆分需求子任务，安排带标签和下游依赖锁定的共享库发版，写清部署顺序和测试说明，并在迭代评审中演示。已有 38 个 PR 经负责人评审后合并。',
        tags: ['迭代规划', '共享库发版', '代码评审'],
      },
    ],
  },
  work: {
    index: '02',
    label: '精选作品',
    title: '我做过的系统。',
    intro: '我自己的个人项目，以及我在全职工作和自由职业中开发的系统。每张卡片都标明了类型。',
    hint: '滚动浏览',
    open: '查看案例',
    side: '个人项目',
    legend: { side: '我自己的个人项目', job: '全职工作中开发', freelance: '自由职业合同' },
    badge: { side: '我的个人项目', job: '全职 · {company}', freelance: '自由职业 · {company}' },
  },
  stats: {
    index: '04',
    label: '数字说话',
    title: '用数据，不用形容词。',
    items: [
      { value: 3, label: '上线生产的钱包支付方式', note: 'Apple Pay · Google Pay · Benefit' },
      { value: 38, label: '经负责人评审合并的 PR', note: 'CFI，2026 年 7 月至 10 月' },
      { value: 235, label: '一个 Go API 中的 REST 接口', note: 'SolveMY，31 个领域服务' },
      { value: 1006, label: 'Go 测试函数', note: 'SolveMY 后端' },
    ],
  },
  method: {
    index: '05',
    label: '工作方式',
    items: [
      { title: '先复现。', body: '在未修改的代码上、按分支锁定的依赖版本复现。环境不对，结论就不可信。' },
      { title: '证明根因。', body: '按关联 ID 找到日志、真实的数据库记录、队列里的消息，然后才设计方案。' },
      { title: '最小改动，放在正确的层。', body: '优先扩展已有代码，检查每一个调用方，算清热点路径上的成本。' },
      { title: '写清部署顺序。', body: '先库后服务，严格的消费者先于生产者，每个工单都附上测试说明。' },
    ],
  },
  experience: {
    index: '06',
    label: '工作经历',
    title: '工作、合同与个人项目。',
    intro: '我做过的所有工作，按时间倒序。每一行都标明是全职工作、自由职业合同，还是我自己的个人项目。点开查看具体工作和开发的项目。',
    present: '至今',
    current: '目前任职',
    projects: '在这里开发的项目',
    types: { 'full-time': '全职', freelance: '自由职业', contract: '合同', internship: '实习', side: '个人项目' },
  },
  toolbox: {
    label: '工具箱',
    groups: [
      { name: '语言', items: 'Python、Go、TypeScript、Java、C#、PHP、SQL、Dart' },
      { name: '后端', items: 'FastAPI、Pydantic、SQLAlchemy、chi、pgx、Spring Boot、ASP.NET Core、AdonisJS' },
      { name: '数据与消息', items: 'PostgreSQL、PostGIS、MySQL、Redis、MongoDB、RabbitMQ' },
      { name: '基础设施', items: 'Docker、Kubernetes、AWS、Cloudflare、Hetzner、Vercel、nginx、GitHub Actions' },
      { name: '质量', items: 'pytest、Go test、Playwright、JUnit、SonarQube、Trivy、Grafana、Loki、Sentry' },
      { name: '客户端', items: 'Next.js、React、Flutter、Tailwind CSS、GSAP' },
      { name: '业务领域', items: '支付（PSP 会话、Webhook、签名校验、幂等、退款）、加密货币后台、MetaTrader 5、字段级权限控制' },
    ],
  },
  footer: {
    label: '联系',
    lines: ['要做系统？', '要招人？我们聊聊。'],
    email: '给我发邮件',
    top: '回到顶部',
    rights: '使用 Next.js、GSAP、Lenis 和一个 WebGL 着色器从零构建。',
    servicesLabel: '服务',
    hireLink: '招聘我（全职）',
  },
  caseStudy: {
    type: '类型',
    typeValue: {
      side: '我自己的个人项目',
      job: '在 {company} 全职工作期间开发',
      freelance: '为 {company} 做的自由职业项目',
    },
    backHistory: '工作经历',
    related: '需要类似的系统？',
    relatedCta: '查看相关服务',
    back: '全部作品',
    role: '角色',
    company: '公司',
    period: '时间',
    status: '状态',
    visit: '访问网站',
    built: '我做了什么',
    stories: '值得一讲的故事',
    numbers: '数字',
    stack: '技术栈',
    next: '下一个项目',
  },
};

export function getDictionary(locale: string): Dictionary {
  return locale === 'zh-CN' ? zhCN : en;
}
