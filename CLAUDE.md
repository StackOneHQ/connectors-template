# Falcon Connector Template

A YAML-based framework for building API connector configurations using the Falcon engine. Connectors define how StackOne communicates with third-party provider APIs.

## Available Plugins

Two plugins are available depending on the connector type:

- **`stackone-connector-builder`** — invoke with `/build-connector` — for generic (non-unified) connectors that return raw provider responses as-is
- **`stackone-unified-builder`** — invoke with `/build-unified-connector` — for connectors that map provider data to StackOne unified schemas (HRIS, ATS, CRM, etc.)

Each plugin has detailed reference files in its `references/` directory covering auth patterns, step functions, expressions, and YAML structure.

## Getting Started

### Quick Start Commands

| Scenario | Command/Trigger |
|----------|----------------|
| First time / unsure | `/on-boarding` |
| Generic (non-unified) connector | `/build-connector` |
| Schema-based (unified) connector | `/build-unified-connector` or `start unified build for [provider]` |
| Agentic connector (know what you want) | Just describe what you want |
| Test connector with AI agent | `/test-mcp-connector <provider>` |

### /on-boarding Command

Use `/on-boarding` to launch the structured onboarding flow. This walks you through:

1. **Connector Type Selection** - Choose between:
   - **Agentic Actions**: Raw provider data, maximum API coverage
   - **Schema-Based**: Transformed data to your specific schema
   - **Skip Walkthrough**: For experienced users

2. **Provider Setup** - Specify provider name and API version

3. **Workflow Guidance** - Step-by-step instructions for your chosen path

### Direct Triggers (Skip Onboarding)

**For Schema-Based connectors**: Use the phrase **"start unified build for [provider]"**
- Example: `start unified build for BambooHR`
- This triggers the Unified Connector Build workflow directly

**For Agentic connectors**: Just describe what you want to build
- Example: "add a list_users action to the Slack connector"
- Example: "build a connector for Linear API"

---

### Path B: Schema-Based Connector (Unified)

When building Schema-Based connectors, follow this workflow:

#### Developer Workflow for Schema-Based Connectors

```
┌─────────────────────────────────────────────────────────────┐
│  1. FORK CONNECTOR                                          │
│     └─ Run `npx @stackone/cli pull <provider>` to get existing      │
│     └─ Fork existing or create new from template           │
├─────────────────────────────────────────────────────────────┤
│  2. BUILD AUTH                                              │
│     └─ Configure authentication (API Key, OAuth, etc.)     │
│     └─ Validate auth works before proceeding               │
├─────────────────────────────────────────────────────────────┤
│  3. CONNECT ACCOUNT                                         │
│     └─ Push connector to profile                           │
│     └─ Create test account with real credentials           │
│     └─ Verify connection works                             │
├─────────────────────────────────────────────────────────────┤
│  4. DEFINE SCHEMA AND USE CASE                              │
│     └─ User provides target schema (field names, types)    │
│     └─ Document required vs optional fields                │
│     └─ Clarify the business use case                       │
├─────────────────────────────────────────────────────────────┤
│  5. RESEARCH & PRESENT OPTIONS                              │
│     └─ Research ALL available endpoints                    │
│     └─ Present options with trade-offs to user             │
│     └─ Get user approval before implementation             │
├─────────────────────────────────────────────────────────────┤
│  6. BUILD & OPTIMISE VIA SKILLS                             │
│     └─ Implement field mappings                            │
│     └─ Configure pagination                                │
│     └─ Test and validate                                   │
├─────────────────────────────────────────────────────────────┤
│  7. LOCK SCHEMA                                             │
│     └─ Confirm all schema fields are mapped                │
│     └─ Document any limitations or unmapped fields         │
│     └─ Finalize connector version                          │
├─────────────────────────────────────────────────────────────┤
│  8. ITERATE                                                 │
│     └─ Test with real data                                 │
│     └─ Refine mappings based on edge cases                 │
│     └─ Push updates as needed                              │
└─────────────────────────────────────────────────────────────┘
```

#### Step-by-Step Guidance for Schema-Based Connectors

**Step 1: Fork Connector**

First, pull the existing connector from StackOne:
```bash
# Pull existing connector from StackOne registry
npx @stackone/cli pull <provider>
```

If pull succeeds: Fork and modify the existing connector
If pull fails: Check local configs, then create new if needed:
```bash
ls src/configs/ | grep -i <provider>
```

**Step 2: Build Auth**

Before anything else, configure and validate authentication:
- Determine auth type (API Key, OAuth 2.0, etc.)
- Configure `authentication` section in connector YAML
- Test auth works with a simple action

**Step 3: Connect Account**

