# Connector Patterns Reference

YAML patterns for the most common connector configurations.
Used by `map-fields` and `validate-connector` sub-skills.

## File Structure

```
src/configs/<provider>/
├── <provider>.connector.s1.yaml             # Main connector (auth, base config)
└── <provider>.<resource>.s1.partial.yaml   # Actions for each resource
```

## Minimal Connector (API Key / Bearer Token)

```yaml
name: my-provider
version: "1.0"
authentication:
  type: custom
  args:
    api_key:
      value: "${MY_PROVIDER_API_KEY}"
  headers:
    Authorization: "Bearer ${args.api_key.value}"
baseUrl: "https://api.my-provider.com/v1"

actions: []
```

## Connector with OAuth2

```yaml
name: my-provider
version: "1.0"
authentication:
  type: oauth2
  clientId: "${MY_PROVIDER_CLIENT_ID}"
  clientSecret: "${MY_PROVIDER_CLIENT_SECRET}"
  tokenUrl: "https://auth.my-provider.com/oauth/token"
  scopes:
    - read:employees
    - read:departments
baseUrl: "https://api.my-provider.com/v1"

actions: []
```

## Connector with Basic Auth

```yaml
name: my-provider
version: "1.0"
authentication:
  type: custom
  args:
    username:
      value: "${MY_PROVIDER_USERNAME}"
    password:
      value: "${MY_PROVIDER_PASSWORD}"
  headers:
    Authorization: "Basic ${base64(args.username.value + ':' + args.password.value)}"
baseUrl: "https://api.my-provider.com/v1"

actions: []
```

## Non-Unified Action (raw provider response)

Use `actionType: custom` when you want to return the provider's raw response without mapping.

```yaml
- name: list_employees
  actionType: custom
  entrypointUrl: "/employees"
  entrypointHttpMethod: GET
  inputs:
    page:
      type: number
      required: false
    page_size:
      type: number
      required: false
  steps:
    - type: request
      id: fetch_employees
```

## Unified Action — list (paginated)

```yaml
- name: unified_list_employees
  actionType: list
  schemaType: unified
  schema: hris/employees
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
    - type: request
      id: fetch_employees
    - type: map_fields
      version: 2
      id: map_employee_fields
    - type: typecast
      version: 2
      id: cast_types
```

## Unified Action — get (single record by ID)

```yaml
- name: unified_get_employee
  actionType: get
  schemaType: unified
  schema: hris/employees
  entrypointUrl: "/employees/${inputs.id}"
  entrypointHttpMethod: GET
  inputs:
    id:
      type: string
      required: true
  fieldConfigs:
    - targetFieldKey: id
      expression: "$.id"
    - targetFieldKey: first_name
      expression: "$.firstName"
  steps:
    - type: request
      id: fetch_employee
    - type: map_fields
      version: 2
      id: map_fields
    - type: typecast
      version: 2
      id: typecast
```

## Unified Action — create

```yaml
- name: unified_create_employee
  actionType: create
  schemaType: unified
  schema: hris/employees
  entrypointUrl: "/employees"
  entrypointHttpMethod: POST
  inputs:
    first_name:
      type: string
      required: true
    last_name:
      type: string
      required: true
    work_email:
      type: string
      required: true
  steps:
    - type: request
      id: create_employee
    - type: map_fields
      version: 2
      id: map_fields
    - type: typecast
      version: 2
      id: typecast
```

## Partial File Pattern ($ref)

Keep the main connector clean by referencing partial files for each resource:

```yaml
# in <provider>.connector.s1.yaml
actions:
  - $ref: "./<provider>.employees.s1.partial.yaml"
  - $ref: "./<provider>.time_off.s1.partial.yaml"
  - $ref: "./<provider>.departments.s1.partial.yaml"
```

Each partial contains a raw YAML array of actions:

```yaml
# in <provider>.employees.s1.partial.yaml
- name: unified_list_employees
  actionType: list
  # ...

- name: unified_get_employee
  actionType: get
  # ...
```

## Pagination Patterns

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

## Auth Credential Variable Naming

| Auth Type | Variable Pattern | Example |
|-----------|----------------|---------|
| API Key | `${PROVIDER_API_KEY}` | `${BAMBOOHR_API_KEY}` |
| OAuth Client ID | `${PROVIDER_CLIENT_ID}` | `${SALESFORCE_CLIENT_ID}` |
| OAuth Secret | `${PROVIDER_CLIENT_SECRET}` | `${SALESFORCE_CLIENT_SECRET}` |
| Username | `${PROVIDER_USERNAME}` | `${WORKDAY_USERNAME}` |
| Password | `${PROVIDER_PASSWORD}` | `${WORKDAY_PASSWORD}` |
| Base URL | `${PROVIDER_BASE_URL}` | `${WORKDAY_BASE_URL}` |

Reference inside the connector using `${args.<name>.value}` after defining in the `args` block.
