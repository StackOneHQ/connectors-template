# Connector Builder Plugins Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rename `stackone-connector-builder` → `stackone-unified-builder` (invoke: `/build-unified-connector`) and create a new `stackone-connector-builder` plugin for generic Falcon connector builds (invoke: `/build-connector`).

**Architecture:** Both plugins live under `.claude/plugins/` in connectors-template. The rename is a directory move + content updates. The new generic plugin mirrors the unified structure but replaces schema/field-mapping steps with action discovery and raw config building, uses StackOne MCP tools throughout, and includes test cleanup behaviour.

**Tech Stack:** Claude Code plugin system (SKILL.md format), StackOne MCP tools (`mcp__stackone-agent-global__*`), StackOne CLI (`npx @stackone/cli`), YAML connector configs, JSON session file for state.

---

### Task 1: Rename plugin directory and update plugin.json

**Files:**
- Rename: `.claude/plugins/stackone-connector-builder/` → `.claude/plugins/stackone-unified-builder/`
- Modify: `.claude/plugins/stackone-unified-builder/.claude-plugin/plugin.json`

**Step 1: Rename the directory**

```bash
mv /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-connector-builder \
   /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder
```

**Step 2: Update plugin.json**

Write this content to `.claude/plugins/stackone-unified-builder/.claude-plugin/plugin.json`:

```json
{
  "name": "stackone-unified-builder",
  "version": "1.0.0",
  "description": "Interactive step-by-step wizard for building unified Falcon connectors. Walks external builders through schema selection, connector scaffolding, action scoping, field mapping, validation, and testing.",
  "author": {
    "name": "StackOne",
    "email": "engineering@stackone.com"
  },
  "license": "MIT",
  "keywords": ["connector", "falcon", "unified", "schema", "stackone", "builder"]
}
```

**Step 3: Verify**
```bash
ls /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder/
cat /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder/.claude-plugin/plugin.json
```
Expected: directory exists, JSON has `"name": "stackone-unified-builder"`.

---

### Task 2: Update unified builder orchestrator skill

**Files:**
- Modify: `.claude/plugins/stackone-unified-builder/skills/stackone-connector-builder/SKILL.md`
- Rename folder: `skills/stackone-connector-builder/` → `skills/stackone-unified-builder/`

**Step 1: Rename the skill folder**

```bash
mv /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder/skills/stackone-connector-builder \
   /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder/skills/stackone-unified-builder
```

**Step 2: Write updated SKILL.md**

Write this content to `.claude/plugins/stackone-unified-builder/skills/stackone-unified-builder/SKILL.md`:

```markdown
---
name: stackone-unified-builder
description: Interactive wizard for building a unified Falcon connector from scratch. Guides external builders through schema selection, connector setup, action scoping, field mapping, validation, and testing. Auto-triggers when someone asks to build a new unified connector, map provider data to a schema, or integrate with a new provider using StackOne's unified API.
invoke: build-unified-connector
---

# Build Unified Connector

End-to-end wizard for building a unified StackOne Falcon connector.

## Quick Reference

Run steps in order, or invoke any sub-skill directly to jump to that phase:

| Step | Command | What it does |
|------|---------|-------------|
| 1 | `/choose-schema` | Pick your schema: built-in (A), import from file (B), or define inline (C) |
| — | `/import-schema` | Import schema fields from a CSV, JSON, YAML, or any schema document |
| 2 | `/check-connector` | Check if connector exists, pull or scaffold |
| 3 | `/scope-actions` | Decide which resources and operations to expose |
| 4 | `/map-fields` | Map provider API fields to your schema |
| 5 | `/validate-connector` | Validate the YAML configuration |
| 6 | `/test-connector` | Test live against the provider API |

Each step saves progress to `.connector-build-session.json` — you can pause and resume at any time.

`/import-schema` can be run standalone at any point to load schema fields from a document. It feeds directly into `/map-fields`.

---

## Starting the Wizard

Check for an existing `.connector-build-session.json`. If found:
> "Found an existing session:
> - **Provider:** `{{provider}}`
> - **Schema:** `{{schema}}`
> - **Last step completed:** `{{session_step}}`
>
> Would you like to:
> - **Resume** from `{{session_step}}`
> - **Restart** from the beginning (clears session)"

If no session exists, greet the builder and proceed to Step 1:
> "Welcome to the StackOne unified connector builder. I'll guide you through building a connector that maps provider data to a standardised schema step by step."

---

## Step 1 — Choose Schema

Execute the full `/choose-schema` skill logic.

**Outcome saved to session:**
- `provider` — the provider name (e.g., `bamboohr`)
- `schema` — the target category or `custom`
- `schema_source` — `builtin`, `imported`, or `custom`
- `resources` — list of resources to build
- `schema_fields` — field definitions (for custom/imported schemas)
- `schema_file` — path to per-category schema reference (for builtin)

---

## Step 2 — Check Connector

Execute the full `/check-connector` skill logic.

**Outcome saved to session:**
- `cli_available` — whether the StackOne CLI is usable
- `connector_exists` — whether a base config was pulled from the index
- `connector_path` — where the config lives
- `auth_type` — the authentication method

---

## Step 3 — Scope Actions

Execute the full `/scope-actions` skill logic.

**Outcome saved to session:**
- `action_scope` — `{ resource: [actions] }` map
- `use_case` — builder's description of their goal
- `known_limitations` — any flagged gaps

---

## Step 4 — Map Fields

Execute the full `/map-fields` skill logic.

**Outcome:** Partial YAML files written to `src/configs/{{provider}}/`

---

## Step 5 — Validate

Execute the full `/validate-connector` skill logic.

**Outcome saved to session:**
- `validated: true`

---

## Step 6 — Test

Execute the full `/test-connector` skill logic.

**Outcome saved to session:**
- `tested: true`
- `completed_at`

---

## Session File Schema

`.connector-build-session.json` lives at the project root and carries all state between steps:

```json
{
  "provider": "bamboohr",
  "schema": "hris",
  "schema_source": "builtin",
  "schema_file": "references/schemas/hris.md",
  "schema_fields": [],
  "resources": ["employees", "time_off"],
  "cli_available": true,
  "connector_exists": false,
  "connector_path": "src/configs/bamboohr",
  "auth_type": "api_key",
  "action_scope": {
    "employees": ["list", "get"],
    "time_off": ["list", "get", "create"]
  },
  "use_case": "Sync HR data into customer's internal system",
  "known_limitations": [],
  "validated": false,
  "tested": false,
  "session_step": "map-fields",
  "completed_at": null
}
```

---

## Rules

- Do not write YAML files until Step 4 (`map-fields`)
- Do not run live tests until Step 5 (`validate-connector`) has passed
- Do not delete the session file unless the builder explicitly requests a reset
- Always read session context at the start of each step — never ask for information already in the session
```

