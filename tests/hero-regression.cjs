const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createRequire}=require('node:module');
const site=path.resolve(process.cwd());
const req=createRequire(path.join(site,'package.json'));
const ts=req('typescript');
const {gsap}=req('gsap');
const source=fs.readFileSync(path.join(site,'app/hero-timeline.ts'),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const moduleCopy={exports:{}};
new Function('exports','require','module',compiled)(moduleCopy.exports,req,moduleCopy);
const {populateHeroTimeline}=moduleCopy.exports;
// Start with the invisible, reduced-size values that the old entrance tween left behind.
const targets={word:{xPercent:0,scale:1,opacity:1},number:{xPercent:0,yPercent:0,opacity:1},object:{scale:.7,rotation:-20,yPercent:0,opacity:0},details:{opacity:0,y:15},caption:{opacity:0,scale:.8}};
const timeline=populateHeroTimeline(gsap.timeline({paused:true}),targets);
for(let i=0;i<5;i++){
 timeline.progress(1);
 assert.equal(targets.object.opacity,0,'Logo fades on downward scroll');
 assert.equal(targets.caption.opacity,1,'Portal caption appears');
 timeline.progress(.25);
 timeline.progress(0);
 assert.equal(targets.object.opacity,1,'Logo returns on upward scroll');
 assert.equal(targets.object.scale,1,'Logo returns at original size');
 assert.equal(targets.object.rotation,0,'Logo returns at original angle');
 assert.equal(targets.details.opacity,1,'Hero labels return too');
 assert.equal(targets.caption.opacity,0,'Portal caption resets');
 timeline.invalidate();
}
timeline.kill();gsap.ticker.sleep();
console.log('PASS: five forward/backward cycles, including refresh invalidation and stale entrance values.');
