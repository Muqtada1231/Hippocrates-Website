# Hippocrates Website — Project Context

> This file is a compact source of truth for AI coding agents.  
> Read it before editing.  
> Do not repeat it back to the user.  
> For current implementation details, code and Git remain the primary source of truth.

## 1. Project overview

- **Hippocrates** is an Iraqi medical education platform.
- Production entry domain: <https://hippocrates.medgptx.com/>; verified on 2026-09-09 to redirect to <https://med-hip.com/>. HTML canonical/Open Graph metadata and visible brand URL use `med-hip.com`.
- Local project is normally `~/Desktop/Hippocrates Website`.
- Plain multi-page HTML/CSS/JavaScript; no package manager, bundler, or framework is present.
- Main technologies: browser JavaScript, Supabase REST/RPC/Auth/Edge Functions, Google Apps Script, Google Sheets Finance, and Cloudflare static assets.
- Important directories: `js/`, `css/`, `assets/`, `supabase/`.

## 2. Architecture

Conceptual production flow:

`Frontend → Supabase → hippocrates-finance-sync Edge Function → Google Apps Script → Google Sheets Finance`

The browser never calls Apps Script directly. Server-side webhook configuration belongs only in Edge Function secrets.

Important verified files:

- `index.html` + `js/app.js`: storefront rendering, live-data repaint, dynamic hero stats.
- `cart.html` + `js/cart.js`: cart, promo, student form, order/invoice flow.
- `lecturers.html` + `js/lecturers.js`: lecturer profiles.
- `console-b8134f36b50b.html` + `js/admin.js` + `js/admin-api.js`: admin UI, Supabase access, payment confirmation, finance sync/reconciliation.
- `js/store.js`: fallback catalog, cart rules, live Supabase catalog loading, promo/order RPC calls.
- `js/config.js`: public browser Supabase configuration; never add server secrets.
- `supabase/functions/hippocrates-finance-sync/index.ts`: authenticated finance bridge, sale sync, reconciliation, catalog sync.
- `supabase/*.sql`: additive migrations and guarded business-rule changes; inspect only those relevant to the task.
- `supabase/FINANCE-INTEGRATION.md`: checked-in integration/deployment notes; code wins if stale.
- `wrangler.jsonc` + `.assetsignore`: Cloudflare static-assets configuration and deploy exclusions.

Catalog behavior: pages paint from the checked-in fallback in `js/store.js`, then replace it with non-empty live Supabase `courses`, `packages`, and `lecturers` data. Supabase is authoritative when a valid live catalog loads; fallback correctness still matters during failures/first paint.

## 3. Git / deployment

- Expected working branch: `main`. On 2026-09-09, local Anatomy work was rebased onto `origin/main`; safety branch: `backup/pre-anatomy-rebase-2026-09-09`.
- Rebased Anatomy commit: `39c5382 Add first-year Anatomy courses and lecturer`, on top of remote `7da9d6d Add Sajad lecturer profile site-wide`.
- The former caption conflict was resolved with dynamic catalog-derived lecturer/course counts; do not restore hardcoded counts.
- No tracked GitHub Actions workflow or README-based deployment workflow was found.
- Verified deployment configuration: Cloudflare static assets project `hippocrates-website`, serving repository root; `.assetsignore` excludes Git, Supabase, SQL, Markdown, config, and local artifacts.
- Supabase Edge Function deployment is separate from the static website. `supabase/FINANCE-INTEGRATION.md` documents CLI/dashboard options; verify current project/workflow before using either.
- Always run `git status` before meaningful edits. Prefer small isolated diffs/commits. Never deploy, commit, or push unless explicitly requested.

## 4. High-risk systems

Treat these as high risk:

- `js/store.js`; cart/checkout; order creation; admin confirmation logic.
- Supabase RPCs, migrations, RLS, and `hippo_place_order` / `hippo_resolve_cart`.
- Finance Edge Function, Apps Script transport, finance reconciliation, and Google Sheets mappings.
- Stable course/package/lecturer IDs; promo and payment logic.

Do not refactor unrelated working code. Prefer minimal targeted changes.

## 5. Payment / finance baseline

- Website payment method: **SuperQi**. Do not rename or remap it casually.
- Normal/default products: `Actual Paid → 10% MedGPT → 10% Hippocrates → 80% Lecturer Pool`.
- Revenue shares use **Actual Paid after valid discount/promo**, not list price.
- Do not change the global/default rule unless explicitly instructed.
- The Edge Function sends item-level `originalPriceIQD`, `discountIQD`, and `actualPaidIQD` from the order snapshot; promo discount is allocated in whole IQD so item payments exactly equal order total.

## 6. Finance sync safety

Verified states: `not_synced`, `syncing`, `synced`, `sync_error`, `sync_unknown`.

