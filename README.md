# Connector Template

## Description

This repository contains a collection of connectors for and created by StackOne.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Fork This Repository

**Important:** Before you begin, you should fork this repository to your own GitHub account or organization. This allows you to:

- Maintain your own connector configurations
- Submit pull requests back to the main repository
- Keep your custom connectors separate from the template

To fork this repository:

1. Click the "Fork" button at the top right of the GitHub page
2. Select your account or organization
3. Clone your forked repository (not this one)

### Installation

1. Clone your forked repository:

   ```bash
   git clone <your-forked-repository-url>
   cd <repository-name>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   This will automatically:

   - Install all required packages
   - Set up Git hooks

3. Set up authentication:

   **BEFORE RUNNING THIS ASK YOUR CONTACT AT STACKONE FOR USERNAME/PASSWORD**

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

1. **Fork this repository** (see "Fork This Repository" section above).
2. Clone your fork to your local machine.
3. Create a new branch for your changes.
4. Make your changes and commit them following our commit conventions.
5. Push your changes to your fork.
6. Open a pull request from your fork to this repository.

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
