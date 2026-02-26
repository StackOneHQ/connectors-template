---
name: Unified Connector Build
trigger: unified connector|standardized connector|schema mapping|build unified|customer connector
description: Complete workflow for building unified/standardized connectors that map provider data to customer-defined schemas with consistent pagination and cursor handling.
---

# Unified Connector Build Skill

**When to use**: User asks to build a connector that maps provider data to a specific output schema, needs standardized responses across providers, or wants unified pagination/cursor handling.

**Key Difference from Custom Connectors**: Unified connectors transform provider-specific data into a standardized schema defined by the customer. Custom connectors return raw provider data.

## Prerequisites

- Customer-defined output schema (fields, types, required vs optional)
- Provider name/API identified
- StackOne CLI installed (`@stackone/cli`)
- Access to provider API documentation

## Fundamental Principles

### 1. All Config Field Names Use camelCase

Every configuration field in Falcon YAML uses camelCase, not snake_case:

```yaml
# CORRECT
scopeDefinitions:      fieldConfigs:         targetFieldKey:
enumMapper:            matchExpression:      dataKey:
nextKey:               pageSize:             indexField:
stepFunction:          functionName:         dataSource:

# WRONG - Will cause silent failures or validation errors
scope_definitions:     field_configs:        target_field_key:
```

### 2. Schema Field Names Use YOUR Naming Convention

While config fields are camelCase, YOUR schema's `targetFieldKey` values should match YOUR schema definition (often snake_case for API responses):

```yaml
fieldConfigs:
  - targetFieldKey: first_name    # YOUR schema field (can be snake_case)
    expression: $.get_employees.firstName  # Provider's field (whatever they use)
```

### 3. Verify Every Path Against Raw Response

Never assume response structure. Always verify with `--debug`:

```bash
stackone run --debug --connector <file> --credentials <file> --action-id <action>
```

## When to Build Unified vs Custom

| Criteria | Unified | Custom |
|----------|---------|--------|
| Output format | Standardized schema | Raw provider data |
| Field names | Customer-defined (e.g., `first_name`) | Provider-specific (e.g., `givenName`) |
| Pagination | Unified cursor | Provider-specific |
| Multiple providers | Same schema across all | Different per provider |
| Use case | Reduce integration work | Maximum flexibility |

## 9-Step Unified Connector Workflow

### Step 1: Define Output Schema First

**CRITICAL**: Always start with the output schema before researching provider APIs.

```yaml
# Document the expected output schema
# Example: HRIS Employee Schema
schema:
  name: employees
  fields:
    - name: id
      type: string
      required: true
    - name: first_name
      type: string
      required: true
    - name: last_name
      type: string
      required: true
    - name: email
      type: string
      required: true
    - name: employment_status
      type: enum
      values: [active, inactive, terminated, unknown]
      required: true
    - name: department
      type: string
      required: false
    - name: hire_date
      type: datetime_string
      required: false
    - name: work_location
      type: object
      required: false
      properties:
        - name: city
          type: string
        - name: country
          type: string
```

**Schema Checklist**:
- [ ] All required fields identified
- [ ] Field types specified (string, number, enum, datetime_string, object)
- [ ] Enum values defined for enum fields
- [ ] Nested object structures documented
- [ ] Array fields marked with `array: true`

### Step 2: Research Provider Endpoints

**Goal**: Find the best endpoint(s) to fulfill the schema requirements.

#### A. Evaluate Endpoints Against Trade-offs

| Trade-off | Preference | Rationale |
|-----------|------------|-----------|
| **Scopes** | Narrower is better | Easier customer approval, less security risk |
| **Requests** | Fewer is better | Better performance, lower rate limit impact |
| **Data depth** | Required fields first | Critical fields must be present |

#### B. Endpoint Selection Decision Tree

```
1. Does ONE endpoint return ALL required fields?
   ├─ YES → Use single endpoint (ideal)
   └─ NO → Continue to #2

2. Can required fields be obtained with 2 endpoints?
   ├─ YES → Use group_data to combine
   └─ NO → Continue to #3

3. Do additional endpoints require broader scopes?
   ├─ YES → Document scope trade-off, ask customer
   └─ NO → Add endpoints as needed

4. Are any endpoints deprecated?
   ├─ YES → NEVER use deprecated endpoints
   │        Find alternative or document limitation
   └─ NO → Proceed with selected endpoints
```

#### C. Document Endpoint Analysis

```markdown
## Endpoint Analysis: [Provider]

### Option A: /v2/employees (Recommended)
- Scopes: `employees:read`
- Returns: id, first_name, last_name, email, status
- Missing: department, hire_date
- Pagination: cursor-based (next_cursor field)

### Option B: /v2/employees/detailed
- Scopes: `employees:read`, `org:read`
- Returns: All fields including department, hire_date
- Trade-off: Requires additional `org:read` scope

### Option C: /v1/employees (DEPRECATED)
- Status: DEPRECATED - DO NOT USE
- Scheduled removal: Q3 2024
```

