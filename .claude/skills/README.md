# Claude Code Skills

Skills are instructions that Claude automatically applies when relevant to your request. You don't invoke them with slash commands - just describe what you want naturally.

## Available Skills

### Custom Connector Skills (Raw Provider Data)

These skills are for building connectors that return raw provider data without schema mapping.

#### Falcon Connector Build
**Triggers**: "build connector", "create falcon config", "new connector"

Complete 11-step workflow for building production-ready Falcon API connector configurations with autonomous research, version validation, and comprehensive testing.

#### Falcon Connector Testing
**Triggers**: "test connector", "run tests", "validate actions"

Comprehensive testing workflow including action tracking, multi-auth testing, and 100% coverage verification.

#### Falcon Authentication Setup
**Triggers**: "set up authentication", "configure auth", "add OAuth"

Configure authentication for Falcon connectors (custom and oauth2 types).

#### Falcon Technical Reference
**Triggers**: "YAML syntax", "step functions", "expression formats", "JSONPath vs JEXL"

Technical reference for YAML structure, step functions, and expression formats.

---

### Unified Connector Skills (Schema-Mapped Data)

These skills are for building connectors that map provider data to customer-defined schemas with unified pagination.

#### Unified Connector Build
**Triggers**: "unified connector", "standardized connector", "schema mapping", "customer connector"

Complete workflow for building connectors that transform provider data to standardized output schemas. Includes:
- Schema-first development approach
- Endpoint selection with trade-off analysis
- Scope decision framework
- Field mapping configuration
- Unified pagination setup

#### Unified Field Mapping
**Triggers**: "field mapping", "fieldConfigs", "enumMapper", "map fields"

Detailed guide for mapping provider fields to unified schemas:
- `fieldConfigs` structure and usage
- Enum mapping with `enumMapper`
- Nested objects and arrays
- JEXL transformations
- Common mapping mistakes and fixes

#### Unified Scope Decisions
**Triggers**: "scope", "permissions", "endpoint selection", "trade-off", "deprecated endpoint"

Decision framework for selecting endpoints and scopes:
- Narrow scope preference principles
- Endpoint evaluation criteria
- Deprecated endpoint handling
- Performance vs security trade-offs
- `scopeDefinitions` syntax (not `scope_definitions`)

#### Unified Connector Testing
**Triggers**: "test unified", "validate mapping", "debug fields", "test pagination"

Testing and validation specific to unified connectors:
- Raw response validation
- Field mapping verification
- Pagination testing
- Schema completeness checks
- Debugging techniques for mapping issues

---

### Other Skills

#### test-mcp-connector

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

## Quick Reference: Which Skill to Use

| Goal | Skill |
|------|-------|
| Build connector returning raw provider data | Falcon Connector Build |
| Build connector with schema mapping | Unified Connector Build |
| Configure authentication | Falcon Authentication Setup |
| Understand YAML syntax | Falcon Technical Reference |
| Map fields to unified schema | Unified Field Mapping |
| Decide which scopes/endpoints to use | Unified Scope Decisions |
| Test custom connector | Falcon Connector Testing |
| Test unified connector | Unified Connector Testing |
| Test with AI agent | test-mcp-connector |
