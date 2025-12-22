# CORE STRUCTURE REFERENCE

<system_context>
YAML structure patterns for Falcon connectors. Complete spec: src/configs/README.md (993 lines).
</system_context>

<paved_path>
## Minimal Template

```yaml
StackOne: 1.0.0
info:
  title: Provider Name
  key: provider_key              # Namespace: {key}_{action_id}
  version: 1.0.0
  description: Brief description (1-2 sentences)
  assets:
    icon: https://stackone-logos.com/api/provider/filled/png

baseUrl: https://api.provider.com
rateLimit:
  mainRatelimit: 10              # req/sec

resources: "Provider API Docs: https://..."

authentication:
  - custom:
      type: custom
      label: API Token
      authorization:
        type: bearer             # or none, basic
        token: $.credentials.apiToken
      configFields:
        - key: apiToken
          label: API Token
          type: password
          required: true
          secret: true
      environments:
        - key: production
          name: Production

actions:
  $ref: provider.resource1       # Reference partials
```

## Action Template

```yaml
- actionId: list_users           # → {key}_list_users
  categories: [ticketing]
  actionType: custom             # custom (default), get, create, update, delete
  label: List Users
  description: Brief purpose (required)
  details: |                     # Optional: rate limits, permissions
    Rate limit: 100 req/min
    Required: users:read scope
  resources: "https://docs.../api/users#list"  # Action-specific (required)
  examples:                      # Optional
    - input: {limit: 10}
      output: {users: [...]}
  inputs:
    - name: limit
      type: number               # string, number, boolean, datetime_string, object
      in: query                  # query, path, headers, body
      required: false
      description: Max results (1-100)
    - name: userIds              # Array example
      type: string               # Element type
      array: true                # NOT type: array
      in: body
      description: User IDs to process
  steps:
    - stepId: fetch_users
      description: Fetch from API (required)
      stepFunction:
        functionName: request    # request, paginated_request, map_fields, typecast
        parameters:
          url: /users
          method: get
          args:                  # ALWAYS use args
            - name: Authorization
              value: "Bearer ${credentials.apiToken}"
              in: headers
            - name: limit        # Optional param
              value: $.inputs.limit
              in: query
              condition: '{{present(inputs.limit)}}'
  result:
    data: $.steps.fetch_users.output.data
```
</paved_path>

<patterns>
## Dynamic Values

```yaml
# JSONPath (direct reference, preferred)
token: $.credentials.apiToken
userId: $.inputs.userId
dataSource: $.steps.fetch.output.data

# String Interpolation (URLs, string construction)
url: /users/${inputs.id}
url: /calls/${inputs.callId}/transcript
baseUrl: https://${credentials.domain}.api.com

# JEXL (conditionals, transformations)
condition: '{{present(inputs.field)}}'
matchExpression: '{{$.type == "admin"}}'
value: '{{inputs.name.toUpperCase()}}'
```

## Step Functions

```yaml
# Standard request
functionName: request
parameters:
  url: /users
  method: post
  args:
    - name: email
      value: $.inputs.email
      in: body
    - name: phone          # Optional
      value: $.inputs.phone
      in: body
      condition: '{{present(inputs.phone)}}'

# Cursor pagination ONLY (not offset/page)
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
</patterns>

<critical_notes>
**Documentation:**
- description (required): Brief purpose
- resources (required): Action-specific docs URL
- details (optional): Rate limits, permissions
- examples (optional): Input/output samples

**File Organization:**
- Split by resource: `provider.users.s1.partial.yaml`
- Reference: `$ref: provider.users` in main file
- Namespace: `{connector_key}_{action_id}`

**Default:** actionType: custom (non-unified)
</critical_notes>

<file_map>
**Full Spec:** src/configs/README.md (993 lines)

**Auth Examples:**
- jira/ - Basic auth (lines 136-164)
- xero/ - OAuth 2.0 refresh (lines 173-290)
- zendesk/ - Bearer token

**Action Examples:**
- pagerduty/ - REST patterns
- linear/ - GraphQL variables
- github/ - Comprehensive coverage

**Advanced:**
- Field Configs: README.md:373-485
- GraphQL: README.md:808-903
- Custom Step Functions: README.md:677-678
</file_map>

<fatal_implications>
**YAML Errors:**
- ❌ `description: Filter by status: pending` → Use parentheses
- ❌ `type: array` → Use `array: true` with element type
- ❌ Direct `body` field → Use `args` array

**Input Types:**
- Allowed: string, number, boolean, datetime_string, object
- Forbidden: array, enum

**Non-Unified Actions:**
- Inputs MUST match provider API exactly
- Don't create inputs that don't exist in API
</fatal_implications>

---

*Workflow/testing: CLAUDE.md, testing-guide.md*
