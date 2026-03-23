---
name: build-config
description: Step 4 of building a generic Falcon connector. Generates YAML action configurations for all confirmed actions using actionType custom, writes partial files per resource, and updates the main connector YAML with $ref links.
invoke: build-config
---

# Build Config

Step 4 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Building config for `{{provider}}` — {{N}} actions across {{M}} resources."

Read `${CLAUDE_PLUGIN_ROOT}/references/connector-patterns.md` before writing any YAML.

If `action_scope` is missing:
> "No action scope found. Run `/discover-actions` first."

---

## Step 1: Confirm endpoint details

If endpoint URLs weren't captured during discovery, ask for each resource:
> "What is the API endpoint path for `{{resource}}`? (e.g., `/employees`, `/v2/employees`)"

Use any data from `get_provider_actions` or the builder's API docs.

---

## Step 2: Write partial YAML files

Create `src/configs/{{provider}}/{{provider}}.{{resource}}.s1.partial.yaml` for each resource.

### list action
```yaml
- name: list_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}"
  entrypointHttpMethod: GET
  inputs:
    page:
      type: number
      required: false
    per_page:
      type: number
      required: false
  steps:
    - type: request
      id: fetch_{{resource}}
```

### get action
```yaml
- name: get_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}/${inputs.id}"
  entrypointHttpMethod: GET
  inputs:
    id:
      type: string
      required: true
  steps:
    - type: request
      id: fetch_{{resource}}
```

### create action
```yaml
- name: create_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}"
  entrypointHttpMethod: POST
  inputs:
    body:
      type: object
      required: true
  steps:
    - type: request
      id: create_{{resource}}
```

### update action
```yaml
- name: update_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}/${inputs.id}"
  entrypointHttpMethod: PATCH
  inputs:
    id:
      type: string
      required: true
    body:
      type: object
      required: true
  steps:
    - type: request
      id: update_{{resource}}
```

### delete action
```yaml
- name: delete_{{resource}}
  actionType: custom
  entrypointUrl: "/{{resource}}/${inputs.id}"
  entrypointHttpMethod: DELETE
  inputs:
    id:
      type: string
      required: true
  steps:
    - type: request
      id: delete_{{resource}}
```

---

## Step 3: Update main connector YAML with $refs

Read `src/configs/{{provider}}/{{provider}}.connector.s1.yaml` and add a `$ref` per partial under `actions`:

```yaml
actions:
  - $ref: "./{{provider}}.employees.s1.partial.yaml"
  - $ref: "./{{provider}}.departments.s1.partial.yaml"
```

---

## Step 4: Review with builder

> "Config written:
> - `src/configs/{{provider}}/{{provider}}.connector.s1.yaml` (updated)
> - `src/configs/{{provider}}/{{provider}}.employees.s1.partial.yaml`
> - ...
>
> Do the endpoint URLs and HTTP methods look right? Any actions need adjusting?"

Apply corrections before moving on.

---

## Handoff

> "Config built. ✓
>
> Next: validate the YAML.
> Run `/validate-connector` to continue."

Update `session_step` to `"validate-connector"`.
