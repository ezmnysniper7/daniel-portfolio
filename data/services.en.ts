import type { Service } from './services';

/** No em dashes, by request. Every "offerings" list is delivered work; anything not yet delivered sits under "capability". */
export const servicesEn: Service[] = [
  {
    slug: 'fintech-technical-partner',
    tier: 'primary',
    title: 'Technical partner for fintech founders',
    headline: 'A technical partner for fintech founders.',
    audience: 'For founders with an idea, a prototype or a codebase that needs an owner.',
    short:
      'A hands-on founding engineer or fractional CTO: discovery, architecture, backend, front end, infrastructure and delivery, working directly with you.',
    metaTitle: 'Fractional CTO & Founding Engineer for Fintech | Daniel Chen',
    metaDescription:
      'A hands-on fractional CTO and founding engineer for fintech startups, brokers and prop firms: technical discovery, architecture, MVP build and leadership.',
    serviceType: 'Fractional CTO and founding engineer services for fintech startups',
    intro:
      'You have a financial product to build and no technical co-founder, or a developer who needs direction. You do not need an agency with account managers. You need one experienced engineer who understands money systems, makes the technical decisions with you, and then builds the thing.',
    offeringsLabel: 'What I take on',
    offerings: [
      {
        title: 'Technical discovery',
        body: 'Before anything is built: what you actually need, what your third-party access really allows, where the legal questions sit, and what a first release should leave out.',
      },
      {
        title: 'Architecture and feasibility',
        body: 'A written architecture you could hand to any team: components, data model, integrations, failure handling, hosting and running cost, with the trade-offs in plain language.',
      },
      {
        title: 'MVP development',
        body: 'Backend, front end, database and deployment, built in milestones on a staging environment you can use from the first weeks.',
      },
      {
        title: 'Infrastructure and operations',
        body: 'Environments, CI, backups, monitoring and alerts, plus runbooks so the system can be operated by someone other than me.',
      },
      {
        title: 'Working with your developer',
        body: 'If you already have an engineer or a front end, I read what exists, keep what is sound, and take the architecture and the risky parts.',
      },
      {
        title: 'Longer-term technical leadership',
        body: 'After launch I can stay on as your technical lead: roadmap, code review, hiring help and the releases that carry real risk.',
      },
    ],
    proof: [
      {
        text: 'I built a three-sided marketplace alone, end to end: Go API, Next.js website, Flutter apps, infrastructure and store releases. It is live.',
        slug: 'solvemy',
      },
      {
        text: 'On a live prop-trading platform I owned the MetaTrader 5 integration and the monitor that fails accounts within seconds of a breach.',
        slug: 'tradersflow',
      },
      {
        text: 'My full-time role is on a live multi-asset broker: payment methods in production, a crypto back office and event-driven services.',
        slug: 'cfi-broker-payments-crypto-backend',
      },
    ],
    faqs: [
      {
        q: 'Are you a fractional CTO or a founding engineer?',
        a: 'The work is the same: architecture, building, infrastructure and technical decisions, done hands-on. "Fractional CTO" fits when you already have developers and need direction. "Founding engineer" fits when I am the one building. I am happy with either label and prefer to describe the work.',
      },
      {
        q: 'Can one engineer really build a fintech MVP?',
        a: 'A focused first release, yes, and I have done it for a marketplace of comparable breadth. What makes it possible is scope discipline: one integration route, manual operations where automation can wait, and a modular codebase other engineers can join later. I will tell you early if your scope needs more people.',
      },
      {
        q: 'What does a first engagement look like?',
        a: 'Usually a paid discovery sprint of one to three weeks. You get a written architecture, a risk list and a milestone plan with prices. You can then build with me or take the documents to another team.',
      },
      {
        q: 'How do you use AI coding tools?',
        a: 'Every day, for speed. Each change still goes through the same checks as hand-written code: tests, a read of the diff and a run on staging. AI assistance does not replace verification, least of all on money paths.',
      },
      {
        q: 'How much of your time do we get?',
        a: 'I take on a small number of engagements at a time and I am clear about capacity before we start. We agree working days, overlap hours and response times in writing.',
      },
      {
        q: 'Who handles licences, KYC policy and regulation?',
        a: 'You and your advisers. I am an engineer, not a lawyer or a regulated entity. I design the system so that the controls they ask for (approvals, audit trails, record keeping) can be met, and I will say when a feature needs a legal answer before it is built.',
      },
    ],
  },
  {
    slug: 'mt5-manager-api-developer',
    tier: 'primary',
    title: 'MT5 Manager API integration',
    headline: 'MT5 Manager API developer for brokers and prop firms.',
    audience: 'For brokers, prop firms and platform teams whose product depends on MetaTrader 5 data.',
    short:
      'Services on the MetaTrader 5 Manager API and Web API: accounts, positions, deals, balance operations and real-time risk monitoring, from an engineer who has run one in production.',
    metaTitle: 'MT5 Manager API Developer for Brokers & Prop Firms | Daniel Chen',
    metaDescription:
      'Hire an MT5 Manager API developer who built one for a live prop firm: C#/.NET services, real-time risk monitoring, back-office sync and MetaTrader 5 integration.',
    serviceType: 'MetaTrader 5 Manager API development and integration',
    intro:
      "I built the MetaTrader 5 integration for a live prop-trading platform: a C#/.NET service on MetaQuotes' native Manager API, and a monitor that checks every account's loss rules every few seconds. If your product depends on MT5 data being fast and correct, this is work I have already done in production.",
    offeringsLabel: 'Delivered in production',
    offerings: [
      {
        title: 'Manager API services',
        body: 'A standalone C#/.NET service: accounts, positions, deals, orders, daily history, batch reads and trading-rights control, secured with API keys and an IP allow-list.',
      },
      {
        title: 'Real-time risk monitoring',
        body: 'Daily-loss, max-loss and equity rules checked every few seconds from the locally pumped cache, with idempotent fail flows.',
      },
      {
        title: 'Backend integration',
        body: 'A typed client in your backend, rule snapshots published through Redis, and callbacks that are safe to retry.',
      },
      {
        title: 'Admin tooling on MT5 data',
        body: 'Account statistics and guarded admin actions: manual pass or fail, freeze, close all positions.',
      },
      {
        title: 'Health and operations',
        body: 'Connection health checks, alert emails, auto-reconnect, separate demo and live services, and a deployment runbook.',
      },
      {
        title: 'Performance and correctness fixes',
        body: 'Finding out why reads are slow or numbers disagree: pumped cache versus network requests, SDK thread safety, deal classification and day boundaries.',
      },
    ],
    capability: {
      title: 'Investor portals, wallets and IB commissions',
      intro:
        'Products I can design and build on top of an MT5 integration. I have not delivered this exact combination as a finished product. The MT5, payment and dashboard parts each come from production work.',
      items: [
        {
          title: 'Investor dashboards',
          body: 'Trading history, P&L, balance, equity, margin and performance reports per account, with balance-threshold alerts.',
        },
        {
          title: 'Wallets on a ledger',
          body: 'Separate investor and IB wallets on a double-entry ledger: deposits, withdrawals, internal transfers and commission deductions, each posted exactly once.',
        },
        {
          title: 'IB and sub-IB commissions',
          body: 'Multi-level referral trees, commission formulas agreed in writing with worked examples, and month-end runs that can be resumed and audited.',
        },
        {
          title: 'CRM and back-office sync',
          body: 'MT5 accounts, groups and balance operations kept in step with your CRM or client area through an adapter, not scattered API calls.',
        },
      ],
      caveat:
        "Two things decide feasibility before any code: what MT5 access you really have (a Manager login belongs to one broker's server) and whether the wallet you describe is regulated in your market. A discovery sprint answers both.",
    },
    proof: [
      {
        text: 'The MT5 Manager API service and real-time breach monitor for a live prop-trading platform, including the incident that taught me the SDK is not thread-safe.',
        slug: 'tradersflow',
      },
    ],
    faqs: [
      {
        q: 'Do you have your own MT5 server or Manager API licence?',
        a: 'No. Manager API access belongs to the broker or the firm that licenses the MT5 server. I build with the access you have, and the first step is confirming exactly what that access allows.',
      },
      {
        q: 'Manager API or Web API?',
        a: 'Often both. The Manager API keeps a live local copy of users and positions, so reads take milliseconds, which is what monitoring needs. The Web API is plain HTTPS and easy to call from any backend, and is fine for low-volume reads and for writes. I have used both on the same platform.',
      },
      {
        q: 'Can one integration read accounts at several brokers?',
        a: "Not with one login. A Manager or Web API login is tied to a single broker's server. Several brokers means one access route per broker behind a common adapter, and accounts identified by server and login together.",
      },
      {
        q: 'Which languages do you use for MT5 work?',
        a: "C#/.NET on the native Manager API in production. I have also worked with MetaQuotes' Python manager package in my own prototype, tested against a simulator. The rest of your backend can be in any language: it talks to the MT5 service over HTTP.",
      },
      {
        q: 'Can you fix an existing MT5 integration?',
        a: 'Yes. Slow reads, accounts showing the wrong figures and rule calculations that disagree with the terminal are problems I have traced and fixed. I reproduce the problem and prove the cause before changing code.',
      },
      {
        q: "Do you also work with MT4?",
        a: "Yes, starting with a proof of concept. MT4 has its own, older Manager API. My production work is on MT5, and the design carries over: one service that owns the connection, a local copy of the data for fast reads, and writes that are safe to retry.",
      },
      {
        q: "Do you build MT5 server plugins?",
        a: "I can take one on, and I have not shipped one yet. My production work is on the Manager API and Web API, which cover a lot of what firms ask a plugin for: account and balance operations, monitoring and reporting. A server plugin is C++ running inside the trade server itself, where a fault affects every client. So I start with a small proof of concept on a test server and have it reviewed before it goes near production.",
      },
      {
        q: 'Do you build Expert Advisors, indicators or trading bots?',
        a: 'No. I build server-side systems for firms: integrations, monitoring, back offices and portals. Not strategies or signals.',
      },
    ],
  },
  {
    slug: 'forex-crm-development',
    tier: 'primary',
    title: "Forex CRM & trader's room development",
    headline: "Custom forex CRM and trader's room development on MT5.",
    audience: 'For brokers and investment firms that have outgrown an off-the-shelf CRM.',
    evidenceLabel: 'Related work in production',
    short:
      "Client areas, back offices, investor dashboards and IB commission systems connected to MetaTrader 5, built custom when a standard forex CRM does not fit.",
    metaTitle: "Custom Forex CRM & Trader's Room Development (MT5) | Daniel Chen",
    metaDescription:
      "Custom forex CRM, trader's room and IB commission system development on MetaTrader 5, from an engineer with broker back-office and MT5 work in production.",
    serviceType: "Forex CRM, trader's room and IB commission system development",
    intro:
      'A forex CRM is three systems that have to agree: the client area, the back office and MetaTrader 5. I have built parts of each on live platforms, for a prop firm and for a multi-asset broker. I have not shipped a complete forex CRM as one product, and this page says exactly which parts are proven.',
    offeringsLabel: 'Parts I have delivered in production',
    offerings: [
      {
        title: 'MT5 data inside your own system',
        body: 'A Manager API service that serves accounts, positions, deals, orders and daily history to the back office in milliseconds, with trading-rights control.',
      },
      {
        title: 'Back-office APIs with approvals',
        body: 'Transaction views, maker-checker approvals, paginated lists and CSV or PDF exports, behind role and field-level permissions.',
      },
      {
        title: 'Client area and back office in step',
        body: 'Client profile and KYC changes carried between the client portal and the back office through a message queue, so the two never disagree for long.',
      },
      {
        title: 'Deposits',
        body: 'Apple Pay, Google Pay and Benefit as deposit methods through Checkout.com at a live broker, with webhooks and refunds.',
      },
      {
        title: 'Admin tooling on MT5 accounts',
        body: 'Account statistics and guarded staff actions: manual pass or fail, freeze and close all positions.',
      },
      {
        title: 'Attribution and fraud signals',
        body: 'First-touch campaign capture, a funnel from click to purchase, and login IP history with duplicate-IP flags.',
      },
    ],
    capability: {
      title: 'The complete CRM: client area, wallets and IB commissions',
      intro:
        'These are the parts that turn those pieces into a full forex CRM. I can design and build them. I have not delivered them as one finished product, so each starts with a written design and a proof of concept on your MT5 access.',
      items: [
        {
          title: "Trader's room",
          body: 'Registration, KYC status, MT5 account opening, deposits, withdrawals, internal transfers and trading history in one client area.',
        },
        {
          title: 'Investor portal',
          body: 'P&L, balance, equity, margin and performance reports per account, with statements an investor can download and balance alerts.',
        },
        {
          title: 'Wallets on a ledger',
          body: 'Client, investor and IB wallets on a double-entry ledger, where every deposit, withdrawal, transfer and fee is posted exactly once.',
        },
        {
          title: 'Multi-level IB commissions',
          body: 'Referral trees with sub-IBs, lot, spread or volume based formulas agreed in writing with worked examples, and commission runs that can be resumed and audited.',
        },
        {
          title: 'Performance fees',
          body: 'Fees on investor profit with a high-water mark, calculated from MT5 deals and shown line by line on the statement.',
        },
        {
          title: 'Staff roles and audit trail',
          body: 'Permissions enforced on the server for every action, second-person approval for money movements, and a log of who did what.',
        },
      ],
      caveat:
        "Two things decide feasibility before any code: what MT5 access you really have (a Manager login belongs to one broker's server) and whether the wallet you describe is regulated in your market. A discovery sprint answers both.",
    },
    proof: [
      {
        text: 'The MT5 Manager API service, admin tooling and marketing attribution for a live prop-trading platform.',
        slug: 'tradersflow',
      },
      {
        text: 'Back-office APIs, maker-checker flows, field-level permissions and payment methods at a live multi-asset broker.',
        slug: 'cfi-broker-payments-crypto-backend',
      },
    ],
    faqs: [
      {
        q: 'Should we buy a forex CRM or build one?',
        a: 'Buy one if a standard product fits how you operate: it is faster and cheaper to start. Build or extend when your IB plan, investor structure or approval rules do not fit the product, or when you need to own the code and the data. I will say so in the first call if buying is the better answer for you.',
      },
      {
        q: 'Can you connect MT5 to the CRM or client area we already have?',
        a: 'Yes. MT5 integration is work I have done in production. Accounts, groups, balances and trading history are kept in step through one adapter on the Manager API or Web API, so the rest of your system never calls MT5 directly.',
      },
      {
        q: 'How do you calculate multi-level IB commissions?',
        a: 'From MT5 deals, with a formula we agree in writing first, including worked examples for each tier. Runs are idempotent, so a failed month-end can be resumed without paying anyone twice, and every figure can be traced back to the deals behind it.',
      },
      {
        q: 'Do you build PAMM, MAM or copy-trading systems?',
        a: "Yes, as a new build. I have not delivered one yet, and I say so up front. The core is allocation accounting: each investor's share of the master account's results, worked out from MT5 deals and posted exactly once, with performance fees on a high-water mark. That rests on what I already run in production: reading MT5 deals reliably and making money events safe to retry. MAM and copy trading also place trades on client accounts, which depends on the rights your MT5 server grants, so I start with a proof of concept on your server.",
      },
      {
        q: 'Do you work with MT4, cTrader, Match-Trader or DXtrade?',
        a: 'Yes. The job is the same on each platform: one adapter that keeps accounts, balances and trading history in step with your system, with every write made safe to retry. My production work so far is on MetaTrader 5 and I have not yet shipped on the others, so on a new platform I begin with a short proof of concept against your server before quoting the build.',
      },
      {
        q: 'Is a client wallet regulated?',
        a: 'Often, yes. Holding client money or moving it between people can need a licence, depending on your market. I am an engineer, not a lawyer or a regulated firm: I design the system so the rules can be met, and your legal adviser confirms what those rules are.',
      },
      {
        q: 'Do you have your own MT5 server or Manager API licence?',
        a: 'No. Manager API access belongs to the broker or the firm that licenses the MT5 server. I build with the access you have, and the first step is confirming exactly what that access allows.',
      },
    ],
  },
  {
    slug: 'prop-firm-software-development',
    tier: 'primary',
    title: 'Prop firm software development',
    headline: 'Custom prop firm software, built around the rules.',
    audience: 'For prop-trading firms and founders launching one.',
    short:
      'Challenge rules, real-time breach monitoring, MT5 account operations, admin tools and attribution for prop-trading firms, from an engineer who built them on a live platform.',
    metaTitle: 'Custom Prop Firm Software Development (MT5) | Daniel Chen',
    metaDescription:
      'Custom prop firm software by an engineer who built the MT5 integration and real-time risk monitor for a live prop-trading platform. Rules, payouts and admin.',
    serviceType: 'Prop trading firm software development',
    intro:
      'A prop firm is a rules engine with a checkout attached. The product only works if every account is judged by the same rules, within seconds, and the firm can prove it afterwards. I built the MetaTrader 5 integration and the real-time breach monitor for a live prop-trading platform, and worked across its backend and both dashboards.',
    offeringsLabel: 'Delivered on a live platform',
    offerings: [
      {
        title: 'Real-time rule enforcement',
        body: 'Daily-loss, max-loss and instant-account rules checked on every active account every few seconds, with breached accounts failed through an idempotent flow.',
      },
      {
        title: 'MT5 account operations',
        body: 'Accounts, positions, deals and trading rights through a dedicated service on the MT5 Manager API, with separate demo and live instances.',
      },
      {
        title: 'Pass, fail and promotion logic',
        body: 'One shared calculation for fail decisions, and promotion only when equity agrees across two independent MT5 sources.',
      },
      {
        title: 'Admin dashboard',
        body: 'KYC review, MT5 account statistics, guarded admin actions (manual pass or fail, freeze, close all positions), affiliate reporting and a promotions wizard.',
      },
      {
        title: 'Marketing attribution',
        body: 'First-touch UTM and click-ID capture, campaign short links, a funnel from click to purchase and cohort retention reporting.',
      },
      {
        title: 'Fraud signals and service health',
        body: 'Login IP and location history with duplicate-IP flags, and MT5 service health monitoring with alerts and auto-reconnect.',
      },
    ],
    capability: {
      title: 'A complete platform, purchase to payout',
      intro:
        'The full product is larger than the parts I delivered on a live platform. The rest is listed here as work I can design and build, not as something I have already run in production.',
      items: [
        {
          title: 'Challenge catalogue and checkout',
          body: 'Phases, account sizes, promo codes and local payment methods, with prices computed on the server.',
        },
        {
          title: 'Account provisioning',
          body: 'A paid order opens exactly one MT5 account, even when the payment callback arrives twice or the MT5 call times out.',
        },
        {
          title: 'One rules engine',
          body: 'Loss limits, profit targets, minimum trading days, consistency and scaling rules implemented once and tested against recorded deal histories.',
        },
        {
          title: 'Payouts',
          body: 'Eligibility, profit split, approval by a second person and a record of every payout.',
        },
        {
          title: 'Staff roles and audit',
          body: 'Permissions enforced on the server for every action, and a log of who did what.',
        },
      ],
      caveat:
        "Before a new platform takes real money it needs a proof of concept on your MT5 server, your payment providers' approval for the business model, and your own legal advice on what you are selling.",
    },
    proof: [
      {
        text: 'The MT5 integration service and real-time breach monitor for a live prop-trading platform, plus its admin dashboard and marketing attribution.',
        slug: 'tradersflow',
      },
    ],
    faqs: [
      {
        q: 'Can you build a prop firm platform from scratch?',
        a: 'Yes, with clear limits. On a live platform I delivered the MT5 integration, the risk monitor, the admin dashboard and attribution. The rest of the product I can design and build, and have not yet delivered end to end. For a new firm I start with a discovery sprint and a proof of concept on your MT5 server.',
      },
      {
        q: 'Do we need our own MT5 server?',
        a: 'You need access to one: your own licence, or a white-label arrangement with a provider. The integration uses the access you have. I do not supply MT5 licences.',
      },
      {
        q: 'How fast is a breach detected?',
        a: 'On the live platform I worked on, every active account is checked about every five seconds. The interval is a design choice that depends on account numbers and on how the Manager API connection is used.',
      },
      {
        q: 'Can you take over or fix an existing platform?',
        a: 'Yes. I start by reading the money paths and the rule calculations, and I write down what is risky before changing anything.',
      },
      {
        q: 'Do you work with cTrader, Match-Trader or DXtrade?',
        a: 'My production experience is MetaTrader 5. The rules, payments and admin sides carry over. A different trading platform means a new adapter and a proof of concept first.',
      },
    ],
  },
  {
    slug: 'trading-platform-engineering',
    tier: 'primary',
    title: 'Trading platform & brokerage engineering',
    headline: 'Trading platform and broker back-office engineering.',
    audience: 'For brokers and founders building or extending their own trading infrastructure.',
    short:
      'Broker back offices, client portals, risk components and the integrations between them, designed for correctness first and for multi-brand operation later.',
    metaTitle: 'Broker Back Office & Trading Platform Engineering | Daniel Chen',
    metaDescription:
      'Broker back office, client portal, risk and execution components for trading platforms, from an engineer working on live broker and prop-trading systems.',
    serviceType: 'Trading platform and brokerage back-office engineering',
    intro:
      'A trading platform is a ledger with a price feed attached, and both have to be right at the same time. My recent years have been inside live broker and prop-trading systems: back-office APIs, risk monitors, payment flows and the services between them. I bring that to teams building their own platform.',
    offeringsLabel: 'Work I do on live systems',
    offerings: [
      {
        title: 'Broker back-office APIs',
        body: 'Order and transaction views, maker-checker approvals, paginated lists and CSV or PDF exports, behind role and field-level permissions.',
      },
      {
        title: 'Crypto and multi-asset precision',
        body: '8-decimal amounts carried correctly through APIs, models and access-control definitions.',
      },
      {
        title: 'Risk monitoring',
        body: 'Loss and equity rules checked continuously, with safeguards that refuse to act on numbers that do not add up.',
      },
      {
        title: 'Integrations',
        body: 'MetaTrader 5, payment providers, KYC data and messaging platforms, with signed webhooks and retries.',
      },
      {
        title: 'Event-driven sync',
        body: 'Client portal and back office kept consistent through a message queue, including the deploy order that keeps both sides working.',
      },
      {
        title: 'Production debugging',
        body: 'Tracing a failure across services by correlation id to the exact line, proving the cause, then making the smallest safe fix.',
      },
    ],
    proof: [
      {
        text: 'Senior Backend Engineer on a live multi-asset broker: crypto back-office APIs, maker-checker flows, field-level permissions and payment methods in production.',
        slug: 'cfi-broker-payments-crypto-backend',
      },
      {
        text: 'The MT5 integration service and real-time breach monitor for a live prop-trading platform.',
        slug: 'tradersflow',
      },
    ],
    faqs: [
      {
        q: 'Have you built a proprietary trading engine before?',
        a: 'Not a complete one in production. I have built the MetaTrader 5 integration and risk monitor for a live prop firm, and back-office and payment systems at a live broker. An engine is the next layer down, and I would start it with a paid technical sprint that proves the core: prices in, orders through, margin and stop-out correct under replay tests.',
      },
      {
        q: 'Can you build a complete exchange or matching engine?',
        a: 'I build and extend the systems around the trading core: client and back-office APIs, order and wallet flows, approvals, permissions, payments and data sync. Custody and liquidity usually come from specialist providers, and I integrate them. We decide the split in the first call.',
      },
      {
        q: 'Can you work with our existing front end or developer?',
        a: 'Yes. I start by reading what exists and writing down what is sound and what is risky. I keep what works.',
      },
      {
        q: 'Can you help with a trading platform that is slow or buggy?',
        a: 'Yes. Tracing production bugs across services is a large part of my current job. I reproduce the problem and prove the cause first, then make the smallest safe fix.',
      },
      {
        q: 'Do you build trading bots or strategies?',
        a: 'No. I build the platforms, integrations and risk systems that brokers and trading firms run on.',
      },
    ],
  },
  {
    slug: 'white-label-trading-platform-development',
    tier: 'primary',
    title: 'White-label trading platform development',
    headline: 'White-label trading platform and B-Book engine development.',
    audience: 'For founders and brokers who want to own their trading infrastructure.',
    evidenceLabel: 'Closest work in production',
    short:
      'Your own multi-brand trading platform, designed around a B-Book engine: prices, orders, margin, risk and the back office around them. I say plainly which parts I have run in production.',
    metaTitle: 'White-Label Trading Platform & B-Book Engine Development | Daniel Chen',
    metaDescription:
      'Build your own white-label trading platform or B-Book engine: architecture, risk and back office from an engineer on live broker systems. Clear on what is proven.',
    serviceType: 'White-label trading platform and B-Book trading engine development',
    intro:
      'Renting a white-label platform is the fast way to start a brokerage. Owning one makes sense later, when fees, limits on customisation or reliance on one vendor cost more than building. I have not shipped a complete proprietary trading engine in production. I work on the systems around one every day at a live broker, and this page is how I would take on yours.',
    offeringsLabel: 'What I have run in production around a trading core',
    offerings: [
      {
        title: 'Broker back-office APIs',
        body: 'Order and transaction views, maker-checker approvals, paginated lists and CSV or PDF exports, behind role and field-level permissions.',
      },
      {
        title: 'Real-time risk monitoring',
        body: 'Loss and equity rules checked every few seconds on live accounts, with safeguards that refuse to act on numbers that do not add up.',
      },
      {
        title: 'Multi-tenant services',
        body: 'A payment gateway where every merchant has its own credentials, keys and profile, isolated from the others. The same discipline a multi-brand platform needs.',
      },
      {
        title: 'Deposits and refunds',
        body: 'Apple Pay, Google Pay and Benefit as deposit methods at a live broker, with webhooks and refunds, built so a payment is never credited twice or lost.',
      },
      {
        title: 'Crypto and multi-asset precision',
        body: '8-decimal amounts carried correctly through APIs, models and access-control definitions.',
      },
      {
        title: 'Event-driven sync',
        body: 'Client portal and back office kept consistent through a message queue, including the deploy order that keeps both sides working.',
      },
    ],
    capability: {
      title: 'The engine and the white-label layer',
      intro:
        'This is the part I would design and build with you, and have not yet delivered as a finished product. It starts with a paid technical sprint that proves the core before anything else is built on it.',
      items: [
        {
          title: 'Price ingestion',
          body: 'Normalised quotes from data or liquidity providers, a markup per client group, and staleness detection so no order is ever filled against a dead price.',
        },
        {
          title: 'Order lifecycle',
          body: 'Market, limit and stop orders as an explicit state machine: every transition recorded, every request idempotent.',
        },
        {
          title: 'Positions, P&L and margin',
          body: 'Realised and unrealised P&L, equity, used and free margin computed by one implementation in fixed-point decimals.',
        },
        {
          title: 'Margin call and stop-out',
          body: 'Deterministic liquidation rules, tested by replaying recorded price sequences before they touch a live account.',
        },
        {
          title: 'B-Book first, A-Book later',
          body: 'An execution interface that starts with internal fills and leaves room for routing selected flow to a liquidity provider, and for hybrid models.',
        },
        {
          title: 'Multi-brand from the first schema',
          body: 'Tenant, brand and legal entity modelled from the start, so adding a white-label client is configuration and not a rewrite.',
        },
      ],
      caveat:
        'A trading engine that holds client money needs independent testing, a security review and legal and regulatory sign-off before it goes live. I plan for those. I do not replace them.',
    },
    proof: [
      {
        text: 'Senior Backend Engineer on a live multi-asset broker: crypto back-office APIs, maker-checker flows, field-level permissions and payment methods in production.',
        slug: 'cfi-broker-payments-crypto-backend',
      },
      {
        text: 'The MT5 integration service and real-time breach monitor for a live prop-trading platform.',
        slug: 'tradersflow',
      },
      {
        text: 'A multi-tenant payment gateway service with per-merchant keys, request signing and key rotation.',
        slug: 'octopus-payment-microservice',
      },
    ],
    faqs: [
      {
        q: 'White label or custom build: which should we choose?',
        a: 'Start on a white label if you are launching: it is live in weeks and the vendor carries the maintenance. Build your own when the fees, the limits on what you can change, or the reliance on one vendor have become the real cost. A custom core is a project of many months with a running cost afterwards, and I will tell you if a white label is still the better answer.',
      },
      {
        q: 'Have you built a proprietary trading engine before?',
        a: 'Not a complete one in production. I have built the MetaTrader 5 integration and risk monitor for a live prop firm, and back-office and payment systems at a live broker. An engine is the next layer down, which is why I start with a sprint that proves it.',
      },
      {
        q: 'How would the project start?',
        a: 'With a paid technical sprint that proves the core on its own: prices in, orders through, margin and stop-out correct under replay tests. You keep the design and the code, whoever builds the rest.',
      },
      {
        q: 'B-Book, A-Book or hybrid?',
        a: 'The design starts B-Book: internal fills against a price feed, with exposure tracked per symbol and client group. The execution interface leaves room to route selected flow to a liquidity provider later. Which model you are allowed to run is a question for your licence and your legal adviser.',
      },
      {
        q: 'Can one platform serve several brands?',
        a: 'Yes, if it is designed in from the start. Tenant, brand and legal entity sit in the first schema, with data and configuration isolated per brand. Adding it to a single-brand system later is the expensive way.',
      },
      {
        q: 'Can we keep MT5 running while the new platform is built?',
        a: 'Yes, and it is the sensible way to do it. MT5 integration is work I have done in production, so the new platform can run beside your MT5 setup and take over one client group at a time.',
      },
      {
        q: 'Do you provide liquidity, a licence or a ready-made platform?',
        a: 'No. I am an independent engineer, not a platform vendor or a regulated firm. Liquidity, custody and licensing come from specialist providers and your own advisers, and I integrate what you choose.',
      },
    ],
  },
  {
    slug: 'payment-integration',
    tier: 'primary',
    title: 'Payment infrastructure & integration',
    headline: 'Payment integration that never credits twice.',
    audience: 'For fintech products, brokers and platforms that take deposits or pay out.',
    short:
      'Card, wallet, bank and crypto payments built so money is never credited twice or lost: signed webhooks, idempotency, refunds and reconciliation.',
    metaTitle: 'Checkout.com & Payment Integration Developer | Daniel Chen',
    metaDescription:
      'Payment integration that never double-credits or loses a callback: Checkout.com, Apple Pay, Google Pay, HMAC webhooks, idempotency, refunds and reconciliation.',
    serviceType: 'Payment gateway integration and payment infrastructure development',
    intro:
      'A payment that works in the demo is easy. One that never double-charges, never loses a callback and reconciles at month end takes care. I have shipped payment integrations for a live broker, a theme park and a multi-tenant payment gateway service.',
    offeringsLabel: 'Delivered in production',
    offerings: [
      {
        title: 'Payment gateway and PSP integration',
        body: 'Checkout.com, Octopus and other providers: payment sessions, 3-D Secure flows, webhooks and refunds.',
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
      {
        title: 'Testable payment flows',
        body: 'Deposits and refunds that the team can run end to end on a laptop, with the traps written down.',
      },
    ],
    capability: {
      title: 'Ledgers, wallets and stablecoin funding',
      intro:
        'Designs I can build with you, grounded in the payment work above. I have not yet run a double-entry wallet or on-chain deposit detection in production.',
      items: [
        {
          title: 'Double-entry ledger',
          body: 'Append-only entries, balances derived from them, and one posting path with an idempotency key per money event.',
        },
        {
          title: 'Wallets and internal transfers',
          body: 'User, fee and clearing accounts, with locking so two withdrawals can never both pass the balance check.',
        },
        {
          title: 'Withdrawals with approval',
          body: 'Maker-checker payouts with a second approver and a record of who released what.',
        },
        {
          title: 'USDT and USDC funding',
          body: 'Through a crypto payment provider first. Direct on-chain detection, confirmations and matching are a later, larger piece.',
        },
        {
          title: 'Payment to trading account',
          body: 'A provider deposit credited to an MT5 balance exactly once, with the unknown outcomes handled by design.',
        },
      ],
      caveat:
        'Holding client balances or moving stablecoins can be regulated activity. Get legal advice for your market before launch. I design the system so its controls can satisfy that advice.',
    },
    proof: [
      {
        text: 'Apple Pay, Google Pay and Benefit deposits through Checkout.com, live in production at a multi-asset broker.',
        slug: 'cfi-broker-payments-crypto-backend',
      },
      {
        text: 'A standalone Octopus payment gateway microservice with HMAC-SHA256 signing, key rotation and webhook delivery.',
        slug: 'octopus-payment-microservice',
      },
      {
        text: 'Type Approval compliant payment polling, idempotent fulfilment and reconciliation for Ocean Park ticketing.',
        slug: 'ocean-park-ticketing',
      },
    ],
    faqs: [
      {
        q: 'Which payment gateways have you worked with?',
        a: "Checkout.com (cards, Apple Pay, Google Pay, Benefit), Stripe, Octopus in Hong Kong, and Malaysia's FIUU in sandbox. Most providers follow the same pattern, so a new one is mostly careful reading of their documentation.",
      },
      {
        q: 'Some of our payments go missing or get credited twice. Can you fix that?',
        a: 'Usually it is a webhook that failed, arrived twice or was never verified. I trace the exact payment through your logs and the provider dashboard, then add idempotency and reconciliation so it cannot happen silently again.',
      },
      {
        q: 'Will you store card numbers?',
        a: 'No. Card data stays with the payment provider through hosted fields and tokens, which keeps your PCI scope small.',
      },
      {
        q: 'Can you add crypto or stablecoin payments?',
        a: 'Through a crypto payment provider, yes, and that is the route I recommend first: the provider handles addresses and confirmations and you receive a signed callback. I have integrated one in my own prototype against its test API. Running your own on-chain detection is something I can design and build, and have not yet run in production.',
      },
      {
        q: 'Can you build a wallet or ledger for our product?',
        a: 'I can design and build it, and I will be clear that it would be my first double-entry wallet in production. The patterns it rests on (idempotent posting, reconciliation, approval flows, decimal precision) are ones I use in production today.',
      },
    ],
  },
  {
    slug: 'backend-development',
    tier: 'secondary',
    title: 'Backend & system development',
    short: 'APIs, integrations, data and cloud for systems that have to be right: event-driven services, background jobs and DevOps.',
    metaTitle: 'Backend & API Development: Python, Go, TypeScript | Daniel Chen',
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
        body: "A second opinion on architecture, a build-or-buy decision or a vendor's proposal.",
      },
    ],
    proof: [
      {
        text: 'Senior Backend Engineer at a live broker: FastAPI services and RabbitMQ consumers across 7 services and shared libraries.',
        slug: 'cfi-broker-payments-crypto-backend',
      },
      { text: 'The Go API behind SolveMY: 235 endpoints and 1,006 test functions, run on Hetzner with Docker and Cloudflare.', slug: 'solvemy' },
      {
        text: 'Resolved a production data-integrity incident in an MT5 integration by tracing it to an SDK that was not thread-safe.',
        slug: 'tradersflow',
      },
    ],
    faqs: [
      {
        q: 'Which languages and frameworks do you use?',
        a: 'Python (FastAPI), Go, TypeScript (Node.js), Java (Spring Boot) and C# (.NET), with PostgreSQL, MySQL, Redis and RabbitMQ. I pick what fits your team and what you can hire for later.',
      },
      { q: 'Can you take over a system someone else built?', a: 'Yes. I read the money and data paths end to end, write down how it works, then fix the riskiest parts first.' },
      { q: 'Do you offer maintenance after launch?', a: 'Yes. After launch we can agree ongoing support for fixes, updates and monitoring.' },
    ],
  },
  {
    slug: 'web-development',
    tier: 'secondary',
    title: 'Websites & web apps',
    short: 'Fast Next.js websites, portals and dashboards that load quickly, are easy to find and work in more than one language.',
    metaTitle: 'Next.js Website & Web App Development | Daniel Chen',
    metaDescription:
      'Next.js websites, customer portals and dashboards: server-rendered, fast, multilingual and built with technical SEO done properly.',
    serviceType: 'Website and web application development',
    intro:
      'For a product website, a customer portal or an internal dashboard, I build in Next.js and React: server-rendered for speed and search, with real attention to performance. This site scores 90+ on Google Lighthouse for mobile.',
    offerings: [
      {
        title: 'Product and marketing websites',
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
        body: 'Several languages built in from the start, not bolted on later.',
      },
      {
        title: 'Speed and SEO fixes',
        body: 'Speeding up slow sites and fixing the technical SEO that keeps pages out of search results.',
      },
    ],
    proof: [
      { text: 'The SolveMY website: 75 routes with server-rendered SEO pages in English, Malay and Chinese.', slug: 'solvemy' },
      { text: 'An AI trip planner for the Hong Kong Tourism Board, built in Next.js 15 and AWS Amplify.', slug: 'hktb-ai-trip-planner' },
      { text: 'Built with Next.js and a WebGL scene, and still 90+ on mobile Lighthouse.', label: 'This site' },
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
    tier: 'secondary',
    title: 'Mobile apps for iOS & Android',
    short: 'Flutter apps for iPhone and Android from one codebase, with the backend, push notifications and store release handled.',
    metaTitle: 'Flutter App Development for iOS & Android | Daniel Chen',
    metaDescription:
      'Flutter apps for iOS and Android from one codebase, with the backend, push notifications and App Store and Google Play release handled.',
    serviceType: 'Mobile app development',
    intro:
      "One Flutter codebase for iPhone and Android, plus the API and admin tools behind it. I have taken an app from first commit to Google Play and through Apple's review, with push notifications, maps, chat and sign-in.",
    offerings: [
      {
        title: 'iOS and Android apps in Flutter',
        body: 'One codebase, native feel, and several languages if you need them.',
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
    proof: [{ text: 'SolveMY: a 48-screen Flutter app on Google Play, submitted to the App Store, with a Go backend.', slug: 'solvemy' }],
    faqs: [
      {
        q: 'Do I need separate apps for iPhone and Android?',
        a: 'No. Flutter builds both from one codebase, which keeps cost and maintenance down.',
      },
      {
        q: 'Can you publish the app to the App Store and Google Play?',
        a: "Yes. I handle signing, builds, listings and review replies. Apple's rules on in-app payments are worth planning for early, and I have been through them.",
      },
      {
        q: 'Can you build the admin side as well?',
        a: 'Yes. Most apps need an admin panel for users, content and support, and I build it together with the API.',
      },
    ],
  },
];
