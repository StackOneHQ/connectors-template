# HRIS (Human Resources Information System) — Schema Reference

> Manage employees, departments, locations, time off, payroll, benefits and more.

> **OAS source:** `https://docs.stackone.com/hris/api-reference/hris.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/hris/companies` | List Companies |
| `GET` | `/unified/hris/companies/{id}` | Get Company |
| `GET` | `/unified/hris/custom_field_definitions/employees` | List employee Custom Field Definitions |
| `GET` | `/unified/hris/custom_field_definitions/employees/{id}` | Get employee Custom Field Definition |
| `GET` | `/unified/hris/employees` | List Employees |
| `POST` | `/unified/hris/employees` | Create Employee |
| `GET` | `/unified/hris/employees/{id}` | Get Employee |
| `PATCH` | `/unified/hris/employees/{id}` | Update Employee |
| `POST` | `/unified/hris/employees/{id}/invite` | Invite Employee |
| `GET` | `/unified/hris/employees/{id}/shifts` | List Employee Shifts |
| `GET` | `/unified/hris/employees/{id}/shifts/{subResourceId}` | Get Employee Shift |
| `GET` | `/unified/hris/employees/{id}/time_off` | List Employee Time Off Requests |
| `POST` | `/unified/hris/employees/{id}/time_off` | Create Employee Time Off Request |
| `GET` | `/unified/hris/employees/{id}/time_off/{subResourceId}` | Get Employees Time Off Request |
| `PATCH` | `/unified/hris/employees/{id}/time_off/{subResourceId}` | Update Employee Time Off Request |
| `DELETE` | `/unified/hris/employees/{id}/time_off/{subResourceId}` | Cancel Employee Time Off Request |
| `POST` | `/unified/hris/employees/{id}/documents/upload/batch` | Batch Upload Employee Document |
| `POST` | `/unified/hris/employees/{id}/documents/upload` | Upload Employee Document |
| `GET` | `/unified/hris/employees/{id}/documents/{subResourceId}/download` | Download Employee Document |
| `GET` | `/unified/hris/employees/{id}/documents` | List Employee Documents |
| `GET` | `/unified/hris/employees/{id}/documents/{subResourceId}` | Get Employee Document |
| `GET` | `/unified/hris/documents/employee_categories` | List Employee Document Categories |
| `GET` | `/unified/hris/documents/employee_categories/{id}` | Get Employee Document Category |
| `GET` | `/unified/hris/employees/{id}/work_eligibility` | List Employee Work Eligibility |
| `POST` | `/unified/hris/employees/{id}/work_eligibility` | Create Employee Work Eligibility Request |
| `GET` | `/unified/hris/employees/{id}/work_eligibility/{subResourceId}` | Get Employees Work Eligibility |
| `PATCH` | `/unified/hris/employees/{id}/work_eligibility/{subResourceId}` | Update Employee Work Eligibility Request |
| `GET` | `/unified/hris/employees/{id}/time_off_balances` | List Employee Time Off Balances |
| `GET` | `/unified/hris/employees/{id}/time_off_balances/{subResourceId}` | Get Employee Time Off Balance |
| `GET` | `/unified/hris/employments` | List Employments |
| `GET` | `/unified/hris/employments/{id}` | Get Employment |
| `GET` | `/unified/hris/employees/{id}/employments` | List Employee Employments |
| `POST` | `/unified/hris/employees/{id}/employments` | Create Employee Employment |
| `GET` | `/unified/hris/employees/{id}/employments/{subResourceId}` | Get Employee Employment |
| `PATCH` | `/unified/hris/employees/{id}/employments/{subResourceId}` | Update Employee Employment |
| `GET` | `/unified/hris/groups` | List Groups |
| `GET` | `/unified/hris/groups/departments` | List Department Groups |
| `GET` | `/unified/hris/groups/cost_centers` | List Cost Center Groups |
| `GET` | `/unified/hris/groups/teams` | List Team Groups |
| `GET` | `/unified/hris/groups/divisions` | List Division Groups |
| `GET` | `/unified/hris/groups/companies` | List Companies Groups |
| `GET` | `/unified/hris/groups/{id}` | Get Group |
| `GET` | `/unified/hris/groups/departments/{id}` | Get Department Group |
| `GET` | `/unified/hris/groups/cost_centers/{id}` | Get Cost Center Group |
| `GET` | `/unified/hris/groups/teams/{id}` | Get Team Group |
| `GET` | `/unified/hris/groups/divisions/{id}` | Get Division Group |
| `GET` | `/unified/hris/groups/companies/{id}` | Get Company Group |
| `GET` | `/unified/hris/jobs` | List Jobs |
| `GET` | `/unified/hris/jobs/{id}` | Get Job |
| `GET` | `/unified/hris/locations` | List Work Locations |
| `GET` | `/unified/hris/locations/{id}` | Get Work Location |
| `GET` | `/unified/hris/positions` | List Positions |
| `GET` | `/unified/hris/positions/{id}` | Get Position |
| `GET` | `/unified/hris/time_entries` | List Time Entries |
| `GET` | `/unified/hris/time_entries/{id}` | Get Time Entry |
| `GET` | `/unified/hris/time_off` | List time off requests |
| `GET` | `/unified/hris/time_off/{id}` | Get time off request |
| `GET` | `/unified/hris/shifts` | List Shifts |
| `GET` | `/unified/hris/shifts/{id}` | Get Shift |
| `GET` | `/unified/hris/time_off_types` | List time off types |
| `GET` | `/unified/hris/time_off_types/{id}` | Get time off type |
| `GET` | `/unified/hris/time_off_policies` | List Time Off Policies |
| `GET` | `/unified/hris/time_off_policies/{id}` | Get Time Off Policy |
| `GET` | `/unified/hris/employees/{id}/time_off_policies` | List Assigned Time Off Policies |
| `GET` | `/unified/hris/benefits` | List benefits |
| `GET` | `/unified/hris/benefits/{id}` | Get Benefit |
| `GET` | `/unified/hris/employees/{id}/skills` | List Employee Skills |
| `POST` | `/unified/hris/employees/{id}/skills` | Create Employee Skill |
| `GET` | `/unified/hris/employees/{id}/skills/{subResourceId}` | Get Employee Skill |
| `GET` | `/unified/hris/employees/{id}/tasks` | List Employee Tasks |
| `GET` | `/unified/hris/employees/{id}/tasks/{subResourceId}` | Get Employee Task |
| `PATCH` | `/unified/hris/employees/{id}/tasks/{subResourceId}` | Update Employee Task |
| `GET` | `/unified/hris/tasks` | List Tasks |
| `GET` | `/unified/hris/tasks/{id}` | Get Task |

---

## Models

### `ClearingCode`
| Field | Type | Description |
|-------|------|-------------|
| `type` | `ClearingCodeTypeEnum` | The type of clearing code |
| `value` | `string` | The clearing code value |

### `Company`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name of the company |
| `full_name` | `string` | The full name of the company |
| `display_name` | `string` | The display name of the company |
| `created_at` | `string` | The created_at date |
| `updated_at` | `string` | The updated_at date |

### `Content`
| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | URL where the file content is located |
| `unified_url` | `string` | Unified download URL for retrieving file content. |
| `file_format` | `FileFormatEnum` | The file format of the file |

### `ContractTypeApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `label` | `string` | The label of the employment type |
| `contract_type` | `ContractTypeEnum` | The employment work schedule type (e.g., full-time, part-time) |

### `CostCenters`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `distribution_percentage` | `number` |  |

### `CreateCostCenterApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` |  |
| `distribution_percentage` | `number` |  |

### `CreateEmployeeEmploymentApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `job_title` | `string` | The job title of the employee |
| `pay_rate` | `string` | The amount of compensation for the employee |
| `pay_period` | `PayPeriodEnum` | The time period over which the pay rate is calculated |
| `pay_frequency` | `PayFrequencyEnum` | How often the employee is paid |
| `pay_currency` | `string` | The currency used for pay |
| `end_date` | `string` | The end date of employment |
| `grade` | `EmploymentGradeApiModel` | Represents the employee’s position within the organizational hierarchy. |
| `employment_type` | `EmploymentTypeEnum` | The type of employment (e.g., contractor, permanent) |
| `employment_contract_type` | `EmploymentScheduleTypeEnum` | The employment work schedule type (e.g., full-time, part-time) |
| `type` | `TypeApiModel` | The type of employment |
| `contract_type` | `ContractTypeApiModel` | The employment work schedule type |
| `work_time` | `WorkTimeApiModel` |  |
| `payroll_code` | `string` | The payroll code of the employee |
| `passthrough` | `object` | Value to pass through to the provider |
| `effective_date` | `string` | The employee effective date |

