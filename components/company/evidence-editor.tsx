'use client';
import {useState} from 'react';
import {Plus} from 'lucide-react';
import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle} from '@/components/ui/dialog';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {categories,safeURL,today,type Evidence} from '@/lib/company/model';
export function EvidenceEditor({name,onSave,onClose}:{name:string;onSave:(e:Evidence)=>void;onClose:()=>void}){
 const [category,setCategory]=useState(categories[0]),[signal,setSignal]=useState('unknown'),[note,setNote]=useState(''),[url,setUrl]=useState(''),[date,setDate]=useState(''),[error,setError]=useState('');
 return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="metric-dialog"><DialogHeader><DialogTitle>Add an observation</DialogTitle><DialogDescription>Keep a dated record of what you learn about {name}.</DialogDescription></DialogHeader><form className="editor-form" onSubmit={e=>{e.preventDefault();if(url&&!safeURL(url)){setError('Use a valid http:// or https:// link.');return;}onSave({id:crypto.randomUUID(),category,signal,note:note.trim(),url,date});onClose();}}>
 <label>Area<Select value={category} onValueChange={setCategory}><SelectTrigger aria-label="Evidence area"><SelectValue/></SelectTrigger><SelectContent>{categories.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></label>
 <label>Your interpretation<Select value={signal} onValueChange={setSignal}><SelectTrigger aria-label="Evidence interpretation"><SelectValue/></SelectTrigger><SelectContent><SelectItem value="positive">Positive signal</SelectItem><SelectItem value="unknown">Needs context</SelectItem><SelectItem value="concern">Concern to investigate</SelectItem></SelectContent></Select></label>
 <label>What happened?<textarea required maxLength={1500} value={note} onChange={e=>setNote(e.target.value)} placeholder="Describe the observation, not just your conclusion."/></label>
 <label>Source link <span className="optional">Optional</span><input type="url" maxLength={2000} value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://…"/></label>
 <label>Source or observation date<input type="date" max={today()} value={date} onChange={e=>setDate(e.target.value)}/></label>
 {error&&<p className="form-error" role="alert">{error}</p>}<button className="button primary" type="submit" disabled={!note.trim()}><Plus size={17}/>Add observation</button>
 </form></DialogContent></Dialog>;
}
