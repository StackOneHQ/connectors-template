# StackOne Unified Schemas — Category Index

Quick index of all StackOne unification categories. When a builder chooses a category, load the corresponding file from `references/schemas/` — do not load all files at once.

---

## Categories

| Category | File | Key Resources | Use Cases |
|----------|------|--------------|-----------|
| `hris` | `schemas/hris.md` | employees, employments, departments, locations, groups, benefits, cost_centers, jobs, shifts | HR data sync, workforce management, payroll |
| `ats` | `schemas/ats.md` | jobs, candidates, applications, interviews, offers, departments | Recruiting workflows, applicant tracking |
| `crm` | `schemas/crm.md` | contacts, accounts, lists, activities | Sales pipelines, customer data |
| `lms` | `schemas/lms.md` | courses, content, users, completions, enrollments | Learning management, training tracking |
| `iam` | `schemas/iam.md` | users, groups, roles, permissions | Identity and access management |
| `ticketing` | `schemas/ticketing.md` | tickets, projects, collections, users | Support desk, project tracking |
| `documents` | `schemas/documents.md` | files, folders, drives | Document storage, file management |
| `marketing` | `schemas/marketing.md` | campaigns, email_templates, contacts, push, sms | Marketing automation, campaign management |
| `accounting` | `schemas/accounting.md` | accounts, transactions, contacts, ledger_accounts | Financial data, accounting integrations |

---

## How to use this index

1. Show the builder the table above to help them identify the right category.
2. Once they choose (e.g., `hris`), read **only** `${CLAUDE_PLUGIN_ROOT}/references/schemas/hris.md`.
3. Use the loaded file's **Endpoints** section to show available API operations.
4. Use the **Models** section to show schema fields for each resource.
5. Use the **Enums** section when helping with field mapping for enum-type fields.

Do not load multiple schema files at once — each file is comprehensive and loading only the chosen category keeps context focused.
