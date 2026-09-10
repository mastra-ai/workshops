# Further reading

## MCP and deployment

- [MCP architecture](https://modelcontextprotocol.io/docs/2026-07-28/learn/architecture): hosts, clients and servers.
- [Server concepts](https://modelcontextprotocol.io/docs/2026-07-28/learn/server-concepts): tools, resources and prompts.
- [2026-07-28 changelog](https://modelcontextprotocol.io/specification/2026-07-28/changelog): stateless requests, discovery, subscriptions, elicitation and authorization changes.
- [Sessionless MCP](https://modelcontextprotocol.io/seps/2567-sessionless-mcp): explicit application state instead of protocol sessions.
- [Authorization security](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization/security-considerations): authentication does not replace application authorization.

Mastra v2 makes modern protocol behavior the default; native support was previously opt-in. Stateless transport does not remove business storage or retry-safety requirements.

## Designing capabilities

- [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents): clear contracts, useful results and evaluation.
- [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp): progressive discovery and processing intermediate results in code.
- [Client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices): tool catalogues and caching.

Choose tool boundaries to fit the work: schema exploration may suit an open-ended read tool; a return operation may suit a deterministic workflow. Progressive discovery and code mode are alternative composition patterns, not requirements of this five-tool example.

## Hosts and authentication

- [ChatGPT developer mode and MCP apps](https://help.openai.com/en/articles/12584461-developer-mode-and-mcp-apps-in-chatgpt-beta).
- [WorkOS AuthKit MCP integration](https://workos.com/docs/authkit/mcp).
- [Agentic AI Foundation announcement](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation).

The growth chart in the slides is attributed to Max Stoiber's post and measures MCP calls through OpenAI's gateway, not global MCP adoption. Host features, permissions and account requirements can change; test in the account used for the demonstration.
