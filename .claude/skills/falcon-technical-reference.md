---
name: Falcon Technical Reference
trigger: reference|technical docs|yaml structure|step functions|dynamic values|jsonpath|jexl|syntax
description: Comprehensive technical reference for Falcon connector YAML structure, step functions, expression formats, and best practices.
---

# Falcon Technical Reference

**When to use**: User asks for "YAML syntax", "how to write step functions", "expression formats", "JSONPath vs JEXL", or general technical details about the Falcon framework.

## File Structure & Organization

### Directory Structure (REQUIRED)

**⚠️ ALWAYS use the partials approach - never create monolithic connector files.**

```
connectors/{connector-name}/
├── {connector-name}.connector.s1.yaml              # Main: info, auth, $refs only
└── {connector-name}.{resource}.s1.partial.yaml     # Actions grouped by resource
```

### File Naming Convention

- Use kebab-case for file names
- **MANDATORY**: Create partial files - one per resource/domain
- Reference partials in main file using `$ref: connector-name.resource`
- Add $ref entries in alphabetical order

### Partial File Format ($ref)

**⚠️ CRITICAL FORMAT RULES:**
1. **Main file** contains ONLY info, auth, and $refs
2. **Partial files** start with `-` (action array items), NOT `actions:` key
3. Group related actions in same partial (e.g., all task operations together)

## YAML Structure

### Main File (`provider.connector.s1.yaml`)

```yaml
StackOne: 1.0.0
info:
  title: Provider Name
  key: provider-name
  version: 1.0.0
  assets:
    icon: https://stackone-logos.com/api/provider_name/filled/png
  description: Brief description of the provider

baseUrl: https://api.provider.com

# Optional: Rate limiting configuration
rateLimit:
  mainRatelimit: 10

resources: https://api.provider.com/docs

authentication:
  - oauth2: ... # See Auth Skill

actions:
  $ref: provider.tasks
  $ref: provider.users
```

### Partial File (`provider.resource.s1.partial.yaml`)

```yaml
- actionId: list_tasks
  label: List Tasks
  description: Get list of all tasks
  categories:
    - project_management
  actionType: custom
  resources: https://api.provider.com/docs/tasks/list
  inputs:
    - name: limit
      description: Maximum number of tasks
      type: number
      in: query
      required: false
  steps:
    - stepId: fetch_tasks
      description: Fetch tasks from API
      stepFunction:
        functionName: request
        parameters:
          url: /tasks
          method: get
          args:
            - name: limit
              value: $.inputs.limit
              in: query
              condition: "{{present(inputs.limit)}}"
  result:
    data: $.steps.fetch_tasks.output.data
```

## Actions Configuration

### Inputs

Defines the request parameters mapped from the unified API to the provider API.

- `name`: Parameter name
- `type`: `string`, `number`, `boolean`, `datetime_string`, `object`, `enum`
- `in`: `query`, `path`, `body`, `headers`
- `required`: boolean
- `array`: boolean (use with `type` for array elements)
- `oneOf`: for enums

**Array Example**:
```yaml
inputs:
  - name: userIds
    type: string
    array: true
    in: body
```

**Enum Example**:
```yaml
inputs:
  - name: status
    type: enum
    in: query
    oneOf:
      values: [active, inactive]
```

### Results

Maps the step outputs to the action result.

**Read Action**:
```yaml
result:
  data: $.steps.fetch_users.output.data
```

**Write Action**:
```yaml
result:
  data:
    id: $.steps.create_user.output.data.id
    status: success
```

### Field Configs

**NOTE**: `fieldConfigs` are NOT required when building non-unified connectors.

Maps provider response fields to target schema. Can be defined at action level OR inline in map_fields parameters.

#### Expression Context Rules

| Location | Expression Format | Example |
|----------|------------------|---------|
| Inline in `map_fields.parameters.fields` | Direct field reference | `$.email`, `$.work.department` |
| Action-level `fieldConfigs` | Step ID prefix required | `$.get_employees.email` |

#### Properties

- `targetFieldKey`: The key in YOUR target schema
- `expression`: JSONPath or JEXL to source data
- `type`: `string`, `boolean`, `enum`, `datetime_string`, `number`
- `enumMapper`: Required for enum type translations

