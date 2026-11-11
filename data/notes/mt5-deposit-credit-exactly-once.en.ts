import type { Note } from '../notes';

export const note: Note = {
  slug: 'mt5-deposit-credit-exactly-once',
  date: '2026-11-11',
  minutes: 10,
  service: 'payment-integration',
  basis: 'design',
  tags: ['MetaTrader 5', 'Payments', 'Webhooks', 'Idempotency', 'Reconciliation'],
  title: 'Crediting a payment to an MT5 balance exactly once: claim, act, resolve, reconcile',
  description:
    'How to turn a payment webhook into one MT5 balance operation: unique event keys, an atomic claim, a reference in the deal comment and daily reconciliation.',
  body: [
    {
      p: 'A client pays 500 USD by card. The payment provider knows at once, and your database knows a moment later. The MT5 trade server, which is where the client looks for the money, knows nothing until your code performs a balance operation on their account.',
    },
    {
      p: "No transaction spans your database and MT5. Between 'the provider says paid' and 'MT5 says credited' there is a gap, and a crash, a timeout or a retry inside that gap ends in one of three ways.",
    },
    {
      list: [
        'Credited twice. The client trades or withdraws money that never arrived, and you find out when the books do not balance.',
        'Never credited. The card was charged, the account shows nothing, and the first you hear of it is a support ticket or a chargeback.',
        "Credited to the wrong account. One client's deposit appears on another client's login, and now there are two incidents.",
      ],
    },
    {
      label: 'Where this comes from',
      callout:
        'The two halves of this article are production experience, gained on separate systems. Payments: Checkout.com deposits with Apple Pay and Google Pay at a live broker (my job), plus an HMAC-signed payment gateway service and idempotent fulfilment with reconciliation for ticketing (a previous job). MT5: I owned the MetaTrader 5 integration at a live prop firm (freelance). The combined pattern, exactly as written here, is one I have only run in prototype work of my own, against a simulated MT5 server and test payment providers. Treat it as a design tested on a simulator. Before it carries client money it needs a proof of concept against your real trade server and provider, tests that kill the worker at every step, and an independent review.',
    },

    { h2: 'The flow' },
    {
      p: 'Strictly, nobody gets exactly once across two systems that share no transaction. What you can build is a flow that never knowingly acts twice, can always find out what happened, and hands the rest to a person.',
    },
    {
      diagram: 'deposit-to-mt5-flow',
      caption:
        'One deposit from signed webhook to MT5 deal: unique event record, credit intent, atomic claim, balance operation carrying your reference, stored deal ticket, then reconciliation across the provider, your database and MT5.',
    },
    {
      steps: [
        'The provider sends a webhook. Verify its signature on the raw body.',
        'Record the event under a unique key. A duplicate stops here.',
        'In the same transaction, create a `pending` credit intent row, unique per provider payment. Acknowledge the webhook.',
        'A worker claims the row: `pending` to `claimed` in one atomic `UPDATE`.',
        'The winning worker calls the MT5 balance operation with the credit reference in the deal comment.',
        'On success, store the deal ticket and mark the row `done`.',
        'On a timeout or a crash, mark the row `unknown` and look for the deal before any retry.',
        'A daily job reconciles provider settlements, credit rows and MT5 balance deals.',
      ],
    },

    { h2: 'Step one: the webhook' },
    {
      p: "Verify the provider's signature on the raw request body, before any JSON parsing. Many frameworks parse and re-serialise the body, which changes the bytes and makes a valid signature fail. Reject and log anything that does not verify.",
    },
    {
      p: "Then store the provider's event id under a unique constraint. If the insert conflicts, you have seen this event: acknowledge it and do nothing. In the same database transaction, create the credit intent row described below.",
    },
    {
      p: "Two keys do two different jobs. The event key stops one message being handled twice. The payment key on the credit row stops two events about one payment (an approval and a capture, say) from creating two credits. Which event means 'paid' differs by provider and method, so write that decision down.",
    },
    {
      p: 'Acknowledge quickly and do the MT5 work in a job. A handler that waits on MT5 will time out one day, and the provider will retry into the middle of your work. The webhook side has its own note: [Payment webhooks that never double-credit](/notes/payment-webhooks-idempotency).',
    },

    { h2: 'Step two: claim, then act' },
    {
      p: 'The credit intent is a row that says: this payment becomes this amount on this login. The login comes from a deposit record your server created when a signed-in client chose which of their own accounts to fund, never from the browser or from free text in the payload.',
    },
    {
      p: 'The row starts as `pending`. A worker must move it to `claimed` in one atomic `UPDATE` before it may talk to MT5, and only the worker whose update returned a row makes the call.',
    },
    {
      lang: 'sql',
      code: `CREATE TABLE mt5_credit (
  id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  provider            text        NOT NULL,
  provider_payment_id text        NOT NULL,
  mt5_login           bigint      NOT NULL,
  amount_minor        bigint      NOT NULL CHECK (amount_minor > 0), /* account currency, minor units */
  currency            char(3)     NOT NULL,
  status              text        NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'claimed', 'unknown', 'done', 'failed')),
  mt5_deal_ticket     bigint      UNIQUE, /* null until MT5 confirms */
  claimed_at          timestamptz,
  lease_expires_at    timestamptz,
  attempts            integer     NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_payment_id)
);

/* Claim. Zero rows returned means another worker holds it: stop. */
UPDATE mt5_credit
SET status           = 'claimed',
    claimed_at       = now(),
    lease_expires_at = now() + interval '2 minutes',
    attempts         = attempts + 1
WHERE id = $1
  AND status = 'pending'
RETURNING id, mt5_login, amount_minor, currency;

/* Expired lease: the worker died or hung. That is 'unknown', never 'pending'. */
UPDATE mt5_credit
SET status = 'unknown'
WHERE status = 'claimed'
  AND lease_expires_at < now();`,
      caption:
        'Illustrative PostgreSQL. Table and column names, the status list and the lease length are examples to adapt.',
    },
    {
      p: "If two workers run that claim at the same moment, PostgreSQL at its default isolation level makes the second wait for the first, re-check `status = 'pending'`, find it false and update nothing. That is the whole lock.",
    },
    {
      p: 'The lease covers a worker that dies. When it runs out, the row goes to `unknown`, not back to `pending`, because a dead worker may have reached MT5 first. Set the lease comfortably longer than your MT5 call timeout.',
    },

    { h2: 'Step three: the MT5 call' },
    {
      p: 'A balance operation creates a deal on the account with the action `DEAL_BALANCE`, an amount and a comment. In the Manager API that is `DealerBalance`, and the Web API has an equivalent command. The comment travels with the deal, so put your own reference in it, for example `dep:48213` for credit 48213.',
    },
    {
      p: 'The comment field is short, so keep the reference compact, and use the same one on every attempt for that credit. MT5 does not stop a second deal carrying the same comment: uniqueness lives in your database, and the comment is how you find out afterwards what MT5 did.',
    },
    {
      p: 'Serialise calls on each manager connection: treat the SDK as not thread-safe. On a live integration I saw concurrent calls return figures for a different account, and I now check the login on everything MT5 returns.',
    },
    {
      p: 'The call ends in one of three ways. Success: store the deal ticket and mark the row `done`. A clear refusal (no such login, account disabled): mark it `failed` and send it to a person. A timeout, a dropped connection or a dead process: you do not know whether MT5 applied the credit, and that state needs its own name.',
    },

    { h2: "Step four: resolving 'unknown'" },
    {
      p: 'Before any retry, ask MT5 for the balance deals on that login from shortly before the claim, and look for one carrying your reference. There are four possible results.',
    },
    {
      list: [
        'Found: the credit happened. Record the deal ticket, mark the row `done` and finish.',
        'Not found, after a complete answer from MT5: the credit did not happen. The row may return to `pending` and be claimed again.',
        'Found, but not as expected: the reference is there with a different amount, or more than once. Stay in `unknown` and hand it to a person. Do not correct money automatically.',
        "No answer: stay in `unknown` and alert someone. Missing data is never 'not credited'.",
      ],
    },
    {
      lang: 'ts',
      code: `type DealLookup =
  | { kind: 'found'; ticket: bigint } // one balance deal with this reference and amount
  | { kind: 'absent' } // MT5 answered in full: no deal carries the reference
  | { kind: 'conflict' } // reference found, but the amount differs or it appears twice
  | { kind: 'no_answer' }; // timeout, disconnect or a response that cannot be trusted

type UnknownCredit = { id: number; mt5Login: number; amountMinor: bigint; claimedAt: Date };

interface Mt5Gateway {
  findBalanceDeal(login: number, reference: string, amountMinor: bigint, since: Date): Promise<DealLookup>;
}

interface CreditStore {
  markDone(creditId: number, ticket: bigint): Promise<void>;
  backToPending(creditId: number): Promise<void>;
  stayUnknown(creditId: number, reason: string): Promise<void>;
}

const LOOKBACK_MS = 15 * 60 * 1000; // search from before the claim: the trade server keeps its own clock

export async function resolveUnknown(
  credit: UnknownCredit,
  mt5: Mt5Gateway,
  store: CreditStore,
  alert: (message: string) => Promise<void>,
): Promise<void> {
  const reference = 'dep:' + credit.id;
  const since = new Date(credit.claimedAt.getTime() - LOOKBACK_MS);
  const lookup = await mt5.findBalanceDeal(credit.mt5Login, reference, credit.amountMinor, since);

  switch (lookup.kind) {
    case 'found': // already credited: record the ticket and finish
      return store.markDone(credit.id, lookup.ticket);
    case 'absent': // safe to retry: a worker may claim the row and call MT5 again
      return store.backToPending(credit.id);
    default: // conflict or no answer: do not guess, do not retry
      await store.stayUnknown(credit.id, lookup.kind);
      return alert('Credit ' + credit.id + ' needs a person: ' + lookup.kind);
  }
}`,
      caption:
        'Illustrative TypeScript. The MT5 calls sit behind an interface, so the same logic runs against a mock in tests and a real gateway in production.',
    },
    {
      p: "The gateway may return `absent` only when MT5 gave a successful, complete answer for that window. A timeout, a disconnect or an empty response it cannot explain must map to `no_answer`. 'No data' read as 'no deal' is exactly how a double credit gets through a careful design.",
    },
    {
      p: 'The original call must also be dead, not just slow: wait out the call timeout plus a margin, and make sure a call queued behind a lock cannot still be sent later. And match on the action, the exact comment and the amount: a deal with your reference and a different amount is a task for a person.',
    },

    { h2: 'What the pattern does in each failure' },
    {
      table: {
        head: ['Scenario', 'Without the pattern', 'With the pattern'],
        rows: [
          [
            'Duplicate webhook',
            'Two handlers run and each performs a balance operation.',
            'The second insert hits the unique event key and does nothing. The payment key allows one credit row at most.',
          ],
          [
            'Webhook arrives before the browser redirect, or the redirect never happens',
            "The return page and the webhook both try to credit, or the client sees 'failed' for a payment that worked.",
            'Only the stored, signed event creates a credit. The return page reads the status and does nothing else.',
          ],
          [
            'Worker crashes after the claim',
            "The row stays 'processing' indefinitely, or a timer resets it and the credit is sent again.",
            'The lease expires into `unknown`. The deal lookup decides whether MT5 was reached.',
          ],
          [
            'MT5 call times out',
            'An automatic retry sends a second balance operation although the first one succeeded.',
            'No retry. The row becomes `unknown` and is resolved by its reference.',
          ],
          [
            'MT5 succeeds, then the database write fails',
            'The money is on the account, the row says it is not, and the next run credits again.',
            'The lookup finds the deal by its comment, records the ticket and finishes.',
          ],
          [
            'Wrong login mapping',
            'The login is read from the redirect or from editable metadata, and the credit lands on another account.',
            'The login comes from a deposit record created on the server for a signed-in client. Ownership and currency are checked again before the call, and reconciliation compares the login on each deal with the login on its row.',
          ],
          [
            'Partial refund or chargeback later',
            'The original credit row is edited in place, or the MT5 balance is never adjusted.',
            'A refund or chargeback is a new row with its own provider key and its own reference, linked to the original credit and run through the same claim and resolve. If the account no longer holds the funds, a person decides.',
          ],
        ],
      },
      caption: 'Seven ways the gap goes wrong, and what the pattern does about each.',
    },

    { h2: 'Reconciliation' },
    {
      p: "The steps above reduce mistakes, and reconciliation finds the ones that remain. Once a day, a job lines up three lists: the provider's settlements, your credit rows, and the MT5 balance deals matched by the reference in their comment.",
    },
    {
      p: 'Compare in both directions. A settled payment with no credit row is a lost webhook. A `done` row with no matching deal means your database is wrong. A deal whose reference matches no row, or two deals with one reference, means MT5 holds money your records cannot explain. Balance deals with no reference at all belong on the report too.',
    },
    {
      p: 'The job does not move money. Every unmatched item becomes a task for a person, with the three records side by side. On a ticketing project I worked on, a reconciliation job running next to status polling is what caught the missed callbacks.',
    },
    {
      p: 'Withdrawals are the same problem in reverse, with more at stake because money leaves the business. I would debit the MT5 balance first and pay out second, resolve an unknown payout before any retry, and require maker-checker approval: one person prepares the payout, a different person approves it, and the server enforces the difference.',
    },

    { h2: 'Shortcuts that are not shortcuts' },
    {
      list: [
        'Using the deal comment as your database. Comments are not unique, searching deals is a network request, and a comment cannot hold `pending` or `unknown`. The comment is evidence; the row is the record.',
        'Trusting the browser redirect. Clients close tabs and lose signal, and a return URL can be replayed. The redirect may change what the client sees; only a verified server-to-server message moves money.',
        'Retrying automatically on a timeout. HTTP clients and job queues often retry by default, and a timeout is not a failure. Turn automatic retries off for the balance call and let the resolver decide.',
        'Computing amounts in floating point. Keep amounts as integer minor units or fixed decimals, with more places for crypto than for cards. Convert currencies once, at a rate recorded on the row with its source and time, and never recalculate the amount on a retry. Convert to the numeric type the MT5 call takes only at the last step.',
      ],
    },
    {
      label: 'Responsibility',
      callout:
        'Holding and moving client funds is regulated activity in most markets, and the licences, provider approvals and legal questions belong to the business and its advisers. My part is to build the system so those controls can be met: every credit traceable from provider event to deal ticket, and every manual step tied to a named person.',
    },
    {
      p: 'I help brokers and prop firms design, build and review this path between a payment provider and MT5, including the failure tests. See [payment integration](/services/payment-integration) and [MT5 Manager API development](/services/mt5-manager-api-developer), or [get in touch](/contact) if it would help to talk it through.',
    },
  ],
};
