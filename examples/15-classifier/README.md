# Classifier workshop

One inbound lead, scored by Jev. The classifier never writes the reply. The agent does, and the classifier answers questions about the lead or the draft.

Each script is self-contained. Read the file and you have the lead, the questions, and the classifier.

```
examples/15-classifier
├── src/01-score-lead.ts       score one lead, no agent
├── src/02-processor.ts        drop a bad lead, stop a bad draft
├── src/03-workflow.ts         route on the answers, then write
├── src/04-model-selection.ts  spend the strong model only on a hot lead
├── src/05-tool-approval.ts    pause a large quote for a person
├── src/06-scorer.ts           grade a draft after the fact
├── src/07-seed-dataset.ts     load those drafts into Studio
└── src/mastra/index.ts        Studio entry. The scripts do not import it.
```

## Setup

```bash
cd examples/15-classifier
pnpm install
cp .env.example .env   # OPENAI_API_KEY and TYPESAFE_AI_API_KEY
pnpm dev               # Studio: the workflow graph and the agent
```

```bash
pnpm score             # just the classifier
pnpm processor         # guards on the agent
pnpm workflow          # classifier step, then branches, then the agent
pnpm model-selection
pnpm approval
pnpm scorer
pnpm seed              # drafts for a Studio experiment
```

Jev is `typeSafeAi.evaluationModel('jev-latest')` from `@ai-sdk/typesafe-ai`. The agent model is a language model id. They are not interchangeable.

## The lead and the questions

Priya Shah, VP Engineering at Northwind Analytics (180 people, B2B SaaS), asking for pricing on 200 seats.

Three questions, asked together, about the same lead:

| key | type | what it returns |
| --- | --- | --- |
| `fit` | choice | `strong` / `partial` / `poor`, plus a probability per option |
| `intent` | score | a position on browsing → researching → evaluating → ready to buy |
| `icp` | boolean | `probability`, the chance this company is in the ICP |

Jev calls the boolean a noul. `@ai-sdk/typesafe-ai` maps that to `probability`. There is no second confidence number. The distribution is the signal.

## 01 — ask the questions

`pnpm score`

A classifier call. Configured questions first, then the same questions passed per call, which is the only place per-call questions are legal. Prints `fit.choice`, `intent.score`, and `icp.probability`.

## 02 — guard the agent

`pnpm processor`

The agent writes the reply. Before the model runs, a `ClassifierProcessor` tripwires a poor fit or an ICP chance under 0.3, and flags a hot lead when `intent` is 2 or above. After the model drafts, a second processor tripwires a reply that probably concedes on price. The demo runs both: Priya is answered, and a landscaping lead is stopped before a draft exists. `errorStrategy: 'warn'` so a classifier failure degrades instead of taking the agent down.

## 03 — route in a workflow

`pnpm workflow`, or open Studio with `pnpm dev`.

`lead-route` looks up the registered `lead-scorer` by id and branches on the answers. The step is typed with `typeof leadQuestions`, because a string id does not carry the question types. Poor fit is disqualified and the workflow bails before `.agent()`. Intent of 2 or more goes to sales, which may quote the list price. High ICP goes to nurture, which may not quote a price. Anything else goes to review. The winning branch writes the prompt. The sales agent runs after the branch and only writes. The demo runs both: Priya is handed to sales, and a landscaping owner who asked for pricing is disqualified because the title is not a buyer. `branch()` runs every matching condition, so the conditions are exclusive: a later route excludes the earlier ones.

## 04 — pick the model

`pnpm model-selection`

`ModelSelectionProcessor` reads the same answers and swaps the agent's model before it writes. Poor fit or intent under 1 gets `openai/gpt-5-nano`. Strong fit and an ICP chance of 0.8 or more keeps `openai/gpt-5-mini`. Returning nothing keeps the agent's model, which is the safe move: a wrong downgrade writes the reply on the weaker model. The demo runs four leads: Priya keeps the strong model, a landscaping owner drops because the title is not a buyer, a VP who is just looking drops because intent is under 1, and a senior engineer comparing platforms leaves the model alone.

