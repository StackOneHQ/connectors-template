#!/bin/bash

# -----------------------------------------------------------------------------
# Git Hook: pre-commit
# -----------------------------------------------------------------------------
#
# This Git hook script runs `npm run lint` before every commit to ensure code
# style and standards are maintained. If the linting fails, the commit will 
# be aborted, allowing you to fix the issues before proceeding.
#
# To enable this hook for your local repository, follow these steps:
#
# 1. Copy this script to the '.git/hooks' directory of your repository.
#    You can find this directory at the root of your repository.
#
# 2. Rename the script to 'pre-commit' (without the '.sh' extension).
#
# 3. Make the script executable by running the following command in your
#    terminal: 'chmod +x .git/hooks/pre-commit'.
#
# -----------------------------------------------------------------------------

# Navigate to the root directory of the repository
cd "$(git rev-parse --show-toplevel)"

# Define color variables
red=$(tput setaf 1)
green=$(tput setaf 2)
yellow=$(tput setaf 3)
reset=$(tput sgr0)

# Store staged file names before running lint
STAGED_FILES=$(git diff --cached --name-only)

# Run linting
echo "${yellow}Running linting...${reset}"
if npm run lint; then
    echo "${green}Linting passed. Proceeding with commit.${reset}"
else
    if npm run lint:fix; then
        echo "${green}Linting issues fixed. Adding only modified files...${reset}"

        # Modified filenames after lint:fix
        FIXED_FILES=$(git diff --name-only)

        # Add only the files that were changed by lint:fix and were originally staged
        for file in $FIXED_FILES; do
            if echo "$STAGED_FILES" | grep -q "$file"; then
                echo "${green}  Adding: ${yellow}$file${reset}"
                git add "$file"
            fi
        done

        # Run lint again to ensure fixes are valid
        if npm run lint; then
            echo "${green}Fixes passed linting. Proceeding with commit.${reset}"
        else
            echo "${red}Fixes did not pass linting. Commit aborted.${reset}"
            exit 1
        fi
    else
        echo "${red}Auto-fixing failed. Commit aborted.${reset}"
        exit 1
    fi
fi