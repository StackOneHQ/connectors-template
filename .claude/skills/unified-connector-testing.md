---
name: Unified Connector Testing
trigger: test unified|validate mapping|debug fields|test pagination|schema validation|raw data
description: Testing and validation workflow for unified connectors, including schema validation, field mapping verification, and pagination testing.
---

# Unified Connector Testing Skill

**When to use**: User needs to test a unified connector, validate field mappings are correct, debug missing or incorrect data, or verify pagination works.

## Testing Philosophy for Unified Connectors

Unlike custom connectors where raw data is acceptable, unified connectors must:
1. Return data matching YOUR schema field names
2. Translate enum values correctly
3. Handle pagination with unified cursors
4. Map all required fields (or document why not)

## Pre-Testing Checklist

Before running tests:

- [ ] YAML validation passed (`stackone validate`)
- [ ] `schemaType: unified` present on unified actions
- [ ] `fieldConfigs` defined for all unified actions
- [ ] `map_fields` step present
- [ ] `typecast` step present
- [ ] Output schema documented for comparison

## 4-Phase Testing Workflow

### Phase 1: Raw Response Validation

**Goal**: Understand what the provider returns BEFORE mapping.

```bash
# Run with debug to see raw response
stackone run \
  --connector connectors/<provider>/<provider>.connector.s1.yaml \
  --credentials credentials.json \
  --action-id list_employees \
  --debug
```

**What to Check**:
1. Response structure (where is the data array?)
2. Field names as returned by provider
3. Pagination cursor field name and location
4. Any unexpected nesting

**Document Raw Response Structure**:
```json
// Example provider response
{
  "data": {
    "employees": [
      {
        "employeeId": "123",
        "firstName": "John",
        "lastName": "Doe",
        "status": "ACTIVE",
        "workInfo": {
          "department": "Engineering"
        }
      }
    ],
    "pagination": {
      "nextCursor": "abc123"
    }
  }
}
```

### Phase 2: Field Mapping Validation

**Goal**: Verify all fields map correctly to YOUR schema.

#### Run Without Debug (Mapped Output)

```bash
stackone run \
  --connector connectors/<provider>/<provider>.connector.s1.yaml \
  --credentials credentials.json \
  --action-id list_employees
```

#### Field-by-Field Validation

Create a validation table:

| Schema Field | Expected Value | Actual Value | Status |
|--------------|----------------|--------------|--------|
| id | "123" | "123" | Pass |
| first_name | "John" | "John" | Pass |
| last_name | "Doe" | "Doe" | Pass |
| employment_status | "active" | "ACTIVE" | FAIL - enum not mapped |
| department | "Engineering" | null | FAIL - path incorrect |

#### Common Field Mapping Issues

**Issue 1: Provider field names returned instead of schema names**

```yaml
# WRONG - Using provider names
- targetFieldKey: firstName    # Should be first_name
  expression: $.get_employees.firstName

# FIX
- targetFieldKey: first_name   # Your schema name
  expression: $.get_employees.firstName
```

**Issue 2: Enum values not translated**

```yaml
# Provider returns "ACTIVE", schema expects "active"
# FIX: Add enumMapper
- targetFieldKey: employment_status
  expression: $.get_employees.status
  type: enum
  enumMapper:
    matcher:
      - matchExpression: '{{$.get_employees.status == "ACTIVE"}}'
        value: active
```

**Issue 3: Nested field path incorrect**

```yaml
# WRONG - Incorrect path
- targetFieldKey: department
  expression: $.get_employees.department

# FIX - Correct nested path
- targetFieldKey: department
  expression: $.get_employees.workInfo.department
```

**Issue 4: dataKey pointing to wrong location**

```yaml
# If response is { "data": { "employees": [...] } }
# WRONG
response:
  dataKey: employees

# FIX - Include full path
response:
  dataKey: data.employees
```

### Phase 3: Pagination Testing

