Test the MCP connector for provider: $ARGUMENTS

## CRITICAL: Progress Communication

**You MUST provide frequent status updates throughout this process.** Testing can take 5-10 minutes, and users need visibility into what's happening. Do NOT run tests silently in the background.

## Required Setup

Gather from user:
- StackOne account ID (e.g., Wc8pkmCj0HaVTGnWbWC12)
- Connector/provider name (e.g., bamboohr, datadog)
- StackOne API key for MCP server authentication
- CLI profile for pushing connector to StackOne

## Execution Phases

### Phase 0: Progress Tracking Setup

**IMMEDIATELY** create a todo list to show the user what's happening:

```
Use TodoWrite with:
- [ ] Read connector configuration files
- [ ] Identify all testable actions
- [ ] Set up test environment
- [ ] Run tests with progress reporting
- [ ] Generate final report
```

Update todo status as you complete each phase.

### Phase 1: Read Configuration

1. Search for connector files: `connectors/[provider]/*.yaml`
2. Read main connector and all partial files
3. **Output to user**:
   ```
   📂 Reading connector configuration files...
   📋 Found [N] actions across [M] config files
   Categories: [list categories like employees, time_off, etc.]
   ```

### Phase 2: Environment Setup

1. Create test directory, init npm, install dependencies
2. **Output to user**: "🔧 Setting up test environment..."
3. **Output when ready**: "🔧 Test environment ready"

### Phase 3: Generate Test Script

Generate test script with **BATCHED EXECUTION** for progress visibility:

```typescript
const BATCH_SIZE = 10;  // Report progress every 10 tests

// After each batch, output:
console.log(`⏳ Progress: ${completed}/${total} (${pct}%) - ✅ ${passed} passed, ❌ ${failed} failed`);
```

### Phase 4: Run Tests

**IMPORTANT**: Run tests in **FOREGROUND** (not background) so output streams live.

```
🧪 Starting test run - this typically takes 5-7 minutes for large connectors...

⏳ Progress: 10/99 (10%) - ✅ 10 passed, ❌ 0 failed
⏳ Progress: 20/99 (20%) - ✅ 19 passed, ❌ 1 failed
...
```

If you MUST use background execution:
- Poll every 30-60 seconds with `TaskOutput(block: false)`
- Output: "⏳ Tests still running... [elapsed time]"
- Continue until complete

### Phase 5: Report Results

```
============================================================
Test Results: [provider] Connector
============================================================
Total: [N] | Passed: [X] ✅ | Failed: [Y] ❌ | Pass Rate: [%]%

Failed Actions (if any):
- [action]: [error]
============================================================
```

### Phase 6: Fix Loop (if failures)

When issues found:
1. Diagnose root cause from error messages
2. Fix connector YAML
3. Run `stackone push` to deploy fix
4. Retry failed tests

## Test Approach

1. **Quick Connectivity Check** (optional): Run `stackone run` to verify basic connectivity

2. **Agent Simulation** (primary): Build TypeScript test harness using Claude Agent SDK with Haiku:
   - Generate domain-aware test scenarios (not mechanical transforms)
   - Test if agents can discover and correctly use actions
   - Capture agent reasoning to diagnose issues
   - Show conversations and progress as tests run

## Anti-Patterns (NEVER DO THESE)

- ❌ Running tests in background without progress polling
- ❌ Staying silent for more than 60 seconds during test execution
- ❌ Outputting results only at the very end
- ❌ Not using TodoWrite to show phases
- ❌ Not telling user how long tests typically take

## Example Output Flow

```
🔍 Starting connector test for bamboohr...

📂 Reading connector configuration files...
📋 Found 99 actions across 11 config files
   Categories: employees, time_off, benefits, goals, time_tracking, files, training, applicant_tracking, meta, reports, webhooks

🔧 Setting up test environment...
🔧 Test environment ready

🧪 Starting test run - this typically takes 5-7 minutes for large connectors...

⏳ Progress: 10/99 (10%) - ✅ 10 passed, ❌ 0 failed
⏳ Progress: 20/99 (20%) - ✅ 19 passed, ❌ 1 failed
⏳ Progress: 30/99 (30%) - ✅ 28 passed, ❌ 2 failed
⏳ Progress: 40/99 (40%) - ✅ 38 passed, ❌ 2 failed
...
⏳ Progress: 99/99 (100%) - ✅ 95 passed, ❌ 4 failed

============================================================
Test Results: bamboohr Connector
============================================================
Total: 99 | Passed: 95 ✅ | Failed: 4 ❌ | Pass Rate: 95.9%

Failed Actions:
- create_webhook: 403 Forbidden - insufficient permissions
- delete_employee: 404 Not Found - test data not found
============================================================
```

Usage: /test-mcp-connector <provider_name>
Example: /test-mcp-connector bamboohr
