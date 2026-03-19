# ATS (Applicant Tracking System) — Schema Reference

> Manage jobs, candidates, applications, interviews, offers and departments.

> **OAS source:** `https://docs.stackone.com/ats/api-reference/ats.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/ats/applications` | List Applications |
| `POST` | `/unified/ats/applications` | Create Application |
| `GET` | `/unified/ats/applications/{id}` | Get Application |
| `PATCH` | `/unified/ats/applications/{id}` | Update Application |
| `GET` | `/unified/ats/applications/{id}/offers` | List Application Offers |
| `POST` | `/unified/ats/applications/{id}/move` | Move Application |
| `POST` | `/unified/ats/applications/{id}/reject` | Reject Application |
| `GET` | `/unified/ats/applications/{id}/offers/{subResourceId}` | Get Application Offer |
| `GET` | `/unified/ats/applications/{id}/scorecards` | List Application Scorecards |
| `GET` | `/unified/ats/applications/{id}/scorecards/{subResourceId}` | Get Application Scorecard |
| `GET` | `/unified/ats/applications/{id}/changes` | List Application Changes |
| `GET` | `/unified/ats/applications/{id}/notes` | List Application Notes |
| `POST` | `/unified/ats/applications/{id}/notes` | Create Application Note |
| `GET` | `/unified/ats/applications/{id}/notes/{subResourceId}` | Get Application Note |
| `PATCH` | `/unified/ats/applications/{id}/notes/{subResourceId}` | Update Application Note |
| `GET` | `/unified/ats/applications/{id}/scheduled_interviews` | List Applications scheduled interviews |
| `GET` | `/unified/ats/applications/{id}/scheduled_interviews/{subResourceId}` | Get Applications scheduled interview |
| `POST` | `/unified/ats/applications/{id}/documents/upload` | Upload Application Document |
| `GET` | `/unified/ats/applications/{id}/documents/{subResourceId}/download` | Download Application Document |
| `GET` | `/unified/ats/applications/{id}/documents` | List Application Documents |
| `GET` | `/unified/ats/applications/{id}/documents/{subResourceId}` | Get Application Document |
| `GET` | `/unified/ats/candidates` | List Candidates |
| `POST` | `/unified/ats/candidates` | Create Candidate |
| `GET` | `/unified/ats/candidates/{id}` | Get Candidate |
| `PATCH` | `/unified/ats/candidates/{id}` | Update Candidate |
| `GET` | `/unified/ats/candidates/{id}/notes` | List Candidate Notes |
| `POST` | `/unified/ats/candidates/{id}/notes` | Create Candidate Note |
| `GET` | `/unified/ats/candidates/{id}/notes/{subResourceId}` | Get Candidate Note |
| `GET` | `/unified/ats/custom_field_definitions/applications` | List Application Custom Field Definitions |
| `GET` | `/unified/ats/custom_field_definitions/applications/{id}` | Get Application Custom Field Definition |
| `GET` | `/unified/ats/custom_field_definitions/candidates` | List Candidate Custom Field Definitions |
| `GET` | `/unified/ats/custom_field_definitions/candidates/{id}` | Get Candidate Custom Field Definition |
| `GET` | `/unified/ats/custom_field_definitions/jobs` | List Job Custom Field Definitions |
| `GET` | `/unified/ats/custom_field_definitions/jobs/{id}` | Get Job Custom Field Definition |
| `GET` | `/unified/ats/departments` | List Departments |
| `GET` | `/unified/ats/departments/{id}` | Get Department |
| `GET` | `/unified/ats/interview_stages` | List Interview Stages |
| `GET` | `/unified/ats/interview_stages/{id}` | Get Interview Stage |
| `GET` | `/unified/ats/application_stages` | List Application Stages |
| `GET` | `/unified/ats/application_stages/{id}` | Get Application Stage |
| `GET` | `/unified/ats/interviews` | List Interviews |
| `GET` | `/unified/ats/interviews/{id}` | Get Interview |
| `POST` | `/unified/ats/interviews/{id}/notes` | Create Interview Note |
| `PATCH` | `/unified/ats/interviews/{id}/notes/{subResourceId}` | Update Interview Note |
| `GET` | `/unified/ats/jobs` | List Jobs |
| `POST` | `/unified/ats/jobs` | Create Job |
| `GET` | `/unified/ats/jobs/{id}/application_stages` | List Job Application Stages |
| `GET` | `/unified/ats/jobs/{id}` | Get Job |
| `PATCH` | `/unified/ats/jobs/{id}` | Update Job |
| `GET` | `/unified/ats/jobs/{id}/application_stages/{subResourceId}` | Get Job Application Stage |
| `GET` | `/unified/ats/lists` | Get all Lists |
| `GET` | `/unified/ats/lists/{id}` | Get List |
| `GET` | `/unified/ats/locations` | List locations |
| `GET` | `/unified/ats/locations/{id}` | Get Location |
| `GET` | `/unified/ats/rejected_reasons` | List Rejected Reasons |
| `GET` | `/unified/ats/rejected_reasons/{id}` | Get Rejected Reason |
| `GET` | `/unified/ats/users` | List Users |
| `GET` | `/unified/ats/users/{id}` | Get User |
| `GET` | `/unified/ats/job_postings` | List Job Postings |
| `GET` | `/unified/ats/job_postings/{id}` | Get Job Posting |
| `GET` | `/unified/ats/offers` | List Offers |
| `POST` | `/unified/ats/offers` | Create Offer |
| `GET` | `/unified/ats/offers/{id}` | Get Offer |
| `GET` | `/unified/ats/assessments/packages` | List Assessments Packages |
| `GET` | `/unified/ats/assessments/packages/{id}` | Get Assessments Package |
| `POST` | `/unified/ats/assessments/orders` | Order Assessments Request |
| `PATCH` | `/unified/ats/assessments/orders/{id}/result` | Update Assessments Result |
| `GET` | `/unified/ats/background_checks/packages` | List Background Check Packages |
| `POST` | `/unified/ats/background_checks/packages` | Create Background Check Package |
| `GET` | `/unified/ats/background_checks/packages/{id}` | Get Background Check Package |
| `PATCH` | `/unified/ats/background_checks/packages/{id}` | Update Background Check Package |
| `DELETE` | `/unified/ats/background_checks/packages/{id}` | Delete Background Check Package |
| `POST` | `/unified/ats/background_checks/orders` | Order Background Check Request |
| `PATCH` | `/unified/ats/background_checks/orders/{id}/result` | Update Background Check Result |
| `GET` | `/unified/ats/documents/application_categories` | List Application Document Categories |
| `GET` | `/unified/ats/documents/application_categories/{id}` | Get Application Document Category |