#### Example: Inline Fields (RECOMMENDED)

```yaml
# In map_fields step parameters
fields:
  - targetFieldKey: id
    expression: $.accountId      # Direct reference
    type: string
  - targetFieldKey: status
    expression: $.accountType
    type: enum
    enumMapper:
      matcher:
        - matchExpression: '{{$.accountType == "admin"}}'
          value: agent
        - matchExpression: '{{$.accountType == "app"}}'
          value: bot
```

#### Example: Action-Level fieldConfigs

```yaml
# At action level
fieldConfigs:
  - targetFieldKey: id
    expression: $.get_data.accountId    # Step prefix required
    type: string
  - targetFieldKey: status
    expression: $.get_data.accountType
    type: enum
    enumMapper:
      matcher:
        - matchExpression: '{{$.get_data.accountType == "admin"}}'
          value: agent
```

## Step Functions

### Request (Standard REST)

Performs an HTTP request.

```yaml
stepFunction:
  functionName: request
  parameters:
    url: /users
    method: post
    args:
      - name: email
        value: $.inputs.email
        in: body
      - name: status
        value: $.inputs.status
        in: query
        condition: "{{present(inputs.status)}}"
    # response is ONLY used for unified actions
    response:
      collection: true
      indexField: id
      dataKey: user
    customErrors:
      - receivedStatus: 404
        targetStatus: 400
        message: 'Custom error message'
        condition: "{{headers['connection'] == 'keep-alive'}}"
```

**CRITICAL**:
- Always use `args` for parameters (headers, query, body).
- Use JSONPath (`$.inputs.x`) for `value`.
- Use JEXL (`{{...}}`) for `condition`.
- **customErrors**: Optional remapping of provider error responses (e.g., 404 -> 400).

### Cursor Pagination with `request` (RECOMMENDED)

**For list endpoints requiring dynamic inputs** (page_size, filters), use `request` with manual cursor handling:

```yaml
inputs:
  - name: page_size
    description: Maximum items per page
    type: number
    in: query
    required: false
  - name: cursor
    description: Pagination cursor
    type: string
    in: query
    required: false

steps:
  - stepId: fetch_data
    stepFunction:
      functionName: request
      parameters:
        url: /users
        method: get
        args:
          # Dual-condition pattern for defaults
          - name: limit
            value: $.inputs.page_size
            in: query
            condition: "{{present(inputs.page_size)}}"
          - name: limit
            value: 50
            in: query
            condition: "{{!present(inputs.page_size)}}"
          - name: cursor
            value: $.inputs.cursor
            in: query
            condition: "{{present(inputs.cursor)}}"

result:
  data: $.steps.typecast_data.output.data
  next: $.steps.fetch_data.output.data.meta.nextCursor
```

**CRITICAL**: Always implement cursor pagination for list endpoint unified actions.

### Paginated Request (Alternative)

Use `paginated_request` only when you don't need dynamic input parameters. Note that `$.inputs.*` may resolve to `undefined` in this function.

```yaml
stepFunction:
  functionName: paginated_request
  parameters:
    url: /users
    method: get
    response:
      dataKey: results
      nextKey: nextCursor
    iterator:
      key: cursor
      in: query
```

### SOAP Request

Performs a SOAP (Simple Object Access Protocol) request. Constructs a properly formatted SOAP envelope.

**Key Parameters**:
- `soapOperation`: The name of the SOAP operation to call.
- `soapAction`: The SOAP action URI (usually `namespace/operation` - check headers).
- `namespaces`: Array of XML namespace definitions used in the envelope.
- `useSoapContext`: Set to `false` when the provider expects your request payload as-is.
- `args`: Arguments included in the SOAP request body.
  - Use string interpolation (`${inputs.fieldName}`) for dynamic values.
  - Prefix XML attributes with `@_` (e.g., `@_xsi:type`).
  - Keep credential blocks inside the payload if required by the provider.