Push connector and create a test account:
```bash
# Push to your profile
npx @stackone/cli push src/configs/<provider>/<provider>.connector.s1.yaml --profile <your-profile>

# User creates account in StackOne dashboard
# Get account ID for testing
```

**Step 4: Define Schema and Use Case**

**CRITICAL**: Before researching endpoints, get the user's schema:

Ask the user:
```
Please share your target schema:

1. What fields do you need? (e.g., email, employee_id, department)
2. What are the field types? (string, number, boolean, enum)
3. Which fields are required vs optional?
4. What is your use case? (helps determine optimal endpoint)

Example format:
- email: string (required)
- employee_id: string (required)
- department: string (optional)
- job_title: string (optional)
```

**Step 5: Research & Present Options**

**MANDATORY CHECKPOINT**: Research ALL endpoints, then present options:

| Endpoint | Field Coverage | Performance | Permissions | Status |
|----------|----------------|-------------|-------------|--------|
| Option A | 70% of schema  | Fast        | Narrow      | Active |
| Option B | 100% of schema | Medium      | Moderate    | Active |
| Option C | 100% of schema | Slow        | Broad       | Deprecated |

**Get explicit user approval before proceeding to implementation.**

**Step 6: Build & Optimise**

Follow the **Unified Connector Build Skill**:
- See `.claude/skills/unified-connector-build.md`
- Implement field mappings with `map_fields` and `typecast`
- Configure pagination
- Test with real data

**Step 7: Lock Schema**

