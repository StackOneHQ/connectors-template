# Connector Template

## Description

This repository contains a collection of connectors for and created by StackOne.

## Getting Started

### Prerequisites

- Node.js (v22 or higher recommended)
- npm
- Git installed on your local machine

### Set Up Your Private Repository

To maintain your own private version of these connectors while still being able to pull updates from StackOne, follow these steps to "mirror" the repository. This allows you to:

- Maintain your own connector configurations privately
- Keep your custom connectors separate from the template

1. Create a new private repository:

   Create a new, empty repository on your GitHub/GitLab/Bitbucket account. Do not initialize it with a README or License. Note your new repository URL (e.g., https://github.com/your-org/private-connectors.git).

2. Mirror the StackOne repository:

   Open your terminal and run the following commands to push the template code to your private repo:

   ```bash
   # 1. Clone the StackOne template as a bare repository
   git clone --bare https://github.com/stackone-hq/connector-template.git

   # 2. Enter the repository directory
   cd connector-template.git

   # 3. Mirror-push the code to your new private repository
   git push --mirror https://github.com/your-org/private-connectors.git

   # 4. Remove the temporary bare clone
   cd ..
   rm -rf connector-template.git
   ```

3. Clone your private repo and set Upstream:

   Now, clone your private repository to your machine and link it back to StackOne to receive future updates:

   ```bash
   # 1. Clone your private repository
   git clone https://github.com/your-org/private-connectors.git
   cd private-connectors

   # 2. Add the original StackOne repo as a remote named 'upstream'
   git remote add upstream https://github.com/stackone-hq/connector-template.git

   # 3. Disable pushing to upstream (prevents accidental pushes to StackOne)
   git remote set-url --push upstream DISABLE
   ```

### Keeping Your Repo Up-to-Date

When StackOne releases new features or connector updates, you can pull them into your private repository using these commands:

   ```bash
   # Fetch the latest changes from StackOne
   git fetch upstream

   # Merge the updates into your main branch
   git checkout main
   git merge upstream/main

   # Push the updates to your private cloud repository
   git push origin main
   ```
Note: If you have modified files that StackOne also updated, you may need to resolve merge conflicts during this process.

### Installation
1. Install dependencies:

   ```bash
   npm install
   ```

   This will automatically:

   - Install all required packages
   - Set up Git hooks

2. Set up authentication:

   **BEFORE RUNNING THIS ASK YOUR CONTACT AT STACKONE FOR USERNAME/PASSWORD**

   ```bash
   npx @stackone/cli agent setup --local
   ```

   This command will:

   - Authenticate via OAuth with StackOne
   - Pull down the latest version of `CLAUDE.md` for this project
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