```yaml
stepFunction:
  functionName: soap_request
  parameters:
    url: /EmployeeService
    method: post
    soapOperation: GetEmployee
    soapAction: http://example.com/soap/GetEmployee
    useSoapContext: false
    namespaces:
      - namespaceIdentifier: emp
        namespace: http://example.com/employees
      - namespaceIdentifier: xsi
        namespace: http://www.w3.org/2001/XMLSchema-instance
    args:
      - name: EmployeeId
        value: ${inputs.employee_id}
        in: body
      - name: EmployeeFilter
        in: body
        value:
          FilterAttribute:
            '@_xsi:type': 'emp:EmployeeNumberFilter'
          FilterValue:
            '@_xsi:type': 'emp:EmployeeFilterComparisonInteger'
            Value: $.inputs.employee_id
```

### Group Data

Groups data from multiple steps.

```yaml
stepFunction:
  functionName: group_data
  parameters:
    stepsDataToGroup:
      - get_all_employees
      - get_more_employees_data
    isSingleRecord: false
```

### Map Fields

Transforms data from provider format to target schema format.
**NOTE**: This step is not required when building non-unified actions.

#### Approach 1: Inline Fields (RECOMMENDED)

Pass `fields` directly in parameters. This is more reliable and avoids schema inference issues.

```yaml
- stepId: map_data
  description: Map to target schema
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
          expression: $.work.department  # Nested field
          type: string
      dataSource: $.steps.get_employees.output.data
```

**CRITICAL**: In inline fields, expressions reference fields within each record directly (`$.email`), NOT with step prefix (`$.get_employees.email`).

#### Approach 2: Action-Level fieldConfigs

Define fields at action level, map_fields references them automatically.

```yaml
# At action level
fieldConfigs:
  - targetFieldKey: email
    expression: $.get_employees.email    # Step prefix required here
    type: string

# In steps
- stepId: map_data
  stepFunction:
    functionName: map_fields
    version: '2'
    parameters:
      dataSource: $.steps.get_employees.output.data
```

**Note**: This approach can trigger schema inference issues with certain field names. Use inline fields if you encounter build errors.

### Typecast

Applies type conversions to mapped data.
**NOTE**: This step is not required when building non-unified actions.

```yaml
- stepId: typecast_data
  description: Apply types
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
      dataSource: $.steps.map_data.output.data
```

**CRITICAL**: Always use `version: '2'` for both map_fields and typecast. Without it, results may be empty.

## Dynamic Values & Expressions

### 1. JSONPath (`$.path.to.field`) - PREFERRED

Use for direct value references (no string construction).

- Credentials: `$.credentials.apiKey`
- Inputs: `$.inputs.userId`
- Step Output: `$.steps.stepId.output.data`
- Response fields: `$.response.pagination.cursor`

### 2. String Interpolation (`${...}`)

Use for embedding values in strings.

- URL Paths: `/users/${inputs.id}`
- Composition: `https://${credentials.domain}.api.com`
- Complex Strings: `/users/${inputs.userId}/posts/${inputs.postId}`

### 3. JEXL Expressions (`'{{...}}'`)

Use for logic, conditions, and transformations.

📖 **Full reference:** `node_modules/@stackone/expressions/README.md` (all operators, functions, examples)

- Conditions: `condition: '{{present(inputs.email)}}'`
- Match Expressions: `matchExpression: '{{$.accountType == "admin"}}'`
- Transformations: `value: '{{inputs.name.toUpperCase()}}'`
- Ternary Logic: `value: '{{inputs.isActive ? "active" : "inactive"}}'`

## GraphQL Best Practices

### Input Structure

Always use a nested `variables` object.

```yaml
inputs:
  - name: variables
    type: object
    in: body
    properties:
      - name: first
        type: number
      - name: filter
        type: object
```

### Request Configuration

```yaml
stepFunction:
  functionName: request
  parameters:
    url: /graphql
    method: post
    args:
      - name: query
        value: "query($id: ID!) { user(id: $id) { id name } }"
        in: body
      - name: variables
        value:
          id: $.inputs.variables.id
        in: body
```

**Optimization**: Only request `id` for nested objects unless a separate action doesn't exist.

### Variables Value Format

**1. Direct JSONPath References (Preferred)**

Use direct references for variables. **NEVER USE `JSON.stringify()`**.

