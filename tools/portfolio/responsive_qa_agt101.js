const fs=require('fs'),path=require('path');

const MOD='learning/modules/AGT-101';
// jsdom has no layout engine, so instead assert the CSS media queries exist
// and that no fixed pixel width exceeds a 390px viewport.
const css=fs.readFileSync('shared/theme/scroll-canvas.css','utf8')+fs.readFileSync(path.join(MOD,'tokens.css'),'utf8');
const checks=[];
function c(n,cond,d){checks.push({n,pass:!!cond,d:d||''})}
c('mobile band padding rule', /@media \(max-width:700px\)[\s\S]*?\.band\{padding/.test(css));
c('column rules hidden on narrow', /@media \(max-width:700px\)[\s\S]*?\.band::before,\.band::after\{display:none\}/.test(css));
c('rail hidden below 1024', /@media \(max-width:1023px\)\{ \.rail\{display:none\} \}/.test(css));
c('progress bar shown below 1024', /@media \(min-width:1024px\)\{ \.rail-progress\{display:none\} \}/.test(css));
c('meta row stacks on narrow', /@media \(max-width:700px\)[\s\S]*?\.meta-row__cell\{border-right:none/.test(css));
c('fact rows stack on narrow', /@media \(max-width:640px\)\{ \.fact-row\{grid-template-columns:1fr/.test(css));
c('hotspot stacks on narrow', /@media \(max-width:900px\)\{ \.hotspot\{grid-template-columns:1fr/.test(css));
c('stepper labels hide on narrow', /@media \(max-width:640px\)\{[\s\S]*?\.stepper__dot-l\{display:none\}/.test(css));
c('stat grid stacks on narrow', /@media \(max-width:700px\)[\s\S]*?\.stat\{border-right:none/.test(css));
c('principle grid stacks', /@media \(max-width:700px\)[\s\S]*?\.principle\{border-right:none/.test(css));
c('no fixed width over 390px', !/width:\s*(4[0-9]{2}|[5-9][0-9]{2}|[0-9]{4,})px/.test(css.replace(/max-width:[^;]+;/g,'')));
c('grids use auto-fit minmax not fixed columns', (css.match(/repeat\(auto-fit/g)||[]).length >= 6);
c('reduced motion block present', /@media \(prefers-reduced-motion:reduce\)/.test(css));
c('images scale fluidly', /\.hero-render__img\{width:100%;height:auto/.test(css));
c('diagram scales fluidly', /\.hotspot__img\{[\s\S]*?width:100%;height:auto/.test(css));
const fail=checks.filter(x=>!x.pass);
checks.forEach(x=>console.log((x.pass?'PASS  ':'FAIL  ')+x.n));
console.log('\n'+(checks.length-fail.length)+'/'+checks.length+' responsive checks passed');
process.exit(fail.length?1:0);
