# Falcon Connector Template

A YAML-based framework for building API connector configurations using the Falcon engine. Connectors define how StackOne communicates with third-party provider APIs.

## Available Plugins

Two plugins are available depending on the connector type:

- **`stackone-connector-builder`** — invoke with `/build-connector` — for generic (non-unified) connectors that return raw provider responses as-is
- **`stackone-unified-builder`** — invoke with `/build-unified-connector` — for connectors that map provider data to StackOne unified schemas (HRIS, ATS, CRM, etc.)

Each plugin has detailed reference files in its `references/` directory covering auth patterns, step functions, expressions, and YAML structure.

## Legacy Skills

Detailed step-by-step skills also exist in `.claude/skills/` for manual workflows. These are supplementary to the plugins above.

### Falcon Connector Build Skill

**When to use**: User asks to "build connector for [provider]", "create Falcon config for [provider]", "new connector"

**Location**: `.claude/skills/falcon-connector-build.md`

**Summary**: Complete 11-step workflow for building production-ready Falcon API connector configurations:
1. Research Phase (parallel action discovery + auth/docs/repos)
2. Synchronization
3. Version Validation
4. Config Building (YAML with partials)
5. YAML Validation
6. Coverage Validation (≥80%)
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
- Cycle-based testing (LIST → GET → CREATE → UPDATE → DELETE)
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

For building connectors that map provider data to **customer-defined schemas** with unified pagination:

- **Build**: `.claude/skills/unified-connector-build.md` — Schema-first workflow with `fieldConfigs` and unified pagination
- **Field Mapping**: `.claude/skills/unified-field-mapping.md` — `fieldConfigs`, `enumMapper`, nested objects, JEXL transforms
- **Scope Decisions**: `.claude/skills/unified-scope-decisions.md` — Endpoint selection and scope trade-off analysis
- **Testing**: `.claude/skills/unified-connector-testing.md` — Field mapping validation, pagination testing, schema completeness

## Core Principles

- **MAXIMUM COVERAGE**: Discover and implement ALL useful actions the provider API offers
- **ACTION-FOCUSED**: Prioritize operations that solve real business problems
- **DEFAULT TO NON-UNIFIED**: Unless explicitly requested, use `actionType: custom`
- **PRACTICAL UTILITY**: Focus on production-ready operations; ignore deprecated/internal endpoints
- **LEAVE NO TRACE**: Clean up test data after testing; scramble credentials when done

## Critical Workflow (STRICT ORDER)

Follow this **exact sequence** when building Falcon API configurations:

1. **Research Phase (PARALLEL)** → Launch `discover_actions` subagent + main agent for auth/docs/external repos
2. **Synchronization** → Collect and integrate subagent results
3. **Version Validation** → `analyze_versioning()` → Detect/resolve API version conflicts
4. **Config Building** → Create comprehensive YAML with all discovered operations
5. **YAML Validation** → `stackone validate src/configs/<provider>/<provider>.connector.s1.yaml`
6. **Coverage Validation** → Confirm ≥80% coverage
7. **Action Tracking Setup** → **MANDATORY** - Save action inventory to `/tmp/<provider>_actions_tracking.json`
8. **Testing Phase** → `test_actions()` → Test EVERY operation with real API calls for EVERY auth type
9. **Test Completion Verification** → Verify 100% coverage
10. **Security** → `scramble_credentials()` → Secure all credentials
11. **Meta Feedback** → `meta_feedback()` → **MANDATORY** - Send feedback for tracking

**Skip/Disorder = Incomplete Task**

## File Structure

Always use the **partials approach** — never monolithic files.

```
src/configs/{provider}/
  {provider}.connector.s1.yaml          # Main connector config (auth, metadata)
  {provider}.{resource}.s1.partial.yaml  # One partial per resource/domain
```

- Folder names: **lowercase, no hyphens** (e.g., `smartrecruiters/`)
- Partial files start directly with `- actionId:` — NO `actions:` wrapper

