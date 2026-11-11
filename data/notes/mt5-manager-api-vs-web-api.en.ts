import type { Note } from '../notes';

export const note: Note = {
  slug: 'mt5-manager-api-vs-web-api',
  date: '2026-11-11',
  minutes: 9,
  service: 'mt5-manager-api-developer',
  basis: 'field',
  tags: ['MetaTrader 5', 'Manager API', 'Web API', 'C#', 'Back office'],
  title: 'MT5 Manager API vs Web API: which one should your back office use?',
  description:
    'MT5 Manager API or Web API for your back office: a practical comparison of latency, writes, deployment and failure modes, from running both in production.',
  body: [
    {
      p: 'On a live prop-trading platform, the first MetaTrader 5 integration read positions through the Web API. A single positions call could take several seconds, so risk checks ran from a periodic backend job. Between two runs, a trader who had already broken a loss limit could keep trading.',
    },
    {
      p: 'I built a C#/.NET service on the Manager API and moved those reads to its locally pumped cache, where they take milliseconds. That is what made it practical to check every active account every few seconds. The background is in the [case study](/work/tradersflow).',
    },
    {
      p: 'Most public comparisons of the two APIs are vendor pages with no code. This one is written from running both in the same production system. The short version: they are good at different jobs, and most back offices end up using both.',
    },

    { h2: 'What each API actually is' },
    {
      p: 'The Manager API is a native Windows SDK from MetaQuotes: C++ with a .NET wrapper, plus an official Python manager package that sits on the same native libraries. Your process logs in to one trade server with a manager account and holds a long-lived connection. In .NET you create a `CIMTManagerAPI` through `SMTManagerAPIFactory` and choose what to pump with `EnPumpModes` flags when you connect.',
    },
    {
      p: 'Pumping is the reason to use it. With pump modes on, the SDK keeps a local, continuously updated copy of users and positions inside your process, so a call such as `PositionGet` reads memory on your own machine. The `...Request` variants, such as `PositionRequest` and `DealRequest`, ask the server over the network. Deal history always comes from the server.',
    },
    {
      p: 'The Web API is HTTPS. You complete a challenge and response authentication handshake with a manager account, then send commands and receive JSON for users, positions, deals and balance operations. Any language on any operating system can call it. The price is that every read is a round trip to the trade server.',
    },
    {
      p: 'Both run on a manager account that the broker creates and controls. The server, the access and any licence belong to the broker or firm, never to the developer, and the permissions on that account decide what your software can read or change.',
    },
    {
      diagram: 'mt5-access-routes',
      caption:
        'Two routes from your backend to the MT5 server: straight to the Web API over HTTPS, or over HTTP to a small Windows service that holds the Manager API connection and its pumped cache.',
    },

    { h2: 'The two side by side' },
    {
      table: {
        head: ['', 'Manager API', 'Web API'],
        rows: [
          [
            'Read latency',
            'Milliseconds from the pumped cache. `...Request` calls go to the server and are slower.',
            'A network round trip per read. The positions call I replaced could take several seconds.',
          ],
          [
            'Real-time monitoring',
            'A good fit: read the local copy for every active account every few seconds.',
            'Polling over HTTPS. Fine for on-demand screens, hard to run as a tight loop over many accounts.',
          ],
          [
            'Writes (balance operations, rights changes)',
            "Supported, for example `DealerBalance` for deposit, withdrawal and credit, within the manager account's permissions.",
            'Supported as commands with JSON replies, within the same permissions. Easy to call from the backend that holds the business logic.',
          ],
          [
            'Language and platform',
            'Native Windows SDK: C++, a .NET wrapper, an official Python package.',
            'Anything that speaks HTTPS and JSON, on any operating system.',
          ],
          [
            'Deployment and operations',
            'A Windows host, the SDK libraries and a long-lived connection to supervise.',
            'Nothing to install. A session to authenticate and renew.',
          ],
          [
            'Concurrency model',
            'Treat the SDK as not thread-safe: one call at a time per manager connection, a small pool of connections for more throughput.',
            'Ordinary HTTP client concerns: session handling, timeouts and not flooding the trade server with parallel requests.',
          ],
          [
            'Failure modes',
            'Dropped connection, cache not ready after a reconnect, wrong data if calls overlap, a crashed process.',
            'Timeouts, expired sessions, slow replies under load, a write whose reply never arrives.',
          ],
          [
            'When to choose it',
            'Risk monitoring, dashboards over many accounts, anything that reads constantly.',
            'Low-volume reads, and writes from a Linux backend with no Windows host to run.',
          ],
        ],
      },
      caption:
        'Trade-offs as seen on one production platform. Server load, account count and network path change how hard each one bites.',
    },
    {
      p: 'The Web API is a perfectly good choice for a lot of back-office work. If your CRM reads an account when a support agent opens a client page and posts a balance operation when a deposit clears, an HTTPS call from the Linux backend you already run is the right amount of engineering.',
    },
    {
      p: 'It stops being the right tool when you need to look at every account all the time. Each read costs a round trip, the trade server does the work for every one of them, and the loop gets slower as the firm grows.',
    },

    { h2: 'The split I ended up with' },
    { p: 'The platform finished with both interfaces in use, each doing the job it suits.' },
    {
      list: [
        "Fast reads and monitoring come from the Manager API's pumped cache. The breach monitor and anything else that polls read from there.",
        'Writes go through whichever interface the setup already trusts. On that platform account changes already went through the Web API from the main backend, and they stayed there.',
        'The slower network request stays as a fallback for the moments when the cache is not ready, such as just after a reconnect.',
      ],
    },
    {
      p: 'Writes need guarding whichever route they take. A balance operation creates a deal on the account, and a rights change decides whether a failed trader can still open positions. The caller has to confirm that MT5 accepted the change and raise an error if it did not, so the database and the trade server cannot silently disagree. The retry side of that problem has [its own note on crediting MT5 deposits exactly once](/notes/mt5-deposit-credit-exactly-once).',
    },
    {
      label: 'Client money',
      callout:
        "Balance operations move client money on the broker's books. Who may trigger them, under which licence and with which approvals is a question for the business and its lawyers. The software should be designed so those controls can be enforced and audited.",
    },
    {
      p: 'Having more than one way to read the same figure also gives you a second opinion. On that platform no account was promoted to the next phase unless its equity agreed across two independent MT5 sources.',
    },

    { h2: 'One lock, and a check on every answer' },
    {
      p: 'The Manager SDK has to be treated as not thread-safe. This is the shape of the wrapper I use: every SDK call goes through one lock per manager connection, and nothing is returned until the login on the data matches the login that was asked for.',
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
        'Illustrative C#, not a drop-in class. Exact SDK signatures vary by SDK build, so the SDK calls sit behind private methods. Mt5DataException is an ordinary application exception.',
    },
    {
      p: 'Two details matter more than they look. The private methods copy plain values out of the SDK objects while the lock is still held, so no SDK object is shared between threads. And an empty position list is only a valid answer when the SDK reported success. A failed call is an exception, never an empty list.',
    },
    {
      p: 'The lock makes batch reads slower, because calls queue. If that becomes the limit, the next step is a small pool of manager connections, each used by one caller at a time.',
    },

    { h2: 'Running a Windows-only SDK next to a Linux stack' },
    {
      p: 'The usual objection to the Manager API is that everything else runs on Linux or in containers. Teams try Wine, or a bridge through a trading terminal and an expert advisor, because a Windows machine does not fit a pipeline built around Linux images.',
    },
    {
      p: 'Both workarounds swap a small known cost for an unknown one. A native SDK under a compatibility layer is a configuration you will debug alone, and a terminal bridge puts a desktop program in the middle of your risk path. The boring, supportable answer is a small Windows service that owns the SDK and exposes an HTTP API. It needs very little:',
    },
    {
      list: [
        'API keys and an IP allow-list, so only your backend can reach it.',
        'Separate demo and live instances, each with its own manager login, keys and configuration.',
        'A health check that reports the state of the MT5 connection, not only that the process is running.',
        'Auto-reconnect when the trade server drops the connection.',
        'Alert emails on disconnects and crashes, so a person knows before the traders do.',
      ],
    },
    {
      p: 'Your main backend stays on Linux and treats it like any other internal service: a base URL, a key, timeouts and retries. In my case a TypeScript backend on Node called the demo and live Windows services over HTTP and never touched the SDK. A crash in the SDK process stays in that process. The backend sees a failed HTTP call and handles it like any other outage.',
    },

    { h2: 'What production taught me' },
    {
      list: [
        "The SDK is not thread-safe. Under concurrent load, some accounts briefly read another account's figures. The fix was one lock around every SDK call, the same lock for connect and shutdown, and the login check shown above.",
        'Treat no data as a failure. A missing account, a failed call or figures that do not add up mean skip the account and try again. A risk engine that reads silence as zero will fail healthy accounts.',
        "One manager login reads one broker's server and nothing else. Demo and live are separate servers and can hold the same login number, so the identity of an account is the pair (server, login), not the login.",
        'Deploy with the monitor off. Stop the services, deploy, check a known-bad and a known-good account by hand, and only then switch the monitor on.',
      ],
    },
    {
      p: 'There is more detail on each of these in [five lessons from a real-time risk monitor](/notes/mt5-manager-api-lessons).',
    },

    { h2: 'A short decision guide' },
    {
      list: [
        'Choose the Web API when reads are occasional (a client page, an end-of-day report), your writes already live in a Linux backend, and you would rather not run a Windows host.',
        'Choose the Manager API when you monitor risk in near real time, read many accounts in a loop, or show dashboards that must stay current.',
        'Use both when a Web API integration already works and the problem is latency. Move the hot reads to a Manager API service, leave trusted writes where they are, and keep the slower path as a fallback.',
      ],
    },
    {
      p: 'I build and review this kind of integration for brokers, prop firms and CRM teams: the Manager API service, the monitoring around it and the guards on writes. The scope is on the [MT5 Manager API developer](/services/mt5-manager-api-developer) page, and if you are choosing between the two APIs for your own back office, [send me a message](/contact).',
    },
  ],
};
