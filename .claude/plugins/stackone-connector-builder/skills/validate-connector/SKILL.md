---
name: validate-connector
description: Step 5 of building a generic Falcon connector. Validates the generated YAML config using the StackOne CLI (or a manual checklist if CLI is unavailable), interprets and fixes common errors, then confirms the connector is ready for live testing.
invoke: validate-connector
---

# Validate Connector

Step 5 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Validating connector config for `{{provider}}` at `{{connector_path}}`."

If `session_step` is not `"validate-connector"` or earlier steps are incomplete:
> "It looks like the config hasn't been built yet. Run `/build-config` first."

---

## Step 1: Run validation

Reference `${CLAUDE_PLUGIN_ROOT}/references/cli-commands.md` for CLI usage and error table.

### If `cli_available: true`

Run:
```bash
npx @stackone/cli validate src/configs/{{provider}}/{{provider}}.connector.s1.yaml
```

Capture the full output. Proceed to Step 2 to interpret any errors.

### If `cli_available: false`

The CLI is not available. Run the manual checklist below against every partial file in `src/configs/{{provider}}/`.

**Manual checklist for generic connectors:**

Work through each action across all `{{provider}}.{{resource}}.s1.partial.yaml` files:

1. **`actionType: custom`** — Every action must have `actionType: custom`. No other value is valid for generic connectors.

2. **`entrypointUrl` present (non-custom only)** — Actions with `actionType` other than `custom` must have an `entrypointUrl`. It must be a string starting with `/` or a full URL. Template expressions like `${inputs.id}` are allowed. Not required for `actionType: custom`.

3. **`entrypointHttpMethod` present (non-custom only)** — Actions with `actionType` other than `custom` must have `entrypointHttpMethod`. Valid values: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`. Not required for `actionType: custom`.

4. **At least one `type: request` step** — Every action must have a `steps` array with at least one entry where `type: request`. Generic actions have exactly one step.

5. **`list` actions have pagination inputs (if supported)** — Actions named `list_*` should have pagination inputs (`page`, `per_page`, `offset`, `limit`, or provider-specific equivalent) with `required: false`, if the provider endpoint supports pagination.

6. **`get` actions reference `${inputs.id}` in step URL** — Actions named `get_*` must have `${inputs.id}` in the request step's `url` parameter and an `id` input with `required: true`.

7. **`create` actions use POST** — Actions named `create_*` must have `method: post` in the request step.

8. **`update` actions use PATCH or PUT** — Actions named `update_*` must have `method: patch` or `method: put` in the request step.

9. **`delete` actions use DELETE** — Actions named `delete_*` must have `method: delete` in the request step.

10. **All `$ref` paths in main connector file exist** — Read `src/configs/{{provider}}/{{provider}}.connector.s1.yaml`. For every `$ref` entry under `actions`, verify the referenced partial file exists on disk at the given relative path.

11. **No tabs — 2-space indentation only** — Scan each YAML file for tab characters (`\t`). YAML does not allow tabs. All indentation must use spaces (2 per level).

Report each failure with the file name, action name, and the specific check that failed.

---

## Step 2: Interpret and fix errors

For each error from the CLI output or the manual checklist, identify the cause and apply a fix.

### Common errors and fixes

**`Missing required field: entrypointUrl`**

Cause: A non-custom action (e.g., `actionType: list`) is missing the `entrypointUrl` key. Note: this error does not apply to `actionType: custom` actions, which do not require `entrypointUrl`.

Fix — add the field to the non-custom action:
```yaml
- actionId: list_employees
  categories:
    - {{category}}
  actionType: list
  entrypointUrl: /employees        # <-- add this
  entrypointHttpMethod: get        # <-- add this
  label: List Employees
  description: List all employees
  steps:
    - stepId: fetch_employees
      description: Retrieve all employees
      stepFunction:
        functionName: request
        parameters:
          url: '/employees'
          method: get
  result:
    data: $.steps.fetch_employees.output.data
```

---

**`YAML parse error at line N`** or tab indentation error

Cause: Tabs used instead of spaces, or inconsistent indentation.

Fix — replace all tabs with 2-space indentation. Example of wrong vs correct:

Wrong (tab-indented):
```yaml
- name: list_employees
	actionType: custom        # tab here — invalid
```

Correct (2-space indented):
```yaml
- name: list_employees
  actionType: custom
```

---

**`Unknown actionType`** or invalid actionType value

Cause: Typo or wrong value in `actionType`.

Fix — the only valid value for generic connectors is `custom`:
```yaml
actionType: custom
```

---

**`$ref` path not found** or partial file missing

Cause: The `$ref` in the main connector YAML points to a file that doesn't exist, or the filename doesn't match the actual file on disk.

Fix — verify the partial file exists and the path matches exactly. Example:

Main connector YAML:
```yaml
actions:
  - $ref: "./{{provider}}.employees.s1.partial.yaml"
```

The file `src/configs/{{provider}}/{{provider}}.employees.s1.partial.yaml` must exist. Check for typos in the provider name, resource name, or `.s1.partial.yaml` suffix.

---

**`get` action missing `id` input or `${inputs.id}` in URL**

Cause: The `get` action was written without an `id` input or with a hardcoded path.

Fix:
```yaml
- name: get_employee
  actionType: custom
  entrypointUrl: "/employees/${inputs.id}"   # must reference ${inputs.id}
  entrypointHttpMethod: GET
  inputs:
    id:
      type: string
      required: true
  steps:
    - type: request
      id: fetch_employee
```

---

**`create` action missing `body` input or wrong HTTP method**

Cause: POST action is missing the request body input, or uses GET instead of POST.

Fix:
```yaml
- name: create_employee
  actionType: custom
  entrypointUrl: "/employees"
  entrypointHttpMethod: POST    # must be POST
  inputs:
    body:
      type: object
      required: true            # must be required
  steps:
    - type: request
      id: create_employee
```

---

**`list` action missing pagination inputs**

Cause: No pagination inputs defined, which means the caller cannot page through results.

Fix — add pagination inputs with `required: false`:
```yaml
inputs:
  page:
    type: number
    required: false
  per_page:
    type: number
    required: false
```

Use the provider's actual parameter names if they differ (e.g., `offset`/`limit`, `pageToken`, `cursor`).

---

After fixing each error, re-run the CLI validate command (if available) or re-run the manual checklist to confirm all issues are resolved.

---

## Step 3: Confirm clean validation

Once validation passes with no errors:

> "Validation passed. ✓
>
> **`{{provider}}` connector summary:**
> - Config: `src/configs/{{provider}}/{{provider}}.connector.s1.yaml`
> - Partial files: {{list each partial file}}
> - Actions validated: {{N}} ({{list action names}})
> - All actions use `actionType: custom`
> - All `$ref` paths resolved
> - YAML structure is valid"

---

## Handoff

Update the session file:
- Set `"validated": true`
- Set `"session_step": "test-connector"`

> "The connector config is valid and ready for live testing.
>
> Next: run `/test-connector` to make real API calls against `{{provider}}`.
>
> Before you do, make sure your `.env` file has the credentials for `{{provider}}`. The CLI reads them automatically — check `${CLAUDE_PLUGIN_ROOT}/references/cli-commands.md` for the expected variable names and format."
