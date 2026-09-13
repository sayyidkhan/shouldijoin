import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeRange,radarProfile,compareProfiles,directoryReadout,mergeCompanies} from '../lib/company/radar.ts';
import {sample,sea} from '../lib/company/data.ts';

const now='2026-09-13';
const input=(values,extra={})=>({values,date:'2026-06-30',period:'Q2 2026',currency:'USD',url:'',note:'',origin:'user',...extra});
const company=(metrics={})=>({id:'test',name:'Test',entity:'Test entity',metrics,evidence:[],reviewed:'',next:'',checks:[]});
const axis=(c,id)=>radarProfile(c,now).find(r=>r.id===id);

test('Fixed radar scales interpolate, clamp and reject non-finite values',()=>{
 const anchors=[[-20,0],[0,40],[10,70],[30,100]];
 for(const [value,expected] of [[-100,0],[-20,0],[-10,20],[0,40],[5,55],[10,70],[20,85],[30,100],[90,100]])assert.equal(normalizeRange(value,anchors),expected);
 for(const value of [NaN,Infinity,-Infinity])assert.equal(normalizeRange(value,anchors),null);
});

test('Missing, stale, invalid and zero-burn inputs stay outside the polygon',()=>{
 assert.ok(radarProfile(company(),now).every(r=>r.score===null));
 const c=company({runway:input([20,0]),growth:input([22],{date:'2025-12-31'}),payroll:input([4])});
 assert.equal(axis(c,'runway').score,null);assert.equal(axis(c,'runway').value,'N/A');
 assert.equal(axis(c,'growth').score,null);assert.equal(axis(c,'payroll').score,null);
 assert.equal(axis(company({growth:input([-20])}),'growth').score,0);
});

test('Cash generation requires valid same-period revenue and is independent of company size',()=>{
 const c=company({cashflow:input([10]),margin:input([5,100])});
 const larger=company({cashflow:input([10000]),margin:input([5000,100000])});
 assert.equal(axis(c,'cashflow').score,70);assert.equal(axis(larger,'cashflow').score,70);
 for(const extra of [{date:'2026-06-29'},{period:'H1 2026'},{currency:'SGD'}]){
  const mismatch=company({...c.metrics,margin:input([5,100],extra)});
  assert.equal(axis(mismatch,'cashflow').score,null);
 }
 assert.equal(axis(company({cashflow:input([10]),margin:input([5,0])}),'cashflow').score,null);
});

test('Curated comparison shares three dimensions and excludes incompatible cash definitions',()=>{
 const comparison=compareProfiles(sample,sea,now);
 assert.deepEqual(comparison.shared,['cashflow','growth','margin']);
 assert.equal(comparison.rows.find(r=>r.left.id==='debt').reason,'Cash definitions not comparable');
 assert.equal(radarProfile(sample,now).filter(r=>r.score!==null).length,4);
 assert.equal(radarProfile(sea,now).filter(r=>r.score!==null).length,4);
 assert.ok(Math.abs(sea.metrics.cashflow.values[0]-(2563.884-1057.905))<1e-9);
 assert.ok(Math.abs(sea.metrics.debt.values[1]-(316.165+908.151+996.311))<1e-9);
 assert.equal(axis(sea,'margin').value,'+8.4%');
 assert.equal(axis(sample,'cashflow').value,'+5.6%');
});

test('Comparison rejects mismatched periods and unconfirmed cash bases',()=>{
 const a=company({debt:input([20,10],{cashBasis:'cash_equivalents'}),growth:input([5])});
 const b={...company({debt:input([30,10],{cashBasis:'cash_equivalents'}),growth:input([10])}),id:'peer',name:'Peer'};
 assert.deepEqual(compareProfiles(a,b,now).shared,['debt','growth']);
 for(const cashBasis of [undefined,'unconfirmed','company_liquidity','invalid'])assert.ok(!compareProfiles(a,{...b,metrics:{...b.metrics,debt:input([30,10],{cashBasis})}},now).shared.includes('debt'));
 const mismatch={...b,metrics:{growth:input([10],{period:'H1 2026'})}};
 assert.equal(compareProfiles(a,mismatch,now).rows.find(r=>r.left.id==='growth').reason,'Different reporting periods');
});

test('Zero debt, empty balances and overflowing ratios remain distinguishable',()=>{
 assert.equal(axis(company({debt:input([20,0])}),'debt').score,100);
 assert.equal(axis(company({debt:input([0,0])}),'debt').score,null);
 assert.equal(axis(company({debt:input([1e308,1e-308])}),'debt').score,null);
});

test('Directory makes concerns and incomplete coverage visible without an overall score',()=>{
 assert.equal(directoryReadout(sample,now).label,'Mixed signals');
 assert.equal(directoryReadout(sea,now).label,'Positive so far');
 assert.equal(directoryReadout(company(),now).label,'Not assessed');
 const c=company({growth:input([22])});c.evidence.push({id:'concern',category:'People',signal:'concern',note:'Recorded concern',url:'',date:now});
 assert.equal(directoryReadout(c,now).label,'Concerns flagged');
 assert.equal(directoryReadout(c,now).unknown,5);
});

test('Company directory merges by identity while preserving saved and current edits',()=>{
 const saved={...sample,entity:'Saved identity',checks:['joining0']};
 const current={...saved,entity:'Current identity'};
 const records=mergeCompanies([sample,sea],[saved],[current]);
 assert.equal(records.length,2);assert.equal(records[0].entity,'Current identity');
 assert.deepEqual(records[0].checks,['joining0']);assert.equal(records[1].id,'sea');
});