## 05 — gate the send

`pnpm approval`

`sendPricing` has a `requireApproval` function. It asks one boolean question, "does this quote need a person before it is sent", and returns true at 0.7 or higher. A 20-seat list-price quote goes out. A 200-seat quote suspends, and the script resumes it with `approveToolCallGenerate`.

## 06 — score the draft

`pnpm scorer`

Three scorers over six replies to the same lead. Each scorer asks one question and turns the answer into 0–1. The sentence under the number is the criterion that was chosen, so the score says what was wrong.

High is good, except for the last one.

| scorer | 1 means | 0 means |
| --- | --- | --- |
| `grounded` | every figure matches the account tool ($49, 200 seats) | the draft invented a price, a discount, or a seat count |
| `next-step` | it asks for a meeting (a reply is 0.4) | it ends on the quote |
| `concedes` | it gives ground on price. This is a failure | it holds the list price |

Each reply breaks one rule, so a column moves on one row and stays put on the rest. `holds-price` should be high, high, low. `wrong-price` should fail grounded and still ask for the meeting. `opens-negotiation` invents no number, but concedes anyway.

`pnpm seed` loads those six replies into a dataset named Draft grades. Each item is `{ output: { text } }`, which is what `scorer.run()` receives. An agent experiment would try to read it as a chat message and fail, so pick the scorers, not the sales agent. The script writes `src/mastra/public/mastra.db`, the file Studio opens, so the dataset shows up at `/datasets`. Run an experiment and pick grounded, next-step, and concedes. Re-running the script replaces the items. Restart `pnpm dev` after seeding if Studio was already open.

## What not to do

**Don't ask it to write.** The agent writes. The classifier answers whether the draft needs a person.

**Don't hide the decision in one question.** `fit`, `intent`, and `icp` are separate so the code can compose them. One "what should we do" question cannot be branched on.

**Don't treat the top answer as confident.** A choice of `strong` at 0.4 with the rest split is not a strong lead. Read the distribution. For a boolean, `probability` is the whole signal. There is no second confidence number.

**Don't score what code already knows.** Employee count and industry are in the fixture. The classifier sees the message, the title, and the company, which is the part you cannot write a rule for.

**Don't reuse questions on the wrong state.** Lead questions score leads. Draft questions score drafts. Example 02 uses a second classifier for the draft.

**Don't let the classifier act.** `onResult` can filter or abort. The workflow branch steps do the work.

**Don't write a question that needs a paragraph of policy.** If the criteria need a policy document, the question is two questions.

**Don't use it as an agent.** It does not choose a next step, call a tool, or continue a conversation. One call, every question on the same state, outcome space known ahead of time.

## Questions that return no signal

A call can type-check, return numbers, and still say nothing. The test: change one field of the fixture and one answer should move.

- **No outcome space.** "What should sales do next" when the lead has no message cannot be answered from the state. The model returns a peaked guess.
- **Nothing to judge.** `{ company: 'Northwind Analytics' }` cannot support "is this a good lead". The instructions have to name a field.
- **Overlapping criteria.** `strong: "a good fit"` and `partial: "maybe a fit"` leak probability between them. Each criterion should exclude the others.
- **A score with no rungs.** Two levels make a score of 1.4 meaningless. `intent` has four.
- **Two judgments in one question.** "Is this a qualified lead" moves when either fit or intent changes, so you cannot tell which.
- **A boolean read as a bit.** `probability >= 0.5` throws away the only signal the answer has. 0.51 and 0.97 take the same branch. The threshold belongs in the caller, set by the cost of being wrong.
- **A choice with no way out.** Three teams and no `other` forces every lead into a team. Add `other` when the list is not closed.
- **The state was pasted into the instructions.** Then you cannot change one field and watch one number move, because the field is not in the state.

## Notes

- Configured questions and per-call questions are mutually exclusive. A workflow step, a processor, and a scorer all require configured questions.
- State has to be JSON. Do not put the agent, the request context, or a message list on it.
- The agent model is a language model id. The classifier model is an evaluation model. They are not interchangeable.
