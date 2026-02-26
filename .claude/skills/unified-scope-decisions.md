---
name: Unified Scope Decisions
trigger: scope|scopes|permissions|endpoint selection|trade-off|deprecated endpoint|narrow scope
description: Decision framework for selecting endpoints and scopes when building unified connectors, balancing security, performance, and data requirements.
---

# Unified Scope Decisions Skill

**When to use**: User needs to decide which endpoints to use, what scopes to request, or evaluate trade-offs between different API approaches.

## Core Principles

1. **Narrower scopes are always preferred** - Request only what's needed
2. **Never use deprecated endpoints** - Even if they seem easier
3. **Document trade-offs explicitly** - Customer should understand choices
4. **Required fields drive minimum scopes** - Optional fields may require additional scopes

## YAML Field Naming Convention

**PRINCIPLE: All configuration field names use camelCase**

This applies to ALL fields in Falcon connector YAML, not just specific ones.

```yaml
# CORRECT - camelCase for all config fields
scopeDefinitions:        # NOT scope_definitions
fieldConfigs:            # NOT field_configs
targetFieldKey:          # NOT target_field_key
enumMapper:              # NOT enum_mapper
matchExpression:         # NOT match_expression
dataKey:                 # NOT data_key
nextKey:                 # NOT next_key
pageSize:                # NOT page_size
indexField:              # NOT index_field
stepFunction:            # NOT step_function
functionName:            # NOT function_name
dataSource:              # NOT data_source
externalSources:         # NOT external_sources
compositeIdentifiers:    # NOT composite_identifiers
requiredScopes:          # NOT required_scopes
customErrors:            # NOT custom_errors
receivedStatus:          # NOT received_status
targetStatus:            # NOT target_status

# WRONG - snake_case will cause validation errors or silent failures
scope_definitions:       # WRONG
field_configs:           # WRONG
target_field_key:        # WRONG
```

**Why this matters**: The Falcon framework expects camelCase. Using snake_case may:
- Cause YAML validation to fail
- Result in fields being silently ignored
- Lead to runtime errors that are hard to debug

## Scope Definition Syntax

```yaml
scopeDefinitions:
  employees:read:
    description: Read employee basic information
```

### Scope Hierarchy

Use `includes` for scope inheritance:

```yaml
scopeDefinitions:
  employees:read:
    description: Read basic employee data

  employees:read_extended:
    description: Read extended employee data including compensation
    includes: employees:read  # Inherits base read scope

  employees:write:
    description: Create and update employees
    includes: employees:read  # Write implies read
```

### Action-Level Scopes

```yaml
- actionId: list_employees
  requiredScopes: employees:read
  # ...
```

### Field-Level Scopes

For fields that require additional permissions:

```yaml
fieldConfigs:
  - targetFieldKey: salary
    expression: $.get_employees.compensation.salary
    type: number
    requiredScopes: employees:compensation:read
```

## Decision Framework

### Step 1: Identify Required Fields

From your output schema, categorize fields:

| Category | Description | Example |
|----------|-------------|---------|
| **Critical** | Must have for core functionality | id, name, email |
| **Important** | High value but not blocking | department, hire_date |
| **Nice-to-have** | Additional context | office_location |

### Step 2: Map Fields to Endpoints

Create a matrix of fields vs endpoints:

```markdown
| Field | /v2/employees | /v2/employees/detailed | /v2/org/members |
|-------|---------------|------------------------|-----------------|
| id | Yes | Yes | Yes |
| first_name | Yes | Yes | Yes |
| department | No | Yes | Yes |
| salary | No | Yes | No |
| reports_to | No | No | Yes |
```

### Step 3: Map Endpoints to Scopes

```markdown
| Endpoint | Required Scopes | Notes |
|----------|-----------------|-------|
| /v2/employees | employees:read | Basic access |
| /v2/employees/detailed | employees:read, employees:compensation:read | Includes salary |
| /v2/org/members | employees:read, org:read | Cross-org data |
```

### Step 4: Apply Decision Tree

```
START
  │
  ├─ Can ALL critical fields be obtained with narrowest scope?
  │   ├─ YES → Use that endpoint (DONE)
  │   └─ NO → Continue
  │
  ├─ Are there deprecated endpoints that have the data?
  │   ├─ YES → DO NOT USE. Find alternative.
  │   └─ NO → Continue
  │
  ├─ Can critical fields be obtained with 2 endpoints?
  │   ├─ YES → Evaluate scope combination
  │   │   ├─ Combined scopes still narrower? → Use both endpoints
  │   │   └─ Single broader scope simpler? → Document trade-off, ask customer
  │   └─ NO → Continue
  │
  ├─ Must request broader scope for critical field?
  │   ├─ YES → Request broader scope, document reason
  │   └─ NO → Continue
  │
  └─ Important/nice-to-have fields need broader scope?
      ├─ YES → Make optional, document as "requires additional scope"
      └─ NO → Include in mapping
```

## Scope Trade-off Analysis Template

Document your analysis for customer review:

```markdown
## Scope Analysis: [Provider Name]

### Minimum Viable Scopes
Required for critical fields only:
- `employees:read` - Basic employee data (id, name, email)

### Recommended Scopes
Includes important fields:
- `employees:read` - Basic employee data
- `employees:extended:read` - Department, title, hire date

### Full Feature Scopes
All available fields:
- `employees:read` - Basic employee data
- `employees:extended:read` - Department, title, hire date
- `employees:compensation:read` - Salary information
- `org:read` - Organizational hierarchy

### Trade-off Summary
| Scope Level | Fields Available | Security Impact |
|-------------|------------------|-----------------|
| Minimum | id, name, email | Lowest risk |
| Recommended | + department, title | Low risk |
| Full | + salary, reports_to | Higher risk |

### Recommendation
Start with **Recommended** scope level. Add compensation scope only if salary data is critical for use case.
```