**Step 3: Verify**
```bash
head -5 /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder/skills/stackone-unified-builder/SKILL.md
```
Expected: frontmatter shows `name: stackone-unified-builder` and `invoke: build-unified-connector`.

---

### Task 3: Add MCP tool references to unified builder sub-skills

**Files:**
- Modify: `.claude/plugins/stackone-unified-builder/skills/check-connector/SKILL.md`
- Modify: `.claude/plugins/stackone-unified-builder/skills/map-fields/SKILL.md`
- Modify: `.claude/plugins/stackone-unified-builder/skills/test-connector/SKILL.md`

**Step 1: Update check-connector — add S3 index check before CLI**

In `check-connector/SKILL.md`, after the "Session File" section and before "Step 1: Detect CLI availability", insert:

```markdown
## Step 0: Check StackOne provider index

Before checking the CLI, look up the provider in StackOne's index:

```
map_provider_key("{{provider}}")
```

If a provider key is returned, run:

```
get_provider_actions("{{provider_key}}")
```

If indexed actions exist, tell the builder:
> "Found `{{provider}}` in the StackOne index with {{N}} known actions. I'll use this as a reference when building your connector."

Save the provider key to session as `provider_key`. Continue to CLI check below.
```

**Step 2: Update map-fields — add vector_search for field coverage**

In `map-fields/SKILL.md`, after the "Session File" section, insert:

```markdown
## Step 0: Check StackOne action coverage

Before mapping fields, check whether StackOne has coverage data for this provider:

```
get_provider_coverage("{{provider_key}}")
```

If coverage data exists, use it to pre-populate likely field paths and flag any known gaps.

Also run a vector search to find similar connectors as reference:

```
vector_search("{{schema}} {{provider}} field mapping")
```

Use any matching results to inform the fieldConfigs you build.
```

**Step 3: Update test-connector — add test_actions and scramble_credentials**

In `test-connector/SKILL.md`, replace the section "If CLI is available:" for running tests with:

```markdown
**If CLI is available and MCP tools are accessible:**

Use `test_actions` for automated testing:
```
test_actions({
  provider: "{{provider}}",
  actions: ["unified_list_{{resource}}", "unified_get_{{resource}}"]
})
```

Poll with `get_test_actions_task_status(taskId)` until complete.

**If running manually via CLI:**
```bash
npx @stackone/cli test {{provider}} unified_{{action}}_{{resource}}
```

**After all tests pass, always run:**
```
scramble_credentials("{{provider}}")
```
```

**Step 4: Verify all three files were updated**
```bash
grep -l "map_provider_key\|vector_search\|test_actions\|scramble_credentials" \
  /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder/skills/*/SKILL.md
```
Expected: 3 files listed.

---

### Task 4: Scaffold new stackone-connector-builder plugin

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/.claude-plugin/plugin.json`
- Create all skill directories

**Step 1: Create directories**

```bash
BASE="/Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-connector-builder"
mkdir -p "$BASE/.claude-plugin"
mkdir -p "$BASE/skills/stackone-connector-builder"
mkdir -p "$BASE/skills/setup-connector"
mkdir -p "$BASE/skills/configure-auth"
mkdir -p "$BASE/skills/discover-actions"
mkdir -p "$BASE/skills/build-config"
mkdir -p "$BASE/skills/validate-connector"
mkdir -p "$BASE/skills/test-connector"
mkdir -p "$BASE/references"
```

**Step 2: Write plugin.json**

```json
{
  "name": "stackone-connector-builder",
  "version": "1.0.0",
  "description": "Interactive wizard for building generic Falcon connectors. Guides builders through provider setup, authentication, action discovery (scoped or maximal), config generation, validation, and testing with full cleanup.",
  "author": {
    "name": "StackOne",
    "email": "engineering@stackone.com"
  },
  "license": "MIT",
  "keywords": ["connector", "falcon", "generic", "stackone", "builder", "discovery"]
}
```

**Step 3: Copy shared references from unified builder**

```bash
BASE="/Users/cameroncarlin/Projects/connectors-template/.claude/plugins"
cp "$BASE/stackone-unified-builder/references/connector-patterns.md" \
   "$BASE/stackone-connector-builder/references/"
