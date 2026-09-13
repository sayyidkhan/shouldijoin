import test from 'node:test';
import assert from 'node:assert/strict';
import {specs,evaluate} from '../lib/company/model.ts';
import {chartForMetric,SIGNAL_HEIGHTS} from '../lib/company/visuals.ts';
const now='2026-09-13';
const input=values=>({values,date:'2026-06-30',period:'Q2 2026',currency:'USD',origin:'user',url:'',note:''});
function chart(id,values,date){const i=values===undefined?undefined:{...input(values),...(date?{date}:{})};return chartForMetric(id,i,evaluate(specs.find(s=>s.id===id),i,now));}

test('Missing, stale and zero-burn readings never produce quantitative charts',()=>{
 assert.equal(chart('cashflow'),null);
 assert.equal(chart('cashflow',[56],'2025-01-01'),null);
 assert.equal(chart('runway',[100,0]),null);
 assert.equal(SIGNAL_HEIGHTS.unknown,null);
 assert.ok(SIGNAL_HEIGHTS.concern<SIGNAL_HEIGHTS.watch&&SIGNAL_HEIGHTS.watch<SIGNAL_HEIGHTS.positive);
});
test('Signed and zero cash flow preserve their actual values and currency',()=>{
 assert.equal(chart('cashflow',[-56]).rows[0].value,-56);
 assert.equal(chart('cashflow',[0]).rows[0].value,0);
 assert.equal(chart('cashflow',[56]).unit,'USD millions');
});
test('Revenue growth is explicitly indexed and margin keeps its own percentage scale',()=>{
 assert.deepEqual(chart('growth',[22]).rows.map(r=>r.value),[100,122]);
 assert.deepEqual(chart('growth',[-100]).rows.map(r=>r.value),[100,0]);
 assert.match(chart('growth',[22]).unit,/index/);
 assert.equal(chart('margin',[19,997]).rows[0].value,19/997*100);
 assert.equal(chart('margin',[-10,100]).rows[0].value,-10);
 assert.equal(chart('margin',[1,0]),null);
});
test('Debt components and salary counts reconcile to their inputs',()=>{
 assert.deepEqual(chart('debt',[7400,2000]).rows.map(r=>r.value),[7400,2000]);
 assert.deepEqual(chart('payroll',[1]).rows.map(r=>r.value),[2,1]);
 assert.equal(chart('payroll',[4]),null);
});
test('Runway scenarios start at reported cash and never draw negative or non-finite cash',()=>{
 for(const values of [[120,10],[0,10],[1e308,1e307],[1e300,1e-3]]){
  const c=chart('runway',values);
  assert.equal(c.rows[0].value,values[0]);
  assert.ok(c.rows.every(r=>Number.isFinite(r.value)&&r.value>=0));
 }
 assert.equal(chart('runway',[120,10]).rows.at(-1).value,0);
 assert.equal(chart('runway',[360,10]).rows.at(-1).name,'24');
 assert.equal(chart('runway',[360,10]).rows.at(-1).value,120.00000000000001);
});
