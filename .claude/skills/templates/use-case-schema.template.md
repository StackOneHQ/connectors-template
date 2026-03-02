---
name: [Use Case Name] Schema
description: Target schema for [use case description] connectors
category: [hris|ats|crm|lms|ticketing|marketing|documents|iam]
version: 1.0.0
---

# [Use Case Name] Schema

## How to Use This Template

1. Copy this file to `.claude/skills/schemas/[your-use-case]-schema.md`
2. Replace all `[bracketed placeholders]` with your actual values
3. Define your fields, types, and enum mappings
4. The schema skill will auto-trigger when you run `start unified build for [provider]`

---

## Business Context

[Describe the business use case for this schema. What problem does it solve? What systems will consume this data?]

**Example:**
> Employee directory sync for internal tooling. This schema powers our company directory, org chart, and access management systems.

---

## Target Schema

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| id | string | yes | Unique identifier from the provider |
| [field_name] | [type] | [yes/no] | [description] |

### Supported Types

- `string` - Text values
- `number` - Numeric values (integers or decimals)
- `boolean` - True/false values
- `enum` - Predefined set of values (define in Enum Definitions section)
- `datetime_string` - ISO 8601 formatted date/time
- `object` - Nested object (define properties below)
- `array` - Use the base type + note "array" in Notes column

### Nested Object Example

If you have nested objects, define them like this:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| address | object | no | Physical address |
| address.street | string | no | Street address |
| address.city | string | no | City name |
| address.country | string | no | ISO country code |

---

## Enum Definitions

For each enum field in your schema, define the mapping from provider values to your schema values.

### [enum_field_name]

| Provider Values | Schema Value |
|-----------------|--------------|
| [value1, VALUE1, Value1] | [normalized_value] |
| [value2, VALUE2, Value2] | [normalized_value] |
| * (default) | unknown |

**Example - employment_status:**

| Provider Values | Schema Value |
|-----------------|--------------|
| Active, active, ACTIVE, 1, true | active |
| Inactive, inactive, INACTIVE, 0, false | inactive |
| Terminated, terminated, TERMINATED, fired, Fired | terminated |
| OnLeave, on_leave, ON_LEAVE, leave | on_leave |
| * (default) | unknown |

---

## Field Mapping Hints (Optional)

Provider-agnostic hints to help with mapping. These are common patterns across providers.

| Schema Field | Common Provider Paths |
|--------------|----------------------|
| email | `email`, `workEmail`, `work_email`, `primaryEmail` |
| first_name | `firstName`, `first_name`, `givenName`, `name.first` |
| department | `department`, `work.department`, `employmentDetails.department` |

---

## Scope Preferences (Optional)

If you have preferences about API scopes/permissions:

- **Prefer narrow scopes**: Only request read access unless write is needed
- **Avoid broad scopes**: Don't use admin-level scopes for read-only operations
- **Document elevated scopes**: If a field requires elevated permissions, note it

| Field | Minimum Scope Required |
|-------|----------------------|
| [field] | [scope description] |

---

## Example Schema: HRIS Employee Sync

Below is a complete example you can reference:

```yaml
schema:
  name: employees
  use_case: Employee directory sync
  fields:
    - name: id
      type: string
      required: true
      notes: Provider's unique employee identifier

    - name: email
      type: string
      required: true
      notes: Work email preferred, personal email as fallback

    - name: first_name
      type: string
      required: true

    - name: last_name
      type: string
      required: true

    - name: display_name
      type: string
      required: false
      notes: Full display name, computed if not provided

    - name: employment_status
      type: enum
      required: true
      values: [active, inactive, terminated, on_leave, unknown]

    - name: job_title
      type: string
      required: false

    - name: department
      type: string
      required: false

    - name: manager_id
      type: string
      required: false
      notes: Reference to another employee's id

    - name: hire_date
      type: datetime_string
      required: false
      notes: ISO 8601 format

    - name: work_location
      type: object
      required: false
      properties:
        - name: city
          type: string
        - name: state
          type: string
        - name: country
          type: string
```