**Goal**: Verify ALL aspects of cursor-based pagination work correctly.

#### Pagination Configuration Checklist

Before testing, verify ALL pagination-related fields are configured correctly:

**Action-Level Configuration**:
```yaml
cursor:
  enabled: true       # Is pagination enabled?
  pageSize: 75        # Default page size appropriate for API?
```

**Step-Level Response Configuration**:
```yaml
response:
  collection: true    # Is this a list (true) or single record (false)?
  dataKey: path.to.array    # Exact path to data array in response
  nextKey: path.to.cursor   # Exact path to pagination cursor
  indexField: id      # Field to use for record identification
```

**Step-Level Iterator Configuration** (for paginated_request):
```yaml
iterator:
  key: cursor         # Parameter NAME the API expects
  in: query           # WHERE to send cursor (query, body, headers)
```

#### Pre-Test Verification

Use `--debug` to capture raw response and verify paths:

```bash
stackone run --debug \
  --connector <file> \
  --credentials <file> \
  --action-id list_employees
```

**Verify against actual response structure**:

| Config Field | What to Check | Example |
|--------------|---------------|---------|
| `response.collection` | Is response an array or single object? | `true` for lists |
| `response.dataKey` | Exact path to data array | If response is `{"data":{"employees":[...]}}`, use `data.employees` |
| `response.nextKey` | Exact path to cursor | If response is `{"meta":{"cursor":"abc"}}`, use `meta.cursor` |
| `response.indexField` | Unique identifier field in each record | Usually `id` |
| `iterator.key` | API's expected parameter name | Check API docs: might be `cursor`, `page_token`, `after`, etc. |
| `iterator.in` | Where API expects cursor | Usually `query`, sometimes `body` or `headers` |
| `cursor.pageSize` | Appropriate for API limits | Check API rate limits and max page size |

#### Test 1: First Page Returns Data

```bash
stackone run \
  --connector <file> \
  --credentials <file> \
  --action-id list_employees \
  --params '{"limit": 2}'
```

**Verification Checklist**:
- [ ] Data array returned (not null, not error)
- [ ] Correct number of records (respects limit)
- [ ] Records have expected structure
- [ ] Cursor/next token present in response
- [ ] Cursor value is extractable (not nested unexpectedly)

#### Test 2: Next Page Works

```bash
# Use cursor from previous response
stackone run \
  --connector <file> \
  --credentials <file> \
  --action-id list_employees \
  --params '{"cursor": "<cursor_from_previous>"}'
```

**Verification Checklist**:
- [ ] Request includes cursor parameter correctly
- [ ] Different records returned (not same as page 1)
- [ ] No duplicate records from page 1
- [ ] New cursor for next page (or null/absent if last page)
- [ ] Record count consistent with expectations

#### Test 3: Last Page Handling

```bash
# Continue paginating until end
```

**Verification Checklist**:
- [ ] Last page has fewer or equal records to pageSize
- [ ] Cursor is null, empty, or absent (indicating end)
- [ ] No error when reaching end
- [ ] Total records across pages matches expected count

#### Test 4: Empty Results Handled

```bash
# Use filter that returns no results
stackone run \
  --connector <file> \
  --credentials <file> \
  --action-id list_employees \
  --params '{"filter": "nonexistent_value"}'
```

**Verification Checklist**:
- [ ] Empty array returned (not null, not error)
- [ ] Cursor is null or absent
- [ ] Response structure is valid
- [ ] No crash or exception

#### Test 5: Invalid Cursor Handling

```bash
stackone run \
  --connector <file> \
  --credentials <file> \
  --action-id list_employees \
  --params '{"cursor": "invalid_cursor_value"}'
```

**Verification Checklist**:
- [ ] Error handled gracefully
- [ ] Appropriate error message returned
- [ ] No crash or unhandled exception

#### Common Pagination Issues and Fixes

**Issue 1: dataKey path incorrect**

