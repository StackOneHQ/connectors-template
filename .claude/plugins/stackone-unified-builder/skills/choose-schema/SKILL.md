---
name: choose-schema
description: First step of building a unified connector. Guides the builder to choose or define the output schema — StackOne built-in, import from any schema document (CSV/JSON/YAML), or define inline. Saves schema choice to session file.
invoke: choose-schema
---

# Choose Schema

Step 1 of the unified connector build process.

## Session File

Read `.connector-build-session.json` from the project root if it exists.

If it exists and both `schema` and `provider` are already set, greet the builder:
> "Resuming session — schema already set to `{{schema}}` ({{schema_source}}) for provider `{{provider}}`. Run `/check-connector` to continue, or type `reset` to start over."

If it exists and `schema` is set but `provider` is missing (e.g., from an imported schema), proceed to Step 1 to collect the provider name only, then skip directly to `/check-connector` — do not re-run schema selection since the schema is already saved.

If it does not exist or `schema` is empty, proceed below.

---

## Step 1: Ask for the provider name

Ask:
> "What is the name of the provider you want to build a connector for? (e.g., `bamboohr`, `workday`, `salesforce`)"

Save as `provider` in session (lowercase, hyphenated).

---

## Step 2: Choose schema source

Ask:
> "What output schema will your connector map data to? Choose one:
>
> **A) StackOne built-in schema** — HRIS, ATS, CRM, LMS, IAM, Ticketing, Documents, Marketing, Accounting
> **B) Import from a schema document** — Point me to a CSV, JSON, YAML, or any file that defines your fields
> **C) Define a new custom schema** — I'll help you define fields interactively
>
> Which fits your use case? (A/B/C)"

---

## Path A: StackOne built-in schema

Read `${CLAUDE_PLUGIN_ROOT}/references/unified-schemas.md` for the category index.

Present the category table and ask:
> "Which StackOne category fits your use case? (hris / ats / crm / marketing / lms / iam / ticketing / documents / accounting)"

**Once the category is chosen, load only that category's schema file:**

| Category chosen | File to read |
|----------------|-------------|
| `hris` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/hris.md` |
| `ats` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/ats.md` |
| `crm` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/crm.md` |
| `lms` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/lms.md` |
| `iam` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/iam.md` |
| `ticketing` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/ticketing.md` |
| `documents` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/documents.md` |
| `marketing` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/marketing.md` |
| `accounting` | `${CLAUDE_PLUGIN_ROOT}/references/schemas/accounting.md` |

Read the schema file. Use the **Endpoints** section to show the builder what API operations are available, and the **Models** section to show the fields for each resource.

Ask:
> "Which resource(s) do you need to expose? Here's what's available in `{{category}}`:"

List the available resources by deriving them from the **Endpoints** section of the schema file (not the Models section, which includes helper types that are not buildable resources). Use the resource slugs from the endpoint paths (e.g., `/unified/hris/employees` → `employees`, `/unified/hris/groups/departments` → `departments`). Save these slugs directly to session since later steps use them for action names and file paths.

Once resources are chosen, show the fields table for each from the loaded schema file.

Ask:
> "Do these fields cover your needs, or are there fields in your use case that aren't listed here?"

If fields are missing, note them — they may need custom field mapping or a different resource.

Save to session:
```json
{
  "schema_source": "builtin",
  "schema": "<category>",
  "schema_file": "references/schemas/<category>.md",
  "resources": ["<resource1>", "<resource2>"],
  "schema_fields": []
}
```

---

## Path B: Import from schema document

Execute the full `/import-schema` skill logic inline.

This handles CSV, JSON, YAML, TSV, plain field lists, and any tabular file. It will:
1. Read the file at the path the builder provides
2. Parse field names and infer types from structure or sample data
3. Flag likely enum fields and collect their allowed values
4. Present the parsed schema for the builder to review and correct
5. Save `schema_fields` to session

Once `/import-schema` completes, the session will have `schema_source: "imported"` and the full `schema_fields` array. Continue to the **Handoff** section below.

---

## Path C: Define custom schema interactively

Explain:
> "Let's define your schema field by field. For each field I'll ask for:
> - **Name** — the field key in your output (e.g., `first_name`)
> - **Type** — string, number, boolean, date, datetime, enum, array, object
> - **Required** — yes or no
>
> For enum fields I'll also ask for the allowed values. Type `done` when finished."

Collect fields one at a time. For `enum` types, ask for the allowed values. For `array` types, ask for the item type.

Show a running summary after each field is added.

When done, present the full schema:
> "Here's your schema:
>
> | Field | Type | Required |
> |-------|------|---------|
> | `id` | string | yes |
> | `status` | enum (active, inactive) | yes |
> | ... |
>
> Does this look right?"

Save to session:
```json
{
  "schema_source": "custom",
  "schema": "custom",
  "resources": ["custom"],
  "schema_fields": [
    { "name": "id", "type": "string", "required": true },
    { "name": "status", "type": "enum", "required": true, "enum_values": ["active", "inactive"] }
  ]
}
```

---

## Handoff

After saving the session file, confirm:
> "Schema saved. ✓
>
> **Provider:** `{{provider}}`
> **Schema:** `{{schema}}` ({{schema_source}})
> **Resources:** {{resources}}
>
> Next step: check if your connector already exists and set up the project.
> Run `/check-connector` to continue."

Update `session_step` to `"check-connector"` in the session file.
