# 🚀 FALCON API CONFIG BUILDER

This document provides the complete methodology for building Falcon API configurations with Claude. Follow this strict workflow to ensure comprehensive, tested, and customer-valuable integrations.

## 🔴 CRITICAL WORKFLOW (STRICT ORDER)

When asked to build Falcon API configurations, you MUST follow this exact sequence:

1. **Research Phase (PARALLEL EXECUTION)** → Launch `discover_actions` subagent for action discovery + main agent for auth/docs/competitors
2. **Synchronization** → Collect and integrate subagent results
3. **MANDATORY: Read `src/configs/README.md`** → **ALWAYS ALWAYS ALWAYS** read this file before building ANY config - contains YAML schema rules that MUST be followed
4. **Config Building** → Create comprehensive configuration with all discovered actions following README.md schema exactly
5. **YAML Validation** → `stackone validate src/configs/<provider>.yaml` → Ensure valid YAML syntax
6. **Coverage Validation** → `check_all_endpoints()` → Confirm endpoint coverage ≥80%
7. **Testing Phase** → `run_connector_operation()` → Test EVERY action with real API calls
8. **Test Completion** → `check_test_completion()` → Verify 100% actions tested
9. **Security** → `scramble_credentials()` → Secure all sensitive data before storage
10. **Meta Feedback** → `meta_feedback()` → **MANDATORY** - Send feedback to third-party system for tracking

**❌ Skip/Disorder = Incomplete Task / Professional Failure**

## 🎯 CORE PRINCIPLES

- **MAXIMUM COVERAGE**: Discover and include ALL useful actions that provide customer value
- **ACTION-FOCUSED**: Think: "what actions would developers commonly perform with this provider?"
- **CUSTOMER VALUE**: Prioritize actions that solve real business problems
- **MORE IS BETTER**: Default to comprehensiveness over minimalism
- **PRACTICAL UTILITY**: Focus on actions developers actually use in production

## 📚 PREREQUISITE DOCUMENTATION

**⚠️ CRITICAL: These files contain MANDATORY rules that MUST ALWAYS be followed:**

1. **🚨 MANDATORY: `src/configs/README.md` - ALWAYS READ BEFORE BUILDING ANY CONFIG 🚨**

   **YOU MUST READ THIS FILE BEFORE STEP 4 (CONFIG BUILDING). NO EXCEPTIONS.**

   This file contains:

   - **YAML schema structure** (actions structure, actionId, actionType, etc.)
   - **Required fields** and their exact names
   - **Authentication patterns** (OAuth, API Key, Custom)
   - **Step function syntax** (request, paginated_request, map_fields, typecast)
   - **Field config types** (string, number, boolean, datetime_string, enum, object)
   - **Expression syntax** (JSONPath, JEXL, template strings)
   - **Type mappings and enum patterns**

   **Failure to read this file WILL result in validation errors and wasted time.**

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
2. **Minutes 0-5:** Complete Steps 0-4 (reference connectors, StackOne context, auth, docs, competitors)
3. **Minutes 5-15:** Poll `get_discover_actions_task_status(taskId, provider)` every 60-90 seconds
4. **Minute 15:** Synchronize and integrate all research results
5. **Begin config building with complete action inventory**

This parallel approach maximizes efficiency and minimizes wait time.

### Step 0: Read YAML Schema Documentation (MANDATORY)

**🚨 ALWAYS READ `src/configs/README.md` BEFORE BUILDING ANY CONFIG 🚨**

This file contains the complete YAML schema, field names, type constraints, step function syntax, and all rules that MUST be followed. Reading this file is **NON-NEGOTIABLE** and will prevent validation errors.

After reading README.md, also read a similar existing connector in `src/configs/` (same category or auth type) to see practical examples of the schema in use.

### Step 1: StackOne Context

```
1. get_stackone_categories() → Get available categories (hris, ats, crm, etc.)
2. get_stackone_operations(category) → Get unified actions for the category
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
2. get_templates("auth_type") → Get Falcon auth templates
3. summarised_search("provider authentication API") → Additional auth details
```

### Step 4: Documentation & Coverage

```
1. get_provider_coverage(provider) → Current StackOne coverage
2. fetch() → Get OpenAPI specs, documentation URLs
3. extract_oas_operations() → Parse large OpenAPI specifications
```

### Step 5: Competitive Analysis (MANDATORY)

