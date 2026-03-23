---
name: import-schema
description: Converts an end-user's existing schema document (CSV, JSON, YAML, plain text, or spreadsheet headers) into the connector builder's schema_fields format. Use when a builder has an internal schema they want to map to. Saves the result to the session file so /map-fields can use it immediately.
invoke: import-schema
---

# Import Schema

Converts your existing schema document into a format the connector builder understands.

Supports: **CSV**, **JSON**, **YAML**, **TSV**, **plain text field lists**, and any tabular format where columns or keys represent field names.

---

## Step 1: Ask for the file path

Ask:
> "What is the path to your schema document? (e.g., `schemas/employee.csv`, `docs/api-schema.json`, `./fields.yaml`)"

Read the file at the provided path.

If the file doesn't exist:
> "I couldn't find a file at `{{path}}`. Check the path and try again — or paste the schema content directly and I'll parse it from there."

---

## Step 2: Parse the file by format

Detect the format from the file extension or content structure.

### CSV / TSV

Treat the **first row as field names**. Look at the second row (if present) to determine whether it contains:
- **Type hints** (e.g., `string`, `number`, `date`) → use as types
- **Sample data** (e.g., `John`, `42`, `2024-01-15`) → infer types from the values
- **Nothing** → default all types to `string`, ask the builder to confirm

Example CSV:
```
id,first_name,last_name,email,hire_date,status,salary
string,string,string,string,date,enum,number
```

→ Parse as 7 fields with explicit types.

Example CSV with sample data:
```
id,first_name,last_name,email,hire_date,status,salary
EMP001,John,Smith,john@acme.com,2023-01-15,active,75000
```

→ Infer: `id` string, `first_name` string, `last_name` string, `email` string, `hire_date` date, `status` string (flag as possible enum), `salary` number.

### JSON

If it's an **array of objects**, use the keys of the first object as field names and infer types from the values:
```json
[{ "id": "123", "first_name": "Jane", "active": true, "score": 4.5 }]
```
→ `id` string, `first_name` string, `active` boolean, `score` number.

If it's a **schema definition object** (keys are field names, values are type strings or objects):
```json
{
  "id": "string",
  "hire_date": "date",
  "status": { "type": "enum", "values": ["active", "inactive"] }
}
```
→ Parse directly as typed fields.

If it's an **OpenAPI-style schema** (has `properties` key):
```json
{
  "properties": {
    "id": { "type": "string" },
    "email": { "type": "string", "format": "email" }
  },
  "required": ["id", "email"]
}
```
→ Extract from `properties`, use `required` array.

### YAML

Same rules as JSON — detect structure and parse accordingly.

### Plain text field list

If the file is a plain list of names (one per line or comma-separated):
```
id, first_name, last_name, email, hire_date, status
```
→ Parse as fields, default all types to `string`, then ask the builder to review types.

---

## Step 3: Infer and flag likely enums

After parsing, flag any field that looks like it might be an enum:
- Field name contains `status`, `type`, `kind`, `category`, `role`, `level`, `state`
- Sample values are short, consistent, and repeat (e.g., `active`, `inactive`, `pending`)

For flagged fields, ask:
> "These fields look like they might have a fixed set of values. For each one, tell me the allowed values (or `skip` to treat as a plain string):
>
> - `status` — e.g., active, inactive, pending?"

Collect enum values and add them to the field definition.

---

## Step 4: Present the parsed schema for review

Show a summary table:

> "Here's what I extracted from your schema document:
>
> | # | Field | Type | Required | Notes |
> |---|-------|------|---------|-------|
> | 1 | `id` | string | ✓ | |
> | 2 | `first_name` | string | ✓ | |
> | 3 | `status` | enum | | Values: active, inactive |
> | 4 | `hire_date` | date | | |
> | ... |
>
> A few things to check:
> 1. Are the types correct? (string / number / boolean / date / datetime / enum / array / object)
> 2. Which fields are required?
> 3. Any fields I missed or should exclude?"

Allow the builder to make corrections. Accept natural language like:
- "Make `hire_date` required"
- "Change `salary` type to number"
- "Add `manager_id` as a string"
- "Remove `internal_notes`"
- "`status` values are: active, inactive, on_leave, terminated"

Apply corrections and show the updated table. Repeat until the builder confirms.

---

## Step 5: Save to session

Once confirmed, save to `.connector-build-session.json`:

```json
{
  "schema_source": "imported",
  "schema": "custom",
  "schema_file": "{{original_file_path}}",
  "resources": ["custom"],
  "schema_fields": [
    { "name": "id", "type": "string", "required": true },
    { "name": "first_name", "type": "string", "required": true },
    { "name": "status", "type": "enum", "required": false, "enum_values": ["active", "inactive", "on_leave", "terminated"] },
    { "name": "hire_date", "type": "date", "required": false }
  ]
}
```

---

## Handoff

> "Schema imported. ✓
>
> **{{N}} fields** loaded from `{{file_path}}`
>
> These fields will be used as your `targetFieldKey` names in `/map-fields`. The next step is deciding which provider operations to build.
>
> - If you haven't set a provider yet: tell me which provider you're building for (ask directly — do not redirect to `/choose-schema`), then run `/check-connector`
> - If provider is already set but connector hasn't been pulled/scaffolded: run `/check-connector`
> - If provider + connector + actions are already set: run `/map-fields` directly"

Update session:
- `session_step` → `"map-fields"` (if provider, connector, and action_scope are all set) or `"check-connector"` (if provider is set but connector not yet pulled/scaffolded) or `"choose-schema"` (if provider is not set — ask for provider name directly before redirecting)
