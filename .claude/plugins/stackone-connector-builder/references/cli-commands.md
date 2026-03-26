# StackOne CLI Reference

Used by the `check-connector` and `validate-connector` sub-skills.

## Installation Check

```bash
npx @stackone/cli --version
```

If this returns a version number, the CLI is available. If it errors, proceed with manual scaffolding.

## Key Commands

### Validate a connector config
```bash
npx @stackone/cli validate connectors/<provider>/<provider>.connector.s1.yaml
```
Checks YAML structure, required fields, and action definitions. Returns validation errors with line numbers.

### List available connectors
```bash
npx @stackone/cli list
```
Returns a list of provider names StackOne has indexed. Use to check if a connector already exists before scaffolding from scratch.

### Pull an existing connector
```bash
npx @stackone/cli pull <provider-name>
```
Downloads the connector config to `connectors/<provider>/`. Creates the folder and YAML files if they don't exist. Use as a starting point.

### Test an action
```bash
npx @stackone/cli test <provider> <action-name>
```
Runs a live API call against the action using credentials in `.env`. Returns the raw provider response followed by the mapped unified response.

Add `--debug` to see the raw provider response before field mapping is applied:
```bash
npx @stackone/cli test <provider> <action-name> --debug
```

### Scaffold a new connector
```bash
npx @stackone/cli scaffold <provider-name>
```
Creates `connectors/<provider>/` with a starter `<provider>.connector.s1.yaml`. Does NOT pull from StackOne's index — creates a blank template.

## Environment Setup

The CLI reads credentials from `.env` in the project root. Variable names follow `<PROVIDER>_<AUTH_TYPE>` in uppercase:

```bash
# .env examples
BAMBOOHR_API_KEY=your_key_here
SALESFORCE_CLIENT_ID=your_client_id
SALESFORCE_CLIENT_SECRET=your_client_secret
WORKDAY_BASE_URL=https://api.workday.com
```

## Common CLI Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `YAML parse error at line N` | Invalid YAML syntax | Check indentation — use 2 spaces, not tabs |
| `Missing required field: entrypointUrl` | Action missing URL | Add `entrypointUrl` to the action |
| `Unknown actionType: custom2` | Typo in actionType | Valid: `custom`, `list`, `get`, `create`, `update`, `delete` |
| `schemaType required for unified action` | Missing schemaType (unified actions only) | Add `schemaType: unified` — only needed for unified actions, not `actionType: custom` |
| `fieldConfigs required when schemaType is unified` | Missing field mapping (unified actions only) | Add `fieldConfigs` array — only applicable to unified actions |
| `Missing step: map_fields` | Unified action missing pipeline step (unified actions only) | Add `request`, `map_fields`, `typecast` steps — only for unified actions |
| `401 Unauthorized` | Bad credentials | Check `.env` and the `authentication` block in connector YAML |
| `404 Not Found` | Wrong endpoint URL | Verify `entrypointUrl` against provider API docs |
| `Cannot find module '@stackone/cli'` | CLI not installed | Run `npm install -g @stackone/cli` or use `npx` |
