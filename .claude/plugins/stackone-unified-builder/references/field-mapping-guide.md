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

For complex logic, use `enumMapper.matcher[]` with `matchExpression` (JEXL):
```yaml
- targetFieldKey: gender
  expression: "$.gender"
  type: enum
  enumMapper:
    matcher:
      - matchExpression: '{{$.gender == "M"}}'
        value: male
      - matchExpression: '{{$.gender == "F"}}'
        value: female
      - matchExpression: '{{$.gender != "M" && $.gender != "F"}}'
        value: other
```

---

## Nested Object Mapping

> ⚠️ **`objectMapping` is NOT supported** in the `map_fields` step's `parameters.fields`. The validator will reject it. Use inline block scalar expressions instead.

### Provider returns a nested object directly

When the provider's response already contains the nested object (e.g., `$.location`), pass it through:

```yaml
- targetFieldKey: work_location
  expression: "$.location"
  type: object
```

### Provider returns flat fields that must be composed into an object

Use a YAML block scalar (`|`) with a JSON object literal. Fields are referenced with JSONPath syntax:

```yaml
- targetFieldKey: home_location
  type: object
  expression: |
    {
      "street_1": $.address1,
      "street_2": $.address2,
      "city": $.city,
      "zip_code": $.zipCode,
      "country": $.country
    }
```

This works in both single-step and multi-step (`group_data`) contexts. In a `group_data` context, prefix field paths with the step ID: `$.fetch_employee.address1`.

---

## Array of Objects Mapping

> ⚠️ **`objectMapping` with `array: true` is NOT supported.** Use the patterns below instead.

### Provider returns an array directly (pass-through)

When the provider returns the array in the right shape, pass it through:

```yaml
- targetFieldKey: bank_details
  expression: "$.bankAccounts"
  type: object
```

In a `group_data` context, reference the step's array field:

```yaml
- targetFieldKey: bank_details
  expression: $.fetch_bank_details.data
  type: object
```

### Construct a synthetic array from scalar fields

When the provider stores data as flat fields but the schema expects an array (e.g., a single SSN that must become `national_identity_numbers`), use a block scalar to build the array literal:

```yaml
- targetFieldKey: national_identity_numbers
  type: object
  expression: |
    [{
      "value": $.fetch_employee.ssn,
      "type": "ssn"
    }]
```

### Construct a synthetic single-record array from multiple fields

When the schema expects an array of objects but the provider surfaces that data as flat fields on the resource (e.g., employment status and dates on the employee record):

```yaml
- targetFieldKey: employments
  type: object
  expression: |
    [{
      "active": '{{$.fetch_employee.employmentHistoryStatus == "Active" ? true : false}}',
      "effective_date": $.fetch_employee.hireDate,
      "end_date": $.fetch_employee.terminationDate
    }]
```

---

## Multi-Step Fetching with `group_data`

When a resource needs data from multiple endpoints (e.g., an employee + their bank accounts + their job history), use the `group_data` step to combine results before mapping.

### Step structure

```yaml
steps:
  - stepId: fetch_employee
    stepFunction:
      functionName: request
      parameters:
        url: /employees/${inputs.id}
        method: get

  - stepId: fetch_bank_details
    stepFunction:
      functionName: request
      parameters:
        url: /employees/${inputs.id}/tables/directDeposit
        method: get
        customErrors:
          - receivedStatus: 404
            targetStatus: 200
            message: No bank details found

  - stepId: group_employee_data
    stepFunction:
      functionName: group_data
      parameters:
        stepsDataToGroup:
          - fetch_employee
          - fetch_bank_details
        isSingleRecord: true

  - stepId: map_employee_data
    stepFunction:
      functionName: map_fields
      version: '2'
      parameters:
        dataSource: $.steps.group_employee_data.output.data
        fields:
          - targetFieldKey: id
            expression: $.fetch_employee.id        # prefix = stepId
          - targetFieldKey: bank_details
            expression: $.fetch_bank_details.data  # array from second step
            type: object
```

**Key rules:**
- `stepsDataToGroup` lists the `stepId` values to merge
- `isSingleRecord: true` when combining data for a single resource (get actions)
- After grouping, each field is accessed as `$.{stepId}.{field}` in `expression`
- The `dataSource` for `map_fields` is always `$.steps.{groupStepId}.output.data`
- Always add `customErrors` on optional sub-resource fetches to handle 404s gracefully

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
| Flat address fields → object | `home_location` | block scalar `{...}` | See nested object section |
| Single value → array | `national_identity_numbers` | block scalar `[{...}]` | See array section |
| Sub-resource array | `bank_details` | `$.fetch_step.data` via group_data | See multi-step section |

---

## Required Step Functions for Unified Actions

All unified actions MUST include all three steps in this exact order:

```yaml
steps:
  - stepId: fetch_data
    stepFunction:
      functionName: request      # 1. Fetch data from provider API

  - stepId: map_fields
    stepFunction:
      functionName: map_fields   # 2. Apply field transformations
      version: '2'

  - stepId: typecast
    stepFunction:
      functionName: typecast     # 3. Convert types (dates, numbers, etc.)
      version: '2'
```

Multi-step actions add `group_data` between the last `request` step and `map_fields`.

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
3. In a `group_data` context — are you using `$.stepId.field` not `$.field`?
4. Does the provider only return this field sometimes? Handle with JEXL fallback.

### Enum value passes through unmapped
- Check that the `enumMapper` key matches the provider's exact value (case-sensitive)
- Use `--debug` to see the raw enum value coming from the provider

### Date field is wrong format
- Ensure `typecast` step is present — it handles date/datetime conversions
- Ensure the schema field type is `datetime_string`, not `string`

### Nested object is empty
- Do NOT use `objectMapping` — it is not supported by the validator
- Use the inline block scalar `expression: |` pattern instead
- In `group_data` context, confirm the step ID prefix is correct
````
