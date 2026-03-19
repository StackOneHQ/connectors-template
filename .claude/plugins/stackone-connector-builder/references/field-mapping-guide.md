````markdown
# Field Mapping Guide

Detailed reference for writing `fieldConfigs` in unified connectors.
Used by the `map-fields` sub-skill.

## The Golden Rule

`targetFieldKey` is ALWAYS your schema field name — NEVER the provider's field name.

```yaml
# CORRECT — targetFieldKey uses your schema name
- targetFieldKey: first_name
  expression: "$.firstName"

# WRONG — targetFieldKey uses the provider's name
- targetFieldKey: firstName
  expression: "$.firstName"
```

---

## Expression Types

### Direct JSONPath
```yaml
- targetFieldKey: id
  expression: "$.id"

- targetFieldKey: first_name
  expression: "$.firstName"
```

### Nested path
```yaml
- targetFieldKey: department_name
  expression: "$.department.name"

- targetFieldKey: work_email
  expression: "$.contact.emails[0].value"
```

### JEXL expression (computed or conditional)

Wrap JEXL in single-quotes with double-curly-brace syntax:

```yaml
# Combine two fields into one
- targetFieldKey: display_name
  expression: "'{{$.firstName}} {{$.lastName}}'"

# Fallback — use second value if first is null/undefined
- targetFieldKey: email
  expression: "'{{$.workEmail || $.personalEmail}}'"

# Conditional
- targetFieldKey: is_active
  expression: "'{{$.status === \"active\" ? true : false}}'"
```

### Array of primitive values
```yaml
- targetFieldKey: tags
  expression: "$.tags"
  array: true
```

---

## Enum Mapping

Translate provider-specific values to your schema's enum values:

```yaml
- targetFieldKey: employment_status
  expression: "$.status"
  enumMapper:
    # provider_value: schema_value
    active: active
    inactive: inactive
    terminated: inactive
    on_leave: leave
    pending_hire: pending
```

**Important:** Keys are case-sensitive and must match the provider's exact values.

For complex logic, use `matchExpression` (JEXL):
```yaml
- targetFieldKey: gender
  expression: "$.gender"
  enumMapper:
    matchExpression: "'{{$.gender === \"M\" ? \"male\" : $.gender === \"F\" ? \"female\" : \"other\"}}'"
```

---

## Nested Object Mapping

For schema fields that are objects (e.g., `department: { id, name }`):

```yaml
- targetFieldKey: department
  objectMapping:
    id:
      expression: "$.departmentId"
    name:
      expression: "$.departmentName"
```

If the provider returns the nested object directly:
```yaml
- targetFieldKey: department
  expression: "$.department"
  objectMapping:
    id:
      expression: "$.id"
    name:
      expression: "$.name"
```

---

## Array of Objects Mapping

For schema fields that are arrays of objects (e.g., `phone_numbers: [{ type, value }]`):

```yaml
- targetFieldKey: phone_numbers
  array: true
  expression: "$.phones"
  objectMapping:
    type:
      expression: "$.phoneType"
    value:
      expression: "$.phoneNumber"
```

---

## Common Provider-to-Schema Field Patterns

| Provider Pattern | Schema Field | Expression | Notes |
|----------------|-------------|-----------|-------|
| `firstName` | `first_name` | `$.firstName` | camelCase → snake_case |
| `first_name` | `first_name` | `$.first_name` | already snake_case |
| `properties.email` | `work_email` | `$.properties.email` | HubSpot-style nested |
| `emails[0]` | `work_email` | `$.emails[0]` | First item of array |
| `contact.phone` | `phone` | `$.contact.phone` | Nested path |
| Unix timestamp | `created_at` | `$.created_at` | typecast handles conversion |
| ISO date string | `hire_date` | `$.hireDate` | typecast handles conversion |
| `department.id` + `department.name` | `department` | objectMapping pattern | |

---

## Required Step Functions for Unified Actions

All unified actions MUST include all three steps in this exact order:

```yaml
steps:
  - type: request        # 1. Fetch data from provider API
    id: fetch_data

  - type: map_fields     # 2. Apply fieldConfigs transformations
    version: 2
    id: map_fields

  - type: typecast       # 3. Convert types to match schema (dates, numbers, etc.)
    version: 2
    id: typecast
```

Non-unified (`actionType: custom`) actions only need the `request` step.

---

## Debugging Field Mapping Issues

### See the raw provider response
```bash
npx @stackone/cli test <provider> <action> --debug
```
This shows exactly what the provider returns before any mapping. Use it to find the correct JSONPath.

### Field is null in output
1. Check the JSONPath against the raw response — is the field actually there?
2. Is the field nested? Try `$.nested.field` or `$.items[0].field`
3. Does the provider only return this field sometimes? Handle with JEXL fallback.

### Enum value passes through unmapped
- Check that the `enumMapper` key matches the provider's exact value (case-sensitive)
- Use `--debug` to see the raw enum value coming from the provider

### Date field is wrong format
- Ensure `typecast` step is present — it handles date/datetime conversions
- Ensure the schema field type is `date` or `datetime`, not `string`

### Nested object is empty
- Verify `objectMapping` is at the same level as `targetFieldKey`
- Check the expression points to the right parent object in the raw response
````
