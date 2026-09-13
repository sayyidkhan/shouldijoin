import {evaluate,specs,today,type Company,type MetricId,type Tone} from './model.ts';

export type RadarReading={id:MetricId;label:string;score:number|null;value:string;detail:string;tone:Tone;date:string;period:string};
export const RADAR_RULES=[
 {id:'cashflow',label:'Cash generation',formula:'Operating cash flow ÷ same-period revenue',anchors:'−20% → 0 · 0% → 40 · 10% → 70 · 30% → 100'},
 {id:'runway',label:'Cash runway',formula:'Unrestricted cash ÷ monthly net burn',anchors:'0 months → 0 · 6 → 30 · 12 → 65 · 24 → 100'},
 {id:'debt',label:'Cash / debt',formula:'Defined cash-like assets ÷ borrowings',anchors:'0× → 0 · 1× → 50 · 3× → 100'},
 {id:'growth',label:'Revenue growth',formula:'Reported year-on-year revenue change',anchors:'−20% → 0 · 0% → 40 · 10% → 65 · 30% → 100'},
 {id:'margin',label:'Profitability',formula:'Operating profit ÷ revenue',anchors:'−10% → 0 · 0% → 40 · 5% → 65 · 20% → 100'},
 {id:'payroll',label:'Salary reliability',formula:'On-time payments ÷ last 3 monthly payments',anchors:'0 of 3 → 0 · 1 → 33 · 2 → 67 · 3 → 100'},
] as const;
export function normalizeRange(value:number,anchors:readonly (readonly [number,number])[]):number|null {
 if(!Number.isFinite(value))return null;
 if(value<=anchors[0][0])return anchors[0][1];
 for(let i=1;i<anchors.length;i++){const [x,y]=anchors[i],[px,py]=anchors[i-1];if(value<=x)return py+(value-px)/(x-px)*(y-py);}
 return anchors[anchors.length-1][1];
}
const percent=(v:number)=>`${v>0?'+':''}${v.toFixed(1)}%`;
export function radarProfile(company:Company,now=today()):RadarReading[]{
 return RADAR_RULES.map(rule=>{
  const spec=specs.find(s=>s.id===rule.id)!,input=company.metrics[rule.id],r=evaluate(spec,input,now);
  const base:RadarReading={id:rule.id,label:rule.label,score:null,value:'Unknown',detail:r.stale?'Refresh the reporting date.':'Figures needed.',tone:r.tone,date:input?.date??'',period:input?.period??''};
  if(!input||!r.complete||r.stale)return base;
  const [a,b]=input.values;
  let score:number|null=null,value=r.value+(r.unit?' '+r.unit:''),detail=rule.formula as string;
  switch(rule.id){
   case 'cashflow':{
    const revenue=company.metrics.margin,valid=evaluate(specs.find(s=>s.id==='margin')!,revenue,now);
    if(!revenue||!valid.complete||valid.stale||revenue.date!==input.date||revenue.period.trim().toLowerCase()!==input.period.trim().toLowerCase()||revenue.currency!==input.currency)return {...base,detail:'Add revenue for the same period, date and currency to compare cash generation.'};
    const margin=a/revenue.values[1]*100;
    score=normalizeRange(margin,[[-20,0],[0,40],[10,70],[30,100]]);value=percent(margin);detail='Operating cash flow as a share of revenue.';break;
   }
   case 'runway':if(b===0)return {...base,value:'N/A',detail:'Zero burn: a finite runway cannot be estimated.'};score=normalizeRange(r.numeric!,[[0,0],[6,30],[12,65],[24,100]]);break;
   case 'debt':{
    if(a===0&&b===0)return {...base,detail:'Both balances are zero; no cash-to-debt ratio is available.'};
    const ratio=b===0?null:a/b;
    score=b===0?100:normalizeRange(ratio!,[[0,0],[1,50],[3,100]]);value=b===0?'No borrowings':Number.isFinite(ratio)?ratio!.toFixed(2)+'×':'Out of range';detail='Defined cash-like assets for each dollar of borrowings. Definitions may differ.';break;
   }
   case 'growth':score=normalizeRange(a,[[-20,0],[0,40],[10,65],[30,100]]);value=percent(a);break;
   case 'margin':score=normalizeRange(r.numeric!,[[-10,0],[0,40],[5,65],[20,100]]);value=percent(r.numeric!);break;
   case 'payroll':score=(3-a)/3*100;value=`${3-a} / 3 on time`;break;
  }
  return {...base,score:score===null?null:Math.max(0,Math.min(100,score)),value:score===null?'Unknown':value,detail};
 });
}
export function companyPeriod(company:Company){const periods=[...new Set(Object.values(company.metrics).map(m=>m?.period).filter(Boolean))];return periods.length===1?periods[0]! : periods.length?'Mixed periods':'No figures';}

export function compareProfiles(a:Company,b:Company,now=today()){
 const left=radarProfile(a,now),right=radarProfile(b,now);
 const rows=left.map((l,i)=>{
  const r=right[i];let reason='';
  if(l.score===null||r.score===null)reason=l.score===null&&r.score===null?'Missing in both':l.score===null?'Missing for '+a.name:'Missing for '+b.name;
  else if(l.date!==r.date||l.period.trim().toLowerCase()!==r.period.trim().toLowerCase())reason='Different reporting periods';
  else if(l.id==='debt'&&(a.metrics.debt?.cashBasis!=='cash_equivalents'||b.metrics.debt?.cashBasis!=='cash_equivalents'))reason='Cash definitions not comparable';
  return {left:l,right:r,comparable:!reason,reason};
 });
 return {left,right,rows,shared:rows.filter(r=>r.comparable).map(r=>r.left.id)};
}
export function directoryReadout(company:Company,now=today()){
 const results=specs.map(s=>evaluate(s,company.metrics[s.id],now));
 const positive=results.filter(r=>r.tone==='positive').length,review=results.filter(r=>r.tone==='watch'||r.tone==='concern').length,unknown=results.filter(r=>r.tone==='unknown').length;
 const concern=results.some(r=>r.tone==='concern')||company.evidence.some(e=>e.signal==='concern');
 return {label:concern?'Concerns flagged':review?'Mixed signals':positive&&unknown?'Positive so far':positive?'Positive signals':'Not assessed',tone:concern?'concern':review?'watch':positive?'positive':'unknown',positive,review,unknown,results};
}
export function mergeCompanies(...groups:Company[][]){const records=new Map<string,Company>();for(const group of groups)for(const c of group)records.set(c.id,c);return [...records.values()];}
