---
name: Falcon Connector Build
trigger: build connector|create falcon config|new connector|build.*integration
description: Complete 11-step workflow for building production-ready Falcon API connector configurations with autonomous research, version validation, and comprehensive testing.
---

# Falcon Connector Build Skill

**When to use**: User asks to "build connector for [provider]", "create Falcon config for [provider]", "new connector", "build [provider] integration"

**Workflow**: Complete end-to-end workflow for building production-ready Falcon API connector configurations.

## Prerequisites

- Provider name/API identified
- StackOne CLI installed (`@stackone/cli`)
- Access to provider API documentation

## 🔴 11-Step Critical Workflow (STRICT ORDER)

**❌ Skip/Disorder = Incomplete Task / Professional Failure**

### Step 1: Research Phase (PARALLEL)

Launch parallel research to maximize efficiency.

#### A. Launch Action Discovery Subagent (Async - 5-15 min)

```typescript
// Check S3 first
map_provider_key("provider_name") → Get exact provider key
get_provider_actions("provider_key") → Check for indexed data

// If no data, launch autonomous discovery
discover_actions({
  provider: "provider_name",
  maxIterations: 30
}) → { taskId: "rpc_xxx", ... }

// Returns immediately, runs in background
```

#### B. While Waiting, Research in Parallel (Minutes 0-5)

**Reference Existing Connectors**:
- Read similar connector in `src/configs/` (same category or auth type)
- Understand YAML structure patterns

**StackOne Context**:
```typescript
get_stackone_categories() → Available categories (hris, ats, crm, etc.)
get_stackone_actions(category) → Unified operations
```

**Authentication Research**:
```typescript
vector_search("authentication", provider, 5) → Provider auth methods
web_search("provider authentication API") → Additional details
```

**Documentation & Coverage**:
```typescript
get_provider_coverage(provider) → Current StackOne coverage
fetch(url) → Get OpenAPI specs, documentation URLs
extract_oas_actions(oasContent) → Parse large OpenAPI specs
```

**External Repository Analysis**:
```typescript
get_external_integrations(provider) → Find external integrations
analyze_external_integration(integration, provider) → Deep dive
get_external_repos() → Curated open-source examples
scan_external_repo(url, terms) → Deep repository search
```

#### C. Poll Action Discovery (Minutes 5-15)

```typescript
// Poll every 60-90 seconds
get_discover_actions_task_status(taskId, provider)
// Status: "pending" → "running" → "complete"

// Extract results when complete (~100 discovered actions)
```

**Key Benefits**:
- Autonomous: 20+ tool calls without intervention
- Comprehensive: Exhaustive research across API docs
- Async: Works in background
- Persistent: Results auto-saved to S3

### Step 2: Synchronization

Collect and integrate all research results:
- Discovered actions from subagent
- StackOne operations
- External repo patterns
- Authentication patterns
- API documentation insights

### Step 3: Version Validation

**CRITICAL**: Validate API versions to detect conflicts.

```typescript
// Extract endpoints from discovered actions
const endpoints = discoveredActions.map(a => a.endpoints[0]);

// Launch versioning analysis (2-5 minutes)
analyze_versioning({
  provider: "provider_name",
  endpoints: endpoints,
  maxIterations: 5
}) → { taskId: "rpc_xxx", ... }

// Poll for status
get_analyze_versioning_task_status(taskId, provider)
// Result: Version analysis with conflicts, migrations, recommendations
```

**Validation Checklist**:
- [ ] Endpoints extracted from discovered actions
- [ ] Version analysis complete with recommendations
- [ ] Breaking changes and conflicts reviewed
- [ ] Recommended version identified for each endpoint
- [ ] Migration steps documented for deprecated endpoints

### Step 4: Config Building

#### File Structure (MANDATORY: Use Partials)

```
src/configs/{provider-name}/
├── {provider-name}.connector.s1.yaml              # Main: info, auth, $refs only
└── {provider-name}.{resource}.s1.partial.yaml     # Actions grouped by resource
```

#### Main File Structure

```yaml
StackOne: 1.0.0
info:
  title: Provider
  key: provider
  version: 1.0.0
  assets:
    icon: https://stackone-logos.com/api/provider_name/filled/png
  description: Brief description

baseUrl: https://api.provider.com

rateLimit:
  mainRatelimit: 10

resources: https://api.provider.com/docs

authentication:
  - oauth2: ...  # OR custom:

actions:
  $ref: provider.tasks
  $ref: provider.users
  $ref: provider.webhooks
```