```yaml
- name: variables
  value:
    {
      first: $.inputs.variables.first,
      filter: $.inputs.variables.filter,
    }
  in: body
```

**2. Simple Get Actions**

For simple actions with just an ID, string interpolation is acceptable.

```yaml
- name: variables
  value: '{ "id": "${inputs.id}" }'
  in: body
```

**3. Mutation Input Objects**

Nest the input structure as required by the mutation.

```yaml
- name: variables
  value:
    {
      id: $.inputs.id,
      input:
        {
          title: $.inputs.variables.title,
          description: $.inputs.variables.description,
        },
    }
  in: body
```

### Query String Format

**List/Query Actions**: Include all variables in the query signature.

```yaml
value: "query($first: Int, $filter: ResourceFilter) { resources(first: $first, filter: $filter) { nodes { id name } } }"
```

**Mutation Actions**: Include input types.

```yaml
value: "mutation($input: ResourceCreateInput!) { resourceCreate(input: $input) { success resource { id name } } }"
```

## YAML Best Practices

### Config Field Naming - camelCase Only

**PRINCIPLE**: ALL Falcon configuration field names use camelCase.

This is a universal rule, not specific to any one field. Using snake_case causes validation errors or silent failures.

```yaml
# CORRECT - camelCase for ALL config fields
scopeDefinitions:        # NOT scope_definitions
fieldConfigs:            # NOT field_configs
targetFieldKey:          # NOT target_field_key
enumMapper:              # NOT enum_mapper
matchExpression:         # NOT match_expression
dataKey:                 # NOT data_key
nextKey:                 # NOT next_key
pageSize:                # NOT page_size
indexField:              # NOT index_field
stepFunction:            # NOT step_function
functionName:            # NOT function_name
dataSource:              # NOT data_source
externalSources:         # NOT external_sources
compositeIdentifiers:    # NOT composite_identifiers
requiredScopes:          # NOT required_scopes
customErrors:            # NOT custom_errors
receivedStatus:          # NOT received_status
targetStatus:            # NOT target_status
authorizationUrl:        # NOT authorization_url
tokenUrl:                # NOT token_url
tokenExpiresIn:          # NOT token_expires_in
configFields:            # NOT config_fields
setupFields:             # NOT setup_fields
refreshAuthentication:   # NOT refresh_authentication
```

### Other Best Practices

- **Reserved Characters**: Never use `:` in values (e.g., descriptions). Use parentheses instead.
  - ❌ `description: Filter by status: active, inactive`
  - ✅ `description: Filter by status (active, inactive)`
- **Indentation**: Use 2 spaces.
- **Deprecated Fields**: Do not include deprecated fields or actions.
- **Action Type**: Default to `custom` for non-unified actions.

## Pagination Configuration Verification

**PRINCIPLE**: Always implement cursor pagination for list endpoint unified actions.

When configuring pagination, verify ALL these fields against the actual API response:

### Action-Level
```yaml
cursor:
  enabled: true       # Required for pagination
  pageSize: 50        # Must be within API limits

inputs:
  - name: page_size
    description: Maximum items per page
    type: number
    in: query
    required: false
  - name: cursor
    description: Pagination cursor for next page
    type: string
    in: query
    required: false
```

### Result Block (REQUIRED for cursor pagination)
```yaml
result:
  data: $.steps.typecast_data.output.data
  next: $.steps.fetch_data.output.data.meta.nextCursor  # Return cursor for next page
```

### Step-Level (when using `paginated_request`)
```yaml
response:
  dataKey: path.to.data   # Exact path to data array (verify with --debug)
  nextKey: path.to.cursor # Exact path to pagination cursor
  indexField: id          # Unique identifier field in records

iterator:
  key: cursor            # API's expected parameter name (check docs!)
  in: query              # Where API expects it (query, body, headers)
```

**CRITICAL**:
- Never assume paths. Always verify with `stackone run --debug` to see actual response structure.
- Use `request` function (not `paginated_request`) when inputs need to pass through dynamically.
- Use dual-condition pattern for defaults: `"{{present(inputs.field)}}"` and `"{{!present(inputs.field)}}"`