Confirm with user:
- [ ] All required schema fields are mapped
- [ ] Optional fields mapped where possible
- [ ] Limitations documented (fields that can't be mapped)
- [ ] Connector version finalized

**Step 8: Iterate**

Test, refine, and push updates as needed.

---

## Project Knowledge

**Tech Stack:**
- Falcon API Config Framework (YAML-based connector configurations)
- StackOne CLI (`@stackone/cli`) for validation and testing
- Node.js/TypeScript environment
- MCP (Model Context Protocol) tools for research and testing

**File Structure:**
- `src/configs/` – Provider-specific folders with YAML connector configs
- Provider folder: `src/configs/providername/` (lowercase, no hyphens)
- Config file: `provider.connector.s1.yaml`
- Example: `src/configs/slack/slack.connector.s1.yaml`

## Available Skills

This project has **skills** - documented workflows that you should follow when performing specific tasks. These are located in the `.claude/skills/` directory. These are supplementary to the plugins above.

### Connector Onboarding Skill

**Trigger**: `/on-boarding` command

**Location**: `.claude/skills/connector-onboarding.md`

**Summary**: Structured onboarding flow that guides users through:
1. **Connector type selection** - Agentic Actions vs Schema-Based vs Skip Walkthrough
2. **Provider setup** - User specifies provider name and API version
3. **Workflow guidance** - Step-by-step instructions for the chosen path

**Important**: This skill is ONLY triggered by the `/on-boarding` command. For vague queries like "build a connector", just ask "What provider?" directly and proceed with the appropriate workflow.

---

### Falcon Connector Build Skill

**When to use**: User asks to "build connector for [provider]", "create Falcon config for [provider]", "new connector"

**Location**: `.claude/skills/falcon-connector-build.md`

**Summary**: Complete 11-step workflow for building production-ready Falcon API connector configurations:
1. Research Phase (parallel action discovery + auth/docs/repos)
2. Synchronization
3. Version Validation
4. Config Building (YAML with partials)
5. YAML Validation
6. Coverage Validation (>=80%)
7. Action Tracking Setup
8. Testing Phase (100% coverage, all auth types)
9. Test Completion Verification
10. Security (scramble credentials)
11. Meta Feedback (mandatory)

### Falcon Connector Testing Skill

**When to use**: User asks to "test connector", "run tests", "validate actions"

**Location**: `.claude/skills/falcon-connector-testing.md`

**Summary**: Comprehensive testing workflow for Falcon connectors:
- Create action tracking file (mandatory)
- Test every operation with EVERY auth type
- Cycle-based testing (LIST -> GET -> CREATE -> UPDATE -> DELETE)
- Fix failures immediately
- Verify 100% completion before proceeding
- Update tracking file after each test

### Falcon Authentication Setup Skill

**When to use**: User asks to "set up authentication", "configure auth", "add OAuth", "add API key auth"

**Location**: `.claude/skills/falcon-auth-setup.md`

**Summary**: Configure authentication for Falcon connectors (only `custom` and `oauth2` types supported). See plugin `references/auth-patterns.md` for detailed examples.

### Falcon Technical Reference Skill

**When to use**: User asks for "YAML syntax", "how to write step functions", "expression formats", "JSONPath vs JEXL"

**Location**: `.claude/skills/falcon-technical-reference.md`

**Summary**: Comprehensive technical reference. See plugin `references/` for the most up-to-date patterns.

### Unified Connector Skills

These skills are for building connectors that map provider data to **customer-defined schemas** with unified pagination. Use these when the customer wants standardized output across multiple providers.

### Unified Connector Build Skill

**Trigger phrase**: `start unified build for [provider]`

**Example**: `start unified build for BambooHR`

**Location**: `.claude/skills/unified-connector-build.md`

**Important**: For vague queries like "build connector" or "schema mapping", just ask "What provider?" directly and proceed. Do NOT trigger the onboarding flow unless explicitly requested.

**Summary**: Complete 10-step workflow for building unified/standardized connectors:
1. Define output schema first (schema-first approach)
2. **Research ALL provider endpoints (MANDATORY - DO NOT SKIP)**
3. **Present options to user with trade-offs (MANDATORY CHECKPOINT)**
4. Analyze scope requirements (narrower is better)
5. Map fields to schema using `fieldConfigs`
6. Configure unified pagination with `cursor`
7. Build connector with `map_fields` and `typecast` steps
8. Validate configuration
9. Test and validate mappings
10. Document schema coverage

**Key Difference**: Unified connectors use `schemaType: unified` and transform provider data to match YOUR schema field names.

### Unified Field Mapping Skill

**When to use**: User asks about "field mapping", "fieldConfigs", "enumMapper", "map fields", or needs to translate provider fields to schema fields.

**Location**: `.claude/skills/unified-field-mapping.md`

**Summary**: Detailed guide for mapping provider fields to unified schemas:
- `fieldConfigs` structure (`targetFieldKey` = YOUR schema name)
- Enum mapping with `enumMapper` (translate provider values)
- Nested objects and arrays
- JEXL transformations for computed fields
- Common mistakes (using provider field names instead of schema names)

**Critical Rule**: `targetFieldKey` must ALWAYS use YOUR schema field names, never the provider's field names.

### Unified Scope Decisions Skill

**When to use**: User asks about "scopes", "permissions", "endpoint selection", "trade-offs", or needs to decide between multiple endpoint options.

**Location**: `.claude/skills/unified-scope-decisions.md`

**Summary**: Decision framework for selecting endpoints and scopes:
- Narrow scopes are always preferred (easier customer approval)
- Never use deprecated endpoints (even if they seem easier)
- Endpoint evaluation criteria (scopes, performance, data depth)
- `scopeDefinitions` syntax (NOT `scope_definitions` - this is a common error)
- Performance vs security trade-off analysis

**Common Error**: Using `scope_definitions` instead of `scopeDefinitions` (camelCase is correct).

### Unified Connector Testing Skill

**When to use**: User asks to "test unified connector", "validate mapping", "debug fields", "test pagination", or output doesn't match expected schema.

**Location**: `.claude/skills/unified-connector-testing.md`

**Summary**: Testing and validation for unified connectors:
- Phase 1: Raw response validation (understand provider structure)
- Phase 2: Field mapping validation (verify schema field names)
- Phase 3: Pagination testing (cursor, next page, empty results)
- Phase 4: Schema completeness validation
- Debugging techniques for common mapping issues

**Key Debug Technique**: Use `--debug` flag to see raw provider response before mapping.

---

## Core Principles

- **MAXIMUM COVERAGE**: Discover and implement ALL useful actions the provider API offers
- **ACTION-FOCUSED**: Prioritize operations that solve real business problems
- **DEFAULT TO NON-UNIFIED**: Unless explicitly requested, use `actionType: custom`
- **PRACTICAL UTILITY**: Focus on production-ready operations; ignore deprecated/internal endpoints
- **LEAVE NO TRACE**: Clean up test data after testing; scramble credentials when done

## Workflows

### Plugin Workflows (Recommended)

The plugins automate the full build process. Use these when possible:

**Generic connector (`/build-connector`):**

| Step | Command | What it does |
|------|---------|--------------|
| 1 | `/setup-connector` | Provider setup, checks StackOne index, CLI pull or scaffold |
| 2 | `/configure-auth` | Auth configuration (API key, OAuth2, Basic Auth, custom) |
| 3 | `/discover-actions` | Choose scoped or maximal discovery (MCP-powered) |
| 4 | `/build-config` | Generate YAML with `actionType: custom` for all actions |
| 5 | `/validate-connector` | Validate YAML structure |
| 6 | `/test-connector` | Live test + automatic cleanup + credential scrambling |

**Unified connector (`/build-unified-connector`):**

| Step | Command | What it does |
|------|---------|--------------|
| 1 | `/choose-schema` | Pick a StackOne built-in schema, point to your own, or define one interactively |
| 2 | `/check-connector` | Check if a base connector exists, pull it or scaffold a new one |
| 3 | `/scope-actions` | Choose which resources and CRUD operations to expose |
| 4 | `/map-fields` | Map provider API fields to your schema, writes YAML partials |
| 5 | `/validate-connector` | Validate the YAML config structure |
| 6 | `/test-connector` | Test live against the provider API and verify field output |

**Plugin features:**
- **Session persistence** — progress is saved to `.connector-build-session.json` so you can pause and resume at any step
- **Two discovery modes** — *Scoped* (vector search, quick) or *Maximal* (async MCP, 5-15 min, full coverage)
- **Test cleanup** — every record created during testing is tracked and deleted afterwards
- **Automatic credential scrambling** — `scramble_credentials` is always called after testing

### Manual Workflow (Legacy)

When not using plugins, follow this sequence:

1. **Research Phase (PARALLEL)** -> Launch `discover_actions` subagent + main agent for auth/docs/external repos
2. **Synchronization** -> Collect and integrate subagent results
3. **Version Validation** -> `analyze_versioning()` -> Detect/resolve API version conflicts
4. **Config Building** -> Create comprehensive YAML with all discovered operations
5. **YAML Validation** -> `npx @stackone/cli validate src/configs/<provider>/<provider>.connector.s1.yaml`
6. **Coverage Validation** -> Confirm adequate endpoint coverage
7. **Action Tracking Setup** -> **MANDATORY** - Save action inventory to `/tmp/<provider>_actions_tracking.json`
8. **Testing Phase** -> `test_actions()` -> Test EVERY operation with real API calls for EVERY auth type
9. **Test Completion Verification** -> Verify 100% coverage
10. **Security** -> `scramble_credentials()` -> Secure all credentials
11. **Meta Feedback** -> `meta_feedback()` -> **MANDATORY** - Send feedback for tracking

**Skip/Disorder = Incomplete Task**

## Research Phase

### Quick Reference Workflow

**Step 0:** Reference existing connector -> `src/configs/` (same category/auth type)
**Step 1:** StackOne context -> `get_stackone_categories()`, `get_stackone_actions(category)`
**Step 2:** Action discovery -> `discover_actions()` (PRIMARY - autonomous subagent)
**Step 3:** Auth research -> `vector_search()`, `web_search()`
**Step 4:** Documentation -> `get_provider_coverage()`, `fetch()`, `extract_oas_actions()`
**Step 5:** External repos -> `get_external_integrations()`, `scan_external_repo()`
**Step 6:** Parallel execution -> Synchronize all results

### Action Discovery (PRIMARY)

**Check S3 first:**
```typescript
map_provider_key("provider_name") // Get exact provider key
get_provider_actions("provider_key") // Check for indexed data
```

**Launch autonomous discovery if no data exists:**
```typescript
// Launch (returns immediately)
discover_actions({ provider: "provider_name", maxIterations: 30 })
// -> { taskId: "rpc_xxx", ... }

// Poll every 60-90 seconds
get_discover_actions_task_status(taskId, provider)
// Status: "pending" -> "running" -> "complete"

// Extract results (5-15 minutes)
// Result: JSON report with ~100 discovered actions
// Auto-saved to S3 for future use
```

**Benefits:** Autonomous (20+ tool calls), Comprehensive, Async (5-15 min), Persistent

### Version Validation

After action discovery completes:

```typescript
// Extract endpoints from discovered actions
const endpoints = discoveredActions.map(a => a.endpoints[0]);

// Launch versioning analysis (2-5 minutes)
analyze_versioning({ provider: "provider_name", endpoints, maxIterations: 5 })
// -> { taskId: "rpc_xxx", ... }

// Poll for status
get_analyze_versioning_task_status(taskId, provider)
// Result: Version analysis with conflicts, migrations, recommendations
```

**Checklist:**
- [ ] Endpoints extracted from discovered actions
- [ ] Version analysis complete with recommendations
- [ ] Breaking changes and conflicts reviewed
- [ ] Recommended version identified for each endpoint
- [ ] Migration steps documented for deprecated endpoints

### Parallel Execution Strategy

1. **Minute 0:** Launch `discover_actions(provider)` -> Get taskId
2. **Minutes 0-5:** Complete Steps 0-5 (reference, context, auth, docs, repos)
3. **Minutes 5-15:** Poll `get_discover_actions_task_status()` every 60-90 seconds
4. **Minute 15:** Synchronize results
5. **Minute 15-20:** Run `analyze_versioning()` for version validation
6. **Begin config building**

---

## Config Building

### Prerequisites & Guidelines

- **Default to non-unified actions** unless explicitly told otherwise
  - Non-unified: Map exactly to provider's API, output provider's response entirely
  - Unified: Use StackOne schema - only use when explicitly requested
- **Ignore deprecated actions, fields, and inputs**
- **YAML Best Practice:** Never use `:` as a literal value (use parentheses instead)
  - GOOD: `description: Filter by status (pending, approved)`
  - BAD: `description: Filter by status: pending`

### File Structure (ALWAYS Use Partials)

ALWAYS use the partials approach - never create monolithic connector files.

```
src/configs/{provider}/
  {provider}.connector.s1.yaml              # Main: info, auth, $refs only
  {provider}.{resource}.s1.partial.yaml     # Actions grouped by resource
```

- Folder names: **lowercase, no hyphens** (e.g., `smartrecruiters/`)
- Partial files start directly with `- actionId:` — NO `actions:` wrapper

**Example:**
```
src/configs/clickup/
  clickup.connector.s1.yaml      # Main file
  clickup.tasks.s1.partial.yaml  # Task actions
  clickup.users.s1.partial.yaml  # User actions
```

### Key Rules

- **camelCase** for ALL config field names (`scopeDefinitions`, NOT `scope_definitions`)
- Never use `:` in YAML string values — use parentheses or rephrase instead
- **2-space indentation**, no tabs
- Never use `type: array` — use `array: true` alongside the element type
- `value` fields use JSONPath: `$.inputs.fieldName`
- `condition` fields use JEXL: `'{{present(inputs.fieldName)}}'`
- `entrypointUrl` / `entrypointHttpMethod`: unified actions ONLY (omit for non-unified)
- `response:` block: unified actions ONLY (omit for non-unified)
- `context` field was renamed to `resources` (v2.2.0 breaking change)

### Authentication

Only two auth types exist in Falcon:

- **`custom`** — No token exchange needed (API keys, basic auth, bearer tokens passed directly)
- **`oauth2`** — Requires a token exchange flow (authorization code, client credentials, etc.)

Analyze the provider's ACTUAL auth flow, not their marketing terminology. See plugin `references/auth-patterns.md` for detailed patterns and examples.

**Decision Guide:**
- Token exchange via endpoint call? -> `oauth2`
- No token exchange? -> `custom`
- Custom headers (not Authorization)? -> `authorization.type: none` + define headers in action `args`

**Field Types:**
- `setupFields`: T1-facing (OAuth apps, multi-tenant credentials) e.g., Client ID, Client Secret, scopes
- `configFields`: T2-facing (end user credentials) e.g., API token, user-specific sub-domain
- `label`: `API Key` or `OAuth 2.0` (only add descriptive text if necessary to differentiate)

**Test Actions:** Verify credentials when user connects account
- `action`: The action ID to execute for testing
- `required`: If `true`, the test must pass for connection establishment

#### API Key Example

```yaml
authentication:
  - custom:
      type: custom
      label: API Key
      support:
        link: https://hub.stackone.com/connection-guides/ticketing/jira
        description: Admin privileges required
      authorization:
        type: basic
        username: $.credentials.email
        password: $.credentials.accessToken
      configFields:
        - key: accessToken
          label: API Token
          type: password
          required: true
          secret: true
          placeholder: ATATT3xFfGF0aQNaJZQ9JtSvQ_example
          description: Generate via Atlassian Account Settings > Security > Create and manage API tokens
          tooltip: Save securely, won't be shown again
      environments:
        - key: production
          name: Production
      testActions:
        - action: list_users
          required: true
```

#### OAuth 2.0 Examples

**Typical OAuth:** `asana`, `gmail`, `xero` (Authorization code -> Access Token -> Refresh Token)
**Complex:** `jira` (includes post-auth call)
**Client Credentials:** `greenhouse`, `globalizationpartners`, `bigchange`

**Note:** If refresh token request doesn't require authorization headers:
```yaml
authorization:
  type: none
```

### Scope Definitions

```yaml
scopeDefinitions:
  https://www.googleapis.com/auth/drive:
    description: View and manage all your Drive files
    includes: https://www.googleapis.com/auth/drive.readonly
  https://www.googleapis.com/auth/drive.readonly:
    description: View all your Drive files
```

**Rules:**
- Only include relationships explicitly documented by provider
- Read-write scope typically includes readonly version
- Broader scope typically includes narrower scopes
- Read-only scopes should NOT include write scopes

### Actions

**Required fields:**
- `actionId`: Unique action reference
- `categories`: List of categories for StackOne UI
- `actionType`: `custom` (default, non-unified) or `list|get|create|update|delete` (unified only)
- `label`: Human-readable name
- `description`: Short description (shown in UI)
- `details`: Longer description (tool description)
- `resources`: Action-specific documentation URLs
- `steps`: List of step functions
- `result`: Final action output

**Optional fields:**
- `inputs`: Request parameters (path, query, body)
- `requiredScopes`: (Mandatory if provider uses scopes) Space-separated OAuth scopes (must be in `scopeDefinitions`). Use most restrictive scope that allows the action to work.
- `entrypointUrl`/`entrypointHttpMethod`: Only for unified actions (DO NOT USE for non-unified)

### Inputs

For non-unified actions: inputs must match exactly the provider's request parameters.
DO NOT CREATE INPUTS THAT DO NOT EXIST IN THE PROVIDER API.
Ignore deprecated actions/fields/inputs.

Reference with JSONPath: `$.inputs.fieldName` (preferred) or JEXL `'{{inputs.fieldName}}'` for conditional logic/string construction.

**Types:** `string`, `number`, `boolean`, `datetime_string`, `object`, `enum`
**Never use `type: array`** - always use `array: true` with element type

**Object type:**
```yaml
inputs:
  - name: items
    description: Item object
    type: object
    in: body
    required: true
    properties:
      - name: name
        description: Name of item
        type: string
        required: false
```

**Array fields:**
```yaml
inputs:
  - name: userIds
    description: Array of user IDs
    type: string  # Element type
    array: true
    in: body
    required: true
```

**Enum fields:**
```yaml
inputs:
  - name: status
    description: Employment status
    type: enum
    required: true
    in: query
    oneOf:
      values:
        - active
        - inactive
        - terminated
```

### Field Configs (Unified Actions Only)

**NOTE: `fieldConfigs` are NOT required for non-unified connectors!**

Maps provider response to StackOne unified response:

```yaml
fieldConfigs:
  - targetFieldKey: id
    expression: $.accountId
    type: string
  - targetFieldKey: type
    expression: $.accountType
    type: enum
    enumMapper:
      matcher:
        - matchExpression: '{{$.accountType == "atlassian"}}'
          value: agent
        - matchExpression: '{{$.accountType == "app"}}'
          value: bot
  - targetFieldKey: active
    expression: $.active
    type: boolean
```

### Steps

Every step must have a `description` field.
Custom authentication headers must be in `args` of every action's request step.

```yaml
steps:
  - stepId: list_users
    description: List users
    stepFunction:
      functionName: request
      parameters:
        url: '/users'
        method: get
        args:
          - name: showInactive
            value: $.inputs.showInactive
            in: body
            condition: '{{present(inputs.showInactive)}}'
          - name: accept
            value: application/json
            in: headers
```

### Step Functions

Defined in `packages/core/src/stepFunctions/stepFunctionsList.ts`.

#### Request

**Always use `args` for parameters (never direct `body` field).**

**IMPORTANT:**
- **For `value` fields**: Use JSONPath `value: $.inputs.fieldName`
- **For `condition` fields**: Use JEXL `condition: "{{present(inputs.fieldName)}}"`
- **Never use JEXL `'{{inputs.fieldName}}'` for `value` fields**

```yaml
stepFunction:
  functionName: request
  parameters:
    url: '/users'
    method: post
    args:
      - name: email
        value: $.inputs.email
        in: body
      - name: phone
        value: $.inputs.phone
        in: body
        condition: '{{present(inputs.phone)}}'
    customErrors:  # Optional error remapping
      - receivedStatus: 404
        targetStatus: 400
        message: 'Custom error message'
```

**Raw Array Bodies:**
When API requires raw JSON array `[...]` (not wrapped in object), use `spread: true`:

```yaml
args:
  - name: events
    value: $.inputs.events
    in: body
    spread: true  # Sends [{...}, {...}] instead of {"events": [...]}
```

**Note:** `response:` is ONLY for unified actions. DO NOT USE FOR NON-UNIFIED ACTIONS.

#### Paginated Request

**Only use if provider supports cursor-based pagination. Otherwise use `request`.**

```yaml
stepFunction:
  functionName: paginated_request
  parameters:
    url: "/application.list"
    method: post
    response:
      dataKey: results
      nextKey: nextCursor  # Field containing next cursor
    iterator:
      key: cursor          # How cursor is mapped into request
      in: body
```

#### SOAP Request

**Key parameters:**
- `soapOperation` - SOAP operation name
- `soapAction` - SOAP action URI (usually namespace + operation name)
- `namespaces` - XML namespace definitions
- `args` - Arguments in SOAP request body
- `useSoapContext` - Set to `false` when provider expects payload as-is

**Important:**
- Use string interpolation (`${inputs.fieldName}`) for dynamic values
- Prefix XML attributes with `@_` (e.g., `@_xsi:type`) to render as attributes not child nodes
- Keep credential blocks inside request payload if provider requires them on every call

```yaml
stepFunction:
  functionName: soap_request
  parameters:
    url: /EmployeeService
    method: post
    soapOperation: GetEmployee
    soapAction: http://example.com/soap/GetEmployee
    useSoapContext: false
    namespaces:
      - namespaceIdentifier: emp
        namespace: http://example.com/employees
    args:
      - name: EmployeeId
        value: ${inputs.employee_id}
        in: body
```

#### Other Step Functions

- `group_data`: Groups data from multiple steps
- `map_fields`: Maps using `fieldConfigs` (non-unified actions don't need this)
- `typecast`: Applies types from `fieldConfigs` (non-unified actions don't need this)

### Expression Formats

**1. JSONPath (`$.path.to.field`) - PREFERRED**

For direct references (no string construction):
- Credentials: `token: $.credentials.apiKey`
- Inputs: `value: $.inputs.userId`
- Step output: `dataSource: $.steps.fetch_users.output.data`

**2. String Interpolation (`${...}`)**

For embedding dynamic values within strings:
- URLs: `url: /users/${inputs.id}`
- Multiple segments: `url: /users/${inputs.userId}/posts/${inputs.postId}`
- Domains: `baseUrl: https://${credentials.domain}.api.com`

**3. JEXL Expressions (`'{{...}}'`)**

**ONLY USE JEXL EXPRESSIONS DEFINED IN THE EXPRESSIONS PACKAGE.**

Full reference (operators, functions, examples): `node_modules/@stackone/expressions/README.md`

For conditional logic, transformations, complex expressions (wrap in single quotes):

```yaml
condition: '{{present(inputs.includeInactive)}}'
value: '{{inputs.name.toUpperCase()}}'
value: '{{$.status == "active" ? "enabled" : "disabled"}}'
value: '{{$.count > 0 ? $.count : "none"}}'
```

**When to use JEXL:**
- Conditional logic in `condition` fields
- Enum matching with `matchExpression`
- String transformations, math, ternary operators

### GraphQL API Best Practices

Reference: `linear` connector

#### Input Structure

Always use nested `variables` object:

```yaml
inputs:
  - name: variables
    description: Variables for the query
    type: object
    in: body
    properties:
      - name: first
        description: Number of items to forward paginate
        type: number
        required: false
      - name: filter
        description: Filter object
        type: object
        required: false
```

#### Request Configuration

```yaml
steps:
  - stepId: fetch_resource
    description: Query resource from GraphQL API
    stepFunction:
      functionName: request
      parameters:
        url: "/graphql"
        method: post
        args:
          - name: Content-Type
            value: application/json
            in: headers
          - name: query
            value: "query($first: Int, $filter: FilterType) { resources(first: $first, filter: $filter) { nodes { id name } } }"
            in: body
          - name: variables
            in: body
            condition: "{{present(inputs.variables)}}"
            value:
              {
                first: $.inputs.variables.first,
                filter: $.inputs.variables.filter
              }
```

#### Nested Objects in Queries

**IMPORTANT: When querying nested objects, ONLY return the `id` field if a separate action exists to fetch the full object.**

Applies to both GraphQL and REST APIs.

**Correct:**
```yaml
# If get_user action exists, only return id in nested user objects
value: "query($id: String!) { issue(id: $id) { id title assignee { id } creator { id } team { id } } }"
```

**Incorrect:**
```yaml
# Don't return full nested objects if separate actions exist
value: "query($id: String!) { issue(id: $id) { id title assignee { id name email } creator { id name email } team { id name } } }"
```

#### Query String Format

**List/Query Actions:**
```yaml
value: "query($first: Int, $after: String, $filter: ResourceFilter) { resources(first: $first, after: $after, filter: $filter) { nodes { id name } pageInfo { hasNextPage endCursor } } }"
```

**Get Actions:**
```yaml
value: "query($id: String!) { resource(id: $id) { id name description } }"
```

**Mutation Actions:**
```yaml
value: "mutation($input: ResourceCreateInput!) { resourceCreate(input: $input) { success resource { id name } } }"
```

**Update Mutations:**
```yaml
value: "mutation($id: String!, $input: ResourceUpdateInput!) { resourceUpdate(id: $id, input: $input) { success resource { id name } } }"
```

#### Mutation Input Objects

For mutations with input objects, nest the input structure:

```yaml
- name: variables
  value:
    {
      id: $.inputs.id,
      input:
        {
          title: $.inputs.variables.title,
          description: $.inputs.variables.description,
          assigneeId: $.inputs.variables.assigneeId
        }
    }
  in: body
```

### Result

```yaml
# Read response
result:
  data: $.steps.step_id.output.data

# Write response
result:
  message: Resource updated successfully
  data:
    id: $.inputs.id  # Use JSONPath for direct references
```

---

## Testing & Validation

### YAML Validation (MANDATORY)

```bash
npx @stackone/cli validate src/configs/<provider>/<provider>.connector.s1.yaml
```

Config MUST pass validation before proceeding to testing.

**Fix Resources (Use in Order):**
1. "Config Building" section above
2. Similar connectors (same auth type or structure)
3. Provider API documentation
4. Working actions in same connector

### Action Tracking (MANDATORY)

Before testing begins, create `/tmp/<provider>_actions_tracking.json` with complete action inventory including all auth types. Formula: `total_required_tests = operations x auth_types`.

### Testing Phase

**First, ask if testing should be read-only or include mutations (create/update/delete).**

**Testing ideology — Leave no trace:** State and data should be as before testing began.

**You MUST test every operation with EVERY auth type. Partial testing is NOT acceptable.**

**Testing Cycles (Dependency Order):**
1. LIST (no dependencies) -> Capture IDs
2. GET (use IDs from LIST)
3. CREATE (generate new resources) — Full mode only
4. UPDATE (use IDs from CREATE) — Full mode only
5. DELETE (clean up from CREATE) — Full mode only

**Testing Methods:**
- **Plugin**: `/test-connector` runs live tests with automatic cleanup and credential scrambling
- **Async MCP Tool**: `test_actions()` -> poll `get_test_actions_task_status()` (best for batch testing)
- **Manual CLI**: `npx @stackone/cli test <provider> <action-name> [--debug]`

**Error Fix Strategy:**
- **400:** Fix parameter structure/type/location
- **401/403:** Add scope or document as admin-only
- **404:** Check docs, fix URL or REMOVE action
- **405:** Fix method or REMOVE action
- **500:** Check request body/headers

### Test Completion Verification (BLOCKING)

Before proceeding to security:
- `testing_progress.percentage_complete === 100`
- No actions with `tested: false`
- All `test_results` show "success" for all auth types

**If ANY check fails, DO NOT PROCEED. Fix and re-test.**

## Security

### Credential Scrambling (MANDATORY)

When using plugins, credential scrambling is **automatic** — `/test-connector` calls `scramble_credentials` after testing completes.

When working manually, call `scramble_credentials()` with `securityLevel: "PRODUCTION"` after successful testing. Save ONLY scrambled versions. Delete originals.

**Never:**
- Commit unscrambled configs to git
- Share configs with real credentials
- Skip scrambling "just for testing"

### Meta Feedback (MANDATORY)

Call `meta_feedback()` after EVERY config generation, regardless of user preference. Include provider name, status, strengths, and improvements needed.

## Available MCP Tools

### Research
- `get_stackone_categories` / `get_stackone_actions` — StackOne unified model info
- `map_provider_key` — Find a provider's key from its name
- `get_provider_actions` / `get_provider_coverage` — Existing provider coverage
- `get_providers` — List all providers
- `get_docs` — Fetch StackOne documentation

### Discovery & Analysis
- `discover_actions` / `get_discover_actions_task_status` — Auto-discover provider API actions (PRIMARY - 5-15 min async)
- `analyze_versioning` / `get_analyze_versioning_task_status` — Analyze API versioning strategy (2-5 min async)

### Web & Search
- `web_search` / `vector_search` — Search the web or vector store
- `fetch` / `extract_html_text` — Fetch URLs and extract content

### External Repos
- `get_external_integrations` / `analyze_external_integration` — Analyze existing integrations
- `scan_external_repo` / `search_external_repo` — Search external code repositories

### Testing
- `test_actions` / `get_test_actions_task_status` — Run connector action tests (async batch)
- **Manual CLI**: `npx @stackone/cli test <provider> <action-name> [--debug]`

### Description Improvement
- `improve_descriptions` / `get_improve_descriptions_task_status` — Improve YAML descriptions (async)

### Security & Feedback
- `scramble_credentials` — Scramble stored credentials after use (MANDATORY)
- `meta_feedback` — Submit feedback for tracking (MANDATORY)

### CLI
- `npx @stackone/cli validate <config_file>` — Validate YAML syntax and structure
- `npx @stackone/cli test <provider> <action-name>` — Test a single action live
- `npx @stackone/cli pull <provider>` — Pull existing connector from StackOne index
- `npx @stackone/cli scaffold <provider>` — Create blank connector template
- `npx @stackone/cli list` — List available connectors in StackOne index

## Boundaries

**Always:**
- Use plugin workflows when available (`/build-connector` or `/build-unified-connector`)
- When working manually, follow the 11-step workflow in exact order
- Test every operation with EVERY auth type
- Validate YAML before testing
- Scramble credentials before storage (automatic via plugins, manual otherwise)
- Send meta feedback

**Ask First:**
- Skipping workflow steps
- Using untested operations
- Storing unscrambled credentials
- Proceeding with partial test coverage

**Never:**
- Skip testing any auth type
- Proceed without full test coverage
- Skip `discover_actions` for research
- Skip `scramble_credentials` (unless using plugins, which do it automatically)
- Skip `meta_feedback`
- Commit plaintext credentials
- Ignore validation errors
