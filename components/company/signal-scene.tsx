'use client';
import {useEffect,useRef,useState} from 'react';
import {RotateCcw,Rotate3D,Pause,Play,Minus,Plus} from 'lucide-react';
import {specs,type MetricId,type Result} from '@/lib/company/model';
import {SIGNAL_COLORS,SHORT_NAMES} from '@/lib/company/visuals';
export function SignalScene({results,selected,onSelect,onUnavailable}:{results:Result[];selected:MetricId;onSelect:(id:MetricId)=>void;onUnavailable:()=>void}){
 const host=useRef<HTMLDivElement>(null),labels=useRef<(HTMLButtonElement|null)[]>([]),api=useRef<{setData:(r:Result[],s:MetricId)=>void;reset:()=>void;zoom:(n:number)=>void;rotate:(value:boolean)=>void}|null>(null);
 const selectRef=useRef(onSelect),errorRef=useRef(onUnavailable),latest=useRef({results,selected});
 selectRef.current=onSelect;errorRef.current=onUnavailable;latest.current={results,selected};
 const [loading,setLoading]=useState(true),[rotating,setRotating]=useState(false);
 useEffect(()=>{let cancelled=false,dispose:(()=>void)|undefined;setLoading(true);
  import('./three-scene').then(({mountScene})=>{if(cancelled||!host.current)return;try{const instance=mountScene(host.current,labels.current,latest.current.results,latest.current.selected,id=>selectRef.current(id),()=>errorRef.current());api.current=instance;dispose=instance.dispose;setLoading(false);}catch{errorRef.current();}}).catch(()=>{if(!cancelled)errorRef.current();});
  return()=>{cancelled=true;dispose?.();api.current=null;};
 },[]);
 useEffect(()=>{api.current?.setData(results,selected)},[results,selected]);
 return <div className="signal-scene-wrap"><div className="scene-canvas" ref={host} role="img" aria-label="Interactive 3D company signals. Pillar height encodes the screening band, not numeric magnitude. Use the labelled buttons to select a metric."/>
 <div className="scene-labels">{specs.map((s,i)=><button key={s.id} ref={el=>{labels.current[i]=el}} className={'scene-label '+(selected===s.id?'selected':'')} style={{'--signal-color':SIGNAL_COLORS[results[i].tone]} as React.CSSProperties} onClick={()=>onSelect(s.id)} aria-pressed={selected===s.id}><span>{SHORT_NAMES[s.id]}</span><strong>{results[i].value}<small>{results[i].unit}</small></strong></button>)}</div>
 {loading&&<div className="scene-loading"><Rotate3D size={30}/><span>Opening 3D view</span></div>}
 <div className="scene-help"><Rotate3D size={15}/>Drag to orbit · select a pillar</div><div className="scene-controls"><button aria-label={rotating?'Pause rotation':'Rotate automatically'} aria-pressed={rotating} onClick={()=>{const next=!rotating;setRotating(next);api.current?.rotate(next)}}>{rotating?<Pause size={16}/>:<Play size={16}/>}</button><button aria-label="Zoom in" onClick={()=>api.current?.zoom(1.15)}><Plus size={16}/></button><button aria-label="Zoom out" onClick={()=>api.current?.zoom(1/1.15)}><Minus size={16}/></button><button aria-label="Reset 3D view" onClick={()=>{api.current?.reset();setRotating(false)}}><RotateCcw size={16}/></button></div></div>;
}