### Step 3: Analyze Scope Requirements

**See Unified Scope Decisions Skill** for complete framework.

**Quick Scope Checklist**:
- [ ] List all scopes required for selected endpoints
- [ ] Identify minimum scopes for required fields
- [ ] Document additional scopes for optional fields
- [ ] Check if narrower scopes exist (e.g., `read` vs `read_write`)
- [ ] Verify scopes are not deprecated

**Scope Definition Format** (use `scopeDefinitions`, NOT `scope_definitions`):

```yaml
scopeDefinitions:
  employees:read:
    description: Read access to employee data
  employees:read_extended:
    description: Extended employee data including department
    includes: employees:read
  org:read:
    description: Read access to organization structure
```

### Step 4: Map Fields to Schema

**See Unified Field Mapping Skill** for detailed patterns.

#### CRITICAL: Use Inline Fields in map_fields Parameters

**PRINCIPLE**: Pass `fields` directly in the `map_fields` step parameters rather than using action-level `fieldConfigs`. This is more reliable and avoids schema inference issues that can cause build failures.

```yaml
# RECOMMENDED - Inline fields in map_fields parameters
- stepId: map_data
  stepFunction:
    functionName: map_fields
    version: '2'
    parameters:
      fields:
        - targetFieldKey: email
          expression: $.email           # Direct reference, NO step prefix
          type: string
        - targetFieldKey: employee_id
          expression: $.id
          type: string
        - targetFieldKey: department
          expression: $.work.department  # Nested field reference
          type: string
      dataSource: $.steps.get_employees.output.data
```

**Why inline fields?** Action-level `fieldConfigs` can trigger schema inference that adds unwanted properties (like `requiredScopes`), causing build failures. Inline fields bypass this issue entirely.

#### Expression Context Rules

| Location | Expression Format | Example |
|----------|------------------|---------|
| Inline in `parameters.fields` | Direct field reference | `$.email`, `$.work.department` |
| Action-level `fieldConfigs` | Step ID prefix required | `$.get_employees.email` |

#### Enum Mapping Example

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
        - matchExpression: '{{$.status == null}}'
          value: unknown
```

**Mapping Rules**:
1. **targetFieldKey**: Always use YOUR schema field names
2. **expression**: For inline fields, reference fields within each record (no step prefix)
3. **type**: Must match your schema definition
4. **version**: ALWAYS use `version: '2'` for map_fields and typecast

### Step 5: Configure Unified Pagination

**PRINCIPLE**: Always implement cursor pagination for list endpoint unified actions. Never assume response structure - verify ALL paths with `--debug`.

#### Action-Level Configuration

```yaml
cursor:
  enabled: true
  pageSize: 50  # Must be within API's max limit
```

#### RECOMMENDED: Use `request` Function with Manual Cursor Handling

**IMPORTANT**: Use the standard `request` function (not `paginated_request`) when you need dynamic inputs like `page_size` to pass through correctly. The `paginated_request` function can have issues with `$.inputs.*` resolving to `undefined`.

```yaml
inputs:
  - name: page_size
    description: Maximum number of items to return per page
    type: number
    in: query
    required: false
  - name: cursor
    description: Pagination cursor for fetching the next page of results
    type: string
    in: query
    required: false

steps:
  - stepId: get_data
    description: Fetch data from API
    stepFunction:
      functionName: request
      parameters:
        url: /items
        method: get
        args:
          # Use dual-condition pattern for defaults
          - name: limit
            value: $.inputs.page_size
            in: query
            condition: "{{present(inputs.page_size)}}"
          - name: limit
            value: 50
            in: query
            condition: "{{!present(inputs.page_size)}}"
          # Pass cursor when present
          - name: cursor
            value: $.inputs.cursor
            in: query
            condition: "{{present(inputs.cursor)}}"

result:
  data: $.steps.typecast_data.output.data
  next: $.steps.get_data.output.data.meta.nextCursor  # Return cursor for next page
```

**Key Pattern - Dual-Condition for Defaults**:
- One arg with input value when present: `condition: "{{present(inputs.page_size)}}"`
- Another arg with default when not present: `condition: "{{!present(inputs.page_size)}}"`

#### Alternative: `paginated_request` Function

Use `paginated_request` only when you don't need dynamic input parameters:

```yaml
stepFunction:
  functionName: paginated_request
  parameters:
    url: /v2/employees
    method: get
    response:
      dataKey: data.employees       # EXACT path to data array
      nextKey: meta.pagination.next # EXACT path to cursor
      indexField: id                # Unique identifier in each record
    iterator:
      key: page_token               # API's expected parameter NAME
      in: query                     # WHERE to send cursor (query/body/headers)
