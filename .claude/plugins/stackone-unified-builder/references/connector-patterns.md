# Connector Patterns Reference

Official Falcon YAML patterns for connector configurations.
Used by `map-fields` and `validate-connector` sub-skills.

## File Structure

```
connectors/<provider>/
├── <provider>.connector.s1.yaml             # Main connector (auth, base config)
└── <provider>.<resource>.s1.partial.yaml   # Actions for each resource
```

## Main Connector File Template

```yaml
StackOne: 1.0.0
info:
  title: Provider Name
  key: provider_name
  version: 1.0.0
  assets:
    icon: https://stackone-logos.com/api/provider_name/filled/png
  description: Brief description
  details: |
    Extended information about this connector

baseUrl: https://api.provider.com
releaseStage: preview

rateLimit:
  mainRatelimit: 10

resources: https://api.provider.com/docs

scopeDefinitions:
  employees.write:
    description: Allow writing and modifying employees
    includes: employees.read
  employees.read:
    description: Allow reading employees

authentication:
  # See auth-patterns.md for full authentication options

actions:
  $ref: provider_name.employees
  $ref: provider_name.departments
```

## Partial File Pattern ($ref)

The main connector references partial files. Each partial starts directly with `- actionId:` — there is **NO `actions:` wrapper** in partial files.

**In the main connector:**
```yaml
actions:
  $ref: provider_name.employees
  $ref: provider_name.departments
```

**In `provider_name.employees.s1.partial.yaml`:**
```yaml
- actionId: list_employees
  actionType: custom
  # ...

- actionId: get_employee
  actionType: custom
  # ...
```

---

## Non-Unified Actions

Non-unified actions return the provider's raw response without StackOne schema mapping.
They use `stepFunction`/`functionName`/`parameters`, `stepId`, and `actionId`.
They do NOT use `entrypointUrl`, `entrypointHttpMethod`, or `response:` blocks.

### Non-Unified Action — List (with pagination)

```yaml
- actionId: list_employees
  categories: [employees]
  actionType: custom
  label: List Employees
  description: Retrieve a list of employees
  details: |
    Fetches all employees with pagination support. Rate limit: 100/min.
  resources: https://api.provider.com/docs/employees
  examples:
    - input: { page: 1 }
      output: { data: [{ id: "1", name: "John Doe" }] }
  requiredScopes: employees.read
  inputs:
    - name: page
      description: Page number to retrieve
      type: number
      in: query
      required: false
  steps:
    - stepId: list_employees
      description: Fetch employees with pagination
      stepFunction:
        functionName: paginated_request
        parameters:
          url: "/employees"
          method: get
          response:
            dataKey: results
            nextKey: nextCursor
          iterator:
            key: cursor
            in: query
  result:
    data: $.steps.list_employees.output.data
```

### Non-Unified Action — Get (single record)

```yaml
- actionId: get_employee
  categories: [employees]
  actionType: custom
  label: Get Employee
  description: Retrieve a single employee by ID
  resources: https://api.provider.com/docs/employees
  requiredScopes: employees.read
  inputs:
    - name: id
      description: The employee ID
      type: string
      in: path
      required: true
  steps:
    - stepId: get_employee
      description: Fetch a single employee
      stepFunction:
        functionName: request
        parameters:
          url: "/employees/${inputs.id}"
          method: get
  result:
    data: $.steps.get_employee.output.data
```

### Non-Unified Action — Create (POST with body)

```yaml
- actionId: create_employee
  categories: [employees]
  actionType: custom
  label: Create Employee
  description: Create a new employee record
  resources: https://api.provider.com/docs/employees
  requiredScopes: employees.write
  inputs:
    - name: first_name
      description: Employee first name
      type: string
      in: body
      required: true
    - name: last_name
      description: Employee last name
      type: string
      in: body
      required: true
    - name: email
      description: Employee work email
      type: string
      in: body
      required: false
  steps:
    - stepId: create_employee
      description: Create a new employee
      stepFunction:
        functionName: request
        parameters:
          url: "/employees"
          method: post
          args:
            - name: firstName
              value: $.inputs.first_name
              in: body
            - name: lastName
              value: $.inputs.last_name
              in: body
            - name: email
              value: $.inputs.email
              in: body
              condition: "{{present(inputs.email)}}"
  result:
    data: $.steps.create_employee.output.data
```

