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
| 2 | `/configure-auth` | Set up authentication (custom or OAuth2) |
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

- Do not write action YAML until Step 4 (`build-config`) — auth config written in Step 2 is the exception
- Do not run tests until Step 5 (`validate-connector`) passes
- Always clean up test records — log anything that cannot be removed
- Always run `scramble_credentials` after testing
- Never ask for information already in the session
