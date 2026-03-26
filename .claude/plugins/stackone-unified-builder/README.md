# stackone-unified-builder

Interactive step-by-step wizard for building unified Falcon connectors. Guides external builders through every phase — from choosing an output schema to live API testing.

## Installation

```bash
/plugin install stackone-unified-builder@stackone-claude-marketplace
```

## Usage

### Full wizard (recommended)

```bash
/build-unified-connector
```

Walks through all 6 steps in sequence. Progress is saved to `.connector-build-session.json` so you can pause and resume at any time.

### Individual steps

Each step can also be run independently. It reads the session file and picks up from the right context:

| Command | Step | What it does |
|---------|------|-------------|
| `/choose-schema` | 1 | Pick a StackOne built-in schema, point to your own, or define one interactively |
| `/check-connector` | 2 | Check if a base connector exists, pull it or scaffold a new one |
| `/scope-actions` | 3 | Choose which resources and CRUD operations to expose |
| `/map-fields` | 4 | Map provider API fields to your schema, writes YAML partials |
| `/validate-connector` | 5 | Validate the YAML config structure |
| `/test-connector` | 6 | Test live against the provider API and verify field output |

### Resume a session

```bash
/build-unified-connector
```

If a `.connector-build-session.json` exists, the wizard will offer to resume from where you left off.

## What it builds

A set of YAML configuration files in `connectors/<provider>/` that expose provider API data through StackOne's unified API. Supports both StackOne built-in schemas (HRIS, ATS, CRM, etc.) and custom schemas you define.

## Schema options

| Option | When to use |
|--------|-------------|
| **StackOne built-in** | Your data fits HRIS, ATS, CRM, LMS, IAM, Ticketing, Documents, or Marketing |
| **Existing schema file** | You already have a JSON/YAML schema in your project |
| **Define inline** | You want to define fields interactively during the wizard |

## Requirements

- `connectors-template` project structure (`connectors/` directory)
- Node.js — for the StackOne CLI (optional but recommended)
- Provider API credentials in `.env`

## How sessions work

Each step reads and writes `.connector-build-session.json` at the project root. This file stores:
- Provider name and schema choice
- CLI availability and connector setup status
- Action scope and known limitations
- Validation and test results

You can safely delete this file to start fresh.