#### Partial File Structure

**⚠️ CRITICAL**: Partial files start with `-` (array items), NOT `actions:` key

```yaml
# provider.tasks.s1.partial.yaml
- actionId: list_tasks
  label: List Tasks
  description: Get list of all tasks
  details: Retrieves paginated list of tasks with filtering options
  categories:
    - project_management
  actionType: custom  # Default for non-unified
  resources: https://api.provider.com/docs/tasks/list
  inputs:
    - name: limit
      description: Maximum number of tasks to return
      type: number
      in: query
      required: false
  steps:
    - stepId: fetch_tasks
      description: Fetch tasks from API
      stepFunction:
        functionName: request
        parameters:
          url: /tasks
          method: get
          args:
            - name: limit
              value: $.inputs.limit
              in: query
              condition: "{{present(inputs.limit)}}"
  result:
    data: $.steps.fetch_tasks.output.data
```

#### Configuration Requirements

- Map ALL actions discovered through `discover_actions`
- Use version-validated endpoints from `analyze_versioning()`
- Include comprehensive CRUD operations
- Add error handling and rate limiting
- Use proper credential templating: `$.credentials.field`
- Clear descriptions (1-2 sentences) for connector, operations, steps, fields

**Default**: Build NON-UNIFIED actions (`actionType: custom`) unless explicitly told otherwise.

**Ignore**: Deprecated actions, deprecated fields, deprecated inputs.

**Quick Tip**: For WIP connectors, use `improve_descriptions` subagent after building.

### Step 5: YAML Validation (MANDATORY)

```bash
stackone validate src/configs/<provider>/<provider>.connector.s1.yaml
```

**MUST pass before proceeding to testing.**

### Step 6: Coverage Validation

```typescript
check_all_endpoints(discoveredActions, stackOneOperations, config)
// Must achieve ≥80% coverage before testing
```

### Step 7: Action Tracking Setup (MANDATORY)

**See Falcon Connector Testing Skill** for complete workflow.

**Summary**: Create `/tmp/<provider>_actions_tracking.json` with:
- All operations listed
- All auth types identified
- Total required tests calculated: `operations × auth_types`
- Initial `tested: false` for all actions

### Step 8: Testing Phase (MANDATORY)

**See Falcon Connector Testing Skill** for complete workflow.

**Summary**: Test EVERY operation with EVERY auth type:
1. Use `test_actions()` tool (batch) or `stackone run` CLI (individual)
2. Test each operation with ALL auth types provider supports
3. Update tracking file after EACH test
4. Fix failures immediately
5. Continue until 100% success

### Step 9: Test Completion Verification

```typescript
check_test_completion(allOperations, testedOperations)
// Must achieve 100% before proceeding

// ADDITIONALLY verify tracking file:
cat /tmp/<provider>_actions_tracking.json | jq '.testing_progress.percentage_complete'
// MUST return: 100
```

### Step 10: Security (MANDATORY BEFORE STORAGE)

```typescript
scramble_credentials({
  config: validatedConfigJson,
  credentials: testCredentialsJson,
  securityLevel: "PRODUCTION"
})

// Save ONLY scrambled versions:
// - config: result.scrambledConfig
// - credentials: result.scrambledCredentials
// - metadata: result.detectedFields & warnings
```

**Security Checklist**:
- [ ] All credential patterns detected
- [ ] No warnings about missed fields
- [ ] PRODUCTION security level chosen
- [ ] Custom patterns added for provider-specific formats
- [ ] Scrambled output verified (no plaintext)
- [ ] Original unscrambled configs deleted

**⚠️ NEVER**:
- Commit unscrambled configs to git
- Share configs with real credentials
- Skip scrambling "just for testing"
- Use DEBUG preset in production
- Ignore warnings about undetected secrets

### Step 11: Meta Feedback (MANDATORY)

```typescript
meta_feedback(feedback, tool_names)
```

**CRITICAL**: Call AFTER EVERY config generation completion, regardless of user preference.

**Required Format**:
```
Provider: [provider_name]
Status: [completed/failed/partial]

STRENGTHS:
- [What worked well]

IMPROVEMENTS NEEDED:
- [Issues that need fixing]
```

**Requirements**:
- [ ] Always call - No exceptions
- [ ] Include both positive AND negative feedback

## Core Principles

