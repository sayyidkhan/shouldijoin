import type {Company, MetricInput} from './model';
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

export const SEA_SOURCE='https://www.sec.gov/Archives/edgar/data/1703399/000119312526344596/d120948dex991.htm';
export const SEA_Q1_SOURCE='https://www.sec.gov/Archives/edgar/data/1703399/000119312526219378/d78490dex991.htm';
function seaInput(values:number[],note:string):MetricInput{return {values,date:'2026-06-30',period:'Q2 2026',url:SEA_SOURCE,note,currency:'USD',origin:'disclosure'};}
export const sea:Company={
 id:'sea',name:'Sea',entity:'Sea Limited · NYSE: SE · Group-level results',reviewed:'2026-09-13',next:'',checks:[],
 metrics:{
  cashflow:seaInput([1505.979],'Q2 operating cash flow derived from H1 US$2,563.884m less Q1 US$1,057.905m. Both unaudited releases use consolidated cash flow statements; Q1 release is linked in the observations.'),
  debt:seaInput([3529.303,2220.627],'Cash and cash equivalents only: US$3,529.303m. Borrowings include current US$316.165m, non-current US$908.151m and convertible notes US$996.311m. Excludes restricted cash, investments, leases, customer deposits and escrow liabilities. This cash definition is narrower than Grab’s gross cash liquidity; check definitions before comparing.'),
  growth:seaInput([48.1],'Reported Q2 year-on-year GAAP revenue growth.'),
  margin:seaInput([650.329,7787.779],'Operating income divided by GAAP revenue; figures in US$ millions. Unaudited Q2 2026 release published 11 August 2026.'),
 },
 evidence:[{id:'s1',category:'Financial position',signal:'unknown',note:'Q1 operating cash flow of US$1,057.905m is subtracted from H1 in the Q2 release to obtain the quarterly figure.',url:SEA_Q1_SOURCE,date:'2026-05-12'},{id:'s2',category:'Financial position',signal:'unknown',note:'Group includes credit and payments businesses. Cash-versus-borrowings excludes customer deposits and escrow liabilities, and does not establish cash available to the employing entity.',url:SEA_SOURCE,date:'2026-08-11'}]
};
sample.metrics.debt!.cashBasis='company_liquidity';
sea.metrics.debt!.cashBasis='cash_equivalents';
export const companies:Company[]=[sample,sea];
export const companyMeta:Record<string,{ticker:string;sector:string;aliases:string[]}>={
 grab:{ticker:'NASDAQ: GRAB',sector:'Mobility · delivery · fintech',aliases:['grab holdings','grab holdings limited']},
 sea:{ticker:'NYSE: SE',sector:'Commerce · gaming · fintech',aliases:['sea limited','shopee','garena','monee']},
};
