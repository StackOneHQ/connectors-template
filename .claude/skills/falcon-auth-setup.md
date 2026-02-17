---
name: Falcon Authentication Setup
trigger: set up auth|configure auth|add oauth|add api key|authentication setup
description: Configure authentication for Falcon connectors including OAuth 2.0, API keys, and client credentials flows with framework-specific patterns.
---

# Falcon Authentication Setup Skill

**When to use**: User asks to "set up authentication", "configure auth", "add OAuth", "add API key auth" for a Falcon connector

**Workflow**: Configure authentication for Falcon API connector configurations.

## Framework Limitations

**⚠️ CRITICAL**: Only TWO authentication types are supported:

1. **`type: custom`** - For static credentials (API keys, Basic auth) with NO token exchange
2. **`type: oauth2`** - For authorization code or client credentials flows with token exchange

**There is NO** `customAuthentication`, `authConfig`, `tokenAuth`, or similar fields. These do not exist in the framework.

## Quick Decision Guide

```
Does the API require calling an endpoint to get a token?
├─ YES → Use type: oauth2 with grantType: client_credentials + refreshAuthentication
│         Examples: Tableau PAT signin, Greenhouse token endpoint
└─ NO  → Use type: custom with authorization.type: basic|bearer|apiKey
          Examples: Jira API token, Slack bearer token

Does the API use custom headers (not Authorization)?
├─ YES → Set authorization.type: none + add headers in each action's args
│         Example: Tableau uses X-Tableau-Auth header
└─ NO  → Use standard authorization.type: basic|bearer
```

## Authentication Analysis (CRITICAL)

**⚠️ Analyze the actual authentication flow implementation, not provider terminology.**

Providers may use terms like "API Key", "Personal Access Token", or "Token" but actually implement OAuth 2.0 flows. What a provider calls "API authentication" may actually be OAuth 2.0 authorization code flow.

**Always verify the actual flow**:
1. Review token endpoint and request/response structure
2. Check how tokens are used in subsequent API calls
3. Identify if there's a token exchange step (credentials → token)
4. Determine if tokens expire and how they're refreshed

## Custom Headers (CRITICAL)

**⚠️ CUSTOM HEADERS MUST GO IN ACTION ARGS, NOT AUTH CONFIG**

If custom authentication headers are required by the provider (i.e., using something other than or in addition to "Authorization" header), they MUST be defined in the `args` section of EVERY action's request step.

**This is the ONLY way to add custom headers. There is no alternative field or section.**

```yaml
# Example: Custom X-API-Key header
steps:
  - stepId: fetch_users
    stepFunction:
      functionName: request
      parameters:
        url: /users
        method: get
        args:
          - name: X-API-Key
            value: $.credentials.apiKey
            in: headers
```

## Field Types

- **`setupFields`** - T1 facing account credential fields
  - OAuth apps and multi-tenant provider credentials
  - Examples: Client ID, Client Secret, scopes

- **`configFields`** - T2 facing account credential fields
  - End user credential information
  - Examples: API token, user-specific subdomain

- **`label`** - Allowed values: `API Key`, `OAuth 2.0`
  - Only include additional text if absolutely necessary to differentiate
  - Keep to bare minimum if needed

## Authentication Type 1: API Key (type: custom)

For static credentials with no token exchange.

### API Key Example

```yaml
authentication:
  - custom:
      type: custom
      label: API Key
      support:
        link: https://hub.stackone.com/connection-guides/ticketing/jira
        description: The steps in this guide require Admin privileges within Jira.
      authorization:
        type: basic
        username: $.credentials.email
        password: $.credentials.accessToken
      configFields:
        - key: accessToken
          label: API Token
          type: password
          required: true
          secret: true
          placeholder: ATATT3xFfGF0aQNaJZQ9JtSvQ_example
          description: You can generate an API Token by going to your Atlassian Account Settings > Security > Create and manage API tokens.
          tooltip: Make sure to save your API token securely as it won't be shown again.
      environments:
        - key: production
          name: Production
      testActions:
        - action: list_users
          required: true
```

### Authorization Types for Custom Auth

**Basic Authentication**:
```yaml
authorization:
  type: basic
  username: $.credentials.email
  password: $.credentials.apiKey
```

**Bearer Token**:
```yaml
authorization:
  type: bearer
  token: $.credentials.accessToken
```

**API Key in Header**:
```yaml
authorization:
  type: apiKey
  key: X-API-Key
  value: $.credentials.apiKey
  in: header
```

**API Key in Query**:
```yaml
authorization:
  type: apiKey
  key: api_key
  value: $.credentials.apiKey
  in: query
```

**No Authorization Header** (use custom headers in action args):
```yaml
authorization:
  type: none
```

## Authentication Type 2: OAuth 2.0 (type: oauth2)

For authorization flows with token exchange.

### OAuth Authorization Code Flow

Typical configuration (Authorization code → Access Token → Refresh Token).

