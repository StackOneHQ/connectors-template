# Marketing Automation — Schema Reference

> Manage campaigns, email templates, contacts and push/SMS.

> **OAS source:** `https://docs.stackone.com/marketing/api-reference/marketing.json`

---

## Endpoints

| Method | Path | Summary |
|--------|------|---------|
| `GET` | `/unified/marketing/templates/email` | List Email Templates |
| `POST` | `/unified/marketing/templates/email` | Create Email Templates |
| `GET` | `/unified/marketing/templates/email/{id}` | Get Email Templates |
| `PATCH` | `/unified/marketing/templates/email/{id}` | Update Email Templates |
| `GET` | `/unified/marketing/templates/in_app` | List In-App Templates |
| `POST` | `/unified/marketing/templates/in_app` | Create In-App Template |
| `GET` | `/unified/marketing/templates/in_app/{id}` | Get In-App Template |
| `PATCH` | `/unified/marketing/templates/in_app/{id}` | Update In-App Template |
| `GET` | `/unified/marketing/templates/sms` | List SMS Templates |
| `POST` | `/unified/marketing/templates/sms` | Create SMS Template |
| `GET` | `/unified/marketing/templates/sms/{id}` | Get SMS Template |
| `PATCH` | `/unified/marketing/templates/sms/{id}` | Update SMS Template |
| `GET` | `/unified/marketing/templates/omni_channel` | List Omni-Channel Templates |
| `POST` | `/unified/marketing/templates/omni_channel` | Create Omni-Channel Template |
| `GET` | `/unified/marketing/templates/omni_channel/{id}` | Get Omni-Channel Template |
| `PATCH` | `/unified/marketing/templates/omni_channel/{id}` | Update Omni-Channel Template |
| `GET` | `/unified/marketing/templates/push` | List Push Templates |
| `POST` | `/unified/marketing/templates/push` | Create Push Template |
| `GET` | `/unified/marketing/templates/push/{id}` | Get Push Template |
| `PATCH` | `/unified/marketing/templates/push/{id}` | Update Push Template |
| `GET` | `/unified/marketing/campaigns` | List campaigns |
| `GET` | `/unified/marketing/campaigns/{id}` | Get campaign |
| `GET` | `/unified/marketing/content_blocks` | List Content Blocks |
| `POST` | `/unified/marketing/content_blocks` | Create Content Block |
| `GET` | `/unified/marketing/content_blocks/{id}` | Get Content Blocks |
| `PATCH` | `/unified/marketing/content_blocks/{id}` | Update Content Block |

---

## Models

### `Campaign`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `created_at` | `string` | The created_at date |
| `updated_at` | `string` | The updated_at date |
| `description` | `string` |  |
| `schedule_type` | `ScheduleTypeEnum` | The schedule type |
| `status` | `StatusEnum` | Status of the Campaign |
| `archived` | `object` |  |
| `draft` | `object` |  |
| `channels` | `array<ChannelsEnum>` | channels of the Campaign |
| `first_sent_at` | `string` | The first_sent_at date |
| `last_sent_at` | `string` | The last_sent_at date |
| `tags` | `array<string>` |  |
| `messages` | `array<Message>` |  |

### `ContentBlock`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `tags` | `array<string>` |  |
| `content` | `string` |  |
| `type` | `ContentBlockTypeEnumApiModel` | Stackone enum identifying the type of content block. |
| `status` | `ContentBlockStatusEnumApiModel` | Stackone enum identifying the status of content block. |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |

### `CreateMessage`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` |  |
| `message_type` | `MessageTypeEnum` | Stackone enum identifying the type of message associated with the content. |
| `message_content` | `object` |  |

### `EmailMessageContents`
| Field | Type | Description |
|-------|------|-------------|
| `subject` | `string` |  |
| `body` | `string` |  |
| `from` | `string` |  |
| `reply-to` | `string` |  |
| `preheader` | `string` |  |

### `EmailMessages`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `message_type` | `MessageTypeEnum` |  |
| `message_content` | `EmailMessageContents` |  |

### `EmailTemplate`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `tags` | `array<string>` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |
| `messages` | `array<EmailMessages>` |  |

### `InAppMessageContents`
| Field | Type | Description |
|-------|------|-------------|
| `body` | `string` |  |

### `InAppMessages`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `message_type` | `MessageTypeEnum` |  |
| `message_content` | `InAppMessageContents` |  |

### `InAppTemplate`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `tags` | `array<string>` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |
| `messages` | `array<InAppMessages>` |  |

### `Message`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `message_type` | `MessageTypeEnum` | Stackone enum identifying the type of message associated with the content. |
| `message_content` | `object` |  |

### `ProviderError`
| Field | Type | Description |
|-------|------|-------------|
| `status` | `number` | HTTP status code of the provider error |
| `url` | `string` | URL that caused the error |
| `raw` | `object` | Raw error response from the provider |
| `headers` | `object` | Response headers |

### `PushMessageContents`
| Field | Type | Description |
|-------|------|-------------|
| `title` | `string` |  |
| `subtitle` | `string` |  |
| `body` | `string` |  |

### `PushMessages`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `message_type` | `MessageTypeEnum` |  |
| `message_content` | `PushMessageContents` |  |

### `PushTemplate`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `tags` | `array<string>` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |
| `messages` | `array<PushMessages>` |  |

### `SmsMessageContents`
| Field | Type | Description |
|-------|------|-------------|
| `body` | `string` |  |
| `from` | `string` |  |

### `SmsMessages`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `message_type` | `MessageTypeEnum` |  |
| `message_content` | `SmsMessageContents` |  |

### `SmsTemplate`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `tags` | `array<string>` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |
| `messages` | `array<SmsMessages>` |  |

### `Template`
| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `remote_id` | `string` | Provider's unique identifier |
| `name` | `string` |  |
| `tags` | `array<string>` |  |
| `created_at` | `string` | Date of creation |
| `updated_at` | `string` | Date of last update |

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
| `ChannelsEnum` | `email`, `sms`, `web_push`, `ios_push`, `android_push`, `unknown` |
| `ContentBlockStatusEnumApiModel` | `draft`, `live`, `archived` |
| `ContentBlockTypeEnumApiModel` | `text`, `html`, `image`, `code-snippet` |
| `MessageTypeEnum` | `email`, `sms`, `push`, `web_push`, `ios_push`, `android_push`, `app_push`, `omni_channel`, `content_block`, `in_app`, `unknown` |
| `ScheduleTypeEnum` | `immediate`, `scheduled`, `recurring`, `custom`, `triggered` |
| `StatusEnum` | `draft`, `archived`, `live` |
