# Building a Falcon Connector

Environment setup and developer information, see internal Notion pages.

Connectors can contain both unified and non-unified actions.

- Unified actions must take inputs defined in the StackOne schema and then provide a response output to the defined StackOne schema for the respective resource.
- Non-unified actions map exactly to the underlying provider's API call and output the provider's response in its entirety. No mapping of the output data is performed.

**By default only generate non-unified actions unless explictly told otherwise**

# File Structure & Organization

## Directory Structure

```
src/configs/{connector-name}/
├── {connector-name}.connector.s1.yaml          # Main connector file with authentication config
└── {connector-name}.{resource}.s1.partial.yaml     # For each provider resource that contains respective actions
```

## File Naming Convention

- Use kebab-case for file names
- **Do not create a single connector file with all the actions**. Generate partial files for each resource.
- Reference partial configs in main file using `$ref: connector-name.resource`. Add the references in alphabetical order.

**IMPORTANT: Unless explicitly specified otherwise, ALL actions should be configured as non-unified.**

# YAML Structure

## Complete Example

Here's a minimal complete connector showing all main sections:

```yaml
StackOne: 1.0.0
info:
  title: Provider Name
  key: provider_name
  version: 1.0.0
  assets:
    icon: https://stackone-logos.com/api/provider_name/filled/png
  description: Brief description of the provider

baseUrl: https://api.provider.com/v1

authentication:
  - custom:
      type: custom
      label: API Key
      authorization:
        type: bearer
        token: $.credentials.apiKey
      configFields:
        - key: apiKey
          label: API Key
          type: password
          required: true
          secret: true
      environments:
        - key: production
          name: Production

actions:
  - actionId: list_users
    categories:
      - hris
    actionType: list
    schema: users
    description: Get list of users
    context: https://api.provider.com/docs/users/list
    steps:
      - stepId: fetch_users
        stepFunction:
          functionName: request
          parameters:
            url: /users
            method: get
    result:
      data: $.steps.fetch_users.output.data
```

## YAML Best Practices

### Reserved Characters

**⚠️ IMPORTANT: Never use the `:` character as a value in YAML files.**

The colon (`:`) is a reserved character in YAML syntax used to separate keys from values. Using it as a literal value can cause parsing errors or unexpected behavior.

**Incorrect:**

```yaml
description: Filter by status: pending, approved, denied, cancelled
```

**Correct:**

```yaml
description: Filter by status (pending, approved, denied, cancelled)
```

If you need to include a colon in a description or other text value, use alternative wording or rephrase the text to avoid the colon character.

## Meta Info

The `info` section contains metadata about the connector:

```yaml
StackOne: 1.0.0
info:
  title: Jira # Provider display name
  key: jira # Unique provider identifier (lowercase)
  version: 1.0.0 # Connector version
  assets:
    icon: https://stackone-logos.com/api/jira/filled/png
  description: Jira is a project management and issue tracking tool that helps teams plan, track, and manage their work.

baseUrl: https://api.provider.com/v1 # Base URL for all API calls

# Optional: Rate limiting configuration
rateLimit:
  mainRatelimit: 10 # Requests per second

# Documentation context
context: "Provider API documentation: https://api.provider.com/docs"
```

## Authentication

- `setupFields` T1 facing account credential fields. Generally information about OAuth apps and multi-tenant provider credentials e.g. Client ID, Client Secret, scopes.
- `configFields` T2 facing account credential fields. Generally end user credential information e.g. API token, user specific sub-domain.
- `label` Allowed values: `API Key`, `OAuth 2.0`. Only include additional text if absolutley necessary to differentiate the different auth types available. If additional text is needed then keep it to a bare minimum.

### API Key

```yaml
authentication:
  - custom:
      type: custom
      label: API Key
      support:
        link: https://hub.stackone.com/connection-guides/ticketing/jira
        description: The steps in this guide require Admin privileges within Jira.
      authorization:
        type: basic
        username: $.credentials.email
        password: $.credentials.accessToken
      configFields:
        - key: accessToken
          label: API Token
          type: password
          required: true
          secret: true
          placeholder: ATATT3xFfGF0aQNaJZQ9JtSvQ_example
          description: You can generate an API Token by going to your Atlassian Account Settings > Security > Create and manage API tokens.
          tooltip: Make sure to save your API token securely as it won't be shown again.
      environments:
        - key: production
          name: Production
      testActionsIds:
        - list_users
```

