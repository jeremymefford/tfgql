# Agents

This file defines the Codex CLI agents available for the **tfce-graphql** repository.  Agents encapsulate common tasks for this codebase that can be invoked via `codex run agent <AgentName> --description "<task>"`.

## Available Agents

| Agent Name                | Purpose                                                                                                                     |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| **GraphQLEntityAgent**    | Automates creating or updating GraphQL entities (schema, types, resolvers, data sources, mappers) following the Contributing guide. |
| **DocumentationAgent**    | Adds or updates Markdown documentation under `docs/docs` (guides, use cases, Contributing instructions).                     |
| **ImplementationStatusAgent** | Updates the Implementation Status table in `README.md` to reflect current coverage of queries and mutations.                |
| **UseCasesAgent**         | Manages the Top Use Cases docs under `docs/docs/Use Cases`, adding new scenarios or example queries.                         |

## Invoking Agents

Run an agent with the Codex CLI:

```bash
codex run agent <AgentName> --description "<detailed task description>"
```

For example:

```bash
codex run agent GraphQLEntityAgent --description "Add support for the new Policy Check Overrides endpoint"
```

## Defining New Agents

To add a new agent:

1. Append a new row to the **Available Agents** table above.
2. Implement the agent logic in the appropriate scripts or modules (e.g. under `scripts/agents/`).
3. Ensure the agent invocation pattern aligns with the Codex CLI documentation.

## Agent Guidelines

- Agents should follow the project coding guidelines in the root `README.md` and `docs/docs/Contributing`.
- Always use `rg` (ripgrep) instead of `grep` or `ls -R` when searching code, to respect `.gitignore` and for performance.
- Verify changes pass pre-commit checks (e.g. `pre-commit run --files`) before finalizing.