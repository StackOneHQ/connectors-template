---
name: validate-connector
description: Step 5 of building a unified connector. Runs stackone validate on the connector config, interprets any errors with clear fixes, re-runs until clean, and confirms structural correctness before live testing.
invoke: validate-connector
---

# Validate Connector

Step 5 of the unified connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Validating connector at `src/configs/{{provider}}/`"

If `connector_path` is missing:
> "No connector path in session. Run `/check-connector` first."

Read `${CLAUDE_PLUGIN_ROOT}/references/cli-commands.md` for the error table.

---

## Step 1: Run validation

**If `cli_available` is true:**
```bash
npx @stackone/cli validate src/configs/{{provider}}/{{provider}}.connector.s1.yaml
```

**If `cli_available` is false (manual review):**

Read each `.yaml` and `.partial.yaml` file in `src/configs/{{provider}}/` and check:
- All unified actions have `schemaType: unified`
- All unified actions have `entrypointUrl` and `entrypointHttpMethod`
- All unified actions have a `fieldConfigs` array
- All unified actions have all three steps: `request`, `map_fields` (version 2), `typecast` (version 2)
- `list` actions have a `cursor` block
- `get` actions reference `${inputs.id}` in the URL and have `id` in `inputs`
- No typos in `actionType` values (valid: `custom`, `list`, `get`, `create`, `update`, `delete`)
- All `$ref` paths in the main connector point to files that exist
- No tabs — use 2-space indentation throughout

---

## Step 2: Interpret and fix errors

For each validation error, explain what it means and show the exact fix.

**Missing `entrypointUrl`:**
> "The action is missing an endpoint URL. Add `entrypointUrl` pointing to the provider's API path:"
```yaml
entrypointUrl: "/{{resource}}"
entrypointHttpMethod: GET
```

**Wrong `actionType`:**
> "The actionType value is invalid. Valid values are: `custom`, `list`, `get`, `create`, `update`, `delete`"

**Missing `fieldConfigs` on unified action:**
> "Unified actions require a `fieldConfigs` array for field mapping. Run `/map-fields` if you haven't mapped fields yet, or add the array:"
```yaml
fieldConfigs:
  - targetFieldKey: id
    expression: "$.id"
```

**Missing steps on unified action:**
> "Unified actions need all three pipeline steps:"
```yaml
steps:
  - type: request
    id: fetch
  - type: map_fields
    version: 2
    id: map
  - type: typecast
    version: 2
    id: cast
```

**Missing `schemaType`:**
> "Add `schemaType: unified` to the action."

**Bad `$ref` path:**
> "The partial file path in `$ref` doesn't exist. Check the filename matches exactly — naming convention is `{{provider}}.{{resource}}.s1.partial.yaml`"

After each fix, re-run validation. Repeat until it passes cleanly.

---

## Step 3: Confirm clean validation

When validation passes (or manual review finds no issues):
> "Validation passed — your connector config is structurally correct. ✓
>
> **Summary:**
> - Provider: `{{provider}}`
> - Resources: {{resources}}
> - Actions: {{action_scope}}
> - Config path: `src/configs/{{provider}}/`"

Save `"validated": true` to session.

---

## Handoff

> "Ready for live testing.
>
> Next step: test your actions against the real `{{provider}}` API.
> Run `/test-connector` to continue.
>
> Before running tests, make sure your `.env` file has the right credentials."

Update `session_step` to `"test-connector"` in the session file.
