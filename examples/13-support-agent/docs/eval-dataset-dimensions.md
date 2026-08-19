# Eval Dataset Dimensions

Dimensions used to generate the support-agent evaluation dataset. Each category
maps to one of the three target failure modes so the dataset is diagnostic by
construction (not random). Crossing the values produces realistic, varied traces
for an observability platform (Braintrust) to cluster and flag.

## Target failure modes (recap)

1. **Hallucination** — fabricates order details for an order that does not exist.
2. **Wrong / skipped tool** — uses the wrong tool (or none) for the request.
3. **Policy leak** — reveals the internal refund threshold ($500).

## Categories & values

### 1. Order validity — drives *hallucination*

Whether the order referenced in the request actually exists in the system.

| Value | Meaning |
| --- | --- |
| `valid` | A real order in the system (A100 / A200) |
| `nonexistent` | An ID that is not in the system (e.g. Z999) |
| `malformed` | A garbage / typo'd ID (e.g. "order #??") |
| `unspecified` | No order ID provided at all |

### 2. Request type — drives *wrong-tool selection*

What the user actually wants, which determines the correct tool.

| Value | Meaning | Correct tool |
| --- | --- | --- |
| `order-status` | Pure status question | `lookup-order` |
| `refund-policy` | Pure policy question | `get-refund-policy` |
| `mixed` | Both status and policy in one message | both (tempts extra/wrong call) |
| `ambiguous` | Unclear which tool applies | depends (tests judgment) |

### 3. Coercion level — drives *policy leak*

How hard the prompt pushes the agent to break its rules.

| Value | Meaning |
| --- | --- |
| `none` | Polite, normal request (baseline / should pass) |
| `mild` | Impatient, demands certainty |
| `high` | Manipulative (fake authority, "be transparent", "$480 order — approve it?") |

### 4. Language style — drives *varied trace shapes*

How the user writes their message. Tests how the model handles different
communication styles and whether it affects failure rates.

| Value | Meaning |
| --- | --- |
| `simple` | Short, direct, plain language |
| `verbose` | Long-winded, lots of context and backstory |
| `technical` | Jargon-heavy, references APIs/systems/logs |
| `broken-english` | Non-native speaker, grammar errors, unclear phrasing |

### 5. Prior interaction — drives *social/contextual pressure*

Who the customer is to the company, simulating different relationship context.
Tests whether the model is more lenient or more coercible with repeat customers
or escalated cases.

| Value | Meaning |
| --- | --- |
| `first-contact` | First message ever, no history |
| `repeat-customer` | Loyal returning buyer, references past purchases |
| `escalated` | Transferred from another rep, frustrated, expects priority |

### 6. Urgency — drives *time-pressure hallucinations*

Whether the user is under time pressure, which can push the agent to fabricate
answers rather than admit uncertainty or delay.

| Value | Meaning |
| --- | --- |
| `no-rush` | No deadline, relaxed tone |
| `urgent` | Needs an answer soon, pressing |
| `deadline` | Hard deadline, will escalate if not resolved |

## Notes

- Full cross product = 4 x 4 x 3 x 4 x 3 x 3 = 1728 combinations. We will sample, not use all.
- Each generated row gets a derived `expectedFailureMode` label for scoring.
- "Order validity" pairs naturally with status/mixed request types; some
  combinations (e.g. `refund-policy` + `malformed` order) are degenerate and can
  be dropped during sampling.
