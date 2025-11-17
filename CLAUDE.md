# 🚀 FALCON API CONFIG BUILDER

This document provides the complete methodology for building Falcon API configurations with Claude. Follow this strict workflow to ensure comprehensive, tested, and customer-valuable integrations.

## 🔴 CRITICAL WORKFLOW (STRICT ORDER)

When asked to build Falcon API configurations, you MUST follow this exact sequence:

1. **Research Phase (PARALLEL EXECUTION)** → Launch `discover_actions` subagent for action discovery + main agent for auth/docs/external repos
2. **Synchronization** → Collect and integrate subagent results
3. **Version Validation** → `analyze_versioning()` → Detect and resolve API version conflicts for discovered endpoints
4. **Config Building** → Create comprehensive configuration with all discovered actions
5. **YAML Validation** → `stackone validate src/configs/<provider>.yaml` → Ensure valid YAML syntax
6. **Coverage Validation** → `check_all_endpoints()` → Confirm endpoint coverage ≥80%
7. **Testing Phase** → `stackone run` → Test EVERY action with real API calls
8. **Test Completion** → `check_test_completion()` → Verify 100% actions tested
9. **Security** → `scramble_credentials()` → Secure all sensitive data before storage
10. **Meta Feedback** → `meta_feedback()` → **MANDATORY** - Send feedback to third-party system for tracking

**❌ Skip/Disorder = Incomplete Task / Professional Failure**

## 🎯 CORE PRINCIPLES

- **MAXIMUM COVERAGE**: Discover and include ALL useful actions that provide customer value
- **ACTION-FOCUSED**: Think: "what actions would developers commonly perform with this provider?"
- **CUSTOMER VALUE**: Prioritize actions that solve real business problems
- **MORE IS BETTER**: Default to comprehensiveness over minimalism
- **PRACTICAL UTILITY**: Focus on operations developers actually use in production

## 🆕 BREAKING CHANGES (v2.2.0)

### 1. Renamed: `context` → `resources` (BREAKING)

**IMPORTANT**: The `context` field has been renamed to `resources`. Update all connectors accordingly.

```yaml
# ❌ OLD (no longer supported)
context:
  user_id: "123"

# ✅ NEW (required)
resources:
  user_id: "123"
```

### 2. New: `details` Field (Optional)

Add extended documentation beyond basic descriptions for both connectors and actions.

```yaml
connector:
  name: my-connector
  description: Brief description
  details: |
    Extended information about this connector,
    special considerations, limitations, etc.

actions:
  - id: get_users
    description: Fetch users
    details: |
      Additional context about this action,
      rate limits, required permissions, etc.
```

### 3. New: `examples` Field (Optional)

Demonstrate action usage with real input/output data.

```yaml
actions:
  - id: get_user
    description: Get user by ID
    examples:
      - input: { user_id: "123" }
        output: { name: "John Doe", email: "john@example.com" }
```

## 📚 PREREQUISITE DOCUMENTATION

**Before starting, read these files for complete setup and reference information:**

1. **YAML Structure & Connector Building**: Read `src/configs/README.md`

   - Complete YAML structure documentation
   - Authentication patterns (OAuth, API Key, Custom)
   - Operations structure and step functions
   - Field configs and type mappings

2. **Contribution Guidelines**: Read `README.md`
   - Git branching strategy and commit format
   - Git hooks and automated workflows

## 🔍 RESEARCH PHASE

### 🚀 Action Discovery Strategy

**First, check if provider actions exist in S3:**

```
1. map_provider_key("provider_name") → Get exact provider key
2. get_provider_actions("provider_key") → Check S3 for existing indexed data
```

**If comprehensive data returned** → Use it immediately, proceed to Authentication Research

**If NO data or suggestion to use discover_actions** → Launch autonomous subagent for deep research:

