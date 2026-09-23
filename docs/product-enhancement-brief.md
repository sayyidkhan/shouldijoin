# Should I Join — product enhancement brief

**Prepared for:** Sayyid Khan and Clement
**Scope:** Documentation-only assessment of the repository’s documented product and implemented interface.
**Evidence reviewed:** `README.md`, `docs/methodology.md`, primary application routes and company components, curated data references, and focused test files. This is not user research, competitive research, financial validation, or browser/end-to-end QA.

## Executive summary

Should I Join has a differentiated and responsible foundation: it helps prospective and current employees turn employer research into six transparent, dated screening checks, while repeatedly avoiding the misleading claim that it predicts job security. Its best product qualities are evidence traceability, explicit data gaps, cautious comparison rules, separate personal observations, and action-oriented checklists.

The core product opportunity is to turn this strong **assessment workspace** into a more complete **decision-support journey** without weakening its methodology claims. The highest-value near-term work is a guided first assessment that helps a user establish the employing entity, collect the minimum viable evidence, understand what remains unknown, and leave with a shareable interview/review plan. The next strategic dependency is trusted entity and financial-data acquisition; durable persistence and monitoring should follow only after data rights, privacy, and operational ownership are defined.

## Product position today

### What the product is

- A rule-based company-evaluation workspace for people deciding whether to join an employer or preparing for changes at their current company (`README.md`, lines 3–5; `docs/methodology.md`, lines 7–13).
- A Singapore-oriented experience: the header identifies the region as Singapore and the interface points users to ACRA Bizfile and SGX announcements for verification (`app/page.tsx`; `components/company/visual-evaluation.tsx`).
- A six-check research framework covering operating cash flow, runway, net cash, revenue growth, operating margin, and salary reliability (`README.md`, lines 30–43).
- A prototype with two curated group-level Q2 2026 reports—Grab and Sea—and manual research for other companies (`README.md`, lines 73–81; `docs/methodology.md`, lines 75–86).

### What the product explicitly is not

- It is not a predictive model, sector benchmark, probability of failure, or combined safety score. Thresholds have not been calibrated or backtested (`README.md`, lines 59–71; `docs/methodology.md`, lines 7–13 and 88–102).
- It is not a live company search, automated financial feed, entity-resolution service, cross-device workspace, or automated-alert system (`README.md`, lines 81–87).
- It does not independently verify user-entered figures, source links, legal entity identity, accounting consistency, or whether group cash protects a user’s employing entity (`docs/methodology.md`, lines 15–21 and 75–86).

## Observations from the current product

These are repository-supported observations, rather than conclusions about real-user behaviour.

### Strengths

| Observation | Evidence | Product value |
| --- | --- | --- |
| The product makes uncertainty visible rather than fabricating completeness. | Missing, stale, and incompatible dimensions are excluded from radar polygons; fewer than three usable dimensions gives an empty state. | Helps prevent false confidence from incomplete research. |
| The methodology is unusually transparent for a screening product. | The methodology documents formulas, fixed anchors, exclusions, source treatment, and validation limits; the UI links to a scale guide and a dedicated methodology route. | Builds trust through inspectability and supports informed interpretation. |
| The product separates facts from interpretation. | Metric inputs record date, period, currency, source URL, notes, and origin; observations are displayed separately and can affect narrative concern status without changing radar values. | Preserves an auditable distinction between reported figures and personal evidence. |
| Comparison is conservative. | Cross-company radar dimensions require current values, matching dates and period labels; cash/debt also requires compatible cash definitions. Exclusions remain visible in the table. | Avoids visually persuasive but invalid comparisons. |
| The app supports two meaningful contexts. | “I’m considering joining” and “I already work here” checklists are available in Next steps. | Recognises that candidates and employees need different questions and review rhythms. |
| The interface provides several ways to understand the same signals. | Radar, accessible 2D table, selected-metric detail, charts in original units, and optional 3D view are implemented; 3D has radar fallback and reduced-motion safeguards. | Serves users who prefer visual overview, exact values, or a structured table. |
| Privacy is simple and explicit. | Research is stored in browser `localStorage`; storage failure results in a session-only notice. | Lowers account friction and avoids implying shared publication. |
| The product resists score-driven overclaiming. | Labels such as “Positive so far,” “Mixed signals,” and “Investigate before committing” coexist with repeated “no overall safety score” messaging. | Keeps the experience decision-supportive rather than prescriptive. |

