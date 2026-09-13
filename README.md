# Should I Join

[Open the public app](https://should-i-join.promptalchemistlabs.chatgpt.site) · [How we assess company health](docs/methodology.md) · [In-app methodology](https://should-i-join.promptalchemistlabs.chatgpt.site/methodology)

A company evaluation workspace for professionals deciding whether to join an employer or preparing for changes at their current company. Built by Sayyid Khan and hosted exclusively on GPT Sites. GitHub stores the source code.

## Assessment methodology

The [methodology document](docs/methodology.md) records all six checks, exact screening bands, radar anchors, a worked example, data eligibility, sources, comparison exclusions and validation limits. The same overview is available in the app’s Methodology tab and at `/methodology`.

These are prototype screening rules chosen for the product. They have not been calibrated against industry peers or backtested as predictors of closures or layoffs. The automated tests check software behaviour, not predictive validity.

## Company directory and comparison

The app opens on a searchable company table, with concise signal readouts, revenue growth, operating margin and data coverage. Open a company to inspect its report, or select two rows to compare. Grab and Sea are the initial curated reports; manual and saved research also appears in the directory. There is no onboarding wizard.

The report defaults to a radar profile. Comparison overlays both companies on the same fixed scales, with solid lime and dashed blue outlines and exact values in the table below. Selecting an axis updates the detail panel. Missing, stale and incompatible dimensions are excluded from the polygon and remain listed as gaps; fewer than three usable dimensions shows an explicit empty state.

| Radar axis | Size-independent measure | Fixed anchors (measure → plot value) |
| --- | --- | --- |
| Cash generation | Operating cash flow / same-period revenue | −20% → 0; 0% → 40; 10% → 70; 30% → 100 |
| Cash runway | Unrestricted cash / monthly net burn | 0 months → 0; 6 → 30; 12 → 65; 24 → 100 |
| Cash / debt | Defined cash-like assets / borrowings | 0× → 0; 1× → 50; 3× → 100 |
| Revenue growth | Year-on-year revenue change | −20% → 0; 0% → 40; 10% → 65; 30% → 100 |
| Profitability | Operating profit / revenue | −10% → 0; 0% → 40; 5% → 65; 20% → 100 |
| Salary reliability | On-time payments / last 3 cycles | 0 of 3 → 0; 3 of 3 → 100 |

Values interpolate between anchors and clamp to 0–100. These are illustrative product scales, not percentiles, sector benchmarks or a combined safety score. Cash generation requires revenue in the same period, date and currency. Cross-company axes require matching dates and period labels; cash/debt additionally requires both cash bases to be explicitly cash and cash equivalents. Ratios still need business-model context.

## The evaluation

Six metrics translate financial figures and workplace observations into specific questions:

| Area | Metric | Calculation / input |
| --- | --- | --- |
| Cash resilience | Operating cash flow | Reported net cash from operating activities |
| Cash resilience | Cash runway | Unrestricted cash ÷ monthly net cash burn |
| Debt pressure | Net cash position | Defined cash-like assets − loans and borrowings |
| Business performance | Revenue growth | Reported year-on-year revenue growth |
| Business performance | Operating margin | Operating profit ÷ revenue × 100 |
| Employment stability | Salary reliability | Late payments in the last three monthly salary cycles |

Each metric opens a figure editor with reporting dates, currency where relevant, a source link, calculation details and assumptions. Changes recalculate the reading and the prioritised follow-up questions. Missing figures remain unknown.

The report includes an evidence trail, company identity/scope notes, different checklists for job candidates and existing employees, and a saved watchlist with review dates. The overview uses a charcoal and lime visual system, a radar profile, an optional spatial signal map, a selected-metric chart and a six-metric dock. Self-hosted Manrope and IBM Plex Mono provide consistent display and data typography. Full calculation and source details open on demand.

## Visual evaluation

The retained 3D tab places the company at the centre of a radial diagram, called the centrifuge. Selecting a labelled column or a metric in the dock highlights both and updates the adjacent detail panel. The detail panel also supports previous/next navigation. Full-screen mode keeps the metric labels and the screening-band explanation visible; unsupported embedded browsers retain the regular view.


- Three.js renders six selectable hexagonal 3D pillars around a central company disc, with orbit, zoom, optional rotation, reset and full-screen exploration controls. Label buttons and the metric strip support keyboard selection.
- Pillar heights are **ordinal screening bands**, not amounts or a composite health score. Positive, review and concern have fixed heights; unknown or stale readings use hollow outlines rather than a zero-height value.
- Exact values remain labelled. Selecting a signal opens a Recharts visualization in its own units: net operating cash flow, cash versus borrowings, an explicitly indexed revenue comparison, operating margin, a constant-burn cash scenario, or aggregate salary payment counts.
- Missing/stale figures do not produce quantitative charts. One-period data never produces an invented historical trend.
- A selectable 2D status matrix provides the same readings alongside the radar and 3D views. The radar becomes the automatic fallback if WebGL cannot start or loses its context.
- Three.js loads on demand. Rendering pauses when the view is off-screen or the document is hidden; pixel density and frame rate are capped. Automatic rotation is off by default, and reduced-motion preferences disable pillar transitions.

## Interpretation rules

These are illustrative screening rules, not insolvency predictions, universal safety scores, sector benchmarks, or recommendations to join/leave a company.

- Cash flow: negative → concern; zero → watch; positive → positive signal.
- Cash runway: under 6 months → concern; 6 to under 12 → watch; 12+ → more buffer. Zero burn is not applicable, never infinite runway.
- Net cash: positive → net cash; zero/negative → review debt structure. Net debt alone is not proof of distress.
- Revenue growth: below −10% → concern; −10% through 0% → watch; above 0% → positive signal.
- Operating margin: negative → concern; 0 to under 5% → thin margin; 5%+ → more margin. Industry context is essential.
- Salary: any late payment → investigate; zero late payments → positive only for the three recorded cycles.
- Figures over 180 days old become unknown and require updating. Future and invalid dates, impossible counts, non-finite values and invalid calculation denominators are rejected.

Any numeric concern or an observation flagged as a concern takes priority in the readout. Otherwise, watch readings prompt further questions and unknowns keep the assessment incomplete. Coverage counts current, usable dated inputs; it does not measure credibility. A zero-burn input can be complete while its runway interpretation remains not applicable/unknown.

## Data coverage

**Grab Holdings and Sea Limited are curated Q2 2026 group reports.** Grab contains company-disclosed, unaudited figures and links to the [4 August 2026 release](https://www.grab.com/sg/press/others/grab-reports-record-second-quarter-2026-results-raises-full-year-guidance-and-announces-750-million-share-repurchase-program/).

The sample separates operating margin from headline net profit. Its net cash calculation uses Grab's non-IFRS cash liquidity definition, which includes restricted cash. Borrowings are derived from the difference between rounded gross and net liquidity amounts. Those figures must not be reused as unrestricted runway cash.

**Sea** uses the [11 August 2026 Q2 release](https://www.sec.gov/Archives/edgar/data/1703399/000119312526344596/d120948dex991.htm). Its quarterly operating cash flow is H1 cash flow less the [Q1 figure](https://www.sec.gov/Archives/edgar/data/1703399/000119312526219378/d78490dex991.htm). Cash and cash equivalents exclude restricted cash and investments; borrowings include current/non-current debt and convertible notes, excluding leases, customer deposits and escrow liabilities. Grab uses a broader cash definition, so cash/debt is excluded from their shared radar. Their initial comparison has three axes: cash generation, revenue growth and profitability.

Adding another name or UEN opens a manual evaluation; it does not resolve identities or fetch accounts. Live company search, financial feeds, cross-device sync and automatic alerts are not connected. Links are not automatically verified, and group-level health does not establish the position of the entity on a user's contract.

## Privacy and migration

Research is stored in this browser's localStorage and is not published to other visitors. Clearing browser data removes the research.

Version 2 migrates the existing version 1 watchlist, preserving identity notes, observations, checklists and review dates. It leaves the legacy storage key intact. Old company records receive empty metrics instead of inferred financial values. Browser storage failures produce an explicit session-only notice.

## Technology

- GPT Sites hosting, using the retained Vinext/React/TypeScript starter and Cloudflare Worker output.
- Existing Shadcn/Radix controls, Tailwind CSS and Lucide icons.
- Three.js / OrbitControls for 3D and Recharts through the shared Shadcn chart primitives for numeric charts.
- No required external API key or database.
- Optional, feature-detected WebMCP `start_company_check` tool for navigating the same interface.

## Development and checks

Requires Node 22.13+ and the pnpm version declared in `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
node --experimental-strip-types --test tests/*.test.mjs
```

In the managed GPT Sites environment, use the Sites plugin's build and publication helpers. Preserve the project ID in `.openai/hosting.json`; publish through GPT Sites only.

Focused tests cover radar normalization, cross-company comparability, company-size neutrality, missing-axis handling, directory merge precedence, curated-quarter derivations, calculation boundaries, missing versus zero inputs, zero burn, zero revenue, negative values, salary counts, stale/future dates, source URL validation, concern precedence, migration, overflowing calculations, truthful chart transformations and bounded cash scenarios. The production build is validated separately. Browser/end-to-end QA and WebMCP runtime validation have not been performed in this environment.

## Source layout

| Path | Purpose |
| --- | --- |
| `docs/methodology.md` | Versioned methodology, assumptions, source coverage and validation status |
| `components/company/methodology.tsx`, `app/methodology/page.tsx` | Shared in-app guide and permanent public route |
| `lib/company/model.ts` | Metric definitions, input validation, calculations, summary and migration |
| `lib/company/data.ts` | Dated Grab and Sea snapshots, sources and checklists |
| `lib/company/radar.ts` | Normalization, comparable axes and directory readouts |
| `components/company/company-directory.tsx` | Searchable company table, selection and manual creation |
| `components/company/company-comparison.tsx` | Two-company comparison and exact values |
| `components/company/radar-profile.tsx` | Radar rendering, gaps and scale guide |
| `lib/company/visuals.ts` | Shared band visuals and exact chart transformations |
| `components/company/visual-evaluation.tsx` | Visual overview, metric charts and 2D matrix |
| `components/company/signal-scene.tsx` | Accessible controls, labels and lazy 3D loading |
| `components/company/three-scene.ts` | WebGL scene, picking and resource lifecycle |
| `components/company/metric-editor.tsx` | Figure editor and calculation preview |
| `components/company/evidence-editor.tsx` | Observation editor |
| `app/page.tsx` | Directory, comparison, evaluation, evidence, next steps and watchlist |
| `app/globals.css`, `app/observatory.css`, `app/directory.css` | Responsive visual system |
| `tests/metrics.test.mjs`, `tests/visuals.test.mjs`, `tests/radar.test.mjs` | Calculation, migration, comparison and chart data tests |

## Next data milestone

Connect reliable entity matching and licensed financial/filing data server-side before claiming automatic assessments. Add authenticated Sites-backed persistence and an actual scheduled retrieval and notification system before claiming continuous monitoring.