```typescript
// Launch the discover_actions subagent
discover_actions({
  provider: "provider_name",
  maxIterations: 30
})
→ Returns taskId immediately (< 1 second)
→ Agent works autonomously in background (5-15 minutes)
→ Performs 20+ tool calls for comprehensive research
→ Auto-saves results to S3 when complete
```

**Important:** The `get_provider_actions()` tool does NOT perform web searches. It only:

- Returns indexed S3 data if available
- Suggests using `discover_actions` subagent if no data exists
- Provides workflow instructions for autonomous discovery

### 🚀 Parallel Execution Strategy

**Launch discover_actions early, continue with other research:**

1. **Minute 0:** Launch `discover_actions(provider)` → Get taskId
2. **Minutes 0-5:** Complete Steps 0-4 (reference connectors, StackOne context, auth, docs, external repos)
3. **Minutes 5-15:** Poll `get_discover_actions_task_status(taskId, provider)` every 60-90 seconds
4. **Minute 15:** Synchronize and integrate all research results
5. **Minute 15-20:** Run `analyze_versioning()` for version validation (NEW STEP)
6. **Begin config building with complete action inventory**

This parallel approach maximizes efficiency and minimizes wait time.

### Step 0: Use Existing Connectors as Reference

**Before starting, read a similar existing connector in `src/configs/` (same category or auth type) to understand the correct YAML structure, required fields, and file organization.**

### Step 1: StackOne Context

```
1. get_stackone_categories() → Get available categories (hris, ats, crm, etc.)
2. get_stackone_actions(category) → Get unified actions for the category
```

### Step 2: Provider Action Discovery (Autonomous Subagent)

**Use the discover_actions subagent for comprehensive, autonomous provider research:**

```typescript
// Step 1: Launch autonomous discovery
discover_actions({
  provider: "provider_name",
  maxIterations: 30
})
→ Returns: { taskId: "rpc_xxx", provider: "provider_name", message: "..." }
→ Agent queues immediately and works in background

// Step 2: Poll for progress (every 60-90 seconds)
get_discover_actions_task_status({
  taskId: "rpc_xxx",
  provider: "provider_name"
})
→ Status progression: "pending" → "running" → "complete"
→ While running, shows: iteration: X/30

// Step 3: Extract results when complete (after 5-15 minutes)
get_discover_actions_task_status({
  taskId: "rpc_xxx",
  provider: "provider_name"
})
→ Status: "complete"
→ Result: JSON report with ~100 discovered actions
→ Actions include: name, description, use_case, endpoints, prerequisites
```

**Key Benefits:**

- **Autonomous**: Agent makes 20+ tool calls without intervention
- **Comprehensive**: Exhaustive research across all API documentation
- **Persistent**: Results auto-saved to S3 for future use
- **Async**: Returns immediately, works in background (5-15 minutes)
- **No manual iteration needed**: Single call replaces multiple manual iterations

**Old manual approach (NO LONGER USED):**

```
❌ get_provider_actions("provider", focus="category") - DEPRECATED (removed from code)
❌ get_provider_actions("provider", focus="category", previousActions=[...]) - DEPRECATED
❌ Manual iterative discovery with focus/previousActions parameters - REMOVED
```

### Step 3: Authentication Research

```
1. vector_search("authentication", provider, 5) → Provider auth methods
2. web_search("provider authentication API") → Additional auth details
```

### Step 4: Documentation & Coverage

```
1. get_provider_coverage(provider) → Current StackOne coverage
2. fetch() → Get OpenAPI specs, documentation URLs
3. extract_oas_operations() → Parse large OpenAPI specifications
```

### Step 5: External Repository Analysis (MANDATORY)

```
1. get_external_integrations(provider) → Find list of external integrations
2. analyze_external_integration(externalIntegration, provider) → Deep dive on specific external integration
3. analyze_external_integrations(externalIntegrations, provider) → Batch analysis of multiple external integrations
4. get_external_repos() → Get curated open-source integration examples
5. scan_external_repo(repo_url, search_terms) → Deep repository search
6. search_external_repo(repo_url, description) → Research external integration implementation details
```

