---
name: Connector Onboarding
description: Structured onboarding flow for building connectors. ONLY invoked via explicit /on-boarding command. Do not auto-trigger.
---

# Connector Onboarding Skill

**How to invoke**: Use the `/on-boarding` command

## IMPORTANT: Explicit Trigger Only

**This skill MUST NOT auto-trigger.** It is ONLY invoked when the user explicitly runs `/on-boarding`.

**DO NOT trigger this skill for:**
- "build a connector" → Just ask "What provider?" then proceed
- "build a schema based connector" → Just ask "What provider?" then proceed with unified build
- "create a connector for X" → Proceed directly with the appropriate workflow
- Any vague or incomplete request → Ask for missing info directly (simple question), don't launch full onboarding

**The onboarding flow is for users who want guided hand-holding through the entire process.** Most users just want to get started quickly.

## Onboarding Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: Connector Type                                    │
│  Ask: Agentic Actions / Schema-Based / Skip Walkthrough     │
├─────────────────────────────────────────────────────────────┤
│                         │                                   │
│         ┌───────────────┼───────────────┐                   │
│         ▼               ▼               ▼                   │
│    [Agentic]      [Schema-Based]    [Skip]                  │
│         │               │               │                   │
│         ▼               │               └──► Proceed        │
│  PHASE 1.5 (REQUIRED)   │                   directly        │
│  Ask: New / Extend      │                                   │
│         │               │                                   │
│    ┌────┴────┐          │                                   │
│    ▼         ▼          ▼                                   │
│  [New]   [Extend]   [Schema]                                │
│    │         │          │                                   │
│    ▼         ▼          ▼                                   │
│  PHASE 2: Provider Details (for all paths)                  │
│  Ask: Provider name, API version                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Connector Type Selection

**Always start by asking this question** using `AskUserQuestion`:

```
What type of connector are you building?

A) Agentic Actions Connector
   - Returns raw provider data as-is
   - Maximum API coverage and flexibility
   - Best for: General-purpose integrations, building action libraries

B) Schema-Based Connector (Unified/Standardized)
   - Transforms provider data to YOUR specific schema
   - Consistent output format across providers
   - Best for: Specific data models, standardized field requirements

C) Skip Guided Walkthrough
   - For experienced users who know what they need
   - Just tell me what to build and I'll do it
```

### Decision Criteria

| Factor | Agentic Actions | Schema-Based |
|--------|-----------------|--------------|
| Output format | Raw provider response | Your defined schema |
| Field names | Provider's naming | Your naming convention |
| Use case | API coverage, flexibility | Data standardization |
| Complexity | Lower | Higher (requires mapping) |

---

## Phase 1.5: Agentic Actions Sub-Selection (REQUIRED)

**⚠️ MANDATORY**: If user selects "Agentic Actions Connector" in Phase 1, you MUST ask this follow-up question BEFORE asking about provider details.

Use `AskUserQuestion` to ask:

```
Are you creating a new connector or extending an existing one?

A) Create New Connector
   - Build a connector from scratch
   - Research API, configure auth, discover and build all actions
   - Best for: Providers not yet in StackOne

B) Extend Existing Connector
   - Add new actions to an existing connector
   - Uses StackOne Agent to analyse existing config and build new actions
   - Best for: Adding specific use cases to established connectors
```

### Decision Criteria

| Factor | Create New | Extend Existing |
|--------|------------|-----------------|
| Starting point | From scratch | Fork existing connector |
| Research | Full API discovery | Targeted for new actions |
| Agent assistance | Manual workflow | StackOne Agent guided |
| Best for | New providers | Adding use cases |

**After Phase 1.5**: Proceed to Phase 2 to get provider details.

---

## Phase 2: Provider Details

**When to trigger**: After completing Phase 1 (and Phase 1.5 if Agentic Actions was selected).

Ask the user:

1. **Provider name**: What provider/API are you building a connector for?
2. **API version** (if applicable): What API version should we target?

### Fork Existing Connector (MANDATORY)

**After getting the provider name, ALWAYS attempt to pull the existing connector from StackOne:**

```bash
stackone pull -c <provider>
```

This will:
- Download the existing connector if it exists in StackOne's registry
- Place files in `connectors/<provider>/`
- Provide a foundation to build upon