---

## Models

### `ATSLocation`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` |  |

### `Answer`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `type` | `AnswerEnum` | Type of the answer |
| `values` | `array<string>` | Values of the answer |

### `Application`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `candidate_id` | `string` | Unique identifier of the candidate |
| `remote_candidate_id` | `string` | Provider's unique identifier of the candidate |
| `job_id` | `string` | Unique identifier of the job |
| `remote_job_id` | `string` | Provider's unique identifier of the job |
| `interview_stage` | `InterviewStage` |  |
| `application_stage` | `ApplicationStage` |  |
| `interview_stage_id` | `string` | Unique identifier of the interview stage |
| `remote_interview_stage_id` | `string` | Provider's unique identifier of the interview stage |
| `application_stage_id` | `string` | Unique identifier of the application stage |
| `remote_application_stage_id` | `string` | Unique identifier of the application stage |
| `rejected_reasons` | `array<RejectedReason>` |  |
| `rejected_reason_ids` | `array<string>` | Unique identifiers of the rejection reasons |
| `remote_rejected_reason_ids` | `array<string>` | Provider's unique identifiers of the rejection reasons |
| `rejected_at` | `string` | Date of rejection |
| `location_id` | `string` | Unique identifier of the location |
| `remote_location_id` | `string` | Provider's unique identifier of the location |
| `location_ids` | `array<string>` | Unique identifiers of the locations |
| `remote_location_ids` | `array<string>` | Remote's unique identifiers of the locations |
| `application_status` | `ApplicationStatusEnum` |  |
| `questionnaires` | `array<Questionnaire>` | Questionnaires associated with the application |
| `candidate` | `ApplicationCandidate` |  |
| `attachments` | `array<ApplicationAttachment>` | Use `documents` expand instead |
| `documents` | `array<AtsDocumentApiModel>` | The documents attached to this application (eg. resume, cover letter etc.) |
| `result_links` | `array<ResultLink>` |  |
| `source` | `Source` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |
| `custom_fields` | `array<CustomFields>` | The application custom fields |

### `ApplicationAttachment`
| Field | Type | Description |
|-------|------|-------------|
| `file_name` | `string` | The file name of the attachment. |
| `content` | `string` | The content of the attachment. |
| `url` | `string` | The URL of the attachment. |
| `content_type` | `AttachmentContentType` |  |

### `ApplicationCandidate`
| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Candidate name |
| `first_name` | `string` | First name of the candidate |
| `last_name` | `string` | Last name of the candidate |
| `email` | `string` | Email of the candidate |
| `emails` | `array<CandidateEmail>` | List of candidate emails |
| `phone_numbers` | `array<PhoneNumber>` | List of candidate phone numbers including the type of the number when available |
| `social_links` | `array<SocialLink>` | List of candidate social links |
| `company` | `string` | Candidate company |
| `title` | `string` | Candidate title |

### `ApplicationChanges`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `created_at` | `string` | Timestamp when the change was created |
| `effective_at` | `string` | Timestamp when the change became effective |
| `actor` | `ChangesActor` | The actor who made the change |
| `change_type` | `ApplicationChangeTypeEnum` | The type of change that occurred to the application |
| `new_values` | `ApplicationChangesDataModel` | The new values for changed application properties. Only includes fields that commonly change over... |

### `ApplicationChangesDataModel`
| Field | Type | Description |
|-------|------|-------------|
| `interview_stage_id` | `string` | Unique identifier of the interview stage |
| `rejected_reason_ids` | `array<string>` | Unique identifiers of the rejection reasons |
| `application_status` | `ApplicationStatusEnum` |  |

### `ApplicationStage`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | Application Stage name |
| `order` | `number` | Application Stage order |
| `created_at` | `string` | Application Stage created date |
| `updated_at` | `string` | Application Stage updated date |

### `AssessmentPackage`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | Package name |
| `description` | `string` | Package description |

### `AtsDocumentApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name of the file |
| `category` | `FileCategoryEnumApiModel` | The category of the the document |
| `contents` | `array<Content>` | The content of the file. Deprecated, use `url` and `file_format` one level up instead |
| `category_id` | `string` | The categoryId of the documents |
| `created_at` | `string` | The creation date of the file |
| `updated_at` | `string` | The update date of the file |
| `remote_url` | `string` | URL where the file content is located |
| `file_format` | `FileFormatEnum` | The file format of the file |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `type` | `AtsDocumentTypeEnum` | The content type of the document |

### `AtsJob`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `code` | `string` | Code of the job |
| `title` | `string` | Title of the job |
| `description` | `string` | Description of the job |
| `status` | `string` | Status of the job |
| `job_status` | `AtsJobStatusEnum` | Status of the job |
| `department_ids` | `array<string>` | Department ids of the job |
| `remote_department_ids` | `array<string>` | Provider's department ids of the job |
| `location_ids` | `array<string>` | Location ids of the job |
| `remote_location_ids` | `array<string>` | Provider's location ids of the job |
| `hiring_team` | `array<AtsJobHiringTeam>` | Hiring team for the job. |
| `interview_stages` | `array<InterviewStage>` | Interview stages for the job. |
| `confidential` | `string` | Confidential status of the job |
| `custom_fields` | `array<CustomFields>` | The job custom fields |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |

### `AtsJobHiringTeam`
| Field | Type | Description |
|-------|------|-------------|
| `user_id` | `string` | User ID of the hiring team member. |
| `remote_user_id` | `string` | Provider's unique identifier of the user |
| `first_name` | `string` | First name of the hiring team member. |
| `last_name` | `string` | Last name of the hiring team member. |
| `email` | `string` | Email of the hiring team member. |
| `role` | `string` | Role of the hiring team member. |

### `Attachment`
| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | The URL of the attachment. |
| `content_type` | `AttachmentContentType` |  |

### `BackgroundCheckPackage`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | Package name |
| `description` | `string` | Package description |
| `tests` | `array<Package>` | Package tests |

### `Candidate`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | Candidate name |
| `first_name` | `string` | Candidate first name |
| `last_name` | `string` | Candidate last name |
| `email` | `string` | Candidate email |
| `emails` | `array<CandidateEmail>` | List of candidate emails |
| `social_links` | `array<SocialLink>` | List of candidate social links |
| `phone` | `string` | Candidate phone number |
| `phone_numbers` | `array<PhoneNumber>` | List of candidate phone numbers including the type of the number when available |
| `company` | `string` | Candidate company |
| `title` | `string` | Candidate title |
| `application_ids` | `array<string>` | List of candidate application IDs |
| `remote_application_ids` | `array<string>` | Provider's list of candidate application IDs |
| `hired_at` | `string` | Candidate hired date |
| `country` | `string` | Candidate country |
| `custom_fields` | `array<CustomFields>` | The candidate custom fields |
| `tags` | `array<Tag>` | List of candidate tags indicating metadata associated with the candidate |
| `created_at` | `string` | Candidate created date |
| `updated_at` | `string` | Candidate updated date |

### `CandidateEmail`
| Field | Type | Description |
|-------|------|-------------|
| `type` | `string` | Type of the email |
| `value` | `string` | Email value |

### `ChangesActor`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |

### `Content`
| Field | Type | Description |
|-------|------|-------------|
| `url` | `string` | URL where the file content is located |
| `unified_url` | `string` | Unified download URL for retrieving file content. |
| `file_format` | `FileFormatEnum` | The file format of the file |

### `CreateAnswer`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `type` | `AnswerEnum` | Type of the answer |
| `values` | `array<string>` | Values of the answer |

### `CreateCandidate`
| Field | Type | Description |
|-------|------|-------------|
| `passthrough` | `object` | Value to pass through to the provider |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `phone_number` | `string` | The candidate personal phone number |
| `phone_numbers` | `array<PhoneNumber>` | List of candidate phone numbers including the type of the number when available |
| `name` | `string` | Candidate name |
| `first_name` | `string` | Candidate first name |
| `last_name` | `string` | Candidate last name |
| `email` | `string` | Candidate email |
| `social_links` | `array<SocialLink>` | List of candidate social links |
| `company` | `string` | Candidate company |
| `title` | `string` | Candidate title |
| `hired_at` | `string` | Candidate hired date |
| `country` | `string` | Candidate country |
| `custom_fields` | `array<CustomFields>` | The candidate custom fields |

### `CreatePackage`
| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Package name |
| `description` | `string` | Package description |

### `CreateQuestionnaire`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `answers` | `array<CreateAnswer>` |  |

### `CreateSource`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | The source of the application |

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

### `Department`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` |  |

### `Field`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `label` | `string` | The label of the field |
| `type` | `string` | The type of the field |
| `values` | `array<string>` | The possible values for the field |
| `required` | `object` | Indicates if the field is required |

### `FileCategoryEnumApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | The category of the file |
| `source_value` | `object` |  |

### `Interview`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `application_id` | `string` |  |
| `remote_application_id` | `string` | Provider's unique identifier of the application |
| `interview_stage_id` | `string` |  |
| `remote_interview_stage_id` | `string` | Provider's unique identifier of the interview stage |
| `interview_stage` | `InterviewStage` |  |
| `interview_status` | `InterviewStatusEnum` |  |
| `interviewer_ids` | `array<string>` |  |
| `remote_interviewer_ids` | `array<string>` | Provider's unique identifiers of the interviewers |
| `interview_parts` | `array<InterviewPart>` |  |
| `interviewers` | `array<Interviewer>` |  |
| `start_at` | `string` | Interview start date |
| `end_at` | `string` | Interview end date |
| `meeting_url` | `string` |  |
| `created_at` | `string` | Interview created date |
| `updated_at` | `string` | Interview updated date |

### `InterviewPart`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `type` | `InterviewTypeEnum` |  |
| `title` | `string` | The title of interview, usually corresponding to the title of an associated calendar event |
| `interviewer_ids` | `array<string>` | The user (interviewer) IDs taking part in this specific interview. |
| `remote_interviewer_ids` | `array<string>` | Provider's user (interviewer) IDs taking part in this specific interview. |
| `meeting_url` | `string` | The meeting URL for the interview - this may be populated using the underlying location if the lo... |
| `meeting_provider` | `string` | The video meeting provider used for the interview. |
| `start_at` | `string` | The specific interview part's start date |
| `end_at` | `string` | The specific interview part's end date |
| `created_at` | `string` | Interview part created date |
| `updated_at` | `string` | Interview part updated date |

### `InterviewStage`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` |  |
| `order` | `number` |  |
| `created_at` | `string` | Interview Stage created date |
| `updated_at` | `string` | Interview Stage updated date |