### `CreateEmployeeLocationApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | The name of the location |
| `phone_number` | `string` | The phone number of the location |
| `street_1` | `string` | The first line of the address |
| `street_2` | `string` | The second line of the address |
| `city` | `string` | The city where the location is situated |
| `zip_code` | `string` | The ZIP code/Postal code of the location |
| `country` | `CountryCodeEnum` | The country code |
| `passthrough` | `object` | Value to pass through to the provider |
| `state` | `ISO3166_2SubDivisionEnum` | The ISO3166-2 sub division where the location is situated |

### `CreateEmploymentApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `job_title` | `string` | The job title of the employee |
| `pay_rate` | `string` | The amount of compensation for the employee |
| `pay_period` | `PayPeriodEnum` | The time period over which the pay rate is calculated |
| `pay_frequency` | `PayFrequencyEnum` | How often the employee is paid |
| `pay_currency` | `string` | The currency used for pay |
| `effective_date` | `string` | The effective date of the employment contract |
| `end_date` | `string` | The end date of employment |
| `grade` | `EmploymentGradeApiModel` | Represents the employee’s position within the organizational hierarchy. |
| `employment_type` | `EmploymentTypeEnum` | The type of employment (e.g., contractor, permanent) |
| `employment_contract_type` | `EmploymentScheduleTypeEnum` | The employment work schedule type (e.g., full-time, part-time) |
| `type` | `TypeApiModel` | The type of employment |
| `contract_type` | `ContractTypeApiModel` | The employment work schedule type |
| `work_time` | `WorkTimeApiModel` |  |
| `payroll_code` | `string` | The payroll code of the employee |
| `job_id` | `string` | The employee job id |

### `CreateHRISBenefit`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | The name of the benefit |
| `benefit_type` | `BenefitsTypeEnum` | The type of the benefit |
| `provider` | `string` | The provider of the benefit |
| `description` | `string` | The description of the benefit |
| `created_at` | `string` | The date and time the benefit was created |
| `updated_at` | `string` | The date and time the benefit was last updated |

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

### `Employee`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `title` | `string` | The prefix of the employee's name (e.g., Mr, Ms, Dr) |
| `first_name` | `string` | The employee first name |
| `last_name` | `string` | The employee last name |
| `name` | `string` | The employee name |
| `display_name` | `string` | The employee display name |
| `avatar_url` | `string` | The employee avatar Url |
| `personal_email` | `string` | The employee personal email |
| `personal_phone_number` | `string` | The employee personal phone number |
| `work_email` | `string` | The employee work email |
| `work_phone_number` | `string` | The employee work phone number |
| `job_id` | `string` | The employee job id |
| `job_title` | `string` | The employee job title |
| `job_description` | `JobDescriptionApiModel` | The employee job description |
| `department_id` | `string` | The employee department id |
| `department` | `string` | The employee department |
| `groups` | `array<HRISGroup>` | The employee groups |
| `cost_centers` | `array<CostCenters>` | The employee cost centers |
| `manager_id` | `string` | The employee manager ID |
| `remote_manager_id` | `string` | Provider's unique identifier of the manager |
| `gender` | `GenderEnum` | The employee gender |
| `preferred_language` | `PreferredLanguageEnum` | The employee preferred language |
| `ethnicity` | `EthnicityEnum` | The employee ethnicity |
| `date_of_birth` | `string` | The date when the employee was born |
| `birthday` | `string` | The next birthday of the employee (upcoming birthday) |
| `marital_status` | `MaritalStatusEnum` | The employee marital status |
| `avatar` | `Image` | The employee avatar |
| `hire_date` | `string` | The employee hire date |
| `start_date` | `string` | The employee start date |
| `tenure` | `number` | The employee tenure |
| `work_anniversary` | `string` | The employee work anniversary |
| `employment_type` | `EmploymentTypeEnum` | The employee employment type |
| `employment_contract_type` | `EmploymentScheduleTypeEnum` | The employment work schedule type (e.g., full-time, part-time) |
| `employment_status` | `EmploymentStatusEnum` | The employee employment status |
| `termination_date` | `string` | The employee termination date |
| `company_name` | `string` | The employee company name |
| `company_id` | `string` | The employee company id |
| `citizenships` | `array<CountryCodeEnum>` | The citizenships of the Employee |
| `home_location` | `HRISLocation` | The employee home location |
| `work_location` | `HRISLocation` | The employee work location |
| `company` | `Company` | The employee company |
| `employments` | `array<Employment>` | The employee employments |
| `custom_fields` | `array<CustomFields>` | The employee custom fields |
| `benefits` | `array<HRISBenefit>` | Current benefits of the employee |
| `employee_number` | `string` | The assigned employee number |
| `bank_details` | `array<HRISBankDetails>` | Bank account details for the employee |
| `national_identity_number` | `NationalIdentityNumberApiModel` | The national identity number |
| `national_identity_numbers` | `array<NationalIdentityNumberApiModel>` | The national identity numbers |
| `skills` | `array<EntitySkills>` | The employee skills |
| `created_at` | `string` | The created_at date |
| `updated_at` | `string` | The updated_at date |

### `Employment`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `job_title` | `string` | The job title of the employee |
| `pay_rate` | `string` | The amount of compensation for the employee |
| `pay_period` | `PayPeriodEnum` | The time period over which the pay rate is calculated |
| `pay_frequency` | `PayFrequencyEnum` | How often the employee is paid |
| `pay_currency` | `string` | The currency used for pay |
| `effective_date` | `string` | The effective date of the employment contract |
| `end_date` | `string` | The end date of employment |
| `grade` | `EmploymentGradeApiModel` | Represents the employee’s position within the organizational hierarchy. |
| `employment_type` | `EmploymentTypeEnum` | The type of employment (e.g., contractor, permanent) |
| `employment_contract_type` | `EmploymentScheduleTypeEnum` | The employment work schedule type (e.g., full-time, part-time) |
| `type` | `TypeApiModel` | The type of employment |
| `contract_type` | `ContractTypeApiModel` | The employment work schedule type |
| `work_time` | `WorkTimeApiModel` |  |
| `payroll_code` | `string` | The payroll code of the employee |
| `employee_id` | `string` | The employee ID associated with this employment |
| `remote_employee_id` | `string` | Provider's unique identifier of the employee associated with this employment |
| `fte` | `number` | the employee's working percentage relative to a full-time employee |
| `created_at` | `string` | The created_at date |
| `updated_at` | `string` | The updated_at date |
| `start_date` | `string` | The start_date of employment |
| `active` | `object` | The employment active status |
| `department` | `HRISGroup` | The employee department |
| `cost_center` | `HRISGroup` | The employee cost_center |
| `cost_centers` | `array<HRISCostCenter>` | The employee cost_centers |
| `division` | `HRISGroup` | The employee division |
| `job` | `EmploymentJobApiModel` | The job of employee |
| `manager` | `array<EmploymentManagerApiModel>` | The employee manager |

### `EmploymentGradeApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The reference id |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The reference name |
| `description` | `string` | description of the grade |

### `EmploymentJobApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `title` | `string` | Title of the job |
| `description` | `JobDescriptionApiModel` | The employee job description |
| `owner_id` | `string` | The owner_id of the job |
| `parent_id` | `string` | The parent_id of the job |

### `EmploymentManagerApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The manager name |
| `email` | `string` | The manager email |
| `role` | `ManagerRoleApiModel` | The role of manager |

### `EntitySkills`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this skill |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name associated with this skill |
| `active` | `object` | Whether the skill is active and therefore available for use |
| `language` | `LanguageEnum` | The language associated with this skill |
| `maximum_proficiency` | `Proficiency` | The proficiency level of the skill |
| `minimum_proficiency` | `Proficiency` | The proficiency level of the skill |

### `File`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name of the file |
| `category` | `FileCategoryEnumApiModel` | The category of the file |
| `contents` | `array<Content>` | The content of the file. Deprecated, use `url` and `file_format` one level up instead |
| `category_id` | `string` | The categoryId of the documents |
| `created_at` | `string` | The creation date of the file |
| `updated_at` | `string` | The update date of the file |
| `remote_url` | `string` | URL where the file content is located |
| `file_format` | `FileFormatEnum` | The file format of the file |

### `FileCategoryEnumApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | The category of the file |
| `source_value` | `object` |  |

### `HRISBankDetails`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `account_name` | `string` | The name of the bank account |
| `is_primary` | `object` | Whether this is the primary bank account |
| `country_code` | `CountryCodeEnum` | The country code where the bank is located |
| `currency_code` | `CurrencyCodeEnum` | The currency code for the account |
| `bank_name` | `string` | The name of the bank |
| `account_type` | `BankAccountTypeEnum` | The type of bank account |
| `iban` | `string` | International Bank Account Number (IBAN) |
| `local_account_number` | `string` | Local account number (used when IBAN is not available) |
| `swift_bic` | `string` | SWIFT/BIC code for international transfers |
| `clearing_codes` | `array<ClearingCode>` | Array of clearing codes required by the country |