```yaml
# If response is: { "data": { "employees": [...] } }

# WRONG - Missing nesting
response:
  dataKey: employees

# CORRECT - Full path
response:
  dataKey: data.employees
```

**Issue 2: nextKey path incorrect**

```yaml
# If response is: { "pagination": { "next_cursor": "abc" } }

# WRONG - Wrong field name or path
response:
  nextKey: cursor

# CORRECT - Full path with exact field name
response:
  nextKey: pagination.next_cursor
```

**Issue 3: iterator.key doesn't match API expectation**

```yaml
# If API expects ?page_token=xxx

# WRONG - Using wrong parameter name
iterator:
  key: cursor
  in: query

# CORRECT - Match API's expected parameter
iterator:
  key: page_token
  in: query
```

**Issue 4: iterator.in wrong location**

```yaml
# If API expects cursor in request body, not query string

# WRONG
iterator:
  key: cursor
  in: query

# CORRECT
iterator:
  key: cursor
  in: body
```

**Issue 5: collection flag incorrect**

```yaml
# If endpoint returns single record but configured as collection

# WRONG - Causes mapping errors
response:
  collection: true

# CORRECT - Match actual response type
response:
  collection: false
```

**Issue 6: indexField doesn't exist in response**

```yaml
# If records use "employee_id" not "id"

# WRONG - Field doesn't exist
response:
  indexField: id

# CORRECT - Use actual field name
response:
  indexField: employee_id
```

### Phase 4: Schema Completeness Validation

**Goal**: Ensure all required schema fields are populated.

#### Create Schema Validation Script

```bash
# Test and validate output against schema
stackone run \
  --connector <file> \
  --credentials <file> \
  --action-id list_employees \
  | jq '.data[0] | keys'
```

Compare output keys against your schema:

```markdown
## Schema Completeness Check

### Required Fields
| Field | In Output | Value Present |
|-------|-----------|---------------|
| id | Yes | Yes |
| first_name | Yes | Yes |
| last_name | Yes | Yes |
| email | Yes | Yes |
| employment_status | Yes | Yes |

### Optional Fields
| Field | In Output | Value Present |
|-------|-----------|---------------|
| department | Yes | Some records |
| hire_date | Yes | Some records |
| work_location | No | N/A |
```

## Debugging Techniques

### 1. Isolate the Problem Layer

```
Raw API Response → Request Step → group_data → map_fields → typecast → Final Output
     ↑                 ↑              ↑            ↑           ↑
     |                 |              |            |           |
  Debug here        Check here    Verify here  Check here   Final check
```

### 2. Debug Raw Response

```bash
# See exactly what the API returns
stackone run --debug ...
```

### 3. Debug After Each Step

Temporarily modify result to see intermediate data:

```yaml
# Original
result:
  data: $.steps.typecast_employees_data.output.data

# Debug: Check after request step
result:
  data: $.steps.get_employees.output.data

# Debug: Check after map_fields
result:
  data: $.steps.map_employees_data.output.data
```

### 4. Add Temporary Debug Fields

```yaml
fieldConfigs:
  # Normal fields...

  # Temporary debug field
  - targetFieldKey: _debug_raw_status
    expression: $.get_employees.status
    type: string
    custom: true
```

### 5. Check Expression Paths

If a field returns null, verify the path exists:

```bash
# Get raw response and check path
stackone run --debug ... | jq '.steps.get_employees.output.data[0].workInfo.department'
```

## Specific Issue Debugging

### Field Returns Null When Data Exists

**Symptoms**: Field is null but debug shows data exists

**Debugging Steps**:
1. Check raw response path
2. Verify step ID in expression matches actual step
3. Check for typos in field names
4. Verify nesting level

```yaml
# Common issue: Missing intermediate object
# WRONG
expression: $.get_employees.department

# CORRECT (if department is nested)
expression: $.get_employees.workInfo.department
```

### Enum Returns Raw Value Instead of Mapped

**Symptoms**: Get "ACTIVE" instead of "active"