### `Interviewer`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `first_name` | `string` |  |
| `last_name` | `string` |  |
| `name` | `string` |  |
| `email` | `string` |  |

### `JobPosting`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `title` | `string` |  |
| `locations` | `array<JobPostingLocation>` |  |
| `internal` | `string` |  |
| `status` | `JobPostingStatusEnum` |  |
| `job_id` | `string` |  |
| `remote_job_id` | `string` | Provider's unique identifier of the job |
| `content` | `JobPostingContent` |  |
| `compensation` | `array<JobPostingCompensation>` |  |
| `employment_type` | `EmploymentTypeEnum` |  |
| `employment_contract_type` | `EmploymentContractTypeEnum` |  |
| `external_url` | `string` |  |
| `external_apply_url` | `string` |  |
| `questionnaires` | `array<JobPostingQuestionnaire>` |  |
| `start_date` | `string` | The posting start date |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |

### `JobPostingCompensation`
| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` |  |
| `type` | `CompensationTypeEnum` |  |
| `pay_period` | `PayPeriodEnum` |  |
| `pay_frequency` | `PayFrequencyEnum` |  |
| `currency` | `string` |  |
| `value` | `string` |  |
| `min_value_range` | `string` |  |
| `max_value_range` | `string` |  |

### `JobPostingContent`
| Field | Type | Description |
|-------|------|-------------|
| `plain` | `string` |  |
| `html` | `string` |  |
| `sections` | `array<JobPostingContentSection>` |  |

### `JobPostingContentSection`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `type` | `AssessmentTypeEnum` |  |
| `label` | `string` |  |
| `content` | `string` |  |

### `JobPostingLocation`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |

### `JobPostingQuestionnaire`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `internal` | `object` |  |
| `questions` | `array<Question>` |  |

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

### `Note`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `content` | `array<NoteContentApiModel>` |  |
| `author_id` | `string` | Unique identifier of the author |
| `remote_author_id` | `string` | Provider's unique identifier of the author |
| `visibility` | `NotesVisibilityEnum` | Visibility of the note |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |
| `deleted_at` | `string` | Date of Deletion |

### `NoteContentApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `body` | `string` | Body of the note |

### `Offer`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `application_id` | `string` |  |
| `remote_application_id` | `string` | Provider's unique identifier of the application |
| `start_date` | `string` | Date of creation |
| `offer_status` | `OfferStatusEnum` |  |
| `salary` | `number` |  |
| `currency` | `string` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |
| `offer_history` | `array<OfferHistory>` |  |

### `OfferHistory`
| Field | Type | Description |
|-------|------|-------------|
| `start_date` | `string` | Start Date of the offer |
| `salary` | `number` |  |
| `currency` | `string` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |

### `OrderApplicationApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `application_status` | `ApplicationStatusEnum` |  |
| `passthrough` | `object` | Value to pass through to the provider |

### `OrderBackgroundCheckPackageApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | Package name |
| `description` | `string` | Package description |
| `tests` | `array<Package>` | Package tests |

### `OrderCandidateApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `first_name` | `string` | Candidate first name |
| `last_name` | `string` | Candidate last name |
| `emails` | `array<CandidateEmail>` | List of candidate emails |
| `passthrough` | `object` | Value to pass through to the provider |
| `profile_url` | `string` | Candidate profile url |

### `OrderJobApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `title` | `string` | Title of the job |
| `hiring_team` | `array<AtsJobHiringTeam>` | Hiring team for the job. |
| `passthrough` | `object` | Value to pass through to the provider |

### `OrderJobHiringTeamApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `user_id` | `string` | User ID of the hiring team member. |
| `remote_user_id` | `string` | Provider's unique identifier of the user |
| `first_name` | `string` | First name of the hiring team member. |
| `last_name` | `string` | Last name of the hiring team member. |
| `email` | `string` | Email of the hiring team member. |
| `role` | `string` | Role of the hiring team member. |

### `OrderPackageApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | Package name |
| `description` | `string` | Package description |

### `Package`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | Package name |
| `description` | `string` | Package description |

### `ParentQuestion`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `option_ids` | `array<string>` | List of parent questions's option IDs |
| `remote_option_ids` | `array<string>` | Provider's list of parent questions's option IDs |
| `condition_type` | `ConditionTypeEnum` |  |

### `PhoneNumber`
| Field | Type | Description |
|-------|------|-------------|
| `type` | `string` | Type of phone number |
| `phone` | `string` | Phone number string |

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

### `Question`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `type` | `QuestionsTypeEnum` |  |
| `text` | `string` |  |
| `required` | `object` |  |
| `multiple_choice_answers` | `array<QuestionMultipleChoiceAnswers>` |  |
| `parent_question` | `ParentQuestion` |  |

### `QuestionMultipleChoiceAnswers`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `text` | `string` |  |

### `Questionnaire`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `answers` | `array<Answer>` |  |

### `Reference`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The reference id |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The reference name |
| `active` | `object` | The reference status |

### `RejectedReason`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `label` | `string` | The label of the rejected reason. |
| `type` | `string` | The string type of the rejected reason. |
| `rejected_reason_type` | `RejectedReasonTypeEnum` |  |

### `ResultLink`
| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | The label of the result link. |
| `url` | `string` | The URL of the result link. |

### `ScheduledInterview`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `application_id` | `string` |  |
| `remote_application_id` | `string` | Provider's unique identifier of the application |
| `interview_stage_id` | `string` |  |
| `remote_interview_stage_id` | `string` | Provider's unique identifier of the interview stage |
| `interview_stage` | `InterviewStage` |  |
| `interview_status` | `InterviewStatusEnum` |  |
| `interviewer_ids` | `array<string>` |  |
| `remote_interviewer_ids` | `array<string>` | Provider's unique identifiers of the interviewers |
| `interview_parts` | `array<InterviewPart>` |  |
| `interviewers` | `array<Interviewer>` |  |
| `start_at` | `string` | Interview start date |
| `end_at` | `string` | Interview end date |
| `meeting_url` | `string` |  |
| `created_at` | `string` | Interview created date |
| `updated_at` | `string` | Interview updated date |