**Example connectors**: asana, gmail, xero

**Complex examples**: jira (includes post-authentication call to retrieve cloud ID)

**Note**: If refresh token request does not require authorization headers (credentials in body), explicitly include `authorization: type: none` in step parameters.

### OAuth Client Credentials Flow

For server-to-server authentication with no user interaction.

**Key Differences from Authorization Code**:
- Uses `grantType: client_credentials`
- Uses `configFields` instead of `setupFields` (though some use both)
- Uses `authorization.type: bearer` instead of `oauth2`
- No authorization URL or authorization params needed
- Token obtained directly using client ID and secret
- Refresh token action uses `grant_type: client_credentials` instead of `refresh_token`

**Example Connectors**:
- **greenhouse** - Basic auth for token request, `grant_type` in query
- **globalizationpartners** - `authorization: type: none`, credentials in body, includes `audience`
- **bigchange** - Uses `oauth2` type (not `custom`), both `setupFields` and `configFields`

### Client Credentials Example

```yaml
authentication:
  - oauth2:
      type: oauth2
      label: OAuth 2.0
      grantType: client_credentials
      configFields:
        - key: clientId
          label: Client ID
          type: text
          required: true
        - key: clientSecret
          label: Client Secret
          type: password
          required: true
          secret: true
      tokenUrl: https://api.provider.com/oauth/token
      authorization:
        type: bearer
        token: $.credentials.accessToken
      refreshAuthentication:
        - stepId: refresh_token
          stepFunction:
            functionName: request
            parameters:
              url: https://api.provider.com/oauth/token
              method: post
              authorization:
                type: basic
                username: $.credentials.clientId
                password: $.credentials.clientSecret
              args:
                - name: grant_type
                  value: client_credentials
                  in: query
          result:
            accessToken: $.output.data.access_token
            expiresIn: $.output.data.expires_in
      environments:
        - key: production
          name: Production
      testActions:
        - action: list_users
          required: true
```

### Important Notes

**Token Request Parameters**:
- `grant_type: client_credentials` can be in `query` or `body` (depends on provider)
- Some providers return `expires_at` (timestamp) instead of `expires_in` (seconds)
  - Use JEXL to calculate: `expiresIn: "{{expires_at - now()}}"`

**Token Endpoint Authentication** (varies by provider):
- **Basic authentication**: `authorization.type: basic` with client ID as username, secret as password
- **No authorization header**: `authorization.type: none` with `client_id` and `client_secret` in body
- **Bearer token**: `authorization.type: bearer` (less common)

**Optional Parameters**:
- Some providers require additional params (e.g., `audience`, `sub`)
- Use `condition` to only include when present:
  ```yaml
  - name: audience
    value: $.credentials.audience
    in: body
    condition: "{{present(credentials.audience)}}"
  ```

## Test Actions

The `testActions` field specifies which actions verify authentication credentials.

When a user connects their account, StackOne automatically runs these test actions to ensure the connection works.

```yaml
testActions:
  - action: list_users
    required: true
  - action: get_workspace
    required: false
```

- **`action`**: The action ID to execute for testing
- **`required`**: If `true`, test must pass for connection to be established

## Best Practices

1. **Analyze the actual flow**, not provider terminology
2. **Check for token exchange** - if yes, use `oauth2`; if no, use `custom`
3. **Use JSONPath** for credential references: `$.credentials.field`
4. **Custom headers go in action args**, not auth config
5. **Test actions** should verify connection works
6. **Reference similar connectors** in `src/configs/` for patterns
7. **Read provider docs carefully** for auth requirements

## Common Patterns

**Subdomain-based APIs**:
```yaml
configFields:
  - key: subdomain
    label: Subdomain
    type: text
    required: true
    description: Your organization's subdomain (e.g., 'acme' in acme.provider.com)

# Then use in baseUrl
baseUrl: https://${credentials.subdomain}.api.provider.com
```

**Multiple auth methods** (offer both OAuth and API key):
```yaml
authentication:
  - oauth2:
      type: oauth2
      label: OAuth 2.0
      ...
  - custom:
      type: custom
      label: API Key
      ...
```

**Dynamic token expiry**:
```yaml
result:
  accessToken: $.output.data.access_token
  refreshToken: $.output.data.refresh_token
  expiresIn: "{{output.data.expires_at - Math.floor(Date.now() / 1000)}}"
```

## Troubleshooting

**Issue**: Custom headers not working
- **Solution**: Add headers to EVERY action's `args`, not auth config

**Issue**: Token refresh failing
- **Solution**: Check if provider requires `authorization: type: none` for refresh endpoint

**Issue**: 401 Unauthorized errors
- **Solution**: Verify credential field names match exactly between auth config and provider requirements

**Issue**: Provider calls it "API Key" but uses OAuth
- **Solution**: Analyze actual flow - if there's token exchange, use `oauth2` regardless of terminology
