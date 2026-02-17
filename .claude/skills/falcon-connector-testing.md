---
name: Falcon Connector Testing
trigger: test connector|run tests|validate actions|test falcon config
description: Comprehensive testing workflow for Falcon connectors with mandatory action tracking, multi-auth testing, and 100% coverage verification.
---

# Falcon Connector Testing Skill

**When to use**: User asks to "test connector", "run tests", "validate actions", "test Falcon config"

**Workflow**: Comprehensive testing workflow for Falcon API connector configurations.

## Prerequisites

Before testing begins, ensure:
- [ ] YAML connector file validated via `stackone validate`
- [ ] All operations configured in YAML
- [ ] Credentials available for ALL auth types supported by provider
- [ ] Coverage ≥80% validated via `check_all_endpoints()`

## Testing Workflow

### Step 1: Create Action Tracking File (MANDATORY)

**CRITICAL**: Before ANY testing, create complete inventory of all actions.

**File**: `/tmp/<provider>_actions_tracking.json`

```json
{
  "provider": "provider_name",
  "timestamp": "2025-01-21T10:30:00Z",
  "auth_types": ["oauth2", "api_key"],
  "total_actions": 15,
  "actions": [
    {
      "actionName": "list_employees",
      "actionType": "LIST",
      "operation_path": "/employees",
      "method": "GET",
      "tested": false,
      "passed": false,
      "comments": "",
      "auxiliaryFor": [],
      "capturedData": {},
      "test_results": {}
    }
  ],
  "testing_progress": {
    "total_required_tests": 30,
    "tests_completed": 0,
    "percentage_complete": 0
  }
}
```

**Formula**: `total_required_tests = number_of_actions × number_of_auth_types`

**Columns Explained**:
- `actionName` - Operation/action ID from YAML
- `actionType` - LIST, GET, CREATE, UPDATE, DELETE
- `tested` - Boolean (true only when ALL auth types tested successfully)
- `passed` - Boolean (true if action works correctly)
- `comments` - Test scenarios, notes, or future requirements
- `auxiliaryFor` - List of actions this provides data for
- `capturedData` - IDs/tokens captured for dependent actions
- `test_results` - Per-auth-type results (status, timestamp, response_code)

### Step 2: Prepare Test Credentials

For EACH auth type the provider supports:

**OAuth2**: `{"accessToken": "token", "refreshToken": "refresh", "clientId": "id", "clientSecret": "secret"}`

**API Key**: `{"apiKey": "key"}`

**Basic**: `{"username": "user", "password": "pass"}`

**Account file** (all auth types): `{"environment": "production", "provider": "provider_name"}`

### Step 3: Test Actions in Cycles

**Testing Order** (dependency-based):

**Cycle 1: LIST Actions**
- No dependencies
- Capture IDs for GET/UPDATE/DELETE actions
- Mark as `auxiliaryFor` dependent actions

**Cycle 2: GET Actions**
- Use IDs from LIST actions
- Verify individual retrieval

**Cycle 3: CREATE Actions**
- Generate new resources
- Capture IDs for UPDATE/DELETE

**Cycle 4: UPDATE Actions**
- Use IDs from CREATE actions

**Cycle 5: DELETE Actions**
- Clean up from CREATE actions

### Step 4: Test Each Action (Per Auth Type)

For EACH action in tracking file:

#### A. Read Input Configuration

```bash
# Extract inputs from YAML
grep -A 30 "actionId: <action_name>" provider.*.partial.yaml
```

**Extract**:
- Required vs optional parameters (`required: true/false`)
- Parameter locations (`in: path/query/body`)
- Parameter types (`type: string/number/boolean`, `array: true`)

#### B. Prepare Parameters

Build params JSON based on location:

| Location | Format |
|----------|--------|
| Path | `{"path": {"id": "123"}}` |
| Query | `{"queryParams": {"max": 10, "filter": "active"}}` |
| Body | `{"body": {"title": "New", "description": "..."}}` |
| Mixed | `{"path": {"id": "123"}, "body": {"title": "Updated"}}` |

**Use captured data**: Reference IDs from `capturedData` in tracking file.

#### C. Test with EACH Auth Type

**Method 1: Async Tool (Batch Testing)**

```typescript
test_actions(config, maxIterations?, maxDurationMs?)
// Poll every 30-60 seconds
get_test_actions_task_status(taskId, provider)
```

**Method 2: Manual CLI (Individual Testing)**

```bash
stackone run --connector provider.connector.s1.yaml \
  --account account.json \
  --credentials oauth2_creds.json \
  --action-id <action_name> \
  --params '<params_json>' \
  [--debug]
```

**CLI Examples**:

```bash
# LIST (query params)
--params '{"queryParams":{"max":10}}'

# GET (path params)
--params '{"path":{"employeeId":"123"}}'

# CREATE (body params)
--params '{"body":{"title":"New Room"}}'

# UPDATE (path + body)
--params '{"path":{"id":"123"},"body":{"title":"Updated"}}'

# DELETE (path)
--params '{"path":{"id":"123"}}'
```

#### D. Handle Results

**✅ If PASSES**:
1. Capture useful data (IDs, tokens) in `capturedData`
2. Document test scenarios in `comments`
3. Mark as `auxiliaryFor` if provides data for other actions
4. Update `test_results.<auth_type>.status = "success"`
5. Update `test_results.<auth_type>.tested_at` (timestamp)
6. Update `test_results.<auth_type>.response_code`
7. Increment `testing_progress.tests_completed`

**❌ If FAILS**:
1. Analyze error (400, 401, 404, 405, 500)
2. Apply fix (see Fix Strategy below)
3. Re-test immediately
4. Repeat until passes OR action removed