### `HRISBenefit`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name of the benefit |
| `benefit_type` | `BenefitsTypeEnum` | The type of the benefit |
| `provider` | `string` | The provider of the benefit |
| `description` | `string` | The description of the benefit |
| `created_at` | `string` | The date and time the benefit was created |
| `updated_at` | `string` | The date and time the benefit was last updated |

### `HRISCostCenter`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name of the group |
| `parent_ids` | `array<string>` | The list of parent group ids of the given group |
| `remote_parent_ids` | `array<string>` | Provider's list of parent group remote ids of the given group |
| `owner_ids` | `array<string>` | The list of group owner ids of the given group |
| `remote_owner_ids` | `array<string>` | The list of remote group owner ids of the given group |
| `company_id` | `string` | The id of the company that the group belongs to |
| `remote_company_id` | `string` | Provider's id of the company that the group belongs to |
| `distribution_percentage` | `number` | The distribution percentage for cost_center |
| `type` | `GroupTypeEnum` | The type of the group |

### `HRISDepartment`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name of the group |
| `parent_ids` | `array<string>` | The list of parent group ids of the given group |
| `remote_parent_ids` | `array<string>` | Provider's list of parent group remote ids of the given group |
| `owner_ids` | `array<string>` | The list of group owner ids of the given group |
| `remote_owner_ids` | `array<string>` | The list of remote group owner ids of the given group |
| `company_id` | `string` | The id of the company that the group belongs to |
| `remote_company_id` | `string` | Provider's id of the company that the group belongs to |
| `type` | `DepartmentTypeEnum` | The type of the department group |

### `HRISDivision`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name of the group |
| `parent_ids` | `array<string>` | The list of parent group ids of the given group |
| `remote_parent_ids` | `array<string>` | Provider's list of parent group remote ids of the given group |
| `owner_ids` | `array<string>` | The list of group owner ids of the given group |
| `remote_owner_ids` | `array<string>` | The list of remote group owner ids of the given group |
| `company_id` | `string` | The id of the company that the group belongs to |
| `remote_company_id` | `string` | Provider's id of the company that the group belongs to |
| `type` | `DivisionTypeEnum` | The type of the division group |

### `HRISGroup`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name of the group |
| `parent_ids` | `array<string>` | The list of parent group ids of the given group |
| `remote_parent_ids` | `array<string>` | Provider's list of parent group remote ids of the given group |
| `owner_ids` | `array<string>` | The list of group owner ids of the given group |
| `remote_owner_ids` | `array<string>` | The list of remote group owner ids of the given group |
| `company_id` | `string` | The id of the company that the group belongs to |
| `remote_company_id` | `string` | Provider's id of the company that the group belongs to |
| `type` | `GroupTypeEnum` | The type of the group |

### `HRISLocation`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `employee_id` | `string` | The employee ID |
| `remote_employee_id` | `string` | Provider's unique identifier of the employee |
| `name` | `string` | The name of the location |
| `phone_number` | `string` | The phone number of the location |
| `street_1` | `string` | The first line of the address |
| `street_2` | `string` | The second line of the address |
| `city` | `string` | The city where the location is situated |
| `state` | `string` | The state where the location is situated |
| `zip_code` | `string` | The ZIP code/Postal code of the location |
| `country` | `CountryCodeEnum` | The country code |
| `location_type` | `LocationTypeEnum` | The location type |
| `created_at` | `string` | The created_at date |
| `updated_at` | `string` | The updated_at date |

### `HRISTeam`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name of the group |
| `parent_ids` | `array<string>` | The list of parent group ids of the given group |
| `remote_parent_ids` | `array<string>` | Provider's list of parent group remote ids of the given group |
| `owner_ids` | `array<string>` | The list of group owner ids of the given group |
| `remote_owner_ids` | `array<string>` | The list of remote group owner ids of the given group |
| `company_id` | `string` | The id of the company that the group belongs to |
| `remote_company_id` | `string` | Provider's id of the company that the group belongs to |
| `type` | `TeamTypeEnum` | The type of the team group |

### `HrisDocumentApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name of the file |
| `category` | `HrisDocumentTypeEnum` | The category of the the document |
| `contents` | `array<Content>` | The content of the file. Deprecated, use `url` and `file_format` one level up instead |
| `category_id` | `string` | The categoryId of the documents |
| `created_at` | `string` | The creation date of the file |
| `updated_at` | `string` | The update date of the file |
| `remote_url` | `string` | URL where the file content is located |
| `file_format` | `FileFormatEnum` | The file format of the file |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `type` | `HrisDocumentTypeEnum` | The content type of the document |

### `HrisJob`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `code` | `string` | Code of the job |
| `title` | `string` | Title of the job |
| `description` | `string` | Description of the job |
| `status` | `HrisJobStatusEnum` | Status of the job |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |

### `HrisShift`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `employee_id` | `string` | The employee ID associated with this shift |
| `location_id` | `string` | The location ID where this shift takes place |
| `company_id` | `string` | The company ID associated with this shift |
| `start_time` | `string` | The start time of the shift (ISO8601 date-time without timezone) |
| `end_time` | `string` | The end time of the shift (ISO8601 date-time without timezone) |
| `break_duration` | `string` | The total break duration for this shift in ISO 8601 duration format |
| `status` | `ShiftStatusEnum` | The status of the shift |
| `approval_status` | `ShiftApprovalStatusEnum` | The approval status of the shift |
| `breaks` | `array<ShiftBreak>` | The breaks taken during this shift |
| `created_at` | `string` | The date and time the shift was created |
| `updated_at` | `string` | The date and time the shift was last updated |

### `ISO3166_2SubDivisionEnum`
| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | state (ISO3166-2 Sub Division Code) - value must be a valid enum value |
| `source_value` | `object` |  |

### `Image`
| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` |  |
| `base64` | `string` |  |

### `JobDescriptionApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `text` | `string` |  |

### `LaborTypeApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `code` | `string` |  |

### `ManagerRoleApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `label` | `string` | The label of the role type |
| `role_type` | `RoleTypeEnum` | The manager role type (e.g., admin, viewer) |

### `NationalIdentityNumberApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` |  |
| `type` | `NationalIdentityNumberTypeEnumApiModel` |  |
| `country` | `CountryCodeEnum` | The country code |

### `Position`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `job_id` | `string` | Job ID from the HRIS provider |
| `title` | `string` | Title of the position |
| `description` | `string` | Description of the position |
| `department_id` | `string` | Department ID associated with the position |
| `location_id` | `string` | Location ID associated with the position |
| `employment_type` | `string` | Employment type for the position |
| `status` | `PositionStatusEnum` | Status of the position |
| `posted_date` | `string` | Date when the position was posted |

### `ProviderError`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` | HTTP status code of the provider error |
| `url` | `string` | URL that caused the error |
| `raw` | `object` | Raw error response from the provider |
| `headers` | `object` | Response headers |

### `ProviderErrorApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` |  |
| `url` | `string` |  |
| `raw` | `object` |  |
| `headers` | `object` |  |

### `Reason`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |

### `Reference`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The reference id |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The reference name |
| `active` | `object` | The reference status |

### `ShiftBreak`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The unique identifier of the break |
| `start_time` | `string` | The start time of the break |
| `end_time` | `string` | The end time of the break |
| `duration` | `string` | The duration of the break in ISO 8601 duration format |
| `is_paid` | `object` | Whether the break is paid |
| `created_at` | `string` | The date and time the break was created |
| `updated_at` | `string` | The date and time the break was last updated |

### `Task`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `employee_id` | `string` | The employee ID associated with this task |
| `name` | `string` | The name of the task |
| `description` | `string` | The description of the task |
| `type` | `TaskTypeEnum` | The type of the task |
| `status` | `TaskStatusEnum` | The status of the task |
| `due_date` | `string` | The due date of the task |
| `completion_date` | `string` | The completion date of the task |
| `assigned_by_employee_id` | `string` | The ID of the employee who assigned this task |
| `assigned_by_employee_name` | `string` | The name of the employee who assigned this task |
| `link_to_task` | `string` | Link to the task in the provider system |
| `extracted_links` | `array<string>` | List of extracted links from the task |
| `next_task_id` | `string` | ID of the next task in sequence |
| `parent_process_name` | `string` | Name of the parent process of this task |
| `comments` | `array<TaskCommentApiModel>` | The comments associated with this task |
| `attachments` | `array<File>` | The documents attached to this task |
| `created_at` | `string` | The creation date of this task |
| `updated_at` | `string` | The last updated date of this task |

### `TaskCommentApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `author_employee_id` | `string` | The Employee ID of the author of the comment |
| `comment` | `string` | The text of the comment |
| `created_at` | `string` | The creation date of this comment |

