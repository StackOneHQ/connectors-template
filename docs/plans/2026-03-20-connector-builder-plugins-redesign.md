# Connector Builder Plugins Redesign

## Goal

Rename the existing unified connector builder plugin to `stackone-unified-builder` (invoke: `/build-unified-connector`), and create a new sibling plugin `stackone-connector-builder` (invoke: `/build-connector`) for building generic (non-unified) Falcon connectors.

## Architecture

Both plugins live under `connectors-template/.claude/plugins/`, share the same session file pattern (`.connector-build-session.json`), and explicitly reference StackOne MCP tools. The unified builder maps provider data to a schema via `fieldConfigs`; the generic builder outputs raw provider responses via `actionType: custom`.

---

## Part 1: Rename stackone-connector-builder → stackone-unified-builder

### Changes required

- Rename directory: `.claude/plugins/stackone-connector-builder/` → `.claude/plugins/stackone-unified-builder/`
- Update `plugin.json`: name, description, keywords
- Update main orchestrator `SKILL.md`: name, description, invoke command (`/build-unified-connector`)
- Add explicit MCP tool references to `check-connector`, `map-fields`, and `test-connector` skills where missing

### MCP tools to add to unified builder

| Skill | Tools to add |
|-------|-------------|
| `check-connector` | `map_provider_key`, `get_provider_actions` — check S3 index before CLI |
| `map-fields` | `get_stackone_actions`, `vector_search` — look up schema action coverage |
| `test-connector` | `test_actions`, `scramble_credentials` |

---

## Part 2: New stackone-connector-builder (generic)

### Plugin structure

```
.claude/plugins/stackone-connector-builder/
├── .claude-plugin/
│   └── plugin.json
├── README.md
├── skills/
│   ├── stackone-connector-builder/   ← /build-connector (orchestrator)
│   ├── setup-connector/              ← /setup-connector (Step 1)
│   ├── configure-auth/               ← /configure-auth (Step 2)
│   ├── discover-actions/             ← /discover-actions (Step 3)
│   ├── build-config/                 ← /build-config (Step 4)
│   ├── validate-connector/           ← /validate-connector (Step 5)
│   └── test-connector/               ← /test-connector (Step 6)
└── references/
    ├── connector-patterns.md         ← symlink/copy from unified
    ├── cli-commands.md               ← symlink/copy from unified
    └── auth-patterns.md              ← new: detailed auth reference
```

### Steps

| Step | Skill | Key behaviour |
|------|-------|--------------|
| 1 | `setup-connector` | Provider name → `map_provider_key` → `get_provider_actions` (S3 check) → CLI pull or scaffold |
| 2 | `configure-auth` | API key / OAuth2 / Basic Auth / custom; write auth block to connector YAML |
| 3 | `discover-actions` | Scoped (ask use case, recommend actions) OR maximal (`discover_actions` MCP, async 5–15 min) |
| 4 | `build-config` | Write YAML with all confirmed actions (`actionType: custom`, raw response, no fieldConfigs) |
| 5 | `validate-connector` | `stackone validate`; interpret and fix errors |
| 6 | `test-connector` | Test each action live; **clean up after itself** |

### discover-actions detail

**Scoped path:**
1. Ask use case in plain language
2. Run `get_stackone_actions` + `vector_search` to find relevant actions
3. Present recommended action set, let builder adjust
4. Save `action_scope` to session

**Maximal path:**
1. Run `map_provider_key` to get exact provider key
2. Check `get_provider_actions` for cached data
3. If no cache: launch `discover_actions(provider, maxIterations: 30)` → get `taskId`
4. Poll `get_discover_actions_task_status` every 60–90s
5. Run `analyze_versioning` on discovered endpoints
6. Present full discovered action list for builder confirmation
7. Save `action_scope` to session

### test-connector cleanup behaviour

Test order: `list` → `get` → `create` → `update` → `delete`

**Cleanup rules:**
- Record every `create` response and store the new record ID
- After `update` is verified, attempt `delete` on the test record
- After `delete`, confirm with a follow-up `get` (expect 404)
- If `delete` is not in scope: attempt soft cleanup (archive/deactivate/cancel if available)
- If no cleanup possible: log the record ID and warn the builder
- Use `scramble_credentials` after all tests pass

**Cleanup report** (shown at end):
```
Test cleanup summary:
✓ employees/EMP_test_001 — created and deleted
✓ time_off/TOF_test_042 — created and deleted
⚠ department/DEP_test_007 — created, no delete endpoint; record remains
```

### Session file schema (generic)

```json
{
  "provider": "workday",
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
