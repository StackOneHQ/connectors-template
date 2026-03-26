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

Create `connectors/{{provider}}/{{provider}}.{{resource}}.s1.partial.yaml` for each resource.

### list action
```yaml
- actionId: list_{{resource}}
  categories:
    - {{category}}
  actionType: custom
  label: List {{Resource}}
  description: List all {{resource}}
  steps:
    - stepId: fetch_{{resource}}
      description: Retrieve all {{resource}}
      stepFunction:
        functionName: request
        parameters:
          url: '/{{resource}}'
          method: get
  result:
    data: $.steps.fetch_{{resource}}.output.data
```

### get action
```yaml
- actionId: get_{{resource}}
  categories:
    - {{category}}
  actionType: custom
  label: Get {{Resource}}
  description: Get a specific {{resource}} by ID
  inputs:
    - name: id
      description: {{Resource}} ID
      type: string
      in: path
      required: true
  steps:
    - stepId: fetch_{{resource}}
      description: Retrieve {{resource}} by ID
      stepFunction:
        functionName: request
        parameters:
          url: '/{{resource}}/${inputs.id}'
          method: get
  result:
    data: $.steps.fetch_{{resource}}.output.data
```

### create action
```yaml
- actionId: create_{{resource}}
  categories:
    - {{category}}
  actionType: custom
  label: Create {{Resource}}
  description: Create a new {{resource}}
  inputs:
    - name: {{field_name}}
      description: {{field_description}}
      type: string
      in: body
      required: true
  steps:
    - stepId: create_{{resource}}
      description: Create a new {{resource}}
      stepFunction:
        functionName: request
        parameters:
          url: '/{{resource}}'
          method: post
          args:
            - name: {{field_name}}
              value: $.inputs.{{field_name}}
              in: body
  result:
    data: $.steps.create_{{resource}}.output.data
```

### update action
```yaml
- actionId: update_{{resource}}
  categories:
    - {{category}}
  actionType: custom
  label: Update {{Resource}}
  description: Update an existing {{resource}}
  inputs:
    - name: id
      description: {{Resource}} ID
      type: string
      in: path
      required: true
    - name: {{field_name}}
      description: {{field_description}}
      type: string
      in: body
      required: false
  steps:
    - stepId: update_{{resource}}
      description: Update {{resource}}
      stepFunction:
        functionName: request
        parameters:
          url: '/{{resource}}/${inputs.id}'
          method: patch
          args:
            - name: {{field_name}}
              value: $.inputs.{{field_name}}
              in: body
              condition: '{{present(inputs.{{field_name}})}}'
  result:
    data: $.steps.update_{{resource}}.output.data
```

### delete action
```yaml
- actionId: delete_{{resource}}
  categories:
    - {{category}}
  actionType: custom
  label: Delete {{Resource}}
  description: Delete a {{resource}} by ID
  inputs:
    - name: id
      description: {{Resource}} ID
      type: string
      in: path
      required: true
  steps:
    - stepId: delete_{{resource}}
      description: Delete {{resource}}
      stepFunction:
        functionName: request
        parameters:
          url: '/{{resource}}/${inputs.id}'
          method: delete
  result:
    data: $.steps.delete_{{resource}}.output.data
```

---

## Step 3: Update main connector YAML with $refs

Read `connectors/{{provider}}/{{provider}}.connector.s1.yaml` and add a `$ref` per partial under `actions`:

```yaml
actions:
  - $ref: {{provider}}.employees.s1.partial.yaml
  - $ref: {{provider}}.departments.s1.partial.yaml
```

---

## Step 4: Review with builder

> "Config written:
> - `connectors/{{provider}}/{{provider}}.connector.s1.yaml` (updated)
> - `connectors/{{provider}}/{{provider}}.employees.s1.partial.yaml`
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