## Deprecated Endpoint Handling

### Never Use Deprecated Endpoints

Even if they:
- Have better data
- Require fewer scopes
- Are "still working"

### What To Do Instead

1. **Find the replacement endpoint**:
```yaml
# Document the analysis
# OLD (Deprecated): /v1/employees - Scheduled removal Q3 2024
# NEW: /v2/employees - Use this instead
```

2. **If replacement has different scope requirements**:
```markdown
### Migration Impact
The v2 API requires `employees:extended:read` scope for department data.
Previously available in v1 with just `employees:read`.

Recommendation: Request the additional scope rather than using deprecated v1.
```

3. **If replacement is missing fields**:
```markdown
### Field Gap Analysis
The deprecated /v1/employees endpoint included `legacy_id`.
The new /v2/employees endpoint does not have this field.

Options:
1. Use /v2/employees/mappings to get legacy_id separately (+1 API call)
2. Document that legacy_id is no longer available
3. Contact provider about alternative

Recommendation: Option 1 if legacy_id is critical, Option 2 otherwise.
```

## Performance vs Scope Trade-offs

### Scenario: Multiple Endpoints vs Broader Scope

```markdown
### Option A: Two Narrow-Scope Endpoints
- /v2/employees (employees:read) → basic data
- /v2/employees/extended (employees:extended:read) → additional data
- Total: 2 API calls per page, narrower scopes

### Option B: One Broader-Scope Endpoint
- /v2/employees/full (employees:full:read) → all data
- Total: 1 API call per page, broader scope

### Analysis
| Factor | Option A | Option B |
|--------|----------|----------|
| API calls | 2x | 1x |
| Latency | Higher | Lower |
| Rate limit impact | 2x | 1x |
| Scope breadth | Narrower | Broader |
| Data exposure | Less | More |

### Recommendation
Choose based on priority:
- Security-first → Option A (narrower scopes)
- Performance-first → Option B (fewer calls)
```

### Decision Matrix

| Priority | Recommendation |
|----------|----------------|
| Security > Performance | Multiple narrow-scope endpoints |
| Performance > Security | Single broader endpoint |
| Balanced | Narrow scopes for critical, broader for optional |

## Implementing Scope-Aware Fields

### Optional Fields Based on Scope

When some fields require additional scopes:

```yaml
fieldConfigs:
  # Always available
  - targetFieldKey: id
    expression: $.get_employees.id
    type: string

  # Requires additional scope
  - targetFieldKey: salary
    expression: $.get_extended.compensation.salary
    type: number
    requiredScopes: employees:compensation:read
    # This field will be null if scope not granted
```

### Conditional Steps Based on Scope

```yaml
steps:
  - stepId: get_basic
    description: Get basic employee data
    stepFunction:
      functionName: request
      parameters:
        url: /v2/employees
        method: get

  - stepId: get_compensation
    description: Get compensation data (if scope available)
    condition: '{{present(credentials.scopes) && credentials.scopes.includes("compensation:read")}}'
    stepFunction:
      functionName: request
      parameters:
        url: /v2/employees/compensation
        method: get
```

## Authentication Scope Configuration

### OAuth2 Scopes

```yaml
authentication:
  - oauth2:
      type: oauth2
      grantType: authorization_code
      authorization:
        scopes: employees:read employees:extended:read  # Space-separated
        scopeDelimiter: ' '  # Some APIs use comma
      # ...
```

### Dynamic Scope Selection

```yaml
setupFields:
  - key: scopes
    label: Requested Scopes
    type: text
    required: false
    description: |
      Space-separated list of scopes. Available scopes:
      - employees:read (required)
      - employees:extended:read (for department, title)
      - employees:compensation:read (for salary data)
    placeholder: employees:read employees:extended:read
```

## Common Scope Patterns by Category

### HRIS Connectors

```yaml
scopeDefinitions:
  employees:read:
    description: Read employee directory
  employees:extended:read:
    description: Read extended employee data
    includes: employees:read
  employees:compensation:read:
    description: Read salary and compensation
  employees:write:
    description: Create and update employees
    includes: employees:read
  org:read:
    description: Read organization structure
  time_off:read:
    description: Read PTO and leave data
```

### CRM Connectors

```yaml
scopeDefinitions:
  contacts:read:
    description: Read contact records
  contacts:write:
    description: Create and update contacts
    includes: contacts:read
  deals:read:
    description: Read deal/opportunity data
  deals:write:
    description: Create and update deals
    includes: deals:read
  activities:read:
    description: Read activities and tasks
```

### ATS Connectors

```yaml
scopeDefinitions:
  candidates:read:
    description: Read candidate profiles
  candidates:write:
    description: Create and update candidates
    includes: candidates:read
  jobs:read:
    description: Read job postings
  jobs:write:
    description: Create and update jobs
    includes: jobs:read
  applications:read:
    description: Read job applications
  assessments:read:
    description: Read assessment results
```

## Validation Checklist

Before finalizing scope configuration:

- [ ] Used `scopeDefinitions` (not `scope_definitions`)
- [ ] Documented minimum required scopes
- [ ] No deprecated endpoints used
- [ ] Trade-offs documented for broader scopes
- [ ] Field-level scopes noted where applicable
- [ ] Scope hierarchy defined with `includes`
- [ ] OAuth scope string uses correct delimiter

## Related Skills

- **Unified Connector Build Skill**: Overall workflow including scope analysis
- **Unified Field Mapping Skill**: Field-level scope requirements
- **Falcon Authentication Setup Skill**: OAuth scope configuration
