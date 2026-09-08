# Anatomy release — approval required

Nothing in this plan has been applied to production. Do not push main, deploy the
Edge Function, run SQL, or edit the finance Sheet until the owner approves.

## Rollback baseline

- Branch at start: `main`; working tree was clean.
- Stable commit: `f01a7ffa77f136f09c63c237554c95f08cfb5c60`.
- Local tag: `stable-before-anatomy-2026-09-08`.
- Local branch: `backup/stable-before-anatomy-2026-09-08`.
- These safety references have not been pushed. Main has not been committed or pushed.

## Read-only catalog findings

Live finance source: https://docs.google.com/spreadsheets/d/18Gj3M9QqC0DA2DAdm8HmuO7Ghl7jQnVTlvTNveVN2D8/edit

No matching Sajad lecturer, new course/package names, or six proposed website IDs
were found in the inspected live finance and Supabase catalogs. Existing finance
course `CRS028 Anatomy` is unrelated and must remain untouched.

The observed highest finance IDs were LEC021, CRS038 and PKG011. The following
IDs are **proposed, not reserved**. Immediately before inserting, repeat the
collision/name checks and resolve one canonical lecturer using the existing ID
convention. If another process has taken an ID, stop and revise this plan; never
overwrite or silently reuse an unrelated record.

## New finance rows only

### Lecturers: one row

Proposed ID `LEC022`; name `Sajad Abdul Aziz Khalifa`; Course `Anatomy`;
Agreement Type `Percentage`; Agreement Value numeric `0.8`; Status `Active`.
This represents 80% of Actual Paid, not 80% of the Lecturer Pool. His entitlement
is the entire Lecturer Pool. Leave unknown contact/contract dates blank; do not
invent them. Website lecturer key is `sajad`, distinct from the finance ID.

### Courses: three rows

| Proposed finance ID | Website Course ID | Course Name | Arabic Name | Standalone Price IQD |
| --- | --- | --- | --- | ---: |
| CRS039 | anatomy-upper | Upper Limb Anatomy | تشريح الطرف العلوي | 35000 |
| CRS040 | anatomy-lower | Lower Limb Anatomy | تشريح الطرف السفلي | 30000 |
| CRS041 | anatomy-thorax | Thorax Anatomy | تشريح الصدر | 25000 |

Each: Academic Stage `1`, Stages (Full List) `1`, Main Lecturer exactly
`Sajad Abdul Aziz Khalifa`, Active / Inactive `Active`. Upper Limb Notes:
`Includes Introduction to Anatomy`. Follow existing category conventions;
do not create a new category or modify category logic.

### Packages: three rows

| Proposed finance ID | Website Package ID | Package Name | Component finance IDs | Normal IQD | Selling IQD | Saving IQD |
| --- | --- | --- | --- | ---: | ---: | ---: |
| PKG012 | anatomy-ul-ll | Upper Limb + Lower Limb | CRS039,CRS040 | 65000 | 60000 | 5000 |
| PKG013 | anatomy-ll-thorax | Lower Limb + Thorax | CRS040,CRS041 | 55000 | 50000 | 5000 |
| PKG014 | anatomy-complete | Upper Limb + Lower Limb + Thorax | CRS039,CRS040,CRS041 | 90000 | 80000 | 10000 |

Arabic names respectively: `الطرف العلوي + الطرف السفلي`, `الطرف السفلي + الصدر`,
`بكج التشريح الكامل`. Each: Academic Stage `1`, Active `Active`, Offer Eligible
using the existing eligible value. Preserve existing automatic formula columns;
extend existing formulas into new rows only, with correct relative references.

### Package Courses: seven rows

Insert the seven package/course pairs listed above. Status `Active`. Leave
Internal Package Allocation IQD **blank**, not zero: these rows describe content
only, following the existing Radiology pattern. Populate automatic name, price,
lecturer and stage columns using the existing formulas for the new rows only.

### Package Lecturer Allocation: three rows

One row per PKG012, PKG013 and PKG014, all with Lecturer ID `LEC022`, Lecturer
Name `Sajad Abdul Aziz Khalifa`, Course `Anatomy`, Share of Lecturer Pool numeric
`1` (100%), Status `Active`. Use the approved activation date as Effective From
and leave Effective To blank. Extend existing automatic formulas only into these
new rows. Check each package's active allocation total is exactly 100%.

No existing lecturer, product, allocation, formula or global setting is changed.
Do not run setup/reset/rebuild scripts as part of seeding. Inspect existing formula
coverage for the appended rows before activation. Prices must be explicitly seeded:
the inspected catalog webhook updates existing records, not missing records, and
does not populate all course prices. A broad sync_catalog is not the seed migration
and would update unrelated catalog metadata/timestamps; do not run it for this step.

## Approval-gated execution order

1. Recheck clean release diff, remote HEAD, ID collisions and finance formulas.
   Preserve the safety references remotely and take an approved Sheet backup before
   live writes. Stop if the baseline or catalog has changed unexpectedly.
2. Add only the new finance rows above. Read them back and verify all six website-ID
   mappings, prices, seven components, canonical lecturer and three 100% allocations.
   Confirm existing Actual Paid split remains 10% / 10% / 80% without editing it.
3. Run `anatomy-stage1-prepare.sql`: one lecturer, three courses, three packages and
   seven components in one transaction. Products are DISABLED. Collision aborts.
4. Deploy the reviewed finance Edge Function allowlist extension using the existing
   workflow. Only the three new package keys are added to CONTENT_ONLY_PACKAGES;
   their component amount fields are omitted, as for Radiology. No Apps Script,
   payment, reconciliation, earnings or global split code changes are required.
5. Commit and deploy the reviewed website changes through the existing main/origin
   workflow. Finance must already be ready because the built-in fallback includes
   these products. Verify deployed scripts and portrait before activation.
6. After independent finance verification, run `anatomy-stage1-activate.sql`.
   It checks the expected six products and seven components, then enables only
   those six products. SQL cannot verify Google Sheets; that gate is manual.
7. Read back live Supabase and finance rows; verify production Stage 1 and other
   stages, profile/portrait, all six cart items, prices and duplicates. Check existing
   promo behavior without inventing promo rules or creating a paid test order.

## Rollback after an approved release

First disable ONLY these six Supabase records (`enabled = false`) to stop new
purchases. Revert the Anatomy website release commit through the existing workflow
to restore the baseline storefront, including its fallback. Do not force-push main.
The baseline can be inspected with `git show stable-before-anatomy-2026-09-08`.

Do not delete finance IDs, allocations, catalog records, orders or lecturer earnings
after any purchase: preserve them for historical reporting/reconciliation. Leaving
the additive Edge allowlist in place is safe for historical Anatomy records. Any
rollback deployment needs explicit authorization. Before deployment, these local
changes can simply remain uncommitted for review; production is unchanged.

## Verification scope

Passed locally: JavaScript syntax, diff whitespace, all six fallback and simulated
Supabase products, exact prices/savings, Stage 1 classification, individual cart
adds, duplicate-add prevention, unchanged existing catalog objects and store
business functions. Promo transport was tested with a mock server, not a live
promo redemption. Browser Stage 1 showed three courses and three packages; their
portraits loaded. Stage 5 excluded all new Anatomy products. Lecturer page contained
one Sajad profile button; opening the profile was interrupted by a tool usage limit.

Production SQL, finance insertion, Edge deployment, live promo validation and
post-deployment verification remain pending approval. Proposed finance IDs are not
yet canonical live records.