cp "$BASE/stackone-unified-builder/references/cli-commands.md" \
   "$BASE/stackone-connector-builder/references/"
```

**Step 4: Verify**
```bash
ls /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-connector-builder/
```
Expected: `.claude-plugin/`, `skills/`, `references/` present.

---

### Task 5: Write auth-patterns.md reference

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/references/auth-patterns.md`

**Step 1: Write the file**

```markdown
# Authentication Patterns Reference

Detailed YAML patterns for every authentication type supported by the Falcon framework.
Used by the `configure-auth` sub-skill.

## Supported Auth Types

| Type | When to use |
|------|-------------|
| `custom` (API Key / Bearer) | Static token or key passed in header or query param |
| `custom` (Basic Auth) | Username + password base64-encoded in Authorization header |
| `oauth2` | User-facing OAuth 2.0 authorization code flow |
| `custom` (Client Credentials) | Machine-to-machine OAuth 2.0 with client_id + client_secret |
| `custom` (Custom Headers) | Any combination of static headers |

> **Note:** Falcon only supports `type: custom` and `type: oauth2`. All non-OAuth flows use `type: custom` with appropriate args and headers.

---

## API Key / Bearer Token

```yaml
authentication:
  type: custom
  args:
    api_key:
      value: "${PROVIDER_API_KEY}"
  headers:
    Authorization: "Bearer ${args.api_key.value}"
baseUrl: "https://api.provider.com/v1"
```

**`.env` variable:** `PROVIDER_API_KEY=your_key_here`

---

## API Key in Query Parameter

```yaml
authentication:
  type: custom
  args:
    api_key:
      value: "${PROVIDER_API_KEY}"
baseUrl: "https://api.provider.com/v1"
# Pass as query param in each action's entrypointUrl:
# entrypointUrl: "/employees?api_key=${args.api_key.value}"
```

---

## Basic Auth (Username + Password)

```yaml
authentication:
  type: custom
  args:
    username:
      value: "${PROVIDER_USERNAME}"
    password:
      value: "${PROVIDER_PASSWORD}"
  headers:
    Authorization: "Basic ${base64(args.username.value + ':' + args.password.value)}"
baseUrl: "https://api.provider.com/v1"
```

**`.env` variables:** `PROVIDER_USERNAME=user`, `PROVIDER_PASSWORD=pass`

---

## OAuth 2.0 (Authorization Code Flow)

```yaml
authentication:
  type: oauth2
  clientId: "${PROVIDER_CLIENT_ID}"
  clientSecret: "${PROVIDER_CLIENT_SECRET}"
  tokenUrl: "https://auth.provider.com/oauth/token"
  authorizationUrl: "https://auth.provider.com/oauth/authorize"
  scopes:
    - read:employees
    - read:departments
baseUrl: "https://api.provider.com/v1"
```

**`.env` variables:** `PROVIDER_CLIENT_ID=id`, `PROVIDER_CLIENT_SECRET=secret`

---

## Client Credentials (Machine-to-Machine OAuth)

```yaml
authentication:
  type: custom
  args:
    access_token:
      value: "${PROVIDER_ACCESS_TOKEN}"
  headers:
    Authorization: "Bearer ${args.access_token.value}"
baseUrl: "https://api.provider.com/v1"
```

Obtain `access_token` via a separate token exchange step outside the connector.

**`.env` variable:** `PROVIDER_ACCESS_TOKEN=token`

---

## Multiple Headers

```yaml
authentication:
  type: custom
  args:
    api_key:
      value: "${PROVIDER_API_KEY}"
    account_id:
      value: "${PROVIDER_ACCOUNT_ID}"
  headers:
    X-API-Key: "${args.api_key.value}"
    X-Account-Id: "${args.account_id.value}"
    Content-Type: "application/json"
baseUrl: "https://api.provider.com/v1"
```

---

## Credential Variable Naming Convention

Variables in `.env` follow: `<PROVIDER_NAME_UPPERCASE>_<CREDENTIAL_TYPE>`

| Provider | Credential | Variable name |
|----------|-----------|--------------|
| BambooHR | API Key | `BAMBOOHR_API_KEY` |
| Workday | Client ID | `WORKDAY_CLIENT_ID` |
| Salesforce | Access Token | `SALESFORCE_ACCESS_TOKEN` |
| HiBob | Username | `HIBOB_USERNAME` |

---

## Common Auth Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Wrong credentials or expired token | Check `.env` values, re-authenticate |
| `403 Forbidden` | Valid credentials, insufficient permissions | Add required scopes or API permissions |
| `${args.api_key.value}` appears literally in request | Interpolation not working | Ensure `args` block nests under `authentication` |
| `base64 is not defined` | Basic auth YAML error | Use the literal string format shown above |
```

