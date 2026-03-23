---
name: setup-connector
description: Step 1 of building a generic Falcon connector. Checks StackOne's provider index via MCP, detects CLI availability, and either pulls an existing connector base config or scaffolds a new one.
invoke: setup-connector
---

# Setup Connector

Step 1 of the generic connector build process.

## Session File

Read `.connector-build-session.json`. If `provider` is already set:
> "Resuming — provider already set to `{{provider}}`. Run `/configure-auth` to continue."

---

## Step 1: Ask for provider name

Ask:
> "What provider are you building a connector for? (e.g., `workday`, `bamboohr`, `rippling`)"

Save as `provider` (lowercase, hyphenated).

---

## Step 2: Check StackOne provider index

```
map_provider_key("{{provider}}")
```

If a key is returned, save as `provider_key` in session.

```
get_provider_actions("{{provider_key}}")
```

If indexed actions exist:
> "Found `{{provider}}` in the StackOne index with {{N}} known actions. I'll use this as a reference."

If not found:
> "`{{provider}}` isn't indexed yet — we'll discover actions from scratch in Step 3."

---

## Step 3: Detect CLI availability

```bash
npx @stackone/cli --version
```

Save `cli_available: true` or `false` to session.

If unavailable:
> "StackOne CLI isn't available. I'll guide manual scaffolding instead."

---

## Step 4: Pull or scaffold

**If CLI available, first check if a pullable connector exists:**
```bash
npx @stackone/cli list | grep -ix "{{provider}}"
```
Use `-x` for full-line matching to avoid false positives from substring or hyphenated-name matches. If found in the CLI list, pull it:
```bash
npx @stackone/cli pull {{provider}}
```
Verify `src/configs/{{provider}}/` was created. Save `connector_exists: true`.

Note: A provider may have indexed actions (from Step 2) but no pullable connector config. Always check the CLI list before attempting `pull`.

**If not in index or scaffolding fresh:**
```bash
npx @stackone/cli scaffold {{provider}}
```
Or if CLI unavailable, create `src/configs/{{provider}}/{{provider}}.connector.s1.yaml` manually:
```yaml
name: {{provider}}
version: "1.0"
authentication: {}  # configured in next step
baseUrl: ""         # set in next step
actions: []
```
Save `connector_exists: false`.

Save `connector_path: "src/configs/{{provider}}"` to session.

---

## Handoff

> "Setup complete. ✓ Connector at `src/configs/{{provider}}/`
>
> Next: configure authentication.
> Run `/configure-auth` to continue."

Update `session_step` to `"configure-auth"`.
