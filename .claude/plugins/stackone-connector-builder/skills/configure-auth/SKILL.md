---
name: configure-auth
description: Step 2 of building a generic Falcon connector. Asks which authentication type the provider uses, generates the correct YAML auth block from patterns, and writes it into the connector config file.
invoke: configure-auth
---

# Configure Auth

Step 2 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. Confirm:
> "Configuring auth for `{{provider}}`."

Read `${CLAUDE_PLUGIN_ROOT}/references/auth-patterns.md` before starting.

---

## Step 1: Identify auth type

Ask:
> "How does `{{provider}}`'s API authenticate requests?
>
> **A) API Key / Bearer token** — static key passed in a header
> **B) OAuth 2.0** — users authorise via a browser flow
> **C) Basic Auth** — username and password
> **D) API Key in query parameter** — key appended to the URL
> **E) Something else** — describe it and I'll help figure it out
>
> (A/B/C/D/E)"

---

## Step 2: Collect credential details

Ask for the specific values needed:

- **A (Bearer):** "What header does `{{provider}}` expect? (e.g., `Authorization: Bearer ...`, `X-API-Key: ...`)"
- **B (OAuth2):** "Do you have the token URL and authorization URL? What scopes are needed?"
- **C (Basic Auth):** "Is this username + password, or username + API key as the password?"
- **D (Query param):** "What is the query parameter name? (e.g., `api_key`, `token`)"
- **E (Other):** Gather details and match to closest pattern in `auth-patterns.md`

---

## Step 3: Write auth block into connector YAML

Read `src/configs/{{provider}}/{{provider}}.connector.s1.yaml`.

Replace the `authentication: {}` placeholder with the correct pattern from `auth-patterns.md`.

Also set `baseUrl`:
> "What is the base URL for `{{provider}}`'s API? (e.g., `https://api.provider.com/v1`)"

If unknown, use placeholder: `baseUrl: "# TODO: set provider base URL"`.

---

## Step 4: Show required .env variables

Tell the builder exactly what to add to `.env`:
> "Add these to your `.env` file before testing:
> ```
> {{PROVIDER_CREDENTIAL_VARS}}
> ```"

---

## Step 5: Confirm

Show the written auth block and ask:
> "Does this look right? The credentials stay in `.env` — the YAML only references them by variable name."

Apply any corrections.

Save to session:
- `auth_type`: The authentication type (`custom` or `oauth2`)
- `auth_details`: Full auth configuration including header names, credential references, and authorization type (e.g., `{ "authorization_type": "none", "custom_headers": [{ "name": "X-Api-Key", "value": "$.credentials.apiKey" }] }`). This is needed by `/build-config` to add the correct auth headers to each action's request step.

---

## Handoff

> "Auth configured. ✓
>
> Next: choose which actions to build.
> Run `/discover-actions` to continue."

Update `session_step` to `"discover-actions"`.
