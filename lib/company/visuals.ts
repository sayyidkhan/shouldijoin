import type {MetricId,MetricInput,Result,Tone} from './model';

export const SIGNAL_COLORS:Record<Tone,string>={positive:'#b8f36d',watch:'#f5b963',concern:'#ff827d',unknown:'#798984'};
// Heights are ordinal screening bands, not an overall score or financial scale.
// Null deliberately distinguishes missing / stale information from a low reading.
export const SIGNAL_HEIGHTS:Record<Tone,number|null>={positive:3.1,watch:1.65,concern:.6,unknown:null};
export const SHORT_NAMES:Record<MetricId,string>={cashflow:'Cash flow',runway:'Runway',debt:'Net cash',growth:'Growth',margin:'Margin',payroll:'Salary'};
export const TONE_NAMES:Record<Tone,string>={positive:'Positive',watch:'Review',concern:'Concern',unknown:'Unknown'};
export type ChartRow={name:string;value:number;fill:string};
export type MetricChartData={kind:'bar'|'area'|'pie';rows:ChartRow[];unit:string;caption:string;reference?:number};
export function chartForMetric(id:MetricId,input:MetricInput|undefined,result:Result):MetricChartData|null {
 if(!input||!result.complete||result.stale||result.numeric===null)return null;
 const [a,b]=input.values,color=SIGNAL_COLORS[result.tone];
 const row=(name:string,value:number,fill=color):ChartRow=>({name,value,fill});
 switch(id){
  case 'cashflow':return {kind:'bar',rows:[row('Net cash flow',a)],unit:input.currency+' millions',caption:'Net operating cash flow for the reported period. No trend is inferred from one reading.'};
  case 'debt':return {kind:'bar',rows:[row('Cash-like assets',a,SIGNAL_COLORS.positive),row('Borrowings',b,'#94a8c4')],unit:input.currency+' millions',caption:'Uses the entered cash definition. Check restrictions and debt repayment dates.'};
  case 'growth':return {kind:'bar',rows:[row('Prior year',100,'#94a8c4'),row('Current',100+a)],unit:'Revenue index · prior year = 100',caption:'Relative revenue, derived from the reported YoY change. These are index values, not dollar amounts.'};
  case 'margin':return {kind:'bar',rows:[row('Operating margin',result.numeric)],unit:'% of revenue',reference:5,caption:'The 5% marker is an illustrative screening threshold, not an industry benchmark.'};
  case 'runway':{
   if(b<=0)return null;
   const end=Math.min(result.numeric,24);
   // Ratios avoid overflow for large but finite inputs. No negative cash is drawn.
   const rows=Array.from({length:13},(_,i)=>{const month=end*i/12;return row(String(Number(month.toFixed(2))),result.numeric===0?0:Math.max(0,a*(1-month/result.numeric!)));});
   return {kind:'area',rows,unit:input.currency+' millions',caption:'Constant-burn scenario · months from the reporting date. '+(result.numeric>24?'First 24 months shown. ':'')+'Excludes new funding; not a forecast.'};
  }
  case 'payroll':return {kind:'pie',rows:[row('On time',3-a,SIGNAL_COLORS.positive),row('Late',a,SIGNAL_COLORS.concern)],unit:'Last 3 monthly payments',caption:'Counts across three payment cycles. Individual months are not inferred.'};
 }
}
