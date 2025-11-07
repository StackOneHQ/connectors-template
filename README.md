# Visier Connectors

## Description

This repository contains a collection of connectors for and created by, Visier.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd visier-connectors
   ```

2. Install dependencies:

   ```bash
   npm ci
   ```

   This will automatically:

   - Install all required packages
   - Set up Git hooks

3. Set up authentication:

   ```bash
   npx @stackone/cli agent setup --local
   ```

   This command will:

   - Authenticate via OAuth with StackOne
   - Securely store your access token as `STACKONE_FALCON_MCP_TOKEN` environment variable
   - Generate `.mcp.json` configuration for MCP servers
   - Configure the project for local development

   **Global setup (optional):**

   ```bash
   npx @stackone/cli agent setup --global
   ```

   Use this to configure authentication once across all StackOne projects.

### MCP Configuration

This project uses MCP (Model Context Protocol) servers for enhanced AI capabilities. The `.mcp.json` configuration file is automatically generated using the `@stackone/cli` tool.

**Security:** Your access token is stored as an environment variable reference in `.mcp.json`, making it safe to commit. The actual token is never stored in the repository.

**Cleanup credentials:**

```bash
npx @stackone/cli agent cleanup
```

This removes all stored credentials and generated configuration files.

## Building Connectors

For comprehensive guides on building and converting connectors, see:

- **[Building Falcon Connectors](src/configs/README.md)** - Complete guide to YAML structure, authentication, operations, and step functions

## How to Contribute

1. Fork this repository.
2. Clone your fork to your local machine.
3. Create a new branch for your changes.

### Development Husbandry

- Development branches should be branched from `main`.
- Feature branches should follow this format:  
  `eng-[ticket]/[short-description]`  
  _Example:_ `eng-1234/provider-define-location-endpoint`
- Commits should follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format:  
  _Examples:_
  - `feat: add new feature`
  - `fix: resolve edge case in provider logic`
  - `chore: update dependencies`

## Git Hook System

This repository uses a lightweight Git hook system to enforce code quality and automate certain tasks during development.

### Hooks Overview

- **pre-commit**  
  Runs `npm run lint` before each commit. If linting fails, it attempts to auto-fix issues and re-stage only the originally staged files.  
  The hook prevents commits unless code passes lint.

- **post-merge**  
  After pulling or merging branches, this hook checks for newer versions of `@stackone/connect-sdk`.  
  If a newer version is available, it will install the update automatically and stage any resulting changes to `package.json` or `package-lock.json`.

### Hook Installation

Git hooks are stored in the `.githooks/` directory and are automatically installed into `.git/hooks/` after running `npm install`.

#### No Manual Setup Needed

On `npm install`, a setup script will:

- Compare files in `.githooks/` with your local `.git/hooks/`
- Copy over only changed or missing hooks
- Make them executable

To reinstall hooks manually at any time:

```bash
npm run setup:hooks
```

The script is safe to run anytime — it only updates what’s changed.
