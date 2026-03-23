# Actions and Steps Reference

Technical reference for writing action YAML files — covering action structure, inputs, step functions, expressions, and result mapping.

## Action Structure

### Required Fields
- `actionId`: Unique identifier
- `categories`: List of categories for StackOne UI
- `actionType`: `custom` (default for non-unified) or `list|get|create|update|delete` (unified only)
- `label`: Human-readable name
- `description`: Short description (shown in UI)
- `steps`: List of step functions
- `result`: Final output

### Optional Fields
- `details`: Longer description (tool description, rate limits, required permissions)
- `resources`: Action-specific documentation URLs
- `examples`: Input/output demonstration pairs
- `inputs`: Request parameters
- `requiredScopes`: Space-separated OAuth scopes (must be defined in `scopeDefinitions`). Use most restrictive scope.
- `entrypointUrl` / `entrypointHttpMethod`: **Unified actions ONLY** (DO NOT USE for non-unified)

## Inputs

For non-unified actions: inputs must match EXACTLY the provider's request parameters. DO NOT create inputs that don't exist in the provider API. Ignore deprecated fields.

### Supported Types
`string`, `number`, `boolean`, `datetime_string`, `object`, `enum`

**Never use `type: array`** — always use `array: true` with element type.

### Input Examples

**Basic string/number:**
```yaml
inputs:
  - name: userId
    description: User identifier
    type: string
    in: path
    required: true
```

**Object:**
```yaml
inputs:
  - name: filter
    description: Filter object
    type: object
    in: body
    required: true
    properties:
      - name: name
        description: Filter by name
        type: string
        required: false
```

**Array:**
```yaml
inputs:
  - name: userIds
    description: Array of user IDs
    type: string
    array: true
    in: body
    required: true
```

**Enum:**
```yaml
inputs:
  - name: status
    description: Employment status
    type: enum
    required: true
    in: query
    oneOf:
      values:
        - active
        - inactive
        - terminated
```

### Input locations (`in` field)
- `query` — URL query parameter
- `body` — request body
- `path` — URL path parameter (referenced via `${inputs.fieldName}` in URL)
- `headers` — request header

## Expression Formats

### 1. JSONPath (`$.path.to.field`) — PREFERRED
For direct references without string construction:
- Credentials: `$.credentials.apiKey`
- Inputs: `$.inputs.userId`
- Step output: `$.steps.fetch_users.output.data`

### 2. String Interpolation (`${...}`)
For embedding dynamic values in strings:
- URLs: `/users/${inputs.userId}/posts/${inputs.postId}`
- Domains: `https://${credentials.domain}.api.com`

### 3. JEXL Expressions (`'{{...}}'`)
For conditional logic, transformations. **Wrap in single quotes.**
- Conditionals: `'{{present(inputs.includeInactive)}}'`
- Ternary: `'{{$.status == "active" ? "enabled" : "disabled"}}'`
- String manipulation: `'{{inputs.name.toUpperCase()}}'`

**IMPORTANT:**
- For `value` fields: prefer JSONPath `$.inputs.fieldName` for simple references. JEXL `'{{...}}'` is also supported in `value` fields when you need transformations, conditionals, or string manipulation.
- For `condition` fields: use JEXL `'{{present(inputs.fieldName)}}'`

## Step Functions

Every step MUST have a `description` field.

### `request` — Standard HTTP request

```yaml
steps:
  - stepId: fetch_users
    description: List users from the API
    stepFunction:
      functionName: request
      parameters:
        url: '/users'
        method: get
        args:
          - name: showInactive
            value: $.inputs.showInactive
            in: query
            condition: '{{present(inputs.showInactive)}}'
```

Always use `args` for parameters (never direct `body` field).

**Custom headers for `authorization.type: none`:**
```yaml
args:
  - name: X-API-Key
    value: $.credentials.customKey
    in: headers
```

**Raw array bodies** — when API requires `[...]` instead of `{...}`:
```yaml
args:
  - name: events
    value: $.inputs.events
    in: body
    spread: true
```

**Custom error mapping:**
```yaml
customErrors:
  - receivedStatus: 404
    targetStatus: 400
    message: 'Custom error message'
```

### `paginated_request` — Cursor-based pagination

Only use if provider supports cursor/offset pagination. Otherwise use `request`.

```yaml
steps:
  - stepId: list_records
    description: Fetch records with pagination
    stepFunction:
      functionName: paginated_request
      parameters:
        url: "/records"
        method: get
        response:
          dataKey: results
          nextKey: nextCursor
        iterator:
          key: cursor
          in: query
```

### `soap_request` — SOAP API calls

```yaml
steps:
  - stepId: get_employee
    description: Fetch employee via SOAP
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
        args:
          - name: EmployeeId
            value: ${inputs.employee_id}
            in: body
```

Key parameters:
- `soapOperation`: SOAP operation name
- `soapAction`: SOAP action URI
- `namespaces`: XML namespace definitions
- `useSoapContext`: Set to `false` when provider expects payload as-is
- Prefix XML attributes with `@_` (e.g., `@_xsi:type`)

### Other Step Functions
- `group_data`: Groups data from multiple steps
- `map_fields`: Maps using `fieldConfigs` (unified actions only)
- `typecast`: Applies types from `fieldConfigs` (unified actions only)

## Field Configs (Unified Actions Only)

NOT required for non-unified connectors. Maps provider response to StackOne unified schema:

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
        - matchExpression: '{{$.accountType == "atlassian"}}'
          value: agent
        - matchExpression: '{{$.accountType == "app"}}'
          value: bot
  - targetFieldKey: active
    expression: $.active
    type: boolean
```

## Result Mapping

```yaml
# Read response
result:
  data: $.steps.fetch_users.output.data

# Write response
result:
  message: Resource updated successfully
  data:
    id: $.inputs.id
```

## GraphQL Patterns

Reference: `linear` connector

**Input structure — always use nested `variables` object:**
```yaml
inputs:
  - name: variables
    description: Variables for the query
    type: object
    in: body
    properties:
      - name: first
        description: Number of items
        type: number
        required: false
      - name: filter
        description: Filter object
        type: object
        required: false
```

**Request:**
```yaml
args:
  - name: Content-Type
    value: application/json
    in: headers
  - name: query
    value: "query($first: Int) { resources(first: $first) { nodes { id name } } }"
    in: body
  - name: variables
    in: body
    condition: "{{present(inputs.variables)}}"
    value:
      { first: $.inputs.variables.first }
```

**IMPORTANT for nested objects:** When querying nested objects, ONLY return the `id` field if a separate action exists to fetch the full object. Don't return full nested objects.

**Query patterns:**
- List: `query($first: Int, $after: String) { resources(first: $first, after: $after) { nodes { id name } pageInfo { hasNextPage endCursor } } }`
- Get: `query($id: String!) { resource(id: $id) { id name description } }`
- Create: `mutation($input: CreateInput!) { create(input: $input) { success resource { id } } }`
- Update: `mutation($id: String!, $input: UpdateInput!) { update(id: $id, input: $input) { success } }`
