# Claude Code Skills

Skills are instructions that Claude automatically applies when relevant to your request. You don't invoke them with slash commands - just describe what you want naturally.

## Available Skills

### test-mcp-connector

Tests MCP connectors by building a real agent that sends natural language prompts.

**Triggers when:**
- User provides **Account ID + StackOne API Key + connector name**
- User mentions "MCP" and "test" together
- User asks to test "real cases" or "real prompts"
- User wants to verify actions work "like an agent would"

**Also available as:** `/test-mcp-connector <provider>`

**What it does:**
1. **Phase 1** (optional): Quick `stackone run` check for basic connectivity
2. **Phase 2** (main): Builds a real agent using Claude Agent SDK with Haiku (native MCP support), sends natural language prompts, evaluates if the agent discovers and uses actions correctly
3. **Fix loop**: Fixes connector YAML, pushes, retests until 100% pass

**Key principle:** Tests via agent conversations, not direct tool calls. The goal is validating that action descriptions are good enough for an agent to understand.

**Setup it will ask for:**
- StackOne account ID
- StackOne API key (`credentials:read` scope)
- Anthropic API key (for the test agent)
- CLI profile for pushing

## How Skills Work

Unlike slash commands (`/commit`, `/help`), skills are **model-invoked**. Claude reads the skill definitions and decides when they're relevant based on your request. You just describe your goal in plain language.