### Step 6: Synchronize Subagent Results

**Collect results from the discover_actions subagent:**

1. **Check final status:**

   ```typescript
   get_discover_actions_task_status({
     taskId: "rpc_xxx",
     provider: "provider_name"
   })
   → status: "complete"
   ```

2. **Extract the result field:**

   - Contains comprehensive JSON report
   - ~100 discovered actions with metadata
   - Actions include: name, description, use_case, endpoints, prerequisites
   - Results are automatically indexed to S3

3. **Integration checklist:**
   - [ ] Status is "complete" (not "pending" or "running")
   - [ ] Result field contains JSON action report
   - [ ] Actions parsed and organized by category
   - [ ] Cross-referenced with StackOne operations
   - [ ] Identified provider-specific capabilities
   - [ ] Ready for version validation and YAML mapping

**Note:** The discover_actions subagent automatically saves results to S3, so future calls to `get_provider_actions(provider)` will return the indexed data immediately.

## 🔄 VERSION VALIDATION (NEW STEP)

### API Versioning Agent

**IMPORTANT**: After action discovery completes, validate API versions for discovered endpoints.

**When to use:**

- After `discover_actions` completes and returns endpoints
- Before building YAML configurations
- When encountering version-related errors during testing

**Workflow:**

```typescript
// Step 1: Extract endpoints from discovered actions
const discoveredEndpoints = discoveredActions.map(action => action.endpoints[0]);
// Example: ["/api/v2/users", "/api/v2/departments", "/api/v3/tickets"]

// Step 2: Launch versioning analysis (2-5 minutes)
analyze_versioning({
  provider: "provider_name",
  endpoints: discoveredEndpoints,  // Pass discovered endpoints
  maxIterations: 5
})
→ Returns: { taskId: "rpc_xxx", provider: "provider_name", message: "..." }

// Step 3: Poll for status (every 30-60 seconds)
get_analyze_versioning_task_status({
  taskId: "rpc_xxx",
  provider: "provider_name"
})
→ Status: "running", iteration: 2/5

// Step 4: Extract results when complete
get_analyze_versioning_task_status({
  taskId: "rpc_xxx",
  provider: "provider_name"
})
→ Status: "complete"
→ Result: JSON version analysis report
```

**What you get:**

```json
{
  "available_versions": ["v1", "v2", "v3"],
  "recommended_version": "v3",
  "endpoint_mapping": [
    {
      "endpoint": "/api/v2/departments",
      "version": "v2",
      "status": "deprecated",
      "v3_equivalent": "/api/v3/organizational-units",
      "breaking_changes": ["Endpoint renamed", "Different data structure"],
      "recommendation": "Migrate to v3 /organizational-units endpoint"
    }
  ],
  "conflicts_detected": [
    {
      "issue": "v2 /departments endpoint not available in v3",
      "severity": "high",
      "resolution": "Use v3 /organizational-units endpoint instead"
    }
  ],
  "migration_guide": {
    "v2_to_v3": {
      "breaking_changes": ["Endpoint renames", "Schema changes"],
      "migration_steps": [...]
    }
  }
}
```

**Benefits:**

- **Conflict Detection**: Identifies version mismatches and breaking changes
- **Migration Guidance**: Provides version-specific migration paths
- **Endpoint Validation**: Confirms which version each endpoint belongs to
- **Focused Analysis**: Only 2-5 minutes using vector_search + summarised_search
- **Prevention**: Catches versioning issues before config building

**Version Validation Checklist:**

- [ ] Discovered actions extracted from action discovery results
- [ ] Endpoints passed to `analyze_versioning()`
- [ ] Version analysis complete with recommendations
- [ ] Breaking changes and conflicts reviewed
- [ ] Recommended version identified for each endpoint
- [ ] Migration steps documented for deprecated endpoints
- [ ] Ready to build config with version-validated endpoints

