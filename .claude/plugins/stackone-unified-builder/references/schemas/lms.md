# LMS (Learning Management System) — Schema Reference

> Manage courses, content, enrollments and completions.

> **OAS source:** `https://docs.stackone.com/lms/api-reference/lms.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/lms/courses` | List Courses |
| `GET` | `/unified/lms/courses/{id}` | Get Course |
| `GET` | `/unified/lms/users/{id}/assignments` | List User Assignments |
| `POST` | `/unified/lms/users/{id}/assignments` | Create User Assignment |
| `GET` | `/unified/lms/users/{id}/assignments/{subResourceId}` | Get User Assignment |
| `POST` | `/unified/lms/content/batch` | Batch Upsert External Linking Learning Objects |
| `PUT` | `/unified/lms/content` | Upsert External Linking Learning Objects |
| `GET` | `/unified/lms/content` | List Content |
| `GET` | `/unified/lms/content/{id}` | Get Content |
| `GET` | `/unified/lms/users/{id}/completions` | List User Completions |
| `POST` | `/unified/lms/users/{id}/completions` | Create User Completion |
| `GET` | `/unified/lms/users/{id}/completions/{subResourceId}` | Get User Completion |
| `DELETE` | `/unified/lms/users/{id}/completions/{subResourceId}` | Delete User Completion |
| `GET` | `/unified/lms/completions` | List Completions |
| `GET` | `/unified/lms/completions/{id}` | Get Completion |
| `GET` | `/unified/lms/categories/{id}` | Get Category |
| `GET` | `/unified/lms/categories` | List Categories |
| `GET` | `/unified/lms/users` | List Users |
| `GET` | `/unified/lms/users/{id}` | Get User |
| `GET` | `/unified/lms/skills/{id}` | Get Skill |
| `GET` | `/unified/lms/skills` | List Skills |
| `GET` | `/unified/lms/assignments` | List Assignments |
| `GET` | `/unified/lms/assignments/{id}` | Get Assignment |

---

## Models

### `AdditionalData`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The name of the additional data field. Speak to your Solutions Engineer to understand the id for ... |
| `remote_id` | `string` | Provider's unique identifier |
| `value` | `object` | The value of the additional data |

### `Assignment`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this assignment |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `external_reference` | `string` | The external reference associated with this assignment |
| `learning_object_id` | `string` | The learning_object_id associated with this assignment. This is not required unless specified in ... |
| `remote_learning_object_id` | `string` | Provider's unique identifier of the learning object related to the assignment |
| `learning_object_external_reference` | `string` | The external reference of the learning object associated with this assignment, this is the main i... |
| `progress` | `number` | The progress associated with this assigment |
| `updated_at` | `string` | The date the assignment was last updated |
| `created_at` | `string` | The date the assignment was created |
| `assigned_at` | `string` | The date the assignment was assigned |
| `due_date` | `string` | The date the assignment is due to be completed |
| `status` | `AssignmentStatusEnum` | The status of the assignment |
| `learning_object_type` | `LearningObjectTypeEnum` | The learning object type of the assignment |
| `user_id` | `string` | The user ID associated with this assignment |
| `remote_user_id` | `string` | Provider's unique identifier of the user related to the assignment |
| `certificate_url` | `string` | The certification URL associated with this assignment |
| `result` | `ResultStatusEnum` | The result of the assignment |
| `completed_at` | `string` | The date the content was completed |
| `course_id` | `string` | The course ID associated with this assignment |
| `remote_course_id` | `string` | Provider's unique identifier of the course related to the assignment |

### `AuthorModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID of the author |
| `name` | `string` | The name of the author |

### `Category`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this category |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name associated with this category |
| `active` | `object` | Whether the category is active and therefore available for use |
| `hierarchy` | `CategoryLevelEnumModel` | The hierarchal level of the category |
| `level` | `CategoryLevelEnumModel` | The hierarchal level of the category |
| `language` | `LanguageEnum` | The language associated with this category |

### `Completion`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this completion |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `learning_object_external_reference` | `string` | The external reference of the learning object associated with this completion, this is the main i... |
| `external_reference` | `string` | The external reference associated with this completion |
| `result` | `ResultStatusEnum` | The result of the completion |
| `completed_at` | `string` | The date the content was completed |
| `created_at` | `string` | The created date of the completion |
| `updated_at` | `string` | The updated date of the completion |
| `learning_object_type` | `LearningObjectTypeEnum` | The learning object type of the completion |
| `learning_object_id` | `string` | The id of the learning object associated with this completion. This is not required unless specif... |
| `remote_learning_object_id` | `string` | Provider's unique identifier of the learning object related to the completion |
| `user_id` | `string` | The user ID associated with this completion |
| `remote_user_id` | `string` | Provider's unique identifier of the user related to the completion |
| `time_spent` | `string` | ISO 8601 duration format representing the time spent on completing the learning object |
| `certificate_url` | `string` | The certification URL associated with this completion |
| `external_id` | `string` | The external ID associated with this completion |
| `content_external_reference` | `string` | The external reference associated with this content |
| `remote_external_id` | `string` | Provider's unique identifier of the content external reference |
| `content_id` | `string` | The content ID associated with this completion |
| `remote_content_id` | `string` | Provider's unique identifier of the content associated with the completion |
| `course_id` | `string` | The course ID associated with this completion |
| `remote_course_id` | `string` | Provider's unique identifier of the course associated with the completion |
| `score` | `ScoreModel` | The score associated with this completion |