### `TimeEntries`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `employee_id` | `string` | The employee ID associated with this time entry |
| `remote_employee_id` | `string` | Provider's unique identifier of the employee associated with this time entry |
| `start_time` | `string` | The start time of the time entry |
| `end_time` | `string` | The end time of the time entry |
| `hours_worked` | `number` | The hours worked in the time entry |
| `break_duration` | `number` | The duration of the break taken during time entry in hours |
| `status` | `TimeEntryStatusEnum` | The status of the time entry |
| `labor_type` | `LaborTypeApiModel` | The labor type associated with this time entry |
| `location` | `Reference` | The location of the time entry |
| `created_at` | `string` | The created_at date |
| `updated_at` | `string` | The updated_at date |

### `TimeOff`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `employee_id` | `string` | The employee ID |
| `remote_employee_id` | `string` | Provider's unique identifier of the employee |
| `approver_id` | `string` | The approver ID |
| `remote_approver_id` | `string` | Provider's unique identifier of the approver |
| `status` | `TimeOffStatusEnum` | The status of the time off request |
| `type` | `TimeOffTypeEnum` | The type of the time off request |
| `start_date` | `string` | The start date of the time off request (ISO8601 date-time without timezone) |
| `end_date` | `string` | Inclusive end date of the time off request (ISO8601 date-time without timezone). The time off inc... |
| `start_half_day` | `object` | True if the start of the time off request begins half way through the day |
| `end_half_day` | `object` | True if the end of the time off request ends half way through the day |
| `duration` | `string` | The duration of the time off request |
| `time_off_policy_id` | `string` | The time off policy id associated with this time off request |
| `remote_time_off_policy_id` | `string` | Provider's unique identifier of the time off policy id associated with this time off request |
| `reason` | `Reason` |  |
| `created_at` | `string` | Timestamp when the time off request was created |
| `updated_at` | `string` | Timestamp when the time off request was last updated |
| `policy` | `TimeOffPolicies` | The time off policy associated with Time Off |
| `comment` | `string` | Allows users to provide additional context or notes for their time off request |

### `TimeOffBalances`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `employee_id` | `string` | The employee id associated with this balance |
| `remote_employee_id` | `string` | Provider's unique identifier of the employee associated with this balance |
| `policy_id` | `string` | The time off policy id associated with this balance |
| `remote_policy_id` | `string` | Provider's unique identifier of the time off policy id associated with this balance |
| `policy` | `TimeOffPolicies` | The time off policy associated with this balance |
| `current_balance` | `number` | The current numeric balance for the associated employee and time off policy |
| `initial_balance` | `number` | The initial numeric balance for the associated employee and time off policy as of the balance start date |
| `balance_unit` | `TimeOffBalanceUnitEnum` | The duration unit of the current balance |
| `balance_start_date` | `string` | The date of when the initial balance quantity was set |
| `balance_expiry_date` | `string` | The date of when the current balance expires |
| `is_unlimited` | `object` | Indicates if this time off balance represents unlimited leave |
| `updated_at` | `string` | The updated_at date of this time off balance |

### `TimeOffPolicies`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name of this policy |
| `description` | `string` | The description of this policy |
| `type` | `TimeOffPolicyTypeEnum` | The type of this policy |
| `duration_unit` | `TimeOffBalanceUnitEnum` | The duration unit of the current policy |
| `reasons` | `array<Reason>` |  |
| `created_at` | `string` | The created_at date of this policy |
| `updated_at` | `string` | The updated_at date of this policy |

### `TypeApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `label` | `string` | The label of the employment type |
| `type` | `TypeEnum` | The type of employment (e.g., contractor, permanent) |

### `UnifiedError`
| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` | HTTP status code |
| `message` | `string` | Error message |
| `headers` | `object` | Response headers |

### `UnifiedWarningApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `message` | `string` |  |

### `WorkEligibility`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `type` | `WorkEligibilityTypeEnum` |  |
| `sub_type` | `string` |  |
| `document` | `File` |  |
| `valid_from` | `string` |  |
| `valid_to` | `string` |  |
| `issued_by` | `CountryCodeEnum` | The country code of the issued by authority |
| `number` | `string` |  |

### `WorkTimeApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `duration` | `string` | The work time duration in ISO 8601 duration format |
| `period` | `WorkTimeUnitEnum` | The period of the work time |

### `WriteResultApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` |  |
| `message` | `string` |  |
| `timestamp` | `string` |  |
| `provider_errors` | `array<ProviderErrorApiModel>` |  |
| `unified_warnings` | `array<UnifiedWarningApiModel>` |  |

---

## Enums

> **Note:** In API responses, enum fields are returned as objects with `value` (the unified enum value from the table below) and `source_value` (the raw provider value). For example: `{ "value": "active", "source_value": "Active" }`.

