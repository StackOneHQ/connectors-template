Use the improve-descriptions sub-agent to enhance endpoint descriptions for the connector: $ARGUMENTS

This command will:

1. Search for the specified connector in the codebase
2. Verify it's a work-in-progress connector (not committed to main)
3. Analyze all operations and their current descriptions
4. Enhance every endpoint description to be verbose and comprehensive
5. Update the connector YAML file with improved descriptions

Usage: improve-descriptions <provider_name>

Example: improve-descriptions slack