### OAuth

Typical OAuth 2 configuration (Authorization code > Access Token > Refresh Token) examples can be seen in the following connectors:

- asana
- gmail
- xero

Complex examples:

- jira - also includes a post-authentication call to retrieve and save the `cloud ID` needed to make API requests.

```yaml
authentication:
  - oauth2:
      type: oauth2
      label: OAuth 2.0
      support:
        link: https://docs.stackone.com/integration-guides/accounting/xero
        description: Login to your Xero account to connect your data.
      setupFields:
        - key: clientId
          label: Client ID
          type: text
          required: true
          secret: false
          placeholder: 4A98C887DABEBDF0BD8EF7D
          description: Can be found by going to [Xero Developer portal](https://developer.xero.com/myapps/) > My Apps > Select your app > Configuration > Client ID
          tooltip: The Client ID from your Xero app registration.
        - key: clientSecret
          label: Client Secret
          type: password
          required: true
          secret: true
          placeholder: PcUXs2dse1e46_Lfyu-OKHKjDsRaHyEhBGEGXgs_
          description: Use an existing client secret, otherwise one can be generated by going to [Xero Developer portal](https://developer.xero.com/myapps/) > My Apps > Select your app > Configuration
          tooltip: The Client Secret from your Xero app registration.
        - key: scopes
          label: Scopes
          type: text
          required: false
          secret: false
          placeholder: offline_access accounting.transactions accounting.settings.read accounting.journals.read
          description: Enter a list of valid Xero scopes separated by a space. See [Xero API scopes](https://developer.xero.com/documentation/guides/oauth2/scopes/) for more information. If no scopes are provided, the default scopes will be used.
      authorization:
        type: oauth2
        # Start Authorization request block
        authorizationUrl: https://login.xero.com/identity/connect/authorize
        authorizationParams:
          response_type: "code"
          client_id: $.credentials.clientId
          redirect_uri: "${apiHostUri}/connect/oauth2/xero/callback"
          scope: $.credentials.scopes
          state: "stackone"
        # End Authorization request block
        tokenUrl: https://identity.xero.com/connect/token
        tokenExpiresIn: 1800
        tokenRefreshExpiresIn: 3600
        token: $.credentials.accessToken
        includeBearer: true
      refreshAuthentication:
        action:
          actionId: refresh_token_xero
          categories:
            - internal
          actionType: refresh_token
          label: Refresh Token
          description: Refresh Xero OAuth2 token
          steps:
            - stepId: refresh_token_request
              description: Get new access token
              stepFunction:
                functionName: request
                parameters:
                  baseUrl: "https://identity.xero.com"
                  url: "/connect/token"
                  method: post
                  authorization:
                    type: basic
                    username: $.credentials.clientId
                    password: $.credentials.clientSecret
                    encoding: base64
                  args:
                    - name: Content-Type
                      value: application/x-www-form-urlencoded
                      in: headers
                    - name: grant_type
                      value: refresh_token
                      in: body
                    - name: refresh_token
                      value: $.credentials.refreshToken
                      in: body
            - stepId: map_tokens
              description: Map tokens data
              stepFunction:
                functionName: map_fields
                version: "2"
                parameters:
                  fields:
                    - targetFieldKey: accessToken
                      expression: $.access_token
                      type: string
                    - targetFieldKey: refreshToken
                      expression: $.refresh_token
                      type: string
                    - targetFieldKey: expiresIn
                      expression: $.expires_in
                      type: number
                    - targetFieldKey: refreshExpiresIn
                      expression: $.refresh_expires_in
                      type: number
                  dataSource: $.steps.refresh_token_request.output.data
          result:
            data: $.steps.map_tokens.output.data
      environments:
        - key: production
          name: Production
```

## Actions

Actions contain these main parts:

- `categories` - list of categories this action will appear under in the StackOne UI.
- `actionType` - can only be one of the following values: list, get, create, update, delete, custom, refresh_token. If the provider does not use cursor based pagination then instead of using list, set this value to get.
- `context` - Documentation URLs or notes specific to this action. If adding a URL do not use base documentation URL, be specific and link only the page related to this action.
- Entry Point
  - `entrypointUrl` - the url endpoint for this action to be routed from
  - `entrypointHttpMethod`