- One confirmed order produces one `confirm_sale` request containing all order items.
- Only confirmed orders may sync. `purchasable=false` packages are rejected before finance transport.
- `synced` returns without another webhook call.
- `syncing` and `sync_unknown` block `confirm_sale`; use read-only reconciliation first.
- Reconciliation calls `get_sale_sync_status`, never `confirm_sale`, and resolves to `synced`, `not_synced`, or `sync_unknown`.
- Ambiguous timeouts/network outcomes become `sync_unknown`; never blindly retry them.
- Duplicate order responses are accepted only after read-only status checking confirms the expected transaction/subscription records.
- Preserve stable `websiteOrderId` (`orders.id`), idempotency, duplicate protection, logs, reconciliation, and safe retry behavior.

## 7. Lecturer earnings / monthly reporting

Finance includes or may include: Lecturer Earnings, Lecturer Monthly Summary, Lecturer Monthly History, Lecturer Payments, and Platform Payments. These live Sheet/Apps Script structures are not present in this repo and **require live verification**.

- Real-time earnings and full rebuild/reconciliation must produce identical results.
- Package sales must not double-count component lecturers.
- Monthly reporting must support mixed per-product revenue rules.
- Never assume `Total Sales × 10%` for all MedGPT revenue; aggregate actual resolved shares per sale/subscription.
- Exact reconciliation invariant: `MedGPT + Hippocrates + Lecturer entitlement = Actual Paid`.

## 8. Canonical lecturer IDs

Owner-provided canonical finance roster (**requires live verification**; repo uses separate website keys and cannot verify all finance IDs):

| ID | Lecturer |
|---|---|
| LEC001 | Muqtada Ali Muqdad |
| LEC003 | Yaseen Nabeel Abdul-Mohsin |
| LEC004 | Zahraa Raad Abdullah |
| LEC006 | Hussein Kamal Shakir |
| LEC007 | Aya Thamer Juma |
| LEC011 | Furqan Abdul-Qadir Khudhiar |
| LEC012 | Narjis Kadhim Jabur |
| LEC013 | Sara Sabah Ali |
| LEC014 | Karrar Haider Ali |
| LEC015 | Haider Khaled Tarish |
| LEC016 | Ayat Ghalib Nasser |
| LEC017 | Tabarak Sabah Ali |
| LEC018 | Zahraa Hasan Hashim |
| LEC019 | Asal Ziad Noori |
| LEC020 | Rafal Ziad Abdul-Ameer |
| LEC021 | Zahraa Hamed Wasmi |
| LEC022 | Sajad Abdul Aziz Khalifa |

Retired duplicates **must never be recreated**: `LEC002`, `LEC005`, `LEC008`, `LEC009`, `LEC010`. Never renumber canonical IDs. Before adding a lecturer, verify live finance data rather than guessing an ID.

## 9. Sajad / Anatomy

- Canonical lecturer: `LEC022`, Sajad Abdul Aziz Khalifa, `د. سجاد عبد العزيز خليفة`; website lecturer key `sajad`.
- Stage 1; subject Anatomy.

| Finance ID | Website ID | Product | Normal / selling IQD |
|---|---|---|---:|
| CRS039 | `anatomy-upper` | Upper Limb Anatomy (includes Introduction to Anatomy) | 35,000 |
| CRS040 | `anatomy-lower` | Lower Limb Anatomy | 30,000 |
| CRS041 | `anatomy-thorax` | Thorax Anatomy | 25,000 |
| PKG012 | `anatomy-ul-ll` | Upper Limb + Lower Limb | 65,000 / 60,000 |
| PKG013 | `anatomy-ll-thorax` | Lower Limb + Thorax | 55,000 / 50,000 |
| PKG014 | `anatomy-complete` | Upper + Lower + Thorax | 90,000 / 80,000 |

- Repository migrations/Edge transport define all seven Anatomy package/course links as **content-only**, with no component monetary allocations. Owner confirmed this live on 2026-09-09.
- Finance mapping is one allocation per Anatomy package: 100% of applicable lecturer share to `LEC022` Sajad; owner confirmed live on 2026-09-09.

## 10. Critical — Sajad special revenue rule

Required target rule for Sajad Anatomy products alone:

`Actual Paid → 20% MedGPT → 5% Hippocrates → 75% Sajad`

This rule lives in the external finance system, not this repository. Owner confirmed it live on 2026-09-09 through `RUL003–RUL008`, with whole-IQD and mixed Monthly Summary checks passing. All other products retain their existing rules; never modify the global 10/10/80 default.

Whole-IQD settlement:

- `MedGPT = ROUND(Actual Paid × 20%)`
- `Hippocrates = ROUND(Actual Paid × 5%)`
- `Sajad = Actual Paid − MedGPT − Hippocrates`
- No fractional IQD; Sajad absorbs any rounding remainder, guaranteeing exact reconciliation.

