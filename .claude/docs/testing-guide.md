# TESTING GUIDE

<fatal_implications>
**NON-NEGOTIABLE:** Test ALL actions. Every action in YAML must be validated with real API calls.

**Before completion:**
- check_test_completion(allActions, testedActions) → Must return 100%
- 90%+ success rate minimum
- Document untested actions with justification
</fatal_implications>

<critical_notes>
**Coverage:**
- ✅ ALL LIST actions (0 parameters)
- ✅ ALL GET actions (chain from LIST)
- ✅ ALL READ-ONLY actions
- ⚠️  WRITE actions (sandbox/test accounts, cleanup)

**Process:**
1. Test ALL read-only (list, get, search, query)
2. GET actions: LIST → extract IDs → GET with IDs
3. WRITE actions: Test in sandbox, document safety
4. check_test_completion() before claiming done
</critical_notes>

<paved_path>
## Method Selection

**Manual CLI (Development):**
- Build/debug individual actions
- `--debug` flag for HTTP inspection
- 1-10 actions interactively
- Immediate feedback

**Automated (Production):**
- 50-100+ actions in 2-10 min
- Comprehensive regression
- Final validation before production
- CI/CD integration

**Workflow:**
1. Dev: Manual CLI for build/debug
2. Initial: Manual CLI for core actions (auth, list, get)
3. Final: Automated for ALL actions (100%)
4. Production: Automated regression
</paved_path>

<patterns>
## CLI Testing Script

```bash
#!/bin/bash
CONNECTOR="src/configs/provider/provider.connector.s1.yaml"
ACCOUNT="account.json"
CREDS="credentials.json"
KEY="provider"  # Match info.key in YAML

PASSED=0
FAILED=0

test_action() {
  local action=$1
  local params=$2
  echo -n "Testing ${KEY}_${action}... "

  if [ -n "$params" ]; then
    echo "$params" > /tmp/params.json
    if stackone run --connector $CONNECTOR --account $ACCOUNT --credentials $CREDS \
      --action-id "${KEY}_${action}" --params /tmp/params.json 2>&1 | grep -q "executed successfully"; then
      echo "✅ PASSED"; ((PASSED++))
    else
      echo "❌ FAILED"; ((FAILED++))
    fi
  else
    if stackone run --connector $CONNECTOR --account $ACCOUNT --credentials $CREDS \
      --action-id "${KEY}_${action}" 2>&1 | grep -q "executed successfully"; then
      echo "✅ PASSED"; ((PASSED++))
    else
      echo "❌ FAILED"; ((FAILED++))
    fi
  fi
}

# Test LIST (no params)
echo "=== LIST ACTIONS ==="
test_action "list_users" ""
test_action "list_services" ""

# Get IDs
echo "=== FETCH IDS ==="
USER_ID=$(stackone run --connector $CONNECTOR --account $ACCOUNT --credentials $CREDS \
  --action-id ${KEY}_list_users 2>/dev/null | jq -r '.data.users[0].id // .data.data.users[0].id // empty' | head -1)

# Test GET (with IDs)
echo "=== GET ACTIONS ==="
[ -n "$USER_ID" ] && test_action "get_user" "{\"path\":{\"id\":\"$USER_ID\"}}" || echo "⏭️  SKIPPED get_user"

echo "SUMMARY: $PASSED passed, $FAILED failed"
```
</patterns>

<example>
## CLI Commands

```bash
# Minimum version
npm install -g @stackone/cli@1.10.1

# Test action
stackone run --connector connector.s1.yaml \
  --account account.json \
  --credentials credentials.json \
  --action-id provider_list_users

# With parameters
stackone run --connector connector.s1.yaml \
  --account account.json \
  --credentials credentials.json \
  --action-id provider_get_user \
  --params params.json

# Debug mode
stackone run --connector connector.s1.yaml \
  --account account.json \
  --credentials credentials.json \
  --action-id provider_list_users \
  --debug
```

**Action ID Format:**
- ❌ `list_users` → "Action not found"
- ✅ `{connector_key}_{action_id}` → Works (e.g., `pagerduty_list_users`)
</example>

<workflow>
## Systematic Testing

**Phase 1: Prep**
1. npm run build
2. stackone validate <file>
3. Prepare credentials (account.json, credentials.json)
4. Identify safe actions (read vs write)
5. Plan ID chaining (LIST → GET)

**Phase 2: Execute**
1. Test ALL LIST actions
2. Extract IDs from LIST results
3. Test ALL GET actions (using IDs)
4. Test WRITE actions (sandbox)
5. Document skipped actions

**Phase 3: Validate**
1. check_test_completion(allActions, testedActions)
2. Verify 90%+ success
3. Address failures
4. Ensure 100% before claiming done
</workflow>

<file_map>
**Before Testing:**
- [ ] npm run build
- [ ] stackone validate
- [ ] Credentials ready
- [ ] Safe actions identified
- [ ] ID chaining planned

**CLI Requirements:**
- Min version: @stackone/cli@1.10.1
- Action format: {key}_{action_id}

**Example Patterns:**
- Search codebase for `test_action` patterns
- LIST → ID extraction → GET chaining
</file_map>

---

*Structure/workflow: CLAUDE.md, core-structure.md*