- `inputs` - input request body definition for the action that is used to capture any data from the incoming request that will be needed in the proceeding steps. Path, query and body parameters can be mapped to the `inputs` object. These values can then be referenced in the connector config by using `'{{input.[name]}}'`
  - `input.type` can only have the following values: string, number, boolean, datetime_string, object
  - `input.description` is required and MUST be added. This description is to give context for the user to understand what values are expected. If the values are defined in an enum, you must list all possible values if there is no ISO standard.
  - The `input.type: object` allows the use of the `properties` key which can contain nested entries of input fields.
  - **For non-unified actions, the inputs must match exactly the full provider's request parameters for headers, query, path and body. DO NOT CREATE INPUTS THAT DO NOT EXIST IN THE PROVIDER API**
- `steps` - List of step functions to execute
- `result` - Final action output response

```yaml
actions:
  - actionId: get_user
    categories:
      - ticketing
    actionType: get
    schema: users
    description: Get Users
    context: https://api.provider.com/docs/users/get, https://api.provider.com/guides/user-management
    entrypointUrl: /users/:id
    entrypointHttpMethod: get
    inputs:
      - name: id
        description: User ID
        type: string
        in: path
        required: true
    fieldConfigs:
      - targetFieldKey: id
        expression: $.accountId
        type: string
      - targetFieldKey: type
        expression: $.accountType
        type: enum
        enumMapper:
          matcher:
            - matchExpression: '{{$.accountType == "atlassian"}}'
              value: agent
            - matchExpression: '{{$.accountType == "app"}}'
              value: bot
            - matchExpression: '{{$.accountType == "customer"}}'
              value: contact
      - targetFieldKey: active
        expression: $.active
        type: boolean
     steps:
       ...
     result:
	     ...
```

### Field Configs

NOTE: `fieldConfigs` are NOT required when building non-unified connectors!