**Step 2: Verify**
```bash
wc -l /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-connector-builder/references/auth-patterns.md
```
Expected: 100+ lines.

---

### Task 6: Write orchestrator SKILL.md

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/skills/stackone-connector-builder/SKILL.md`

**Step 1: Write the file**

```markdown
---
name: stackone-connector-builder
description: Interactive wizard for building a generic Falcon connector. Guides builders through provider setup, authentication, action discovery (scoped or maximal), YAML config generation, validation, and live testing with cleanup. Auto-triggers when someone asks to build a new connector, add a new provider, or create a Falcon config.
invoke: build-connector
---

# Build Connector

End-to-end wizard for building a generic StackOne Falcon connector.
Use this when you want to expose a provider's raw API responses — no schema mapping required.
For connectors that normalise data to a standard schema, use `/build-unified-connector` instead.

## Quick Reference

| Step | Command | What it does |
|------|---------|-------------|
| 1 | `/setup-connector` | Provider name, index check, CLI pull or scaffold |
| 2 | `/configure-auth` | Set up authentication (API key, OAuth2, Basic Auth) |
| 3 | `/discover-actions` | Choose scoped actions or discover everything |
| 4 | `/build-config` | Generate YAML for all confirmed actions |
| 5 | `/validate-connector` | Validate the YAML config |
| 6 | `/test-connector` | Live test + clean up all test records |

Progress is saved to `.connector-build-session.json` — pause and resume any time.

---

## Starting the Wizard

Check for an existing `.connector-build-session.json`. If found:
> "Found an existing session:
> - **Provider:** `{{provider}}`
> - **Last step:** `{{session_step}}`
>
> Resume or restart?"

If no session, greet:
> "Welcome to the StackOne connector builder. I'll help you build a Falcon connector that exposes `{{provider}}`'s API through StackOne.
>
> If you want to map the data to a standard schema (HRIS, ATS, CRM, etc.), use `/build-unified-connector` instead."

---

## Steps

### Step 1 — Setup
Execute `/setup-connector` logic. Saves: `provider`, `provider_key`, `cli_available`, `connector_exists`, `connector_path`.

### Step 2 — Configure Auth
Execute `/configure-auth` logic. Saves: `auth_type`. Writes auth block to connector YAML.

### Step 3 — Discover Actions
Execute `/discover-actions` logic. Saves: `discovery_mode`, `action_scope`, `use_case`.

### Step 4 — Build Config
Execute `/build-config` logic. Writes action YAML to `src/configs/{{provider}}/`.

### Step 5 — Validate
Execute `/validate-connector` logic. Saves: `validated: true`.

### Step 6 — Test
Execute `/test-connector` logic. Saves: `tested: true`, `test_artifacts`, `completed_at`.

---

## Session File Schema

```json
{
  "provider": "workday",
  "provider_key": "workday",
  "connector_path": "src/configs/workday",
  "cli_available": true,
  "connector_exists": false,
  "auth_type": "oauth2",
  "discovery_mode": "scoped",
  "action_scope": {
    "employees": ["list", "get", "create"],
    "departments": ["list", "get"]
  },
  "use_case": "Read employee and department data",
  "known_limitations": [],
  "test_artifacts": [
    { "resource": "employees", "id": "EMP_test_001", "cleaned_up": true },
    { "resource": "departments", "id": "DEP_test_007", "cleaned_up": false, "reason": "no delete endpoint" }
  ],
  "validated": false,
  "tested": false,
  "session_step": "build-config",
  "completed_at": null
}
```

---

## Rules

- Do not write YAML until Step 4 (`build-config`)
- Do not run tests until Step 5 (`validate-connector`) passes
- Always clean up test records — log anything that cannot be removed
- Always run `scramble_credentials` after testing
- Never ask for information already in the session
```

---

### Task 7: Write setup-connector SKILL.md

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/skills/setup-connector/SKILL.md`

**Step 1: Write the file**