### `ScoreApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | The label of the score |
| `value` | `string` | The value is the actual score |
| `min` | `string` | The minimum value of the score |
| `max` | `string` | The maximum value of the score |

### `Scorecard`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `sections` | `array<ScorecardSection>` | The sections in the scorecard |
| `label` | `string` | The label of the scorecard |
| `candidate_id` | `string` | The candidate ID associated with the scorecard |
| `remote_candidate_id` | `string` | Provider's unique identifier of the candidate |
| `application_id` | `string` | The application ID associated with the scorecard |
| `remote_application_id` | `string` | Provider's unique identifier of the application |
| `interview_id` | `string` | The interview ID associated with the scorecard |
| `remote_interview_id` | `string` | Provider's unique identifier of the interview |
| `author_id` | `string` | The author ID of the scorecard |
| `remote_author_id` | `string` | Provider's unique identifier of the author |
| `overall_recommendation` | `string` | The overall recommendation |
| `created_at` | `string` | The creation date of the scorecard |
| `updated_at` | `string` | The update date of the scorecard |

### `ScorecardSection`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `label` | `string` | The label of the section |
| `fields` | `array<Field>` | The fields within the section |

### `SocialLink`
| Field | Type | Description |
|-------|------|-------------|
| `type` | `string` | Type of the social link |
| `url` | `string` | URL of the social link |

### `Source`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The source of the application |

### `Tag`
| Field | Type | Description |
|-------|------|-------------|
| `remote_id` | `string` | Remote ID of the tag |
| `name` | `string` | Name of the tag |

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

### `UpdatePackage`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Package name |
| `description` | `string` | Package description |

### `User`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `email` | `string` |  |
| `first_name` | `string` |  |
| `last_name` | `string` |  |
| `name` | `string` |  |
| `phone` | `string` |  |

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

