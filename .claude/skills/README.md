# Claude Code Skills

This directory contains skills - documented workflows that Claude follows when performing specific tasks. Some skills are invoked automatically based on context, while others require explicit triggers.

## Slash Commands

These are explicit commands you can invoke:

### /on-boarding
**Usage**: `/on-boarding`

The structured onboarding flow for building connectors. Walks you through:
1. **Connector type selection** - Choose between Agentic Actions, Schema-Based, or Skip Walkthrough
2. **Provider setup** - Specify provider name and version
3. **Workflow guidance** - Step-by-step instructions for your chosen path

Use this when starting a new connector or when you're unsure which approach to take.

### /test-mcp-connector
**Usage**: `/test-mcp-connector <provider>`

Tests MCP connectors by building a real agent that sends natural language prompts. See skill file for setup requirements.

---

## Explicit Trigger Phrases

These skills require specific phrases to trigger (not automatic):

### Unified Connector Build
**Trigger phrase**: `start unified build for [provider]`

**Example**: `start unified build for BambooHR`

Complete workflow for building connectors that transform provider data to standardized output schemas. Includes schema-first development, endpoint selection with trade-off analysis, field mapping configuration, and unified pagination setup.

**DO NOT trigger for vague queries** - use `/on-boarding` first if unsure.

---

## Auto-Triggered Skills

These skills are automatically applied when relevant to your request:

### Custom Connector Skills (Raw Provider Data)

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

### Unified Connector Support Skills

These skills support the unified connector workflow but don't trigger the full build process:

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

## Quick Reference: Which Approach to Use

| Scenario | What to Use |
|----------|-------------|
| First time building a connector | `/on-boarding` |
| Unsure which connector type to build | `/on-boarding` |
| Building schema-based connector (know what you want) | `start unified build for [provider]` |
| Building agentic connector (know what you want) | Just describe what you want to build |
| Need help with field mapping | Describe your mapping issue |
| Need help with auth setup | "help me set up authentication" |
| Test a connector with AI agent | `/test-mcp-connector <provider>` |

## How Skills Work

Skills are **model-invoked** based on your request. For auto-triggered skills, Claude reads the definitions and decides when they're relevant. For explicit triggers, you must use the exact phrase or command.

**Key principle**: Use `/on-boarding` when you're starting fresh or uncertain. Use explicit triggers like `start unified build for [provider]` when you know exactly what you want.
