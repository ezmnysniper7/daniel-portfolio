import type { Note } from '../notes';

export const note: Note = {
  slug: 'mt5-manager-api-vs-web-api',
  date: '2026-11-11',
  minutes: 9,
  service: 'mt5-manager-api-developer',
  basis: 'field',
  tags: ['MetaTrader 5', 'Manager API', 'Web API', 'C#', '后台系统'],
  title: 'MT5 Manager API 还是 Web API：你的后台该用哪一个？',
  description:
    '后台该用 MT5 Manager API 还是 Web API？从延迟、写操作、部署和故障模式几个方面做一次实用对比，来自在生产环境运行过这两者的经验。',
  body: [
    {
      p: '在一个线上运行的自营交易平台上，最初的 MetaTrader 5 对接是通过 Web API 读取持仓的。一次持仓查询可能要好几秒，所以风控检查只能由后端的定时任务来跑。在两次运行之间，已经突破亏损限额的交易者还可以继续交易。',
    },
    {
      p: '我基于 Manager API 写了一个 C#/.NET 服务，把这些读取改为走它的本地推送缓存（pump），在那里只需要毫秒级的时间。有了这一点，每隔几秒检查一遍所有活跃账户才变得可行。项目背景见[案例](/work/tradersflow)。',
    },
    {
      p: '网上能找到的这两种 API 的对比，大多是厂商的介绍页，没有代码。这一篇基于在同一个生产系统里运行过这两者的经验写成。一句话总结：它们各有擅长的事，大多数后台最后两个都会用。',
    },

    { h2: '两种 API 到底是什么' },
    {
      p: 'Manager API 是 MetaQuotes 提供的原生 Windows SDK：C++ 库加一层 .NET 封装，另外还有一个官方的 Python manager 包，底层用的是同一套原生库。你的进程用一个管理员账号（manager account）登录一台交易服务器，并保持一条长连接。在 .NET 里，通过 `SMTManagerAPIFactory` 创建 `CIMTManagerAPI`，连接时用 `EnPumpModes` 标志位选择要推送（pump）哪些数据。',
    },
    {
      p: '推送正是选它的理由。打开推送模式后，SDK 会在你的进程里维护一份持续更新的用户和持仓本地副本，所以像 `PositionGet` 这样的调用，读的是你自己机器上的内存。`...Request` 这一类方法，比如 `PositionRequest` 和 `DealRequest`，则是通过网络向服务器查询。成交历史始终来自服务器。',
    },
    {
      p: 'Web API 走的是 HTTPS。先用管理员账号完成一次质询应答式的认证握手，然后发送命令，并以 JSON 形式收到用户、持仓、成交和余额操作的结果。任何操作系统上的任何语言都能调用它。代价是每次读取都要到交易服务器走一个来回。',
    },
    {
      p: '两者用的都是由券商创建并掌控的管理员账号。服务器、访问权限和任何许可证都属于券商或公司，从来不属于开发者；这个账号上的权限，决定了你的软件能读什么、能改什么。',
    },
    {
      diagram: 'mt5-access-routes',
      caption:
        '从你的后端到 MT5 服务器有两条路：通过 HTTPS 直接调用 Web API，或者通过 HTTP 调用一个小型 Windows 服务，由它持有 Manager API 连接和推送缓存。',
    },

    { h2: '两者并排对比' },
    {
      table: {
        head: ['', 'Manager API', 'Web API'],
        rows: [
          [
            '读取延迟',
            '读推送缓存是毫秒级。`...Request` 调用要访问服务器，会慢一些。',
            '每次读取都是一次网络往返。我替换掉的那个持仓查询，可能要好几秒。',
          ],
          [
            '实时监控',
            '很合适：每隔几秒把所有活跃账户的本地副本读一遍。',
            '通过 HTTPS 轮询。按需打开的页面够用，但很难对大量账户做高频循环。',
          ],
          [
            '写操作（余额操作、交易权限变更）',
            '支持，例如用 `DealerBalance` 做入金、出金和信用（credit），以管理员账号的权限为限。',
            '支持，以命令的形式调用并返回 JSON，受同样的权限限制。从承载业务逻辑的后端调用很方便。',
          ],
          [
            '语言与平台',
            '原生 Windows SDK：C++、.NET 封装，以及官方 Python 包。',
            '任何操作系统上，只要能走 HTTPS、能处理 JSON 就行。',
          ],
          [
            '部署与运维',
            '需要一台 Windows 主机、SDK 库文件，以及一条需要持续看护的长连接。',
            '不用安装任何东西。只有一个会话需要认证和续期。',
          ],
          [
            '并发模型',
            '把 SDK 当作非线程安全的来用：每个 manager 连接同一时间只发一个调用，需要更高吞吐时用一个小型连接池。',
            '常规的 HTTP 客户端问题：会话管理、超时，以及不要用并发请求把交易服务器压垮。',
          ],
          [
            '故障模式',
            '连接断开、重连后缓存尚未就绪、调用重叠时读到错误数据、进程崩溃。',
            '超时、会话过期、高负载下响应变慢、写操作的响应始终没有回来。',
          ],
          [
            '什么时候选它',
            '风控监控、覆盖大量账户的看板，以及一切需要不停读取的场景。',
            '读取量不大的场景，以及从 Linux 后端发起写操作、又没有 Windows 主机要维护的场景。',
          ],
        ],
      },
      caption: '这是在一个生产平台上看到的取舍。服务器负载、账户数量和网络路径不同，每一项的影响程度也会不同。',
    },
    {
      p: '对很多后台工作来说，Web API 完全是个好选择。如果你的 CRM 只是在客服打开客户页面时读一下账户，在入金到账时提交一次余额操作，那么从你已经在运行的 Linux 后端发一个 HTTPS 请求，工程投入就刚刚好。',
    },
    {
      p: '但当你需要一直盯着所有账户时，它就不再是合适的工具了。每次读取都要一次往返，每一次都要交易服务器来干活，公司规模越大，这个循环就越慢。',
    },

    { h2: '我最后采用的分工' },
    { p: '这个平台最后两个接口都在用，各做各自适合的事。' },
    {
      list: [
        '快速读取和监控走 Manager API 的推送缓存。违规监控器和其他所有需要轮询的功能，都从这里读。',
        '写操作走现有体系已经信任的那个接口。在那个平台上，账户变更本来就是由主后端通过 Web API 完成的，所以保持不变。',
        '较慢的网络请求保留为后备，用在缓存尚未就绪的时候，比如刚刚重连之后。',
      ],
    },
    {
      p: '写操作不管走哪条路，都要有防护。一次余额操作会在账户上生成一笔成交；一次交易权限变更，决定了已被判定失败的交易者还能不能开仓。调用方必须确认 MT5 接受了这次变更，没有接受就要抛出错误，这样数据库和交易服务器才不会在没人察觉的情况下对不上。这个问题里和重试有关的那一半，[另有一篇文章专门讲 MT5 入金如何恰好入账一次](/notes/mt5-deposit-credit-exactly-once)。',
    },
    {
      label: '客户资金',
      callout:
        '余额操作动的是券商账面上的客户资金。谁可以发起、依据哪张牌照、需要哪些审批，是业务方和它的律师要回答的问题。软件的设计应当让这些管控能够被强制执行，也能够被审计。',
    },
    {
      p: '同一个数字有不止一种读法，还等于多了一份旁证。在那个平台上，只有当两个独立的 MT5 数据源给出的净值一致时，账户才会晋级到下一阶段。',
    },

    { h2: '一把锁，外加对每个返回结果的校验' },
    {
      p: 'Manager SDK 必须当作非线程安全的来对待。我用的封装大致是这个样子：每个 manager 连接配一把锁，所有 SDK 调用都要经过它；数据上的登录号和请求的登录号对上之前，什么都不返回。',
    },
    {
      lang: 'csharp',
      code: `public sealed record AccountSnapshot(ulong Login, double Balance, double Equity);
public sealed record PositionSnapshot(ulong Login, string Symbol, double Profit);

public sealed partial class GuardedManager
{
    // One lock per manager connection. Connect and shutdown take it as well.
    private readonly object _sdkLock = new();
    private CIMTManagerAPI? _manager; // only touched while holding _sdkLock

    public AccountSnapshot GetAccount(ulong login)
    {
        lock (_sdkLock)
        {
            var account = ReadAccount(login)
                ?? throw new Mt5DataException($"No account data for login {login}");
            if (account.Login != login)
                throw new Mt5DataException($"Asked for {login}, got {account.Login}");
            return account;
        }
    }

    public IReadOnlyList<PositionSnapshot> GetPositions(ulong login)
    {
        lock (_sdkLock)
        {
            // Pumped copy first (local). Server request only if the cache is not ready.
            var positions = ReadPositionsFromPump(login)
                ?? RequestPositionsFromServer(login)
                ?? throw new Mt5DataException($"No position data for login {login}");
            if (positions.Any(p => p.Login != login))
                throw new Mt5DataException($"Wrong login in positions for {login}");
            return positions; // empty is a valid answer, null never is
        }
    }

    // SDK half of the class, kept in another file. These wrap UserAccountGet or
    // UserAccountRequest, PositionGet and PositionRequest. Each one copies plain
    // values out of the SDK objects while the lock is held, and returns null
    // unless the SDK call came back with MTRetCode.MT_RET_OK.
    private partial AccountSnapshot? ReadAccount(ulong login);
    private partial IReadOnlyList<PositionSnapshot>? ReadPositionsFromPump(ulong login);
    private partial IReadOnlyList<PositionSnapshot>? RequestPositionsFromServer(ulong login);
}`,
      caption:
        '示意性的 C# 代码，不是可以直接拿去用的类。SDK 的具体方法签名因 SDK 版本而异，所以 SDK 调用都放在私有方法后面。Mt5DataException 是一个普通的应用层异常。',
    },
    {
      p: '有两个细节比看上去重要。第一，私有方法在还持有锁的时候，就把普通的值从 SDK 对象里拷贝出来，所以不会有 SDK 对象在线程之间共享。第二，只有 SDK 报告成功时，空的持仓列表才算有效的结果。调用失败就是异常，绝不是空列表。',
    },
    {
      p: '这把锁会让批量读取变慢，因为调用要排队。如果这成了瓶颈，下一步就是建一个小型的 manager 连接池，每个连接同一时间只给一个调用方使用。',
    },

    { h2: '只支持 Windows 的 SDK，怎么和 Linux 技术栈共存' },
    {
      p: '反对用 Manager API 的常见理由是：其他所有东西都跑在 Linux 上或容器里。于是有的团队去试 Wine，或者用交易终端加 EA（Expert Advisor）搭一座桥，因为一台 Windows 机器放不进围绕 Linux 镜像搭建的流水线。',
    },
    {
      p: '这两种绕法，都是拿一个小而已知的成本，去换一个未知的成本。在兼容层上跑原生 SDK，这种配置出了问题只能你自己一个人调试；用终端搭桥，则是把一个桌面程序放到了风控链路的中间。平淡但维护得住的做法，是用一个小型 Windows 服务独占 SDK，对外提供 HTTP API。它需要的东西很少：',
    },
    {
      list: [
        'API Key 和 IP 白名单，保证只有你的后端能访问它。',
        '模拟盘和实盘用各自独立的实例，各有自己的管理员账号、密钥和配置。',
        '健康检查要报告 MT5 连接的状态，而不只是进程还在运行。',
        '交易服务器断开连接时自动重连。',
        '断线和崩溃时发告警邮件，让人在交易者发现之前就知道。',
      ],
    },
    {
      p: '你的主后端继续留在 Linux 上，把它当作普通的内部服务来用：一个基础 URL、一个密钥，加上超时和重试。在我的项目里，跑在 Node 上的 TypeScript 后端通过 HTTP 调用模拟盘和实盘两个 Windows 服务，从不直接碰 SDK。SDK 进程崩溃，影响也只留在那个进程里。后端看到的只是一次失败的 HTTP 调用，像处理其他服务故障一样处理即可。',
    },

    { h2: '生产环境教会我的事' },
    {
      list: [
        'SDK 不是线程安全的。在并发负载下，有些账户会短暂地读到另一个账户的数字。修复办法是用一把锁包住所有 SDK 调用，连接和关闭也用同一把锁，再加上前面展示的登录号校验。',
        '没有数据要当作失败处理。账户读不到、调用失败、数字对不上，都意味着跳过这个账户，稍后再试。把“没有回应”当成“零”的风控引擎，会把正常的账户判定为失败。',
        '一个管理员账号只能读一家券商的一台服务器，别的都读不到。模拟盘和实盘是不同的服务器，可能出现相同的登录号，所以一个账户的身份是（服务器，登录号）这一对，而不是登录号本身。',
        '关掉监控再部署。先停掉服务，部署，手动检查一个已知违规的账户和一个已知正常的账户，确认之后再打开监控。',
      ],
    },
    {
      p: '以上每一条的更多细节，见[实时风控监控的五条经验](/notes/mt5-manager-api-lessons)。',
    },

    { h2: '简明选择指南' },
    {
      list: [
        '选 Web API：读取只是偶尔发生（客户页面、日终报表），写操作本来就在 Linux 后端里，而且你不想维护一台 Windows 主机。',
        '选 Manager API：需要近实时地监控风险，需要循环读取大量账户，或者有必须保持最新的看板。',
        '两个都用：Web API 对接已经在正常工作，问题出在延迟上。把高频读取搬到一个 Manager API 服务里，受信任的写操作留在原处，较慢的那条路径保留为后备。',
      ],
    },
    {
      p: '我为券商、自营交易公司（prop firm）和 CRM 团队开发并评审这类对接：Manager API 服务、围绕它的监控，以及写操作的防护。具体范围见 [MT5 Manager API 对接](/services/mt5-manager-api-developer)页面。如果你正在为自己的后台在两种 API 之间做选择，欢迎[给我发消息](/contact)。',
    },
  ],
};