## Key Rules

- **camelCase** for ALL config field names (`scopeDefinitions`, NOT `scope_definitions`)
- Never use `:` in YAML string values — use parentheses or rephrase instead
- **2-space indentation**, no tabs
- Never use `type: array` — use `array: true` alongside the element type
- `value` fields use JSONPath: `$.inputs.fieldName`
- `condition` fields use JEXL: `'{{present(inputs.fieldName)}}'`
- `entrypointUrl` / `entrypointHttpMethod`: unified actions ONLY (omit for non-unified)
- `response:` block: unified actions ONLY (omit for non-unified)
- `context` field was renamed to `resources` (v2.2.0 breaking change)

## Authentication

Only two auth types exist in Falcon:

- **`custom`** — No token exchange needed (API keys, basic auth, bearer tokens passed directly)
- **`oauth2`** — Requires a token exchange flow (authorization code, client credentials, etc.)

Analyze the provider's ACTUAL auth flow, not their marketing terminology. See plugin `references/auth-patterns.md` for detailed patterns and examples.

**Decision Guide:**
- Token exchange via endpoint call? → `oauth2`
- No token exchange? → `custom`
- Custom headers (not Authorization)? → `authorization.type: none` + define headers in action `args`

**Field Types:**
- `setupFields`: T1-facing (OAuth apps, multi-tenant credentials)
- `configFields`: T2-facing (end user credentials)

## Testing & Validation

### YAML Validation (MANDATORY)

```bash
npm install -g @stackone/cli
stackone validate [pathToYaml]
```

Config MUST pass validation before proceeding to testing.

### Action Tracking (MANDATORY)

Before testing begins, create `/tmp/<provider>_actions_tracking.json` with complete action inventory including all auth types. Formula: `total_required_tests = operations × auth_types`.

### Testing Phase

**First, ask if testing should be read-only or include mutations (create/update/delete).**

**Testing ideology — Leave no trace:** State and data should be as before testing began.

**You MUST test every operation with EVERY auth type. Partial testing is NOT acceptable.**

**Testing Cycles (Dependency Order):**
1. LIST (no dependencies) → Capture IDs
2. GET (use IDs from LIST)
3. CREATE (generate new resources) — Full mode only
4. UPDATE (use IDs from CREATE) — Full mode only
5. DELETE (clean up from CREATE) — Full mode only

**Testing Methods:**
- **Async Tool**: `test_actions()` → poll `get_test_actions_task_status()` (best for batch testing)
- **Manual CLI**: `stackone run --connector <file> --account <file> --credentials <file> --action-id <name> [--params <file>] [--debug]`

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

After successful testing, call `scramble_credentials()` with `securityLevel: "PRODUCTION"`. Save ONLY scrambled versions. Delete originals.

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
- **Manual CLI**: `stackone run --connector <file> --account <file> --credentials <file> --action-id <name> [--params <file>] [--debug]`

### Description Improvement
- `improve_descriptions` / `get_improve_descriptions_task_status` — Improve YAML descriptions (async)

### Security & Feedback
- `scramble_credentials` — Scramble stored credentials after use (MANDATORY)
- `meta_feedback` — Submit feedback for tracking (MANDATORY)

### CLI Validation
- `stackone validate <config_file>` — Validate YAML syntax and structure

## Boundaries

**Always:**
- Follow the 11-step Critical Workflow in exact order
- Create action tracking file before testing
- Test every operation with EVERY auth type
- Validate YAML before testing
- Scramble credentials before storage
- Send meta feedback

**Ask First:**
- Skipping workflow steps
- Using untested operations
- Storing unscrambled credentials
- Proceeding with partial test coverage

**Never:**
- Skip action tracking file creation
- Skip testing any auth type
- Proceed without 100% test coverage
- Skip `discover_actions` for research
- Skip `scramble_credentials`
- Skip `meta_feedback`
- Commit plaintext credentials
- Ignore validation errors
