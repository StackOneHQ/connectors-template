---
name: Unified Field Mapping
trigger: field mapping|fieldConfigs|enumMapper|map fields|schema mapping|type mapping
description: Detailed guide for mapping provider fields to unified schemas using fieldConfigs, enumMappers, and transformation patterns.
---

# Unified Field Mapping Skill

**When to use**: User needs to configure field mappings between provider responses and unified output schemas, translate enum values, handle nested objects, or transform data types.

## Core Principles

### 1. ALWAYS Return Standardized Data

**The entire purpose of a unified connector is to return data in the customer's schema.** Never suggest that users handle field mapping in their application code - this defeats the purpose of building a unified connector.

### 2. Use Inline Fields in map_fields Parameters (RECOMMENDED)

**PRINCIPLE**: Pass `fields` directly in the `map_fields` step parameters rather than relying on action-level `fieldConfigs`. This is more reliable and avoids schema inference issues.

```yaml
# RECOMMENDED - Inline fields in map_fields parameters
- stepId: map_data
  stepFunction:
    functionName: map_fields
    version: '2'
    parameters:
      fields:
        - targetFieldKey: email
          expression: $.email
          type: string
        - targetFieldKey: employee_id
          expression: $.id
          type: string
        - targetFieldKey: department
          expression: $.work.department
          type: string
      dataSource: $.steps.get_employees.output.data
```

**Why this approach?** Action-level `fieldConfigs` can trigger schema inference that adds unwanted properties (like `requiredScopes`), causing build failures. Inline fields bypass this.

### 3. Expression Context Differs by Location

**CRITICAL**: The expression format depends on WHERE the fields are defined:

| Location | Expression Format | Example |
|----------|------------------|---------|
| Inline in map_fields `parameters.fields` | Reference fields within each record | `$.email`, `$.work.department` |
| Action-level `fieldConfigs` | Prefix with step ID | `$.get_employees.email` |

```yaml
# INLINE fields (in map_fields parameters) - NO step prefix
fields:
  - targetFieldKey: email
    expression: $.email              # Direct field reference
  - targetFieldKey: department
    expression: $.work.department    # Nested field reference

# ACTION-LEVEL fieldConfigs - WITH step prefix
fieldConfigs:
  - targetFieldKey: email
    expression: $.get_employees.email        # Step prefix required
  - targetFieldKey: department
    expression: $.get_employees.work.department
```

## Complete Field Mapping Example

Here's a complete working example mapping HiBob employee data to a custom schema:

```yaml
steps:
  - stepId: get_employees
    description: Fetch employees from API
    stepFunction:
      functionName: paginated_request
      parameters:
        url: /v1/people/search
        method: post
        args:
          - name: fields
            value:
              - root.id
              - root.email
              - work.department
              - work.title
              - work.site
              - work.reportsToIdInCompany
            in: body
          - name: humanReadable
            value: REPLACE
            in: body
        response:
          dataKey: employees
          nextKey: nextCursor
        iterator:
          key: cursor
          in: body

  - stepId: map_data
    description: Map provider fields to custom schema
    stepFunction:
      functionName: map_fields
      version: '2'
      parameters:
        fields:
          - targetFieldKey: email
            expression: $.email
            type: string
          - targetFieldKey: employee_id
            expression: $.id
            type: string
          - targetFieldKey: department
            expression: $.work.department
            type: string
          - targetFieldKey: job_title
            expression: $.work.title
            type: string
          - targetFieldKey: location
            expression: $.work.site
            type: string
          - targetFieldKey: manager_id
            expression: $.work.reportsToIdInCompany
            type: string
        dataSource: $.steps.get_employees.output.data

  - stepId: typecast_data
    description: Apply types to mapped data
    stepFunction:
      functionName: typecast
      version: '2'
      parameters:
        fields:
          - targetFieldKey: email
            type: string
          - targetFieldKey: employee_id
            type: string
          - targetFieldKey: department
            type: string
          - targetFieldKey: job_title
            type: string
          - targetFieldKey: location
            type: string
          - targetFieldKey: manager_id
            type: string
        dataSource: $.steps.map_data.output.data

result:
  data: $.steps.typecast_data.output.data
```