**Debugging Steps**:
1. Verify `type: enum` is set
2. Check `enumMapper` exists
3. Verify `matchExpression` uses correct path and value

```yaml
# Check the exact value being compared
# If status is "Active" not "ACTIVE":
- matchExpression: '{{$.get_employees.status == "Active"}}'  # Case matters!
  value: active
```

### Pagination Returns Same Records

**Symptoms**: Every page returns the same records

**Debugging Steps**:
1. Verify cursor is being sent to API
2. Check cursor parameter name matches API expectation
3. Verify cursor is extracted from correct response path

```yaml
# Check iterator key matches API parameter
iterator:
  key: cursor        # Must match API's expected param name
  in: query          # Check if should be query vs body
```

### Field Mapping Not Applied

**Symptoms**: Output uses provider field names

**Debugging Steps**:
1. Verify `map_fields` step exists and runs
2. Check `dataSource` points to correct step output
3. Verify `fieldConfigs` is at action level (not step level)

```yaml
# map_fields must reference correct dataSource
- stepId: map_employees_data
  stepFunction:
    functionName: map_fields
    version: '2'
    parameters:
      dataSource: $.steps.get_employees.output.data  # Verify this path
```

## Testing Checklist

### Before Shipping

- [ ] **Raw Response**: Verified provider response structure
- [ ] **Field Names**: All output fields use schema names (not provider names)
- [ ] **Field Types**: Types match schema definition
- [ ] **Enum Values**: All enums translate correctly
- [ ] **Required Fields**: All required fields present and populated
- [ ] **Null Handling**: Null values handled gracefully
- [ ] **Pagination First Page**: Returns data with cursor
- [ ] **Pagination Next Page**: Returns different data
- [ ] **Pagination Last Page**: Cursor is null/absent
- [ ] **Empty Results**: Returns empty array, not error
- [ ] **Error Handling**: API errors handled appropriately

### Regression Testing

After any changes:

```bash
# Quick validation script
stackone validate connectors/<provider>/<provider>.connector.s1.yaml && \
stackone run --connector connectors/<provider>/<provider>.connector.s1.yaml \
  --credentials credentials.json \
  --action-id list_employees \
  --params '{"limit": 1}' | jq '.data[0] | keys'
```

## Action Tracking for Testing

Create tracking file at `/tmp/<provider>_unified_testing.json`:

```json
{
  "provider": "provider_name",
  "schema": "employees",
  "created_at": "2024-01-15T10:00:00Z",
  "testing_progress": {
    "total_tests": 12,
    "completed": 0,
    "percentage_complete": 0
  },
  "tests": [
    {
      "test_id": "raw_response",
      "description": "Verify raw API response structure",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "field_mapping_id",
      "description": "id field maps correctly",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "field_mapping_first_name",
      "description": "first_name field maps correctly",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "enum_employment_status",
      "description": "employment_status enum translates correctly",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "pagination_first_page",
      "description": "First page returns data with cursor",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "pagination_next_page",
      "description": "Next page returns different records",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "pagination_empty",
      "description": "Empty results handled correctly",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "required_fields_present",
      "description": "All required schema fields present",
      "status": "pending",
      "result": null
    },
    {
      "test_id": "no_provider_field_names",
      "description": "No provider-specific field names in output",
      "status": "pending",
      "result": null
    }
  ]
}
```

Update after each test:

```json
{
  "test_id": "field_mapping_id",
  "description": "id field maps correctly",
  "status": "passed",
  "result": {
    "expected": "schema field 'id' with value from provider",
    "actual": "id: '123'",
    "notes": null
  },
  "tested_at": "2024-01-15T10:30:00Z"
}
```

## Related Skills

- **Unified Connector Build Skill**: Overall workflow
- **Unified Field Mapping Skill**: Field configuration details
- **Falcon Connector Testing Skill**: General testing workflow
- **Falcon Technical Reference Skill**: Expression syntax
