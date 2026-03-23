# Accounting — Schema Reference

> Manage accounts, transactions, contacts and financial data.

> **OAS source:** `https://docs.stackone.com/accounting/api-reference/accounting.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/accounting/companies` | List Companies |
| `GET` | `/unified/accounting/companies/{id}` | Get Company |
| `GET` | `/unified/accounting/companies/{id}/accounts` | List Accounts |
| `GET` | `/unified/accounting/companies/{id}/accounts/{subResourceId}` | Get Account |
| `GET` | `/unified/accounting/companies/{id}/tax_rates` | List Tax Rates |
| `GET` | `/unified/accounting/companies/{id}/tax_rates/{subResourceId}` | Get Tax Rate |
| `POST` | `/unified/accounting/companies/{id}/journals/batch` | Batch Create Journals |
| `GET` | `/unified/accounting/companies/{id}/journals` | List Journals |
| `POST` | `/unified/accounting/companies/{id}/journals` | Create Journal |
| `GET` | `/unified/accounting/companies/{id}/journals/{subResourceId}` | Get Journal |

---

## Models

### `AccountingAccount`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `company_id` | `string` | ID of the company this account belongs to |
| `code` | `string` | External system's account code/number |
| `name` | `string` | Name of the account |
| `type` | `AccountTypeEnum` | Type of account |
| `active` | `object` | Whether the account is active |

### `AccountingCompany`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | Name of the company |
| `base_currency` | `CurrencyEnum` | Default currency for the company |
| `fiscal_year_start_month` | `number` | Fiscal year start month (1-12) |
| `fiscal_year_start_day` | `number` | Fiscal year start day (1-31) |

### `AccountingJournal`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `company_id` | `string` | ID of the company this journal belongs to |
| `reference` | `string` | Reference number for the journal |
| `memo` | `string` | Memo or description for the journal |
| `transaction_date` | `string` | Date of the journal transaction |
| `status` | `AccountingJournalStatusEnum` | Status of the journal |
| `lines` | `array<JournalLine>` | List of journal lines |
| `created_at` | `string` | Timestamp when the journal was created |
| `updated_at` | `string` | Timestamp when the journal was last updated |
| `posted_at` | `string` | Timestamp when the journal was posted |

### `AccountingTaxRate`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `company_id` | `string` | ID of the company this tax rate belongs to |
| `name` | `string` | Name of the tax rate |
| `code` | `string` | External system's tax code |
| `percentage` | `number` | Tax rate percentage |
| `active` | `object` | Whether the tax rate is active |

### `CreateJournalLine`
| Field | Type | Description |
|-------|------|-------------|
| `account_id` | `string` | ID of the ledger account this line references |
| `description` | `string` | Description of the journal line |
| `amount` | `number` | Amount of the journal line in minor units, e.g. 10010 for 100.10 USD. Positive for debit, negative for credit. |
| `tax_rate_id` | `string` | ID of the tax rate applied |
| `tax_amount` | `number` | Tax amount of the line in minor units, e.g. 10010 for 100.10 USD |

### `JournalLine`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the journal line |
| `account_id` | `string` | ID of the ledger account this line references |
| `account_type` | `AccountTypeEnum` | Type of the account |
| `description` | `string` | Description of the journal line |
| `currency_code` | `CurrencyEnum` | Currency code for this line |
| `exchange_rate` | `number` | Exchange rate to company base currency |
| `amount` | `number` | Amount of the journal line in minor units, e.g. 10010 for 100.10 USD. Positive for debit, negative for credit. |
| `tax_amount` | `number` | Tax amount of the line in minor units, e.g. 10010 for 100.10 USD |
| `tax_rate_percentage` | `number` | Tax rate percentage |

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
| `AccountTypeEnum` | `asset`, `liability`, `equity`, `revenue`, `expense` |
| `AccountingJournalStatusEnum` | `draft`, `posted`, `void` |
| `CurrencyEnum` | `AED`, `AFN`, `ALL`, `AMD`, `ANG`, `AOA`, `ARS`, `AUD`, `AWG`, `AZN`, `BAM`, `BBD`, `BDT`, `BGN`, `BHD`, `BIF`, `BMD`, `BND`, `BOB`, `BRL`, `BSD`, `BTN`, `BWP`, `BYN`, `BZD`, `CAD`, `CDF`, `CHF`, `CLP`, `CNY`, `COP`, `CRC`, `CUC`, `CUP`, `CVE`, `CZK`, `DJF`, `DKK`, `DOP`, `DZD`, `EGP`, `ERN`, `ETB`, `EUR`, `FJD`, `FKP`, `GBP`, `GEL`, `GHS`, `GIP`, `GMD`, `GNF`, `GTQ`, `GYD`, `HKD`, `HNL`, `HRK`, `HTG`, `HUF`, `IDR`, `ILS`, `INR`, `IQD`, `IRR`, `ISK`, `JMD`, `JOD`, `JPY`, `KES`, `KGS`, `KHR`, `KMF`, `KPW`, `KRW`, `KWD`, `KYD`, `KZT`, `LAK`, `LBP`, `LKR`, `LRD`, `LSL`, `LYD`, `MAD`, `MDL`, `MGA`, `MKD`, `MMK`, `MNT`, `MOP`, `MRU`, `MUR`, `MVR`, `MWK`, `MXN`, `MYR`, `MZN`, `NAD`, `NGN`, `NIO`, `NOK`, `NPR`, `NZD`, `OMR`, `PAB`, `PEN`, `PGK`, `PHP`, `PKR`, `PLN`, `PYG`, `QAR`, `RON`, `RSD`, `RUB`, `RWF`, `SAR`, `SBD`, `SCR`, `SDG`, `SEK`, `SGD`, `SHP`, `SLL`, `SOS`, `SRD`, `SSP`, `STN`, `SYP`, `SZL`, `THB`, `TJS`, `TMT`, `TND`, `TOP`, `TRY`, `TTD`, `TWD`, `TZS`, `UAH`, `UGX`, `USD`, `UYU`, `UZS`, `VES`, `VND`, `VUV`, `WST`, `XAF`, `XCD`, `XDR`, `XOF`, `XPF`, `YER`, `ZAR`, `ZMW`, `ZWL` |
