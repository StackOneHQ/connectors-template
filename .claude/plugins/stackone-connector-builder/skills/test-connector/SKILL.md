---
name: test-connector
description: Step 6 (final) of building a generic Falcon connector. Tests all actions live, tracks and deletes every test record created, prints a cleanup report, and scrambles credentials when done.
invoke: test-connector
---

# Step 6: Test Connector

You are on the final step of building a generic Falcon connector. This step runs live tests against the provider API, tracks every record created, cleans up all test artifacts, and scrambles credentials when done.

**Generic connectors use `actionType: custom` and return raw provider responses — no schema mapping.**

---

## Session Check

Read `.connector-build-session.json` from the project root.

If `validated` is not `true`, warn the builder:

> Warning: The session does not show this connector has been validated. It is strongly recommended to run `/validate-connector` before running live tests. You can continue, but validation errors may cause test failures.

Extract from the session:
- `provider` — the provider slug (e.g. `smartrecruiters`)
- `action_scope` — the list of resources and their actions to test
- `test_artifacts` — existing array (initialize to `[]` if missing)

---

## Step 1: Credentials Check

Before running any tests, confirm the builder has their credentials ready.

Ask the builder:

> Before we run live tests, confirm that your `.env` file is set up with the credentials for `{{provider}}`.
>
> Check the `authentication` block in your connector YAML for the exact environment variable name(s) required. For example, if the YAML shows `apiKey: ${{env.SMARTRECRUITERS_API_KEY}}`, make sure `SMARTRECRUITERS_API_KEY` is set in your `.env`.
>
> Reply "ready" when your credentials are in place, or share any issues and we can troubleshoot first.

Wait for the builder to confirm before proceeding.

---

## Step 2: Test Each Action

Work through every resource in `action_scope` in this order for each resource:

```
list → get → create → update → delete
```

Only test actions that are present in `action_scope` for that resource. Skip any action not listed.

### MCP Path (preferred)

Use the `test_actions` MCP tool:

```json
test_actions({
  "provider": "{{provider}}",
  "actions": ["list_{{resource}}", "get_{{resource}}", "create_{{resource}}", "update_{{resource}}", "delete_{{resource}}"]
})
```

This returns a `taskId`. Poll `get_test_actions_task_status(taskId)` every few seconds until `status` is `"completed"` or `"failed"`. Retrieve the results from the completed task response.

Run one resource at a time so you can track artifacts and handle cleanup per resource before moving to the next.

### CLI Fallback

If MCP tools are unavailable, run each action individually:

```bash
npx @stackone/cli test {{provider}} {{action}}
```

For example:
```bash
npx @stackone/cli test smartrecruiters list_jobs
npx @stackone/cli test smartrecruiters create_job
```

Add `--debug` to see the raw request and response if needed.

---

## Step 3: Verify Output

After each action completes, verify the response matches expectations:

**`list` actions:**
- Response contains an array of items (even if empty is acceptable, confirm with builder)
- If the provider paginates, check that pagination fields are present (e.g. `next_page`, `cursor`, `offset`, `total`)
- Note the ID of the first item — you may need it for the `get` test

**`get` actions:**
- Response is a single object (not an array)
- The returned ID matches the ID requested

**`create` actions:**
- Response contains a new record ID
- **Immediately record this ID** in `test_artifacts` (see Step 4)

**`update` actions:**
- Response reflects the changes that were sent in the request body (or returns 200/204 with no body — check the provider docs)

**`delete` actions:**
- Response is HTTP 200 or 204
- **Immediately confirm cleanup** with a follow-up `get` (see Step 4)

If any verification fails, go to Step 5 (diagnose and fix) before continuing.

---

## Step 4: Cleanup (CRITICAL)

**Every test record created must be tracked and deleted. The goal is to leave zero trace on the provider system.**

### Tracking Created Records

Immediately after every successful `create` response, add an entry to `test_artifacts` in the session:

```json
{
  "resource": "{{resource}}",
  "id": "{{new_record_id}}",
  "cleaned_up": false
}
```

