# Building Unified Falcon Connectors

This guide explains how to build Falcon connectors that return data in StackOne's unified API v2 format. By following these patterns, your connectors will provide standardized responses that work seamlessly with StackOne's unified schemas.

## Table of Contents

- [What is a Unified Action?](#what-is-a-unified-action)
- [When to Use Unified Actions](#when-to-use-unified-actions)
- [Unified Action Structure](#unified-action-structure)
- [Field Mapping Patterns](#field-mapping-patterns)
- [Enum Mapping](#enum-mapping)
- [The Transform Pipeline](#the-transform-pipeline)
- [Pagination and Cursors](#pagination-and-cursors)
- [Complete Examples](#complete-examples)
- [Validation and Testing](#validation-and-testing)

---

## What is a Unified Action?

Falcon connectors support two types of actions:

### Non-Unified Actions (`actionType: custom`)

**Raw provider response** - Returns the provider's API response exactly as-is, with no transformation:

```yaml
- actionId: list_contacts
  actionType: custom  # Returns HubSpot's raw response
  steps:
    - stepId: fetch_contacts
      stepFunction:
        functionName: request
        parameters:
          url: /contacts
          method: get
  result:
    data: $.steps.fetch_contacts.output.data
```

**Response:** Provider's native JSON structure (varies by provider)

### Unified Actions (`actionType: list|get|create|update|delete`)

**Transformed to unified schema** - Maps provider fields to standardized unified schemas:

```yaml
- actionId: unified_list_contacts
  actionType: list  # Returns unified contact data
  fieldConfigs:
    - targetFieldKey: id
      expression: $.id
      type: string
    - targetFieldKey: first_name
      expression: $.properties.firstname
      type: string
  steps:
    - stepId: fetch_contacts
      stepFunction:
        functionName: request
        parameters:
          url: /contacts
          method: get
    - stepId: map_contacts
      stepFunction:
        functionName: map_fields
        version: "2"
        parameters:
          dataSource: $.steps.fetch_contacts.output.data
    - stepId: typecast_contacts
      stepFunction:
        functionName: typecast
        version: "2"
        parameters:
          dataSource: $.steps.map_contacts.output.data
  result:
    data: $.steps.typecast_contacts.output.data
```

**Response:** Standardized JSON matching the unified schema

---

## When to Use Unified Actions

| Use Case | Action Type | Why |
|----------|-------------|-----|
| **Standardized data format** | Unified | Consistent schema across different providers |
| **Maximum compatibility** | Unified | Works with any frontend expecting unified format |
| **Custom integrations with raw provider data** | Non-unified | Full access to provider-specific fields |
| **Rapid prototyping** | Non-unified | Faster to build, no mapping needed |

**Key Decision:** If you want your connector to return data in a standardized format that matches unified schemas, use unified actions.

---

## Unified Action Structure

Unified actions require these specific fields:

### Required Fields

```yaml
- actionId: unified_list_employees
  categories:
    - hris
  actionType: list  # Must be: list, get, create, update, or delete
  label: List Employees
  description: Get list of all employees
  details: Returns a paginated list of employees from the HRIS system, mapped to the unified employee schema
  resources: https://api.provider.com/docs/employees/list
  
  # Field mappings (required for unified actions)
  fieldConfigs:
    - targetFieldKey: id
      expression: $.id
      type: string
    - targetFieldKey: first_name
      expression: $.firstName
      type: string
  
  # Transform pipeline (required for unified actions)
  steps:
    - stepId: fetch_data
      description: Fetch data from provider
      stepFunction:
        functionName: request
        parameters:
          url: /employees
          method: get
    
    - stepId: map_data
      description: Map provider fields to unified schema
      stepFunction:
        functionName: map_fields
        version: "2"
        parameters:
          dataSource: $.steps.fetch_data.output.data
    
    - stepId: typecast_data
      description: Convert types to match unified schema
      stepFunction:
        functionName: typecast
        version: "2"
        parameters:
          dataSource: $.steps.map_data.output.data
  
  result:
    data: $.steps.typecast_data.output.data
```

### Field-by-Field Breakdown

| Field | Purpose | Example Values |
|-------|---------|----------------|
| `actionType` | Defines operation type and enables unified processing | `list`, `get`, `create`, `update`, `delete` |
| `fieldConfigs` | Maps provider fields to unified schema fields | See [Field Mapping Patterns](#field-mapping-patterns) |
| `steps` | Three-step transform pipeline (fetch → map → typecast) | See [The Transform Pipeline](#the-transform-pipeline) |

---

## Field Mapping Patterns

The `fieldConfigs` section defines how provider fields map to StackOne's unified schema. Each field config has:

- `targetFieldKey` - The unified schema field name
- `expression` - How to extract the value from provider data
- `type` - The data type (string, number, boolean, enum, datetime_string)
- `array` - Set to `true` if the field is an array (optional)

### Pattern 1: Direct Field Mapping

**Use when:** Provider field name matches the data you need

```yaml
fieldConfigs:
  # Simple direct mapping
  - targetFieldKey: id
    expression: $.id
    type: string
  
  # Nested field access
  - targetFieldKey: work_email
    expression: $.properties.email
    type: string
```

### Pattern 2: JEXL Expressions

**Use when:** You need transformations, concatenation, or fallback logic

```yaml
fieldConfigs:
  # Fallback to alternative field
  - targetFieldKey: display_name
    expression: '{{$.displayName || $.fullName || ($.firstName + " " + $.lastName)}}'
    type: string
  
  # Conditional logic
  - targetFieldKey: is_active
    expression: '{{$.status == "active"}}'
    type: boolean
  
  # String transformation
  - targetFieldKey: email_upper
    expression: '{{$.email.toUpperCase()}}'
    type: string
```

### Pattern 3: Array Fields

**Use when:** Mapping arrays of strings or objects

```yaml
fieldConfigs:
  # Array of strings
  - targetFieldKey: emails
    expression: $.email_addresses
    type: string
    array: true
  
  # Array of objects (phone numbers example)
  - targetFieldKey: phone_numbers
    expression: $.phones
    type: object
    array: true
```

### Pattern 4: Nested Objects

**Use when:** Unified schema expects an object with properties

```yaml
fieldConfigs:
  # Simple nested object
  - targetFieldKey: home_location
    expression: $.homeAddress
    type: object
  
  # Constructed nested object
  - targetFieldKey: manager
    expression: '{{{"id": $.managerId, "name": $.managerName}}}'
    type: object
```

### Pattern 5: Datetime Handling

**Use when:** Converting date/time strings to ISO 8601 format

```yaml
fieldConfigs:
  # ISO 8601 datetime string
  - targetFieldKey: hire_date
    expression: $.hireDate
    type: datetime_string
  
  # Unix timestamp to datetime
  - targetFieldKey: created_at
    expression: '{{toISO8601($.createdTimestamp)}}'
    type: datetime_string
```

---

## Enum Mapping

Many unified schemas use enums for standardized values (e.g., employment status, gender). Use `enumMapper` to map provider values to unified enum values.

### Pattern 1: Built-in Enum Matchers

**Use when:** A built-in matcher exists for common mappings

```yaml
fieldConfigs:
  - targetFieldKey: employment_status
    expression: $.status
    type: enum
    enumMapper:
      matcher: HRIS_EMPLOYEE_EMPLOYMENT_STATUS
```

**Available built-in matchers** (examples):
- `HRIS_EMPLOYEE_EMPLOYMENT_STATUS` - Maps to: active, inactive, pending, terminated, leave, unknown
- `HRIS_EMPLOYEE_GENDER` - Maps to: male, female, non_binary, other, not_disclosed, diverse
- `CRM_CONTACT_TYPE` - Maps to: lead, customer, partner, other

### Pattern 2: Custom Match Expressions

**Use when:** Provider uses custom values that need explicit mapping

```yaml
fieldConfigs:
  - targetFieldKey: employment_status
    expression: $.employmentStatus
    type: enum
    enumMapper:
      matcher:
        - matchExpression: '{{$.employmentStatus == "Full Time"}}'
          value: active
        - matchExpression: '{{$.employmentStatus == "Part Time"}}'
          value: active
        - matchExpression: '{{$.employmentStatus == "Terminated"}}'
          value: terminated
        - matchExpression: '{{$.employmentStatus == "On Leave"}}'
          value: inactive
```

### Pattern 3: Hybrid Approach

**Use when:** Combining built-in matcher with custom overrides

```yaml
fieldConfigs:
  - targetFieldKey: gender
    expression: $.gender
    type: enum
    enumMapper:
      matcher:
        # Custom mappings first
        - matchExpression: '{{$.gender == "M"}}'
          value: male
        - matchExpression: '{{$.gender == "F"}}'
          value: female
        # Fallback to built-in matcher
        - matchExpression: '{{true}}'
          value: HRIS_EMPLOYEE_GENDER
```

---

## The Transform Pipeline

Unified actions use a **three-step pipeline** to transform provider data into unified format:

```
Provider API → request → map_fields → typecast → Unified Response
```

### Step 1: `request` - Fetch Data

Retrieves raw data from the provider's API.

```yaml
- stepId: fetch_employees
  description: Fetch employees from provider API
  stepFunction:
    functionName: request
    parameters:
      url: /employees
      method: get
      args:
        - name: limit
          value: $.inputs.page_size
          in: query
```

**Output:** Raw provider JSON response

### Step 2: `map_fields` - Apply Field Mappings

Applies the `fieldConfigs` transformations to map provider fields to unified schema fields.

```yaml
- stepId: map_employees
  description: Map provider fields to unified schema
  stepFunction:
    functionName: map_fields
    version: "2"  # Always use version 2
    parameters:
      dataSource: $.steps.fetch_employees.output.data
```

**Important:** Always use `version: "2"` for unified actions.

**Output:** JSON with unified field names, but potentially incorrect types

### Step 3: `typecast` - Convert Types

Ensures all field types match the unified schema requirements (string → number, string → boolean, etc.).

```yaml
- stepId: typecast_employees
  description: Convert types to match unified schema
  stepFunction:
    functionName: typecast
    version: "2"  # Always use version 2
    parameters:
      dataSource: $.steps.map_employees.output.data
```

**Output:** Fully compliant unified schema JSON

### Why Three Steps?

- **Separation of concerns**: Fetching, mapping, and type conversion are distinct operations
- **Debugging**: Each step's output can be inspected independently
- **Reusability**: The same `map_fields` and `typecast` logic works for any provider

---

## Pagination and Cursors

Unified list actions must configure pagination to support StackOne's standardized pagination model.

### Cursor-Based Pagination (Recommended)

**Use when:** Provider returns a cursor/token for fetching the next page

```yaml
cursor:
  type: native
  key: next_cursor  # Field in unified response containing next cursor
  stopCondition: "{{empty(response.pagination.next_cursor)}}"
```

**Mapping the cursor field:**

```yaml
fieldConfigs:
  # Map provider's pagination cursor to unified cursor field
  - targetFieldKey: next_cursor
    expression: $.paging.next
    type: string
```

**Example provider response:**

```json
{
  "results": [...],
  "paging": {
    "next": "eyJhZnRlciI6IjEwMCJ9"
  }
}
```

### Offset-Based Pagination

**Use when:** Provider uses page numbers or offsets

```yaml
cursor:
  type: offset
  key: page
  stopCondition: "{{response.page >= response.total_pages}}"
```

**Mapping offset fields:**

```yaml
fieldConfigs:
  - targetFieldKey: page
    expression: $.page
    type: number
  - targetFieldKey: total_pages
    expression: $.totalPages
    type: number
```

### Composite Identifiers

**Use when:** List action needs to track multiple pagination states (rare)

```yaml
compositeIdentifiers:
  - employees_cursor
  - departments_cursor
```

---

## Complete Examples

See working examples in the `examples/` directory:

- **`examples/hubspot-unified/`** - CRM Contacts example (HubSpot)
- **`examples/bamboohr-unified/`** - HRIS Employees example (BambooHR)

Each example includes:
- Complete connector configuration with authentication
- Partial file with unified list and get actions
- Real field mappings based on provider API docs

---

## Validation and Testing

### 1. Validate YAML Syntax

Always validate your connector before testing:

```bash
stackone validate examples/hubspot-unified/hubspot-unified.connector.s1.yaml
```

**Expected output:**

```
✓ Connector is valid
```

### 2. Test with Real API Calls

Test unified actions using the StackOne CLI:

```bash
# List action
stackone run \
  --connector examples/hubspot-unified/hubspot-unified.connector.s1.yaml \
  --account account.json \
  --credentials credentials.json \
  --action-id unified_list_contacts

# Get action
stackone run \
  --connector examples/hubspot-unified/hubspot-unified.connector.s1.yaml \
  --account account.json \
  --credentials credentials.json \
  --action-id unified_get_contact \
  --params '{"path":{"id":"12345"}}'
```

### 3. Verify Unified Response Format

Check that the response matches the unified schema:

```json
{
  "data": [
    {
      "id": "12345",
      "first_name": "John",
      "last_name": "Doe",
      "emails": ["john.doe@example.com"],
      "phone_numbers": [{"number": "+1234567890", "type": "mobile"}],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:22:00Z"
    }
  ],
  "next_cursor": "eyJhZnRlciI6IjEwMCJ9"
}
```

---

## Common Pitfalls

### ❌ Mistake 1: Forgetting `version: "2"`

```yaml
# WRONG - Will fail
stepFunction:
  functionName: map_fields
  parameters:
    dataSource: $.steps.fetch.output.data
```

```yaml
# CORRECT
stepFunction:
  functionName: map_fields
  version: "2"  # Required!
  parameters:
    dataSource: $.steps.fetch.output.data
```

### ❌ Mistake 2: Missing Transform Steps

```yaml
# WRONG - Skipping map_fields and typecast
steps:
  - stepId: fetch
    stepFunction:
      functionName: request
result:
  data: $.steps.fetch.output.data  # Raw provider data!
```

```yaml
# CORRECT - Full pipeline
steps:
  - stepId: fetch
    stepFunction:
      functionName: request
  - stepId: map
    stepFunction:
      functionName: map_fields
      version: "2"
  - stepId: typecast
    stepFunction:
      functionName: typecast
      version: "2"
result:
  data: $.steps.typecast.output.data  # Unified data!
```

### ❌ Mistake 3: Using `type: array`

```yaml
# WRONG - type: array is not valid
fieldConfigs:
  - targetFieldKey: emails
    expression: $.email_addresses
    type: array  # Invalid!
```

```yaml
# CORRECT - Use array: true with element type
fieldConfigs:
  - targetFieldKey: emails
    expression: $.email_addresses
    type: string  # Element type
    array: true   # Array indicator
```

---

## Next Steps

1. **Review the examples** in `examples/hubspot-unified/` and `examples/bamboohr-unified/`
2. **Identify the unified schema** for your provider's category (HRIS, CRM, ATS, etc.)
3. **Map provider fields** to unified fields using `fieldConfigs`
4. **Add the transform pipeline** (`request` → `map_fields` → `typecast`)
5. **Validate and test** with real API credentials

For more details on non-unified connectors, see the main [CLAUDE.md](../CLAUDE.md) documentation.
