/* Focused runtime QA for MEM-101. Run: node tools/agents/runtime_qa_mem101.js */
'use strict';
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');
const MOD = path.join(__dirname, '..', '..', 'learning', 'modules', 'MEM-101');
const results = [];
function check(name, ok, detail) { results.push({ name, ok: !!ok, detail: detail || '' }); }
function api() {
  const data = {'cmi.core.lesson_status':'not attempted','cmi.suspend_data':'','cmi.core.lesson_location':''};
  return { data, LMSInitialize(){return 'true';}, LMSFinish(){return 'true';}, LMSGetValue(k){return data[k] || '';}, LMSSetValue(k,v){data[k]=String(v);return 'true';}, LMSCommit(){return 'true';}, LMSGetLastError(){return '0';}, LMSGetErrorString(){return '';}, LMSGetDiagnostic(){return '';} };
}
function boot() {
  const dom = new JSDOM(fs.readFileSync(path.join(MOD,'index.html'),'utf8'), {runScripts:'outside-only', pretendToBeVisual:true});
  const w = dom.window; const lms = api(); w.API = lms;
  w.matchMedia = () => ({matches:false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){}});
  const observers = [];
  w.IntersectionObserver = function(cb){ const o={cb,nodes:[],observe(n){this.nodes.push(n);},unobserve(){}}; observers.push(o); return o; };
  w.requestAnimationFrame = fn => setTimeout(() => fn(Date.now()), 0);
  w.Element.prototype.scrollIntoView = function(){};
  ['scorm.js','content.js','app.js'].forEach(f => w.eval(fs.readFileSync(path.join(MOD,f),'utf8')));
  if (w.document.readyState === 'loading') w.document.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));
  return {doc:w.document, lms, observers};
}
function click(node) { node.dispatchEvent(new node.ownerDocument.defaultView.MouseEvent('click',{bubbles:true})); }
function fireAll(observers) { observers.forEach(o => { if (o.nodes.length) o.cb(o.nodes.map(target => ({target,isIntersecting:true})),o); }); }

const {doc,lms,observers} = boot();
const bands = doc.querySelectorAll('.band');
check('12 bands render', bands.length === 12, bands.length);
check('one h1 and 11 h2 headings', doc.querySelectorAll('h1').length === 1 && doc.querySelectorAll('h2').length === 11);
check('single ink band', Array.from(bands).filter(b => b.dataset.surface === 'ink').length === 1);
check('rail has one link per band', doc.querySelectorAll('.rail__btn').length === 12);
check('all band labels resolve', Array.from(bands).every(b => doc.getElementById(b.getAttribute('aria-labelledby'))));
check('local images have alt text', Array.from(doc.querySelectorAll('img')).every(i => i.hasAttribute('alt')));

check('memory taxonomy has 3 hotspots', doc.querySelectorAll('.hotspot__btn').length === 3);
const hot = doc.querySelectorAll('.hotspot__btn'); const panel = doc.querySelector('.hotspot__panel'); const before = panel.textContent; click(hot[2]);
check('hotspot changes panel', panel.textContent !== before);
check('two horizon tabs render', doc.querySelectorAll('.tabs__tab').length === 2);
check('two decision practice sets render', doc.querySelectorAll('.decision').length === 5);
check('retrieval sorter has 4 cards and 3 buckets', doc.querySelectorAll('.sorter__card').length === 4 && doc.querySelectorAll('.sorter__opt').length === 12);
check('control myth set has 4 cards', doc.querySelectorAll('.myth').length === 4);
check('write stepper has 4 stages', doc.querySelectorAll('.stepper__dot').length === 4);

const quiz = doc.querySelector('.quiz');
check('quiz starts with one question', quiz.querySelectorAll('.quiz__opt').length === 4);
const answers = [['a'],['a'],['a','b','d'],['a'],['a'],['a']];
for (let i=0;i<answers.length;i++) {
  const opts = quiz.querySelectorAll('.quiz__opt');
  answers[i].forEach(id => click(opts[id.charCodeAt(0)-97]));
  const controls = quiz.querySelectorAll('.quiz__controls .pill');
  click(controls[controls.length-1]);
}
check('quiz reports 100%', lms.data['cmi.core.score.raw'] === '100', lms.data['cmi.core.score.raw']);
check('quiz alone does not complete', lms.data['cmi.core.lesson_status'] !== 'passed', lms.data['cmi.core.lesson_status']);
fireAll(observers);
check('all bands plus passing quiz completes', lms.data['cmi.core.lesson_status'] === 'passed', lms.data['cmi.core.lesson_status']);
check('suspend data stays bounded', lms.data['cmi.suspend_data'].length < 4096, lms.data['cmi.suspend_data'].length);

const failed = results.filter(r => !r.ok);
results.forEach(r => console.log(`${r.ok ? 'PASS' : 'FAIL'} ${r.name}${r.detail !== '' ? ` (${r.detail})` : ''}`));
process.exit(failed.length ? 1 : 0);
