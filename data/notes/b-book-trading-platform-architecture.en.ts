import type { Note } from '../notes';

export const note: Note = {
  slug: 'b-book-trading-platform-architecture',
  date: '2026-11-11',
  minutes: 10,
  service: 'trading-platform-engineering',
  basis: 'design',
  tags: ['Trading platform', 'B-Book', 'Architecture', 'Risk', 'Go'],
  title: 'How I would architect a proprietary B-Book trading platform',
  description:
    'A design proposal for a broker-owned B-Book execution core: the components, five design rules, failure scenarios, recovery and what a first sprint must prove.',
  body: [
    {
      p: 'The request usually comes from a founder or a broker operator who is tired of renting. They pay for MetaTrader 5 or a white-label, they cannot change how it behaves, and they want to own the execution core: the code that prices, fills, margins and closes client trades. Sometimes the question comes from the engineer they have just hired.',
    },
    {
      p: 'This is how I would design that core, and in what order I would build it. The aim is that you finish knowing where the hard parts are, so you can judge a plan before paying for one.',
    },
    {
      callout:
        'I have not shipped a proprietary trading engine in production. My basis is building the [MT5 integration and real-time risk monitor](/work/tradersflow) for a live prop firm, and working on back-office and payment systems at a live broker, where I see every day what the systems around an engine demand of it. Read this as a design that still has to be proven by replay tests, a proof of concept and independent review before client money goes near it.',
      label: 'Design proposal',
    },

    { h2: 'What B-Book means for the software' },
    {
      p: 'In a B-Book model the broker is the counterparty to every client trade and fills it internally. There is no exchange to blame. The price the client saw, the fill, the margin held and the ledger entry are all your code, and an error in any of them costs you or your client real money.',
    },
    {
      p: 'Most public tutorials describe an exchange matching engine: an order book where orders match each other under price-time priority. A B-Book core is a different problem. Fills are quote-driven, against a price you took from your providers and marked up, and the hard work is per account: margin, exposure and stop-out.',
    },

    { h2: 'The components' },
    {
      diagram: 'bbook-architecture',
      caption:
        'Prices flow from the feed adapters through the quote service into the engine, which owns orders, positions, the ledger and risk, with the client API, streaming and back office around it.',
    },
    {
      list: [
        'Price feed adapters: one per provider, each turning a vendor protocol into the same internal tick.',
        "Quote service: normalises ticks, applies each group's markup and marks a symbol stale when its feed goes quiet.",
        'Order gateway: authentication, validation and idempotency keys, before anything reaches the core.',
        'Execution core: decides whether an order fills, and against which quote.',
        'Positions and ledger: open positions, plus an append-only record of every fill, swap, commission and balance change.',
        "Risk: margin, stop-out and the broker's own net exposure per symbol.",
        'Client API and streaming: what a WebTrader and a client portal call and subscribe to.',
        'Back office: accounts, groups, deposits and withdrawals, reports, and manual corrections with an audit trail.',
      ],
    },
    {
      p: 'Eight boxes do not mean eight services. On day one I would separate only what fails differently or ships on a different rhythm.',
    },
    {
      p: 'Pricing (the adapters and the quote service) runs apart from the engine, because vendor connections drop and a bad adapter must not take trading down. The client API, streaming and order gateway form an internet-facing tier that grows with connected users. The back office changes weekly and should never share a deploy with the engine.',
    },
    {
      p: 'The execution core, positions, ledger writes and risk stay in one deployable. They share the same account state and must agree at every instant. Put a network between them and a function call becomes a distributed transaction, on the one path where you can least afford it.',
    },

    { h2: 'Five design rules, and the failure each prevents' },
    { h3: '1. One writer per account' },
    {
      p: "Every state change for an account goes through one ordered queue: fills, margin checks, swaps, deposits, stop-out. Otherwise a margin check can pass on funds a concurrent fill has already used, or a stop-out and the client's own close order can both close the same position. I met the cheap version of this on MT5, where [concurrent calls on an SDK that is not thread-safe](/notes/mt5-manager-api-lessons) let one account briefly read another's figures until every call was serialised.",
    },
    { h3: '2. A price is an event, and a stale quote never fills' },
    {
      p: 'A quote carries a source, a sequence number and a timestamp, and every fill records which quote it used. If the newest quote for a symbol is older than that symbol allows, the core rejects the order with a reason. This prevents the worst kind of dispute: a client filled at a price the market left a minute ago, with nothing on record to explain it.',
    },
    { h3: '3. Orders are a state machine with idempotency keys' },
    {
      p: 'An order moves through named states (received, accepted, filled, rejected, cancelled) and only along allowed transitions. Each request carries a client-generated key stored under a unique constraint, so a retry after a timeout returns the original result instead of opening a second position. It is the same discipline as [processing a payment webhook exactly once](/notes/payment-webhooks-idempotency).',
    },
    { h3: '4. Fixed-point money, one implementation of the maths' },
    {
      p: "Prices, volumes and balances are integers at a declared scale, never floats. Profit and loss, equity and margin each have one function that the engine, the API and the reports all call. Two implementations drift, and then the client's screen and the back-office report disagree. On the prop firm platform, moving the fail calculation into one shared service is what ended false fails from swap being counted twice.",
    },
    { h3: '5. Stop-out is a pure function, tested by replay' },
    {
      p: "Given positions, prices and the group's rules, the stop-out decision must come out the same every time: no clock reads, no arbitrary tie-breaks. Then I can record tick sequences, replay them through the engine and assert which position closed at which quote. Without that you cannot explain, to a client or to a regulator, why an account was closed where it was.",
    },
    {
      p: 'Rules 4 and 5 together look roughly like this. The comparison cross-multiplies instead of dividing, so rounding can never move the decision.',
    },
    {
      lang: 'go',
      code: `// Money is a whole number of minor units of the account currency (cents for USD).
type Money int64

type Position struct {
	ID       int64
	Floating Money // unrealised P/L at the current quote, swap and commission included
	Margin   Money // margin held for this position
}

type Decision struct {
	Equity, Margin Money
	CloseID        int64 // 0 means close nothing
}

// atOrBelow compares equity/margin with a level in basis points (5000 = 50%)
// by cross-multiplying, so no division or rounding can move the decision.
func atOrBelow(equity, margin Money, levelBps int64) bool {
	return int64(equity)*10000 <= int64(margin)*levelBps
}

// Evaluate is pure: the same inputs always give the same decision.
// Positions arrive sorted by ID, so ties break the same way on every replay.
func Evaluate(balance, credit Money, positions []Position, stopOutBps int64) Decision {
	d := Decision{Equity: balance + credit}
	var worst *Position
	for i := range positions {
		p := &positions[i]
		d.Equity += p.Floating
		d.Margin += p.Margin
		if worst == nil || p.Floating < worst.Floating {
			worst = p
		}
	}
	if d.Margin == 0 {
		return d // no margin in use: the level is undefined, nothing to close
	}
	if atOrBelow(d.Equity, d.Margin, stopOutBps) {
		d.CloseID = worst.ID // close the largest loser, then evaluate again
	}
	return d
}`,
      caption:
        'Illustrative Go, not production code: a fixed-point stop-out decision. The policy shown (close the position with the worst floating result, then re-evaluate) is one common choice and belongs in group settings.',
    },

    { h2: 'What goes wrong, and what the design does about it' },
    {
      p: 'I would write this table before the first line of engine code. Every row then becomes a test.',
    },
    {
      table: {
        head: ['Scenario', 'What happens', 'What the design does about it'],
        rows: [
          [
            'Feed stalls',
            'A symbol stops updating while clients keep sending orders.',
            'The quote service marks the symbol stale once its age limit passes. Orders on it are rejected with a reason, nothing is closed at a stale price, and an alert fires.',
          ],
          [
            'Bad tick spike',
            'One provider sends a price far from the market. A fill or a stop-out at that price would be wrong.',
            "Each tick is checked against the last good price and the other sources. A tick outside the symbol's band is held until later ticks confirm it.",
          ],
          [
            'Process crash mid-fill',
            'The engine dies between deciding a fill and telling the client.',
            'A fill is one journal record (order state, position, ledger entries), written before any acknowledgement. After restart it exists in full or not at all.',
          ],
          [
            'Duplicate order submission',
            'A double click or a network retry sends the same order twice.',
            "Same idempotency key, same answer. The second request returns the first order's result and opens nothing.",
          ],
          [
            'Weekend gap at open',
            "The first quote after the weekend is far from Friday's close. Stops are jumped and some accounts open below their stop-out level.",
            'Stops and stop-outs fill at the first valid quote after the open, not at the requested level. Gap sequences are in the replay suite, and negative balances follow a written policy.',
          ],
          [
            'Database failover',
            'The primary database disappears. A commit in flight may or may not have landed.',
            'The engine stops taking orders instead of running ahead of its journal. The journal is replicated synchronously, so an acknowledged fill survives. The engine then reloads, reconciles and resumes.',
          ],
        ],
      },
      caption: 'Six failures to design for before the first fill.',
    },

    { h2: 'Recovery: the journal is the truth' },
    {
      p: 'The engine keeps account state in memory for speed, but memory is only a cache of the journal. Every accepted command and its resulting events are appended to a durable, ordered log before anything is acknowledged, and periodic snapshots keep restart time bounded. On start, the engine loads the latest snapshot, replays the journal after it, and only then accepts orders.',
    },
    {
      p: "A reconciliation job then does what an auditor would: it recomputes each account's positions and balance from the ledger entries and compares them with the engine's state. Any difference stops trading on that account and calls a person.",
    },
    {
      p: 'Redis, or any cache, is fine for sessions, rate limits and fanning quotes out to browsers. It must never be the source of truth for money. Its usual persistence and replication settings can lose recently acknowledged writes on a crash or a failover, and here a lost write is a lost fill or a lost deposit.',
    },

    { h2: 'Leave room for A-Book, hybrid and a second brand' },
    {
      p: 'The core should fill through an execution venue interface, with the internal book as its first and only implementation. Routing some flow to an external liquidity provider later (A-Book, or a hybrid split by group, symbol or client) then means adding a venue and a routing rule, not rewriting the fill path. External venues bring partial fills, rejects and a second set of positions to reconcile, so I would not build them until the internal book is proven.',
    },
    {
      p: 'Multi-brand and white-label support is cheap on day one and expensive later. Tenant and brand go into the schema, into every unique key and into every cache and stream key from the first migration. Trading conditions belong to groups, not to code: leverage, spreads, swaps and stop-out level are per-group settings, and every change to them is audited.',
    },

    { h2: 'What a first paid sprint should prove' },
    {
      p: 'I would not start with a full build. A first technical sprint should prove the core is correct on a small surface, in this order:',
    },
    {
      steps: [
        'Prices in: one feed adapter and the quote service, with markup and staleness detection.',
        'Market orders with idempotency keys, filled against the current quote.',
        'Positions and P/L, with every fill written to the append-only ledger.',
        'Margin and stop-out, passing replay tests on recorded tick sequences that include a gap and a bad tick.',
        'A thin API and stream that a WebTrader can call: quotes, place order, positions, account summary.',
      ],
    },
    {
      p: 'It should leave out pending orders, swaps and rollover, A-Book routing, a second brand, the full back office, mobile apps and real payments. Each of those is real work, and none of them tells you whether the core is sound.',
    },

    { h2: 'A note on language' },
    {
      p: 'A garbage-collected language such as Go or Java is a reasonable start for a B-Book core at startup scale. Correctness and replay tests matter more than nanoseconds here, and a wrong fill costs more than a slow one. I would revisit the choice only if latency becomes the product.',
    },

    { h2: 'Before real clients' },
    {
      p: 'A passing replay suite is the start of the evidence, not the end of it. Before real client money, the platform needs independent testing by people who did not write it, a security review of the API, the back office and the infrastructure, and operational runbooks for deploys, feed outages, failover and manual corrections.',
    },
    {
      p: 'It also needs legal and regulatory sign-off. Dealing as principal against your own clients is regulated, and whether and where you may do it, under which licence and with which client money rules, is a question for the business and its lawyers. I am an engineer, not a lawyer or a compliance officer: I plan for these steps and design the system so those controls can be met, and I do not replace them.',
    },
    {
      p: 'I take this on as [trading platform engineering](/services/trading-platform-engineering): an architecture review, a first proof sprint, or the systems around an engine you already run. If you are weighing whether to own your execution core, [tell me where you are](/contact).',
    },
  ],
};
