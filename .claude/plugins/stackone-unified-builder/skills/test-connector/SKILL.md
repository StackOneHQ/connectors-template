---
name: test-connector
description: Step 6 (final) of building a unified connector. Runs live action tests against the provider API, verifies field mapping output matches the schema, and surfaces failures with actionable fix guidance.
invoke: test-connector
---

# Test Connector

Step 6 — the final step of the unified connector build process.

## Session File

Read `.connector-build-session.json`.

If `validated` is not `true`, warn:
> "The connector hasn't been validated yet. Run `/validate-connector` first — it catches structural issues before you spend time on live tests."

If `cli_available` is `false`:
> "The StackOne CLI isn't available, so I can't run automated tests. I'll guide you through manual verification instead."

---

## Step 1: Credentials check

Ask before running anything:
> "Do you have credentials for `{{provider}}` ready in your `.env` file?
>
> You'll need a line like:
> ```
> {{PROVIDER_CREDENTIAL_NAME}}=your_value_here
> ```
>
> The exact variable name is in `connectors/{{provider}}/{{provider}}.connector.s1.yaml` — look in the `authentication` block for the `args` key names."

Wait for confirmation before proceeding.

---

## Step 2: Test each action

Work through each resource and action in `action_scope`. Test in this order: `list` → `get` → `create` → `update` → `delete`.

**If MCP tools are accessible:**

Use `test_actions` for automated testing:
```
test_actions({
  provider: "{{provider}}",
  actions: ["unified_list_{{resource}}", "unified_get_{{resource}}", "unified_create_{{resource}}", "unified_update_{{resource}}", "unified_delete_{{resource}}"],
  // Include only actions that exist in action_scope
})
```

Poll with `get_test_actions_task_status(taskId)` until complete.

**If running manually via CLI:**
```bash
npx @stackone/cli test {{provider}} unified_{{action}}_{{resource}}
```

---

## Step 3: Verify output for each action

**For `list` actions:**
- Does the response contain a `data` array?
- Does each item in `data` have all required schema fields populated (non-null)?
- If the provider has multiple pages — is there a `next_cursor` or `next_page` token in the response?
- Are there any unexpected null fields that should have values?

**For `get` actions:**
- Single object returned with the correct schema shape?
- Does the `id` field match what was requested?

**For `create` actions:**
- Record created successfully?
- Does the response contain the new record's `id`?

**For `update` actions:**
- Changes reflected in the response?

**For `delete` actions:**
- Returns success (200 or 204)?

---

## Step 4: Diagnose and fix failures

**Field is null or missing in output:**
> "Field `{{field}}` is missing. Let's debug:
> 1. Run with `--debug` to see the raw provider response: `npx @stackone/cli test {{provider}} unified_{{action}}_{{resource}} --debug`
> 2. Find `{{field}}` in the raw response — what is the actual JSONPath?
> 3. Update the `expression` in `fieldConfigs` to match."

Show the fix in the partial YAML and re-test.

**Enum value passes through unmapped:**
> "The value `{{value}}` for `{{field}}` isn't in the `enumMapper`. Add it:"
```yaml
enumMapper:
  {{value}}: {{schema_value}}
```

**Pagination not advancing:**
> "The next page isn't being fetched. Check:
> 1. What pagination style does `{{provider}}` use? (page number, cursor token, or link header)
> 2. In the raw response, where does the 'next page' value live?
> 3. Update the `cursor.responsePath` in the action to point to that field."

**Authentication error (401/403):**
> "Authentication failed. Check:
> 1. Is the `.env` variable name correct?
> 2. Does the `authentication` block reference it correctly?
> 3. Is the credential still valid (not expired)?"

**404 / endpoint not found:**
> "The API endpoint returned 404. Verify `entrypointUrl` against the provider's API docs — the path may be wrong or require a different base URL."

After each fix, re-test the affected action. Repeat until all actions pass.

---

## Step 5: Final summary

When all actions pass:
> "All tests passed! ✓
>
> **Connector summary:**
>
> | Resource | Actions | Status |
> |----------|---------|--------|
> | `{{resource1}}` | {{actions1}} | ✓ |
> | `{{resource2}}` | {{actions2}} | ✓ |
>
> **Next steps:**
> 1. Commit your connector: `git add connectors/{{provider}}/ && git commit -m 'feat: add {{provider}} unified connector'`
> 2. If you'd like StackOne to index this connector, open a pull request to the connectors repository.
> 3. Test end-to-end with a real integration account."

**After all tests pass, always run:**
```
scramble_credentials("{{provider}}")
```

Save `"tested": true` and `"completed_at": "{{datetime}}"` to session.
