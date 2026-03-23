# Connector Onboarding

Welcome to the StackOne Connector Onboarding workflow. I'll guide you through building a connector step by step.

## Step 1: Choose Your Connector Type

First, let me understand what type of connector you're building. Use `AskUserQuestion` to present these options:

**A) Agentic Actions Connector**
- Returns raw provider data as-is
- Maximum API coverage and flexibility
- Best for: General-purpose integrations, building action libraries

**B) Schema-Based Connector (Unified/Standardized)**
- Transforms provider data to YOUR specific schema
- Consistent output format across providers
- Best for: Specific data models, standardized field requirements

**C) Skip Guided Walkthrough**
- For experienced users who know what they need
- No additional prompts or questions

## Step 2: Get Provider Details

After the user selects their connector type, ask them:

1. **Provider name** - What provider/API are you building a connector for?
2. **Provider version** (if applicable) - What API version should we target?

Then pull the existing connector from StackOne registry:
```bash
# First, try to pull existing connector from StackOne
stackone pull <provider>
```

- **If pull succeeds**: Fork and modify the existing connector files
- **If pull fails**: Check local configs and create new if needed:
  ```bash
  ls connectors/ | grep -i <provider>
  ```

## Step 3: Follow the Appropriate Workflow

### Path A: Agentic Actions Connector

Direct the user to the **Falcon Connector Build Skill** workflow:
1. Pull existing connector (`stackone pull <provider>`) or create new from template
2. Configure authentication
3. Research and discover actions
4. Build comprehensive YAML configuration
5. Validate and test

Follow the full workflow documented in `.claude/skills/falcon-connector-build.md`.

### Path B: Schema-Based Connector

Guide through the **Schema-Based Connector Workflow**:

1. **Fork Connector** - Pull existing (`stackone pull <provider>`) or create new
2. **Build Auth** - Configure and validate authentication first
3. **Connect Account** - Push connector and create test account
4. **Define Schema** - User provides their target schema (fields, types, required vs optional)
5. **Research & Present Options** - Research ALL endpoints, present trade-offs to user
6. **Build & Optimise** - Implement field mappings with user's chosen endpoint
7. **Lock Schema** - Confirm all fields mapped, document limitations
8. **Iterate** - Test with real data, refine as needed

**Key Principle**: Always get the user's schema BEFORE researching endpoints.

### Path C: Skip Walkthrough

Proceed directly with the user's request without additional prompts. Only ask when information is critically missing.

## End of Onboarding

Once the user has completed the onboarding flow and selected their path, inform them:

---

**You're all set!**

In future sessions, you can skip this onboarding by using one of these specific commands:

- **For Agentic Actions connectors**: Just tell me what you want to build directly (e.g., "add a list_users action to the Slack connector")

- **For Schema-Based connectors**: Use the phrase **"start unified build for [provider]"** to begin the schema-based connector workflow directly.

Example: `start unified build for BambooHR`

---

Now, let's begin building your connector following the path you selected.