### Non-Unified Action — Update (PATCH/PUT with ID + body)

```yaml
- actionId: update_employee
  categories: [employees]
  actionType: custom
  label: Update Employee
  description: Update an existing employee record
  resources: https://api.provider.com/docs/employees
  requiredScopes: employees.write
  inputs:
    - name: id
      description: The employee ID
      type: string
      in: path
      required: true
    - name: first_name
      description: Updated first name
      type: string
      in: body
      required: false
    - name: last_name
      description: Updated last name
      type: string
      in: body
      required: false
  steps:
    - stepId: update_employee
      description: Update an employee
      stepFunction:
        functionName: request
        parameters:
          url: "/employees/${inputs.id}"
          method: patch
          args:
            - name: firstName
              value: $.inputs.first_name
              in: body
              condition: "{{present(inputs.first_name)}}"
            - name: lastName
              value: $.inputs.last_name
              in: body
              condition: "{{present(inputs.last_name)}}"
  result:
    data: $.steps.update_employee.output.data
```

### Non-Unified Action — Delete

```yaml
- actionId: delete_employee
  categories: [employees]
  actionType: custom
  label: Delete Employee
  description: Delete an employee record
  resources: https://api.provider.com/docs/employees
  requiredScopes: employees.write
  inputs:
    - name: id
      description: The employee ID
      type: string
      in: path
      required: true
  steps:
    - stepId: delete_employee
      description: Delete an employee
      stepFunction:
        functionName: request
        parameters:
          url: "/employees/${inputs.id}"
          method: delete
  result:
    data: $.steps.delete_employee.output
```

---

## Unified Actions

Unified actions map provider data to a StackOne unified schema.
They use `schemaType: unified`, `schema`, `cursor`, `fieldConfigs`, and three steps: `request`, `map_fields` (v2), `typecast` (v2).
Unified actions use `entrypointUrl` and `entrypointHttpMethod`.
Unified actions use a `response:` block inside the request step.

### Unified Action — List (paginated)

```yaml
- actionId: unified_list_employees
  categories: [employees]
  actionType: list
  schemaType: unified
  schema: hris/employees
  label: List Employees (Unified)
  description: Retrieve a unified list of employees
  resources: https://api.provider.com/docs/employees
  requiredScopes: employees.read
  entrypointUrl: "/employees"
  entrypointHttpMethod: GET
  cursor:
    type: page
    requestParam: page
    responsePath: $.meta.next_page
  fieldConfigs:
    - targetFieldKey: id
      expression: "$.id"
    - targetFieldKey: first_name
      expression: "$.firstName"
    - targetFieldKey: last_name
      expression: "$.lastName"
    - targetFieldKey: work_email
      expression: "$.workEmail"
    - targetFieldKey: employment_status
      expression: "$.status"
      enumMapper:
        active: active
        inactive: inactive
        terminated: inactive
  steps:
    - stepId: fetch_employees
      description: Fetch employees from provider API
      stepFunction:
        functionName: request
        parameters:
          url: "/employees"
          method: get
          response:
            dataKey: data
            nextKey: meta.next_page
    - stepId: map_employee_fields
      description: Map provider fields to unified schema
      stepFunction:
        functionName: map_fields
        version: 2
    - stepId: cast_types
      description: Cast fields to correct types
      stepFunction:
        functionName: typecast
        version: 2
```

### Unified Action — Get (single record)

```yaml
- actionId: unified_get_employee
  categories: [employees]
  actionType: get
  schemaType: unified
  schema: hris/employees
  label: Get Employee (Unified)
  description: Retrieve a single unified employee by ID
  resources: https://api.provider.com/docs/employees
  requiredScopes: employees.read
  entrypointUrl: "/employees/${inputs.id}"
  entrypointHttpMethod: GET
  inputs:
    - name: id
      description: The employee ID
      type: string
      in: path
      required: true
  fieldConfigs:
    - targetFieldKey: id
      expression: "$.id"
    - targetFieldKey: first_name
      expression: "$.firstName"
    - targetFieldKey: last_name
      expression: "$.lastName"
  steps:
    - stepId: fetch_employee
      description: Fetch a single employee
      stepFunction:
        functionName: request
        parameters:
          url: "/employees/${inputs.id}"
          method: get
          response:
            dataKey: data
    - stepId: map_fields
      description: Map provider fields to unified schema
      stepFunction:
        functionName: map_fields
        version: 2
    - stepId: typecast
      description: Cast fields to correct types
      stepFunction:
        functionName: typecast
        version: 2
```