### Friction and missing capabilities

| Observation | Evidence | Likely friction in the experience |
| --- | --- | --- |
| A new company can be created from only a name or UEN, but this does not resolve the entity or retrieve accounts. | The add-company dialog opens a manual check; identity is a free-text note and explicitly not verified against ACRA. | Users face a blank workspace and may not know which legal entity, group, period, or source to use first. |
| Initial coverage is intentionally narrow. | Only Grab and Sea are curated; all other names depend on manual entry. | The primary “Should I Join?” question cannot be answered quickly for most employers. |
| The default curated data is group-level and partially incomparable. | Grab and Sea share only three initial radar axes because runway/salary inputs are absent and cash definitions differ. | Users may struggle to apply a group-level visual to a local employing entity or role. |
| Manual research has high cognitive and data-entry cost. | Each metric requires figures and contextual fields; cash generation requires matching revenue details; valid comparisons require matching dates/periods/cash bases. | A user needs financial literacy and source discipline before receiving a useful profile. |
| The product’s next action is a checklist, not a decision artifact. | Next steps offers checkboxes and a review date; source/evidence records stay inside the browser. | Users cannot readily turn findings into a concise interview brief, discussion pack, or decision record. |
| Watchlist “monitoring” is manual. | Review dates are visible, but background notifications and scheduled retrieval are explicitly absent. | A saved assessment can become stale without a reliable re-engagement mechanism. |
| Browser-local storage limits continuity and recovery. | No cross-device sync; clearing browser data removes research. | Users can lose work or cannot continue research on another device. |
| Trust safeguards are present but distributed across the interface. | The product has many caveats across methodology, radar guide, source views, and entity note. | A hurried user may still confuse “positive signals” with a recommendation, or overlook scope/coverage limits. |

### Current user flows

1. **Discover and select:** open Companies, search the small directory, or add a company by name/UEN; select two entries for comparison.
2. **Assess:** view the company overview, inspect one of six metrics, open a figure editor, and review the radar/table/optional 3D representations.
3. **Substantiate:** review metric sources and add tagged observations with an optional link and date.
4. **Act:** choose candidate or employee questions, check them off, and set a review date.
5. **Retain:** save to a device-local watchlist and later reopen or remove the record.
6. **Compare:** choose two companies, see only compatible radar axes, and inspect all six rows—including exclusions and source links.

## Inferred user problems

The following are hypotheses inferred from the product design; they need validation with target users.

1. **“I do not know how to start credible research.”** A candidate may know an employer name but not its employing entity, filing source, reporting period, or which three inputs unlock a meaningful profile.
2. **“I need confidence about my specific offer, not only the parent group.”** Group-level financial health cannot resolve business-unit, geography, contract-entity, role, manager, or compensation-risk questions.
3. **“I can see signals but need a defensible decision conversation.”** Users likely need a short, contextual interpretation, unresolved risks, and tailored questions they can use in interviews or employee discussions.
4. **“I do not have time or expertise to maintain financial inputs.”** Manual collection, unit/currency selection, freshness, and comparability requirements create a substantial activation barrier.
5. **“I need research to persist safely across a real job search.”** A device-only private workspace is suitable for a prototype but fragile for a multi-week, multi-company decision.
6. **“I need to revisit change, not merely remember a date.”** A review date alone does not explain what changed, which source needs refreshing, or why an item deserves attention.

## Positioning opportunity

### Recommended positioning

**Should I Join is an evidence-led employer due-diligence workspace for candidates and employees—not a job-security predictor.** It helps people identify what to verify, compare like-for-like company signals, and prepare better questions before a career decision.

This positioning uses the existing strengths: transparent rules, visible gaps, dated evidence, conservative comparisons, and separate human observations. It avoids language the methodology correctly rejects: “safety score,” “risk prediction,” “benchmark,” or a promise that the product can determine whether someone should accept, leave, or stay.

### Audience focus for discussion

Start with **Singapore-based knowledge workers evaluating offers at public or late-stage companies**, plus employees monitoring material change at their employer. This matches the current regional interface, ACRA/SGX verification affordances, USD/SGD support, and initial public-company snapshots. It is a focus hypothesis, not a claim that this audience has been validated.

### Differentiation to protect

