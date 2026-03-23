# CRM (Customer Relationship Management) — Schema Reference

> Manage contacts, accounts, lists and activities.

> **OAS source:** `https://docs.stackone.com/crm/api-reference/crm.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/crm/contacts` | List Contacts |
| `POST` | `/unified/crm/contacts` | Create Contact |
| `GET` | `/unified/crm/contacts/{id}` | Get Contact |
| `PATCH` | `/unified/crm/contacts/{id}` | Update Contact (early access) |
| `GET` | `/unified/crm/accounts` | List Accounts |
| `GET` | `/unified/crm/accounts/{id}` | Get Account |
| `GET` | `/unified/crm/lists` | Get all Lists |
| `GET` | `/unified/crm/lists/{id}` | Get List |
| `GET` | `/unified/crm/custom_field_definitions/contacts` | List Contact Custom Field Definitions |
| `GET` | `/unified/crm/custom_field_definitions/contacts/{id}` | Get Contact Custom Field Definition |

---

## Models

### `Account`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `owner_id` | `string` |  |
| `remote_owner_id` | `string` | Provider's unique identifier of the owner |
| `name` | `string` |  |
| `description` | `string` |  |
| `industries` | `array<string>` | Values of the industries |
| `annual_revenue` | `string` |  |
| `website` | `string` |  |
| `addresses` | `array<AccountAddress>` |  |
| `phone_numbers` | `array<string>` | List of account phone numbers |
| `created_at` | `string` | Timestamp when the account was created |
| `updated_at` | `string` | Timestamp when the account was last updated |

### `AccountAddress`
| Field | Type | Description |
|-------|------|-------------|
| `street_1` | `string` |  |
| `street_2` | `string` |  |
| `city` | `string` |  |
| `state` | `string` |  |
| `zip_code` | `string` |  |
| `country` | `CountryEnum` | The country code |
| `location_type` | `LocationTypeEnum` | The location type |

### `Contact`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `first_name` | `string` | The contact first name |
| `last_name` | `string` | The contact last name |
| `company_name` | `string` | The contact company name |
| `emails` | `array<string>` | List of contact email addresses |
| `phone_numbers` | `array<string>` | List of contact phone numbers |
| `deal_ids` | `array<string>` | List of associated deal IDs |
| `remote_deal_ids` | `array<string>` | Provider's list of associated deal IDs |
| `account_ids` | `array<string>` | List of associated account IDs |
| `remote_account_ids` | `array<string>` | Provider's list of associated account IDs |
| `custom_fields` | `array<CustomFields>` | Contact custom fields |
| `created_at` | `string` | Timestamp when the contact was created |
| `updated_at` | `string` | Timestamp when the contact was last updated |

### `CustomFieldDefinition`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `description` | `string` |  |
| `type` | `CustomFieldTypeEnum` | The type of the custom field. |
| `options` | `array<CustomFieldOption>` | An array of possible options for the custom field. |

### `CustomFieldDefinitionResultApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `data` | `CustomFieldDefinition` |  |
| `raw` | `array<RawResponse>` |  |

### `CustomFieldOption`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The unique identifier for the option to be used when updating the custom field |
| `value` | `object` | The human readable value of the option |

### `CustomFields`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name of the custom field. |
| `value` | `object` | The value associated with the custom field. |
| `value_id` | `string` | The unique identifier for the value of the custom field. |
| `remote_value_id` | `string` | Provider's unique identifier for the value of the custom field. |

### `List`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` |  |
| `items` | `array<ListItem>` |  |
| `created_at` | `string` | Timestamp when the list was created |
| `updated_at` | `string` | Timestamp when the list was last updated |
| `type` | `ListTypeEnum` | The list type |

### `ListItem`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |

### `ProviderError`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` | HTTP status code of the provider error |
| `url` | `string` | URL that caused the error |
| `raw` | `object` | Raw error response from the provider |
| `headers` | `object` | Response headers |

### `UnifiedError`
| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` | HTTP status code |
| `message` | `string` | Error message |
| `headers` | `object` | Response headers |

---

## Enums

| Enum | Values |
|------|--------|
| `CountryEnum` | `AF`, `AL`, `DZ`, `AS`, `AD`, `AO`, `AI`, `AQ`, `AG`, `AR`, `AM`, `AW`, `AU`, `AT`, `AZ`, `BS`, `BH`, `BD`, `BB`, `BY`, `BE`, `BZ`, `BJ`, `BM`, `BT`, `BO`, `BQ`, `BA`, `BW`, `BV`, `BR`, `IO`, `BN`, `BG`, `BF`, `BI`, `KH`, `CM`, `CA`, `CV`, `KY`, `CF`, `TD`, `CL`, `CN`, `CX`, `CC`, `CO`, `KM`, `CG`, `CD`, `CK`, `CR`, `HR`, `CU`, `CW`, `CY`, `CZ`, `CI`, `DK`, `DJ`, `DM`, `DO`, `EC`, `EG`, `SV`, `GQ`, `ER`, `EE`, `ET`, `FK`, `FO`, `FJ`, `FI`, `FR`, `GF`, `PF`, `TF`, `GA`, `GM`, `GE`, `DE`, `GH`, `GI`, `GR`, `GL`, `GD`, `GP`, `GU`, `GT`, `GG`, `GN`, `GW`, `GY`, `HT`, `HM`, `VA`, `HN`, `HK`, `HU`, `IS`, `IN`, `ID`, `IR`, `IQ`, `IE`, `IM`, `IL`, `IT`, `JM`, `JP`, `JE`, `JO`, `KZ`, `KE`, `KI`, `KP`, `KR`, `KW`, `KG`, `LA`, `LV`, `LB`, `LS`, `LR`, `LY`, `LI`, `LT`, `LU`, `MO`, `MK`, `MG`, `MW`, `MY`, `MV`, `ML`, `MT`, `MH`, `MQ`, `MR`, `MU`, `YT`, `MX`, `FM`, `MD`, `MC`, `MN`, `ME`, `MS`, `MA`, `MZ`, `MM`, `NA`, `NR`, `NP`, `NL`, `NC`, `NZ`, `NI`, `NE`, `NG`, `NU`, `NF`, `MP`, `NO`, `OM`, `PK`, `PW`, `PS`, `PA`, `PG`, `PY`, `PE`, `PH`, `PN`, `PL`, `PT`, `PR`, `QA`, `RO`, `RU`, `RW`, `RE`, `BL`, `SH`, `KN`, `LC`, `MF`, `PM`, `VC`, `WS`, `SM`, `ST`, `SA`, `SN`, `RS`, `SC`, `SL`, `SG`, `SX`, `SK`, `SI`, `SB`, `SO`, `ZA`, `GS`, `SS`, `ES`, `LK`, `SD`, `SR`, `SJ`, `SZ`, `SE`, `CH`, `SY`, `TW`, `TJ`, `TZ`, `TH`, `TL`, `TG`, `TK`, `TO`, `TT`, `TN`, `TR`, `TM`, `TC`, `TV`, `UG`, `UA`, `AE`, `GB`, `US`, `UM`, `UY`, `UZ`, `VU`, `VE`, `VN`, `VG`, `VI`, `WF`, `EH`, `YE`, `ZM`, `ZW` |
| `CustomFieldTypeEnum` | `date`, `float`, `integer`, `list`, `checkbox`, `text`, `boolean`, `single_select`, `multi_select`, `url`, `other` |
| `ListTypeEnum` | `candidates`, `contacts`, `companies` |
| `LocationTypeEnum` | `home`, `work` |
