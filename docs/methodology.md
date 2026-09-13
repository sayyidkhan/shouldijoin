# How we assess company health

**Should I Join · Screening rules v1 · Documented 13 September 2026**

[Open the in-app guide](https://should-i-join.promptalchemistlabs.chatgpt.site/methodology) · [Project README](../README.md)

## What this assessment is

Should I Join is a rule-based screening framework for people researching a prospective or current employer. Six separate checks turn dated financial inputs and salary records into questions worth investigating.

The thresholds and radar anchors were chosen as product design rules for the prototype. They were **not derived from a statistical study of company failures, calibrated against industry peers, or validated as predictors of closure or layoffs**. There is no training dataset, fitted prediction model, sector percentile or combined safety score.

The term “benchmark” should therefore be understood as a fixed reference scale in this version. User-facing documentation calls it “How we assess company health” to avoid implying predictive validation.

## 1. Inputs and scope

Each metric records its numeric inputs, reporting or observation date, period label, currency when applicable, source URL, source notes and whether it is a company disclosure or user-entered figure. Company identity notes record the legal entity and scope.

The prototype accepts USD and SGD. It does not automatically convert currencies. Within a monetary calculation, all component amounts must be entered in the selected currency and unit; the app cannot independently verify their provenance or unit consistency.

The six dimensions cover cash generation, cash buffer, debt coverage, business momentum, operating profitability and recent pay reliability. This selection is a product scope decision, not evidence that these six factors fully explain employer risk. Governance, debt maturity schedules, customer concentration, business-model differences and the security of a particular role can require separate investigation.

## 2. Screening bands

These bands determine the status labels, colours and 3D pillar heights. They are separate from the continuous radar scales in section 3.

| Check | Measure | Concern | Review | Positive |
| --- | --- | --- | --- | --- |
| Operating cash flow | Net cash from operating activities for the period | Below 0 | Exactly 0 | Above 0 |
| Cash runway | Unrestricted cash ÷ monthly net cash burn | Under 6 months | 6 to under 12 months | 12 months or more |
| Net cash position | Defined cash-like assets − loans and borrowings | No automatic concern band | Zero or negative net cash | Positive net cash |
| Revenue growth | Reported year-on-year revenue change | Below −10% | −10% through 0% | Above 0% |
| Operating margin | Operating profit ÷ revenue × 100 | Below 0% | 0% to under 5% | 5% or more |
| Salary reliability | Late payments among the last three monthly cycles | 1–3 late payments | No separate review band | 0 late payments |

Zero burn makes runway **not applicable**, not infinite. Net debt is a reason to inspect repayment obligations, not automatic evidence of distress. A 5% operating margin is a chosen screening threshold, not a universal standard across industries. On-time salary describes only the three recorded cycles.

The report readout gives priority to any numeric concern or a recorded observation marked “Concern”. Otherwise, review readings prompt further questions. The directory labels positive readings with gaps as “Positive so far”; a company with no assessable readings stays “Not assessed”. Observations can change the narrative readout but do not alter radar values.

## 3. Radar normalization

The radar uses ratios, percentages or months rather than absolute company size. Each axis maps onto a fixed 0–100 plotting range. Further out represents a stronger reading under the chosen rules.

| Axis | Input measure | Fixed anchors: input → radar value |
| --- | --- | --- |
| Cash generation | Operating cash flow ÷ same-period revenue × 100 | −20% → 0; 0% → 40; 10% → 70; 30% → 100 |
| Cash runway | Unrestricted cash ÷ monthly net cash burn | 0 months → 0; 6 → 30; 12 → 65; 24 → 100 |
| Cash / debt | Defined cash-like assets ÷ borrowings | 0× → 0; 1× → 50; 3× → 100 |
| Revenue growth | Year-on-year revenue change | −20% → 0; 0% → 40; 10% → 65; 30% → 100 |
| Profitability | Operating profit ÷ revenue × 100 | −10% → 0; 0% → 40; 5% → 65; 20% → 100 |
| Salary reliability | On-time payments ÷ 3 × 100 | 0 of 3 → 0; 1 of 3 → 33⅓; 2 of 3 → 66⅔; 3 of 3 → 100 |

Values interpolate linearly between adjacent anchors and are capped at the endpoints. For input `x` between anchors `(x₀, y₀)` and `(x₁, y₁)`:

```text
radar_value = y₀ + ((x − x₀) / (x₁ − x₀)) × (y₁ − y₀)
```

**Worked example:** A 2.5% operating margin is halfway between 0% and 5%, whose radar values are 40 and 65. Its radar value is `40 + (2.5 / 5) × 25 = 52.5`. It still receives the “Thin margin” screening label because 2.5% is below the separate 5% band boundary.

A radar value of 52.5 is not a 52.5% chance of survival. The chart is not a percentile or an industry benchmark. Axes are not averaged or weighted into an overall score, and polygon area must not be used to rank employers by safety. Different available-axis sets also change the geometry of standalone profiles.

## 4. Data eligibility and comparisons

- Inputs must pass validation, including finite numbers, permitted ranges, valid dates, a nonempty period and supported currency. Operating-margin revenue must be positive. Salary counts must be integers from 0 to 3. Future dates and unusable derived values are rejected.
- Figures dated more than 180 days before the current UTC date become stale. This is a product freshness rule, not evidence that younger data is accurate.
- Cash generation requires a usable revenue input for the same date, period label and currency as operating cash flow. The current implementation takes revenue from the operating-margin input.
- A two-company axis requires usable values with identical reporting dates and matching period labels after trimming and lowercasing. This is strict label matching, not automatic fiscal-period reconciliation.
- The shared cash / debt axis requires **both** inputs to be explicitly marked “cash and cash equivalents”. Company-defined liquidity measures and unconfirmed definitions are excluded from this shared axis. A standalone cash / debt ratio can still appear with its stated definition.
- Missing, invalid, stale and incompatible values are excluded from the polygon, never replaced with zero. At least three usable dimensions are needed. Comparison polygons use the same eligible dimensions for both companies; the table preserves all six dimensions and explains exclusions.
- Positive cash with zero borrowings maps to 100 and is labelled “No borrowings”. Zero cash and zero borrowings yields no cash / debt ratio. Zero burn yields no finite runway. Non-finite calculations remain unknown.

Matching dates, definitions and ratios is a basic comparability check. It does not adjust for industry economics, accounting-policy differences, seasonality, acquisitions or the availability of group cash to a specific subsidiary.

## 5. Current source coverage

The initial curated reports are unaudited Q2 2026 group snapshots. They are not live feeds.

| Company | Source and treatment |
| --- | --- |
| Grab Holdings | [Q2 2026 disclosure, 4 August 2026](https://www.grab.com/sg/press/others/grab-reports-record-second-quarter-2026-results-raises-full-year-guidance-and-announces-750-million-share-repurchase-program/). Cash uses the company's broader non-IFRS liquidity definition, which includes restricted balances. Borrowings are derived from the difference between rounded gross and net cash liquidity. Operating margin uses operating profit, not headline net profit. |
| Sea Limited | [Q2 2026 disclosure, 11 August 2026](https://www.sec.gov/Archives/edgar/data/1703399/000119312526344596/d120948dex991.htm) and [Q1 disclosure](https://www.sec.gov/Archives/edgar/data/1703399/000119312526219378/d78490dex991.htm). Q2 operating cash flow is half-year operating cash flow less Q1. Cash and cash equivalents exclude restricted cash and investments; borrowings include current/non-current loans and convertible notes, excluding leases, customer deposits and escrow liabilities. |

Because those cash definitions differ, Grab versus Sea initially shares only **cash generation, revenue growth and profitability** on the radar. Runway and salary reliability lack inputs; cash / debt is incompatible for this comparison.

Other companies require user-entered figures and sources. A source link does not mean independent verification. Entity lookup, automated financial retrieval and continuous monitoring are not connected. Confirm the legal entity and UEN on the employment contract; group-level results cannot establish the security of a specific role.

## 6. Validation status

At this documentation revision, **22 automated tests** cover calculations, threshold boundaries, input/date validation, missing versus zero values, overflowing results, radar normalization, size-independent cash-generation ratios, comparison exclusions, selected source derivations and saved-data handling.

These are software correctness checks for the tested cases. A successful production build separately checks that the application compiles and packages. Neither establishes predictive or financial validity.

The project has **not**:

- backtested against historical closures, insolvencies or layoffs;
- estimated prediction accuracy, false reassurance rates or false alarm rates;
- calibrated thresholds against sector-specific peer distributions;
- evaluated predictive performance on unseen reporting periods;
- independently audited the source figures or established that these checks capture all employer risks.

Before claiming a predictive benchmark, further work would require an appropriate peer dataset, a defined outcome and time horizon, dated historical data without future-information leakage, evaluation on unseen periods and published performance limitations. These are future requirements, not completed capabilities.

## 7. Coverage and private research

Coverage is the count of current, usable inputs out of six. It measures completeness rather than credibility. A complete zero-burn entry can count toward coverage while the runway interpretation remains not applicable.

Research is saved in browser localStorage and is not published to other visitors. Clearing browser data removes it. There is no cross-device sync. Review dates appear in the watchlist; background alerts are not sent.

## 8. Implementation and maintenance

| Reference | Responsibility |
| --- | --- |
| [model.ts](../lib/company/model.ts) | Metric inputs, validation, screening bands, freshness and readouts |
| [radar.ts](../lib/company/radar.ts) | Fixed scales, interpolation, comparable axes and directory readouts |
| [data.ts](../lib/company/data.ts) | Curated figures, sources and derivation notes |
| [methodology.tsx](../components/company/methodology.tsx) | In-app overview; radar anchor text reuses `RADAR_RULES` |
| [tests](../tests) | Calculation, chart and comparison checks |

Update this document and the in-app explanation when changing thresholds, input eligibility or comparison rules. Record a new methodology revision and explain the change; do not silently reinterpret old comparisons as having been validated under a new model.

### Revision history

| Revision | Date | Change |
| --- | --- | --- |
| Screening rules v1 | 13 September 2026 | Documents the existing six checks, radar scales, comparison exclusions and validation limits. No calculation thresholds changed in this documentation release. |
