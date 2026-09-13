'use client';
import {useState} from 'react';
import {ArrowUpRight,Check,Calculator,Info} from 'lucide-react';
import {Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {evaluate,inputError,safeURL,today,type MetricSpec,type MetricInput} from '@/lib/company/model';
export function MetricEditor({spec,input,onSave,onClose}:{spec:MetricSpec;input?:MetricInput;onSave:(input?:MetricInput)=>void;onClose:()=>void}){
 const [values,setValues]=useState<string[]>(spec.fields.map((_,i)=>input?.values[i]?.toString()??''));
 const [date,setDate]=useState(input?.date??''),[period,setPeriod]=useState(input?.period??''),[url,setUrl]=useState(input?.url??''),[note,setNote]=useState(input?.note??''),[currency,setCurrency]=useState<'USD'|'SGD'>(input?.currency??'SGD'),[error,setError]=useState(''),[cashBasis,setCashBasis]=useState<NonNullable<MetricInput['cashBasis']>>(input?.cashBasis??'unconfirmed');
 const draft:MetricInput={values:values.map(x=>x.trim()===''?NaN:Number(x)),date,period,url,note,currency,origin:'user',...(spec.id==='debt'?{cashBasis}:{})};
 const result=evaluate(spec,draft);
 function submit(e:React.FormEvent){e.preventDefault();const issue=inputError(spec,draft);if(issue){setError(issue);return;}onSave(draft);onClose();}
 return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="metric-dialog"><DialogHeader><p className="eyebrow">{spec.group}</p><DialogTitle>{spec.title}</DialogTitle><DialogDescription>{spec.description}</DialogDescription></DialogHeader>
  <div className="formula"><Calculator size={17}/><span>{spec.formula}</span></div>
  <form onSubmit={submit} className="editor-form">
   {spec.monetary&&<label>Currency <Select value={currency} onValueChange={v=>setCurrency(v as 'USD'|'SGD')}><SelectTrigger aria-label="Currency"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="SGD">SGD · Singapore dollar</SelectItem><SelectItem value="USD">USD · US dollar</SelectItem></SelectContent></Select></label>}
   {spec.id==='debt'&&<label>Cash definition for comparisons<Select value={cashBasis} onValueChange={v=>setCashBasis(v as NonNullable<MetricInput['cashBasis']>)}><SelectTrigger aria-label="Cash definition"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="unconfirmed">Other / not confirmed</SelectItem><SelectItem value="cash_equivalents">Cash and cash equivalents only</SelectItem><SelectItem value="company_liquidity">Company-defined liquidity</SelectItem></SelectContent></Select><span className="optional">Company-defined liquidity measures remain excluded from cross-company radar comparisons.</span></label>}
   <div className="field-grid">{spec.fields.map((field,i)=><label key={field.label}>{field.label}<input required type="number" step={field.integer?'1':'any'} min={field.min} max={field.max} value={values[i]} onChange={e=>setValues(prev=>prev.map((v,j)=>j===i?e.target.value:v))} placeholder="Enter a value"/></label>)}</div>
   <div className="field-grid"><label>Reporting / observation date<input required type="date" max={today()} value={date} onChange={e=>setDate(e.target.value)}/></label><label>Period covered<input required maxLength={80} value={period} onChange={e=>setPeriod(e.target.value)} placeholder={spec.id==='payroll'?'e.g. Jun–Aug 2026':'e.g. Q2 2026 or FY2025'}/></label></div>
   <label>Source link <span className="optional">Optional · a link is not automatically verified</span><input type="url" value={url} maxLength={2000} onChange={e=>setUrl(e.target.value)} placeholder="https://…"/></label>
   <label>Source details and assumptions<textarea maxLength={1500} value={note} onChange={e=>setNote(e.target.value)} placeholder="Where did this figure come from? What does it include?"/></label>
   {result.complete&&<div className={'calculation-preview '+result.tone}><span>Calculated reading</span><strong>{result.value}<small>{result.unit}</small></strong><span>{result.label}</span></div>}
   <div className="reference-bands">{spec.bands.map(b=><span key={b}>{b}</span>)}</div>
   <p className="metric-caveat"><Info size={16}/>{spec.caveat}</p>
   {input?.url&&safeURL(input.url)&&<a className="inline-link" target="_blank" rel="noopener noreferrer" href={safeURL(input.url)}>Open existing source <ArrowUpRight size={15}/></a>}
   {error&&<p className="form-error" role="alert">{error}</p>}
   <div className="dialog-actions">{input&&<button className="text-action muted" type="button" onClick={()=>{onSave(undefined);onClose();}}>Clear this metric</button>}<button className="button primary" type="submit"><Check size={17}/>Apply figures</button></div>
  </form>
 </DialogContent></Dialog>;
}
