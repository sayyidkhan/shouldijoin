import type {Metadata} from 'next';
import {ArrowLeft,Orbit} from 'lucide-react';
import {Methodology} from '@/components/company/methodology';

export const metadata:Metadata={
 title:'How we assess company health — Should I Join',
 description:'Our six screening checks, radar scales, comparison rules, sources and validation limits.',
};

export default function MethodologyPage(){
 return <><header className="site-header methodology-header"><a href="/" className="brand" aria-label="Should I Join home"><span className="brand-symbol"><Orbit size={25}/></span><span>should i join<span className="brand-question">?</span></span></a><a href="/" className="back-to-directory"><ArrowLeft size={15}/>Companies</a></header><Methodology/></>;
}
