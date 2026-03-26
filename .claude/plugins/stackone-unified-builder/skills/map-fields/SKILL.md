---
name: map-fields
description: Step 4 of building a unified connector. Guides the builder through mapping provider API fields to their schema using fieldConfigs. Writes or updates the connector YAML partial files for each resource.
invoke: map-fields
---

# Map Fields

Step 4 of the unified connector build process.

## Session File

Read `.connector-build-session.json`. Confirm context:
> "Mapping fields for `{{provider}}` → `{{schema}}` | Resources: {{resources}} | Actions: {{action_scope}}"

If `action_scope` is missing:
> "No action scope found. Run `/scope-actions` first."

Read `${CLAUDE_PLUGIN_ROOT}/references/field-mapping-guide.md` and `${CLAUDE_PLUGIN_ROOT}/references/connector-patterns.md` before beginning.

If `schema_source` is `"builtin"` and `schema_file` is set in session, also read `${CLAUDE_PLUGIN_ROOT}/{{schema_file}}` to get the exact field names, types, and enum values for the chosen category. Use this as the authoritative field reference when constructing `fieldConfigs` — the `targetFieldKey` must match the field names defined in the schema file exactly.

---

## Step 0: Check StackOne action coverage

Before mapping fields, check whether StackOne has coverage data for this provider:

```
get_provider_coverage("{{provider_key}}")
```

If coverage data exists, use it to pre-populate likely field paths and flag any known gaps.

Also run a vector search to find similar connectors as reference:

```
vector_search("{{schema}} {{provider}} field mapping")
```

Use any matching results to inform the fieldConfigs you build.

---

## Step 1: Get the raw provider response

Getting a real sample response makes field mapping accurate.

**If `cli_available` is true in session and the action already exists in the connector YAML:**
```bash
npx @stackone/cli test {{provider}} unified_list_{{resource}} --debug
```
This shows the raw JSON before any mapping. Use the output to identify exact field paths.

**If the action does not exist yet** (e.g., new connector with no actions built): Skip the CLI test for now — the action will be created in Step 3. Instead, use `vector_search` or `web_search` to find example API responses for the provider's endpoint, or ask the builder to provide one.

**If CLI is not available:** Ask:
> "Could you paste an example response from `{{provider}}`'s `{{resource}}` API endpoint? Even a partial response with one or two records is enough. This helps me map the fields accurately."

---

## Step 2: Build fieldConfigs for each resource

Work through resources one at a time.

For each schema field (from `schema_fields` in session, or — for built-in schemas — from the selected `schema_file` at `${CLAUDE_PLUGIN_ROOT}/{{schema_file}}`):

1. Show the field: e.g., `first_name (string, required)`
2. Ask: "What is the field path in the `{{provider}}` response? (e.g., `$.firstName`, `$.contact.first_name`)"
3. For enum fields: "What values does `{{provider}}` use? I'll map them to the schema values."
4. If the builder is unsure, reference the raw response sample together.

Build the `fieldConfigs` array live as you collect mappings:
```yaml
fieldConfigs:
  - targetFieldKey: id
    expression: "$.id"
  - targetFieldKey: first_name
    expression: "$.firstName"
  - targetFieldKey: employment_status
    expression: "$.status"
    enumMapper:
      active: active
      terminated: inactive
```

When all fields for a resource are mapped, show the complete list and ask:
> "Here's the mapping for `{{resource}}`. Anything missing or incorrect?"

---

## Step 3: Write the partial YAML file

For each resource, create or update:
`connectors/{{provider}}/{{provider}}.{{resource}}.s1.partial.yaml`

Use the unified action pattern from `connector-patterns.md`. For each action in scope:

- `actionId: unified_{{action}}_{{resource}}`
- `actionType: {{action}}`
- `schemaType: unified`
- `schema: {{schema}}/{{resource}}`
- `entrypointUrl` and `entrypointHttpMethod`
- `fieldConfigs` from Step 2
- `cursor` block for `list` actions
- All three steps: `request`, `map_fields` (version 2), `typecast` (version 2)
- For `get` actions: include the ID in `entrypointUrl` as `${inputs.id}` and add `id` to `inputs`

Also update the main connector YAML to `$ref` each new partial if not already referenced.

---

## Step 4: Review with the builder

After writing each partial, show the file content and ask:
> "Here's the field mapping for `{{resource}}`. A few things to verify:
> 1. Do the `targetFieldKey` names match your schema exactly?
> 2. Are there any fields I missed?
> 3. For enum fields — did I capture all the provider's possible values?
>
> [show YAML]"

Apply any corrections the builder requests before moving to the next resource.

---

## Handoff

After all resources are mapped and partials are written:
> "Field mapping complete. ✓
>
> Files written:
> - `connectors/{{provider}}/{{provider}}.connector.s1.yaml` (updated with $refs)
> - `connectors/{{provider}}/{{provider}}.employees.s1.partial.yaml`
> - ...
>
> Next step: validate the YAML configuration.
> Run `/validate-connector` to continue."

Update `session_step` to `"validate-connector"` in the session file.