Write the updated `test_artifacts` array back to `.connector-build-session.json` right away — do not wait until the end.

### Deleting Test Records

After the last mutating step for a resource is verified (e.g., `update`, or `create` if no `update` exists), run `delete` on the test record created during `create`:

- If `delete_{{resource}}` is in `action_scope`: run it targeting the created record's ID
- After delete: if `get_{{resource}}` is in `action_scope`, run it for that ID and confirm a 404 or empty response
- Mark the artifact as `cleaned_up: true` in the session file

### When Delete Is Not Available

If `delete_{{resource}}` is **not** in `action_scope`:

1. Check if any soft-cleanup action is available in `action_scope` for this resource — for example: `archive_{{resource}}`, `deactivate_{{resource}}`, `cancel_{{resource}}`
2. If a soft-cleanup action exists: run it and mark the artifact as `cleaned_up: true, reason: "soft-deleted via {{action}}"`
3. If no cleanup is possible at all: mark the artifact as:

```json
{
  "resource": "{{resource}}",
  "id": "{{id}}",
  "cleaned_up": false,
  "reason": "no delete endpoint"
}
```

Always write `test_artifacts` back to the session file after each cleanup attempt — never batch this at the end.

### Cleanup Report

After all resources have been tested, print this summary:

```
Test cleanup summary:
✓ {{resource}}/{{id}} — created and deleted
✓ {{resource}}/{{id}} — created and soft-deleted via archive_{{resource}}
⚠ {{resource}}/{{id}} — created, no delete endpoint; record remains in {{provider}}
```

Use `✓` for fully cleaned up records and `⚠` for records that remain.

---

## Step 5: Diagnose and Fix Failures

If any action returns an error, diagnose and fix before moving on:

**HTTP 401 or 403:**
- Credentials are missing or incorrect
- Re-check the `.env` file — confirm the variable name matches the `authentication` block exactly
- Confirm the API key or token has not expired

**HTTP 404:**
- The endpoint path in the connector YAML may be wrong
- Check the provider's API docs for the correct path
- Confirm any path parameters (e.g. `:id`) are being substituted correctly in the `url` field

**HTTP 422 or 400:**
- The request body format is wrong
- Check the provider API docs for required fields on this endpoint
- Review the `body` block in the connector action YAML — confirm field names and types match what the provider expects
- Run with `--debug` to see the exact request being sent: `npx @stackone/cli test {{provider}} {{action}} --debug`

**Unexpected response shape:**
- The response structure does not match what was expected for verification
- Run with `--debug` to see the raw response: `npx @stackone/cli test {{provider}} {{action}} --debug`
- This is expected for generic connectors — the raw provider response is returned as-is, so update your verification expectations to match what the provider actually returns

After fixing any issue, re-run the affected action before continuing.

---

## Step 6: Final Summary

When all actions have been tested and cleanup is complete:

### Results Table

Print a table of every action tested:

```
Resource         | Action   | Status
-----------------|----------|--------
{{resource}}     | list     | ✓ passed
{{resource}}     | get      | ✓ passed
{{resource}}     | create   | ✓ passed
{{resource}}     | update   | ✓ passed
{{resource}}     | delete   | ✓ passed
```

### Cleanup Report

Print the cleanup report from Step 4.

### Next Steps

> All tests passed. Here is what to do next:
>
> 1. Commit the connector YAML to the connectors repo
> 2. Open a pull request targeting the `main` branch of the connectors repo
> 3. Request a review from the connectors team
> 4. Once merged, test with a real integration account via the StackOne dashboard

### Scramble Credentials

**Always run this, even if some cleanup failed:**

```json
scramble_credentials("{{provider}}")
```

This invalidates the test credentials so they cannot be reused or leaked.

### Save Session

Write the following to `.connector-build-session.json`:

```json
{
  "tested": true,
  "completed_at": "{{datetime}}"
}
```

Merge these fields into the existing session object — do not overwrite the entire file.

---

The connector is complete.
