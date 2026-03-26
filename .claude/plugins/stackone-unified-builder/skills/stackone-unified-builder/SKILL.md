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

**Outcome:** Partial YAML files written to `connectors/{{provider}}/`

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
  "connector_path": "connectors/bamboohr",
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
