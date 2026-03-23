# stackone-connector-builder

Claude Code plugin for building generic Falcon connectors that return raw provider API responses.

## When to use this plugin

Use **this plugin** when you want direct API access — actions use `actionType: custom` and return the provider's response as-is, with no schema normalisation.

Use **`stackone-unified-builder`** (via `/build-unified-connector`) when your connector needs to map provider data to a StackOne unified schema (HRIS, ATS, CRM, etc.).

## Workflow

| Step | Command | What it does |
|------|---------|--------------|
| 1 | `/setup-connector` | Provider setup, checks StackOne index, CLI pull or scaffold |
| 2 | `/configure-auth` | Auth configuration (API key, OAuth2, Basic Auth, custom) |
| 3 | `/discover-actions` | Choose scoped or maximal discovery (MCP-powered) |
| 4 | `/build-config` | Generate YAML with `actionType: custom` for all actions |
| 5 | `/validate-connector` | Validate YAML structure |
| 6 | `/test-connector` | Live test + automatic cleanup of test records |

## Quick start

```
/build-connector
```

This runs the full workflow from start to finish, guiding you through each step.

## Key features

- **Session persistence** — progress is saved to `.connector-build-session.json` so you can pause and resume at any step
- **Two discovery modes**:
  - *Scoped* — describe your use case and relevant endpoints are found via vector search
  - *Maximal* — discovers all provider endpoints via MCP (async, 5–15 min); use when you want full coverage
- **Test cleanup** — every record created during testing is tracked and deleted afterwards; any records that cannot be deleted are reported
- **Credential security** — `scramble_credentials` is always called after testing to invalidate live credentials

## MCP tools used

| Tool | Purpose |
|------|---------|
| `map_provider_key`, `get_provider_actions` | Check StackOne connector index |
| `discover_actions`, `get_discover_actions_task_status` | Maximal endpoint discovery (async) |
| `analyze_versioning` | Detect API versioning patterns |
| `vector_search` | Scoped discovery — find relevant endpoints by description |
| `test_actions`, `get_test_actions_task_status` | Automated live testing (async) |
| `scramble_credentials` | Invalidate credentials after testing |

---

For unified connectors (HRIS/ATS/CRM/etc), see the `stackone-unified-builder` plugin and `/build-unified-connector`.
