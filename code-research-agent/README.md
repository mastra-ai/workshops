# Example 4: Code Research Agent

A coding agent that explores codebases using file viewing and command execution.

## Why This Demo

Code research generates **heavy tool output**: directory listings, file contents with line numbers, grep results, git logs. Each tool call returns hundreds or thousands of tokens of structured text.

Without OM, this fills the context window fast. With OM, the agent remembers what it learned without carrying all the raw output forward.

## What You'll See

- Agent reads files, runs commands, explores directories
- Tool output is verbose (file contents, command output)
- Observer compresses "read file X, it contains Y" into dense observations
- Agent retains the *understanding* without the raw text

## Setup

```bash
pnpm install
cp .env.example .env
# Add your OpenAI API key to .env
```

## Running

```bash
pnpm dev
```

Opens Mastra Studio. Try asking the agent to:

- "Explore the src/ directory and explain the architecture"
- "Find all the places where Memory is configured"
- "What does the execute-command tool do? Read it and explain"
- "Search for all TODO comments in the codebase"

Watch the Observer fire as tool output accumulates, and see how the observations capture the agent's *findings* rather than the raw file contents.

## Token Threshold

The `messageTokens` threshold is set to 5k for demo purposes (normally 30k). This means the Observer triggers faster so you can see compression happen during the workshop.

## Tools

This example uses the same tools from the [Reese](https://github.com/TylerBarnes/reese4) coding agent:

- **view**: Read file contents with line numbers, or list directories (2 levels deep)
- **execute_command**: Run shell commands with timeout, process cleanup, and output truncation
