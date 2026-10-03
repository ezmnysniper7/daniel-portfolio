export type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  note: string;
};

export type Dictionary = {
  meta: { title: string; description: string };
  nav: { now: string; work: string; experience: string; contact: string; switchTo: string };
  intro: string;
  hero: {
    eyebrow: string;
    lines: string[];
    sub: string;
    status: string;
    cta: string;
    scroll: string;
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
    archive: string;
  };
  stats: { index: string; label: string; title: string; items: Stat[] };
  method: { index: string; label: string; items: { title: string; body: string }[] };
  experience: { index: string; label: string; title: string; present: string; types: Record<string, string> };
  toolbox: { label: string; groups: { name: string; items: string }[] };
  footer: { label: string; lines: [string, string]; email: string; top: string; rights: string };
  caseStudy: {
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
    title: 'Daniel Chen · Senior Backend Engineer',
    description:
      'Senior Backend Engineer in fintech. Payments, event-driven systems and trading platforms in Python, Go, TypeScript and C#. Based in Malaysia.',
  },
  nav: { now: 'Now', work: 'Work', experience: 'Experience', contact: 'Contact', switchTo: '中文' },
  intro: 'Loading the good parts',
  hero: {
    eyebrow: 'Daniel Chen · Senior Backend Engineer',
    lines: ['Backend systems', 'for money that', 'has to add up.'],
    sub: 'I build payments, event-driven services and trading platforms in Python, Go, TypeScript and C#, and I trace bugs across service boundaries to the exact line.',
    status: 'Now at CFI Financial · Malaysia',
    cta: 'See the work',
    scroll: 'Scroll',
  },
  now: {
    index: '01',
    label: 'Now',
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
    title: 'Things I built, and still run.',
    intro: 'Side projects I own end to end, and client work from payments to trading.',
    hint: 'Scroll to move',
    open: 'Read the case study',
    side: 'Side project',
    archive: 'Archive',
  },
  stats: {
    index: '03',
    label: 'By the numbers',
    title: 'Receipts, not adjectives.',
    items: [
      { value: 3, label: 'Wallet payment methods in production', note: 'Apple Pay · Google Pay · Benefit' },
      { value: 38, label: 'PRs merged through lead review', note: 'CFI, July to October 2026' },
      { value: 235, label: 'REST endpoints in one Go API', note: 'SolveMY, 31 domain services' },
      { value: 1006, label: 'Go test functions', note: 'SolveMY backend' },
      { value: 250, prefix: '~', label: 'Commits in six months', note: 'TradersFlow, 5 repositories' },
      { value: 124, label: 'End-to-end tests', note: 'Dan, three languages' },
    ],
  },
  method: {
    index: '04',
    label: 'How I work',
    items: [
      { title: 'Reproduce first.', body: 'On unmodified code, at the exact versions the branch pins. A stale environment lies.' },
      { title: 'Prove the cause.', body: 'A log line by correlation id, the real DB row, the message on the queue. Then design.' },
      { title: 'Smallest change, right layer.', body: 'Extend what exists, check every caller, count the cost on the hot path.' },
      { title: 'Write down the deploy order.', body: 'Libraries before apps, strict consumers before producers, Notes for QA on every ticket.' },
    ],
  },
  experience: {
    index: '05',
    label: 'Experience',
    title: 'Where I’ve shipped.',
    present: 'Present',
    types: { 'full-time': 'Full-time', freelance: 'Freelance', contract: 'Contract', internship: 'Internship' },
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
    lines: ['Got a system that', 'has to be right?'],
    email: 'Email me',
    top: 'Back to top',
    rights: 'Built from scratch with Next.js, GSAP, Lenis and one WebGL shader.',
  },
  caseStudy: {
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
    title: '曾祈荣 Daniel Chen · 高级后端工程师',
    description: '金融科技高级后端工程师。支付、事件驱动系统与交易平台，使用 Python、Go、TypeScript 和 C#。现居马来西亚。',
  },
  nav: { now: '现在', work: '作品', experience: '经历', contact: '联系', switchTo: 'EN' },
  intro: '加载中',
  hero: {
    eyebrow: '曾祈荣 · 高级后端工程师',
    lines: ['写后端，', '让每一笔钱', '都对得上。'],
    sub: '我用 Python、Go、TypeScript 和 C# 构建支付、事件驱动服务和交易平台，也擅长跨服务追踪问题，一直追到具体那一行代码。',
    status: '现任职于 CFI Financial · 马来西亚',
    cta: '看看作品',
    scroll: '向下滚动',
  },
  now: {
    index: '01',
    label: '现在',
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
    title: '我做过、并且仍在运行的系统。',
    intro: '我端到端负责的个人项目，以及从支付到交易的客户项目。',
    hint: '滚动浏览',
    open: '查看案例',
    side: '个人项目',
    archive: '更多项目',
  },
  stats: {
    index: '03',
    label: '数字说话',
    title: '用数据，不用形容词。',
    items: [
      { value: 3, label: '上线生产的钱包支付方式', note: 'Apple Pay · Google Pay · Benefit' },
      { value: 38, label: '经负责人评审合并的 PR', note: 'CFI，2026 年 7 月至 10 月' },
      { value: 235, label: '一个 Go API 中的 REST 接口', note: 'SolveMY，31 个领域服务' },
      { value: 1006, label: 'Go 测试函数', note: 'SolveMY 后端' },
      { value: 250, prefix: '~', label: '六个月内的提交', note: 'TradersFlow，5 个代码仓库' },
      { value: 124, label: '端到端测试', note: 'Dan，三种语言' },
    ],
  },
  method: {
    index: '04',
    label: '工作方式',
    items: [
      { title: '先复现。', body: '在未修改的代码上、按分支锁定的依赖版本复现。环境不对，结论就不可信。' },
      { title: '证明根因。', body: '按关联 ID 找到日志、真实的数据库记录、队列里的消息，然后才设计方案。' },
      { title: '最小改动，放在正确的层。', body: '优先扩展已有代码，检查每一个调用方，算清热点路径上的成本。' },
      { title: '写清部署顺序。', body: '先库后服务，严格的消费者先于生产者，每个工单都附上测试说明。' },
    ],
  },
  experience: {
    index: '05',
    label: '工作经历',
    title: '我交付过的地方。',
    present: '至今',
    types: { 'full-time': '全职', freelance: '自由职业', contract: '合同', internship: '实习' },
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
    lines: ['你的系统', '必须算得准？'],
    email: '给我发邮件',
    top: '回到顶部',
    rights: '使用 Next.js、GSAP、Lenis 和一个 WebGL 着色器从零构建。',
  },
  caseStudy: {
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
