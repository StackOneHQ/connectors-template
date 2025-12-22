Use the action-discovery sub-agent to discover comprehensive API actions for the provider: $ARGUMENTS

This command will:

1. Check if the provider has multiple API versions available
2. If multiple versions exist, prompt the user to select which API version to map actions to
3. Launch the action-discovery sub-agent with the selected API version
4. Discover 100+ comprehensive actions through exhaustive research
5. Return structured JSON report with all discovered actions organized by functional area

Usage: more_actions <provider_name>

Example: more_actions slack

Note: If the provider supports multiple API versions (e.g., v1, v2, v3), you will be prompted to select which version to focus on for action discovery.