**Output** (transformed to customer schema):
```json
{
  "email": "alan.tullin@example.com",
  "employee_id": "3221323653106893582",
  "department": "Client Services",
  "job_title": "Account Manager",
  "location": "New York (Demo)",
  "manager_id": "30"
}
```

## Field Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text values | Names, IDs, emails |
| `number` | Numeric values | Counts, amounts |
| `boolean` | True/false | is_active |
| `datetime_string` | ISO date strings | hire_date |
| `enum` | Constrained values | status (requires enumMapper) |
| `object` | Nested structure | work_location |

## Enum Mapping (enumMapper)

### When to Use

Use `enumMapper` when:
- Provider values differ from your schema values
- You need to normalize inconsistent provider data
- Translating codes to human-readable values

### Basic Enum Mapping (Inline)

```yaml
fields:
  - targetFieldKey: employment_status
    expression: $.status
    type: enum
    enumMapper:
      matcher:
        - matchExpression: '{{$.status == "Active"}}'
          value: active
        - matchExpression: '{{$.status == "Inactive"}}'
          value: inactive
        - matchExpression: '{{$.status == "Terminated"}}'
          value: terminated
        - matchExpression: '{{$.status == null}}'
          value: unknown
```

### Case-Insensitive Matching

```yaml
enumMapper:
  matcher:
    # Handle "ACTIVE", "Active", "active"
    - matchExpression: '{{$.status.toLowerCase() == "active"}}'
      value: active
```

### Multiple Source Values to Single Target

```yaml
enumMapper:
  matcher:
    # Both "Full-Time" and "FT" map to "full_time"
    - matchExpression: '{{$.type == "Full-Time" || $.type == "FT"}}'
      value: full_time
```

### Built-in Mappers

```yaml
- targetFieldKey: file_format
  expression: '{{$.fullFileExtension || $.mimeType}}'
  type: enum
  enumMapper:
    matcher: 'document_file_format_from_extension'
```

### Always Include Null/Unknown Handler

```yaml
enumMapper:
  matcher:
    - matchExpression: '{{$.status == "Active"}}'
      value: active
    - matchExpression: '{{$.status == "Inactive"}}'
      value: inactive
    # ALWAYS include null/unknown fallback
    - matchExpression: '{{$.status == null || $.status == ""}}'
      value: unknown
```

## Nested Objects

### Simple Nested Object (Inline)

```yaml
fields:
  - targetFieldKey: city
    expression: $.location.city
    type: string
  - targetFieldKey: country
    expression: $.location.country
    type: string
```

### Flattening Nested Provider Data

When provider returns nested data but your schema is flat:

```yaml
# Provider response: { "work": { "department": "Sales", "title": "Manager" } }
# Your schema: { "department": "...", "job_title": "..." }

fields:
  - targetFieldKey: department
    expression: $.work.department
    type: string
  - targetFieldKey: job_title
    expression: $.work.title
    type: string
```

## Array Fields

### Simple Array

```yaml
fields:
  - targetFieldKey: email_addresses
    expression: $.emails[*]
    type: string
    array: true
```

### JEXL Array Operations

```yaml
fields:
  - targetFieldKey: export_formats
    expression: '{{keys(exportLinks)}}'
    type: string
    array: true
```

## Computed/Transformed Fields

### JEXL Transformations

```yaml
fields:
  # Fallback value
  - targetFieldKey: file_format
    expression: '{{$.fullFileExtension || $.mimeType}}'
    type: string

  # Conditional logic
  - targetFieldKey: default_download_format
    expression: '{{exportLinks ? (keys(exportLinks)[0] || "application/pdf") : $.mimeType}}'
    type: string

  # Boolean check
  - targetFieldKey: is_exportable
    expression: '{{$.exportLinks != null}}'
    type: boolean
```