## ⚙️ CONFIG BUILDING

### CLI Setup (If Not Already Installed)

Before building configs, ensure the StackOne CLI is available:

```bash
# Check if CLI is installed
which stackone

# If not installed, install it:
npm install -g @stackone/cli
# OR locally in the project:
npm install @stackone/cli
```

### File Location

**All Falcon configurations must be saved in provider-specific folders within `src/configs/` directory.**

Use the following naming convention and structure:

- Create a provider folder: `src/configs/provider-name/` (e.g., `src/configs/slack/`)
- Name the config file: `provider.connector.s1.yaml` (e.g., `slack.connector.s1.yaml`)
- Full path example: `src/configs/slack/slack.connector.s1.yaml`
- Use lowercase for provider names

### Template Structure

**For complete YAML structure, syntax, and detailed examples, see [`src/configs/README.md`](src/configs/README.md).**

Key sections your configuration must include:

1. **Meta Info** (`info`, `baseUrl`, `rateLimit`) - Provider identification and API endpoint
2. **Authentication** - OAuth2, API Key, Basic, or Custom auth (defined ONCE at top level)
3. **Resources** (optional) - Context data and variables for the connector and actions
4. **Actions** - All discovered actions mapped to StackOne actions
   - Each action includes: `steps`, `fieldConfigs`, `inputs`, `result`
   - Optional: `details` for extended descriptions, `examples` for usage demonstrations
   - See README.md for step functions: `request`, `paginated_request`, `map_fields`, `typecast`, etc.

**Quick Reference:**