- `fieldConfigs` - Mapping of the provider response fields to StackOne unified response.
  - `expression` - The json path selector on the provider response. Also supports [JEXL expressions](https://github.com/StackOneHQ/connect/tree/main/packages/expressions)
  - `enumMapper` - Two ways of mapping to known values:
    - Can use a built-in matcher to take the evaluated `expression` to a standard value.
    - Can use a `matchExpression` condition to map a custom value.
  - `type` - Can be one of following values:
    - `string`: Text values
    - `boolean`: True/false values
    - `enum`: Use with enumMapper for value mapping
    - `datetime_string`: ISO 8601 date strings
    - `number`: Numeric values

#### Custom Matcher

Custom enum matchers are used when you need to map provider values to large StackOne enums where explicit `matchExpression` mappings would be impractical.

**When to use:**

- Large enums like `DocumentFileFormatEnum` (1200+ values)
- Standard mappings that can be reused across multiple connectors
- Cases where a simple lookup/normalization function handles the mapping

**Implementation Steps:**

1. **Create the Enum in `connect/packages/utils/src/shared/[domain]/`**

   Create a new file (e.g., `fileFormats.ts`) with the enum and matcher function:

   ```typescript
   export enum DocumentFileFormatEnum {
     pdf = "pdf",
     doc = "doc",
     docx = "docx",
     // ...
   }

   export const getDocumentFileFormatFromExtension = (
     fileExtension: unknown
   ): string | undefined => {
     if (typeof fileExtension !== "string" || !fileExtension) {
       return undefined;
     }

     // Normalize: remove leading dot, lowercase, trim
     const normalized = fileExtension.replace(/^\./, "").toLowerCase().trim();

     // Check if valid enum key
     if (normalized in DocumentFileFormatEnum) {
       return DocumentFileFormatEnum[
         normalized as keyof typeof DocumentFileFormatEnum
       ];
     }

     return undefined;
   };
   ```

2. **Export from `connect/packages/utils/src/shared/index.ts`**

   ```typescript
   export { getDocumentFileFormatFromExtension } from "./documents/fileFormats";
   ```

3. **Register in `connect/packages/connect-sdk/src/connectors/schemas.ts`**

   Add the matcher name to the enum list:

   ```typescript
   enumMapper: zStrictObject({
       matcher: z
           .enum([
               'country_alpha2code_by_alpha2code',
               // ... existing matchers
               'document_file_format_from_extension', // Add here
           ])
   ```

4. **Implement in `connect/packages/core/src/stepFunctions/mapFields/getEnumMatcher.ts`**

   Import and register the function:

   ```typescript
   import {
     // ... existing imports
     getDocumentFileFormatFromExtension,
   } from "@stackone/utils";

   export const getEnumMatcher = (
     matcher: string
   ): ((value: unknown) => unknown) | undefined => {
     switch (matcher) {
       // ... existing cases
       case "document_file_format_from_extension":
         return getDocumentFileFormatFromExtension;
       default:
         return undefined;
     }
   };
   ```

5. (Optional) **Build Connect Packages**

   ```bash
   cd connect
   npm run build:dev
   ```

6. **Use in YAML Connector**

   ```yaml
   fieldConfigs:
     - targetFieldKey: file_format
       expression: $.fullFileExtension
       type: enum
       enumMapper:
         matcher: "document_file_format_from_extension"
   ```

**Example: Document File Format Matcher**

See the implementation in:

- Enum: `connect/packages/utils/src/shared/documents/fileFormats.ts`
- Usage: `connectors/src/configs/googledrive/googledrive.files.s1.partial.yaml`

### Steps

```yaml
actions:
  - actionId:
	  ...
  steps:
	  - stepId: list_users
      description: List users
      stepFunction:
        functionName: request
        parameters:
          url: '/users'
          method: get
          args:
	          - name: showInactive
              value: true
              in: body
              condition: '{{true}}'
            - name: accept
              value: application/json
              in: headers
              condition: '{{true}}'
            - name: maxResults
              value: '25'
              in: query
              condition: '{{true}}'
          response:
            collection: true
```

### Result

Read response

```yaml
actions:
  - actionId: list_users
    ...
    steps:
    ...
    result:
      data: $.steps.typecast_employees_data.output.data
```

Write response

```yaml
actions:
  - actionId: update_users
    ...
    steps:
    ...
    result:
	    message: Employee updated successfully
	    data:
	      id: '{{inputs.id}}'
```

# Step Functions

Step functions are defined in the connect repo:

packages/core/src/stepFunctions/stepFunctionsList.ts

## Standard Step Functions

### Request

Performs an http request and extract the response.

**IMPORTANT: Always use `args` for request parameters (headers, query params, and body fields). Never use direct `body` field.**

- Dynamically calculated `args` should have `condition` properties to verify that the values are not undefined otherwise they will be included in the call. E.g.
  `condition: '{{present($.input.field)}}'`

```yaml
stepFunction:
  functionName: request
  parameters:
    url: '/users'
    method: get
    args:
      - name: accept
        value: application/json
        in: headers
      # Body parameters should also use args
      - name: email
        value: $.inputs.email
        in: body
      - name: name
        value: $.inputs.name
        in: body
    response:
      collection: true
      indexField: id
      dataKey: user
    customErrors: # Optional remapping of provider error responses
	    - receivedStatus: 404
		    targetStatus: 400
		    message: 'Custom error message'
		    condition: "{{headers['connection'] == 'keep-alive'}}"
```

### Paginated Request

If the provider supports cursor based pagination then use `paginated_request` instead of `request` as the `stepFunction`.

**DO NOT USE `paginated_request` if pagination method is not cursor based. Use the `request` step function instead!**

- `response.nextKey` should be the field in the provider response that contains the next cursor value
- `iterator` is how the next cursor is mapped into the provider request

```yaml
stepFunction:
  functionName: paginated_request
  parameters:
    url: "/application.list"
    method: post
    response:
      dataKey: results
      nextKey: nextCursor
    iterator:
      key: cursor
      in: body
    args:
      - name: Content-Type
        value: application/json
        in: headers
```

### Group Data

```yaml
stepFunction:
	functionName: group_data
		parameters:
		  stepsDataToGroup:
		    - get_all_employees
		    - get_more_employees_data
	    isSingleRecord: false
```

### Map

Using the `fieldConfigs` , performs a mapping of the `dataSource`

NOTE: This step is not required when building a non-unified actions

```yaml
- stepId: map_employee_data
  description: Map employee data
  stepFunction:
    functionName: map_fields
    version: "2"
    parameters:
      dataSource: $.steps.group_employee_data.output.data
```

### Typecast

Applies the types as defined in `fieldConfigs`

NOTE: This step is not required when building a non-unified actions

```yaml
- stepId: typecast_employee_data
  description: Typecast employee data
  stepFunction:
    functionName: typecast
    version: "2"
    parameters:
      dataSource: $.steps.map_employee_data.output.data
```

## Custom Step Functions

_Add guide on creating custom step functions_

# Dynamic Values

Falcon connectors support multiple expression formats for dynamic values.

**JSONPath is the preferred expression format** and should be used by default unless you are constructing a string or performing conditional logic.

## Expression Formats

### 1. JSONPath (`$.path.to.field`) - PREFERRED

**This is the recommended format for most use cases.** JSONPath provides a consistent, powerful way to access data throughout your connector.

```yaml
# Access credentials
token: $.credentials.apiKey
username: $.credentials.email

# Access inputs
value: $.inputs.userId

# Access step output
dataSource: $.steps.fetch_users.output.data

# Access array elements
expression: $.users[0].id
```

**When to use JSONPath:**

- When the ENTIRE value is a direct reference (no string construction needed)
- Accessing credentials: `token: $.credentials.apiKey`
- Accessing inputs: `userId: $.inputs.userId`
- Accessing step output: `dataSource: $.steps.fetch_users.output.data`
- Reading response fields: `nextCursor: $.response.pagination.cursor`

### 2. String Interpolation (`${...}`)

Use **whenever you need to embed dynamic values within a string** (i.e., string construction):

```yaml
# Single dynamic value in URL path
url: /users/${inputs.id}
url: /calls/${inputs.callId}/transcript

# Multiple dynamic values in URL
url: /users/${inputs.id}/posts/${inputs.postId}

# URLs with dynamic domains
baseUrl: https://${credentials.domain}.api.com

# Environment variables
redirect_uri: ${apiHostUri}/callback
```

**When to use String Interpolation:**

- **ANY time you're building a string with embedded dynamic values**
- URLs with path parameters: `/resource/${inputs.id}`
- URLs with multiple segments: `/users/${inputs.userId}/posts/${inputs.postId}`
- Domain or subdomain construction: `https://${credentials.subdomain}.api.com`
- Any string concatenation scenario

### 3. JEXL Expressions (`'{{...}}'`)

Use only when you need conditional logic, transformations, or complex expressions. Must be wrapped in single quotes:

```yaml
# Conditionals
condition: '{{present(inputs.includeInactive)}}'
condition: '{{inputs.includeInactive == true}}'
matchExpression: '{{$.accountType == "admin"}}'

# Transformations
value: '{{inputs.name.toUpperCase()}}'

# Complex logic
value: '{{$.status == "active" ? "enabled" : "disabled"}}'

# Ternary operations
value: '{{$.count > 0 ? $.count : "none"}}'
```

**When to use JEXL:**

- Conditional logic in `condition` fields
- Enum matching with `matchExpression`
- String transformations (uppercase, lowercase, etc.)
- Mathematical operations
- Ternary operators

For more details on JEXL expressions, see the [expressions package documentation](https://github.com/StackOneHQ/connect/tree/main/packages/expressions).

## Common Use Cases

**Credential Templating (use JSONPath):**

```yaml
token: $.credentials.apiKey
username: $.credentials.email
password: $.credentials.password
```

**Input Parameters:**

```yaml
# Direct reference - use JSONPath
value: $.inputs.userId
userId: $.inputs.userId

# String construction (URLs) - use String Interpolation
url: /users/${inputs.id}
url: /calls/${inputs.callId}/transcript
```

**Step References (use JSONPath):**

```yaml
dataSource: $.steps.stepId.output.data
value: $.steps.fetch_user.output.data.userId
```

**Conditions (use JEXL):**

```yaml
condition: "{{inputs.includeDeleted == true}}"
matchExpression: '{{$.status == "active"}}'
```

# Validation

Validate a stackone connector file via CLI. First install the package:

```tsx
npm install -g @stackone/cli
```

Usage:

```tsx
stackone validate [pathToYaml] // Single run validation of the file
```
