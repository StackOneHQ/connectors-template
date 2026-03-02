---
name: stackone-cli
trigger: stackone cli|stackone run|stackone validate|stackone push|stackone pull|stackone help
description: |
  Automatically applies StackOne CLI knowledge when working with connectors.

  **Auto-triggers when:**
  - User mentions StackOne CLI commands (validate, run, push, pull, etc.)
  - User asks about testing or validating connectors
  - User wants to deploy or manage connectors
  - User asks how to use CLI with connectors

  This skill directs you to the canonical documentation sources.
---

# StackOne CLI Reference

## Documentation Sources of Truth

When working with the StackOne CLI, **always use these two authoritative sources:**

### 1. CLI README (Primary Reference)

The official README is bundled with the CLI package. Read it for complete documentation:

```bash
# Local project installation (preferred)
cat node_modules/@stackone/cli/README.md

# Or find it dynamically
cat "$(npm root)/@stackone/cli/README.md"
```

**Always read this file first** when answering questions about CLI usage, commands, options, or examples.

### 2. Built-in Help (Command Reference)

Use `stackone help` for exhaustive, up-to-date command information:

```bash
# General help - lists all commands
stackone help

# Help for specific command
stackone help validate
stackone help run
stackone help push
stackone help pull
```

The help output is always current with the installed CLI version.

---

## How to Use This Skill

When a user asks about StackOne CLI:

1. **Read the README:**
   ```bash
   cat node_modules/@stackone/cli/README.md
   ```

2. **If you need command-specific details, run help:**
   ```bash
   stackone help <command>
   ```

3. **Answer based on these sources** - do not rely on cached knowledge about commands or options, as they change frequently.

---

## Finding the CLI README

Check these locations in order:

| Installation Type | Path |
|-------------------|------|
| Local project | `node_modules/@stackone/cli/README.md` |
| macOS (Homebrew) | `/opt/homebrew/lib/node_modules/@stackone/cli/README.md` |
| macOS (npm global) | `/usr/local/lib/node_modules/@stackone/cli/README.md` |
| Linux | `/usr/local/lib/node_modules/@stackone/cli/README.md` |
| Windows | `%APPDATA%\npm\node_modules\@stackone\cli\README.md` |

```bash
# Check local installation first (most common)
test -f node_modules/@stackone/cli/README.md && cat node_modules/@stackone/cli/README.md

# Find global installation path
npm root -g
# Then read: <global-root>/@stackone/cli/README.md

# Or find dynamically
cat "$(npm root -g)/@stackone/cli/README.md"
```

---

## Quick Tips

- **Always check the README** - it's the canonical source of truth
- **Use `stackone help`** - it reflects the exact version installed
- **Keep CLI updated** - run `stackone update` for latest features
- **Use `--debug` flag** when troubleshooting issues
