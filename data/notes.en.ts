import type { Note } from './notes';

/** Short, practical articles drawn from real work. No em dashes, by request. */
export const notesEn: Note[] = [
  {
    slug: 'mt5-manager-api-lessons',
    date: '2026-10-04',
    minutes: 4,
    service: 'crypto-trading-systems',
    tags: ['MetaTrader 5', 'C#', 'Prop trading', 'Risk'],
    title: 'Building on the MetaTrader 5 Manager API: five lessons from a real-time risk monitor',
    description:
      "What I learned building a C#/.NET service on MetaQuotes' MT5 Manager API for a prop-trading platform: pumping, thread safety, verification and safe deploys.",
    body: [
      {
        p: "For a live prop-trading platform I built a C#/.NET service on MetaQuotes' MetaTrader 5 Manager API, plus a monitor that checks every funded account against its loss rules every few seconds. Here is what I would tell anyone starting the same job.",
      },
      { h2: '1. Know which API you are using for what' },
      {
        p: "MT5 gives brokers two main doors. The Manager API is a native SDK: a manager login connects to the trade server and keeps a live local copy of users and positions, known as the pump. The Web API is plain HTTP, easier to call from any language, but every read is a network round trip. A sensible split is fast reads from the Manager API's local copy and carefully guarded writes through whichever interface your setup trusts.",
      },
      { h2: '2. Read from the pump, not the network' },
      {
        p: "Our first position reads were network requests and could take several seconds per account. Moving them to the Manager API's pumped cache turned seconds into milliseconds, which is the difference between checking risk once a minute and checking it every few seconds. Keep the slower request as a fallback for the rare moment when the cache is not ready.",
      },
      { h2: '3. Assume the SDK is not thread-safe' },
      {
        p: "Under concurrent load we saw accounts briefly reading another account's figures. The cause was the SDK itself: concurrent calls on one manager instance corrupted its internal state. The fix was to serialise every SDK call behind one lock, take the same lock for connect and shutdown, and check that the login returned is the login requested. It made batch reads slower. The better long-term design is a small pool of manager connections, each used by one caller at a time.",
      },
      { h2: '4. Never act on numbers that do not add up' },
      {
        p: 'A risk engine closes positions and disables trading, so a wrong number costs real money. We skip an account instead of failing it when the data looks wrong: deals for another login, a zero starting balance, a login mismatch. Before an account is promoted to the next phase, its equity is cross-checked against a second, independent source. Correct but slower beats fast but wrong.',
      },
      { h2: '5. Deploy with the monitor switched off' },
      {
        p: 'Restarting a service while the monitor runs can act on a half-ready connection. Our runbook: stop both services, deploy, check a known-bad and a known-good account by hand with the monitor off, and only then switch it on and watch the logs. It takes ten minutes and removes a whole class of incidents.',
      },
      { p: 'If you are building on MT5 and want a second pair of eyes, I am happy to talk.' },
    ],
  },
  {
    slug: 'payment-webhooks-idempotency',
    date: '2026-10-04',
    minutes: 4,
    service: 'payment-integration',
    tags: ['Payments', 'Webhooks', 'Checkout.com', 'Stripe'],
    title: 'Payment webhooks that never double-credit: signatures, idempotency and reconciliation',
    description:
      'A practical checklist for card, wallet and bank payment callbacks: verify signatures, process each event once, survive retries and out-of-order events, and reconcile.',
    body: [
      {
        p: 'Most payment bugs I have fixed were not on the checkout page. They were in the callback: the webhook that tells your system a payment succeeded. These are the rules I now apply to every integration, whether it is Checkout.com, Stripe or a local gateway.',
      },
      { h2: 'Verify before you trust' },
      {
        p: "Check the provider's signature on the raw request body before reading anything else. Reject anything that fails, and log it. A webhook endpoint is a public URL, so treat every request as untrusted until proven otherwise.",
      },
      { h2: 'Process each event exactly once' },
      {
        p: "Providers retry, and networks time out after your code has already committed, so the same event will arrive twice. Store the provider's event or payment id with a unique constraint and make the handler do nothing when it has seen that id before. A database constraint is a stronger guarantee than an if statement.",
      },
      { h2: 'Model payments as a state machine' },
      {
        p: "Pending, authorised, captured, refunded, failed. Allow only valid transitions and ignore events that would move a payment backwards. Events can arrive out of order, and a late 'pending' must never overwrite a 'captured'.",
      },
      { h2: 'Reply fast, work later' },
      {
        p: 'Acknowledge the webhook quickly and do the slow work (emails, ledger entries, provisioning) after the payment state is safely stored. Long handlers cause timeouts, and timeouts cause retries.',
      },
      { h2: 'Reconcile on a schedule' },
      {
        p: "Even with all of the above, a callback can be lost. A reconciliation job that asks the provider about anything still pending turns 'we lost a payment' into 'it was fixed ten minutes later'. On a ticketing project, that job together with status polling is what kept missed callbacks from becoming lost revenue.",
      },
      { h2: 'Test the whole loop locally' },
      {
        p: 'Run the full flow on your machine with a tunnel for webhooks, and write the steps down for your team. One trap worth knowing: a forwarded webhook returning 200 does not prove your handler processed it. Check the stored payment, not just the HTTP status.',
      },
      {
        p: 'Finally, keep card data with the provider through hosted fields or tokens. Your PCI scope stays small, and so does your risk.',
      },
    ],
  },
  {
    slug: 'rabbitmq-deploy-order',
    date: '2026-10-04',
    minutes: 3,
    service: 'backend-development',
    tags: ['RabbitMQ', 'Event-driven', 'Python', 'Deployments'],
    title: 'Changing a message between two services: why the consumer ships first',
    description:
      'When two services talk through RabbitMQ, a new field can be silently dropped. How to find where it disappears, and the deploy order that keeps both sides working.',
    body: [
      {
        p: 'A classic bug in event-driven systems: someone edits a record in the back office, and the change never reaches the client app. Both services are up, the queue is healthy, and nothing shows in the error logs. Here is how I approach it, and the rule that prevents it next time.',
      },
      { h2: 'Prove it at every hop' },
      {
        p: 'Follow the data, not the code: the API request, the database row, the message on the queue, the consumer, the second database. Reproduce the problem on unmodified code at the exact library versions each service pins. A local setup with a newer shared library will happily prove the wrong thing.',
      },
      {
        p: "In one case the field was dropped twice: the producer forwarded only one of the changed fields, and the consumer's message model would have rejected the rest anyway. Fixing only one side would have looked right in review and still failed in production.",
      },
      { h2: 'Strict consumers go first' },
      {
        p: 'If the consumer validates messages strictly and the producer starts sending a new field first, the consumer rejects messages it does not understand. If it acknowledges messages even when validation fails, those messages are simply gone. So the order is: update and deploy the consumer so it accepts the new shape, then deploy the producer that sends it. Shared libraries are tagged and released before the services that use them.',
      },
      { h2: 'Watch for echoes' },
      {
        p: 'When two systems sync both ways, an update can bounce back and overwrite the original change with stale values. Record where a change came from, and make sure a service does not send back what it has just received.',
      },
      { h2: 'Write the deploy order down' },
      {
        p: 'Put it in the ticket: which service goes first, which library version, any permissions or settings to change. QA and whoever deploys should not have to rediscover it. It is a two-line note that prevents a two-hour incident.',
      },
    ],
  },
  {
    slug: 'ai-coding-assistants-verification',
    date: '2026-10-04',
    minutes: 3,
    service: 'backend-development',
    tags: ['AI', 'Claude Code', 'Code review', 'Engineering practice'],
    title: 'How I use AI coding assistants without shipping their mistakes',
    description:
      'AI assistants such as Claude Code and Codex speed up exploration, boilerplate and review. These are the habits that keep their confident mistakes out of production.',
    body: [
      {
        p: 'I use AI coding assistants every day, mostly Claude Code and Codex: to explore an unfamiliar codebase, draft boilerplate, write tests and review my own changes. They make me faster. They are also confidently wrong often enough that I treat everything they produce as a claim, not a fact.',
      },
      { h2: 'Start from the ticket, not the prompt' },
      {
        p: 'Before asking an assistant anything, I write down what done means: the expected result in the ticket. Every suggestion is then checked against that. Assistants love helpful extras, such as validation nobody asked for or a refactor of a shared helper. Extras are scope creep with a friendly face.',
      },
      { h2: 'Evidence comes from the running system' },
      {
        p: 'An assistant can narrate a perfect end-to-end test that never happened. Real evidence is a response from the actual endpoint, the row in the database, the message on the queue, the log line found by correlation id. If I cannot show one of those, I have not verified anything.',
      },
      { h2: 'Check the blast radius yourself' },
      {
        p: 'Assistants see the files you give them. They rarely know who else calls the function they just changed, which other repository consumes the message, or that the code runs on every trade. Before accepting a change I search for every caller and ask two questions: what happens to them, and what does this cost on the hot path?',
      },
      { h2: 'Keep the change small' },
      {
        p: 'The smallest change in the right layer is easier to review, easier to explain and easier to revert. When an assistant proposes something big, I ask for the minimal version or write it myself.',
      },
      { h2: 'Own the explanation' },
      {
        p: 'If I cannot explain a line in review, it does not ship, no matter who wrote it. That rule is what makes AI assistance safe. Used this way, assistants are a real multiplier: more time on design and verification, less on typing.',
      },
    ],
  },
  {
    slug: 'app-store-rules-one-codebase',
    date: '2026-10-04',
    minutes: 4,
    service: 'mobile-app-development',
    tags: ['Flutter', 'App Store', 'Google Play', 'Mobile'],
    title: 'One app, two app store rulebooks: shipping a Flutter marketplace on Google Play and the App Store',
    description:
      "Lessons from releasing a Flutter app on Android and iOS: Apple's in-app purchase rules, platform-aware pricing, push notifications, old app versions and deep links.",
    body: [
      {
        p: "SolveMY, a services marketplace I built, runs on Android, iOS and the web from one Flutter codebase and one Go API. Getting it onto Google Play was straightforward. Getting it through Apple's review taught me more. Here is what I would plan for from day one.",
      },
      { h2: 'Read the payment rules before you design pricing' },
      {
        p: "Apple's guidelines require in-app purchase for digital goods and features unlocked inside the app, and they limit how you point people to other ways to pay. Our first submissions were rejected over exactly this. The fix was to make pricing platform-aware: the iOS app shows no pricing or upgrade paths, website pages opened from the iOS app hide them too, and Android and desktop web stay unchanged. Design for this early and you avoid weeks of resubmissions.",
      },
      { h2: 'Treat push notifications as two systems' },
      {
        p: 'Android and iOS push both go through Firebase, but iOS needs its own APNs credentials. At one point an iOS-only configuration block was attached to every message, and Firebase rejected the Android messages too, so phones stopped alerting for days while the in-app list looked fine. Keep platform-specific settings platform-specific, and build an admin tool that proves a push really reached a device.',
      },
      { h2: 'Old app versions never go away' },
      {
        p: 'People do not update apps quickly, so the API has to keep working for builds that are months old. Make changes additive. When we added delete-for-everyone in chat, deleted messages were still served as plain text plus a flag, so old versions show a sensible placeholder without an update.',
      },
      { h2: 'Deep links: cold starts are different' },
      {
        p: 'A link that opens a running app delivers a short path; a link that cold-starts it delivers a full URL, and the router may run its start-up redirect after the link was handled. Normalise both and make the splash redirect idempotent, or your QR codes will open the home screen instead of the right page.',
      },
      {
        p: "None of this is exotic. It is the work between 'it runs on my phone' and 'it is live in two stores'.",
      },
    ],
  },
  {
    slug: 'prop-firm-risk-rules',
    date: '2026-10-04',
    minutes: 4,
    service: 'crypto-trading-systems',
    tags: ['Prop trading', 'Risk', 'MetaTrader 5', 'Trading'],
    title: 'How prop firms enforce daily loss and max loss rules, and why timing matters',
    description:
      'A plain explanation of prop-firm challenge rules (profit target, daily loss, max loss, consistency) and what it takes to enforce them in near real time.',
    body: [
      {
        p: 'Proprietary trading firms sell evaluation challenges: a trader gets a simulated account with rules, and passing them leads to a funded account and a share of the profits. For the firm, the rules are the product. For engineers, enforcing them correctly and quickly is the hard part.',
      },
      { h2: 'The usual rules' },
      {
        list: [
          'Profit target: reach a percentage gain on the starting balance to pass a phase.',
          'Daily loss limit: within one trading day, losses may not exceed a percentage of the starting balance.',
          'Maximum loss: the account may never fall more than a set percentage below the starting balance.',
          'Consistency: no single day may account for too large a share of the total profit.',
          'Minimum trading days: the target has to be reached over a minimum number of profitable days.',
        ],
      },
      { h2: 'Count open trades, not just closed ones' },
      {
        p: "A daily loss check that only looks at closed trades is easy to game: just keep a losing position open. The remaining buffer has to include the day's closed profit and loss plus the floating result of open positions, including swap and commission. Be explicit about which clock defines the day, because trade servers often run on their own time zone.",
      },
      { h2: 'Near real time, not once an hour' },
      {
        p: 'If breaches are checked by an hourly job, a trader can keep trading past a limit for most of that hour. A monitor that evaluates every active account every few seconds, from a fast local copy of the trading data, closes that gap. Publish the rules from the main backend so both sides always work from the same numbers.',
      },
      { h2: 'Failing an account must be reliable' },
      {
        p: "When a limit is breached, positions need to be closed and trading disabled on the trading server, not just marked as failed in a database. Make the fail action idempotent so a retry does no harm, retry the trading server calls, and raise an error if the server refuses. A database that says 'failed' while the account can still trade is the worst of both worlds.",
      },
      { h2: 'Verify before promoting' },
      {
        p: 'Passing a phase deserves the same care as failing one. Before opening the next account, read equity again from an independent source and check that the numbers agree. Money decisions deserve two witnesses.',
      },
    ],
  },
];
