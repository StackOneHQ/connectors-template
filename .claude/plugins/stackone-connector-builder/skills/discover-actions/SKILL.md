---
name: discover-actions
description: Step 3 of building a generic Falcon connector. Lets the builder choose between scoped discovery (use-case driven with MCP vector search) or maximal discovery (finds every available API endpoint using the StackOne discover_actions MCP tool asynchronously). Saves confirmed action scope to session.
invoke: discover-actions
---

# Discover Actions

Step 3 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Discovering actions for `{{provider}}`."

---

## Step 1: Choose discovery mode

Ask:
> "How much of `{{provider}}`'s API do you want to cover?
>
> **A) Scoped** — Tell me your use case and I'll recommend the right actions
> **B) Maximal** — Discover every available endpoint (takes 5–15 minutes, uses autonomous research)
>
> (A/B)"

Save `discovery_mode: "scoped"` or `"maximal"` to session.

---

## Path A: Scoped discovery

### A1: Ask about use case

Ask:
> "Describe what you need this connector to do. Examples:
> - "Read employee and department data into our platform"
> - "Let users create and update time-off requests"
> - "Sync job postings to our job board"
>
> What's your use case?"

Save `use_case` to session.

### A2: Look up relevant actions

```
vector_search("{{use_case}} {{provider}}")
```

```
get_provider_actions("{{provider_key}}")
```

### A3: Present recommended action set

> "Based on your use case, here are the actions I recommend:
>
> | Resource | Actions | Endpoints |
> |----------|---------|----------|
> | `employees` | list, get | `GET /employees`, `GET /employees/{id}` |
> | `departments` | list | `GET /departments` |
>
> Does this cover what you need? You can add or remove anything."

Allow the builder to adjust freely.

### A4: Flag known limitations

If `get_provider_actions` returned coverage data, note any gaps:
> "Note: `{{provider}}` doesn't appear to support `create` on employees via API — only `list` and `get` are confirmed."

### A5: Save to session

```json
{
  "discovery_mode": "scoped",
  "action_scope": {
    "employees": ["list", "get"],
    "departments": ["list"]
  },
  "use_case": "Read employee and department data"
}
```

---

## Path B: Maximal discovery

### B1: Check S3 cache first

```
map_provider_key("{{provider}}")
get_provider_actions("{{provider_key}}")
```

If cached data exists with many actions:
> "Found {{N}} actions in the StackOne index for `{{provider}}`. I can use this directly — no need to wait for a full discovery run."

Use cached data and skip to B4.

### B2: Launch autonomous discovery

```
discover_actions({ provider: "{{provider}}", maxIterations: 30 })
```

Returns a `taskId` immediately. Tell the builder:
> "Launched autonomous discovery for `{{provider}}`. This typically takes 5–15 minutes. I'll poll for results every 60–90 seconds."

### B3: Poll for completion

Every 60–90 seconds:
```
get_discover_actions_task_status("{{taskId}}", "{{provider}}")
```

Status progression: `pending` → `running` → `complete`

When `running`, report progress:
> "Still discovering... found {{N}} actions so far."

### B4: Run version analysis

Once discovery completes, extract all endpoints and run:
```
analyze_versioning({ provider: "{{provider}}", endpoints: [...], maxIterations: 5 })
```

Poll with `get_analyze_versioning_task_status`. Identifies deprecated endpoints and version conflicts.

### B5: Present full action list

> "Discovery complete. Found {{N}} actions across {{M}} resources:
>
> | Resource | Actions found |
> |----------|-------------|
> | `employees` | list, get, create, update |
> | `departments` | list, get |
> | `time_off` | list, get, create, delete |
>
> Which would you like to include? (all / select specific ones)"

### B6: Save to session

Save only the actions the builder explicitly selected — not all discovered actions:

```json
{
  "discovery_mode": "maximal",
  "action_scope": { "...only builder-selected actions..." },
  "use_case": "Full API coverage"
}
```

---

## Handoff

> "Action scope confirmed. ✓
>
> {{N}} actions across {{M}} resources.
>
> Next: generate the connector YAML.
> Run `/build-config` to continue."

Update `session_step` to `"build-config"`.