#### E. Update Tracking File

**MANDATORY**: Update immediately after EACH test.

```bash
# Mark test result for specific auth type
test_results.oauth2.status = "success"
test_results.oauth2.tested_at = "2025-01-21T10:45:00Z"
test_results.oauth2.response_code = 200

# Only mark tested=true when ALL auth types pass
tested = true  // Only when all auth_types tested successfully
```

### Step 5: Fix Strategy

| Error | Root Cause | Fix |
|-------|-----------|-----|
| 400 Bad Request | Missing/wrong params | Fix parameter structure/type/location in YAML |
| 401/403 Forbidden | Missing auth scope | Add scope or document as admin-only |
| 404 Not Found | Invalid endpoint | Fix URL or REMOVE action |
| 405 Method Not Allowed | Wrong HTTP method | Fix method or REMOVE action |
| 500 Server Error | Invalid request format | Check body/headers, compare with working actions |

**Fix Resources (in order)**:
1. Existing connector YAML (similar actions)
2. Similar connectors (same auth type)
3. Provider API documentation
4. #building-a-falcon-connector docs

**When to REMOVE actions**:
- Endpoint doesn't exist (404 + verified in docs)
- Method not supported (405 + verified in docs)
- Endpoint deprecated by provider
- Requires unavailable scope

```json
{
  "actionName": "list_workspaces",
  "tested": true,
  "passed": false,
  "comments": "REMOVED - Endpoint deprecated, returns 404"
}
```

### Step 6: Monitor Progress

**After EACH test**:

```bash
# Check progress
cat /tmp/<provider>_actions_tracking.json | jq '.testing_progress'

# List untested actions
cat /tmp/<provider>_actions_tracking.json | jq '.actions[] | select(.tested == false) | .actionName'

# Check for failures
cat /tmp/<provider>_actions_tracking.json | jq '.actions[].test_results[][] | select(.status == "failed")'
```

### Step 7: Verify Completion (BLOCKING)

**BEFORE proceeding, ALL must pass**:

```bash
# Must return 100
cat /tmp/<provider>_actions_tracking.json | jq '.testing_progress.percentage_complete'

# Must return empty
cat /tmp/<provider>_actions_tracking.json | jq '.actions[] | select(.tested == false)'

# Must return empty
cat /tmp/<provider>_actions_tracking.json | jq '.actions[].test_results[][] | select(.status == "failed")'
```

**If ANY check fails**: DO NOT PROCEED. Fix and re-test.

### Step 8: Final Validation

```bash
# YAML validation
stackone validate src/configs/<provider>/<provider>.connector.s1.yaml

# Coverage validation (≥80%)
check_all_endpoints(discoveredActions, stackOneOperations, config)

# Test completion (100%)
check_test_completion(allOperations, testedOperations)
```

## Testing Approach Options

**Option 1: MINIMAL CONFIG** (Recommended for complex connectors)

Test individual operations with minimal YAML (header + single operation).

**Use when**:
- Multiple resource types
- Various action types (list, get, create, update, delete)
- Different HTTP methods
- Complex parameter requirements

**Benefits**:
- Faster iteration
- Clearer error messages
- Easier to identify auth-specific failures
- Simpler debugging

**Structure**: Include only `info`, `baseUrl`, `authentication`, and ONE operation.

**Option 2: FULL CONFIG**

Test complete connector at once.

**Use when**:
- Simple connector (≤5 operations)
- All operations use same patterns
- Complete, validated YAML

## Success Criteria

**Testing MUST achieve**:

- [ ] Action tracking file created before testing
- [ ] Every operation tested with EVERY auth type
- [ ] Tracking file updated after each test
- [ ] `testing_progress.percentage_complete === 100`
- [ ] All `test_results` show "success" status
- [ ] Zero operations with `tested: false`
- [ ] Zero failed tests in tracking file
- [ ] Coverage ≥80% (via `check_all_endpoints()`)
- [ ] 100% completion (via `check_test_completion()`)

**Testing Formula**: `Success = (operations × auth_types) tests completed at 100%`

## Anti-Patterns (NEVER DO)

- ❌ Testing with only one auth type when multiple exist
- ❌ Skipping action tracking file creation
- ❌ Not updating tracking file during testing
- ❌ Proceeding without 100% test coverage
- ❌ Marking `tested: true` before all auth types tested
- ❌ Ignoring failed tests
- ❌ Batch-updating tracking file instead of per-test updates

## CLI Reference

**Validation**:
```bash
stackone validate <config_file>
```

**Testing**:
```bash
stackone run --connector <file> \
  --account <file> \
  --credentials <file> \
  --action-id <name> \
  [--params <file>] \
  [--debug]
```

**Common Errors**:
- Invalid Action ID → Verify exact match in YAML
- Missing Parameters → Check `inputs` schema
- 401 Unauthorized → Verify credentials not expired
- Invalid Connector → Run `stackone validate`
- 500 Error → Use `--debug` for details

**Best Practices**:
1. Validate connector first
2. Test with minimal config for easier debugging
3. Use `--debug` when operations fail
4. Test each auth type separately
5. Verify action names match YAML exactly
6. Clean up credentials after testing (use `scramble_credentials()`)

## Next Steps

After 100% testing completion:

1. **Security**: `scramble_credentials()` - MANDATORY
2. **Meta Feedback**: `meta_feedback()` - MANDATORY
3. **Final verification**: Read tracking file, confirm zero failures

**No testing = worthless config. Partial testing = incomplete config = FAILURE.**