```
1. get_competitors(provider) → Find competitors
2. get_competitor_repos() → Get open source integration examples
3. scan_github_repo() → Analyze competitor implementations
4. analyze_competitor() → Deep dive on specific competitors
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
   - [ ] Cross-referenced with StackOne actions
   - [ ] Identified provider-specific capabilities
   - [ ] Ready to map to YAML actions

**Note:** The discover_actions subagent automatically saves results to S3, so future calls to `get_provider_actions(provider)` will return the indexed data immediately.

## ⚙️ CONFIG BUILDING

### 🚨 STEP 0: READ `src/configs/README.md` FIRST 🚨

**BEFORE YOU WRITE A SINGLE LINE OF YAML, YOU MUST READ `src/configs/README.md`**

This is **NOT OPTIONAL**. This file contains the exact YAML schema, field names, type constraints, and syntax rules that your configuration MUST follow. Reading this file will prevent:

- Using invalid types
- Incorrect step function syntax
- Invalid enum mapper patterns
- Expression template errors

**If you skip reading this file, your config WILL fail validation and you WILL waste time.**

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

**🚨 REMINDER: You MUST have already read [`src/configs/README.md`](src/configs/README.md) before this step. If not, GO READ IT NOW. 🚨**

The README.md file contains the complete YAML structure, syntax, and detailed examples. The key sections your configuration must include are:

1. **Meta Info** (`info`, `baseUrl`, `rateLimit`) - Provider identification and API endpoint
2. **Authentication** - OAuth2, API Key, Basic, or Custom auth (defined ONCE at top level)
3. **Context** (optional) - Documentation URLs for the connector and actions
4. **Actions** - All discovered actions mapped to StackOne actions
   - Each action uses `actionId`, `actionType`
   - Each action includes: `steps`, `fieldConfigs`, `inputs`, `result`
   - See README.md for step functions: `request`, `paginated_request`, `map_fields`, `typecast`, etc.

**Quick Reference:**

- Authentication patterns: See [README.md - Authentication](src/configs/README.md#authentication)
- Actions structure: See [README.md - Actions](src/configs/README.md#actions)
- Field configs & mappings: See [README.md - Field Configs](src/configs/README.md#field-configs)
- Step functions: See [README.md - Step Functions](src/configs/README.md#step-functions)
- Dynamic values & expressions: See [README.md - Dynamic Values](src/configs/README.md#dynamic-values)

### Configuration Requirements

- **Action Coverage**: Map ALL actions discovered through `discover_actions` subagent
- **StackOne Actions**: Include all relevant actions from `get_stackone_operations()`
- **Comprehensive CRUD**: Where applicable, include create, read, update, delete actions
- **Error Handling**: Include comprehensive error handling and rate limiting
- **Context Documentation**: Add context documentation with live URLs only
- **Credential Templating**: Use proper credential templating: `${credentials.field}`

### Descriptions (MANDATORY)

- Write clear, concise, high-quality descriptions for connector, actions, steps, and fields
- Aim for 1-2 sentences that capture purpose, key behavior, and critical constraints
- Include only essential technical details developers need to succeed
- Keep wording consistent and avoid redundancy; prefer active voice
- When in doubt, or to quickly improve WIP connectors, run the `improve-descriptions` subagent
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

### Testing Execution

1. Prepare test credentials object
2. Test EACH action using `run_connector_operation()`
   - connector: YAML configuration
   - account: credentials + environment details
   - category: StackOne category
   - path: action identifier
   - method: HTTP method
3. Track testing progress
4. Validate coverage

**No Connect SDK testing = worthless config.**

## 📊 VALIDATION & COMPLETION

### Coverage Validation

```
check_all_endpoints(discoveredActions, stackOneActions, config)
→ Must achieve ≥80% coverage of discovered actions before testing
```

### Test Completion

```
check_test_completion(allActions, testedActions)
→ Must achieve 100% before task completion
```

### Success Criteria

- [ ] All useful actions discovered via `discover_actions` subagent (autonomous research)
- [ ] StackOne actions catalogued via `get_stackone_operations()`
- [ ] Competitor repos analyzed (≥2-3)
- [ ] All discovered actions mapped to StackOne actions
- [ ] Context docs with live links
- [ ] Every action tested with `run_connector_operation()`
- [ ] Coverage ≥80% via `check_all_endpoints()`
- [ ] 100% test completion via `check_test_completion()`
- [ ] Credentials scrambled before storage
- [ ] **Meta feedback sent via `meta_feedback()` - MANDATORY**

## 🔐 SECURITY (MANDATORY BEFORE STORAGE)

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

### Research Tools

- `get_stackone_categories()` - Get StackOne API categories
- `get_stackone_operations(category)` - Get actions for category
- `map_provider_key(provider)` - Find correct provider key
- `get_provider_actions(provider)` - Check S3 for indexed actions (returns data or suggests discover_actions)
- `discover_actions(provider, apiVersion?, maxIterations?)` - **PRIMARY DISCOVERY TOOL** - Autonomous AI agent for comprehensive API research
- `get_discover_actions_task_status(taskId, provider)` - Poll status and retrieve results from discover_actions
- `vector_search(query, provider, k)` - Search StackOne knowledge base
- `summarised_search(query)` - Web search with AI analysis
- `concise_search(query)` - Structured web search results
- `fetch(url)` - Get content from URLs
- `extract_oas_operations(oasContent)` - Parse OpenAPI specs

### Competition Analysis

- `get_competitors(provider)` - Find competitor list
- `get_competitor_repos()` - Get open source repos
- `scan_github_repo(url, terms)` - Analyze repositories
- `analyze_competitor(competitor, provider)` - Deep analysis

### Configuration & Templates

- `get_templates(auth_type)` - Get Falcon auth templates
- `get_provider_coverage(provider)` - Current StackOne coverage
- `stackone validate <config_file>` - Validate YAML format using CLI (preferred method)

### Testing & Validation

- `run_connector_operation()` - Execute real API calls
- `check_all_endpoints()` - Validate endpoint coverage
- `check_test_completion()` - Verify testing completion

### Security

- `scramble_credentials()` - Secure credential scrambling

### Meta Feedback (MANDATORY)

- `meta_feedback()` - **REQUIRED** - Send feedback to third-party system for tracking performance and quality metrics. Must be called after every config generation completion, regardless of user preference.

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

### Formatting Support

- `get_expressions_info()` - Resolve expression formatting issues by inspecting supported formats

## 💡 SUCCESS CRITERIA

A successful Falcon configuration delivers:

- **Comprehensive Action Coverage**: All useful actions developers need in production
- **Validated Functionality**: Every action tested with real API calls
- **Real-World Focus**: Actions that solve actual business problems
- **Competitive Advantage**: Features that differentiate StackOne
- **Future-Proof**: Built for extensibility and maintenance
- **Secure**: All credentials properly secured before storage
- **Documented**: Clear sources and context for all implementations

Remember: **Autonomous Discovery + Maximum coverage + Real testing + Security = Customer value**
