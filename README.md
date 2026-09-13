# Should I Join

[Open the public app](https://should-i-join.promptalchemistlabs.chatgpt.site)

A company evaluation workspace for professionals deciding whether to join an employer or preparing for changes at their current company. Built by Sayyid Khan and hosted exclusively on GPT Sites. GitHub stores the source code.

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

The report includes an evidence trail, company identity/scope notes, different checklists for job candidates and existing employees, and a saved watchlist with review dates. The mobile report shows a compact readout before the metrics.

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

**Grab Holdings is the only curated report.** It contains company-disclosed, unaudited Q2 2026 figures and links to the [4 August 2026 release](https://www.grab.com/sg/press/others/grab-reports-record-second-quarter-2026-results-raises-full-year-guidance-and-announces-750-million-share-repurchase-program/).

The sample separates operating margin from headline net profit. Its net cash calculation uses Grab's non-IFRS cash liquidity definition, which includes restricted cash. Borrowings are derived from the difference between rounded gross and net liquidity amounts. Those figures must not be reused as unrestricted runway cash.

Searching another name or UEN opens a manual evaluation; it does not resolve identities or fetch accounts. Live company search, financial feeds, cross-device sync and automatic alerts are not connected. Links are not automatically verified, and group-level health does not establish the position of the entity on a user's contract.

## Privacy and migration

Research is stored in this browser's localStorage and is not published to other visitors. Clearing browser data removes the research.

Version 2 migrates the existing version 1 watchlist, preserving identity notes, observations, checklists and review dates. It leaves the legacy storage key intact. Old company records receive empty metrics instead of inferred financial values. Browser storage failures produce an explicit session-only notice.

## Technology

- GPT Sites hosting, using the retained Vinext/React/TypeScript starter and Cloudflare Worker output.
- Existing Shadcn/Radix controls, Tailwind CSS and Lucide icons.
- No required external API key or database.
- Optional, feature-detected WebMCP `start_company_check` tool for navigating the same interface.

## Development and checks

Requires Node 22.13+ and the pnpm version declared in `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm build
node --experimental-strip-types --test tests/metrics.test.mjs
```

In the managed GPT Sites environment, use the Sites plugin's build and publication helpers. Preserve the project ID in `.openai/hosting.json`; publish through GPT Sites only.

Nine focused tests cover calculation boundaries, missing versus zero inputs, zero burn, zero revenue, negative values, salary counts, stale/future dates, source URL validation, concern precedence, migration and overflowing calculations. The production build is validated separately. Browser/end-to-end QA and WebMCP runtime validation have not been performed in this environment.

## Source layout

| Path | Purpose |
| --- | --- |
| `lib/company/model.ts` | Metric definitions, input validation, calculations, summary and migration |
| `lib/company/data.ts` | Dated Grab snapshot and checklists |
| `components/company/metric-editor.tsx` | Figure editor and calculation preview |
| `components/company/evidence-editor.tsx` | Observation editor |
| `app/page.tsx` | Evaluation, evidence, next steps, watchlist and methodology |
| `app/globals.css` | Responsive visual system |
| `tests/metrics.test.mjs` | Calculation and migration regression tests |

## Next data milestone

Connect reliable entity matching and licensed financial/filing data server-side before claiming automatic assessments. Add authenticated Sites-backed persistence and an actual scheduled retrieval and notification system before claiming continuous monitoring.
