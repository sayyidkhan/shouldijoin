'use client';

import {ArrowUpRight,BookOpen,Info} from 'lucide-react';
import {Accordion,AccordionItem,AccordionTrigger,AccordionContent} from '@/components/ui/accordion';
import {Table,TableHeader,TableBody,TableRow,TableHead,TableCell} from '@/components/ui/table';
import {specs} from '@/lib/company/model';
import {RADAR_RULES} from '@/lib/company/radar';
import {GRAB_SOURCE,SEA_SOURCE,SEA_Q1_SOURCE} from '@/lib/company/data';

export const METHODOLOGY_DOCUMENT='https://github.com/sayyidkhan/shouldijoin/blob/main/docs/methodology.md';

const bands:Record<string,string>={
 cashflow:'Below 0: concern · 0: review · above 0: positive',
 runway:'Under 6 months: concern · 6 to under 12: review · 12+: positive',
 debt:'Cash less than or equal to borrowings: review · cash above borrowings: positive',
 growth:'Below −10%: concern · −10% through 0%: review · above 0%: positive',
 margin:'Below 0%: concern · 0 to under 5%: review · 5%+: positive',
 payroll:'0 late payments: positive · 1–3 late payments: concern',
};

export function Methodology(){
 return <main className="method-page assessment-methodology">
  <span className="eyebrow">METHODOLOGY · SCREENING RULES V1</span>
  <h1>How we assess<br/>company health.</h1>
  <p className="method-intro">Six separate checks. Dated evidence. Visible assumptions.</p>
  <div className="method-status"><Info size={21}/><div><strong>A screening framework, with limits</strong><p>We chose fixed thresholds for this prototype. They have not been calibrated against industry peers or historical company failures. The readings help you ask questions; they do not predict a closure or guarantee a job.</p></div></div>
  <div className="method-process" aria-label="Assessment process">
   <div><span>01</span><h2>Check the inputs</h2><p>Record the entity, reporting period, figures and source.</p></div>
   <div><span>02</span><h2>Read each signal</h2><p>Keep cash, growth, profit and pay as separate checks.</p></div>
   <div><span>03</span><h2>Compare fairly</h2><p>Plot compatible ratios. Keep missing evidence visible.</p></div>
  </div>
  <Accordion type="multiple" className="method-accordions">
   <AccordionItem value="checks"><AccordionTrigger><span><small>01 / THE CHECKS</small>What we measure and how we label it</span></AccordionTrigger><AccordionContent>
    <p>Colours use screening bands. Radar distances use the separate scales below. There is no combined safety score.</p>
    <div className="method-checks">{specs.map(s=><section key={s.id}><span>{s.group}</span><h3>{s.title}</h3><p className="method-formula">{s.formula}</p><p className="method-band">{bands[s.id]}</p><p>{s.caveat}</p></section>)}</div>
    <p>A numeric concern or a recorded observation marked “Concern” takes priority in the readout. Otherwise, review readings produce mixed signals. Positive readings with gaps are labelled “Positive so far”; an unassessed company stays “Not assessed”. Observations do not change radar values.</p>
   </AccordionContent></AccordionItem>
   <AccordionItem value="radar"><AccordionTrigger><span><small>02 / THE RADAR</small>How values become a shape</span></AccordionTrigger><AccordionContent>
    <p>Ratios and percentages help compare companies of different sizes. Each axis maps to a fixed 0–100 range; further out means a stronger reading under our chosen rules. These values are not percentiles or probabilities.</p>
    <Table><TableHeader><TableRow><TableHead>Dimension</TableHead><TableHead>Measure</TableHead><TableHead>Measure → radar value</TableHead></TableRow></TableHeader><TableBody>{RADAR_RULES.map(r=><TableRow key={r.id}><TableCell>{r.label}</TableCell><TableCell>{r.formula}</TableCell><TableCell>{r.anchors}</TableCell></TableRow>)}</TableBody></Table>
    <div className="method-example"><span>WORKED EXAMPLE · PROFITABILITY</span><p>A <strong>2.5% operating margin</strong> is halfway between 0% and 5%. Those anchors map to 40 and 65, so its radar value is <strong>52.5 / 100</strong>. That is a plotting value, not a 52.5% chance of survival.</p></div>
    <p>Values between anchors are linearly interpolated; values outside the range are capped at 0 or 100. Salary reliability uses the exact fraction of three on-time payments, with rounded labels. The thresholds are product design choices, not empirically validated cut-offs.</p>
    <p>The 3D centrifuge uses fixed heights for positive, review and concern bands. Hollow pillars mean unknown or stale information. It does not use the radar scale or financial magnitude.</p>
   </AccordionContent></AccordionItem>
   <AccordionItem value="comparison"><AccordionTrigger><span><small>03 / COMPARABILITY</small>What we include, exclude and leave unknown</span></AccordionTrigger><AccordionContent>
    <ul><li>Both companies need valid values with matching reporting dates and period labels. Cash generation also needs revenue in the same date, period and currency as operating cash flow.</li><li>Cash / debt is shared only when both cash definitions are explicitly cash and cash equivalents. Company-defined liquidity measures are excluded from this shared axis.</li><li>Missing, invalid or more-than-180-day-old figures are excluded from the polygon. Unknown does not mean zero. The 180-day limit is our product freshness rule.</li><li>Zero cash burn means runway is not applicable. Positive cash with zero borrowings plots at 100; zero cash and zero borrowings has no ratio.</li><li>A radar needs at least three usable dimensions. A comparison uses the same eligible axes for both companies; excluded dimensions stay in the figures table.</li></ul>
    <p>Sector, accounting policy and business model still matter. Matching dates and ratios do not establish that two employers are equally comparable. Never use polygon area to declare a safer employer.</p>
   </AccordionContent></AccordionItem>
   <AccordionItem value="sources"><AccordionTrigger><span><small>04 / THE EVIDENCE</small>Where the figures come from</span></AccordionTrigger><AccordionContent>
    <p>Grab and Sea are curated, unaudited Q2 2026 group snapshots. Other companies use your own figures and sources. There is no live registry lookup, automatic financial feed or background monitoring.</p>
    <div className="method-source-links"><a href={GRAB_SOURCE} target="_blank" rel="noopener noreferrer">Grab · Q2 2026 disclosure <ArrowUpRight size={14}/></a><a href={SEA_SOURCE} target="_blank" rel="noopener noreferrer">Sea · Q2 2026 disclosure <ArrowUpRight size={14}/></a><a href={SEA_Q1_SOURCE} target="_blank" rel="noopener noreferrer">Sea · Q1 cash-flow input <ArrowUpRight size={14}/></a></div>
    <p>Sea’s quarterly operating cash flow is derived by subtracting Q1 from its half-year cash flow. Grab’s broader cash liquidity definition differs from Sea’s cash and cash equivalents. Their cash / debt axis is therefore excluded; the initial shared radar covers cash generation, revenue growth and profitability.</p>
    <p>Confirm the legal entity and UEN on your contract. Group cash may be unavailable to the employing entity. A source link is not independent verification, and on-time pay describes only the three recorded cycles.</p>
   </AccordionContent></AccordionItem>
   <AccordionItem value="validation"><AccordionTrigger><span><small>05 / VALIDATION</small>What has been tested—and what has not</span></AccordionTrigger><AccordionContent>
    <div className="method-validation"><section><h3>Calculation checks</h3><p>22 automated tests cover formulas, threshold boundaries, date checks, missing versus zero inputs, radar scaling, compatible comparisons and saved-data handling.</p></section><section><h3>Predictive validity: untested</h3><p>We have not backtested against closures or layoffs, measured prediction accuracy, calibrated industry benchmarks or independently audited the source data.</p></section></div>
    <p>Passing software tests means those tested behaviours work as specified. It does not establish that a company is financially safe or that a role is secure.</p>
    <p>Before claiming a predictive benchmark, we would need an appropriate peer dataset, dated historical outcomes, an evaluation on unseen periods and published limitations. That work is not part of the current prototype.</p>
   </AccordionContent></AccordionItem>
   <AccordionItem value="privacy"><AccordionTrigger><span><small>06 / YOUR RESEARCH</small>Data coverage, privacy and review dates</span></AccordionTrigger><AccordionContent>
    <p>Coverage counts current, usable inputs out of six. It measures completeness, not credibility; a complete zero-burn entry can count toward coverage while runway remains not applicable.</p>
    <p>Saved research stays in this browser and is not published to other visitors. Clearing browser data removes it. There is no cross-device sync. Review dates appear in your watchlist; automatic alerts are not connected.</p>
   </AccordionContent></AccordionItem>
  </Accordion>
  <div className="method-document-links"><a href={METHODOLOGY_DOCUMENT} target="_blank" rel="noopener noreferrer"><BookOpen size={16}/>Read the full methodology on GitHub <ArrowUpRight size={14}/></a><a href="/methodology">Permanent link to this guide <ArrowUpRight size={14}/></a><span>Rules v1 · documented 13 September 2026</span></div>
 </main>;
}