| Enum | Values |
|------|--------|
| `BankAccountTypeEnum` | `savings`, `checking`, `current`, `business`, `personal`, `other` |
| `BenefitsTypeEnum` | `retirement_savings`, `health_savings`, `other`, `health_insurance`, `insurance` |
| `ClearingCodeTypeEnum` | `sort_code`, `building_society_reference`, `aba_routing`, `chips_participant_id`, `transit_number`, `institution_number`, `bsb_code`, `ifsc_code`, `micr_code`, `clabe`, `cnaps_code`, `ch_bank_clearing_code`, `ch_sic_code`, `zengin_code`, `nz_clearing_code`, `hk_bank_code`, `blz`, `at_bankleitzahl`, `nuban`, `se_bankgiro_code` |
| `ConfidentialEnumApiModel` | `true`, `false` |
| `ContractTypeEnum` | `full_time`, `shifts`, `part_time` |
| `CountryCodeEnum` | `AF`, `AL`, `DZ`, `AS`, `AD`, `AO`, `AI`, `AQ`, `AG`, `AR`, `AM`, `AW`, `AU`, `AT`, `AZ`, `BS`, `BH`, `BD`, `BB`, `BY`, `BE`, `BZ`, `BJ`, `BM`, `BT`, `BO`, `BQ`, `BA`, `BW`, `BV`, `BR`, `IO`, `BN`, `BG`, `BF`, `BI`, `KH`, `CM`, `CA`, `CV`, `KY`, `CF`, `TD`, `CL`, `CN`, `CX`, `CC`, `CO`, `KM`, `CG`, `CD`, `CK`, `CR`, `HR`, `CU`, `CW`, `CY`, `CZ`, `CI`, `DK`, `DJ`, `DM`, `DO`, `EC`, `EG`, `SV`, `GQ`, `ER`, `EE`, `ET`, `FK`, `FO`, `FJ`, `FI`, `FR`, `GF`, `PF`, `TF`, `GA`, `GM`, `GE`, `DE`, `GH`, `GI`, `GR`, `GL`, `GD`, `GP`, `GU`, `GT`, `GG`, `GN`, `GW`, `GY`, `HT`, `HM`, `VA`, `HN`, `HK`, `HU`, `IS`, `IN`, `ID`, `IR`, `IQ`, `IE`, `IM`, `IL`, `IT`, `JM`, `JP`, `JE`, `JO`, `KZ`, `KE`, `KI`, `KP`, `KR`, `KW`, `KG`, `LA`, `LV`, `LB`, `LS`, `LR`, `LY`, `LI`, `LT`, `LU`, `MO`, `MK`, `MG`, `MW`, `MY`, `MV`, `ML`, `MT`, `MH`, `MQ`, `MR`, `MU`, `YT`, `MX`, `FM`, `MD`, `MC`, `MN`, `ME`, `MS`, `MA`, `MZ`, `MM`, `NA`, `NR`, `NP`, `NL`, `NC`, `NZ`, `NI`, `NE`, `NG`, `NU`, `NF`, `MP`, `NO`, `OM`, `PK`, `PW`, `PS`, `PA`, `PG`, `PY`, `PE`, `PH`, `PN`, `PL`, `PT`, `PR`, `QA`, `RO`, `RU`, `RW`, `RE`, `BL`, `SH`, `KN`, `LC`, `MF`, `PM`, `VC`, `WS`, `SM`, `ST`, `SA`, `SN`, `RS`, `SC`, `SL`, `SG`, `SX`, `SK`, `SI`, `SB`, `SO`, `ZA`, `GS`, `SS`, `ES`, `LK`, `SD`, `SR`, `SJ`, `SZ`, `SE`, `CH`, `SY`, `TW`, `TJ`, `TZ`, `TH`, `TL`, `TG`, `TK`, `TO`, `TT`, `TN`, `TR`, `TM`, `TC`, `TV`, `UG`, `UA`, `AE`, `GB`, `US`, `UM`, `UY`, `UZ`, `VU`, `VE`, `VN`, `VG`, `VI`, `WF`, `EH`, `YE`, `ZM`, `ZW` |
| `CurrencyCodeEnum` | `AED`, `AFN`, `ALL`, `AMD`, `ANG`, `AOA`, `ARS`, `AUD`, `AWG`, `AZN`, `BAM`, `BBD`, `BDT`, `BGN`, `BHD`, `BIF`, `BMD`, `BND`, `BOB`, `BRL`, `BSD`, `BTN`, `BWP`, `BYN`, `BZD`, `CAD`, `CDF`, `CHF`, `CLP`, `CNY`, `COP`, `CRC`, `CUC`, `CUP`, `CVE`, `CZK`, `DJF`, `DKK`, `DOP`, `DZD`, `EGP`, `ERN`, `ETB`, `EUR`, `FJD`, `FKP`, `GBP`, `GEL`, `GHS`, `GIP`, `GMD`, `GNF`, `GTQ`, `GYD`, `HKD`, `HNL`, `HRK`, `HTG`, `HUF`, `IDR`, `ILS`, `INR`, `IQD`, `IRR`, `ISK`, `JMD`, `JOD`, `JPY`, `KES`, `KGS`, `KHR`, `KMF`, `KPW`, `KRW`, `KWD`, `KYD`, `KZT`, `LAK`, `LBP`, `LKR`, `LRD`, `LSL`, `LYD`, `MAD`, `MDL`, `MGA`, `MKD`, `MMK`, `MNT`, `MOP`, `MRU`, `MUR`, `MVR`, `MWK`, `MXN`, `MYR`, `MZN`, `NAD`, `NGN`, `NIO`, `NOK`, `NPR`, `NZD`, `OMR`, `PAB`, `PEN`, `PGK`, `PHP`, `PKR`, `PLN`, `PYG`, `QAR`, `RON`, `RSD`, `RUB`, `RWF`, `SAR`, `SBD`, `SCR`, `SDG`, `SEK`, `SGD`, `SHP`, `SLL`, `SOS`, `SRD`, `SSP`, `STN`, `SYP`, `SZL`, `THB`, `TJS`, `TMT`, `TND`, `TOP`, `TRY`, `TTD`, `TWD`, `TZS`, `UAH`, `UGX`, `USD`, `UYU`, `UZS`, `VES`, `VND`, `VUV`, `WST`, `XAF`, `XCD`, `XDR`, `XOF`, `XPF`, `YER`, `ZAR`, `ZMW`, `ZWL` |
| `CustomFieldTypeEnum` | `date`, `float`, `integer`, `list`, `checkbox`, `text`, `boolean`, `single_select`, `multi_select`, `url`, `other` |
| `DepartmentTypeEnum` | `department`, `company`, `division`, `group`, `project`, `team` |
| `DivisionTypeEnum` | `department`, `company`, `division`, `group`, `project`, `cost_center`, `team` |
| `EmploymentScheduleTypeEnum` | `full_time`, `shifts`, `part_time` |
| `EmploymentStatusEnum` | `active`, `pending`, `terminated`, `leave`, `inactive`, `unknown` |
| `EmploymentTypeEnum` | `contractor`, `intern`, `permanent`, `apprentice`, `freelance`, `terminated`, `temporary`, `seasonal`, `volunteer`, `probation`, `internal`, `external`, `expatriate`, `employer_of_record`, `casual`, `Programme` |
| `EthnicityEnum` | `white`, `black_or_african_american`, `asian`, `hispanic_or_latino`, `american_indian_or_alaska_native`, `native_hawaiian_or_pacific_islander`, `two_or_more_races`, `not_disclosed`, `other` |
| `FileFormatEnum` | `ez`, `aw`, `atom`, `atomcat`, `atomdeleted`, `atomsvc`, `dwd`, `held`, `rsat`, `bdoc`, `xcs`, `ccxml`, `cdfx`, `cdmia`, `cdmic`, `cdmid`, `cdmio`, `cdmiq`, `cu`, `mpd`, `davmount`, `dbk`, `dssc`, `xdssc`, `es`, `ecma`, `emma`, `emotionml`, `epub`, `exi`, `exp`, `fdt`, `pfr`, `geojson`, `gml`, `gpx`, `gxf`, `gz`, `hjson`, `stk`, `ink`, `inkml`, `ipfix`, `its`, `jar`, `war`, `ear`, `ser`, `class`, `js`, `mjs`, `json`, `map`, `json5`, `jsonml`, `jsonld`, `lgr`, `lostxml`, `hqx`, `cpt`, `mads`, `webmanifest`, `mrc`, `mrcx`, `ma`, `nb`, `mb`, `mathml`, `mbox`, `mscml`, `metalink`, `meta4`, `mets`, `maei`, `musd`, `mods`, `m21`, `mp21`, `mp4s`, `m4p`, `doc`, `dot`, `mxf`, `nq`, `nt`, `cjs`, `bin`, `dms`, `lrf`, `mar`, `so`, `dist`, `distz`, `pkg`, `bpk`, `dump`, `elc`, `deploy`, `exe`, `dll`, `deb`, `dmg`, `iso`, `img`, `msi`, `msp`, `msm`, `buffer`, `oda`, `opf`, `ogx`, `omdoc`, `onetoc`, `onetoc2`, `onetmp`, `onepkg`, `oxps`, `relo`, `xer`, `pdf`, `pgp`, `asc`, `sig`, `prf`, `p10`, `p7m`, `p7c`, `p7s`, `p8`, `ac`, `cer`, `crl`, `pkipath`, `pki`, `pls`, `ai`, `eps`, `ps`, `provx`, `pskcxml`, `raml`, `rdf`, `owl`, `rif`, `rnc`, `rl`, `rld`, `rs`, `rapd`, `sls`, `rusd`, `gbr`, `mft`, `roa`, `rsd`, `rss`, `rtf`, `sbml`, `scq`, `scs`, `spq`, `spp`, `sdp`, `senmlx`, `sensmlx`, `setpay`, `setreg`, `shf`, `siv`, `sieve`, `smi`, `smil`, `rq`, `srx`, `gram`, `grxml`, `sru`, `ssdl`, `ssml`, `swidtag`, `tei`, `teicorpus`, `tfi`, `tsd`, `toml`, `trig`, `ttml`, `ubj`, `rsheet`, `td`, `vxml`, `wasm`, `wgt`, `hlp`, `wsdl`, `wspolicy`, `xaml`, `xav`, `xca`, `xdf`, `xel`, `xns`, `xenc`, `xhtml`, `xht`, `xlf`, `xml`, `xsl`, `xsd`, `rng`, `dtd`, `xop`, `xpl`, `*xsl`, `xslt`, `xspf`, `mxml`, `xhvml`, `xvml`, `xvm`, `yang`, `yin`, `zip`, `*3gpp`, `adp`, `amr`, `au`, `snd`, `mid`, `midi`, `kar`, `rmi`, `mxmf`, `*mp3`, `m4a`, `mp4a`, `mpga`, `mp2`, `mp2a`, `mp3`, `m2a`, `m3a`, `oga`, `ogg`, `spx`, `opus`, `s3m`, `sil`, `wav`, `*wav`, `weba`, `xm`, `ttc`, `otf`, `ttf`, `woff`, `woff2`, `exr`, `apng`, `avif`, `bmp`, `cgm`, `drle`, `emf`, `fits`, `g3`, `gif`, `heic`, `heics`, `heif`, `heifs`, `hej2`, `hsj2`, `ief`, `jls`, `jp2`, `jpg2`, `jpeg`, `jpg`, `jpe`, `jph`, `jhc`, `jpm`, `jpx`, `jpf`, `jxr`, `jxra`, `jxrs`, `jxs`, `jxsc`, `jxsi`, `jxss`, `ktx`, `ktx2`, `png`, `sgi`, `svg`, `svgz`, `t38`, `tif`, `tiff`, `tfx`, `webp`, `wmf`, `disposition-notification`, `u8msg`, `u8dsn`, `u8mdn`, `u8hdr`, `eml`, `mime`, `3mf`, `gltf`, `glb`, `igs`, `iges`, `msh`, `mesh`, `silo`, `mtl`, `obj`, `stpx`, `stpz`, `stpxz`, `stl`, `wrl`, `vrml`, `*x3db`, `x3dbz`, `x3db`, `*x3dv`, `x3dvz`, `x3d`, `x3dz`, `x3dv`, `appcache`, `manifest`, `ics`, `ifb`, `coffee`, `litcoffee`, `css`, `csv`, `html`, `htm`, `shtml`, `jade`, `jsx`, `less`, `markdown`, `md`, `mml`, `mdx`, `n3`, `txt`, `text`, `conf`, `def`, `list`, `log`, `in`, `ini`, `rtx`, `*rtf`, `sgml`, `sgm`, `shex`, `slim`, `slm`, `spdx`, `stylus`, `styl`, `tsv`, `t`, `tr`, `roff`, `man`, `me`, `ms`, `ttl`, `uri`, `uris`, `urls`, `vcard`, `vtt`, `*xml`, `yaml`, `yml`, `3gp`, `3gpp`, `3g2`, `h261`, `h263`, `h264`, `m4s`, `jpgv`, `*jpm`, `jpgm`, `mj2`, `mjp2`, `ts`, `mp4`, `mp4v`, `mpg4`, `mpeg`, `mpg`, `mpe`, `m1v`, `m2v`, `ogv`, `qt`, `mov`, `webm`, `cww`, `1km`, `plb`, `psb`, `pvb`, `tcap`, `pwn`, `aso`, `imp`, `acu`, `atc`, `acutc`, `air`, `fcdt`, `fxp`, `fxpl`, `xdp`, `xfdf`, `ahead`, `azf`, `azs`, `azw`, `acc`, `ami`, `apk`, `cii`, `fti`, `atx`, `mpkg`, `key`, `m3u8`, `numbers`, `pages`, `pkpass`, `swi`, `iota`, `aep`, `bmml`, `mpm`, `bmi`, `rep`, `cdxml`, `mmd`, `cdy`, `csl`, `cla`, `rp9`, `c4g`, `c4d`, `c4f`, `c4p`, `c4u`, `c11amc`, `c11amz`, `csp`, `cdbcmsg`, `cmc`, `clkx`, `clkk`, `clkp`, `clkt`, `clkw`, `wbs`, `pml`, `ppd`, `car`, `pcurl`, `dart`, `rdz`, `dbf`, `uvf`, `uvvf`, `uvd`, `uvvd`, `uvt`, `uvvt`, `uvx`, `uvvx`, `uvz`, `uvvz`, `fe_launch`, `dna`, `mlp`, `mle`, `dpg`, `dfac`, `kpxx`, `ait`, `svc`, `geo`, `mag`, `nml`, `esf`, `msf`, `qam`, `slt`, `ssf`, `es3`, `et3`, `ez2`, `ez3`, `fdf`, `mseed`, `seed`, `dataless`, `gph`, `ftc`, `fm`, `frame`, `maker`, `book`, `fnc`, `ltf`, `fsc`, `oas`, `oa2`, `oa3`, `fg5`, `bh2`, `ddd`, `xdw`, `xbd`, `fzs`, `txd`, `ggb`, `ggt`, `gex`, `gre`, `gxt`, `g2w`, `g3w`, `gmx`, `gdoc`, `gslides`, `gsheet`, `kml`, `kmz`, `gqf`, `gqs`, `gac`, `ghf`, `gim`, `grv`, `gtm`, `tpl`, `vcg`, `hal`, `zmm`, `hbci`, `les`, `hpgl`, `hpid`, `hps`, `jlt`, `pcl`, `pclxl`, `sfd-hdstx`, `mpy`, `afp`, `listafp`, `list3820`, `irm`, `sc`, `icc`, `icm`, `igl`, `ivp`, `ivu`, `igm`, `xpw`, `xpx`, `i2g`, `qbo`, `qfx`, `rcprofile`, `irp`, `xpr`, `fcs`, `jam`, `rms`, `jisp`, `joda`, `ktz`, `ktr`, `karbon`, `chrt`, `kfo`, `flw`, `kon`, `kpr`, `kpt`, `ksp`, `kwd`, `kwt`, `htke`, `kia`, `kne`, `knp`, `skp`, `skd`, `skt`, `skm`, `sse`, `lasxml`, `lbd`, `lbe`, `apr`, `pre`, `nsf`, `org`, `scm`, `lwp`, `portpkg`, `mvt`, `mcd`, `mc1`, `cdkey`, `mwf`, `mfm`, `flo`, `igx`, `mif`, `daf`, `dis`, `mbk`, `mqy`, `msl`, `plc`, `txf`, `mpn`, `mpc`, `xul`, `cil`, `cab`, `xls`, `xlm`, `xla`, `xlc`, `xlt`, `xlw`, `xlam`, `xlsb`, `xlsm`, `xltm`, `eot`, `chm`, `ims`, `lrm`, `thmx`, `msg`, `cat`, `*stl`, `ppt`, `pps`, `pot`, `ppam`, `pptm`, `sldm`, `ppsm`, `potm`, `mpp`, `mpt`, `docm`, `dotm`, `wps`, `wks`, `wcm`, `wdb`, `wpl`, `xps`, `mseq`, `mus`, `msty`, `taglet`, `nlu`, `ntf`, `nitf`, `nnd`, `nns`, `nnw`, `*ac`, `ngdat`, `n-gage`, `rpst`, `rpss`, `edm`, `edx`, `ext`, `odc`, `otc`, `odb`, `odf`, `odft`, `odg`, `otg`, `odi`, `oti`, `odp`, `otp`, `ods`, `ots`, `odt`, `odm`, `ott`, `oth`, `xo`, `dd2`, `obgx`, `oxt`, `osm`, `pptx`, `sldx`, `ppsx`, `potx`, `xlsx`, `xltx`, `docx`, `dotx`, `mgp`, `dp`, `esa`, `pdb`, `pqa`, `oprc`, `paw`, `str`, `ei6`, `efif`, `wg`, `plf`, `pbd`, `box`, `mgz`, `qps`, `ptid`, `qxd`, `qxt`, `qwd`, `qwt`, `qxl`, `qxb`, `rar`, `bed`, `mxl`, `musicxml`, `cryptonote`, `cod`, `rm`, `rmvb`, `link66`, `st`, `see`, `sema`, `semd`, `semf`, `ifm`, `itp`, `iif`, `ipk`, `twd`, `twds`, `mmf`, `teacher`, `fo`, `sdkm`, `sdkd`, `dxp`, `sfs`, `sdc`, `sda`, `sdd`, `smf`, `sdw`, `vor`, `sgl`, `smzip`, `sm`, `wadl`, `sxc`, `stc`, `sxd`, `std`, `sxi`, `sti`, `sxm`, `sxw`, `sxg`, `stw`, `sus`, `susp`, `svd`, `sis`, `sisx`, `xsm`, `bdm`, `xdm`, `ddf`, `tao`, `pcap`, `cap`, `dmp`, `tmo`, `tpt`, `mxs`, `tra`, `ufd`, `ufdl`, `utz`, `umj`, `unityweb`, `uoml`, `vcx`, `vsd`, `vst`, `vss`, `vsw`, `vis`, `vsf`, `wbxml`, `wmlc`, `wmlsc`, `wtb`, `nbp`, `wpd`, `wqd`, `stf`, `xar`, `xfdl`, `hvd`, `hvs`, `hvp`, `osf`, `osfpvg`, `saf`, `spf`, `cmp`, `zir`, `zirz`, `zaz`, `7z`, `abw`, `ace`, `*dmg`, `arj`, `aab`, `x32`, `u32`, `vox`, `aam`, `aas`, `bcpio`, `*bdoc`, `torrent`, `blb`, `blorb`, `bz`, `bz2`, `boz`, `cbr`, `cba`, `cbt`, `cbz`, `cb7`, `vcd`, `cfs`, `chat`, `pgn`, `crx`, `cco`, `nsc`, `cpio`, `csh`, `*deb`, `udeb`, `dgc`, `dir`, `dcr`, `dxr`, `cst`, `cct`, `cxt`, `w3d`, `fgd`, `swa`, `wad`, `ncx`, `dtb`, `res`, `dvi`, `evy`, `eva`, `bdf`, `gsf`, `psf`, `pcf`, `snf`, `pfa`, `pfb`, `pfm`, `afm`, `arc`, `spl`, `gca`, `ulx`, `gnumeric`, `gramps`, `gtar`, `hdf`, `php`, `install`, `*iso`, `*key`, `*numbers`, `*pages`, `jardiff`, `jnlp`, `kdbx`, `latex`, `luac`, `lzh`, `lha`, `run`, `mie`, `prc`, `mobi`, `application`, `lnk`, `wmd`, `wmz`, `xbap`, `mdb`, `obd`, `crd`, `clp`, `*exe`, `*dll`, `com`, `bat`, `*msi`, `mvb`, `m13`, `m14`, `*wmf`, `*wmz`, `*emf`, `emz`, `mny`, `pub`, `scd`, `trm`, `wri`, `nc`, `cdf`, `pac`, `nzb`, `pl`, `pm`, `*prc`, `*pdb`, `p12`, `pfx`, `p7b`, `spc`, `p7r`, `*rar`, `rpm`, `ris`, `sea`, `sh`, `shar`, `swf`, `xap`, `sql`, `sit`, `sitx`, `srt`, `sv4cpio`, `sv4crc`, `t3`, `gam`, `tar`, `tcl`, `tk`, `tex`, `tfm`, `texinfo`, `texi`, `*obj`, `ustar`, `hdd`, `ova`, `ovf`, `vbox`, `vbox-extpack`, `vdi`, `vhd`, `vmdk`, `src`, `webapp`, `der`, `crt`, `pem`, `fig`, `*xlf`, `xpi`, `xz`, `z1`, `z2`, `z3`, `z4`, `z5`, `z6`, `z7`, `z8`, `uva`, `uvva`, `eol`, `dra`, `dts`, `dtshd`, `lvp`, `pya`, `ecelp4800`, `ecelp7470`, `ecelp9600`, `rip`, `aac`, `aif`, `aiff`, `aifc`, `caf`, `flac`, `*m4a`, `mka`, `m3u`, `wax`, `wma`, `ram`, `ra`, `rmp`, `*ra`, `cdx`, `cif`, `cmdf`, `cml`, `csml`, `xyz`, `btif`, `pti`, `psd`, `azv`, `uvi`, `uvvi`, `uvg`, `uvvg`, `djvu`, `djv`, `*sub`, `dwg`, `dxf`, `fbs`, `fpx`, `fst`, `mmr`, `rlc`, `ico`, `dds`, `mdi`, `wdp`, `npx`, `b16`, `tap`, `vtf`, `wbmp`, `xif`, `pcx`, `3ds`, `ras`, `cmx`, `fh`, `fhc`, `fh4`, `fh5`, `fh7`, `*ico`, `jng`, `sid`, `*bmp`, `*pcx`, `pic`, `pct`, `pnm`, `pbm`, `pgm`, `ppm`, `rgb`, `tga`, `xbm`, `xpm`, `xwd`, `wsc`, `dae`, `dwf`, `gdl`, `gtw`, `mts`, `ogex`, `x_b`, `x_t`, `vds`, `usdz`, `bsp`, `vtu`, `dsc`, `curl`, `dcurl`, `mcurl`, `scurl`, `sub`, `fly`, `flx`, `gv`, `3dml`, `spot`, `jad`, `wml`, `wmls`, `s`, `asm`, `c`, `cc`, `cxx`, `cpp`, `h`, `hh`, `dic`, `htc`, `f`, `for`, `f77`, `f90`, `hbs`, `java`, `lua`, `mkd`, `nfo`, `opml`, `*org`, `p`, `pas`, `pde`, `sass`, `scss`, `etx`, `sfv`, `ymp`, `uu`, `vcs`, `vcf`, `uvh`, `uvvh`, `uvm`, `uvvm`, `uvp`, `uvvp`, `uvs`, `uvvs`, `uvv`, `uvvv`, `dvb`, `fvt`, `mxu`, `m4u`, `pyv`, `uvu`, `uvvu`, `viv`, `f4v`, `fli`, `flv`, `m4v`, `mkv`, `mk3d`, `mks`, `mng`, `asf`, `asx`, `vob`, `wm`, `wmv`, `wmx`, `wvx`, `avi`, `movie`, `smv`, `ice`, `mht` |
| `GenderEnum` | `male`, `female`, `non_binary`, `other`, `not_disclosed`, `diverse` |
| `GroupTypeEnum` | `workspace`, `team`, `department`, `group`, `organization`, `cost_center` |
| `HrisDocumentTypeEnum` | `application`, `academic`, `contract`, `certificates`, `visa`, `passport`, `driver_license`, `payslip`, `payroll`, `appraisal`, `resume`, `policy`, `cover_letter`, `offer_letter`, `policy_agreement`, `home_address`, `national_id`, `confidential`, `signed`, `shared`, `other`, `benefit`, `id_verification`, `background_check` |
| `HrisDocumentsUploadCategoryEnumApiModel` | `application`, `academic`, `contract`, `certificates`, `visa`, `passport`, `driver_license`, `payslip`, `payroll`, `appraisal`, `resume`, `policy`, `cover_letter`, `offer_letter`, `policy_agreement`, `home_address`, `national_id`, `confidential`, `signed`, `shared`, `other`, `benefit`, `id_verification`, `background_check` |
| `HrisJobStatusEnum` | `draft`, `pending`, `archived`, `closed`, `open`, `deleted` |
| `LanguageEnum` | `ar_AR`, `aa_ER`, `af_NA`, `af_ZA`, `am_ET`, `ar_AE`, `ar_BH`, `ar_DJ`, `ar_DZ`, `ar_EG`, `ar_ER`, `ar_IQ`, `ar_JO`, `ar_KM`, `ar_KW`, `ar_LB`, `ar_LY`, `ar_MA`, `ar_MR`, `ar_OM`, `ar_PS`, `ar_QA`, `ar_SA`, `ar_SD`, `ar_SY`, `ar_TD`, `ar_TN`, `ar_YE`, `ay_BO`, `ay_PE`, `az_AZ`, `az_IR`, `be_BY`, `bg_BG`, `bi_VU`, `bn_BD`, `bn_IN`, `bs_BA`, `bs-ME`, `byn_ER`, `ca_AD`, `ca_ES`, `ca_FR`, `ca_IT`, `ch_GU`, `cs_CZ`, `da_DK`, `de_AT`, `de_BE`, `de_CH`, `de_DE`, `de_LI`, `de_LU`, `de_VA`, `de_MV`, `dv_MV`, `dz_BT`, `el_CY`, `el_GR`, `en_AG`, `en_AI`, `en_AS`, `en_AU`, `en_BB`, `en_BE`, `en_BM`, `en_BS`, `en_BW`, `en_BZ`, `en_CA`, `en_CC`, `en_CK`, `en_CM`, `en_CW`, `en_CX`, `en_DG`, `en_DM`, `en_ER`, `en_FJ`, `en_FK`, `en_FM`, `en_GB`, `en_GD`, `en_GG`, `en_GH`, `en_GI`, `en_GM`, `en_GS`, `en_GU`, `en_GY`, `en_HK`, `en_IE`, `en_IM`, `en_IN`, `en_IO`, `en_JE`, `en_JM`, `en_KE`, `en_KI`, `en_KN`, `en_KY`, `en_LC`, `en_LR`, `en_LS`, `en_MF`, `en_MG`, `en_MH`, `en_MO`, `en_MP`, `en_MS`, `en_MT`, `en_MU`, `en_MW`, `en_MY`, `en_NA`, `en_NF`, `en_NG`, `en_NL`, `en_NR`, `en_NU`, `en_NZ`, `en_PG`, `en_PH`, `en_PK`, `en_PN`, `en_PR`, `en_PW`, `en_RW`, `en_SB`, `en_SC`, `en_SD`, `en_SG`, `en_SH`, `en_SL`, `en_SS`, `en_SX`, `en_SZ`, `en_TC`, `en_TK`, `en_TO`, `en_TT`, `en_TV`, `en_TZ`, `en_UG`, `en_UM`, `en_US`, `en_VC`, `en_VG`, `en_VI`, `en_VU`, `en_WS`, `en_ZA`, `en_ZM`, `en_ZW`, `es_AR`, `es_BO`, `es_BZ`, `es_CL`, `es_CO`, `es_CR`, `es_CU`, `es_DO`, `es_EA`, `es_EC`, `es_EH`, `es_ES`, `es_GQ`, `es_GT`, `es_HN`, `es_IC`, `es_LA`, `es_MX`, `es_NI`, `es_PA`, `es_PE`, `es_PH`, `es_PR`, `es_PY`, `es_SV`, `es_US`, `es_UY`, `es_VE`, `et_EE`, `fa_AF`, `fa_IR`, `fan_GA`, `ff_CM`, `ff_GN`, `ff_MR`, `ff_SN`, `ff_BF`, `fi_FI`, `fj_FJ`, `fo_FO`, `fr_BE`, `fr_BF`, `fr_BI`, `fr_BJ`, `fr_BL`, `fr_CA`, `fr_CD`, `fr_CF`, `fr_CG`, `fr_CH`, `fr_CI`, `fr_CM`, `fr_DJ`, `fr_DZ`, `fr_FR`, `fr_GA`, `fr_GF`, `fr_GG`, `fr_GN`, `fr_GP`, `fr_GQ`, `fr_HT`, `fr_KM`, `fr_JE`, `fr_LU`, `fr_LB`, `fr_MA`, `fr_MC`, `fr_MF`, `fr_MG`, `fr_ML`, `fr_MQ`, `fr_MR`, `fr_MU`, `fr_NC`, `fr_NE`, `fr_PF`, `fr_PM`, `fr_RE`, `fr_RW`, `fr_SC`, `fr_SN`, `fr_SY`, `fr_TD`, `fr_TF`, `fr_TG`, `fr_TN`, `fr_VU`, `fr_VA`, `fr_WF`, `fr_YT`, `ga_IE`, `gn_PY`, `gn_AR`, `gu_IN`, `gv_IM`, `he_IL`, `hi_IN`, `hr_BA`, `hr_HR`, `hr_ME`, `ht_HT`, `hu_HU`, `hy_AM`, `hy_CY`, `id_ID`, `is_IS`, `it_CH`, `it_IT`, `it_SM`, `it_VA`, `ja_JP`, `ka_GE`, `kg_CD`, `kk_KZ`, `kl_GL`, `km_KH`, `ko_KP`, `ko_KR`, `ku_IQ`, `ky_KG`, `la_VA`, `lb_LU`, `ln_AO`, `ln_CD`, `ln_CF`, `ln_CG`, `lo_LA`, `lt_LT`, `lu_CD`, `lv_LV`, `mg_MG`, `mh_MH`, `mi_NZ`, `mk_MK`, `mn_MN`, `mr_IN`, `ms_BN`, `ms_MY`, `ms_SG`, `mt_MT`, `my_MM`, `nb_NO`, `nb_BV`, `nb_ZW`, `ne_NP`, `nl_AW`, `nl_BE`, `nl_BQ`, `nl_CW`, `nl_NL`, `nl_SR`, `nl_SX`, `nl_MF`, `nn_NO`, `nn_BV`, `no_NO`, `no_BV`, `no_SJ`, `nr_ZA`, `ny_MW`, `pa_IN`, `pa_PK`, `pl_PL`, `ps_AF`, `pt_AO`, `pt_BR`, `pt_CH`, `pt_CV`, `pt_GQ`, `pt_GW`, `pt_LU`, `pt_MO`, `pt_MZ`, `pt_PT`, `pt_ST`, `pt_TL`, `qu_BO`, `qu_EC`, `qu_PE`, `rar_CK`, `rm_CH`, `rup_MK`, `ro_MD`, `ro_RO`, `ru_BY`, `ru_KG`, `ru_KZ`, `ru_MD`, `ru_RU`, `ru_UA`, `ru_AQ`, `ru_TJ`, `ru_TM`, `ru_UZ`, `rw_RW`, `se_SE`, `sg_CF`, `si_LK`, `sk_SK`, `sl_SI`, `sm_AS`, `sm_WS`, `sn_ZW`, `so_DJ`, `so_ET`, `so_KE`, `so_SO`, `sq_AL`, `sq_ME`, `sq_XK`, `sr_BA`, `sr_ME`, `sr_RS`, `sr_XK`, `ss_SZ`, `ss_ZA`, `sv_AX`, `sv_FI`, `sv_SE`, `sw_KE`, `sw_TZ`, `sw_UG`, `sw_CD`, `ta_IN`, `ta_MY`, `ta_SG`, `ta_LK`, `te_IN`, `tg_TJ`, `th_TH`, `ti_ER`, `ti_ET`, `tig_ER`, `tk_TM`, `tk_AF`, `tn_BW`, `tn_ZA`, `to_TO`, `tr_CY`, `tr_TR`, `ts_ZA`, `uk_UA`, `ur_IN`, `ur_PK`, `uz_AF`, `uz_UZ`, `ve_ZA`, `vi_VN`, `xh_ZA`, `zh_CN`, `zh_HK`, `zh_MO`, `zh_SG`, `zh_TW`, `zu_ZA` |
| `LocationTypeEnum` | `home`, `work` |
| `MaritalStatusEnum` | `single`, `married`, `common_law`, `divorced`, `widowed`, `domestic_partnership`, `separated`, `other`, `not_disclosed` |
| `NationalIdentityNumberTypeEnumApiModel` | `ssn`, `nin`, `sin`, `nid`, `pin`, `pn`, `umcn`, `pic`, `ric`, `idnum`, `cid`, `nidnr`, `pan`, `aadhaar`, `epic`, `ptn`, `itin`, `tin`, `uprc`, `pcode`, `ssi`, `cedula`, `passport`, `voterid`, `ntin`, `bn`, `fnr`, `mva`, `civil_id`, `cnic`, `nric`, `fin`, `uen`, `registrationnumber`, `nic`, `personnummer`, `ahv`, `id`, `eid`, `va`, `pid`, `nrt`, `nipt`, `cbu`, `cuit`, `dni`, `businessid`, `vnr`, `abn`, `acn`, `tfn`, `jmbg`, `bis`, `insz`, `nn`, `egn`, `pnf`, `vat`, `cnpj`, `unp`, `gst`, `pst`, `qst`, `ni`, `dic`, `rc`, `uid`, `rut`, `uscc`, `cpf`, `cpj`, `cr`, `stnr`, `svnr`, `ncf`, `rnc`, `nif`, `ci`, `ik`, `kmkr`, `registrikood`, `tn`, `ruc`, `nit`, `alv`, `hetu`, `ytunnus`, `vn`, `utr`, `nifp`, `amka`, `cui`, `nir`, `siren`, `siret`, `tva`, `oib`, `hkid`, `anum`, `kennitala`, `vsk`, `npwp`, `pps`, `gstin`, `idnr`, `hr`, `aic`, `codicefiscale`, `iva`, `peid`, `asmens`, `pvm`, `ctps`, `vrn`, `vtk`, `int`, `tk`, `pas`, `rne`, `rg`, `nci`, `crnm`, `pis`, `insee`, `tax`, `mpf`, `epfo`, `esi`, `pran`, `uan`, `idk`, `bsn`, `mid`, `sss`, `nie`, `nss`, `arc`, `curp`, `imss`, `rfc`, `ein`, `other`, `unknown` |
| `PayFrequencyEnum` | `hourly`, `weekly`, `bi_weekly`, `four_weekly`, `semi_monthly`, `monthly`, `bi_monthly`, `quarterly`, `semi_annually`, `yearly`, `thirteen_monthly`, `pro_rata`, `half_yearly`, `daily`, `fixed` |
| `PayPeriodEnum` | `hour`, `day`, `week`, `every_two_weeks`, `month`, `quarter`, `every_six_months`, `year` |
| `PositionStatusEnum` | `open`, `draft`, `closed`, `paused` |
| `PreferredLanguageEnum` | `aar`, `afr`, `amh`, `ara`, `aym`, `aze`, `bel`, `bul`, `bis`, `ben`, `bos`, `byn`, `cat`, `cha`, `ces`, `dan`, `deu`, `div`, `dzo`, `ell`, `eng`, `spa`, `est`, `fas`, `fan`, `ful`, `fin`, `fij`, `fao`, `fra`, `gle`, `grn`, `guj`, `glv`, `heb`, `hin`, `hrv`, `hat`, `hun`, `hye`, `ind`, `isl`, `ita`, `jpn`, `kat`, `kon`, `kaz`, `kal`, `khm`, `kor`, `kur`, `kir`, `lat`, `ltz`, `lin`, `lao`, `lit`, `lub`, `lav`, `mlg`, `mah`, `mri`, `mkd`, `mon`, `mar`, `msa`, `mlt`, `mya`, `nob`, `nep`, `nld`, `nno`, `nor`, `nbl`, `nya`, `pan`, `pol`, `pus`, `por`, `que`, `rar`, `roh`, `rup`, `ron`, `rus`, `kin`, `sme`, `sag`, `sin`, `slk`, `slv`, `smo`, `sna`, `som`, `sqi`, `srp`, `ssw`, `swe`, `swa`, `tam`, `tel`, `tgk`, `tha`, `tir`, `tig`, `tuk`, `tsn`, `ton`, `tur`, `tso`, `ukr`, `urd`, `uzb`, `ven`, `vie`, `xho`, `zho`, `zul` |
| `Proficiency` | `1`, `2`, `3`, `4`, `5` |
| `RoleTypeEnum` | `admin`, `viewer`, `editor`, `basic`, `guest`, `unassigned`, `restricted` |
| `ShiftApprovalStatusEnum` | `pending`, `approved`, `rejected` |
| `ShiftStatusEnum` | `draft`, `published`, `confirmed`, `cancelled` |
| `TaskStatusEnum` | `open`, `in_progress`, `blocked`, `completed`, `cancelled` |
| `TaskTypeEnum` | `action`, `review`, `acknowledgment`, `edit`, `approve` |
| `TeamTypeEnum` | `team` |
| `TimeEntryStatusEnum` | `approved` |
| `TimeOffBalanceUnitEnum` | `minutes`, `hours`, `days`, `weeks`, `months`, `years`, `unknown` |
| `TimeOffPolicyTypeEnum` | `sick`, `vacation`, `long_term_disability`, `short_term_disability`, `absent`, `comp_time`, `training`, `annual_leave`, `leave_of_absence`, `break`, `child_care_leave`, `maternity_leave`, `jury_duty`, `sabbatical`, `accident`, `paid`, `unpaid`, `holiday`, `personal`, `in_lieu`, `bereavement`, `other` |
| `TimeOffStatusEnum` | `approved`, `cancelled`, `rejected`, `pending`, `deleted`, `draft` |
| `TimeOffTypeEnum` | `sick`, `vacation`, `long_term_disability`, `short_term_disability`, `absent`, `comp_time`, `training`, `annual_leave`, `leave_of_absence`, `break`, `child_care_leave`, `maternity_leave`, `jury_duty`, `sabbatical`, `accident`, `paid`, `unpaid`, `holiday`, `personal`, `in_lieu`, `bereavement`, `other` |
| `TypeEnum` | `contractor`, `intern`, `permanent`, `apprentice`, `freelance`, `terminated`, `temporary`, `seasonal`, `volunteer`, `probation`, `internal`, `external`, `expatriate`, `employer_of_record`, `casual`, `Programme` |
| `WorkEligibilityTypeEnum` | `visa`, `passport`, `driver_license`, `birth_certificate`, `other` |
| `WorkTimeUnitEnum` | `day`, `week`, `month`, `year` |
