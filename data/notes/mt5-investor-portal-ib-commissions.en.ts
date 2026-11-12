import type { Note } from '../notes';

export const note: Note = {
  slug: 'mt5-investor-portal-ib-commissions',
  date: '2026-11-11',
  minutes: 10,
  service: 'forex-crm-development',
  basis: 'design',
  tags: ['MetaTrader 5', 'Investor portal', 'IB commissions', 'Ledger', 'Architecture'],
  title:
    'Designing an MT5 investor portal with wallets and IB commissions: the five questions that decide the build',
  description:
    'Five questions that decide the cost and risk of an MT5 investor portal with wallets and IB commissions, and the architecture I would build on the answers.',
  body: [
    {
      p: 'Founders describe this platform in screens. Investors see their MetaTrader 5 accounts (history, P/L, balance, equity, margin) and hold a wallet, while introducing brokers (IBs) and their sub-IBs earn commissions. It sounds like a dashboard project with a payments page attached.',
    },
    {
      p: 'The screens are the cheap part. Cost and risk are decided by five questions that have nothing to do with screens, and I ask them before I quote. This article is that discovery conversation, written so you can answer the questions yourself.',
    },
    {
      label: 'Design proposal',
      callout:
        'I have built the MT5 integration and a real-time risk monitor for a live prop firm, payment integrations at a live broker, and dashboards on MT5 data. I have not delivered this exact product (investor portal, wallets and multi-level IB commissions) as a finished system, so this is a design I would build, not one I have shipped. Before it holds client money it needs the formula tested against agreed examples, a proof of concept on real broker data, independent review of the ledger and legal sign-off.',
    },

    { h2: 'Question 1: what MT5 access do you really have, and for which brokers?' },
    {
      p: "A Manager API or Web API login belongs to one broker's trade server. It reads that broker's accounts, usually only in the groups the broker has allowed, and nothing else. The credential is the broker's to grant: I do not own an MT5 server or a manager licence.",
    },
    {
      p: 'If your investors all trade at one broker that grants manager access, this part is simple. If they trade at several, each broker is a separate access route, of three kinds:',
    },
    {
      list: [
        "Partner access: the broker issues a Manager API or Web API login scoped to your clients' groups.",
        "A third-party cloud bridge that logs in with each account's credentials and exposes the data over an API.",
        'Read-only investor passwords, with a terminal session per account that exports history and balances.',
      ],
    },
    {
      p: "The routes differ in speed, cost, reliability and what each broker's terms allow, so I would design a broker-adapter interface from day one. The rest of the system asks an adapter for accounts, deals and positions and never knows which route sits behind it. Accounts are identified by (server, login), because the same login number at two brokers is two different people.",
    },
    {
      p: 'Before quoting, I ask to see the credential type, its server, the groups it covers, and whether it can write (balance operations, trading rights) or only read. The two official routes are compared in [MT5 Manager API or Web API](/notes/mt5-manager-api-vs-web-api).',
    },

    { h2: 'Question 2: who trades the accounts?' },
    {
      p: "There are three common answers: each investor trades their own account, a manager trades for them, or trades are copied from a lead account. In the database these look alike. To a regulator they do not: trading other people's money or charging a performance fee is a licensed activity in many places, and whether it is in yours is a question for your lawyers.",
    },
    {
      p: "The answer also decides what the dashboards show. A self-directed trader wants positions, margin level and history. An investor in a managed or copied account wants performance net of fees and a statement they can check against the broker's. An IB wants client volume and commission, and nothing more personal.",
    },

    { h2: 'Question 3: what is the wallet, legally and functionally?' },
    {
      p: 'The word wallet covers three different products. Prepaid fee credit: the investor tops up and platform fees are deducted. Stored value: money that can be withdrawn or sent to another user. Trading capital: money that funds the MT5 account itself.',
    },
    {
      p: "Withdrawals and transfers between users can turn a wallet into regulated stored value, with licensing and safeguarding duties that vary by country. Get a lawyer's written answer before design starts, because it changes the data model, the back office and which payment providers will take you on.",
    },
    {
      p: 'I would build all three on the same base: a double-entry, append-only ledger with separate investor and IB accounts. Balances are derived from entries and never edited in place.',
    },
    {
      p: 'Each money event (top-up, fee, commission, withdrawal) gets one posting path in the code: one place to test, one place to audit. I have not run a ledger with client balances in production, which is why the note at the top asks for independent review. The pattern is in [a double-entry ledger for fintech startups](/notes/double-entry-ledger-fintech-startups).',
    },

    { h2: 'Question 4: what exactly is the commission or performance-fee formula?' },
    {
      p: "A sentence like '20% of profits' is not a formula. Before any code, each of these needs an answer on paper:",
    },
    {
      list: [
        'The rate, and whether it differs by investor, account or IB level.',
        'Whether a high-water mark applies, so a loss is recovered before a fee is charged again.',
        'How deposits and withdrawals on the trading account are treated.',
        'Closed P/L only, or floating P/L too. Open gains can still disappear.',
        'Currency conversion: which rate, taken at which moment, turns account currency into wallet currency.',
        'What happens when the wallet is empty: a negative balance, a debt record, a partial charge or suspended access.',
        'How multi-level IB splits work, and the eligibility rules (minimum volume, active clients, clawback).',
      ],
    },
    {
      p: 'Then I ask for three worked examples in writing, with real numbers: a plain profitable month, a month with a deposit and a withdrawal, and a loss followed by a recovery. They become the first automated tests. If two people in the company get different answers for the same example, the problem has been found at the cheapest moment.',
    },
    {
      lang: 'ts',
      caption:
        'Illustrative TypeScript, not production code. Amounts are integer minor units, so no figure passes through floating point.',
      code: `// Amounts are integer minor units (cents) of the account currency.
type FeeInput = {
  hwm: bigint; // high-water mark carried in from the last charged period
  netDeposits: bigint; // balance deals in the period: deposits minus withdrawals
  endEquity: bigint; // or end balance, if the agreement says closed P/L only
  rateBps: bigint; // 2000n = 20%
};

type FeeResult = { fee: bigint; newHwm: bigint; gainAboveMark: bigint };

export function performanceFee(input: FeeInput): FeeResult {
  const { hwm, netDeposits, endEquity, rateBps } = input;
  if (rateBps < 0n || rateBps > 10_000n) throw new Error('rate out of range');

  // A deposit is not profit, a withdrawal is not a loss: the mark moves with the cash.
  const mark = hwm + netDeposits;
  const gainAboveMark = endEquity - mark;

  // At or below the mark: no fee. Losses never lower the mark.
  if (gainAboveMark <= 0n) return { fee: 0n, newHwm: mark, gainAboveMark };

  // bigint division truncates, so the fee rounds down. Agree that rule in writing.
  const fee = (gainAboveMark * rateBps) / 10_000n;

  // The fee is charged to the wallet, not taken from the trading account,
  // so the account's equity is unchanged and becomes the new mark.
  return { fee, newHwm: endEquity, gainAboveMark };
}

// Worked example (USD): carried mark 10,000.00, deposit 2,000.00,
// withdrawal 500.00, end equity 12,650.00, rate 20%.
//   mark = 1_000_000 + (200_000 - 50_000) = 1_150_000
//   gain = 1_265_000 - 1_150_000          =   115_000  (1,150.00)
//   fee  = 115_000 * 2000 / 10_000        =    23_000  (230.00)
//   new mark                              = 1_265_000  (12,650.00)
const result = performanceFee({
  hwm: 1_000_000n,
  netDeposits: 150_000n,
  endEquity: 1_265_000n,
  rateBps: 2000n,
}); // { fee: 23_000n, newHwm: 1_265_000n, gainAboveMark: 115_000n }`,
    },
    {
      p: 'This version moves the mark by the cash amount. Some agreements reduce it in proportion on a withdrawal instead, so check which one is in your contract.',
    },

    { h2: 'Question 5: which entity collects the money?' },
    {
      p: "Four facts decide the payment side: which company receives investor money, in which country, under which licences, and whether any payment provider has approved the business category in writing. Forex and investment are restricted categories for many card acquirers and gateways. A working sandbox integration proves nothing if the provider's risk team declines the account or closes it after launch.",
    },
    {
      p: 'A sensible launch order starts with manual top-ups, confirmed by an admin before the ledger posts them, and withdrawals paid by hand under maker-checker, where one person prepares the payout and a second approves it. Gateways, transfers between users and stablecoins come once providers and lawyers have said yes.',
    },
    {
      p: 'Licensing and client-money questions belong to the business and its lawyers. My part is to design the system so the controls they require (approvals, limits, audit trails) can be met without a rewrite.',
    },

    { h2: 'The architecture I would build' },
    {
      p: 'Once the five answers exist, the system itself is not exotic: a modular monolith with the MT5 bridge as the one separate service. The bridge stands alone because the Manager API SDK is native Windows and its calls must be serialised per connection. The prop-firm integration I built had the same split: a .NET service on Windows, called over HTTP by the main backend.',
    },
    {
      diagram: 'investor-portal-architecture',
      caption:
        'Per-broker MT5 adapters feed a sync that classifies deals into a deals store, from which the commission engine posts to the ledger that the investor dashboards, IB dashboards and admin back office read.',
    },
    {
      list: [
        'MT5 adapters: one per broker access route, behind one interface.',
        'A sync that pulls deals in overlapping time windows and classifies each: trade (`DEAL_BUY`, `DEAL_SELL`) or balance operation (`DEAL_BALANCE`, `DEAL_CREDIT`), and for trades the entry (`ENTRY_IN`, `ENTRY_OUT`, `ENTRY_INOUT`, `ENTRY_OUT_BY`).',
        'A deals store in your own database, unique on (server, login, deal ticket), so a repeated window changes nothing.',
        "The commission engine: a pure calculation over stored deals and the period's rules.",
        'The ledger: the only place where money moves.',
        'Investor and IB dashboards, and an admin back office with maker-checker approvals.',
      ],
    },
    {
      p: 'The formula depends on that classification. Realised profit sits on the closing deals (out, in-out, out-by), while deposits and withdrawals arrive as balance deals. Get it wrong and a deposit is counted as profit.',
    },
    {
      p: "A sync every few minutes is enough for investor dashboards. Tick-by-tick streaming costs far more and is rarely needed outside risk monitoring. One rule from field work carries over unchanged: treat 'no data' from MT5 as a failure, never as an empty result. Mark the account stale, show the time of the last good read and alert staff.",
    },

    { h2: 'Month-end commission runs and IB trees' },
    {
      p: 'The commission run is the riskiest job in the system: it posts money for every account at once. I would give it four properties:',
    },
    {
      list: [
        'A unique key per (account, period), enforced by the database, so a rerun cannot double-post.',
        'Resumable jobs: progress is recorded per account, so a crashed run continues where it stopped.',
        'A preview that staff review and approve before anything reaches the ledger.',
        'Statements for IBs listing each client account, the base amount, the rate and the result.',
      ],
    },
    {
      p: "Store the IB hierarchy so that every ancestor of a client can be queried cheaply, with a closure table or a materialised path, because each commission walks up the tree. Snapshot it per period, because IBs move, leave and get reassigned. March commissions must be calculated on March's tree, even when someone reruns them in June.",
    },

    { h2: 'The five questions on one page' },
    {
      table: {
        head: ['Question', 'Why it matters', 'What it changes in scope or cost'],
        rows: [
          [
            '1. What MT5 access, for which brokers',
            "A login reads one broker's server and nothing else",
            'One adapter or several, third-party bridge fees, read-only or read and write',
          ],
          [
            '2. Who trades the accounts',
            'Managed and copied trading can be licensed activity',
            'Which dashboards and statements exist, and whether performance fees apply at all',
          ],
          [
            '3. What the wallet is',
            'Withdrawals and transfers can make it regulated stored value',
            'Fee credit needs a small ledger. Stored value adds safeguarding, limits and back-office controls',
          ],
          [
            '4. The fee and commission formula',
            'Ambiguity turns into disputes with investors and IBs',
            'The size of the commission engine, its tests and the statements',
          ],
          [
            '5. Which entity collects the money',
            'Providers decline or close accounts in restricted categories',
            'Manual top-ups at launch, or gateway integrations and their approval process',
          ],
        ],
      },
      caption: 'Each answer moves the scope further than any screen does.',
    },

    { h2: 'Stablecoin funding, in two sentences' },
    {
      p: 'Start with a payment provider that issues deposit addresses and handles confirmations, and treat its callbacks like any other payment webhook. Detecting deposits on-chain yourself is a later, larger piece with its own reconciliation, and one I have not run in production.',
    },

    { h2: 'What a paid discovery should deliver' },
    {
      p: 'I would not quote the full build from a feature list. A paid discovery or proof of concept comes first, and it should deliver:',
    },
    {
      list: [
        'One broker connected through the adapter, using the credential you really have.',
        'Real deals and account data in the deals store, classified, with stale data detected.',
        'The formula implemented and passing the three worked examples.',
        'A findings report: what the access allows, what the data showed, and the open legal and provider questions.',
        'A milestone plan, scoped so the build can be priced in pieces.',
      ],
    },
    {
      p: 'This is work I take on, either the [MT5 integration](/services/mt5-manager-api-developer) alone or the wider build as a [fintech technical partner](/services/fintech-technical-partner). If you can answer two or three of the five questions today, [send me what you have](/contact) and I will tell you what I would check first.',
    },
  ],
};
