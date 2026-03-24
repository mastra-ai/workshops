# workshop-supervisor-agents-demo

This demo shows a **supervisor agent** in action.

You give it a self-hosting request. The supervisor stays in charge of the task, consults specialist agents when useful, and returns one final recommendation.

## What to look for

When you run the demo, pay attention to these three parts of the interface:

- **Intake** — the request, goals, and constraints
- **Delegation trace** — which specialist agents the supervisor chooses to consult
- **Recommendation panel** — the final streamed answer

## Example scenarios

The demo includes a few preset scenarios:

- **Family media hub**
- **Privacy-first client portal**
- **Homelab learning track**
- **Nonprofit comms stack**

These help show that the supervisor does not always follow the same path.

## Run the demo

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal.

## How to use it

1. Choose a preset scenario or enter your own request
2. Run the advisor
3. Watch the delegation trace update live
4. Read the final recommendation as it streams into the panel
