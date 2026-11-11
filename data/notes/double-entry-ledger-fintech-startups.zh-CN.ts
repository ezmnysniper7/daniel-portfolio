import type { Note } from '../notes';

export const note: Note = {
  slug: 'double-entry-ledger-fintech-startups',
  date: '2026-11-11',
  minutes: 9,
  service: 'payment-integration',
  basis: 'design',
  tags: ['复式记账账本', 'PostgreSQL', '支付', '钱包'],
  title: '金融科技初创公司的复式记账账本：最小但仍然正确的版本',
  description:
    '写给金融科技初创公司：用 PostgreSQL 为钱包和储值业务设计一个最小但仍然正确的复式记账账本，包括三张表、一条记账路径、安全的提现和每天一次的对账。',
  body: [
    {
      p: '钱包功能的第一版，往往只是迁移脚本里的一行：给用户表加一个 `balance` 字段。入金就加，提现就减，演示也能跑通。但在真实资金进来之前，我会劝创始人放弃这种做法，因为它会在三个地方出问题。',
    },
    {
      list: [
        '丢失更新。两个请求在同一时刻读到余额 100，各自确认够扣 80，然后各自写回 20。用户从 100 里取走了 160，而这个字段看不出任何异常。',
        '没有历史。用户问余额为什么是 37.50，单凭一个数字答不上来。',
        '无法对账。一列当前余额没法和支付服务商的结算报告比对，所以漏记或重复入账的入金会一直藏着，直到有人来投诉。',
      ],
    },
    {
      p: '复式记账账本用三张表和几条规则，就能把这三个问题都解决掉。',
    },
    {
      label: '设计提案',
      callout:
        '账本周边的这几块，我在生产环境交付过：带幂等处理和对账的支付对接，贯穿一家券商多个 API 的加密货币金额 8 位小数精度，以及双人复核（maker-checker）审批流程的权限控制。持有客户余额的复式记账钱包，我还没有在生产环境运行过。本文是我会采用的设计，以及这样设计的理由。在它持有客户资金之前，需要拿出与之相称的验证：并发测试、用服务商的真实报告做一次对账演练、独立评审，以及法律方面的签字确认。',
    },

    { h2: '模型：账户、交易、分录' },
    {
      p: '账户是装着某一种货币价值的桶：某个用户的钱包、支付服务商替你保管的钱、你的手续费收入。交易是一个业务事件，比如一笔入金。分录是交易里的一行：哪个账户，带符号的金额是多少。',
    },
    {
      p: '起作用的是三条规则。每笔交易都有两条或更多分录，加起来等于零，所以价值只会在账户之间转移，不会凭空产生。分录永远不修改、不删除：记错了，就新记一笔冲正交易来更正，两笔都留在账上。余额不单独存储：它就是一个账户所有分录的总和。',
    },
    {
      diagram: 'ledger-entries',
      caption:
        '一笔入金就是一笔交易、两条分录：服务商清算账户上记一条负数分录，用户钱包账户上记一条金额相等的正数分录。',
    },
    {
      p: '每条分录我只存一个带符号的金额：正数表示贷记（credit），负数表示借记（debit）。符号要站在平台的角度来读：钱包为正，是你欠这位用户的钱；服务商清算账户为负，是服务商替你保管的钱。放眼整个账本，每种货币的总和都是零。',
    },

    { h2: '三张表，加一条由数据库强制执行的规则' },
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
        '示意性的 PostgreSQL 代码。名称仅为示例，金额是以最小货币单位表示的带符号整数。',
    },
    {
      p: '总和为零这条规则，我不只写在记账代码里，还用一个延迟约束触发器来强制执行。延迟的意思是它在提交时才运行，那时一笔交易的所有分录都已写入；只要有任何一种货币的总和不为零，提交就会被中止。写在数据库里的规则，对迁移脚本和在 SQL 控制台里的手工修复同样有效，而应用代码里的检查在这些场合根本不会运行。',
    },
    {
      p: '单独一条分录永远通不过检查。没有任何分录的交易行，触发器是看不到的，所以这种情况由记账代码来拒绝。',
    },
    {
      p: '授权语句让“只追加”落到实处：应用角色对交易和分录只能插入和读取，别的都不行。它在 `ledger_accounts` 上保留 `UPDATE` 权限，只是因为 PostgreSQL 要求有这个权限才能锁行。如果应用角色是这些表的属主，以上限制全都不成立，所以迁移要用另一个单独的属主角色来执行。',
    },

    { h2: '只有一条记账路径' },
    {
      p: '向这几张表插入数据的代码只有一个模块。入金处理程序、提现接口和手续费任务都调用它，传入交易类型、一组账户和金额，以及一个幂等键。',
    },
    {
      p: '幂等键让重试变得安全。到达两次的 webhook，或者跑到一半重启的任务，都会带着同一个键来记账，碰上唯一约束，第二次什么也不会写入。幂等键要用外部已经确定下来的东西来拼，比如服务商的支付 ID 加上事件类型。接收这一侧怎么做，见[永不重复入账的支付回调](/notes/payment-webhooks-idempotency)。',
    },

    { h2: '够快的余额查询' },
    {
      p: '一开始，余额直接算出来：借助 `account_id` 上的索引，对一个账户的分录执行 `SELECT sum(amount)`。在很长一段时间里这都够快，而且它不可能和分录对不上，因为它就是分录本身。',
    },
    {
      p: '等求和变慢了，再把当前余额缓存到一张单独的表里，每个账户一行。它要和分录在同一个数据库事务里更新，这样两者要么一起提交，要么一起回滚。再加一个定时检查，用分录重新算出每个余额，发现任何差异就告警。',
    },
    {
      p: '作为权威来源的余额，绝不要放在 Redis 里。它没法和 PostgreSQL 里的分录原子地一起提交，所以只要在两次写入之间崩溃一次，两边就对不上了。放一份可以重建、只用于展示的副本，是没问题的。',
    },

    { h2: '提现与透支检查' },
    {
      p: '并发问题变成资金损失，就发生在提现上。如果余额检查和记账这两步可以被分开，同时到达的两个请求就都能通过检查。最简单的办法是先锁住钱包的账户行：第二个请求会等第一个提交，然后读到已经包含第一笔的余额。',
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
        '示意代码，这里写成了数据库函数。同样的步骤也可以由应用代码在一个事务内完成，行锁会一直持有到该事务提交。',
    },
    {
      p: '凡是从钱包里往外拿钱的操作，都必须拿同一把锁。入金不需要：漏看一笔同时发生的入账，只会让检查更严格。',
    },
    {
      p: '这依赖 PostgreSQL 默认的 `READ COMMITTED` 隔离级别：每条语句都能看到在它开始之前已提交的全部数据。在 `REPEATABLE READ` 下，等待中的事务会一直沿用它在第一个事务提交之前取得的快照，读到的是过期的余额。',
    },
    {
      p: '另一种做法是条件写入。只靠一条带条件的插入、子查询里仅仅读取总和，是不够的：两条语句同时运行，看到的都是旧的总和。对缓存余额行执行带条件的 `UPDATE`，在 `WHERE` 子句里写上 `balance >= amount`，则是可行的，因为它会拿到行锁，并在等待结束后重新检查一次。',
    },

    { h2: '精度与货币' },
    {
      p: '金额永远不用浮点数。法币我用 `BIGINT` 存最小货币单位的整数（分、便士、仙），既精确，求和也便宜。',
    },
    {
      p: '加密货币要逐个资产来决定：用 satoshi 这样的整数最小单位，还是用固定小数位的 `NUMERIC`。18 位小数的代币如果按最小单位存，大约 9 个整币就会让 `BIGINT` 溢出，所以这类资产应该用 `NUMERIC`。',
    },
    {
      p: '在我目前的工作中，也就是[一家正在运营的多资产券商](/work/cfi-broker-payments-crypto-backend)，让加密货币金额带上 8 位小数精度，要改的是 API、模型和权限定义，而不是某一个字段的类型。只要有一个客户端把 JSON 数字解析成浮点数，其余的功夫就白费了，所以在这个设计里，金额以字符串形式传输。',
    },
    {
      p: '每个账户只持有一种货币。货币兑换是一笔独立的交易，两种货币各有分录，各自与一个兑换账户轧平，汇率及其来源记在 metadata 里。这就是触发器按货币分别求和的原因。',
    },

    { h2: '常见的资金事件' },
    {
      p: '大多数产品只需要少数几种交易形态。写代码之前，先把它们列成一张表，因为每一行都是一个决定。',
    },
    {
      table: {
        head: ['事件', '借记（负数分录）', '贷记（正数分录）'],
        rows: [
          ['银行卡入金已扣款', '服务商清算账户', '用户钱包'],
          ['用户申请提现', '用户钱包', '待处理提现'],
          ['服务商确认出款', '待处理提现', '服务商清算账户'],
          ['出款失败或被拒绝', '待处理提现', '用户钱包'],
          ['内部转账', '转出方钱包', '转入方钱包'],
          ['收取手续费或佣金', '用户钱包', '手续费收入'],
          ['入金退款', '用户钱包', '服务商清算账户'],
          ['拒付（chargeback）', '用户钱包，不足的部分记入拒付损失账户', '服务商清算账户'],
        ],
      },
      caption:
        '仅为示意。每个服务商、每种货币各设一个服务商清算账户。',
    },
    {
      p: '有了待处理账户，分两步完成的提现在账上才不会失真。用户一提出申请，这笔金额就离开钱包，所以不可能被花两次；但只有服务商确认出款之后，它才离开平台。',
    },

    { h2: '对账与人工调账' },
    {
      p: '服务商清算账户之所以存在，就是为了对账。每天一次，把每个清算账户上的分录和服务商的结算报告比对，按服务商的支付 ID 匹配。这样能查出三类问题：已记账但从未结算的入金，已结算但从未记账的入金，以及金额不一致的入金。',
    },
    {
      p: '凡是匹配不上的，都要变成一项有负责人的任务，而不是日志里的一行。在此前一份工作的一个票务项目里，正是对账任务加上状态轮询，让漏掉的支付回调没有变成收入损失。',
    },
    {
      p: '人工更正，比如给用户的一笔善意补偿，也走同一条记账路径，记为一笔类型为 `adjustment` 的交易，并且要经过双人复核。一个人发起，另一个人审批，两人的身份和调账原因都随交易一起保存（在上面的表结构里就是 `metadata`）。发起人和审批人是同一个用户的调账，数据库也应当拒绝。上面的最小表结构没有包含这项检查。',
    },

    { h2: '账本放在哪里' },
    {
      p: '我不会一上来就做一个账本微服务。我会在单体应用内部做一个隔离的账本模块，它有自己的 schema、自己的数据库角色和一个很窄的接口：记一笔交易、读一个余额、列出分录。',
    },
    {
      p: '原因在于原子性。批准一笔提现申请和记下它的账本分录，应该在同一个数据库事务里提交，否则就都不提交。在同一个数据库里，这只是一个 `BEGIN` 加一个 `COMMIT`。一旦跨了网络边界，就变成了 outbox、重试和补偿。',
    },
    {
      p: '因为边界清晰，日后如果规模或监管机构有要求，这个模块可以再拆成独立的服务。我以[金融科技技术合伙人](/services/fintech-technical-partner)的身份，协助客户做这类决定。',
    },

    { h2: '哪些可以先不做，哪些绝不能省' },
    { p: '第一版可以省掉不少东西：' },
    {
      list: [
        '多币种轧差。每个账户一种货币，加上显式的兑换交易，就够了。',
        '利息、奖励，以及其他任何随时间累计的东西。',
        '复杂的资金冻结和部分扣款。每个流程设一个待处理账户，就能覆盖早期的大部分需求。',
      ],
    },
    {
      p: '有三件事没有商量余地，因为真实资金一旦流动起来，哪一件都没法干净地补上：',
    },
    {
      list: [
        '每一次记账都要幂等。',
        '分录只追加，用冲正交易来更正。',
        '从第一天起就和外部世界对账。',
      ],
    },
    {
      p: '持有客户余额，可能会被认定为受监管的储值业务，具体适用电子货币、支付服务还是虚拟资产方面的规则，取决于你在哪里经营。这个问题该由业务方和律师来回答，而且他们的答案要排在最前面：它决定了你到底是否持有余额，以及账本必须支持哪些管控措施。',
    },
    {
      p: '我帮创始人和小团队做的正是这一层：服务商对接、幂等记账、对账，以及它们背后的账本。详情见[支付对接](/services/payment-integration)页面；如果你想在动手之前，请人对钱包设计给一份第二意见，欢迎[联系我](/contact)。',
    },
  ],
};