### `Content`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `external_reference` | `string` | The external ID associated with this content |
| `course_ids` | `array<string>` | The parent ID/IDs associated with this content |
| `remote_course_ids` | `array<string>` | Provider's unique identifier of the parent course ID associated with this content |
| `title` | `string` | The title of the content |
| `description` | `string` | The description of the content |
| `languages` | `array<LanguageEnum>` | The languages associated with this content |
| `content_url` | `string` | The external URL of the content |
| `mobile_launch_content_url` | `string` | The mobile friendly URL of the content |
| `content_type` | `ContentTypeEnum` | The type of content |
| `cover_url` | `string` | The URL of the thumbnail image associated with the content. |
| `active` | `object` | Whether the content is active and available for users. |
| `duration` | `string` | The duration of the content following the ISO8601 standard. If duration_unit is applicable we wil... |
| `categories` | `array<Category>` | The categories associated with this content |
| `skills` | `array<Skills>` | The skills associated with this course |
| `order` | `number` | The order of the individual content within a content grouping. This is not applicable for pushing... |
| `provider` | `string` | The name of the content provider |
| `short_description` | `string` | A short description or summary for the content |
| `localizations` | `array<LocalizationModel>` | Localised content information |
| `tags` | `array<string>` | A list of tags associated with the content |
| `authors` | `array<AuthorModel>` | The authors of the content |
| `updated_at` | `string` | The date on which the content was last updated. |
| `created_at` | `string` | The date on which the content was created. |

### `Course`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `external_reference` | `string` | The external ID associated with this course |
| `content_ids` | `array<string>` | The child ID/IDs associated with this course |
| `remote_content_ids` | `array<string>` | Provider's unique identifier of the child content IDs associated with this course |
| `title` | `string` | The title of the course |
| `description` | `string` | The description of the course |
| `languages` | `array<LanguageEnum>` | The languages associated with this course |
| `cover_url` | `string` | The URL of the thumbnail image associated with the course. |
| `url` | `string` | The redirect URL of the course. |
| `active` | `object` | Whether the course is active and available for users. |
| `duration` | `string` | The duration of the course following the ISO8601 standard. If duration_unit is applicable we will... |
| `categories` | `array<Category>` | The categories associated with this course |
| `skills` | `array<Skills>` | The skills associated with this course |
| `provider` | `string` | The name of the course provider |
| `authors` | `array<AuthorModel>` | The authors of the course |
| `updated_at` | `string` | The date on which the course was last updated. |
| `created_at` | `string` | The date on which the course was created. |

### `CreateCategoriesApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this category |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `name` | `string` | The name associated with this category |
| `hierarchy` | `CategoryLevelEnumModel` | The hierarchal level of the category |
| `level` | `CategoryLevelEnumModel` | The hierarchal level of the category |
| `language` | `LanguageEnum` | The language associated with this category |

### `CreateSkillsApiModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this skill |
| `name` | `string` | The name associated with this skill |
| `hierarchy` | `SkillLevelEnum` | The hierarchal level of the skill |
| `language` | `LanguageEnum` | The language associated with this skill |
| `level` | `SkillLevelEnum` | The hierarchal level of the skill |

### `LmsUser`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `unified_custom_fields` | `object` | Custom Unified Fields configured in your StackOne project |
| `external_reference` | `string` | The external ID associated with this user |
| `name` | `string` | The user name |
| `email` | `string` | The user email |
| `phone_number` | `string` | The user phone number |
| `active` | `object` | The user active status |
| `created_at` | `string` | The created_at date |
| `updated_at` | `string` | The updated_at date |

### `LocalizationModel`
| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` | The title of the content |
| `description` | `string` | The description of the content |
| `language` | `LanguageEnum` | The language associated with the localization details |
| `tags` | `array<string>` | The tags associated with the localization details |

### `ProviderError`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` | HTTP status code of the provider error |
| `url` | `string` | URL that caused the error |
| `raw` | `object` | Raw error response from the provider |
| `headers` | `object` | Response headers |

### `ScoreModel`
| Field | Type | Description |
|-------|------|-------------|
| `percentage` | `number` | The score percentage |
| `raw_value` | `string` | The raw string score value |

