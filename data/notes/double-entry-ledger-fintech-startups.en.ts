import type { Note } from '../notes';

export const note: Note = {
  slug: 'double-entry-ledger-fintech-startups',
  date: '2026-11-11',
  minutes: 9,
  service: 'payment-integration',
  basis: 'design',
  tags: ['Double-entry ledger', 'PostgreSQL', 'Payments', 'Wallets'],
  title: 'Double-entry ledger design for fintech startups: the smallest version that is still correct',
  description:
    'A minimal double-entry ledger in PostgreSQL for wallets and stored value: three tables, one posting path, safe withdrawals and daily reconciliation.',
  body: [
    {
      p: 'The first version of a wallet feature is usually one line in a migration: add a `balance` column to the users table. Deposits add to it, withdrawals subtract from it, and the demo works. I would talk a founder out of it before real money touches it, because it fails in three ways.',
    },
    {
      list: [
        'Lost updates. Two requests read a balance of 100 at the same moment. Each checks that 80 is available and writes back 20. The user has taken 160 out of 100 and the column shows nothing wrong.',
        'No history. When a user asks why their balance is 37.50, a single number cannot answer.',
        "No reconciliation. A column of current balances cannot be compared with your payment provider's settlement report, so a missing or doubled deposit stays hidden until someone complains.",
      ],
    },
    {
      p: 'A double-entry ledger removes all three with three tables and a few rules.',
    },
    {
      label: 'Design proposal',
      callout:
        "I have shipped the pieces around a ledger in production: payment integrations with idempotent processing and reconciliation, 8-decimal precision for crypto amounts across a broker's APIs, and access control for a maker-checker approval flow. I have not run a double-entry wallet holding client balances in production. This is the design I would build, and why. Before it holds client money it needs proof in proportion: concurrency tests, a reconciliation dry run against real provider reports, independent review and legal sign-off.",
    },

    { h2: 'The model: accounts, transactions, entries' },
    {
      p: "An account is a bucket of value in one currency: a user's wallet, the money a payment provider is holding for you, your fee revenue. A transaction is one business event, such as a deposit. An entry is one line of a transaction: this account, this signed amount.",
    },
    {
      p: "Three rules do the work. Every transaction has two or more entries that sum to zero, so value is moved between accounts and never created. Entries are never updated or deleted: a mistake is corrected by a new, reversing transaction, and both stay visible. A balance is not stored: it is the sum of an account's entries.",
    },
    {
      diagram: 'ledger-entries',
      caption:
        "One deposit as a single transaction with two entries: a negative entry on the provider clearing account and an equal positive entry on the user's wallet account.",
    },
    {
      p: "I store one signed amount per entry: positive for a credit, negative for a debit. Read the sign from the platform's side: a positive wallet is money you owe that user, and a negative provider clearing account is money the provider holds for you. Across the whole ledger, each currency sums to zero.",
    },

    { h2: 'Three tables and one rule the database enforces' },
    {
      lang: 'sql',
      code: `CREATE TABLE ledger_accounts (
  id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  owner    TEXT NOT NULL,   -- 'user:42', 'provider:acme', 'platform'
  kind     TEXT NOT NULL,   -- 'user_wallet', 'provider_clearing', 'fee_revenue'
  currency TEXT NOT NULL,   -- 'USD', 'EUR', 'BTC': one currency per account
  UNIQUE (owner, kind, currency)
);

CREATE TABLE ledger_transactions (
  id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  idempotency_key TEXT        NOT NULL UNIQUE,
  kind            TEXT        NOT NULL,   -- 'deposit', 'withdrawal_request', 'fee'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata        JSONB       NOT NULL DEFAULT '{}'
);

CREATE TABLE ledger_entries (
  id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  transaction_id BIGINT NOT NULL REFERENCES ledger_transactions (id),
  account_id     BIGINT NOT NULL REFERENCES ledger_accounts (id),
  amount         BIGINT NOT NULL CHECK (amount <> 0)  -- minor units: + credit, - debit
);
CREATE INDEX ledger_entries_account_idx     ON ledger_entries (account_id);
CREATE INDEX ledger_entries_transaction_idx ON ledger_entries (transaction_id);

-- Zero-sum rule, checked per currency. Deferred, so it runs at COMMIT,
-- after every entry of the transaction has been inserted.
CREATE FUNCTION ledger_assert_balanced() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM ledger_entries e
    JOIN ledger_accounts a ON a.id = e.account_id
    WHERE e.transaction_id = NEW.transaction_id
    GROUP BY a.currency
    HAVING sum(e.amount) <> 0
  ) THEN
    RAISE EXCEPTION 'ledger transaction % does not sum to zero', NEW.transaction_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE CONSTRAINT TRIGGER ledger_entries_balanced
  AFTER INSERT ON ledger_entries
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION ledger_assert_balanced();

-- The application role can append and read. It cannot change history.
GRANT SELECT, INSERT ON ledger_transactions, ledger_entries TO app_role;
GRANT SELECT, INSERT, UPDATE ON ledger_accounts TO app_role;  -- UPDATE allows row locks
REVOKE UPDATE, DELETE, TRUNCATE ON ledger_transactions, ledger_entries FROM app_role;`,
      caption:
        'Illustrative PostgreSQL. Names are examples, and amounts are signed integers in minor units.',
    },
    {
      p: "I enforce the zero-sum rule with a deferred constraint trigger, not only in the posting code. Deferred means it runs at commit, once all of a transaction's entries exist, and aborts the commit if any currency does not sum to zero. A rule in the database also holds for a migration script or a manual fix in a SQL console, where a check in application code never runs.",
    },
    {
      p: 'A lone entry can never pass. A transaction row with no entries is invisible to the trigger, so the posting code rejects that case.',
    },
    {
      p: 'The grants make append-only real: the application role can insert and read transactions and entries, and nothing else. It keeps `UPDATE` on `ledger_accounts` only because PostgreSQL requires that privilege to lock a row. None of this holds if the application role owns the tables, so migrations run as a separate owner role.',
    },

    { h2: 'One posting path' },
    {
      p: 'One module is the only code that inserts into these tables. The deposit handler, the withdrawal endpoint and the fee job all call it with a kind, a list of accounts and amounts, and an idempotency key.',
    },
    {
      p: "The key makes retries safe. A webhook that arrives twice, or a job that restarts halfway, posts with the same key, meets the unique constraint and writes nothing the second time. Build the key from something the outside world has already fixed, such as the provider's payment id plus the event type. The receiving side is covered in [payment webhooks that never double-credit](/notes/payment-webhooks-idempotency).",
    },

    { h2: 'Balances that are fast enough' },
    {
      p: "Start by deriving the balance: `SELECT sum(amount)` over one account's entries, using the index on `account_id`. It is fast enough for a long time and cannot disagree with the entries, because it is the entries.",
    },
    {
      p: 'When the sum becomes slow, cache a running balance in a separate table, one row per account. Update it in the same database transaction as the entries, so the two commit or roll back together. A scheduled check recomputes every balance from the entries and alerts on any difference.',
    },
    {
      p: 'Never keep the authoritative balance in Redis. It cannot commit atomically with the entries in PostgreSQL, so a crash between the two writes leaves them disagreeing. A display copy that can be rebuilt is fine.',
    },

    { h2: 'Withdrawals and the overdraft check' },
    {
      p: "Withdrawals are where concurrency turns into lost money. If the balance check and the post can be separated, two requests that arrive together both pass the check. The simplest fix is to lock the wallet's account row first: the second request waits for the first to commit, then reads a balance that includes it.",
    },
    {
      lang: 'sql',
      code: `CREATE FUNCTION ledger_request_withdrawal(
  p_key TEXT, p_wallet BIGINT, p_pending BIGINT, p_amount BIGINT
) RETURNS BIGINT
LANGUAGE plpgsql AS $$
DECLARE
  v_tx      BIGINT;
  v_balance NUMERIC;
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'withdrawal amount must be positive';
  END IF;

  -- A second withdrawal on this wallet waits here until the first commits.
  PERFORM 1 FROM ledger_accounts WHERE id = p_wallet FOR UPDATE;

  INSERT INTO ledger_transactions (idempotency_key, kind)
  VALUES (p_key, 'withdrawal_request')
  ON CONFLICT (idempotency_key) DO NOTHING
  RETURNING id INTO v_tx;

  IF v_tx IS NULL THEN   -- a retry: this request was already posted
    RETURN (SELECT id FROM ledger_transactions WHERE idempotency_key = p_key);
  END IF;

  SELECT COALESCE(sum(amount), 0) INTO v_balance
  FROM ledger_entries WHERE account_id = p_wallet;

  IF v_balance < p_amount THEN
    RAISE EXCEPTION 'insufficient funds';   -- rolls back the row inserted above
  END IF;

  INSERT INTO ledger_entries (transaction_id, account_id, amount) VALUES
    (v_tx, p_wallet,  -p_amount),
    (v_tx, p_pending,  p_amount);

  RETURN v_tx;
END;
$$;`,
      caption:
        'Illustrative, written as a database function. The same steps work from application code inside one transaction, and the row lock is held until that transaction commits.',
    },
    {
      p: 'Every operation that takes value out of a wallet has to take the same lock. Deposits do not need it: missing a concurrent credit only makes the check stricter.',
    },
    {
      p: "This depends on PostgreSQL's default `READ COMMITTED` isolation, where each statement sees everything committed before it started. Under `REPEATABLE READ` the waiting transaction keeps the snapshot it took before the first one committed, and reads a stale balance.",
    },
    {
      p: 'The alternative is a conditional write. A conditional insert whose subquery only reads the sum is not enough alone: two statements running together both see the old sum. A conditional `UPDATE` on a cached balance row, with `balance >= amount` in its `WHERE` clause, works because it takes the row lock and checks again after waiting.',
    },

    { h2: 'Precision and currency' },
    {
      p: 'Money is never a float. For fiat I store integers in minor units (cents, pence, sen) in a `BIGINT`, which is exact and cheap to sum.',
    },
    {
      p: 'Crypto needs a decision per asset: integer base units such as satoshi, or `NUMERIC` with a fixed scale. Base units of an 18-decimal token overflow `BIGINT` at roughly nine whole coins, so those belong in `NUMERIC`.',
    },
    {
      p: 'At my current job, [a live multi-asset broker](/work/cfi-broker-payments-crypto-backend), carrying 8-decimal precision for crypto amounts meant changing APIs, models and access-control definitions, not one column type. One client that parses a JSON number into a float undoes the rest, so in this design amounts travel as strings.',
    },
    {
      p: 'Each account holds one currency. A conversion is its own transaction with entries in both currencies, each balanced against a conversion account, with the rate and its source recorded in the metadata. That is why the trigger sums per currency.',
    },

    { h2: 'The common money events' },
    {
      p: 'Most products need only a handful of transaction shapes. Write them down as a table before writing code, because every row is a decision.',
    },
    {
      table: {
        head: ['Event', 'Debit (negative entry)', 'Credit (positive entry)'],
        rows: [
          ['Card deposit captured', 'Provider clearing', 'User wallet'],
          ['Withdrawal requested', 'User wallet', 'Withdrawals pending'],
          ['Payout confirmed by the provider', 'Withdrawals pending', 'Provider clearing'],
          ['Payout failed or rejected', 'Withdrawals pending', 'User wallet'],
          ['Internal transfer', "Sender's wallet", "Recipient's wallet"],
          ['Fee or commission charged', 'User wallet', 'Fee revenue'],
          ['Refund of a deposit', 'User wallet', 'Provider clearing'],
          ['Chargeback', 'User wallet, with any shortfall to a chargeback loss account', 'Provider clearing'],
        ],
      },
      caption:
        'Illustrative. Keep one provider clearing account per provider and currency.',
    },
    {
      p: 'The pending account keeps a two-step withdrawal honest. The amount leaves the wallet the moment the user asks, so it cannot be spent twice, but leaves the platform only when the provider confirms the payout.',
    },

    { h2: 'Reconciliation and manual adjustments' },
    {
      p: "Reconciliation is the reason the provider clearing accounts exist. Once a day, compare the entries on each clearing account with the provider's settlement report, matched on the provider's payment id. That catches deposits posted but never settled, settled but never posted, and amounts that differ.",
    },
    {
      p: 'Anything unmatched becomes a task with an owner, not a line in a log. On a ticketing project at a previous job, a reconciliation job together with status polling is what kept missed payment callbacks from becoming lost revenue.',
    },
    {
      p: 'Manual corrections, such as a goodwill credit, go through the same posting path as a transaction of kind `adjustment`, under maker-checker. One person prepares it, a different one approves it, and both identities and the reason are stored with the transaction (in `metadata` in the schema above). The database should also refuse an adjustment where maker and approver are the same user. The minimal schema above leaves that check out.',
    },

    { h2: 'Where the ledger lives' },
    {
      p: 'I would not start with a ledger microservice. I would build an isolated ledger module inside the monolith, with its own schema, its own database role and a narrow interface: post a transaction, read a balance, list entries.',
    },
    {
      p: 'The reason is atomicity. Approving a withdrawal request and posting its ledger lines should commit in one database transaction or not at all. Inside one database that is a `BEGIN` and a `COMMIT`. Across a network boundary it becomes outboxes, retries and compensation.',
    },
    {
      p: 'Because the boundary is clean, the module can become its own service later if scale or a regulator requires it. I help with decisions like this as a [fintech technical partner](/services/fintech-technical-partner).',
    },

    { h2: 'What to leave out, and what never to' },
    { p: 'A first version can skip a lot:' },
    {
      list: [
        'Multi-currency netting. One currency per account and explicit conversions are enough.',
        'Interest, rewards and anything else that accrues over time.',
        'Complex holds and partial captures. One pending account per flow covers most early needs.',
      ],
    },
    {
      p: 'Three things are not optional, because none of them can be added cleanly after real money has moved:',
    },
    {
      list: [
        'Idempotency on every post.',
        'Append-only entries, corrected by reversing transactions.',
        'Reconciliation against the outside world, from the first day.',
      ],
    },
    {
      p: 'Holding client balances can count as regulated stored value, under e-money, payment services or virtual-asset rules depending on where you operate. That question belongs to the business and its lawyers, and their answer comes first: it decides whether you hold balances at all and which controls the ledger must support.',
    },
    {
      p: 'I help founders and small teams with this layer: provider integrations, idempotent posting, reconciliation and the ledger behind them. The details are on the [payment integration](/services/payment-integration) page, and if you would like a second opinion on a wallet design before you build it, [get in touch](/contact).',
    },
  ],
};