- Explainable six-check research rather than opaque scoring.
- Evidence and data-quality visibility rather than polished but unqualified rankings.
- Candidate and employee actions alongside financial signals.
- Strict comparability rather than forcing every company into the same visual.

## Recommendations and priorities

Priorities reflect expected user value, dependency order, risk reduction, and fit with current product principles. They do **not** represent an implementation commitment or effort estimate.

### P0 — Improve first-assessment activation and decision clarity

| Recommendation | User problem addressed | Proposed outcome / measure for later validation | Notes and guardrails |
| --- | --- | --- | --- |
| Add a guided “Start an assessment” flow. | Users do not know where to start or what evidence is sufficient. | More new assessments reach a minimum useful state: confirmed scope plus at least three current, dated checks or a clearly explained gap plan. | Ask for candidate vs employee context, country, employing entity/group scope, and the company’s public/private status. Never imply an identity match has occurred unless a verified service is present. |
| Add a coverage-first research plan. | Blank manual checks are cognitively heavy. | Users can see the smallest next action, required source, and reason a metric is unavailable. | Reuse the existing six-metric rules; sequence by decision value and input dependencies. Show “not applicable” separately from “missing.” |
| Create a concise “decision brief” view/export. | Findings are difficult to carry into an interview or personal decision discussion. | A user can produce a readable summary of scope, dated signals, concerns, unknowns, evidence links, and tailored questions. | Default to a non-prescriptive heading such as “Research brief”; include a prominent scope, freshness, and non-predictive disclaimer. Decide privacy and export format before implementation. |
| Consolidate trust context at points of interpretation. | Caveats are distributed and can be missed. | Users can state what the assessment covers, what is unknown, and why a comparison is excluded. | Keep existing methodology route; add concise, contextual messages near the headline, comparison, and export surfaces rather than adding generic legal copy. |

### P1 — Make research more trustworthy and repeatable

| Recommendation | User problem addressed | Proposed outcome / measure for later validation | Dependencies / guardrails |
| --- | --- | --- | --- |
| Introduce verified entity resolution and scope selection. | Employer names and group results may not match the employing entity. | Users can deliberately select/record the legal entity, group relationship, jurisdiction, and confidence level. | Requires authoritative/licensed source choice, match-confidence rules, correction workflow, and clear treatment of private companies. Do not auto-assert a match from a name alone. |
| Add source-assisted data capture before automatic assessment. | Manual entry creates friction and provenance errors. | Users can import/review extracted filing values and retain source, date, period, units, and derivation notes. | Start with cited public filings and human confirmation. Define source licences, extraction quality thresholds, correction history, and unsupported-metric behaviour before automation. |
| Add role- and offer-specific research prompts. | Company health is not the same as a user’s position risk. | Candidate briefs include role-relevant questions about employing entity, probation, compensation, runway, team, geography, and change exposure. | Treat answers as user research/observations—not validated company facts or scoring inputs—unless a future methodology explicitly supports them. |
| Enable secure account-backed persistence and portable backup. | Device-only research is fragile. | Users can recover their work and continue across devices, with explicit data controls. | Requires authentication, data retention/deletion policy, security review, migration strategy, and privacy notice. Do not treat localStorage data as consent to upload. |

### P2 — Deliver monitored change and broader utility

| Recommendation | User problem addressed | Proposed outcome / measure for later validation | Dependencies / guardrails |
| --- | --- | --- | --- |
| Build change-aware watchlists. | Review dates alone do not surface meaningful changes. | Users receive an in-product review queue showing new filings, stale inputs, changed values, and user-defined review triggers. | Only after licensed/reliable retrieval, entity mapping, data freshness policy, notification preference/consent, and operational ownership exist. State source and change reason with every alert. |
| Add comparison sets and contextual peer framing. | Two-company comparison is useful but not sector context. | Users can compare carefully selected peers while seeing data compatibility and sector/context limitations. | Do not introduce percentiles or rankings until peer definitions, coverage, methodology, and validation are adequate. |
| Develop a research-quality layer. | Coverage counts completeness, not credibility. | Users can distinguish source quality, data age, entity certainty, and self-entered vs verified fields. | Define transparent labels; avoid a deceptively precise confidence score. |

## Proposed enhancement roadmap for Sayyid Khan and Clement

### Phase 1 — Make the existing workspace easier to complete (P0)