```markdown
---
name: setup-connector
description: Step 1 of building a generic Falcon connector. Checks StackOne's provider index, detects CLI availability, and either pulls an existing connector base config or scaffolds a new one.
invoke: setup-connector
---

# Setup Connector

Step 1 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. If `provider` is already set:
> "Resuming — provider already set to `{{provider}}`. Run `/configure-auth` to continue."

---

## Step 1: Ask for provider name

Ask:
> "What provider are you building a connector for? (e.g., `workday`, `bamboohr`, `rippling`)"

Save as `provider` (lowercase, hyphenated).

---

## Step 2: Check StackOne provider index

```
map_provider_key("{{provider}}")
```

If a key is returned, save as `provider_key`.

```
get_provider_actions("{{provider_key}}")
```

If indexed actions exist:
> "Found `{{provider}}` in the StackOne index with {{N}} known actions. I'll use this as a reference."

If not found:
> "`{{provider}}` isn't indexed yet — we'll discover actions from scratch in Step 3."

---

## Step 3: Detect CLI availability

```bash
npx @stackone/cli --version
```

Save `cli_available: true/false`.

If unavailable:
> "StackOne CLI isn't available. I'll guide manual scaffolding instead."

---

## Step 4: Pull or scaffold

**If CLI available and provider exists in index:**
```bash
npx @stackone/cli pull {{provider}}
```
Verify `src/configs/{{provider}}/` was created. Save `connector_exists: true`.

**If scaffolding from scratch:**
```bash
npx @stackone/cli scaffold {{provider}}
```
Or if CLI unavailable, create `src/configs/{{provider}}/{{provider}}.connector.s1.yaml` manually:
```yaml
name: {{provider}}
version: "1.0"
authentication: {}  # configured in next step
baseUrl: ""         # set in next step
actions: []
```
Save `connector_exists: false`.

Save `connector_path: "src/configs/{{provider}}"`.

---

## Handoff

> "Setup complete. ✓ Connector at `src/configs/{{provider}}/`
>
> Next: configure authentication.
> Run `/configure-auth` to continue."

Update `session_step` to `"configure-auth"`.
```

---

### Task 8: Write configure-auth SKILL.md

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/skills/configure-auth/SKILL.md`

**Step 1: Write the file**

```markdown
---
name: configure-auth
description: Step 2 of building a generic Falcon connector. Asks the builder which authentication type the provider uses, generates the correct YAML auth block, and writes it into the connector config file.
invoke: configure-auth
---

# Configure Auth

Step 2 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Configuring auth for `{{provider}}`."

Read `${CLAUDE_PLUGIN_ROOT}/references/auth-patterns.md` before starting.

---

## Step 1: Identify auth type

Ask:
> "How does `{{provider}}`'s API authenticate requests?
>
> **A) API Key / Bearer token** — static key passed in a header
> **B) OAuth 2.0** — users authorise via a browser flow
> **C) Basic Auth** — username and password
> **D) API Key in query parameter** — key appended to the URL
> **E) Something else** — describe it and I'll help figure it out
>
> (A/B/C/D/E)"

---

## Step 2: Collect credentials

Ask for the specific values needed:

- **A / D (API Key):** "What's the header or query param name? (e.g., `Authorization`, `X-API-Key`, `api_key`)"
- **B (OAuth2):** "Do you have the token URL and authorization URL? What scopes are needed?"
- **C (Basic Auth):** "Is this username + password, or username + API key as password?"
- **E (Other):** Gather details and match to the closest pattern in `auth-patterns.md`

---

## Step 3: Write auth block into connector YAML

Read `src/configs/{{provider}}/{{provider}}.connector.s1.yaml`.

Replace the `authentication: {}` placeholder (or existing auth block) with the correct pattern from `auth-patterns.md`.

Also set `baseUrl` if the builder knows it:
> "What is the base URL for `{{provider}}`'s API? (e.g., `https://api.provider.com/v1`)"

If unknown, leave a placeholder: `baseUrl: "# TODO: set provider base URL"`.

---

## Step 4: Show required .env variables

Tell the builder exactly which variables to add to `.env`:
> "Add these to your `.env` file before testing:
> ```
> {{PROVIDER_CREDENTIAL_VARS}}
> ```"

---

## Step 5: Confirm

Show the written auth block and ask:
> "Does this look right? The credentials stay in `.env` — the YAML only references them by variable name."

Apply any corrections.

Save `auth_type` to session.

---

## Handoff

> "Auth configured. ✓
>
> Next: choose which actions to build.
> Run `/discover-actions` to continue."

Update `session_step` to `"discover-actions"`.
```

---

### Task 9: Write discover-actions SKILL.md

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/skills/discover-actions/SKILL.md`

**Step 1: Write the file**

