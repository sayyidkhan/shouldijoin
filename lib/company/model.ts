export type MetricId = 'cashflow' | 'runway' | 'debt' | 'growth' | 'margin' | 'payroll';
export type Tone = 'positive' | 'watch' | 'concern' | 'unknown';
export type Evidence = { id: string; category: string; signal: string; note: string; url: string; date: string };
export type MetricInput = { values: number[]; date: string; period: string; url: string; note: string; currency: 'USD' | 'SGD'; origin: 'disclosure' | 'user' };
export type Company = { id: string; name: string; entity: string; evidence: Evidence[]; reviewed: string; next: string; checks: string[]; metrics: Partial<Record<MetricId, MetricInput>> };
export type MetricSpec = { id: MetricId; group: string; title: string; question: string; description: string; formula: string; fields: {label: string; min?: number; max?: number; integer?: boolean}[]; monetary: boolean; bands: string[]; caveat: string; action: string };
export type Result = { value: string; unit: string; tone: Tone; label: string; explanation: string; numeric: number | null; stale: boolean; complete: boolean };
export const categories = ['Financial position', 'Business momentum', 'People & operations', 'Legal & governance'];
export const specs: MetricSpec[] = [
  {id:'cashflow',group:'Cash resilience',title:'Operating cash flow',question:'Does the business generate cash?',description:'Cash generated or consumed by everyday operations during the reporting period.',formula:'Net cash from operating activities, as reported in the cash flow statement.',fields:[{label:'Operating cash flow (millions)'}],monetary:true,bands:['Below 0: cash consumed','0: break-even','Above 0: cash generated'],caveat:'This excludes investing and financing cash flows. One positive period does not establish a sustainable cash position.',action:'Ask whether operating cash generation is recurring or driven by temporary working-capital movements.'},
  {id:'runway',group:'Cash resilience',title:'Cash runway',question:'How long can the cash last?',description:'An estimate of how long unrestricted cash lasts if the current rate of net cash spending continues.',formula:'Unrestricted cash ÷ average monthly net cash burn.',fields:[{label:'Unrestricted cash (millions)',min:0},{label:'Monthly net cash burn (millions)',min:0}],monetary:true,bands:['Under 6 months: short','6–12 months: watch','12+ months: more buffer'],caveat:'A planning estimate, not a forecast. Excludes future funding and assumes constant burn. Restricted cash and customer deposits must not be included. Zero burn does not mean infinite runway.',action:'Ask for unrestricted cash, recent monthly net burn and committed funding; do not estimate runway from a headline funding round.'},
  {id:'debt',group:'Debt pressure',title:'Net cash position',question:'Does cash exceed borrowings?',description:'The cash balance remaining after subtracting loans and borrowings.',formula:'Cash and cash-like assets in the stated definition − loans and borrowings.',fields:[{label:'Cash and cash-like assets (millions)',min:0},{label:'Loans and borrowings (millions)',min:0}],monetary:true,bands:['Below 0: net debt','0: balanced','Above 0: net cash'],caveat:'Net debt is not proof of distress. Check repayment dates, covenants and cash restrictions. Company-defined cash liquidity measures can include restricted cash and may not be comparable.',action:'Ask which debts mature in the next 12 months and how much cash is actually available to the employing entity.'},
  {id:'growth',group:'Business performance',title:'Revenue growth',question:'Is the business growing?',description:'The reported change in revenue against the same period a year earlier.',formula:'(Current revenue − same-period prior-year revenue) ÷ prior-year revenue × 100. A directly reported YoY percentage can be entered.',fields:[{label:'Year-on-year revenue growth (%)',min:-100}],monetary:false,bands:['Below −10%: contracting','−10% to 0%: watch','Above 0%: growing'],caveat:'Growth can come from acquisitions or exchange rates. Compare like periods. The bands are product screening rules, not industry benchmarks.',action:'Ask how much growth is organic and whether it is concentrated in a few customers or products.'},
  {id:'margin',group:'Business performance',title:'Operating margin',question:'Does the core business make a profit?',description:'The share of revenue left after operating expenses, before financing and tax.',formula:'Operating profit ÷ revenue × 100.',fields:[{label:'Operating profit / loss (millions)'},{label:'Revenue (millions)',min:0}],monetary:true,bands:['Below 0%: operating loss','0–5%: thin margin','5%+: more room'],caveat:'Margins vary widely by industry. The 5% band is an illustrative screening rule, not a sector benchmark. Use operating profit, not net profit or adjusted EBITDA.',action:'Ask what happens to the team budget if revenue slows or operating costs rise.'},
  {id:'payroll',group:'Employment stability',title:'Salary reliability',question:'Are people being paid on time?',description:'The number of the last three monthly salary payments that arrived after their contractual due date.',formula:'Count late monthly salary payments in the last three payment cycles (0–3).',fields:[{label:'Late payments in the last 3 cycles',min:0,max:3,integer:true}],monetary:false,bands:['0: paid on time','1: investigate','2–3: repeated delays'],caveat:'Use dated firsthand records or a clearly identified source. An isolated payroll error is different from persistent funding problems. On-time pay does not prove future stability.',action:'Ask for the reason, expected resolution and whether salary or expense payment delays are recurring.'},
];
export function safeURL(value:string):string|undefined {try {const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:undefined;} catch{return undefined;}}
export function today(){return new Date().toISOString().slice(0,10);}
export function validDate(date:string){return /^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&new Date(date).toISOString().slice(0,10)===date;}
export function inputError(spec:MetricSpec,input:MetricInput,now=today()):string|null {
  if(input.values.length!==spec.fields.length)return 'Complete every numeric field.';
  for(let i=0;i<spec.fields.length;i++){const f=spec.fields[i],v=input.values[i];if(!Number.isFinite(v)||(f.min!==undefined&&v<f.min)||(f.max!==undefined&&v>f.max)||(f.integer&&!Number.isInteger(v)))return 'Check '+f.label.toLowerCase()+'.';}
  if(spec.id==='margin'&&input.values[1]===0)return 'Revenue must be greater than zero to calculate a margin.';
  if(!validDate(input.date)||input.date>now)return 'Use a valid reporting date that is not in the future.';
  if(!input.period.trim())return 'Add the reporting period or observation window.';
  if(input.url&&!safeURL(input.url))return 'Use a valid http:// or https:// source link.';
  if(!['USD','SGD'].includes(input.currency))return 'Choose a supported currency.';
  return null;
}
function money(n:number){const abs=Math.abs(n),sign=n<0?'−':n>0?'+':'';return {value:sign+'$'+(abs>=1000?Number((abs/1000).toFixed(2)):Number(abs.toFixed(1))),unit:abs>=1000?'bn':'m'};}
export function evaluate(spec:MetricSpec,input?:MetricInput,now=today()):Result {
 const empty:Result={value:'—',unit:'',tone:'unknown',label:'Not available',explanation:'Add the missing figures to evaluate this metric.',numeric:null,stale:false,complete:false};
 if(!input||inputError(spec,input,now))return empty;
 const [a,b]=input.values;let numeric=a,tone:Tone='positive',label='',explanation='',value='',unit='';
 switch(spec.id){
  case 'cashflow':({value,unit}=money(a));tone=a<0?'concern':a===0?'watch':'positive';label=a<0?'Cash consumed':a===0?'Break-even':'Cash generated';explanation=a>0?'Operations brought in more cash than they used.':a<0?'Operations used cash during this period.':'Operations did not add to the cash buffer.';break;
  case 'runway':if(b===0)return {...empty,value:'No burn',label:'Not applicable',explanation:'No net burn was entered. A finite runway cannot be estimated.',complete:true,stale:Date.parse(now)-Date.parse(input.date)>180*86400000};numeric=a/b;value=Number(numeric.toFixed(1)).toString();unit='months';tone=numeric<6?'concern':numeric<12?'watch':'positive';label=numeric<6?'Short runway':numeric<12?'Watch the buffer':'More cash buffer';explanation='At the entered burn rate, cash covers about '+Number(numeric.toFixed(1))+' months.';break;
  case 'debt':numeric=a-b;({value,unit}=money(numeric));tone=numeric<0?'watch':numeric===0?'watch':'positive';label=numeric<0?'Net debt':numeric===0?'Balanced':'Net cash';explanation=numeric>0?'Reported cash-like assets exceed loans and borrowings.':'Check debt maturities and access to refinancing.';break;
  case 'growth':value=(a>0?'+':a<0?'−':'')+Math.abs(a).toFixed(1);unit='%';tone=a< -10?'concern':a<=0?'watch':'positive';label=a>0?'Growing':a===0?'Flat':'Contracting';explanation='Revenue '+(a>0?'grew':a<0?'fell':'was unchanged')+' compared with the same period a year earlier.';break;
  case 'margin':numeric=a/b*100;value=(numeric<0?'−':'')+Math.abs(numeric).toFixed(1);unit='%';tone=numeric<0?'concern':numeric<5?'watch':'positive';label=numeric<0?'Operating loss':numeric<5?'Thin margin':'More margin';explanation=numeric>=0?'About '+numeric.toFixed(1)+' cents of operating profit per dollar of revenue.':'The core business recorded an operating loss.';break;
  case 'payroll':value=String(a);unit='late / 3';tone=a===0?'positive':'concern';label=a===0?'Paid on time':a===1?'Payment delay':'Repeated delays';explanation=a===0?'All three reported monthly salary payments arrived on time.':'Confirm the cause and whether the payment issue has been resolved.';break;
 }
 if(!Number.isFinite(numeric))return {...empty,label:'Check figures',explanation:'These inputs exceed a usable calculation range.'};
 const stale=Date.parse(now)-Date.parse(input.date)>180*86400000;
 return {value,unit,numeric,tone:stale?'unknown':tone,label:stale?'Needs updating':label,explanation:stale?'The reporting date is over 180 days old. Refresh this figure before relying on it.':explanation,stale,complete:true};
}
export function summary(company:Company,now=today()){
 const results=specs.map(s=>evaluate(s,company.metrics[s.id],now));
 const positive=results.filter(r=>r.tone==='positive').length,watch=results.filter(r=>r.tone==='watch').length,concern=results.filter(r=>r.tone==='concern').length,unknown=results.filter(r=>r.tone==='unknown').length;
 const flags=company.evidence.filter(e=>e.signal==='concern').length;
 return {results,positive,watch,concern,unknown,flags,available:results.filter(r=>r.complete&&!r.stale).length,
  title:concern||flags?'Investigate before committing':watch?'Ask a few harder questions':unknown?'Complete the missing checks':'Available signals are positive',
  text:concern||flags?'The figures or your evidence flag a concern. Verify the cause and how the company plans to address it.':watch?'Some reported figures deserve a closer look. Use the questions below before making your decision.':unknown?'The available figures only cover part of the picture. Fill the gaps before drawing a conclusion.':'These inputs are reassuring within their scope. Confirm the employing entity and the security of your specific role.',
  tone:(concern||flags?'concern':watch?'watch':unknown?'unknown':'positive') as Tone};
}
export function normalize(raw:unknown):Company|null {
 if(!raw||typeof raw!=='object')return null;const r=raw as Partial<Company>;
 if(typeof r.id!=='string'||typeof r.name!=='string'||!Array.isArray(r.evidence)||!Array.isArray(r.checks))return null;
 const metrics:Company['metrics']={};
 for(const spec of specs){const m=r.metrics?.[spec.id];if(m&&typeof m==='object'&&Array.isArray(m.values)&&typeof m.date==='string'&&typeof m.period==='string'&&typeof m.note==='string'&&typeof m.url==='string'&&['USD','SGD'].includes(m.currency))metrics[spec.id]=m;}
 return {id:r.id,name:r.name,entity:typeof r.entity==='string'?r.entity:'Entity not confirmed',reviewed:typeof r.reviewed==='string'?r.reviewed:'',next:typeof r.next==='string'?r.next:'',checks:r.checks.filter(x=>typeof x==='string'),evidence:r.evidence.filter(e=>e&&['id','category','signal','note','url','date'].every(k=>typeof (e as unknown as Record<string,unknown>)[k]==='string')),metrics};
}
