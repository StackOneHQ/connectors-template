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

## Phase 2: Provider Details

After the user selects their connector type, ask:

1. **Provider name**: What provider/API are you building a connector for?
2. **API version** (if applicable): What API version should we target?

### Fork Existing Connector (MANDATORY)

**After getting the provider name, ALWAYS attempt to pull the existing connector from StackOne:**

```bash
stackone pull <provider>
```

This will:
- Download the existing connector if it exists in StackOne's registry
- Place files in `src/configs/<provider>/`
- Provide a foundation to build upon

**If pull succeeds**: Fork and modify the existing connector
**If pull fails** (connector doesn't exist): Check local configs and create new if needed:
```bash
ls src/configs/ | grep -i <provider>
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

If user selects **Agentic Actions**, follow the Falcon Connector Build workflow:

### Step-by-Step Process

1. **Fork/Create Connector**
   ```bash
   # First, try to pull existing connector from StackOne
   stackone pull <provider>
   ```
   - If pull succeeds: Modify the existing connector files
   - If pull fails: Create new folder and files:
     - `src/configs/<provider>/<provider>.connector.s1.yaml`
     - `src/configs/<provider>/<provider>.<resource>.s1.partial.yaml`

2. **Build Authentication**
   - Determine auth type (API Key, OAuth 2.0, etc.)
   - Configure `authentication` section in connector YAML
   - Create a simple test action to validate auth works
   - **DO NOT PROCEED** until auth is working

3. **Connect Account**
   ```bash
   # Push connector to your profile
   stackone push src/configs/<provider>/<provider>.connector.s1.yaml --profile <profile>
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
   stackone validate src/configs/<provider>/<provider>.connector.s1.yaml
   stackone run --connector <file> --account-id <id> --action-id <action> --profile <profile>
   ```

**Full workflow**: See `.claude/skills/falcon-connector-build.md`

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
stackone pull <provider>
```

- **If pull succeeds**: Review and modify the existing connector files
- **If pull fails**: Check local configs and create new if needed:
  ```bash
  ls src/configs/ | grep -i <provider>
  ```
  If not found locally, create new folder and files:
  - `src/configs/<provider>/<provider>.connector.s1.yaml`
  - `src/configs/<provider>/<provider>.<resource>.s1.partial.yaml`

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
stackone push src/configs/<provider>/<provider>.connector.s1.yaml --profile <profile>
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

- **For Agentic Actions connectors**: Just tell me what you want to build directly
  Example: "add a list_users action to the Slack connector"

- **For Schema-Based connectors**: Use the phrase **"start unified build for [provider]"**
  Example: `start unified build for BambooHR`

**Pro tip - Schema Skills**: If you saved your schema as a skill (in `.claude/skills/schemas/`), future unified builds will automatically use it with zero friction. Create schema skills for each use case you build connectors for.

---

Now, let's begin building your connector following the path you selected.

---

## Quick Reference Commands

```bash
# Validate connector
stackone validate src/configs/<provider>/<provider>.connector.s1.yaml

# Push connector
stackone push src/configs/<provider>/<provider>.connector.s1.yaml --profile <profile>

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