Examples `(Actual Paid → MedGPT / Hippocrates / Sajad)`: `35,000 → 7,000 / 1,750 / 26,250`; `30,000 → 6,000 / 1,500 / 22,500`; `25,000 → 5,000 / 1,250 / 18,750`; `60,000 → 12,000 / 3,000 / 45,000`; `50,000 → 10,000 / 2,500 / 37,500`; `80,000 → 16,000 / 4,000 / 60,000`. Promo example: `72,000 actual paid → 14,400 / 3,600 / 54,000`.

## 11. Current Anatomy finance state

Owner-confirmed live on 2026-09-09:

- Sajad Anatomy only: 20% MedGPT / 5% Hippocrates / 75% Sajad; `RUL003–RUL008` live.
- `CRS039–CRS041` and `PKG012–PKG014` mapped; packages allocate 100% to `LEC022`; components are content-only.
- Whole-IQD reconciliation and mixed Monthly Summary pass; existing products retain existing rules.
- Apps Script production version 15; same deployment ID and `/exec` preserved.
- `supabase/ANATOMY-MIGRATION-PLAN.md` is a historical pre-execution plan; its “proposed/pending” wording is stale.

## 12. Current Anatomy frontend status

- A historical deployment had `TypeError: Cannot read properties of undefined (reading 'ar')` because `js/app.js` referenced `anatomyIntro` while deployed `js/store.js` lacked it. The fixed release was verified live on 2026-09-09.
- **This is not an active repository bug:** current `js/store.js` defines `INC.anatomyIntro` in Arabic and English. Do not re-add or hack around it.
- `renderHeroStats()` dynamically calculates enabled course count, lecturer count, and six stages. Expected successful counts with Anatomy: Courses 26, Lecturers 17, Stages 6; never hardcode 26 or 17.
- The lecturer-section caption and hero counters are dynamically derived from the catalog; do not hardcode 17/26.

## 13. Current Anatomy safety rule

Before exposing a new finance-sensitive product, verify: (1) its revenue rule, (2) whole-IQD settlement, (3) Lecturer Earnings, (4) mixed-rule Monthly Summary, (5) reconciliation, and (6) catalog mapping.

For Anatomy, the finance gate was owner-confirmed ready on 2026-09-09. A read-only catalog check confirmed all six live Supabase products enabled/purchasable with exact Stage 1 IDs/prices. The website release was then verified live: six cards/prices, Stage 1/Stage 5 filtering, six-item cart, promo validation, Sajad profile/portrait, existing products, and dynamic 17/26/6 counters all passed.

## 14. Existing product exceptions

- **Dermatology:** `derm-full` is storefront course-like but financially transported as a Package because its course record has `covers`. Do not reclassify it.
- **Radiology:** `radiology` can display with courses but remains a Package in catalog/cart/order/finance. It is also content-only in Edge catalog transport.
- **Year 6:** `year6` is display-only, non-purchasable, non-commercial. Both UI/store and server-side cart resolution guard it; it must never enter checkout, promos, or finance transport.

## 15. Student contact data

Checkout UI collects Full Name, Telegram, Phone, Email, University/College, Stage, and Notes.

- Repository-verified path: name, Telegram, stage, phone, email → `hippo_place_order` → `orders` → Edge `student` payload; arrival in the external finance student record **requires live verification**.
- Never drop phone/email anywhere in that chain.
- Current repository state: University and Notes are **not persisted**. `js/store.js` sends only name/Telegram/stage/phone/email to the RPC; University and Notes remain only in the local invoice object/UI. Do not claim persistence without implementing and verifying schema/downstream transport.

## 16. Security

Never expose, print, document, log, or commit service-role/secret keys, webhook/API secrets, passwords, OAuth tokens, private credentials, or `.env` contents. Never put server secrets in frontend JS, HTML, Git, logs, or documentation. If encountered, do not copy them here.

## 17. Working rules for future AI agents

Before any task:

1. Read this file; do not repeat it to the user.
2. Check `git status` and the current branch/divergence.
3. Inspect only files relevant to the request; do not re-audit the repo for simple tasks.
4. Use current code as implementation source of truth and flag conflicts with this context.
5. Prefer the smallest safe diff; do not refactor unrelated working code.
6. Preserve stable IDs and business rules unless explicitly instructed.
7. Never expose secrets.

For finance-sensitive work: `inspect → prepare → verify → migrate → test → activate`. Never make a product purchasable before finance mappings/rules are ready. Frontend-only request: do not change finance/Supabase unless required. Finance-only request: do not redesign frontend.

## 18. AI response style

Be concise. Do not repeat this file, explain unchanged code, or provide long repository summaries after every task.

Normal completion report:

`Files changed:`  
`What changed:`  
`Tests:`  
`Deployment:`  
`Blockers:`

For sensitive migrations, report only relevant validations/results.
