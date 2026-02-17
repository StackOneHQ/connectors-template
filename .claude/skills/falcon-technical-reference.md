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
src/configs/{connector-name}/
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

Maps provider response fields to StackOne unified response.

- `targetFieldKey`: The key in the unified model.
- `expression`: JSONPath selector or JEXL expression.
  - **IMPORTANT**: Inputs are **not available** in fieldConfig JEXL context. Use JSONPath/JEXL to reference step outputs or external data.
- `type`: `string`, `boolean`, `enum`, `datetime_string`, `number`.
- `enumMapper`: Use with `type: enum`.
  - `matcher`: Array of `matchExpression` (JEXL) and `value`.

```yaml
fieldConfigs:
  - targetFieldKey: id
    expression: $.accountId
    type: string
  - targetFieldKey: type
    expression: $.accountType
    type: enum
    enumMapper:
      matcher:
        - matchExpression: '{{$.accountType == "admin"}}'
          value: agent
        - matchExpression: '{{$.accountType == "app"}}'
          value: bot
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

### Paginated Request (Cursor-based)

Only for cursor-based pagination. Use `request` for others.

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

### Map

Using the `fieldConfigs`, performs a mapping of the `dataSource`.
**NOTE**: This step is not required when building non-unified actions.

```yaml
- stepId: map_employee_data
  description: Map employee data
  stepFunction:
    functionName: map_fields
    version: "2"
    parameters:
      dataSource: $.steps.group_employee_data.output.data
```

### Typecast

Applies the types as defined in `fieldConfigs`.
**NOTE**: This step is not required when building non-unified actions.

```yaml
- stepId: typecast_employee_data
  description: Typecast employee data
  stepFunction:
    functionName: typecast
    version: "2"
    parameters:
      dataSource: $.steps.map_employee_data.output.data
```

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

- **Reserved Characters**: Never use `:` in values (e.g., descriptions). Use parentheses instead.
  - ❌ `description: Filter by status: active, inactive`
  - ✅ `description: Filter by status (active, inactive)`
- **Indentation**: Use 2 spaces.
- **Deprecated Fields**: Do not include deprecated fields or actions.
- **Action Type**: Default to `custom` for non-unified actions.