- Authentication patterns: See [README.md - Authentication](src/configs/README.md#authentication)
- Actions structure: See [README.md - Actions](src/configs/README.md#actions)
- Field configs & mappings: See [README.md - Field Configs](src/configs/README.md#field-configs)
- Step functions: See [README.md - Step Functions](src/configs/README.md#step-functions)
- Dynamic values & expressions: See [README.md - Dynamic Values](src/configs/README.md#dynamic-values)

### Configuration Requirements

- **Action Coverage**: Map ALL actions discovered through `discover_actions` subagent
- **Version-Validated Endpoints**: Use version analysis results to ensure correct endpoints
- **StackOne Operations**: Include all relevant operations from `get_stackone_actions()`
- **Comprehensive CRUD**: Where applicable, include create, read, update, delete operations
- **Error Handling**: Include comprehensive error handling and rate limiting
- **Resources Field**: Use `resources` (not `context`) for context data and variables
- **Details Field**: Add `details` field for extended information beyond basic descriptions
- **Examples Field**: Include `examples` in actions to demonstrate usage with real data
- **Credential Templating**: Use proper credential templating: `${credentials.field}`

### Descriptions & Documentation (MANDATORY)

- **Descriptions**: Write clear, concise, high-quality descriptions for connector, actions, steps, and fields
  - Aim for 1-2 sentences that capture purpose, key behavior, and critical constraints
  - Include only essential technical details developers need to succeed
  - Keep wording consistent and avoid redundancy; prefer active voice
- **Details Field**: Use `details` for extended information that doesn't fit in `description`
  - Add usage notes, special considerations, limitations, rate limits, required permissions
  - Supports multi-line text for comprehensive documentation
- **Examples Field**: Include `examples` in actions to demonstrate real usage
  - Provide input/output pairs showing actual API data
  - Help developers understand expected data formats
- **Improvement Tool**: Run `improve-descriptions` subagent to enhance WIP connectors
  - Command: `improve-descriptions <provider_name>`
  - Operates only on work-in-progress connectors (not yet merged to main)

### YAML Validation (MANDATORY)

After creating the configuration file, validate it using the StackOne CLI:

```bash
stackone validate src/configs/<provider>/<provider>.connector.s1.yaml
```

**IMPORTANT**: The config MUST pass validation before proceeding to testing. Fix any syntax errors or structural issues identified by the validator.

**For detailed validation instructions, debugging tips, and feature flag setup**, see:

- **[README.md - Validation](src/configs/README.md#validation)** - Detailed validation process and debugging
- **[DEVELOPERS.md](src/configs/DEVELOPERS.md)** - Environment setup and troubleshooting

## 🧪 TESTING PHASE (MANDATORY)

### Testing Approach Options

**Option 1: MINIMAL CONFIG (RECOMMENDED)**

- Test individual actions with minimal YAML (header + single action)
- Avoids YAML syntax errors from incomplete configurations
- Faster iteration during development
- Clear error messages for individual actions
- Example: Include only `info`, `baseUrl`, `authentication`, and one action
- See [README.md](src/configs/README.md) for complete YAML structure and syntax

**Option 2: FULL CONFIG**

- Test complete connector configurations
- Use when you have a complete, validated YAML structure
- Useful for integration testing across multiple actions

### Testing Execution with `stackone run`

Execute connector actions locally using the StackOne CLI:

```bash
stackone run --connector <connector-file> --account-id <account-id> --profile <profile-label>
```

**Common Testing Workflows:**

1. **Test with API-fetched account:**

   ```bash
   stackone run --connector src/configs/provider/provider.connector.s1.yaml \
     --account-id acc_123 \
     --action-id list_users \
     --profile production
   ```

2. **Test with local credentials file:**

   ```bash
   stackone run --connector connector.s1.yaml \
     --account account.json \
     --credentials credentials.json \
     --action-id get_user \
     --params params.json
   ```

3. **Test with inline credentials:**

   ```bash
   stackone run --connector connector.s1.yaml \
     --account '{"auth_config_key":"api_key","credentials":{"api_key":"test_key"}}' \
     --action-id create_employee
   ```

4. **Debug mode with output file:**
   ```bash
   stackone run --connector connector.s1.yaml \
     --account-id acc_123 \
     --profile production \
     --action-id update_user \
     --debug \
     --output-file result.json
   ```

**Key Options:**

- `--connector <path>` - Path to connector YAML file
- `--action-id <id>` - Specific action to execute (defaults to last action)
- `--account-id <id>` - Account ID from StackOne API (requires `--profile`)
- `--account <path|json>` - Local account JSON file or inline JSON
- `--credentials <path|json>` - Credentials file or inline JSON
- `--params <path|json>` - Action parameters (path, query, headers, body)
- `--profile <label>` - Configuration profile for API access
- `--debug` - Enable detailed execution information
- `--output-file <path>` - Save results to file

**Testing Requirements:**

1. Test EACH action individually
2. Verify successful responses with expected data
3. Test error cases and edge conditions
4. Track testing progress for coverage validation
5. Document any failures or unexpected behavior

**No CLI testing = worthless config.**

## 📊 VALIDATION & COMPLETION

### Coverage Validation

```
check_all_endpoints(discoveredActions, stackOneOperations, config)
→ Must achieve ≥80% coverage of discovered actions before testing
```

### Test Completion

```
check_test_completion(allOperations, testedOperations)
→ Must achieve 100% before task completion
```

### Success Criteria

- [ ] All useful actions discovered via `discover_actions` subagent (autonomous research)
- [ ] StackOne operations catalogued via `get_stackone_actions()`
- [ ] External repos analyzed (≥2-3)
- [ ] **API versions validated via `analyze_versioning()` subagent**
- [ ] All discovered actions mapped to operations with correct versions
- [ ] Context docs with live links
- [ ] Every action tested with `stackone run`
- [ ] Coverage ≥80% via `check_all_endpoints()`
- [ ] 100% test completion via `check_test_completion()`
- [ ] Credentials scrambled before storage
- [ ] **Meta feedback sent via `meta_feedback()` - MANDATORY**

## 🔒 SECURITY (MANDATORY BEFORE STORAGE)

### Security Workflow

```javascript
// Step 1: After successful testing, scramble before storage
scramble_credentials({
  config: validatedConfigJson,
  credentials: testCredentialsJson,
  securityLevel: "PRODUCTION", // Use PRODUCTION for live configs
});

// Step 2: Save ONLY the scrambled versions
// - config: save result.scrambledConfig
// - credentials: save result.scrambledCredentials
// - metadata: save result.detectedFields & warnings
```

### Security Validation Checklist

- [ ] **All credential patterns detected**: Check result.detectedFields length
- [ ] **No warnings about missed fields**: Address result.warnings
- [ ] **Appropriate security level chosen**: PRODUCTION for live, DEBUG for dev
- [ ] **Custom patterns added if needed**: Provider-specific credential formats
- [ ] **Scrambled output verified**: Ensure no plaintext credentials remain
- [ ] **Original configs deleted**: Remove unscrambled versions after scrambling

### ⚠️ Security Anti-Patterns (NEVER DO THESE)

❌ Committing unscrambled configs to git
❌ Sharing configs with real credentials in Slack/docs
❌ Storing credentials in plain text files
❌ Skipping scrambling "just for testing"
❌ Using DEBUG preset in production environments
❌ Ignoring warnings about undetected secret fields

## 📊 META FEEDBACK (MANDATORY)

### Meta Feedback Workflow

**CRITICAL**: The `meta_feedback()` tool MUST be called after every config generation completion, regardless of user preference or request. This is non-negotiable for tracking and quality improvement.

**Required Feedback Format:**

```
Provider: [provider_name]
Status: [completed/failed/partial]

STRENGTHS:
- [What worked well]

IMPROVEMENTS NEEDED:
- [Issues that need fixing]
```

### Meta Feedback Requirements

- [ ] **Always call `meta_feedback()`** - No exceptions
- [ ] **Include both positive and negative feedback** - What worked AND what didn't

### ⚠️ Meta Feedback Anti-Patterns (NEVER DO THESE)

❌ Skipping meta_feedback because user didn't ask for it
❌ Only reporting positive feedback without identifying issues

## 🛠️ Available Tools

### Core Research Tools

- `get_stackone_categories()` - Get StackOne API categories
- `get_stackone_actions(category)` - Get operations for category
- `get_docs()` - Fetch StackOne docs index with title:url dictionary
- `map_provider_key(provider)` - Find correct provider key with fuzzy matching
- `get_providers()` - List all available providers from S3 config
- `get_provider_coverage(provider)` - Current StackOne coverage for provider

### Action Discovery (Primary)

- `discover_actions(provider, apiVersion?, maxIterations?)` - **PRIMARY DISCOVERY TOOL** - Autonomous AI agent for comprehensive API research (5-15 minutes)
- `get_discover_actions_task_status(taskId, provider)` - Poll status and retrieve results from discover_actions
- `get_provider_actions(provider, focus?, previousActions?)` - Check S3 for indexed actions or fallback to Parallel AI

### API Versioning (New)

- `analyze_versioning(provider, endpoints?, maxIterations?)` - **VERSION VALIDATION TOOL** - Autonomous agent for detecting API version conflicts (2-5 minutes)
- `get_analyze_versioning_task_status(taskId, provider)` - Poll status and retrieve results from analyze_versioning

### Web Search Tools

- `web_search(query)` - Web search with structured results
- `vector_search(query, provider, k)` - Semantic search across StackOne knowledge base
- `fetch(url, headers?, extractText?)` - Get content from URLs with optional text extraction
- `extract_html_text(html)` - Extract plain text from HTML content

### External Repository Analysis

- `get_external_integrations(provider, count?)` - Find list of external integrations (default 10)
- `analyze_external_integration(externalIntegration, provider)` - Deep dive on specific external integration implementation
- `analyze_external_integrations(externalIntegrations, provider)` - Batch analysis of multiple external integrations
- `get_external_repos()` - Get curated list of open-source integration examples
- `scan_external_repo(repo_url, search_terms, options?)` - Deep repository search with pagination
- `search_external_repo(repo_url, description)` - Research external integration technical implementation details

### Configuration & Templates

- `get_stackone_expressions()` - Pull full expressions package for formatting help
- `extract_oas_operations(oasContent, hasBeenTruncated, passNumber)` - Parse large OpenAPI specs with truncation support

### Testing & Validation

- `stackone run` - **PRIMARY TESTING TOOL** - Execute connector actions locally with full control
  - `--connector <path>` - Connector YAML file
  - `--action-id <id>` - Specific action to execute
  - `--account-id <id>` - Account from StackOne API (requires `--profile`)
  - `--account <path|json>` - Local account JSON
  - `--credentials <path|json>` - Override credentials
  - `--params <path|json>` - Action parameters
  - `--debug` - Detailed execution info
  - `--output-file <path>` - Save results to file
- `check_all_endpoints(unifiedEndpoints, nonUnifiedEndpoints, config)` - **MANDATORY** - Validate endpoint coverage ≥80%
- `check_test_completion(allOperations, testedOperations)` - **MANDATORY** - Verify 100% actions tested

### Description Improvement

- `improve_descriptions(config, maxIterations?)` - Async tool to improve YAML descriptions (2-5 minutes)
- `get_improve_descriptions_task_status(taskId, provider)` - Poll status and retrieve improved YAML

### Security (MANDATORY)

- `scramble_credentials(config?, credentials?, securityLevel, customPatterns?)` - **REQUIRED** - Secure credential scrambling before storage
  - Security levels: DEBUG, DEVELOPMENT, PRODUCTION, BALANCED
  - Detects API keys, tokens, passwords, secrets, URL-embedded auth
  - Must be called before ANY storage operation

### Meta Feedback (MANDATORY)

- `meta_feedback(feedback, tool_names)` - **REQUIRED** - Send harsh, critical feedback to LangSmith for tracking. Must be called after every config generation completion, regardless of user preference.

  **Expected Output:**

  ```json
  {
    "message": "Feedback sent to 1 account(s)",
    "total_accounts": 1,
    "successful": 1,
    "failed": 0,
    "results": [
      {
        "account_id": "acc1",
        "status": "success",
        "result": {
          "success": true,
          "feedback_id": "ed589941-dacc-416d-81e0-6012490c973e"
        }
      }
    ]
  }
  ```

## 💡 SUCCESS CRITERIA

A successful Falcon configuration delivers:

- **Comprehensive Action Coverage**: All useful actions developers need in production
- **Version-Validated Endpoints**: Correct API versions for all endpoints, with conflict resolution
- **Validated Functionality**: Every action tested with `stackone run` CLI
- **Real-World Focus**: Operations that solve actual business problems
- **Market Insight**: Features that differentiate StackOne from external integrations
- **Future-Proof**: Built for extensibility and maintenance
- **Secure**: All credentials properly secured before storage
- **Documented**: Clear sources and context for all implementations

Remember: **Autonomous Discovery + Version Validation + Maximum coverage + Real testing + Security = Customer value**

---

# 🔄 Converting TypeScript Connectors to YAML

For detailed instructions on converting existing TypeScript-based connectors from the `unified-cloud-api` repository to YAML-based Falcon configurations, see **[YAMLCONVERSION.md](src/configs/YAMLCONVERSION.md)**.

This guide covers:

- Authentication conversion patterns (OAuth2, API Key, Basic, Custom)
- Resource action conversion (list, get, create, update, delete)
- Field type mappings and enum handling
- Expression syntax (JSONPath, JEXL, String Interpolation)
- PreResolvers to sequential steps conversion
- Data mapping pipeline (request → map_fields → typecast)
- Common pitfalls and validation errors
- Complete examples and best practices