**If pull succeeds**:
- Create a NEW partial file for your new actions
- Add a `$ref` to the existing connector to include your partial
- **DO NOT** create a separate connector or duplicate auth config

**If pull fails** (connector doesn't exist): Check local configs and create new if needed:
```bash
ls connectors/ | grep -i <provider>
```

---

## Path C: Skip Guided Walkthrough

If user selects **Skip Guided Walkthrough**:

1. Proceed directly with their request without additional prompts
2. Use judgment to determine the appropriate approach
3. Follow best practices from relevant skills without prompting for confirmations
4. Only ask questions when truly ambiguous or critical information is missing

---

## Path A: Agentic Actions Connector

**⚠️ IMPORTANT**: If user selects **Agentic Actions** in Phase 1:

1. **FIRST**: Ask the Phase 1.5 question (New vs Extend) - DO NOT SKIP THIS
2. **THEN**: Ask Phase 2 questions (Provider name, API version)
3. **FINALLY**: Follow Path A1 or A2 based on their selection

---

### Path A1: Create New Connector

If user selects **Create New Connector**, follow the Falcon Connector Build workflow:

#### Step-by-Step Process

1. **Fork/Create Connector**
   ```bash
   # First, try to pull existing connector from StackOne
   stackone pull <provider>
   ```
   - If pull succeeds: Modify the existing connector files
   - If pull fails: Create new folder and files:
     - `connectors/<provider>/<provider>.connector.s1.yaml`
     - `connectors/<provider>/<provider>.<resource>.s1.partial.yaml`

2. **Build Authentication**
   - Determine auth type (API Key, OAuth 2.0, etc.)
   - Configure `authentication` section in connector YAML
   - Create a simple test action to validate auth works
   - **DO NOT PROCEED** until auth is working

3. **Connect Account**
   ```bash
   # Push connector to your profile
   stackone push connectors/<provider>/<provider>.connector.s1.yaml --profile <profile>
   ```
   - User creates account in StackOne dashboard
   - Verify connection works

4. **Research & Discover Actions**
   - Research ALL available API endpoints
   - Focus on CRUD operations that provide customer value
   - Document rate limits, scopes, and requirements

5. **Build Configuration**
   - Create comprehensive YAML with all discovered operations
   - Use partials to organize by resource
   - Include proper error handling

6. **Validate & Test**
   ```bash
   stackone validate connectors/<provider>/<provider>.connector.s1.yaml
   stackone run --connector <file> --account-id <id> --action-id <action> --profile <profile>
   ```

**Full workflow**: See `.claude/skills/falcon-connector-build.md`

---

### Path A2: Extend Existing Connector

If user selects **Extend Existing Connector**, follow the StackOne Agent workflow:

#### Step-by-Step Process

1. **Fork Existing Connector**
   ```bash
   # Pull the existing connector from StackOne
   stackone pull -c <provider>
   ```
   - This downloads the existing connector configuration
   - Places files in `connectors/<provider>/`
   - **If pull fails**: The connector doesn't exist - redirect to Path A1 (Create New Connector)

   **⚠️ CRITICAL: When extending a forked connector:**
   - **DO NOT** create a new connector file with a different key
   - **DO NOT** duplicate the authentication config
   - **DO** create a new partial file for your new actions (e.g., `<provider>.<resource>.s1.partial.yaml`)
   - **DO** add a `$ref` to the existing connector file to include your new partial
   - **DO** leverage the existing auth config as-is

   Example structure after extending:
   ```
   connectors/bamboohr/
     bamboohr_v1-0-0.s1.yaml           # Existing pulled connector (may need $ref added)
     bamboohr.new-actions.s1.partial.yaml  # Your NEW partial with new actions
   ```

2. **Set Up the StackOne Agent**
   - Ensure the StackOne Agent is configured in the project
   - Verify access to the connector configuration files

3. **Prompt the Agent with Use Case Description**
   - User describes the specific actions or functionality they want to add
   - Be specific about the data or operations needed
   - Example: "I need to add actions to sync employee time-off requests"

4. **Agent Analyses Existing Action Configurations**
   - Agent reviews the current connector structure
   - Identifies existing actions, authentication setup, and patterns
   - Maps out how the connector currently works

5. **Agent Runs Existing Actions to Test API and Scope the Use Case**
   - Agent executes existing actions to understand API behavior
   - Tests authentication and validates connectivity
   - Explores API responses to inform new action design

6. **Coding Agent Creates a Plan**
   - Agent proposes the new actions to be created
   - Outlines the endpoints, inputs, and outputs required
   - Presents the plan for user approval before proceeding

7. **Coding Agent Executes the Plan and Writes New Config Code**
   - Agent writes the new action configurations
   - Creates or updates partial files as needed
   - Follows existing connector patterns for consistency

8. **Coding Agent Provides a Summary**
   - Summary of what was accomplished
   - List of new actions added
   - Any limitations or follow-up items
   - Validation and testing instructions

#### Key Differences from Creating New

| Aspect | Create New | Extend Existing |
|--------|------------|-----------------|
| Starting point | Empty or minimal config | Full existing connector |
| Auth setup | Build from scratch | Already configured |
| Research scope | Full API discovery | Targeted for new actions |
| Agent role | Optional assistance | Primary driver |
| Pattern matching | Establish patterns | Follow existing patterns |

---

## Path B: Schema-Based Connector

If user selects **Schema-Based**, guide through this structured workflow:

### Workflow Overview

```
1. Fork Connector    -> Check StackOne, fork or create new
2. Build Auth        -> Configure and validate authentication
3. Connect Account   -> Push connector, create test account
4. Define Schema     -> User provides target schema (CRITICAL)
5. Research Options  -> Present endpoint options with trade-offs
6. Build & Optimise  -> Implement mappings, test
7. Lock Schema       -> Confirm all fields mapped
8. Iterate           -> Refine based on real data
```

### Step 1: Fork Connector

**First, pull existing connector from StackOne:**
```bash
stackone pull -c <provider>
```

- **If pull succeeds**: Review the existing connector files
- **If pull fails**: Check local configs and create new if needed:
  ```bash
  ls connectors/ | grep -i <provider>
  ```
  If not found locally, create new folder and files:
  - `connectors/<provider>/<provider>.connector.s1.yaml`
  - `connectors/<provider>/<provider>.<resource>.s1.partial.yaml`

**⚠️ CRITICAL: When adding unified actions to a forked connector:**
- **DO NOT** create a new connector file with a different key
- **DO NOT** duplicate the authentication config
- **DO** create a new partial file for your unified actions (e.g., `<provider>.unified-<resource>.s1.partial.yaml`)
- **DO** add a `$ref` to the existing connector file to include your new partial
- **DO** leverage the existing auth config as-is

Example structure after adding unified actions:
```
connectors/bamboohr/
  bamboohr_v1-0-0.s1.yaml                    # Existing pulled connector (add $ref to it)
  bamboohr.unified-documents.s1.partial.yaml # Your NEW partial with unified actions
```

The existing connector already has working auth - don't recreate it.

### Step 2: Build Auth

**Before any action work, validate authentication:**

1. Determine auth type from provider docs:
   - API Key -> `type: custom` with `authorization.type: basic|bearer|apiKey`
   - OAuth 2.0 -> `type: oauth2` with appropriate grant type

2. Configure `authentication` section in connector YAML

3. Create a simple test action (e.g., `list_users`) to validate auth

4. **DO NOT PROCEED** until auth is working

### Step 3: Connect Account

```bash
# Push connector to your profile
stackone push connectors/<provider>/<provider>.connector.s1.yaml --profile <profile>
```

User creates account in StackOne dashboard, then verify:
```bash
stackone run --connector <file> --account-id <id> --action-id <test-action> --profile <profile>
```

### Step 4: Define Schema and Use Case

**CRITICAL**: Get the user's schema BEFORE researching endpoints.

#### Fast Path: Check for Schema Skill First

```bash
# Check for existing schema skills
ls .claude/skills/*schema*.md .claude/skills/schemas/*.md 2>/dev/null
```

**If exactly one schema skill exists:**
- Read the schema from the skill file
- Confirm briefly: "Using your [X] schema skill"
- Proceed directly to Step 5 (no questions needed)

**If multiple schema skills exist:**
- List all available schema skills
- Ask the user which schema to use for this connector using `AskUserQuestion`
- Example: "Found multiple schema skills: [HRIS Schema, ATS Schema, CRM Schema]. Which schema should this connector use?"
- Only proceed after user selects one

**If no schema skill exists:**

Ask ONE open-ended question (no predefined options):

> "What's your target schema? Share your field requirements in any format:
> - Field list with types (e.g., `email: string, status: enum[active,inactive]`)
> - YAML/JSON schema definition
> - Markdown table
> - Or just describe what data you need"

After receiving their schema, offer once:
> "Want me to save this as a schema skill for future connectors? (yes/no)"

If yes, create `.claude/skills/schemas/[use-case]-schema.md` using the template at `.claude/skills/templates/use-case-schema.template.md`.

Document the schema before proceeding.

### Step 5: Research & Present Options

**MANDATORY CHECKPOINT**

1. Research ALL available endpoints that could provide the schema fields
2. Evaluate each endpoint against:
   - Field coverage (% of schema fields returned)
   - Performance (pagination, rate limits)
   - Permissions (scope requirements - narrower is better)
   - Deprecation status (never use deprecated endpoints)

3. Present options table to user:

```markdown
| Option | Endpoint | Field Coverage | Performance | Permissions | Status |
|--------|----------|----------------|-------------|-------------|--------|
| A | GET /employees | 60% | Fast | Narrow | Active |
| B | POST /reports | 100% | Medium | Moderate | Active |
| C | POST /datasets | 100% | Medium | Broad | Deprecated |

Recommendation: Option B - Full field coverage, not deprecated

Trade-offs:
- Option A: Fastest, narrowest permissions, but missing fields X, Y, Z
- Option B: All fields, moderate permissions, reliable
- Option C: DO NOT USE - deprecated
```

4. **Get explicit user approval** before implementation
5. **DO NOT PROCEED** without user selecting an option

### Step 6: Build & Optimise

Follow the Unified Connector Build workflow:

1. Implement `map_fields` step with user's schema field names
2. Implement `typecast` step
3. Configure pagination if needed
4. Test with real data:
   ```bash
   stackone run --connector <file> --account-id <id> --action-id <action> --profile <profile>
   ```

**Full workflow**: See `.claude/skills/unified-connector-build.md`

### Step 7: Lock Schema

Confirm with user:
- [ ] All required schema fields are mapped
- [ ] Optional fields mapped where possible
- [ ] Any unmapped fields documented with reason
- [ ] Connector version finalized

### Step 8: Iterate

1. Test with real data across different scenarios
2. Handle edge cases (nulls, missing data, special characters)
3. Refine mappings as needed
4. Push updates:
   ```bash
   stackone push <connector-file> --profile <profile>
   ```

---

## End of Onboarding

Once the user has completed the flow and selected their path, inform them:

---

**You're all set!**

In future sessions, you can skip this onboarding:

- **For new Agentic Actions connectors**: Just tell me what you want to build directly
  Example: "build a connector for Linear API"

- **For extending existing connectors**: Tell me you want to add actions to an existing connector
  Example: "add time-off sync actions to the BambooHR connector"

- **For Schema-Based connectors**: Use the phrase **"start unified build for [provider]"**
  Example: `start unified build for BambooHR`

**Pro tip - Schema Skills**: If you saved your schema as a skill (in `.claude/skills/schemas/`), future unified builds will automatically use it with zero friction. Create schema skills for each use case you build connectors for.

---

Now, let's begin building your connector following the path you selected.

---

## Quick Reference Commands

```bash
# Validate connector
stackone validate connectors/<provider>/<provider>.connector.s1.yaml

# Push connector
stackone push connectors/<provider>/<provider>.connector.s1.yaml --profile <profile>

# Test action
stackone run --connector <file> --account-id <id> --action-id <action> --profile <profile>

# Debug mode
stackone run --connector <file> --account-id <id> --action-id <action> --profile <profile> --debug
```

---

## Related Skills

- **Falcon Connector Build Skill**: For agentic actions connectors
- **Unified Connector Build Skill**: Detailed unified connector workflow (trigger: "start unified build for [provider]")
- **Falcon Authentication Setup Skill**: Auth configuration patterns
- **Unified Field Mapping Skill**: Field mapping patterns
- **Schema Skill Template**: `.claude/skills/templates/use-case-schema.template.md` - Create reusable schema definitions
