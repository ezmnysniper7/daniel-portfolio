import type { Note } from '../notes';

export const note: Note = {
  slug: 'mt5-deposit-credit-exactly-once',
  date: '2026-11-11',
  minutes: 10,
  service: 'payment-integration',
  basis: 'design',
  tags: ['MetaTrader 5', '支付', 'Webhook', '幂等', '对账'],
  title: '把一笔支付恰好一次记入 MT5 余额：认领、执行、查明、对账',
  description:
    '怎样让一条支付 webhook 最终只变成一次 MT5 余额操作：用唯一键记录事件、原子认领、把参考号写进成交备注，并且每天对账。',
  body: [
    {
      p: '一位客户用银行卡支付了 500 美元。支付服务商立刻就知道了，你的数据库片刻之后也知道了。而客户查看这笔钱的地方是 MT5 交易服务器，在你的代码对他的账户执行余额操作之前，它一无所知。',
    },
    {
      p: '没有任何事务能同时覆盖你的数据库和 MT5。从“服务商说已付款”到“MT5 说已入账”之间有一段空档，在这段空档里发生一次崩溃、一次超时或一次重试，结局不外乎三种。',
    },
    {
      list: [
        '入账两次。客户拿一笔从未到账的钱去交易或出金，而你要等到账目对不平时才发现。',
        '始终没有入账。卡已经扣了款，账户里却什么都没有，你最先听到的消息是一张客服工单，或者一笔拒付（chargeback）。',
        '入到了错误的账户。一位客户的入金出现在另一位客户的登录号上，这下就成了两起事故。',
      ],
    },
    {
      label: '本文依据',
      callout:
        '这篇文章的两半都是生产经验，分别来自不同的系统。支付：在一家正在运营的券商做的 Checkout.com 入金，支持 Apple Pay 和 Google Pay（我的全职工作）；另外还有一个带 HMAC 签名的支付网关服务，以及票务业务中带对账的幂等履约（之前的一份工作）。MT5：我负责过一家正在运营的自营交易公司（prop firm）的 MetaTrader 5 对接（自由职业）。而把两者合在一起、完全按本文写法实现的这套模式，我只在自己的原型工作中运行过，对接的是模拟的 MT5 服务器和测试用的支付服务商。请把它当作一份在模拟环境里测试过的设计。在它承载客户资金之前，需要先对着你真实的交易服务器和支付服务商做概念验证，要有在每一步都杀掉 worker 的测试，还要有一次独立评审。',
    },

    { h2: '整体流程' },
    {
      p: '严格来说，在两个不共享事务的系统之间，谁也做不到真正的“恰好一次”。你能做出来的，是这样一套流程：绝不在知情的情况下执行第二次，总能查清发生了什么，其余的交给人处理。',
    },
    {
      diagram: 'deposit-to-mt5-flow',
      caption:
        '一笔入金从带签名的 webhook 到 MT5 成交的全过程：唯一的事件记录、入账意图、原子认领、带着你方参考号的余额操作、保存下来的成交单号，最后在支付服务商、你的数据库和 MT5 之间对账。',
    },
    {
      steps: [
        '支付服务商发来 webhook。对原始请求体校验它的签名。',
        '用唯一键记录这个事件。重复的事件到此为止。',
        '在同一个事务里，创建一条状态为 `pending` 的入账意图记录，服务商的每笔支付只能有一条。然后确认 webhook。',
        '一个 worker 认领这条记录：用一条原子的 `UPDATE` 把 `pending` 改为 `claimed`。',
        '抢到认领的 worker 调用 MT5 余额操作，并把入账参考号写在成交备注（comment）里。',
        '成功后，保存成交单号（deal ticket），并把记录标记为 `done`。',
        '遇到超时或崩溃，把记录标记为 `unknown`，在任何重试之前先去查找那笔成交。',
        '每天有一个任务，把服务商的结算记录、入账记录和 MT5 的余额成交放在一起对账。',
      ],
    },

    { h2: '第一步：webhook' },
    {
      p: '在做任何 JSON 解析之前，先对原始请求体校验服务商的签名。很多框架会先解析请求体再重新序列化，字节因此发生变化，原本有效的签名就会校验失败。校验不通过的请求一律拒绝，并记录日志。',
    },
    {
      p: '接着把服务商的事件 ID 存下来，并加上唯一约束。如果插入时冲突，说明这个事件你已经见过：确认它，然后什么都不做。在同一个数据库事务里，创建下文所说的入账意图记录。',
    },
    {
      p: '两个键各管一件事。事件键防止同一条消息被处理两次。入账记录上的支付键，防止关于同一笔支付的两个事件（比如一次授权通过和一次扣款）生成两笔入账。哪个事件才算“已付款”，因服务商和支付方式而异，所以要把这个判断写下来。',
    },
    {
      p: '尽快确认 webhook，把 MT5 那部分工作放到后台任务里去做。一个等着 MT5 返回的处理程序，总有一天会超时，服务商的重试就会撞进你做到一半的工作里。webhook 这一侧另有一篇文章：[永不重复入账的支付回调](/notes/payment-webhooks-idempotency)。',
    },

    { h2: '第二步：先认领，再执行' },
    {
      p: '入账意图是这样一条记录：这笔支付，要变成这个登录号上的这个金额。登录号来自一条入金记录，这条记录是已登录的客户在自己名下的账户里选择给哪一个入金时，由你的服务器创建的；绝不能取自浏览器，也不能取自 payload 里的自由文本。',
    },
    {
      p: '这条记录的初始状态是 `pending`。worker 必须先用一条原子的 `UPDATE` 把它改成 `claimed`，然后才可以和 MT5 通信；并且只有更新语句返回了一行的那个 worker 才发起调用。',
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
      caption: '示意性的 PostgreSQL。表名、列名、状态列表和租约时长都只是示例，请按实际情况调整。',
    },
    {
      p: "如果两个 worker 在同一时刻执行这条认领语句，PostgreSQL 在默认隔离级别下会让第二个等第一个完成，然后重新检查 `status = 'pending'`，发现条件不成立，于是什么都不更新。整把锁就是这些。",
    },
    {
      p: '租约用来应对 worker 中途挂掉的情况。租约到期后，记录进入 `unknown`，而不是退回 `pending`，因为挂掉的 worker 可能在此之前已经调到了 MT5。租约时长要比 MT5 调用的超时时间长出足够的余量。',
    },

    { h2: '第三步：调用 MT5' },
    {
      p: '一次余额操作会在账户上生成一笔成交，带有 `DEAL_BALANCE` 这个动作类型、一个金额和一段备注（comment）。在 Manager API 里对应的是 `DealerBalance`，Web API 也有等价的命令。备注会跟着这笔成交走，所以把你自己的参考号写进去，比如第 48213 号入账就写 `dep:48213`。',
    },
    {
      p: '备注字段很短，所以参考号要紧凑，而且同一笔入账的每一次尝试都要用同一个参考号。MT5 不会阻止第二笔成交带上相同的备注：唯一性在你的数据库里，备注则是你事后查出 MT5 做了什么的途径。',
    },
    {
      p: '每个 manager 连接上的调用都要串行化：把 SDK 当作非线程安全的来用。在一个线上对接里，我见过并发调用返回了另一个账户的数字，所以现在 MT5 返回的每一份数据，我都会校验登录号。',
    },
    {
      p: '这次调用有三种结局。成功：保存成交单号，把记录标记为 `done`。明确拒绝（登录号不存在、账户已禁用）：标记为 `failed`，交给人处理。超时、连接断开或进程挂掉：你不知道 MT5 有没有执行这笔入账，这种状态需要一个专门的名字。',
    },

    { h2: '第四步：查明“unknown”' },
    {
      p: '在任何重试之前，先向 MT5 查询这个登录号上从认领前不久开始的余额成交，看其中有没有带着你的参考号的那一笔。结果有四种可能。',
    },
    {
      list: [
        '找到了：入账已经发生。记下成交单号，把记录标记为 `done`，结束。',
        'MT5 给出了完整的答复，但没找到：入账没有发生。记录可以回到 `pending`，重新被认领。',
        '找到了，但对不上：参考号在，可金额不同，或者出现了不止一次。保持 `unknown`，交给人处理。涉及钱的修正不要自动做。',
        '没有答复：保持 `unknown`，并发告警通知人。拿不到数据，绝不等于“没有入账”。',
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
        '示意性的 TypeScript。MT5 调用放在一个接口后面，这样同一套逻辑在测试里对接 mock，在生产环境里对接真实的网关。',
    },
    {
      p: '只有当 MT5 对这个时间窗口给出了成功且完整的答复时，网关才可以返回 `absent`。超时、断线，或者一个它解释不了的空响应，都必须映射为 `no_answer`。把“没有数据”读成“没有成交”，正是重复入账穿过一套严谨设计的方式。',
    },
    {
      p: '还要确认最初那次调用是真的死了，而不只是慢：等够调用的超时时间再加一段余量，并确保排在锁后面的调用不会在之后又被发出去。匹配时要同时核对动作类型、完全一致的备注和金额：一笔成交带着你的参考号、金额却不同，就要交给人来处理。',
    },

    { h2: '每种故障下，这套模式怎么应对' },
    {
      table: {
        head: ['场景', '不用这套模式', '用这套模式'],
        rows: [
          [
            '重复的 webhook',
            '两个处理程序都运行了，各执行了一次余额操作。',
            '第二次插入撞上事件唯一键，什么都不做。支付键保证最多只有一条入账记录。',
          ],
          [
            'webhook 比浏览器跳转先到，或者跳转根本没有发生',
            '返回页和 webhook 都去尝试入账，或者明明付款成功，客户看到的却是“失败”。',
            '只有已落库、带签名的事件才会生成入账。返回页只读取状态，别的什么都不做。',
          ],
          [
            'worker 在认领之后崩溃',
            '记录一直停在“处理中”，或者被定时器重置，于是入账又发了一次。',
            '租约到期，记录进入 `unknown`。由成交查询来判断当时有没有调到 MT5。',
          ],
          [
            'MT5 调用超时',
            '第一次其实已经成功，自动重试却又发出了第二次余额操作。',
            '不重试。记录变为 `unknown`，再凭参考号查明结果。',
          ],
          [
            'MT5 成功了，随后数据库写入失败',
            '钱已经在账户上，记录却显示没有，下一次运行又入账一次。',
            '查询凭备注找到这笔成交，记下单号，结束。',
          ],
          [
            '登录号对应错了',
            '登录号取自跳转参数或可被修改的元数据，结果入到了另一个账户。',
            '登录号来自服务器为已登录客户创建的入金记录。调用之前再核对一次账户归属和币种，对账时还会把每笔成交上的登录号与对应记录上的登录号做比较。',
          ],
          [
            '之后发生部分退款或拒付',
            '直接在原来的入账记录上修改，或者 MT5 余额始终没有调整。',
            '退款或拒付是一条新记录，有自己的服务商键和自己的参考号，关联到原来那笔入账，并走同样的认领和查明流程。如果账户里已经没有这笔钱，由人来决定。',
          ],
        ],
      },
      caption: '这段空档出问题的七种方式，以及这套模式分别怎么处理。',
    },

    { h2: '对账' },
    {
      p: '前面的步骤能减少差错，对账则负责找出剩下的那些。每天一次，一个任务把三份清单摆在一起：服务商的结算记录、你的入账记录，以及按备注里的参考号匹配出来的 MT5 余额成交。',
    },
    {
      p: '要双向比较。已结算的支付没有对应的入账记录，说明丢了一个 webhook。状态为 `done` 的记录找不到匹配的成交，说明你的数据库错了。成交上的参考号对不上任何记录，或者同一个参考号出现了两笔成交，说明 MT5 里有一笔你的记录解释不了的钱。完全没有参考号的余额成交，也应该列在报告里。',
    },
    {
      p: '这个任务不动钱。每一条对不上的项目，都会变成一项交给人处理的任务，并把三份记录并排列出。在我参与过的一个票务项目里，正是与状态轮询并行运行的对账任务，把漏掉的回调找了出来。',
    },
    {
      p: '出金是同一个问题反过来，而且风险更高，因为钱是从公司流出去的。如果由我来做，我会先扣减 MT5 余额，再对外付款；在任何重试之前，先查明结果不明的那笔付款；并且要求双人复核（maker-checker）：一个人准备付款，另一个人审批，由服务器强制保证这是两个不同的人。',
    },

    { h2: '看起来是捷径，其实不是' },
    {
      list: [
        '把成交备注当数据库用。备注不保证唯一，查找成交是一次网络请求，而且备注存不了 `pending` 或 `unknown`。备注是证据；那一行记录才是正本。',
        '相信浏览器跳转。客户会关掉标签页，会断网，返回地址（return URL）也可以被重放。跳转可以改变客户看到的内容；能动钱的，只有通过校验的服务器对服务器消息。',
        '超时后自动重试。HTTP 客户端和任务队列往往默认会重试，而超时并不等于失败。对余额调用要关掉自动重试，交给查明逻辑来决定。',
        '用浮点数计算金额。金额要用整数的最小货币单位或定点小数来保存，加密货币需要的小数位比银行卡更多。币种只换算一次，所用汇率连同来源和时间一起记在这条记录上，重试时绝不重新计算金额。只在最后一步才转换成 MT5 调用所接受的数值类型。',
      ],
    },
    {
      label: '责任',
      callout:
        '在大多数市场，持有和划转客户资金都属于受监管的业务，牌照、支付服务商的审批和法律问题，归业务方及其顾问负责。我的部分是把系统做成能够满足这些管控要求的样子：每一笔入账都能从服务商事件一路追溯到成交单号，每一个人工步骤都对应到一个具名的人。',
    },
    {
      p: '我帮券商和自营交易公司设计、开发和评审支付服务商与 MT5 之间的这条链路，包括故障测试。可以看看[支付对接](/services/payment-integration)和 [MT5 Manager API 对接](/services/mt5-manager-api-developer)这两个服务；如果聊一聊会有帮助，欢迎[联系我](/contact)。',
    },
  ],
};
