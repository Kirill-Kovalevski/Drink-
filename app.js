/* ======================= DRINK! app.js (RTL) ======================= */
/* helpers */
const $  = (q,root=document)=>root.querySelector(q);
const $$ = (q,root=document)=>root.querySelectorAll(q);
const by = (id)=>document.getElementById(id);
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));

/* run after DOM is ready */
document.addEventListener('DOMContentLoaded', () => {

/* ---------- date (he-IL) ---------- */
{
  const el=by('today');
  if(el){
    const d=new Date();
    el.textContent=d.toLocaleDateString('he-IL',{weekday:'long',day:'2-digit',month:'long'});
  }
}

/* ---------- state ---------- */
const S={
  gender:'female', weight:70, age:26, height:169, activity:30,
  hot:false, pregnant:false, lactating:false, altBand:0,
  coffeeCups:0, coffeeMl:0,
  targetMl:0, drankMl:0, splashHue:190
};
const CUP=240;

/* ---------- minute selects (1..180) – supports old/new ids ---------- */
(function(){
  const fill = (sel) => {
    if(!sel) return;
    sel.innerHTML='';
    for(let i=1;i<=180;i++){
      const o=document.createElement('option');
      o.value=i; o.textContent=i;
      sel.appendChild(o);
    }
  };
  fill(by('oneShot') || by('alarmMin'));
})();

/* ---------- bind inputs / stepper ---------- */
{
  const g=by('gender');
  if(g){
    S.gender=g.value || 'female';
    g.addEventListener('change',()=>{
      S.gender=g.value;
      $$('.female-only').forEach(el=>el.style.display = S.gender==='female' ? 'inline-grid' : 'none');
    });
  }

  $$('.step')?.forEach(btn=>{
    btn.addEventListener('click',()=>{
      const t=btn.dataset.for;
      const add=btn.classList.contains('plus')?1:-1;
      if(t==='w'){ S.weight = clamp(S.weight+add,30,200); by('weight') && (by('weight').textContent=S.weight); }
      if(t==='a'){ S.age    = clamp(S.age+add,  5,110); by('age')    && (by('age').textContent   =S.age); }
      if(t==='h'){ S.height = clamp(S.height+add,90,230); by('height') && (by('height').textContent=S.height); }
    });
  });

  by('activity')?.addEventListener('change',e=>S.activity=+e.target.value);

  /* modal openers (chips/icons) */
  const open=(id)=>{ const m=by(id); if(m) m.hidden=false; };
  by('openWeight')   ?.addEventListener('click',()=>open('weightModal'));
  by('openAge')      ?.addEventListener('click',()=>open('ageModal'));
  by('openHeight')   ?.addEventListener('click',()=>open('heightModal'));
  by('openCoffee')   ?.addEventListener('click',()=>open('coffeeModal'));
  by('openAltitude') ?.addEventListener('click',()=>open('altitudeModal'));
  by('openClimate')  ?.addEventListener('click',()=>open('climateModal'));
  by('openLact')     ?.addEventListener('click',()=>{ if(S.gender==='female') open('lactModal'); });
  by('openPreg')     ?.addEventListener('click',()=>{ if(S.gender==='female') open('pregModal'); });

  /* yes/no small modals */
  by('climateYes')?.addEventListener('click',()=>{S.hot=true;  $('#openClimate')?.classList.add('active'); by('climateModal').hidden=true;});
  by('climateNo') ?.addEventListener('click',()=>{S.hot=false; $('#openClimate')?.classList.remove('active'); by('climateModal').hidden=true;});
  by('lactYes')   ?.addEventListener('click',()=>{S.lactating=true;  $('#openLact')?.classList.add('active');  by('lactModal').hidden=true;});
  by('lactNo')    ?.addEventListener('click',()=>{S.lactating=false; $('#openLact')?.classList.remove('active'); by('lactModal').hidden=true;});
  by('pregYes')   ?.addEventListener('click',()=>{S.pregnant=true;  $('#openPreg')?.classList.add('active');  by('pregModal').hidden=true;});
  by('pregNo')    ?.addEventListener('click',()=>{S.pregnant=false; $('#openPreg')?.classList.remove('active'); by('pregModal').hidden=true;});

  /* close modal */
  $$('[data-close]')?.forEach(b=>b.addEventListener('click',()=>{
    const sel=b.getAttribute('data-close'); const el=sel ? by(sel.slice(1)) : null;
    if(el) el.hidden=true;
  }));
  $$('.modal .modal-backdrop')?.forEach(bg=>bg.addEventListener('click',e=>{
    e.currentTarget.parentElement.hidden=true;
  }));
}

/* ---------- chips content ---------- */
(function(){
  const mount=(id,items,apply)=>{
    const el=by(id); if(!el) return;
    el.innerHTML='';
    items.forEach(v=>{
      const b=document.createElement('button');
      b.type='button'; b.textContent=v.label;
      b.addEventListener('click',()=>{ apply(v.value); el.closest('.modal').hidden=true; });
      el.appendChild(b);
    });
  };
  mount('weightChips',[50,55,60,65,70,75,80,85,90,95,100,110,120].map(x=>({label:`${x} ק״ג`,value:x})),
    v=>{ S.weight=v; by('weight') && (by('weight').textContent=v); });
  mount('ageChips',[16,18,20,25,30,35,40,45,50,55,60].map(x=>({label:`${x}`,value:x})),
    v=>{ S.age=v; by('age') && (by('age').textContent=v); });
  mount('heightChips',[150,155,160,165,170,175,180,185,190,200].map(x=>({label:`${x} ס״מ`,value:x})),
    v=>{ S.height=v; by('height') && (by('height').textContent=v); });
  mount('altitudeChips',[{label:'0–1000 מ׳',value:0},{label:'1000–2000 מ׳',value:1},{label:'2000+ מ׳',value:2}],
    v=>{ S.altBand=v; });
  mount('coffeeChips',Array.from({length:9},(_,i)=>({label:`${i} כוסות`,value:i})),
    v=>{ S.coffeeCups=v; });
  by('setCoffeeMl')?.addEventListener('click',()=>{
    S.coffeeMl=clamp(+by('coffeeMl').value||0,0,3000);
    by('coffeeModal').hidden=true;
  });
})();

/* ---------- target calculation ---------- */
/* Base 35 mL/kg; activity 12 mL/min; coffee cups*120 + ml*0.5;
   hot +10%; pregnancy +300; lactation +700; altitude +0/+250/+500 */
function calcTarget(){
  const base=S.weight*35;
  const act =S.activity*12;
  const caffe=S.coffeeCups*120 + S.coffeeMl*0.5;
  let ml=Math.round(base+act+caffe);
  if(S.hot) ml=Math.round(ml*1.10);
  if(S.gender==='female'&&S.pregnant) ml+=300;
  if(S.gender==='female'&&S.lactating) ml+=700;
  if(S.altBand===1) ml+=250; else if(S.altBand===2) ml+=500;

  S.targetMl=ml;
  by('targetLiters') && (by('targetLiters').textContent=(ml/1000).toFixed(1));
  by('targetLiters2') && (by('targetLiters2').textContent=(ml/1000).toFixed(2));
  updateGauge();
}
by('calc')?.addEventListener('click',calcTarget);

/* ---------- gauge, river & splash ---------- */
function setStage(p){
  const f=by('riverFill'); if(!f) return;
  f.classList.remove('stage1','stage2','stage3','stage4');
  if(p<35) f.classList.add('stage1');
  else if(p<65) f.classList.add('stage2');
  else if(p<100) f.classList.add('stage3');
  else f.classList.add('stage4');
}
function updateGauge(){
  const pct= S.targetMl ? Math.min(100,(S.drankMl/S.targetMl)*100) : 0;
  const deg= pct/100*360;
  by('gaugeFill') && (by('gaugeFill').style.background=
    `conic-gradient(hsl(${S.splashHue} 80% 55%) ${deg}deg, #e6eef7 ${deg}deg 360deg)`);
  by('gaugePct') && (by('gaugePct').textContent=`${Math.round(pct)}%`);
  by('drankLiters') && (by('drankLiters').textContent=(S.drankMl/1000).toFixed(1));
  const river=by('riverFill'); if(river){ river.style.width=`${pct}%`; setStage(pct); }
  by('intakeCups') && (by('intakeCups').textContent=(S.drankMl/CUP).toFixed(1));
  by('intakeMl') && (by('intakeMl').textContent=S.drankMl.toFixed(0));
  if(pct>=100) celebrate();
}
function splash(amount){
  S.splashHue = (S.splashHue + 47) % 360;
  const scale = amount>=1000 ? 1.22 : amount>=500 ? 1.1 : 1.03;
  const ring = by('ringSplash'); if(!ring) return;
  ring.style.setProperty('--ring-hue', S.splashHue);
  ring.style.setProperty('--pulse-scale', scale);
  ring.classList.remove('show'); void ring.offsetWidth;
  ring.classList.add('show');
}
function addWater(ml){
  S.drankMl=clamp(S.drankMl+ml,0,60000);
  splash(ml); updateGauge(); rotateQuote();
}
by('add250')  ?.addEventListener('click',()=>addWater(250));
by('add500')  ?.addEventListener('click',()=>addWater(500));
by('add1000') ?.addEventListener('click',()=>addWater(1000));
by('resetIntake')?.addEventListener('click',()=>{ S.drankMl=0; updateGauge(); });

/* ---------- Notifications & Reminders (fixed) ---------- */
const Rem = { intervalTimer:null, oneShotTimer:null };

async function ensureNotifyPermission(){
  if(!('Notification' in window)) return false;
  if(Notification.permission==='granted') return true;
  try{ return (await Notification.requestPermission())==='granted'; }
  catch(_){ return false; }
}
function fireNotify(txt){
  // system notification (if allowed)
  if('Notification' in window && Notification.permission==='granted'){
    try{ new Notification('דרינק! 💧',{body:txt}); }catch(_){}
  }
  // sound + vibration
  const ch=by('chime'); if(ch){ try{ ch.currentTime=0; ch.play(); }catch(_){} }
  if(navigator.vibrate){ navigator.vibrate([90,40,90]); }
}
async function startRepeating(){
  const sel = by('remEvery') || by('interval');
  const mins = Number(sel?.value || 45);
  if(Rem.intervalTimer) clearInterval(Rem.intervalTimer);
  await ensureNotifyPermission();
  Rem.intervalTimer = setInterval(()=>fireNotify('זמן ללגימה!'), mins*60*1000);
  fireNotify('מתחילים להזכיר 💙');
}
function stopRepeating(){
  if(Rem.intervalTimer) clearInterval(Rem.intervalTimer);
  Rem.intervalTimer=null;
  fireNotify('עצרתי תזכורות');
}
async function startOneShot(){
  const sel = by('oneShot') || by('alarmMin');
  const mins = Number(sel?.value || 1);
  if(Rem.oneShotTimer) clearTimeout(Rem.oneShotTimer);
  await ensureNotifyPermission();
  Rem.oneShotTimer = setTimeout(()=>fireNotify(`התראה חד־פעמית — ${mins} דקות`), mins*60*1000);
  fireNotify(`אקרא בעוד ${mins} דקות`);
}
function cancelOneShot(){
  if(Rem.oneShotTimer) clearTimeout(Rem.oneShotTimer);
  Rem.oneShotTimer=null;
  fireNotify('ביטלתי התראה חד־פעמית');
}

/* wire buttons (תומך בשמות החדשים והישנים) */
by('startRem')  ?.addEventListener('click',startRepeating);
by('stopRem')   ?.addEventListener('click',stopRepeating);
by('testPing')  ?.addEventListener('click',()=>fireNotify('דוגמת צליל 🚿'));
by('startAlarm')?.addEventListener('click',startOneShot);
by('cancelAlarm')?.addEventListener('click',cancelOneShot);
by('fireOne')   ?.addEventListener('click',startOneShot); // תאימות לאחור

/* ---------- Lightweight confetti (fast, magnificent, 2.2s) ---------- */
function confettiBurst(){
  const cnv=document.createElement('canvas');
  cnv.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:9999';
  document.body.appendChild(cnv);
  const ctx=cnv.getContext('2d');
  const setSize=()=>{ cnv.width=innerWidth; cnv.height=innerHeight; };
  setSize(); addEventListener('resize',setSize,{once:true});

  const N = Math.min(140, Math.floor(innerWidth/12)); // קליל
  const P=[];
  for(let i=0;i<N;i++){
    P.push({
      x:Math.random()*cnv.width,
      y:-20-Math.random()*80,
      vx:(Math.random()*2-1)*2.6,
      vy:4+Math.random()*6,
      s:4+Math.random()*6,
      r:Math.random()*Math.PI, vr:(Math.random()-.5)*0.3,
      c:`hsl(${Math.random()*360},95%,60%)`
    });
  }
  const start=performance.now();
  (function loop(t){
    const dt=16; // steady
    ctx.clearRect(0,0,cnv.width,cnv.height);
    ctx.globalCompositeOperation='lighter';
    for(const p of P){
      p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; p.vy*=0.996;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
      ctx.fillStyle=p.c; ctx.shadowColor=p.c; ctx.shadowBlur=10;
      ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*1.2);
      ctx.restore();
    }
    if(t-start<2200) requestAnimationFrame(loop);
    else { cnv.remove(); }
  })(performance.now());
}
function celebrate(){
  confettiBurst();
  setTimeout(()=>{ S.drankMl=0; updateGauge(); }, 900);
}

/* ---------- quotes (Tanakh + research in Hebrew) ---------- */
const quotes=[
 "כֹּל צָמֵא לְכוּ לַמַּיִם — ישעיהו נ״ה",
 "יָשְׁבֵנִי עַל־מֵי מְנֻחוֹת — תהילים כ״ג",
 "וְשָׁאַבְתֶּם מַיִם בְּשָׂשׂוֹן — ישעיהו י״ב",
 "כַּאֲיָל תַּעֲרֹג עַל־אֲפִיקֵי־מָיִם — תהילים מ״ב",
 "מַיִם קָרִים עַל־נֶפֶשׁ עֲיֵפָה — משלי כ״ה",
 "כִּי־עִמְּךָ מְקוֹר חַיִּים — תהילים ל״ו",
 "שתייה מספקת נקשרה לריכוז ומצב רוח — סיכומי סקירות",
 "הידרציה מספקת משפרת ביצוע גופני — סקירות מקצועיות",
 "צריכת מים יומית 2–3 ל׳ נקשרה לאנרגיה טובה — דוחות מחקר"
];
function rotateQuote(){
  const q=by('quote'); if(!q) return;
  q.textContent=`“${quotes[Math.floor(Math.random()*quotes.length)]}”`;
}

/* ---------- init ---------- */
calcTarget();
updateGauge();
rotateQuote();

}); // DOMContentLoaded
/* ===================== END app.js ===================== */