```

#### Pagination Configuration Checklist

Before testing, verify EVERY field:

| Field | What to Verify | How to Verify |
|-------|----------------|---------------|
| `cursor.enabled` | Set to `true` for list actions | Action config |
| `cursor.pageSize` | Within API's max limit | Check API documentation |
| `inputs.page_size` | Optional input for user control | Action inputs |
| `inputs.cursor` | Optional input for pagination | Action inputs |
| `result.next` | Returns cursor for next page | Check result block |
| `dataKey` path | Exact path to data array | `--debug` output |
| `nextKey` path | Exact path to cursor value | `--debug` output |

**When using `paginated_request`** (only if no dynamic inputs needed):

| Field | What to Verify | How to Verify |
|-------|----------------|---------------|
| `response.dataKey` | Exact path to data array | `--debug` output |
| `response.nextKey` | Exact path to cursor value | `--debug` output |
| `response.indexField` | Field exists in every record | `--debug` output |
| `iterator.key` | API's expected parameter name | API documentation |
| `iterator.in` | Where API expects cursor | API documentation |

#### Verification Process

```bash
# 1. Get raw response to verify structure
stackone run --debug \
  --connector <file> \
  --credentials <file> \
  --action-id list_employees

# 2. Examine response structure
# If response is:
# {
#   "data": {
#     "employees": [...],
#     "meta": { "next_page": "abc123" }
#   }
# }
#
# Then:
#   dataKey: data.employees     (NOT employees)
#   nextKey: data.meta.next_page (NOT next_page or meta.next_page)
```

#### Common Mistakes

| Mistake | Example | Fix |
|---------|---------|-----|
| Using `paginated_request` with dynamic inputs | `$.inputs.page_size` resolves to `undefined` | Use `request` function with dual-condition pattern |
| Missing `next` in result block | Cursor not returned to caller | Add `next: $.steps.get_data.output.data.meta.nextCursor` to result |
| Single condition for default values | Only passing input when present, no default | Use dual-condition: one arg when present, one when not |
| Missing nesting in dataKey | `dataKey: employees` when response is `{data:{employees:[]}}` | `dataKey: data.employees` |
| Wrong cursor field name | `nextKey: cursor` when API returns `next_cursor` | `nextKey: next_cursor` |
| Wrong iterator parameter | `iterator.key: cursor` when API expects `page_token` | `iterator.key: page_token` |
| Not implementing pagination on list actions | List action without cursor support | Always add cursor pagination for list endpoints |

### Step 6: Build Connector Configuration

#### Main File Structure

```yaml
StackOne: 1.0.0
info:
  title: Provider Name
  key: provider-name
  version: 1.0.0
  assets:
    icon: https://stackone-logos.com/api/provider_name/filled/png
  description: Unified connector for [use case]

baseUrl: https://api.provider.com

resources: https://api.provider.com/docs

# Scope definitions (NOT scope_definitions)
scopeDefinitions:
  employees:read:
    description: Read employee data

authentication:
  - oauth2: ... # See Auth Skill

actions:
  $ref: provider.employees
```

#### Partial File Structure (Unified Action)

```yaml
actions:
  - actionId: list_employees
    categories:
      - hris
    actionType: custom
    label: List employees
    description: Lists all employees with unified schema mapping
    resources: https://api.provider.com/docs/employees

    # Cursor configuration
    cursor:
      enabled: true
      pageSize: 75

    steps:
      # 1. Fetch data
      - stepId: get_employees
        description: Fetch employees from provider
        stepFunction:
          functionName: paginated_request
          parameters:
            url: /v2/employees
            method: get
            response:
              dataKey: employees
              nextKey: next_cursor
            iterator:
              key: cursor
              in: query

      # 2. Map to unified schema (INLINE FIELDS - RECOMMENDED)
      - stepId: map_employees_data
        description: Map to unified schema
        stepFunction:
          functionName: map_fields
          version: '2'
          parameters:
            fields:
              - targetFieldKey: id
                expression: $.id
                type: string
              - targetFieldKey: first_name
                expression: $.firstName
                type: string
              - targetFieldKey: email
                expression: $.email
                type: string
              - targetFieldKey: department
                expression: $.work.department
                type: string
            dataSource: $.steps.get_employees.output.data

      # 3. Apply types
      - stepId: typecast_employees_data
        description: Apply unified types
        stepFunction:
          functionName: typecast
          version: '2'
          parameters:
            fields:
              - targetFieldKey: id
                type: string
              - targetFieldKey: first_name
                type: string
              - targetFieldKey: email
                type: string
              - targetFieldKey: department
                type: string
            dataSource: $.steps.map_employees_data.output.data

    result:
      data: $.steps.typecast_employees_data.output.data