```markdown
---
name: discover-actions
description: Step 3 of building a generic Falcon connector. Lets the builder choose between scoped discovery (use-case driven) or maximal discovery (finds every available API endpoint using the StackOne discover_actions MCP tool). Saves the confirmed action scope to session.
invoke: discover-actions
---

# Discover Actions

Step 3 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Discovering actions for `{{provider}}`."

---

## Step 1: Choose discovery mode

Ask:
> "How much of `{{provider}}`'s API do you want to cover?
>
> **A) Scoped** — Tell me your use case and I'll recommend the right actions
> **B) Maximal** — Discover every available endpoint (takes 5–15 minutes, uses autonomous research)
>
> (A/B)"

Save `discovery_mode: "scoped"` or `"maximal"`.

---

## Path A: Scoped discovery

### A1: Ask about use case

> "Describe what you need this connector to do. Examples:
> - "Read employee and department data into our platform"
> - "Let users create and update time-off requests"
> - "Sync job postings to our job board"
>
> What's your use case?"

Save `use_case` to session.

### A2: Look up relevant actions

Run a vector search to find related actions:
```
vector_search("{{use_case}} {{provider}}")
```

Also check StackOne's known actions for this provider:
```
get_provider_actions("{{provider_key}}")
```

### A3: Present recommended action set

Based on the use case and search results, present a recommended scope:

> "Based on your use case, here are the actions I recommend:
>
> | Resource | Actions | Endpoints |
> |----------|---------|----------|
> | `employees` | list, get | `GET /employees`, `GET /employees/{id}` |
> | `departments` | list | `GET /departments` |
>
> Does this cover what you need? You can add or remove anything."

Allow the builder to adjust freely.

### A4: Flag known limitations

If `get_provider_actions` returned coverage data, note any gaps:
> "Note: `{{provider}}` doesn't appear to support `create` on employees via API — only `list` and `get` are confirmed."

### A5: Save to session

```json
{
  "discovery_mode": "scoped",
  "action_scope": {
    "employees": ["list", "get"],
    "departments": ["list"]
  },
  "use_case": "Read employee and department data"
}
```

---

## Path B: Maximal discovery

### B1: Check S3 cache first

```
map_provider_key("{{provider}}")
get_provider_actions("{{provider_key}}")
```

If cached data exists with many actions:
> "Found {{N}} actions in the StackOne index for `{{provider}}`. I can use this data directly — no need to wait for a full discovery run."

Use cached data and skip to B4.

### B2: Launch autonomous discovery

```
discover_actions({ provider: "{{provider}}", maxIterations: 30 })
```

Returns a `taskId` immediately. Tell the builder:
> "Launched autonomous discovery for `{{provider}}`. This typically takes 5–15 minutes. I'll poll for results — you can continue working in another tab."

### B3: Poll for completion

Every 60–90 seconds:
```
get_discover_actions_task_status("{{taskId}}", "{{provider}}")
```

Status: `pending` → `running` → `complete`

When `running`, report progress:
> "Still discovering... found {{N}} actions so far."

### B4: Run version analysis

Once discovery completes, extract endpoints and run:
```
analyze_versioning({ provider: "{{provider}}", endpoints: [...], maxIterations: 5 })
```

Poll with `get_analyze_versioning_task_status`. This identifies deprecated endpoints and version conflicts.

### B5: Present full action list

> "Discovery complete. Found {{N}} actions across {{M}} resources:
>
> | Resource | Actions found |
> |----------|-------------|
> | `employees` | list, get, create, update |
> | `departments` | list, get |
> | `time_off` | list, get, create, delete |
> | ... |
>
> Which would you like to include? (all / select specific ones)"

### B6: Save to session

```json
{
  "discovery_mode": "maximal",
  "action_scope": { ... all confirmed actions ... },
  "use_case": "Full API coverage"
}
```

---

## Handoff

> "Action scope confirmed. ✓
>
> {{N}} actions across {{M}} resources.
>
> Next: generate the connector YAML.
> Run `/build-config` to continue."

Update `session_step` to `"build-config"`.
```

---

### Task 10: Write build-config SKILL.md

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/skills/build-config/SKILL.md`

**Step 1: Write the file**

```markdown
---
name: build-config
description: Step 4 of building a generic Falcon connector. Generates YAML action configurations for all confirmed actions using actionType custom, writes partial files for each resource, and updates the main connector YAML with $ref links.
invoke: build-config
---

# Build Config

Step 4 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Building config for `{{provider}}` — {{N}} actions across {{M}} resources."

Read `${CLAUDE_PLUGIN_ROOT}/references/connector-patterns.md` before writing any YAML.

If `action_scope` is missing:
> "No action scope found. Run `/discover-actions` first."

---

## Step 1: Ask for endpoint details (if not already known)

If endpoint URLs weren't captured during discovery, ask for each resource:
> "What is the API endpoint for `{{resource}}`? (e.g., `/employees`, `/v2/employees`)"

Use provider API docs if the builder can share a link, or reference any data from `get_provider_actions`.

---

## Step 2: For each resource, write a partial YAML file

Create `src/configs/{{provider}}/{{provider}}.{{resource}}.s1.partial.yaml`.

Use the non-unified action pattern from `connector-patterns.md`. Each action should be:

```yaml
- name: list_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}"
  entrypointHttpMethod: GET
  inputs:
    page:
      type: number
      required: false
    per_page:
      type: number
      required: false
  steps:
    - type: request
      id: fetch_{{resource}}
```

For `get` actions:
```yaml
- name: get_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}/${inputs.id}"
  entrypointHttpMethod: GET
  inputs:
    id:
      type: string
      required: true
  steps:
    - type: request
      id: fetch_{{resource}}
```

For `create` actions:
```yaml
- name: create_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}"
  entrypointHttpMethod: POST
  inputs:
    body:
      type: object
      required: true
  steps:
    - type: request
      id: create_{{resource}}
```

For `update` actions:
```yaml
- name: update_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}/${inputs.id}"
  entrypointHttpMethod: PATCH
  inputs:
    id:
      type: string
      required: true
    body:
      type: object
      required: true
  steps:
    - type: request
      id: update_{{resource}}
```

For `delete` actions:
```yaml
- name: delete_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}/${inputs.id}"
  entrypointHttpMethod: DELETE
  inputs:
    id:
      type: string
      required: true
  steps:
    - type: request
      id: delete_{{resource}}
```

---

## Step 3: Update main connector YAML with $refs

Read `src/configs/{{provider}}/{{provider}}.connector.s1.yaml`.