### `Skills`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | The ID associated with this skill |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` | The name associated with this skill |
| `active` | `object` | Whether the skill is active and therefore available for use |
| `hierarchy` | `SkillLevelEnum` | The hierarchal level of the skill |
| `language` | `LanguageEnum` | The language associated with this skill |
| `level` | `SkillLevelEnum` | The hierarchal level of the skill |

### `UnifiedError`
| Field | Type | Description |
|-------|------|-------------|
| `statusCode` | `number` | HTTP status code |
| `message` | `string` | Error message |
| `headers` | `object` | Response headers |

### `UpsertResultDataExternalReferenceModel`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `external_reference` | `string` | The external identifier |

---

## Enums

> **Note:** In API responses, enum fields are returned as objects with `value` (the unified enum value from the table below) and `source_value` (the raw provider value). For example: `{ "value": "pending", "source_value": "Pending" }`.

| Enum | Values |
|------|--------|
| `AssignmentStatusEnum` | `pending`, `in_progress`, `completed` |
| `CategoryLevelEnumModel` | `primary`, `secondary`, `tertiary` |
| `ContentTypeEnum` | `video`, `quiz`, `document`, `audio`, `article` |
| `LanguageEnum` | `ar_AR`, `aa_ER`, `af_NA`, `af_ZA`, `am_ET`, `ar_AE`, `ar_BH`, `ar_DJ`, `ar_DZ`, `ar_EG`, `ar_ER`, `ar_IQ`, `ar_JO`, `ar_KM`, `ar_KW`, `ar_LB`, `ar_LY`, `ar_MA`, `ar_MR`, `ar_OM`, `ar_PS`, `ar_QA`, `ar_SA`, `ar_SD`, `ar_SY`, `ar_TD`, `ar_TN`, `ar_YE`, `ay_BO`, `ay_PE`, `az_AZ`, `az_IR`, `be_BY`, `bg_BG`, `bi_VU`, `bn_BD`, `bn_IN`, `bs_BA`, `bs-ME`, `byn_ER`, `ca_AD`, `ca_ES`, `ca_FR`, `ca_IT`, `ch_GU`, `cs_CZ`, `da_DK`, `de_AT`, `de_BE`, `de_CH`, `de_DE`, `de_LI`, `de_LU`, `de_VA`, `de_MV`, `dv_MV`, `dz_BT`, `el_CY`, `el_GR`, `en_AG`, `en_AI`, `en_AS`, `en_AU`, `en_BB`, `en_BE`, `en_BM`, `en_BS`, `en_BW`, `en_BZ`, `en_CA`, `en_CC`, `en_CK`, `en_CM`, `en_CW`, `en_CX`, `en_DG`, `en_DM`, `en_ER`, `en_FJ`, `en_FK`, `en_FM`, `en_GB`, `en_GD`, `en_GG`, `en_GH`, `en_GI`, `en_GM`, `en_GS`, `en_GU`, `en_GY`, `en_HK`, `en_IE`, `en_IM`, `en_IN`, `en_IO`, `en_JE`, `en_JM`, `en_KE`, `en_KI`, `en_KN`, `en_KY`, `en_LC`, `en_LR`, `en_LS`, `en_MF`, `en_MG`, `en_MH`, `en_MO`, `en_MP`, `en_MS`, `en_MT`, `en_MU`, `en_MW`, `en_MY`, `en_NA`, `en_NF`, `en_NG`, `en_NL`, `en_NR`, `en_NU`, `en_NZ`, `en_PG`, `en_PH`, `en_PK`, `en_PN`, `en_PR`, `en_PW`, `en_RW`, `en_SB`, `en_SC`, `en_SD`, `en_SG`, `en_SH`, `en_SL`, `en_SS`, `en_SX`, `en_SZ`, `en_TC`, `en_TK`, `en_TO`, `en_TT`, `en_TV`, `en_TZ`, `en_UG`, `en_UM`, `en_US`, `en_VC`, `en_VG`, `en_VI`, `en_VU`, `en_WS`, `en_ZA`, `en_ZM`, `en_ZW`, `es_AR`, `es_BO`, `es_BZ`, `es_CL`, `es_CO`, `es_CR`, `es_CU`, `es_DO`, `es_EA`, `es_EC`, `es_EH`, `es_ES`, `es_GQ`, `es_GT`, `es_HN`, `es_IC`, `es_LA`, `es_MX`, `es_NI`, `es_PA`, `es_PE`, `es_PH`, `es_PR`, `es_PY`, `es_SV`, `es_US`, `es_UY`, `es_VE`, `et_EE`, `fa_AF`, `fa_IR`, `fan_GA`, `ff_CM`, `ff_GN`, `ff_MR`, `ff_SN`, `ff_BF`, `fi_FI`, `fj_FJ`, `fo_FO`, `fr_BE`, `fr_BF`, `fr_BI`, `fr_BJ`, `fr_BL`, `fr_CA`, `fr_CD`, `fr_CF`, `fr_CG`, `fr_CH`, `fr_CI`, `fr_CM`, `fr_DJ`, `fr_DZ`, `fr_FR`, `fr_GA`, `fr_GF`, `fr_GG`, `fr_GN`, `fr_GP`, `fr_GQ`, `fr_HT`, `fr_KM`, `fr_JE`, `fr_LU`, `fr_LB`, `fr_MA`, `fr_MC`, `fr_MF`, `fr_MG`, `fr_ML`, `fr_MQ`, `fr_MR`, `fr_MU`, `fr_NC`, `fr_NE`, `fr_PF`, `fr_PM`, `fr_RE`, `fr_RW`, `fr_SC`, `fr_SN`, `fr_SY`, `fr_TD`, `fr_TF`, `fr_TG`, `fr_TN`, `fr_VU`, `fr_VA`, `fr_WF`, `fr_YT`, `ga_IE`, `gn_PY`, `gn_AR`, `gu_IN`, `gv_IM`, `he_IL`, `hi_IN`, `hr_BA`, `hr_HR`, `hr_ME`, `ht_HT`, `hu_HU`, `hy_AM`, `hy_CY`, `id_ID`, `is_IS`, `it_CH`, `it_IT`, `it_SM`, `it_VA`, `ja_JP`, `ka_GE`, `kg_CD`, `kk_KZ`, `kl_GL`, `km_KH`, `ko_KP`, `ko_KR`, `ku_IQ`, `ky_KG`, `la_VA`, `lb_LU`, `ln_AO`, `ln_CD`, `ln_CF`, `ln_CG`, `lo_LA`, `lt_LT`, `lu_CD`, `lv_LV`, `mg_MG`, `mh_MH`, `mi_NZ`, `mk_MK`, `mn_MN`, `mr_IN`, `ms_BN`, `ms_MY`, `ms_SG`, `mt_MT`, `my_MM`, `nb_NO`, `nb_BV`, `nb_ZW`, `ne_NP`, `nl_AW`, `nl_BE`, `nl_BQ`, `nl_CW`, `nl_NL`, `nl_SR`, `nl_SX`, `nl_MF`, `nn_NO`, `nn_BV`, `no_NO`, `no_BV`, `no_SJ`, `nr_ZA`, `ny_MW`, `pa_IN`, `pa_PK`, `pl_PL`, `ps_AF`, `pt_AO`, `pt_BR`, `pt_CH`, `pt_CV`, `pt_GQ`, `pt_GW`, `pt_LU`, `pt_MO`, `pt_MZ`, `pt_PT`, `pt_ST`, `pt_TL`, `qu_BO`, `qu_EC`, `qu_PE`, `rar_CK`, `rm_CH`, `rup_MK`, `ro_MD`, `ro_RO`, `ru_BY`, `ru_KG`, `ru_KZ`, `ru_MD`, `ru_RU`, `ru_UA`, `ru_AQ`, `ru_TJ`, `ru_TM`, `ru_UZ`, `rw_RW`, `se_SE`, `sg_CF`, `si_LK`, `sk_SK`, `sl_SI`, `sm_AS`, `sm_WS`, `sn_ZW`, `so_DJ`, `so_ET`, `so_KE`, `so_SO`, `sq_AL`, `sq_ME`, `sq_XK`, `sr_BA`, `sr_ME`, `sr_RS`, `sr_XK`, `ss_SZ`, `ss_ZA`, `sv_AX`, `sv_FI`, `sv_SE`, `sw_KE`, `sw_TZ`, `sw_UG`, `sw_CD`, `ta_IN`, `ta_MY`, `ta_SG`, `ta_LK`, `te_IN`, `tg_TJ`, `th_TH`, `ti_ER`, `ti_ET`, `tig_ER`, `tk_TM`, `tk_AF`, `tn_BW`, `tn_ZA`, `to_TO`, `tr_CY`, `tr_TR`, `ts_ZA`, `uk_UA`, `ur_IN`, `ur_PK`, `uz_AF`, `uz_UZ`, `ve_ZA`, `vi_VN`, `xh_ZA`, `zh_CN`, `zh_HK`, `zh_MO`, `zh_SG`, `zh_TW`, `zu_ZA` |
| `LearningObjectTypeEnum` | `content`, `course`, `collection` |
| `ResultStatusEnum` | `Pass`, `Fail` |
| `SkillLevelEnum` | `primary`, `secondary`, `tertiary` |
| `WriteContentTypeEnum` | `video`, `quiz`, `document`, `audio`, `article`, `book`, `event`, `course`, `collection`, `interactive` |
