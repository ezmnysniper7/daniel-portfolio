import type { Note } from '../notes';

export const note: Note = {
  slug: 'first-fintech-engineer',
  date: '2026-11-11',
  minutes: 10,
  service: 'fintech-technical-partner',
  basis: 'field',
  tags: ['Hiring', 'Founders', 'Fintech', 'Payments', 'Engineering practice'],
  title: 'What founders should look for in their first fintech engineer',
  description:
    'Eight things a founder can check in a first fintech engineer without reading code, plus first-call questions, good and worrying answers, and red flags.',
  body: [
    {
      p: "In most software a bug is an annoyance. A button does nothing, a page loads slowly, someone refreshes and carries on. In financial software a bug is someone's money: a deposit that was paid and never credited, a withdrawal sent twice, an account still trading after it should have been stopped.",
    },
    {
      p: 'Your first engineer sets the habits the whole codebase inherits. People copy the code they find, so the way a repeated payment notification is handled in month one is the way it will be handled in year three. That makes this hire matter more than its size suggests.',
    },
    {
      p: 'You may not be able to judge code. You can still judge the person, because the habits that matter show up in conversation and in what they write down. Below are eight things to look for, a short piece of code explained in plain language, questions for a first call and a list of red flags.',
    },
    {
      label: 'Disclosure',
      callout:
        'I am an engineer for hire, so I have an interest here. I have written this to be just as useful if you hire someone else. The examples come from my own work because those are the ones I can vouch for.',
    },

    { h2: '1. They ask how it fails before how it looks' },
    {
      p: "A careful engineer's first questions are about failure: what happens when the provider's notification arrives twice, arrives late or never arrives. You will hear three words. Idempotency means doing a thing twice has the same result as doing it once, retries are the repeat attempts every provider makes, and reconciliation is a regular comparison of your records with the provider's.",
    },
    {
      p: 'Most payment bugs I have fixed were not on the checkout page. They were in the callback, the message a provider sends to say a payment went through. On a ticketing project in a previous job, status polling, idempotent fulfilment and an automatic reconciliation job were what kept a missed callback from becoming a lost order.',
    },

    { h2: '2. They tell you what they have not done' },
    {
      p: "Fintech is several specialities sharing one word. A specialist who has built a broker's payment flows has not automatically built a trading engine, and someone who has built an exchange has not automatically integrated a card provider. A good candidate draws that line for you before you ask.",
    },
    {
      p: 'My own version: as a freelancer I built the [MetaTrader 5 integration and real-time risk monitor](/work/tradersflow) for a live prop-trading firm, and in my current job I build deposit and payment flows at a live broker. I have not shipped a proprietary trading engine in production, and my site says so. If your product needed one, I would call it a design to be proven with tests, a proof of concept and independent review before client money went near it.',
    },

    { h2: '3. They prove a cause before they change code' },
    {
      p: 'When something breaks, the careless response is to change the most suspicious line and see whether the problem goes away. The careful response is to find evidence first. In a money system a fix aimed at the wrong cause leaves the real fault in place and adds a second one.',
    },
    {
      p: "At the broker, an HTTP 500 error on crypto trades was traced by correlation id, a tag that follows one request through every log, to duplicate asset-pair records. The fix made symbol lookup deterministic instead of hiding the error. At the prop firm, some accounts briefly read another account's figures under load. The cause was a trading platform SDK that is not thread-safe (it cannot safely be called from several places at once), so every call now goes through one lock and a guard checks that the account returned is the account requested.",
    },
    {
      p: 'Ask a candidate for a story like these. Listen for how they knew, not for how fast they fixed it.',
    },

    { h2: '4. They write things down' },
    {
      p: 'Look for a written scope, a list of what is out of scope, the deploy order, and runbooks: short instructions for routine and emergency operations. Documents are how you check the work without reading code. They are also how the next engineer avoids relearning everything.',
    },
    {
      p: 'At the prop firm the deployment runbook had four steps: stop both services, deploy, check a known-bad and a known-good account by hand with the risk monitor switched off, then switch it on. It is short, and it removes a whole class of incident. Be wary of anyone who says the documentation will come later.',
    },

    { h2: '5. They keep the first release small and the architecture boring' },
    {
      p: 'A first release that touches money should do few things and do them correctly. In practice that means one deployable program where possible, one integration route to each provider, and manual operations where automation can wait. A person approving withdrawals from an admin screen is a perfectly good first version.',
    },
    {
      p: 'The usual name for this shape is a modular monolith: one program, deployed as a single unit, divided inside into separate parts with clear boundaries. [SolveMY](/work/solvemy), my own product, is a live marketplace I built alone on one deployable Go service with 235 endpoints across 31 domain services. One person can run that. Be cautious of a proposal with many small services and a queue between each of them for a product that has no users yet.',
    },

    { h2: '6. They can run production, not only write code' },
    {
      p: "Code that works on a laptop is the start. Someone also has to make sure there are backups that have actually been restored, monitoring that notices a failure before a customer does, alerts that reach a person, and a staging environment where changes are tried against the provider's test mode first.",
    },
    {
      p: "On the prop-firm work that meant health monitoring with alert emails, crash notifications, automatic reconnection and separate demo and live services. I run SolveMY's production myself, with Docker, backups and monitoring. If your first engineer has never been responsible for a live system, plan for someone who has.",
    },

    { h2: '7. They are honest about AI tools' },
    {
      p: 'Most engineers now use AI coding assistants, and that is fine. I use them daily. They are fast for drafting, for exploring unfamiliar code and for writing tests.',
    },
    {
      p: 'What matters is how the output gets checked. On any path that moves money, generated code is a draft: a person reads every line of the change (the diff) and tests prove the behaviour. An engineer who cannot explain a line should not ship it, whoever wrote it. Be wary of a timeline that only works if nobody reads what the tool produced.',
    },

    { h2: '8. They know where engineering stops' },
    {
      p: 'Licences, KYC and AML policy (identity checks and anti-money-laundering rules) and legal structure belong to you and your advisers. Whether you need a licence, who may hold client funds and what you may promise investors are legal questions. An engineer who answers them confidently is guessing.',
    },
    {
      p: 'A good engineer designs the system so those controls can be met: an audit trail, approval steps, limits, records your compliance adviser can export. They also tell you when a feature needs a lawyer before it needs code. I am not a lawyer or a compliance officer, and I would rather say so on the first call than in month three.',
    },

    { h2: 'What care looks like in about twenty lines' },
    {
      p: "You do not need to read code to follow this example. It is the part of a payment system that receives the provider's message saying a deposit was paid. The three numbered comments mark the lines that separate a careful engineer from a careless one.",
    },
    {
      lang: 'ts',
      code: `const rawBody = express.raw({ type: 'application/json' });

app.post('/webhooks/payments', rawBody, async (req, res) => {
  // 1. Prove the message came from the payment provider before reading it.
  if (!signatureIsValid(req.body, req.get('x-signature'), WEBHOOK_SECRET)) {
    return res.sendStatus(401);
  }
  const event = JSON.parse(req.body.toString('utf8'));

  await db.transaction(async (tx) => {
    // 2. The table accepts each provider event id once. A repeat saves nothing.
    const saved = await tx.query(
      'INSERT INTO payment_events (provider_event_id) VALUES ($1) ' +
        'ON CONFLICT (provider_event_id) DO NOTHING',
      [event.id],
    );
    if (saved.rowCount === 0) return; // seen before: change nothing
    await creditDeposit(tx, event); // saved together with the row above
  });

  // 3. Reply "received" only after the transaction has committed.
  res.sendStatus(200);
});`,
      caption:
        "Illustrative TypeScript for an Express server and PostgreSQL, written to be read by non-engineers. The helper names (signatureIsValid, db.transaction, creditDeposit) stand in for the provider's check and your own code. A real handler also checks the event type, amount and currency.",
    },
    {
      p: "Step 1 is there because the address that receives these messages is public, so anyone can send a fake 'payment succeeded' to it. Step 2 is there because providers repeat a notification whenever they are unsure you received it. Without that rule in the database, a repeat credits the customer twice.",
    },
    {
      p: "Step 3 is about order. If the server replies 'received' first and saves second, a crash in between loses a real payment and the provider has no reason to send it again. Replying last means a failure leads to a retry, and step 2 makes the retry safe.",
    },
    {
      p: 'A version without these three lines passes every demo. It fails only on the bad day. I go through the full checklist in [payment webhooks that never double-credit](/notes/payment-webhooks-idempotency).',
    },

    { h2: 'Questions to ask on a first call' },
    {
      p: 'None of these needs a technical background. Listen less for jargon and more for whether the answer is specific.',
    },
    {
      table: {
        head: ['Question', 'A good answer sounds like', 'A worrying answer sounds like'],
        rows: [
          [
            'What happens if the payment provider sends the same notification twice?',
            "It will happen. Each event is stored under the provider's id with a unique key, so the second one changes nothing.",
            'That should not happen, or the provider takes care of it.',
          ],
          [
            'How will we know if a deposit was paid but never credited?',
            "A scheduled reconciliation job compares our records with the provider's and alerts a person about any mismatch.",
            'The customer will contact support.',
          ],
          [
            'What will the first release not include?',
            'A specific list, with what is done by hand in the meantime and when each item is revisited.',
            'Nothing is left out. It will all be in there.',
          ],
          [
            'Who else could maintain this if you left?',
            'Any competent engineer who knows a mainstream stack. The code, tests and runbooks sit in your repository.',
            'You will not need anyone else, or it depends on a framework only they know.',
          ],
          [
            'Which part of this have you not built before?',
            'They name the parts and say how the risk is reduced: a proof of concept, a review, a smaller first step.',
            'I have done all of this before.',
          ],
          [
            'How is a change that touches balances tested before it goes live?',
            "Automated tests, a staging environment on the provider's test mode, and someone reads the change line by line before release.",
            'I test carefully on the live system.',
          ],
          [
            'Where will the source code, servers and provider accounts live?',
            'In accounts your company owns from day one. I get access that you can revoke.',
            'In my accounts for now. We can transfer them later.',
          ],
          [
            'What do you need from our lawyers or compliance adviser before you start?',
            'Which entity holds client money, which licences apply, the KYC rules, and whether the payment provider has approved the business.',
            'Nothing. That is not a technical matter.',
          ],
        ],
      },
      caption:
        'Questions a non-technical founder can ask on a first call. The exact wording of an answer matters less than how specific it is.',
    },

    { h2: 'Red flags' },
    {
      list: [
        'A fixed price in the first conversation for a scope nobody has defined.',
        'A promise of everything in two months.',
        "No questions about your licences or your payment provider's approval of the business.",
        'No staging environment, so every change is first tried on the system that holds real money.',
        'A balance stored as a single number, with no history of the entries that produced it.',
        'Unwillingness to hand over the source code and access to the accounts it runs on.',
      ],
    },
    {
      p: 'One of these is a reason to ask more questions. Several together are a reason to keep looking.',
    },

    { h2: 'How to start small' },
    {
      p: 'You do not have to commit to a full build after one conversation. The cheapest way to see how someone thinks is a paid discovery or architecture sprint: a short, fixed piece of work that ends in a written deliverable.',
    },
    {
      p: 'That document should set out the scope, what is out of scope, the main risks, the integration route, a plan for the first release and the open questions for your lawyers. The test is whether any other team could build from it. If they could, you have lost nothing by starting small. If the document is vague, you found that out cheaply.',
    },
    {
      p: 'This is how I try to work, and you are welcome to hold me to this list. If you want that kind of help with a product that touches money, [my fintech technical partner page](/services/fintech-technical-partner) describes it, and you can [contact me](/contact) to talk it through.',
    },
  ],
};
