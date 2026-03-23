---
name: scope-actions
description: Step 3 of building a unified connector. Asks the builder which resources and CRUD operations matter for their use case, then saves the confirmed action scope to the session file.
invoke: scope-actions
---

# Scope Actions

Step 3 of the unified connector build process.

## Session File

Read `.connector-build-session.json`. Greet with context:
> "Scoping actions for `{{provider}}` → `{{schema}}` connector."

If `provider` or `schema` is missing:
> "Session is incomplete. Run `/choose-schema` first."

---

## Step 1: Orient the builder on action types

Give a brief overview before asking anything:
> "Unified connectors expose **actions** — operations customers can call via the StackOne API. For each resource you can expose:
>
> | Action | What it does | Example |
> |--------|-------------|---------|
> | `list` | Returns a paginated list of records | List all employees |
> | `get` | Returns a single record by ID | Get employee by ID |
> | `create` | Creates a new record | Create an employee |
> | `update` | Updates an existing record | Update employee fields |
> | `delete` | Removes a record | Delete an employee |
>
> Not all providers support all operations — we'll confirm what makes sense for your use case."

---

## Step 2: Ask about the primary use case

Ask:
> "What is the primary use case for this connector? This helps me recommend which actions to prioritize.
>
> Examples:
> - "Sync employee data into our internal system" → `list` + `get`
> - "Let customers create and update records from our app" → `create` + `update`
> - "Full two-way sync" → all five actions
> - "Just read data for reporting" → `list` + `get` only
>
> Describe your use case in a sentence or two."

Save the use case description to session as `use_case`.

---

## Step 3: Present a recommended scope

First, resolve the provider key and check if indexed provider actions are available:
```
map_provider_key("{{provider}}")  // Resolve to exact provider key
get_provider_actions("{{resolved_provider_key}}")
```
If indexed actions exist, use them to inform the recommendation — only suggest actions the provider's API actually supports. If no indexed data is available, recommend based on the session `resources` and use case, but note that support should be verified during testing.

Based on the session `resources`, the use case, and any indexed provider actions, recommend an action set.

Example recommendation:
> "Based on your schema and use case, here's what I recommend:
>
> | Resource | Recommended Actions |
> |----------|-------------------|
> | `employees` | `list`, `get` |
> | `time_off` | `list`, `get`, `create` |
>
> Does this match what you need? You can add or remove any actions — just let me know."

Allow the builder to adjust freely. Confirm the final scope before saving.

---

## Step 4: Flag potential provider gaps

Ask:
> "Do you know if `{{provider}}`'s API supports all these operations?
> - Does it have list/get endpoints for each resource?
> - Does it support creating or updating via API, or is it read-only?
>
> If you're unsure, that's fine — we'll discover this during testing."

Note any known limitations in the session.

---

## Step 5: Save to session

```json
{
  "action_scope": {
    "employees": ["list", "get"],
    "time_off": ["list", "get", "create"]
  },
  "use_case": "Sync HR data into customer's internal system",
  "known_limitations": ["time_off.delete not supported by provider API"]
}
```

---

## Handoff

Confirm and hand off:
> "Action scope confirmed. ✓
>
> | Resource | Actions |
> |----------|---------|
> | `employees` | list, get |
> | `time_off` | list, get, create |
>
> Next step: map provider fields to your schema.
> Run `/map-fields` to continue."

Update `session_step` to `"map-fields"` in the session file.