Add a `$ref` for each partial under `actions`:
```yaml
actions:
  - $ref: "./{{provider}}.employees.s1.partial.yaml"
  - $ref: "./{{provider}}.departments.s1.partial.yaml"
```

---

## Step 4: Review with builder

Show the file list created:
> "Config written:
> - `src/configs/{{provider}}/{{provider}}.connector.s1.yaml` (updated)
> - `src/configs/{{provider}}/{{provider}}.employees.s1.partial.yaml`
> - ..."

Ask:
> "Do the endpoint URLs and HTTP methods look right? Any actions need adjusting before we validate?"

Apply corrections.

---

## Handoff

> "Config built. ✓
>
> Next: validate the YAML.
> Run `/validate-connector` to continue."

Update `session_step` to `"validate-connector"`.
```

---

### Task 11: Write generic validate-connector SKILL.md

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/skills/validate-connector/SKILL.md`

**Step 1: Write the file**

This is simpler than the unified version — no `schemaType`, `fieldConfigs`, or `map_fields` steps to check.

```markdown
---
name: validate-connector
description: Step 5 of building a generic Falcon connector. Runs stackone validate, interprets errors, guides fixes, and confirms the config is structurally correct before live testing.
invoke: validate-connector
---

# Validate Connector

Step 5 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Validating `src/configs/{{provider}}/`"

Read `${CLAUDE_PLUGIN_ROOT}/references/cli-commands.md` for the error table.

---

## Step 1: Run validation

**If `cli_available` is true:**
```bash
npx @stackone/cli validate src/configs/{{provider}}/{{provider}}.connector.s1.yaml
```

**If CLI unavailable (manual review):**

Read each `.yaml` and `.partial.yaml` file and check:
- Every action has `entrypointUrl` and `entrypointHttpMethod`
- Valid `actionType` values: `custom`, `list`, `get`, `create`, `update`, `delete`
- Actions that take an ID have `${inputs.id}` in the URL and `id` in `inputs`
- `create` and `update` actions have a `body` input
- All `$ref` paths in the main connector point to files that exist
- No tabs — 2-space indentation throughout
- `baseUrl` is set (not a placeholder)
- `authentication` block is populated (not `{}`)

---

## Step 2: Fix errors

For each error, explain and fix:

**Missing `entrypointUrl`:**
```yaml
entrypointUrl: "/{{resource}}"
entrypointHttpMethod: GET
```

**Wrong `actionType`:**
> Valid: `custom`, `list`, `get`, `create`, `update`, `delete`

**Missing `inputs.id` for get/update/delete:**
```yaml
inputs:
  id:
    type: string
    required: true
```

**Bad `$ref` path:**
> Check filename: `{{provider}}.{{resource}}.s1.partial.yaml`

**Empty auth block:**
> Run `/configure-auth` to set up authentication.

Re-run after each fix. Repeat until clean.

---

## Step 3: Confirm

> "Validation passed. ✓
>
> - Provider: `{{provider}}`
> - Resources: {{resources}}
> - Actions: {{action_scope}}"

Save `validated: true` to session.

---

## Handoff

> "Ready for testing. Ensure your `.env` credentials are set.
>
> Run `/test-connector` to continue."

Update `session_step` to `"test-connector"`.
```

---

### Task 12: Write generic test-connector SKILL.md

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/skills/test-connector/SKILL.md`

**Step 1: Write the file**

```markdown
---
name: test-connector
description: Step 6 (final) of building a generic Falcon connector. Tests every action live against the provider API, verifies responses, cleans up all test records created during testing, and produces a cleanup report.
invoke: test-connector
---

# Test Connector

Step 6 (final step) of the generic connector build process.

## Session File

Read `.connector-build-session.json`.

If `validated` is not `true`:
> "Connector hasn't been validated yet. Run `/validate-connector` first."

Initialise `test_artifacts: []` in session if not present.

---

## Step 1: Confirm credentials

Ask:
> "Are your `.env` credentials ready for `{{provider}}`?
> You'll need: `{{PROVIDER_CREDENTIAL_VARS}}`"

Wait for confirmation.

---

## Step 2: Test each action

Test in this order for each resource: `list` → `get` → `create` → `update` → `delete`.

**If MCP tools are accessible:**
```
test_actions({
  provider: "{{provider}}",
  actions: ["list_{{resource}}", "get_{{resource}}"]
})
```
Poll with `get_test_actions_task_status(taskId)`.

**If running manually:**
```bash
npx @stackone/cli test {{provider}} list_{{resource}}
npx @stackone/cli test {{provider}} get_{{resource}} --input '{"id": "test-id"}'
```

---

## Step 3: Track test artifacts

Every time a `create` action succeeds, immediately record the new record:

```json
{ "resource": "{{resource}}", "id": "{{returned_id}}", "cleaned_up": false }
```

Add to `test_artifacts` in session.

---

## Step 4: Verify responses

**`list` actions:**
- Response is an array or has a `data` array
- At least one record returned (or empty array with no error)

**`get` actions:**
- Single object returned
- Object has an `id` field

**`create` actions:**
- Record created (2xx response)
- Response contains the new record's `id`

**`update` actions:**
- Changes reflected in response or confirmed with follow-up `get`

**`delete` actions:**
- 200, 202, or 204 response
- Follow-up `get` returns 404 or empty