- **MAXIMUM COVERAGE**: Discover and include ALL useful actions
- **ACTION-FOCUSED**: What actions would developers commonly perform?
- **CUSTOMER VALUE**: Prioritize operations that solve real problems
- **MORE IS BETTER**: Default to comprehensiveness over minimalism
- **PRACTICAL UTILITY**: Focus on operations developers use in production

## Success Criteria Checklist

**Research & Discovery**:
- [ ] All useful actions discovered via `discover_actions` subagent
- [ ] StackOne operations catalogued via `get_stackone_actions()`
- [ ] External repos analyzed (≥2-3)
- [ ] API versions validated via `analyze_versioning()` subagent

**Configuration**:
- [ ] All discovered actions mapped with correct versions
- [ ] Partial files created (one per resource)
- [ ] Context docs with live, action-specific links
- [ ] YAML validation passed

**Action Tracking** (See Testing Skill):
- [ ] Action tracking file created
- [ ] All operations listed
- [ ] All auth types identified
- [ ] Total required tests calculated

**Testing** (See Testing Skill):
- [ ] Every operation tested with EVERY auth type
- [ ] Tracking file updated after each test
- [ ] All `test_results` show "success"
- [ ] `testing_progress.percentage_complete === 100`
- [ ] Coverage ≥80% via `check_all_endpoints()`
- [ ] 100% test completion via `check_test_completion()`

**Security & Feedback**:
- [ ] Credentials scrambled via `scramble_credentials()`
- [ ] Meta feedback sent via `meta_feedback()`

**Final Verification**:
- [ ] Read tracking file, confirm 100% completion
- [ ] Confirm zero failed tests
- [ ] Confirm all auth types tested for all operations

## Boundaries

**✅ Always**:
- Follow 11-step workflow in exact order
- Create action tracking file before testing
- Test every operation with EVERY auth type
- Update tracking file after each test
- Verify 100% completion against tracking file
- Validate YAML before testing
- Scramble credentials before storage
- Send meta feedback

**⚠️ Ask First**:
- Skipping workflow steps
- Using untested operations
- Storing unscrambled credentials
- Proceeding with partial test coverage

**🚫 Never**:
- Skip action tracking file creation
- Skip testing any auth type
- Test only one auth type when multiple exist
- Skip tracking file updates during testing
- Proceed without 100% test coverage verified
- Skip discover_actions for research
- Skip analyze_versioning for version conflicts
- Skip scramble_credentials
- Skip meta_feedback
- Commit plaintext credentials
- Ignore validation errors

## Success Formula

**Autonomous Discovery + Version Validation + Maximum Coverage + Complete Multi-Auth Testing + Tracking Verification + Security = Customer Value**

**Testing Formula**: `Success = (operations × auth_types) tests completed at 100%`

## Available Tools

**Core Research**:
- `get_stackone_categories()`, `get_stackone_actions(category)`
- `get_docs()`, `map_provider_key(provider)`, `get_providers()`
- `get_provider_coverage(provider)`

**Action Discovery (PRIMARY)**:
- `discover_actions(provider, apiVersion?, maxIterations?)`
- `get_discover_actions_task_status(taskId, provider)`
- `get_provider_actions(provider)`

**API Versioning**:
- `analyze_versioning(provider, endpoints?, maxIterations?)`
- `get_analyze_versioning_task_status(taskId, provider)`

**Web Search**:
- `web_search(query)`, `vector_search(query, provider, k)`
- `fetch(url, headers?, extractText?)`, `extract_html_text(html)`

**External Repository Analysis**:
- `get_external_integrations(provider, count?)`
- `analyze_external_integration(integration, provider)`
- `get_external_repos()`, `scan_external_repo(url, terms, options?)`

**Configuration & Templates**:
- `get_stackone_expressions()`
- `extract_oas_actions(oasContent, hasBeenTruncated, ...)`

**Testing & Validation** (See Testing Skill):
- `test_actions(config, maxIterations?, maxDurationMs?)`
- `get_test_actions_task_status(taskId, provider)`
- `check_all_endpoints(...)`, `check_test_completion(...)`

**Description Improvement**:
- `improve_descriptions(config, maxIterations?)`
- `get_improve_descriptions_task_status(taskId, provider)`

**Security (MANDATORY)**:
- `scramble_credentials(config?, credentials?, securityLevel, customPatterns?)`

**Meta Feedback (MANDATORY)**:
- `meta_feedback(feedback, tool_names)`

**CLI Validation**:
- `stackone validate <config_file>`
- `stackone run --connector <file> --account <file> --credentials <file> --action-id <name> [--params <file>] [--debug]`
