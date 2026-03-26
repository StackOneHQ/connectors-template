---
name: check-connector
description: Step 2 of building a unified connector. Checks if the StackOne CLI is available, looks up whether the connector already exists in the StackOne index, and either pulls it down or scaffolds a new one based on auth type.
invoke: check-connector
---

# Check Connector

Step 2 of the unified connector build process.

## Session File

Read `.connector-build-session.json`. If `provider` is missing, tell the builder:
> "No provider found in session. Run `/choose-schema` first to set up your provider and schema."

Greet with context:
> "Checking connector for provider: `{{provider}}`"

---

## Step 0: Check StackOne provider index

Before checking the CLI, look up the provider in StackOne's index:

```
map_provider_key("{{provider}}")
```

If a provider key is returned, save as `provider_key` in session and run:

```
get_provider_actions("{{provider_key}}")
```

If indexed actions exist, tell the builder:
> "Found `{{provider}}` in the StackOne index with {{N}} known actions. I'll use this as a reference when building your connector."

If nothing is found, continue — we'll scaffold from scratch.

---

## Step 1: Detect CLI availability

Run:
```bash
npx @stackone/cli --version
```

**If successful:** Save `"cli_available": true` to session. Continue to Step 2.

**If it errors or is not found:** Save `"cli_available": false` to session.

Tell the builder:
> "The StackOne CLI isn't available in this environment. That's fine — I'll guide you through manual scaffolding instead."

Skip to **Path B: Manual scaffold** below.

---

## Step 2: Check if connector exists in StackOne index

Run:
```bash
npx @stackone/cli list
```

Search the output for the provider name (case-insensitive match).

**If found:** Tell the builder:
> "`{{provider}}` exists in the StackOne connector index. I'll pull the base config down for you."

Proceed to **Path A: Pull existing connector**.

**If not found:** Tell the builder:
> "`{{provider}}` isn't in the StackOne connector index yet — you'll be building this from scratch."

Proceed to **Path B: Scaffold new connector**.

---

## Path A: Pull existing connector

Run:
```bash
npx @stackone/cli pull {{provider}}
```

Verify `connectors/{{provider}}/` was created and contains at least one `.yaml` file.

List the files found and confirm:
> "Pulled connector config:
> - `connectors/{{provider}}/{{provider}}.connector.s1.yaml`
> - ..."
>
> "This is a starting point — we'll add unified actions on top. Does the folder look right?"

Save to session:
```json
{
  "connector_exists": true,
  "connector_path": "connectors/{{provider}}"
}
```

---

## Path B: Scaffold new connector

Ask the builder about authentication:
> "What authentication type does `{{provider}}` use?
>
> **A) API Key / Bearer token** — a static key or token passed in a header
> **B) OAuth 2.0** — user authorizes via browser, you get access tokens
> **C) Basic Auth** — username and password
> **D) Something else** — I'll help you figure it out"

Read `${CLAUDE_PLUGIN_ROOT}/references/connector-patterns.md` and use the matching pattern to create `connectors/{{provider}}/{{provider}}.connector.s1.yaml`.

**If CLI is available, try scaffolding first:**
```bash
npx @stackone/cli scaffold {{provider}}
```

Then open the generated file and update the `authentication` block to match the chosen auth type using the patterns from `connector-patterns.md`.

**If CLI is not available:** Write the starter YAML directly using the matching pattern from `connector-patterns.md`.

After creating the file, tell the builder:
> "Created starter connector at `connectors/{{provider}}/{{provider}}.connector.s1.yaml`.
>
> Before testing, add your credentials to `.env`:
> ```
> {{PROVIDER_CREDENTIAL_NAME}}=your_value_here
> ```
>
> The variable name is shown in the `authentication` block of your connector YAML."

Save to session:
```json
{
  "connector_exists": false,
  "connector_path": "connectors/{{provider}}",
  "auth_type": "{{auth_type}}"
}
```

---

## Handoff

After the connector is set up:
> "Connector is ready at `connectors/{{provider}}/`. ✓
>
> **CLI available:** {{cli_available}}
> **Connector was pre-existing:** {{connector_exists}}
> **Auth type:** {{auth_type}}
>
> Next step: decide which resources and operations to build.
> Run `/scope-actions` to continue."

Update `session_step` to `"scope-actions"` in the session file.
