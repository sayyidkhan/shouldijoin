# Should I Join

A company research workspace for professionals deciding whether to join an employer or preparing for changes at their current company. Created by Sayyid Khan, inspired by the impact that sudden business closures have on employees and customers.

## What works

- Open a check for any company name or UEN.
- Read a curated, source-linked Grab Holdings snapshot from its Q2 2026 disclosures.
- Record dated evidence across financial position, business momentum, people and operations, and legal and governance.
- Mark evidence as positive, a concern, or needing more context.
- Work through separate questions for joining a company and already working there.
- Save company checks to a browser-local watchlist and set review dates.
- Use direct links to ACRA Bizfile, SGX announcements and Grab investor relations.
- Responsive layout, keyboard-accessible controls, and feature-detected WebMCP company-check navigation.

## Coverage and limits

This first version is a **guided research MVP**, not an automated company-health data service. Searching an unsupported company opens an empty workspace; it does not resolve a UEN, fetch accounts, or invent a rating. Grab is the only curated report. Its evidence is a dated snapshot, not live data. A parent company's results are not a guarantee about the employing subsidiary.

An evidence link is not automatically verified. Personal observations are labelled. Coverage is simply the number of research areas with an evidence item, out of four. Any concern changes the assessment to “Concerns to investigate”; all other cases retain an incomplete/unknown assessment. There is no insolvency probability or universal health score.

Watchlists and notes stay in localStorage on the current browser. They do not sync across devices and are removed if browser data is cleared. Review dates are displayed in the app; no background monitoring, email or push alerts are implemented.

## Technology and hosting

Built and hosted exclusively with **GPT Sites**, using its Vinext/React starter and Cloudflare Worker delivery. GitHub stores source code; it is not the hosting provider.

- React 19 / TypeScript / Vinext
- GPT Sites deployment configuration: `.openai/hosting.json`
- Tailwind CSS and included Shadcn/Radix UI primitives
- Lucide icons
- Browser-local state; no external database or required API key

## Development

Requires Node 22.13+ and the pnpm version declared in `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

```bash
pnpm build
```

The Sites execution profile is local and ignored by Git. In the managed GPT Sites environment, use the Sites plugin's setup, installation, build and publication helpers. Keep the existing project ID when updating this site. Publish through GPT Sites, not GitHub Pages, Vercel, or another hosting provider.

## Source layout

| Path | Purpose |
| --- | --- |
| `app/page.tsx` | Company research workspace, watchlist, methodology, evidence and local persistence |
| `app/globals.css` | Responsive visual system and theme |
| `app/layout.tsx` | Document metadata |
| `public/favicon.svg` | Site brand mark |
| `components/ui/` | Included accessible UI primitives |
| `.openai/hosting.json` | GPT Sites project identity |

## Next product milestone

Connect licensed company identity, filing and financial data with a server-side provider integration. Add source retrieval timestamps, entity matching and data-quality checks before introducing automated assessments. For cross-device monitoring, add authenticated Sites-backed persistence and a real scheduled retrieval/notification workflow. Do not label manual or cached information as live.

## Validation

Production build passes. Browser/end-to-end QA and WebMCP runtime validation have not been performed in this environment. The WebMCP tool is optional and feature-detected; normal UI interaction does not depend on it.