## Handling Missing Fields

When your schema requires a field the provider doesn't have:

1. **Document the limitation** in action details
2. **Omit the field** from mapping (it won't appear in output)
3. **Never suggest user-side mapping** as a workaround

```yaml
details: |
  Returns employee data mapped to custom schema.
  Note: country field is not available from this provider's API.
```

## Two Approaches Comparison

### Approach 1: Inline Fields (RECOMMENDED)

```yaml
steps:
  - stepId: map_data
    stepFunction:
      functionName: map_fields
      version: '2'
      parameters:
        fields:
          - targetFieldKey: email
            expression: $.email    # Direct reference, no step prefix
            type: string
        dataSource: $.steps.get_data.output.data
```

**Pros**: Reliable, no schema inference issues, explicit
**Cons**: More verbose, fields defined at step level

### Approach 2: Action-Level fieldConfigs

```yaml
fieldConfigs:
  - targetFieldKey: email
    expression: $.get_data.email    # Requires step prefix
    type: string

steps:
  - stepId: map_data
    stepFunction:
      functionName: map_fields
      version: '2'
      parameters:
        dataSource: $.steps.get_data.output.data
```

**Pros**: Fields defined once at action level
**Cons**: Can trigger schema inference issues, may cause build failures with certain field names

## Version Requirements

**ALWAYS use version '2' for map_fields and typecast:**

```yaml
stepFunction:
  functionName: map_fields
  version: '2'          # REQUIRED - don't omit or use version '1'
  parameters:
    ...
```

Without `version: '2'`, the mapping may produce empty results.

## Common Mistakes and Fixes

### Mistake 1: Wrong Expression Context

```yaml
# WRONG - Using step prefix in inline fields
parameters:
  fields:
    - expression: $.get_employees.email    # Don't use step prefix here!

# CORRECT - Direct field reference in inline fields
parameters:
  fields:
    - expression: $.email
```

### Mistake 2: Missing Version

```yaml
# WRONG - No version specified
stepFunction:
  functionName: map_fields
  parameters: ...

# CORRECT - Version 2 specified
stepFunction:
  functionName: map_fields
  version: '2'
  parameters: ...
```

### Mistake 3: Suggesting User-Side Mapping

```yaml
# WRONG approach - Never do this
# "The connector returns raw data, handle mapping in your application"

# CORRECT approach - Always map to the schema
# Include map_fields step to transform data to customer's schema
```

### Mistake 4: Using Provider Field Names

```yaml
# WRONG - Using provider field names
- targetFieldKey: firstName    # Provider's naming

# CORRECT - Using YOUR schema field names
- targetFieldKey: first_name   # Your schema naming
```

## Debugging Field Mappings

### 1. Check Raw Response First

```bash
stackone run --debug --connector <file> --credentials <file> --action-id list_employees
```

### 2. Verify Response Structure

Examine the debug output to understand:
- Exact field paths (e.g., `$.work.department` vs `$.department`)
- Nesting levels
- Field names and types

### 3. Test Incrementally

If mapping produces empty results:
1. First return raw data (remove map_fields/typecast steps)
2. Verify raw data structure
3. Add map_fields with one field
4. Verify that field maps correctly
5. Add remaining fields

## Validation Checklist

Before finalizing field mappings:

- [ ] Using inline `fields` in map_fields parameters (recommended approach)
- [ ] Expressions use correct context (no step prefix for inline fields)
- [ ] `version: '2'` specified for map_fields and typecast
- [ ] All `targetFieldKey` values match YOUR schema field names
- [ ] All enum fields have `enumMapper` with null handler
- [ ] typecast step includes all mapped fields
- [ ] Output matches expected schema structure
- [ ] No suggestion for user-side mapping

## Related Skills

- **Unified Connector Build Skill**: Overall unified connector workflow
- **Unified Scope Decisions Skill**: Scope-related field access
- **Falcon Technical Reference Skill**: JEXL and JSONPath syntax