**Goal:** Improve the first session without changing the six-check methodology.

1. Define a minimum viable assessment: entity/scope note, user context, and a visible plan to obtain or explain three current checks.
2. Design the guided entry flow and coverage-first next-action list.
3. Design a research-brief surface that turns existing signals, gaps, sources, observations, and checklist prompts into a shareable decision conversation.
4. Test comprehension with target users: what the screening says, does not say, and what they do next.

**Exit discussion:** Do users complete meaningful research more often, and can they accurately explain that the output is not a recommendation or prediction?

### Phase 2 — Establish trusted data foundations (P1)

**Goal:** Reduce manual entry without overstating data coverage or verification.

1. Choose the first entity source and financial/filing data source; confirm licensing, regional coverage, and cost.
2. Define an entity-resolution model: match confidence, group/subsidiary hierarchy, user correction, and display language.
3. Prototype source-assisted capture with explicit user confirmation, provenance, dates, units, and derivation notes.
4. Specify privacy, authentication, retention/deletion, backup, and migration before enabling account-backed persistence.

**Exit discussion:** Can the team reliably identify the entity and present sourced data with enough provenance for a user to review and correct it?

### Phase 3 — Support ongoing decisions responsibly (P2)

**Goal:** Make saved research useful over time.

1. Implement an in-product stale-data and review queue.
2. Add monitored changes only for sources and entities with reliable scheduled retrieval.
3. Add notification preferences after proving the change feed is accurate and actionable.
4. Explore peer/context views only after a sufficient, comparable dataset exists.

**Exit discussion:** Are alerts timely, attributable, and useful enough that they increase confidence rather than anxiety or noise?

## Assumptions and constraints

- This brief assumes the repository reflects the intended current product. No production or staging interaction was performed.
- The analysis assumes users can access public filings and employer information; it does not assume legal, licensing, or data-provider rights for automated retrieval.
- Existing threshold rules, freshness window, currency support, and comparison exclusions are treated as current product policy, not as validated risk science.
- “Singapore-focused” is inferred from the UI and external verification links, not from user analytics or a documented market strategy.
- Recommendations preserve the documented rule that group-level health cannot establish a particular role’s security.
- No application code, configuration, dependencies, deployment settings, production/staging state, or credentials were modified for this brief.

## Open questions for Sayyid Khan and Clement

### Strategy and audience

1. Which job-search moment matters most: initial company screening, active offer evaluation, or ongoing employee monitoring?
2. Is the first target limited to Singapore and public/late-stage employers, or should the product serve private-company research from the start?
3. What is the intended business model, and does it create incentives that could undermine perceived research independence?

### Product and methodology

4. What minimum evidence should qualify an assessment as useful: three dated checks, all six, or a context-dependent threshold?
5. Which non-financial factors are essential to the decision journey but must remain outside the six-metric screening method?
6. What user language most clearly distinguishes a research brief from a recommendation, rating, or prediction?
7. Should users be able to share/export sensitive observations, and what redaction choices are required?

### Data, privacy, and operations

8. Which entity and financial-data providers are legally available, affordable, and sufficiently attributable for the target market?
9. Who owns correction handling, source updates, stale-data policy, and incident response when automated data is introduced?
10. What consent, retention, deletion, and security requirements apply before research leaves browser-local storage?
11. What change types are valuable enough to alert on, and how will false or noisy alerts be prevented?

## Validation plan before committing to a build

1. Conduct 5–8 moderated sessions across candidates and current employees. Test a new-company start, entity/scope understanding, manual source entry, comparison, and interpretation of the non-predictive disclaimer.
2. Measure activation: proportion reaching a defined minimum assessment, time to first dated input, and the points where users abandon the flow.
3. Measure comprehension: ask participants what the product can and cannot conclude about a job offer and their specific role.
4. Validate the decision brief: assess whether participants use it to generate better questions without interpreting it as an accept/reject recommendation.
5. Before data automation, run a provenance and entity-matching pilot with a small, licensed source set; sample outputs for accuracy, scope, freshness, and correction handling.

## Recommendation for the next decision

Agree on the **Phase 1 minimum viable assessment** and its success criteria before expanding data coverage. It is the lowest-dependency way to reduce the current manual-research barrier while protecting Should I Join’s strongest differentiator: transparent, evidence-led decision support without false predictive certainty.
