import {Company, MetricInput} from './model';
export const GRAB_SOURCE='https://www.grab.com/sg/press/others/grab-reports-record-second-quarter-2026-results-raises-full-year-guidance-and-announces-750-million-share-repurchase-program/';
function input(values:number[],note:string):MetricInput{return {values,date:'2026-06-30',period:'Q2 2026',url:GRAB_SOURCE,note,currency:'USD',origin:'disclosure'};}
export const sample:Company={
 id:'grab',name:'Grab',entity:'Grab Holdings Limited · NASDAQ: GRAB · Group-level results',reviewed:'2026-09-13',next:'',checks:[],
 metrics:{
  cashflow:input([56],'Operating cash flow: US$56m, versus US$64m a year earlier. Unaudited company disclosure published 4 August 2026.'),
  debt:input([7400,2000],'Uses Grab’s non-IFRS gross cash liquidity of US$7.4bn and net cash liquidity of US$5.4bn. Borrowings of US$2.0bn are the difference between rounded reported amounts. Gross cash liquidity includes restricted cash, deposits and marketable securities. This is not unrestricted cash runway.'),
  growth:input([22],'Reported year-on-year revenue growth. Q2 revenue: US$997m. Includes acquisitions and currency effects.'),
  margin:input([19,997],'Calculated from reported operating profit of US$19m and revenue of US$997m. This uses operating profit, not the US$235m headline net profit, which includes non-operating effects.'),
 },
 evidence:[
 {id:'g1',category:'Financial position',signal:'positive',note:'Operating cash flow was positive in Q2 2026; the company also reported a positive net cash liquidity position.',url:GRAB_SOURCE,date:'2026-08-04'},
 {id:'g2',category:'Business momentum',signal:'unknown',note:'Headline profit includes non-operating effects. Review operating margin separately when assessing the core business.',url:GRAB_SOURCE,date:'2026-08-04'}
 ]
};
export const questions={joining:['Confirm the legal entity and UEN on your offer.','Ask whether the role is funded for the next 12 months.','Ask why the position is open and how the team has changed.','Ask what would cause the hiring plan to change.'],working:['Keep a dated record of changes you observe.','Review salary and expense payment dates.','Ask about team budgets and upcoming priorities.','Update your CV and review your personal cash buffer.']};