| Enum | Values |
|------|--------|
| `AnswerEnum` | `short_text`, `long_text`, `attachment`, `multi_select`, `single_select`, `boolean`, `number`, `date`, `video`, `reference_check`, `url` |
| `ApplicationChangeTypeEnum` | `application_status`, `interview_stage`, `rejected_reasons` |
| `ApplicationStatusEnum` | `active`, `assessment`, `background_check`, `converted`, `declined_by_candidate`, `hired`, `interview`, `lead`, `offer`, `reference_check`, `rejected`, `review`, `screen`, `new`, `onboarding`, `created`, `accepted`, `short_list`, `approved` |
| `AssessmentTypeEnum` | `responsibilities`, `skills`, `benefits`, `company_overview`, `description`, `other` |
| `AtsDocumentTypeEnum` | `resume`, `avatar`, `cover_letter`, `profile_picture`, `policy`, `passport`, `assessment`, `interview_attachment`, `take_home_test`, `offer_letter`, `signed_offer_letter`, `national_id`, `offer_packet`, `other` |
| `AtsDocumentsUploadCategoryEnumApiModel` | `resume`, `avatar`, `cover_letter`, `profile_picture`, `policy`, `passport`, `assessment`, `interview_attachment`, `take_home_test`, `offer_letter`, `signed_offer_letter`, `national_id`, `offer_packet`, `other` |
| `AtsJobStatusEnum` | `published`, `draft`, `pending`, `internal`, `archived`, `closed`, `open`, `deleted`, `on_hold` |
| `AttachmentContentType` | `text`, `pdf`, `video`, `other` |
| `CompensationTypeEnum` | `salary`, `hourly`, `commission`, `bonus`, `equity`, `other` |
| `ConditionTypeEnum` | `equals_to`, `contains` |
| `ConfidentialEnumApiModel` | `true`, `false` |
| `CustomFieldTypeEnum` | `date`, `float`, `integer`, `list`, `checkbox`, `text`, `boolean`, `single_select`, `multi_select`, `url`, `other` |
| `EmploymentContractTypeEnum` | `full_time`, `shifts`, `part_time` |
| `EmploymentTypeEnum` | `contractor`, `intern`, `permanent`, `apprentice`, `freelance`, `terminated`, `temporary`, `seasonal`, `volunteer`, `probation`, `internal`, `external`, `expatriate`, `employer_of_record`, `casual`, `Programme` |
| `FileFormatEnum` | `ez`, `aw`, `atom`, `atomcat`, `atomdeleted`, `atomsvc`, `dwd`, `held`, `rsat`, `bdoc`, `xcs`, `ccxml`, `cdfx`, `cdmia`, `cdmic`, `cdmid`, `cdmio`, `cdmiq`, `cu`, `mpd`, `davmount`, `dbk`, `dssc`, `xdssc`, `es`, `ecma`, `emma`, `emotionml`, `epub`, `exi`, `exp`, `fdt`, `pfr`, `geojson`, `gml`, `gpx`, `gxf`, `gz`, `hjson`, `stk`, `ink`, `inkml`, `ipfix`, `its`, `jar`, `war`, `ear`, `ser`, `class`, `js`, `mjs`, `json`, `map`, `json5`, `jsonml`, `jsonld`, `lgr`, `lostxml`, `hqx`, `cpt`, `mads`, `webmanifest`, `mrc`, `mrcx`, `ma`, `nb`, `mb`, `mathml`, `mbox`, `mscml`, `metalink`, `meta4`, `mets`, `maei`, `musd`, `mods`, `m21`, `mp21`, `mp4s`, `m4p`, `doc`, `dot`, `mxf`, `nq`, `nt`, `cjs`, `bin`, `dms`, `lrf`, `mar`, `so`, `dist`, `distz`, `pkg`, `bpk`, `dump`, `elc`, `deploy`, `exe`, `dll`, `deb`, `dmg`, `iso`, `img`, `msi`, `msp`, `msm`, `buffer`, `oda`, `opf`, `ogx`, `omdoc`, `onetoc`, `onetoc2`, `onetmp`, `onepkg`, `oxps`, `relo`, `xer`, `pdf`, `pgp`, `asc`, `sig`, `prf`, `p10`, `p7m`, `p7c`, `p7s`, `p8`, `ac`, `cer`, `crl`, `pkipath`, `pki`, `pls`, `ai`, `eps`, `ps`, `provx`, `pskcxml`, `raml`, `rdf`, `owl`, `rif`, `rnc`, `rl`, `rld`, `rs`, `rapd`, `sls`, `rusd`, `gbr`, `mft`, `roa`, `rsd`, `rss`, `rtf`, `sbml`, `scq`, `scs`, `spq`, `spp`, `sdp`, `senmlx`, `sensmlx`, `setpay`, `setreg`, `shf`, `siv`, `sieve`, `smi`, `smil`, `rq`, `srx`, `gram`, `grxml`, `sru`, `ssdl`, `ssml`, `swidtag`, `tei`, `teicorpus`, `tfi`, `tsd`, `toml`, `trig`, `ttml`, `ubj`, `rsheet`, `td`, `vxml`, `wasm`, `wgt`, `hlp`, `wsdl`, `wspolicy`, `xaml`, `xav`, `xca`, `xdf`, `xel`, `xns`, `xenc`, `xhtml`, `xht`, `xlf`, `xml`, `xsl`, `xsd`, `rng`, `dtd`, `xop`, `xpl`, `*xsl`, `xslt`, `xspf`, `mxml`, `xhvml`, `xvml`, `xvm`, `yang`, `yin`, `zip`, `*3gpp`, `adp`, `amr`, `au`, `snd`, `mid`, `midi`, `kar`, `rmi`, `mxmf`, `*mp3`, `m4a`, `mp4a`, `mpga`, `mp2`, `mp2a`, `mp3`, `m2a`, `m3a`, `oga`, `ogg`, `spx`, `opus`, `s3m`, `sil`, `wav`, `*wav`, `weba`, `xm`, `ttc`, `otf`, `ttf`, `woff`, `woff2`, `exr`, `apng`, `avif`, `bmp`, `cgm`, `drle`, `emf`, `fits`, `g3`, `gif`, `heic`, `heics`, `heif`, `heifs`, `hej2`, `hsj2`, `ief`, `jls`, `jp2`, `jpg2`, `jpeg`, `jpg`, `jpe`, `jph`, `jhc`, `jpm`, `jpx`, `jpf`, `jxr`, `jxra`, `jxrs`, `jxs`, `jxsc`, `jxsi`, `jxss`, `ktx`, `ktx2`, `png`, `sgi`, `svg`, `svgz`, `t38`, `tif`, `tiff`, `tfx`, `webp`, `wmf`, `disposition-notification`, `u8msg`, `u8dsn`, `u8mdn`, `u8hdr`, `eml`, `mime`, `3mf`, `gltf`, `glb`, `igs`, `iges`, `msh`, `mesh`, `silo`, `mtl`, `obj`, `stpx`, `stpz`, `stpxz`, `stl`, `wrl`, `vrml`, `*x3db`, `x3dbz`, `x3db`, `*x3dv`, `x3dvz`, `x3d`, `x3dz`, `x3dv`, `appcache`, `manifest`, `ics`, `ifb`, `coffee`, `litcoffee`, `css`, `csv`, `html`, `htm`, `shtml`, `jade`, `jsx`, `less`, `markdown`, `md`, `mml`, `mdx`, `n3`, `txt`, `text`, `conf`, `def`, `list`, `log`, `in`, `ini`, `rtx`, `*rtf`, `sgml`, `sgm`, `shex`, `slim`, `slm`, `spdx`, `stylus`, `styl`, `tsv`, `t`, `tr`, `roff`, `man`, `me`, `ms`, `ttl`, `uri`, `uris`, `urls`, `vcard`, `vtt`, `*xml`, `yaml`, `yml`, `3gp`, `3gpp`, `3g2`, `h261`, `h263`, `h264`, `m4s`, `jpgv`, `*jpm`, `jpgm`, `mj2`, `mjp2`, `ts`, `mp4`, `mp4v`, `mpg4`, `mpeg`, `mpg`, `mpe`, `m1v`, `m2v`, `ogv`, `qt`, `mov`, `webm`, `cww`, `1km`, `plb`, `psb`, `pvb`, `tcap`, `pwn`, `aso`, `imp`, `acu`, `atc`, `acutc`, `air`, `fcdt`, `fxp`, `fxpl`, `xdp`, `xfdf`, `ahead`, `azf`, `azs`, `azw`, `acc`, `ami`, `apk`, `cii`, `fti`, `atx`, `mpkg`, `key`, `m3u8`, `numbers`, `pages`, `pkpass`, `swi`, `iota`, `aep`, `bmml`, `mpm`, `bmi`, `rep`, `cdxml`, `mmd`, `cdy`, `csl`, `cla`, `rp9`, `c4g`, `c4d`, `c4f`, `c4p`, `c4u`, `c11amc`, `c11amz`, `csp`, `cdbcmsg`, `cmc`, `clkx`, `clkk`, `clkp`, `clkt`, `clkw`, `wbs`, `pml`, `ppd`, `car`, `pcurl`, `dart`, `rdz`, `dbf`, `uvf`, `uvvf`, `uvd`, `uvvd`, `uvt`, `uvvt`, `uvx`, `uvvx`, `uvz`, `uvvz`, `fe_launch`, `dna`, `mlp`, `mle`, `dpg`, `dfac`, `kpxx`, `ait`, `svc`, `geo`, `mag`, `nml`, `esf`, `msf`, `qam`, `slt`, `ssf`, `es3`, `et3`, `ez2`, `ez3`, `fdf`, `mseed`, `seed`, `dataless`, `gph`, `ftc`, `fm`, `frame`, `maker`, `book`, `fnc`, `ltf`, `fsc`, `oas`, `oa2`, `oa3`, `fg5`, `bh2`, `ddd`, `xdw`, `xbd`, `fzs`, `txd`, `ggb`, `ggt`, `gex`, `gre`, `gxt`, `g2w`, `g3w`, `gmx`, `gdoc`, `gslides`, `gsheet`, `kml`, `kmz`, `gqf`, `gqs`, `gac`, `ghf`, `gim`, `grv`, `gtm`, `tpl`, `vcg`, `hal`, `zmm`, `hbci`, `les`, `hpgl`, `hpid`, `hps`, `jlt`, `pcl`, `pclxl`, `sfd-hdstx`, `mpy`, `afp`, `listafp`, `list3820`, `irm`, `sc`, `icc`, `icm`, `igl`, `ivp`, `ivu`, `igm`, `xpw`, `xpx`, `i2g`, `qbo`, `qfx`, `rcprofile`, `irp`, `xpr`, `fcs`, `jam`, `rms`, `jisp`, `joda`, `ktz`, `ktr`, `karbon`, `chrt`, `kfo`, `flw`, `kon`, `kpr`, `kpt`, `ksp`, `kwd`, `kwt`, `htke`, `kia`, `kne`, `knp`, `skp`, `skd`, `skt`, `skm`, `sse`, `lasxml`, `lbd`, `lbe`, `apr`, `pre`, `nsf`, `org`, `scm`, `lwp`, `portpkg`, `mvt`, `mcd`, `mc1`, `cdkey`, `mwf`, `mfm`, `flo`, `igx`, `mif`, `daf`, `dis`, `mbk`, `mqy`, `msl`, `plc`, `txf`, `mpn`, `mpc`, `xul`, `cil`, `cab`, `xls`, `xlm`, `xla`, `xlc`, `xlt`, `xlw`, `xlam`, `xlsb`, `xlsm`, `xltm`, `eot`, `chm`, `ims`, `lrm`, `thmx`, `msg`, `cat`, `*stl`, `ppt`, `pps`, `pot`, `ppam`, `pptm`, `sldm`, `ppsm`, `potm`, `mpp`, `mpt`, `docm`, `dotm`, `wps`, `wks`, `wcm`, `wdb`, `wpl`, `xps`, `mseq`, `mus`, `msty`, `taglet`, `nlu`, `ntf`, `nitf`, `nnd`, `nns`, `nnw`, `*ac`, `ngdat`, `n-gage`, `rpst`, `rpss`, `edm`, `edx`, `ext`, `odc`, `otc`, `odb`, `odf`, `odft`, `odg`, `otg`, `odi`, `oti`, `odp`, `otp`, `ods`, `ots`, `odt`, `odm`, `ott`, `oth`, `xo`, `dd2`, `obgx`, `oxt`, `osm`, `pptx`, `sldx`, `ppsx`, `potx`, `xlsx`, `xltx`, `docx`, `dotx`, `mgp`, `dp`, `esa`, `pdb`, `pqa`, `oprc`, `paw`, `str`, `ei6`, `efif`, `wg`, `plf`, `pbd`, `box`, `mgz`, `qps`, `ptid`, `qxd`, `qxt`, `qwd`, `qwt`, `qxl`, `qxb`, `rar`, `bed`, `mxl`, `musicxml`, `cryptonote`, `cod`, `rm`, `rmvb`, `link66`, `st`, `see`, `sema`, `semd`, `semf`, `ifm`, `itp`, `iif`, `ipk`, `twd`, `twds`, `mmf`, `teacher`, `fo`, `sdkm`, `sdkd`, `dxp`, `sfs`, `sdc`, `sda`, `sdd`, `smf`, `sdw`, `vor`, `sgl`, `smzip`, `sm`, `wadl`, `sxc`, `stc`, `sxd`, `std`, `sxi`, `sti`, `sxm`, `sxw`, `sxg`, `stw`, `sus`, `susp`, `svd`, `sis`, `sisx`, `xsm`, `bdm`, `xdm`, `ddf`, `tao`, `pcap`, `cap`, `dmp`, `tmo`, `tpt`, `mxs`, `tra`, `ufd`, `ufdl`, `utz`, `umj`, `unityweb`, `uoml`, `vcx`, `vsd`, `vst`, `vss`, `vsw`, `vis`, `vsf`, `wbxml`, `wmlc`, `wmlsc`, `wtb`, `nbp`, `wpd`, `wqd`, `stf`, `xar`, `xfdl`, `hvd`, `hvs`, `hvp`, `osf`, `osfpvg`, `saf`, `spf`, `cmp`, `zir`, `zirz`, `zaz`, `7z`, `abw`, `ace`, `*dmg`, `arj`, `aab`, `x32`, `u32`, `vox`, `aam`, `aas`, `bcpio`, `*bdoc`, `torrent`, `blb`, `blorb`, `bz`, `bz2`, `boz`, `cbr`, `cba`, `cbt`, `cbz`, `cb7`, `vcd`, `cfs`, `chat`, `pgn`, `crx`, `cco`, `nsc`, `cpio`, `csh`, `*deb`, `udeb`, `dgc`, `dir`, `dcr`, `dxr`, `cst`, `cct`, `cxt`, `w3d`, `fgd`, `swa`, `wad`, `ncx`, `dtb`, `res`, `dvi`, `evy`, `eva`, `bdf`, `gsf`, `psf`, `pcf`, `snf`, `pfa`, `pfb`, `pfm`, `afm`, `arc`, `spl`, `gca`, `ulx`, `gnumeric`, `gramps`, `gtar`, `hdf`, `php`, `install`, `*iso`, `*key`, `*numbers`, `*pages`, `jardiff`, `jnlp`, `kdbx`, `latex`, `luac`, `lzh`, `lha`, `run`, `mie`, `prc`, `mobi`, `application`, `lnk`, `wmd`, `wmz`, `xbap`, `mdb`, `obd`, `crd`, `clp`, `*exe`, `*dll`, `com`, `bat`, `*msi`, `mvb`, `m13`, `m14`, `*wmf`, `*wmz`, `*emf`, `emz`, `mny`, `pub`, `scd`, `trm`, `wri`, `nc`, `cdf`, `pac`, `nzb`, `pl`, `pm`, `*prc`, `*pdb`, `p12`, `pfx`, `p7b`, `spc`, `p7r`, `*rar`, `rpm`, `ris`, `sea`, `sh`, `shar`, `swf`, `xap`, `sql`, `sit`, `sitx`, `srt`, `sv4cpio`, `sv4crc`, `t3`, `gam`, `tar`, `tcl`, `tk`, `tex`, `tfm`, `texinfo`, `texi`, `*obj`, `ustar`, `hdd`, `ova`, `ovf`, `vbox`, `vbox-extpack`, `vdi`, `vhd`, `vmdk`, `src`, `webapp`, `der`, `crt`, `pem`, `fig`, `*xlf`, `xpi`, `xz`, `z1`, `z2`, `z3`, `z4`, `z5`, `z6`, `z7`, `z8`, `uva`, `uvva`, `eol`, `dra`, `dts`, `dtshd`, `lvp`, `pya`, `ecelp4800`, `ecelp7470`, `ecelp9600`, `rip`, `aac`, `aif`, `aiff`, `aifc`, `caf`, `flac`, `*m4a`, `mka`, `m3u`, `wax`, `wma`, `ram`, `ra`, `rmp`, `*ra`, `cdx`, `cif`, `cmdf`, `cml`, `csml`, `xyz`, `btif`, `pti`, `psd`, `azv`, `uvi`, `uvvi`, `uvg`, `uvvg`, `djvu`, `djv`, `*sub`, `dwg`, `dxf`, `fbs`, `fpx`, `fst`, `mmr`, `rlc`, `ico`, `dds`, `mdi`, `wdp`, `npx`, `b16`, `tap`, `vtf`, `wbmp`, `xif`, `pcx`, `3ds`, `ras`, `cmx`, `fh`, `fhc`, `fh4`, `fh5`, `fh7`, `*ico`, `jng`, `sid`, `*bmp`, `*pcx`, `pic`, `pct`, `pnm`, `pbm`, `pgm`, `ppm`, `rgb`, `tga`, `xbm`, `xpm`, `xwd`, `wsc`, `dae`, `dwf`, `gdl`, `gtw`, `mts`, `ogex`, `x_b`, `x_t`, `vds`, `usdz`, `bsp`, `vtu`, `dsc`, `curl`, `dcurl`, `mcurl`, `scurl`, `sub`, `fly`, `flx`, `gv`, `3dml`, `spot`, `jad`, `wml`, `wmls`, `s`, `asm`, `c`, `cc`, `cxx`, `cpp`, `h`, `hh`, `dic`, `htc`, `f`, `for`, `f77`, `f90`, `hbs`, `java`, `lua`, `mkd`, `nfo`, `opml`, `*org`, `p`, `pas`, `pde`, `sass`, `scss`, `etx`, `sfv`, `ymp`, `uu`, `vcs`, `vcf`, `uvh`, `uvvh`, `uvm`, `uvvm`, `uvp`, `uvvp`, `uvs`, `uvvs`, `uvv`, `uvvv`, `dvb`, `fvt`, `mxu`, `m4u`, `pyv`, `uvu`, `uvvu`, `viv`, `f4v`, `fli`, `flv`, `m4v`, `mkv`, `mk3d`, `mks`, `mng`, `asf`, `asx`, `vob`, `wm`, `wmv`, `wmx`, `wvx`, `avi`, `movie`, `smv`, `ice`, `mht` |
| `InterviewStatusEnum` | `unscheduled`, `scheduled`, `completed`, `cancelled`, `pending_feedback` |
| `InterviewTypeEnum` | `screening`, `lunch`, `on_site`, `presentation`, `sell`, `culture`, `informal`, `test`, `phone`, `video` |
| `JobPostingStatusEnum` | `live`, `draft`, `pending`, `internal`, `rejected`, `closed`, `archived` |
| `ListTypeEnum` | `candidates`, `contacts`, `companies` |
| `NotesVisibilityEnum` | `private`, `public` |
| `OfferStatusEnum` | `pending`, `retracted`, `accepted`, `rejected`, `created`, `approved`, `not_approved` |
| `PayFrequencyEnum` | `hourly`, `weekly`, `bi_weekly`, `four_weekly`, `semi_monthly`, `monthly`, `bi_monthly`, `quarterly`, `semi_annually`, `yearly`, `thirteen_monthly`, `pro_rata`, `half_yearly`, `daily` |
| `PayPeriodEnum` | `hour`, `day`, `week`, `every_two_weeks`, `month`, `twice_a_month`, `every_two_months`, `quarter`, `every_six_months`, `year`, `one_off`, `none` |
| `QuestionsTypeEnum` | `short_text`, `long_text`, `attachment`, `multi_select`, `single_select`, `boolean`, `number`, `date`, `video`, `reference_check`, `url` |
| `RejectedReasonTypeEnum` | `rejected_by_candidate`, `rejected_by_organization`, `other`, `unknown` |
| `ResultEnum` | `initiated`, `in_progress`, `cancelled`, `completed`, `expired`, `failed`, `passed` |