```

### Step 7: Validate Configuration

```bash
# YAML validation
stackone validate src/configs/<provider>/<provider>.connector.s1.yaml
```

**Validation Checklist**:
- [ ] YAML syntax valid
- [ ] All required fields present
- [ ] `scopeDefinitions` (not `scope_definitions`)
- [ ] `schemaType: unified` on unified actions
- [ ] `fieldConfigs` present for all unified actions
- [ ] `map_fields` and `typecast` steps present

### Step 8: Test and Validate Mappings

**See Unified Connector Testing Skill** for complete workflow.

#### Testing Principles

**PRINCIPLE 1: Keep Version Consistent During Testing**

When testing with a connected account, keep the connector version constant. The account is bound to a specific connector key and version - changing versions during development means changes won't be reflected.

```yaml
# During development, keep version stable
info:
  version: 1.0.1  # Don't bump with every change
```

**PRINCIPLE 2: Never Suggest User-Side Mapping**

If field mapping isn't working, debug and fix it. The entire purpose of a unified connector is to return standardized data. Suggesting "handle mapping in your application" defeats the purpose and is not acceptable.

**PRINCIPLE 3: Debug Empty Results Systematically**

If mapping produces empty results:
1. Remove map_fields/typecast steps, return raw data
2. Verify raw response structure in debug output
3. Add map_fields with one field, verify it works
4. Check expression context (no step prefix for inline fields)
5. Ensure `version: '2'` is specified

#### Critical Testing Steps

1. **Test raw response first** (before mapping):
```bash
# Debug mode shows raw provider response
stackone run --connector <file> --credentials <file> --action-id list_employees --debug
```

2. **Verify field mappings**:
   - [ ] All required fields populated
   - [ ] Field names match YOUR schema (not provider names)
   - [ ] Enum values translated correctly
   - [ ] Nested objects structured correctly
   - [ ] Null handling works as expected

3. **Test pagination**:
   - [ ] First page returns data
   - [ ] Cursor returned for next page
   - [ ] Subsequent pages work
   - [ ] Empty results handled

### Step 9: Document Schema Coverage

Create a coverage document:

```markdown
## Schema Coverage: [Provider]

### Required Fields
| Schema Field | Provider Field | Status |
|--------------|----------------|--------|
| id | employees.id | Mapped |
| first_name | employees.firstName | Mapped |
| email | employees.email | Mapped |
| employment_status | employees.status | Mapped (with enum translation) |

### Optional Fields
| Schema Field | Provider Field | Status |
|--------------|----------------|--------|
| department | employees.dept | Requires additional scope |
| hire_date | employees.startDate | Mapped |

### Scopes Required
- `employees:read` - Required for basic fields
- `org:read` - Optional for department field

### Limitations
- Country field not available in provider API
- Hire date only available for employees created after 2020
```

## Common Issues and Fixes

### Issue: Fields returning provider names instead of schema names

**Cause**: Missing or incorrect `fieldConfigs`

**Fix**: Ensure `targetFieldKey` uses YOUR schema field names:
```yaml
# WRONG
- targetFieldKey: firstName  # Provider's name
  expression: $.get_employees.firstName

# CORRECT
- targetFieldKey: first_name  # Your schema name
  expression: $.get_employees.firstName
```

### Issue: Pagination not working

**Cause**: Incorrect `dataKey` or `nextKey` path

**Fix**: Debug to see raw response structure:
```bash
stackone run --debug ...
```

Then verify the actual path:
```yaml
# If response is: { "data": { "employees": [...], "pagination": { "next": "..." } } }
response:
  dataKey: data.employees    # Not just "employees"
  nextKey: data.pagination.next  # Full path to cursor
```

### Issue: Enum values not translating

**Cause**: `matchExpression` not matching provider values

**Fix**: Use exact provider values in expressions:
```yaml
# Check actual provider value (might be "ACTIVE" not "Active")
- matchExpression: '{{$.get_employees.status == "ACTIVE"}}'
  value: active
```

### Issue: Schema drift across iterations

**Cause**: Agent adding/removing fields inconsistently

**Fix**: Always reference the defined schema from Step 1. Never add extra fields (like `id`) unless in the original schema.

## Success Criteria

- [ ] Output schema defined before development
- [ ] Endpoint selection documented with trade-off analysis
- [ ] Scopes are narrowest possible for required functionality
- [ ] No deprecated endpoints used
- [ ] `fieldConfigs` map all schema fields
- [ ] Field names use YOUR schema (not provider names)
- [ ] Pagination tested and working
- [ ] `map_fields` and `typecast` steps present
- [ ] Schema coverage documented

## Related Skills

- **Unified Field Mapping Skill**: Detailed `fieldConfigs` patterns
- **Unified Scope Decisions Skill**: Scope trade-off framework
- **Unified Connector Testing Skill**: Validation and debugging
- **Falcon Authentication Setup Skill**: Auth configuration