---

## Step 5: Clean up after every create

After verifying each `create` + `update`:

**If `delete` is in scope for this resource:**
```bash
npx @stackone/cli test {{provider}} delete_{{resource}} --input '{"id": "{{test_record_id}}"}'
```

Verify with a follow-up `get` (expect 404).

Mark in session: `"cleaned_up": true`.

**If `delete` is NOT in scope:**

Attempt soft cleanup in this order:
1. Look for an `update` action — set status to `inactive`, `archived`, or `cancelled`
2. Look for a `cancel` or `deactivate` action
3. If none available: log the record as irremovable

Mark in session: `"cleaned_up": false`, `"reason": "no delete endpoint"`.

---

## Step 6: Diagnose failures

**401/403 — Auth error:**
> "Authentication failed. Check your `.env` credentials and the `authentication` block in the connector YAML."

**404 — Wrong URL:**
> "Endpoint not found. Verify `entrypointUrl` matches the provider's API docs."

**Empty response / wrong shape:**
> "The response structure doesn't match expectations. Use `--debug` to inspect the raw response and update `entrypointUrl` or HTTP method if needed."

**Create succeeds but update/delete fails:**
> "The record was created but subsequent operations failed — likely the ID format differs between create response and path parameter. Check `${inputs.id}` matches the ID field in the create response."

Fix the issue in the partial YAML and re-run the affected action. Re-clean up any leftover records.

---

## Step 7: Scramble credentials

After all tests pass (or are resolved):

```
scramble_credentials("{{provider}}")
```

This removes real credentials from the config history.

---

## Step 8: Cleanup report + final summary

> "All tests complete.
>
> **Test cleanup summary:**
> | Resource | Record ID | Status |
> |----------|-----------|--------|
> | `employees` | EMP_test_001 | ✓ deleted |
> | `departments` | DEP_test_007 | ⚠ not deleted — no delete endpoint |
>
> **Actions verified:**
> | Resource | list | get | create | update | delete |
> |----------|------|-----|--------|--------|--------|
> | `employees` | ✓ | ✓ | ✓ | ✓ | ✓ |
> | `departments` | ✓ | ✓ | — | — | — |
>
> **Next steps:**
> 1. Commit: `git add src/configs/{{provider}}/ && git commit -m 'feat: add {{provider}} connector'`
> 2. Address any undeleted test records manually (IDs listed above)
> 3. Open a PR to the connectors repository"

Save `tested: true`, `completed_at: "{{datetime}}"` to session.
```

---

### Task 13: Write README.md for generic plugin

**Files:**
- Create: `.claude/plugins/stackone-connector-builder/README.md`

**Step 1: Write the file**

```markdown
# stackone-connector-builder

Interactive wizard for building generic Falcon connectors. Guides builders through provider setup, authentication, action discovery, YAML config generation, validation, and live testing — with full test record cleanup.

For connectors that normalise data to a standard schema (HRIS, ATS, CRM, etc.), use `stackone-unified-builder` instead.

## Usage

### Full wizard

```bash
/build-connector
```

### Individual steps

| Command | Step |
|---------|------|
| `/setup-connector` | 1. Provider setup and scaffold |
| `/configure-auth` | 2. Authentication configuration |
| `/discover-actions` | 3. Scoped or maximal action discovery |
| `/build-config` | 4. Generate action YAML |
| `/validate-connector` | 5. Validate config structure |
| `/test-connector` | 6. Live test + cleanup |

## Discovery modes

**Scoped** — Describe your use case, get a focused action set. Fast.

**Maximal** — Autonomous discovery of every available API endpoint using StackOne's `discover_actions` tool. Takes 5–15 minutes but finds everything.

## Test cleanup

`/test-connector` records every ID created during testing and deletes them after verification. A cleanup report is shown at the end listing anything that couldn't be removed.

## Requirements

- `connectors-template` project structure
- Node.js (for StackOne CLI — optional but recommended)
- StackOne MCP tools (for `discover_actions`, `test_actions`, etc.)
- Provider API credentials in `.env`
```

---

### Task 14: Final verification

**Step 1: Confirm unified builder rename is complete**
```bash
ls /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-unified-builder/skills/
```
Expected: `stackone-unified-builder/` folder present (not `stackone-connector-builder/`).

**Step 2: Confirm new generic plugin structure**
```bash
find /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/stackone-connector-builder -type f | sort
```

Expected output:
```
.claude-plugin/plugin.json
README.md
references/auth-patterns.md
references/cli-commands.md
references/connector-patterns.md
skills/stackone-connector-builder/SKILL.md
skills/setup-connector/SKILL.md
skills/configure-auth/SKILL.md
skills/discover-actions/SKILL.md
skills/build-config/SKILL.md
skills/validate-connector/SKILL.md
skills/test-connector/SKILL.md
```

**Step 3: Confirm no invoke command conflicts**
```bash
grep -r "^invoke:" /Users/cameroncarlin/Projects/connectors-template/.claude/plugins/*/skills/*/SKILL.md | sort
```
Expected: `/build-connector` appears once, `/build-unified-connector` appears once. All others unique.

**Step 4: Done** — notify user.