---

## Pagination Patterns

Used in `paginated_request` for non-unified actions, or `cursor` block for unified actions.

### Page number (most common)
```yaml
cursor:
  type: page
  requestParam: page
  responsePath: $.pagination.next_page
```

### Cursor / token
```yaml
cursor:
  type: cursor
  requestParam: cursor
  responsePath: $.meta.next_cursor
```

### Offset
```yaml
cursor:
  type: offset
  requestParam: offset
  pageSize: 100
```

### Link header (RFC 5988)
```yaml
cursor:
  type: link_header
```

### paginated_request iterator patterns (non-unified)

**Cursor-based:**
```yaml
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

**Page-number-based:**
```yaml
stepFunction:
  functionName: paginated_request
  parameters:
    url: "/records"
    method: get
    response:
      dataKey: data
      nextKey: meta.next_page
    iterator:
      key: page
      in: query
```

**Offset-based:**
```yaml
stepFunction:
  functionName: paginated_request
  parameters:
    url: "/records"
    method: get
    response:
      dataKey: items
      totalKey: total
    iterator:
      key: offset
      in: query
      step: 100
```

**Link header:**
```yaml
stepFunction:
  functionName: paginated_request
  parameters:
    url: "/records"
    method: get
    response:
      dataKey: data
      paginationType: link_header
```

---

## Result Mapping

### Read actions (list/get)
```yaml
result:
  data: $.steps.<stepId>.output.data
```

### Write actions (create/update)
```yaml
result:
  data: $.steps.<stepId>.output.data
```

### Delete actions
```yaml
result:
  data: $.steps.<stepId>.output
```

---

## Key Distinctions Summary

| Feature | Non-Unified | Unified |
|---|---|---|
| `actionType` | `custom` | `list`, `get`, `create`, etc. |
| `schemaType` | not present | `unified` |
| `schema` | not present | e.g. `hris/employees` |
| `entrypointUrl` | **NOT used** | required |
| `entrypointHttpMethod` | **NOT used** | required |
| `response:` in request step | **NOT used** | required |
| `cursor` block | not present | present for list actions |
| `fieldConfigs` | not present | required |
| Steps | `request` only | `request` + `map_fields` v2 + `typecast` v2 |
| Step structure | `stepId` + `stepFunction` | `stepId` + `stepFunction` |

**Important v2.2.0 breaking change:** Use `resources` (NOT `context`) for documentation links at both the connector and action level.

---

## Auth Credential Variable Naming

| Auth Type | Variable Pattern | Example |
|-----------|----------------|---------|
| API Key | `${PROVIDER_API_KEY}` | `${BAMBOOHR_API_KEY}` |
| OAuth Client ID | `${PROVIDER_CLIENT_ID}` | `${SALESFORCE_CLIENT_ID}` |
| OAuth Secret | `${PROVIDER_CLIENT_SECRET}` | `${SALESFORCE_CLIENT_SECRET}` |
| Username | `${PROVIDER_USERNAME}` | `${WORKDAY_USERNAME}` |
| Password | `${PROVIDER_PASSWORD}` | `${WORKDAY_PASSWORD}` |
| Base URL | `${PROVIDER_BASE_URL}` | `${WORKDAY_BASE_URL}` |
| Subdomain | `${PROVIDER_SUBDOMAIN}` | `${BAMBOOHR_SUBDOMAIN}` |
| Account ID | `${PROVIDER_ACCOUNT_ID}` | `${NETSUITE_ACCOUNT_ID}` |

Reference inside the connector using `$.credentials.<key>` (JSONPath) or `${credentials.<key>}` (string interpolation). The `<key>` can be a `configFields` or `setupFields` key from the authentication block, or an auth-managed credential like `accessToken` or `refreshToken` (set automatically by OAuth flows).
