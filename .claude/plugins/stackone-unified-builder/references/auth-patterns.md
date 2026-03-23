# Authentication Patterns Reference

Detailed YAML patterns for every authentication type supported by the Falcon framework.
Used by the `configure-auth` sub-skill.

## Decision Guide

- Token exchange via endpoint call? → `type: oauth2`
- No token exchange? → `type: custom`
- Custom headers (not standard Authorization)? → `type: custom` with `authorization.type: none`, inject headers in every action's step args

## Key Concepts

- `setupFields` (T1-facing): Multi-tenant/app-level credentials (OAuth Client ID/Secret, scopes)
- `configFields` (T2-facing): End-user specific credentials (API token, username, sub-domain)
- `testActions`: Verify credentials on connection — use action requiring minimal input (e.g., `list_users`)
- `environments`: Define available environments (production, sandbox)
- `support`: Link + description for connection guide

## Authorization Types (under `custom`)

| Type | Requires | Use case |
|------|----------|----------|
| `basic` | `username`, `password` | Username + password base64-encoded in Authorization header |
| `bearer` | `token` | Static bearer token in Authorization header |
| `apiKey` | `key`, `value`, `in` (header or query) | API key in a named header or query parameter |
| `none` | — | Inject credentials manually in every action's step args |

## Referencing Credentials

- **JSONPath** (for values): `$.credentials.apiKey`
- **String Interpolation** (for URLs): `https://${credentials.subdomain}.api.com`

---

## Custom Auth — Basic Auth

```yaml
authentication:
  - custom:
      type: custom
      label: API Key
      support:
        link: https://hub.stackone.com/connection-guides/provider
        description: Admin privileges required
      authorization:
        type: basic
        username: $.credentials.email
        password: $.credentials.accessToken
      configFields:
        - key: email
          label: Email Address
          type: string
          required: true
        - key: accessToken
          label: API Token
          type: password
          required: true
          secret: true
          placeholder: ATATT3xFfGF0aQNaJZ...
          description: Generate via Account Settings > Security > API tokens
          tooltip: Save securely, won't be shown again
      environments:
        - key: production
          name: Production
      testActions:
        - action: list_users
          required: true
```

---

## Custom Auth — Bearer Token

```yaml
authentication:
  - custom:
      type: custom
      label: API Key
      authorization:
        type: bearer
        token: $.credentials.apiKey
      configFields:
        - key: apiKey
          label: API Key
          type: password
          required: true
          secret: true
      testActions:
        - action: list_users
          required: true
```

---

## Custom Auth — API Key Header

```yaml
authentication:
  - custom:
      type: custom
      label: API Key
      authorization:
        type: apiKey
        key: X-API-Key
        value: $.credentials.apiKey
        in: header
      configFields:
        - key: apiKey
          label: API Key
          type: password
          required: true
          secret: true
      testActions:
        - action: list_users
          required: true
```

---

## Custom Auth — Custom Headers (type: none)

When the API needs non-standard headers, set `authorization.type: none` and pass credentials in EVERY action's step args:

```yaml
# In connector YAML
authentication:
  - custom:
      type: custom
      label: API Key
      authorization:
        type: none
      configFields:
        - key: customKey
          label: Custom Header API Key
          type: password
          required: true
      testActions:
        - action: list_users
          required: true

# In EVERY partial action step:
stepFunction:
  functionName: request
  parameters:
    url: '/users'
    method: get
    args:
      - name: X-API-Key
        value: $.credentials.customKey
        in: headers
```

---

## OAuth 2.0 — Authorization Code

```yaml
authentication:
  - oauth2:
      type: oauth2
      label: OAuth 2.0
      grantType: authorization_code
      authorizationUrl: https://api.provider.com/oauth/authorize
      tokenUrl: https://api.provider.com/oauth/token
      setupFields:
        - key: clientId
          label: Client ID
          type: string
          required: true
        - key: clientSecret
          label: Client Secret
          type: password
          required: true
          secret: true
      scopes:
        - resource.read
        - resource.write
      testActions:
        - action: get_current_user
          required: true
```

If the refresh token request does not require authorization headers, add:

```yaml
refreshAuthentication:
  authorization:
    type: none
```

---

## Security

- ALWAYS run `scramble_credentials()` with `securityLevel: PRODUCTION` before storing/committing
- Never use `DEBUG` preset in production
- Supply `customPatterns` for provider-specific credential formats

---

## Common Auth Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `401 Unauthorized` | Wrong credentials or expired token | Check `.env` values, re-authenticate |
| `403 Forbidden` | Valid credentials, insufficient permissions | Add required scopes or API permissions |
| Literal `$.credentials.apiKey` in request | Interpolation not working | Ensure configFields key matches the reference |
| `base64 is not defined` | Basic auth syntax error | Use the `authorization.type: basic` pattern above |
