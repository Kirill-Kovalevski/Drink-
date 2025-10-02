// ===== דרינק! — Wave Fullscreen + Galleon + Huge Confetti + Polished UX =====
const $=(s,r=document)=>r.querySelector(s);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const cupsFromMl=ml=>(ml/240).toFixed(1);
const L=ml=>(ml/1000).toFixed(2);

const state=JSON.parse(localStorage.getItem('drink.v12')||'{}');

/* DOM */
const sex=$('#sex'), weight=$('#weight'), age=$('#age'), height=$('#height');
const activeMin=$('#activeMin'); const isHot=$('#isHot'), preg=$('#pregnant'), lact=$('#lactating');
const form=$('#calcForm');
const targetL=$('#targetL'), targetCups=$('#targetCups');
const bar=$('#bar'), droplet=$('.droplet');
const add250=$('#add250'), add500=$('#add500'), add1000=$('#add1000'), resetBtn=$('#resetIntake');
const intakeMlEl=$('#intakeMl'), intakeCupsEl=$('#intakeCups');
const remEvery=$('#remEvery'), startRem=$('#startRem'), stopRem=$('#stopRem'), testPing=$('#testPing'), playSound=$('#playSound'), vibrate=$('#vibrate');
const alarmMin=$('#alarmMin'), startAlarm=$('#startAlarm'), cancelAlarm=$('#cancelAlarm');
const quoteEl=$('#quote'), bubbles=$('#bubbles');
const confettiTop=$('#confettiTop');

/* Modals + buttons */
const openWeight=$('#openWeight'), weightModal=$('#weightModal'), closeWeight=$('#closeWeight'), weightChips=$('#weightChips');
const openAge=$('#openAge'), ageModal=$('#ageModal'), closeAge=$('#closeAge'), ageChips=$('#ageChips');
const openHeight=$('#openHeight'), heightModal=$('#heightModal'), closeHeight=$('#closeHeight'), heightChips=$('#heightChips');
const openCoffee=$('#openCoffee'), coffeeModal=$('#coffeeModal'), closeCoffee=$('#closeCoffee'), coffeeChips=$('#coffeeChips'), coffeeMl=$('#coffeeMl'), setCoffeeMl=$('#setCoffeeMl');
const openAltitude=$('#openAltitude'), altitudeModal=$('#altitudeModal'), closeAltitude=$('#closeAltitude'), altitudeChips=$('#altitudeChips');
const wMinus=$('#wMinus'), wPlus=$('#wPlus'), aMinus=$('#aMinus'), aPlus=$('#aPlus'), hMinus=$('#hMinus'), hPlus=$('#hPlus');

/* Ripple hero animation */
(function ripples(){
  const cvs=$('#rippleHero'); if(!cvs) return; const ctx=cvs.getContext('2d');
  let w,h,t=0; const waves=[{amp:18,spd:.015,color:'#7dd3fc'},{amp:12,spd:.022,color:'#38bdf8'},{amp:10,spd:.030,color:'#60a5fa'}];
  function resize(){w=cvs.clientWidth;h=cvs.clientHeight;cvs.width=w;cvs.height=h}
  addEventListener('resize',resize,{passive:true}); resize();
  (function draw(){t+=1; ctx.clearRect(0,0,w,h); ctx.fillStyle='#eaf6ff'; ctx.fillRect(0,0,w,h);
    waves.forEach((wv,i)=>{ctx.beginPath(); for(let x=0;x<=w;x+=2){const y=h*0.62+Math.sin(x*0.02+t*wv.spd)*wv.amp+Math.cos(x*0.04+t*wv.spd*1.3)*2; if(x===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);} ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fillStyle=wv.color; ctx.globalAlpha=.85-i*.22; ctx.fill();});
    ctx.globalAlpha=1; requestAnimationFrame(draw);})();
})();

/* Quotes (מהתנ״ך) */
const QUOTES=[
  {t:'יְנַהֲלֵנִי עַל־מֵי מְנֻחוֹת.',a:'תהילים כ״ג:ב׳'},
  {t:'הוֹי כָּל־צָמֵא לַמַּיִם.',a:'ישעיהו נ״ה:א׳'},
  {t:'וּשְׁאַבְתֶּם מַיִם בְּשָׂשׂוֹן.',a:'ישעיהו י״ב:ג׳'},
  {t:'שְׁתֵה־מַיִם מִבּוֹרֶךָ.',a:'משלי ה׳:ט״ו'},
  {t:'נַפְשִׁי צָמְאָה לֵאלֹהִים.',a:'תהילים מ״ב:ג׳'},
  {t:'מַיִם קָרִים עַל נֶפֶשׁ עֲיֵפָה.',a:'משלי כ״ה:כ״ה'},
  {t:'וַיַּךְ הַסֶּלַע וַיֵּצְאוּ מַיִם.',a:'תהילים ע״ח:כ׳'},
  {t:'מְקוֹר מַיִם חַיִּים.',a:'ירמיהו ב׳:י״ג'},
  {t:'וְנָתַתִּי לָכֶם גֶּשֶׁם בְּעִתּוֹ.',a:'ויקרא כ״ו:ד׳'},
  {t:'כְּאֵיל תַּעֲרֹג עַל־אַפִּיקֵי־מָיִם.',a:'תהילים מ״ב:ב׳'},
  {t:'כַּמַּיִם לַיָּם מְכַסִּים.',a:'חבקוק ב׳:י״ד'}
];

/* Sound */
function makeDing(){const ctx=new (window.AudioContext||window.webkitAudioContext)();return()=>{const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=880;g.gain.setValueAtTime(0.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.4,ctx.currentTime+0.01);g.gain.exponentialRampToValueAtTime(0.0001,ctx.currentTime+0.6);o.connect(g).connect(ctx.destination);o.start();setTimeout(()=>o.stop(),620);};}
let ding=null; const playDing=()=>{ if(!ding) ding=makeDing(); try{ding();}catch(_){ } };

/* Bubbles in river */
(function bubblesRunner(){const ctx=bubbles.getContext('2d');function resize(){bubbles.width=bubbles.offsetWidth;bubbles.height=bubbles.offsetHeight}resize();addEventListener('resize',resize);const parts=Array.from({length:28},()=>({x:Math.random()*bubbles.width,y:bubbles.height+Math.random()*40,r:2+Math.random()*3,vy:.3+Math.random()*.6,a:.15+Math.random()*.25}));(function tick(){ctx.clearRect(0,0,bubbles.width,bubbles.height);ctx.fillStyle='rgba(255,255,255,0.9)';for(const p of parts){p.y-=p.vy;if(p.y+p.r<0){p.y=bubbles.height+Math.random()*20;p.x=Math.random()*bubbles.width;}ctx.globalAlpha=p.a;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();}requestAnimationFrame(tick);})();})();

/* יעד מים — כולל פעילות/אקלים/הריון/אלטיטודה/קפה + התאמת BMI */
function calcTargetMl(){
  const s=sex.value, kg=+weight.value||0;
  const h=+height.value||0, active=+activeMin.value||0;
  let Lp=(s==='male')?3.7:2.7;
  if(s==='female'){ if(preg.checked) Lp+=0.3; if(lact.checked) Lp+=0.7; }
  Lp+=(active/30)*0.2;
  if(isHot.checked) Lp+=0.5;
  const alt=state.altitudeCat||0; if(alt===1)Lp+=0.3; if(alt===2)Lp+=0.7;
  if(kg>0&&h>0){const bmi=kg/Math.pow(h/100,2); if(bmi>=30)Lp+=0.3; else if(bmi<19)Lp-=0.1;}
  const cm=state.coffeeMl||0; Lp+=(cm/240)*0.1;
  return Math.round(Math.max(1500, Math.min(7500, Lp*1000)));
}

/* מספרים עם אנימציה */
function animateNumber(el,to,dur=320){const from=parseFloat(el.textContent.replace(/[^\d.]/g,''))||0,start=performance.now();function f(n){const p=Math.min(1,(n-start)/dur);const v=from+(to-from)*p;el.textContent= el===intakeMlEl ? Math.round(v) : (Math.round(v*10)/10).toFixed(1); if(p<1)requestAnimationFrame(f);}requestAnimationFrame(f);}

/* ציטוט לפי התקדמות */
function quoteByProgress(pct){const idx=Math.min(QUOTES.length-1, Math.floor(pct/100*(QUOTES.length))); const q=QUOTES[idx]; quoteEl.textContent=`“${q.t}” — ${q.a}`}

/* רנדר */
function render(){
  const ml=calcTargetMl(); state.targetMl=ml;
  targetL.textContent=L(ml); targetCups.textContent=cupsFromMl(ml);
  const cur=state.intakeMl||0; const pct=Math.min(100,Math.round((cur/ml)*100));
  bar.style.width=pct+'%'; droplet.style.setProperty('--pct', pct);
  bar.classList.remove('stage1','stage2','stage3');
  if(pct<34) bar.classList.add('stage1'); else if(pct<67) bar.classList.add('stage2'); else bar.classList.add('stage3');
  document.documentElement.style.setProperty('--river-hue', String(205-Math.round(pct*0.7)));
  animateNumber(intakeMlEl,cur); animateNumber(intakeCupsEl,cur/240);
  quoteByProgress(pct);
  if(!state.hitGoal && pct>=100){ state.hitGoal=true; confettiBurstTop(); ping('🎉 יעד המים הושג!'); setTimeout(askForTomorrow,900); }
  else if(pct<100){ state.hitGoal=false; }
  localStorage.setItem('drink.v12', JSON.stringify(state));
}

/* Confetti ענק על כל המסך */
function confettiBurstTop(){
  const ctx=confettiTop.getContext('2d');
  confettiTop.width=innerWidth; confettiTop.height=innerHeight;
  const N=360;
  const parts=Array.from({length:N},()=>({
    x:Math.random()*confettiTop.width, y:confettiTop.height+Math.random()*30,
    vx:(Math.random()-0.5)*4, vy:-(3.2+Math.random()*6),
    s:2+Math.random()*5, r:Math.random()*Math.PI, vr:(Math.random()-0.5)*0.35,
    c:`hsl(${190+Math.random()*120} 95% ${55+Math.random()*20}%)`, a:1
  }));
  let t=0; (function tick(){
    ctx.clearRect(0,0,confettiTop.width,confettiTop.height);
    for(const p of parts){
      p.x+=p.vx; p.y+=p.vy; p.vy+=.05; p.r+=p.vr; p.a-=.007;
      ctx.globalAlpha=Math.max(0,p.a); ctx.fillStyle=p.c;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r);
      ctx.fillRect(-p.s/2,-p.s,p.s,p.s*2); ctx.restore();
    }
    t++; if(t<380) requestAnimationFrame(tick); else ctx.clearRect(0,0,confettiTop.width,confettiTop.height);
  })();
}

/* התראות */
async function ensurePermission(){ if(!('Notification'in window)) return false; if(Notification.permission==='granted') return true; if(Notification.permission!=='denied'){ const r=await Notification.requestPermission(); return r==='granted'; } return false; }
function ping(title='תזכורת שתייה'){ const left=Math.max(0,(state.targetMl||0)-(state.intakeMl||0)); const body=left>0?`זמן שלוק. נותרו ~${Math.round(left/250)*250} מ״ל ליעד.`:'היעד היומי הושג! 💧'; if('Notification'in window && Notification.permission==='granted'){ new Notification(title,{body}); } if(playSound?.checked) playDing(); if(vibrate?.checked && navigator.vibrate) navigator.vibrate([40,60,40]); }
let timer=null;
startRem.addEventListener('click', async()=>{ const ok=await ensurePermission(); if(!ok) alert('נא לאשר התראות בדפדפן.'); const every=+remEvery.value||45; clearInterval(timer); timer=setInterval(()=>ping('💧 שתייה'), every*60*1000); ping('💧 שתייה'); });
stopRem.addEventListener('click', ()=>{ clearInterval(timer); timer=null; });
testPing.addEventListener('click', ()=> ping('בדיקת תזכורת'));

/* דקות להתראה חד־פעמית */
(function fillAlarm(){const frag=document.createDocumentFragment(); for(let m=1;m<=180;m++){const o=document.createElement('option'); o.value=String(m); o.textContent=o.value; frag.appendChild(o);} alarmMin.appendChild(frag);})();

/* בוני צ'יפים (סגירה אוטומטית) */
function buildChips(c,vals,onPick,fmt=v=>String(v),modalEl){
  c.innerHTML='';
  vals.forEach(v=>{
    const b=document.createElement('button'); b.type='button'; b.className='chip'; b.textContent=fmt(v);
    b.addEventListener('click',()=>{
      onPick(v);
      c.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      if(modalEl) modalEl.hidden=true;   // סוגר מיידית
    });
    c.appendChild(b);
  });
}

function buildWeight(){ buildChips(weightChips,[40,45,50,55,60,65,70,75,80,85,90,95,100,110,120],v=>{ weight.value=v; onAnyChange(); },v=>`${v}`, weightModal); }
function buildAge(){ buildChips(ageChips,Array.from({length:19},(_,i)=>10+i*5),v=>{ age.value=v; onAnyChange(); },v=>`${v}`, ageModal); }
function buildHeight(){ buildChips(heightChips,[150,155,160,165,170,175,180,185,190,195,200,205],v=>{ height.value=v; onAnyChange(); },v=>`${v}`, heightModal); }
function buildCoffee(){ buildChips(coffeeChips,[0,1,2,3,4,5,6,7,8],c=>{ state.coffeeMl=c*240; onAnyChange(); },v=>`${v} כוס${v===1?'':'ות'}`, coffeeModal); }
function buildAltitude(){ buildChips(altitudeChips,['רגיל','1000–2000 מ׳','2000+ מ׳'],i=>{ state.altitudeCat=i; onAnyChange(); },v=>`${v}`, altitudeModal); }

/* פתיחה/סגירה של מודלים */
openWeight.addEventListener('click', ()=>{ weightModal.hidden=false; buildWeight(); });
closeWeight.addEventListener('click', ()=> weightModal.hidden=true);
openAge.addEventListener('click', ()=>{ ageModal.hidden=false; buildAge(); });
closeAge.addEventListener('click', ()=> ageModal.hidden=true);
openHeight.addEventListener('click', ()=>{ heightModal.hidden=false; buildHeight(); });
closeHeight.addEventListener('click', ()=> heightModal.hidden=true);
openCoffee.addEventListener('click', ()=>{ coffeeModal.hidden=false; buildCoffee(); });
closeCoffee.addEventListener('click', ()=> coffeeModal.hidden=true);
setCoffeeMl.addEventListener('click', e=>{ e.preventDefault(); state.coffeeMl=Math.max(0,+coffeeMl.value||0); onAnyChange(); coffeeModal.hidden=true; });
openAltitude.addEventListener('click', ()=>{ altitudeModal.hidden=false; buildAltitude(); });
closeAltitude.addEventListener('click', ()=> altitudeModal.hidden=true);

/* סטפרים */
wPlus.addEventListener('click', ()=>{ weight.value=(+weight.value||0)+0.5; onAnyChange(); });
wMinus.addEventListener('click', ()=>{ weight.value=Math.max(0,(+weight.value||0)-0.5); onAnyChange(); });
aPlus.addEventListener('click', ()=>{ age.value=(+age.value||0)+1; onAnyChange(); });
aMinus.addEventListener('click', ()=>{ age.value=Math.max(0,(+age.value||0)-1); onAnyChange(); });
hPlus.addEventListener('click', ()=>{ height.value=(+height.value||0)+1; onAnyChange(); });
hMinus.addEventListener('click', ()=>{ height.value=Math.max(0,(+height.value||0)-1); onAnyChange(); });

/* שליטה בצריכה */
[add250,add500,add1000].forEach(b=> b.addEventListener('click', e=>{
  e.preventDefault();
  const inc=b===add250?250:(b===add500?500:1000);
  state.intakeMl = clamp((state.intakeMl||0)+inc, 0, 25000);
  onAnyChange();
}));
resetBtn.addEventListener('click', e=>{ e.preventDefault(); state.intakeMl=0; onAnyChange(); });

/* שינויי קלט => רנדר */
[sex,isHot,preg,lact,activeMin,age,height,weight].forEach(el=> el.addEventListener('change', onAnyChange));
form.addEventListener('submit', e=>{ e.preventDefault(); state.intakeMl??=0; onAnyChange(); });

function onAnyChange(){ render(); }

function askForTomorrow(){ if(confirm('היעד הושג! לקבוע יעד גם למחר או תזכורת מאוחרת יותר?')){ if(!alarmMin.value) alarmMin.value='60'; startAlarm.click(); } }

/* התראה חד־פעמית */
let alarmHandle=null;
startAlarm.addEventListener('click', async()=>{ const ok=await ensurePermission(); if(!ok) alert('נא לאשר התראות.'); const m=+alarmMin.value||1; if(alarmHandle) clearTimeout(alarmHandle); alarmHandle=setTimeout(()=>ping('⏰ התראת שתייה'), m*60*1000); ping('⏳ ההתראה הופעלה'); });
cancelAlarm.addEventListener('click', ()=>{ if(alarmHandle){ clearTimeout(alarmHandle); alarmHandle=null; } ping('ההתראה בוטלה'); });

/* Init */
(function init(){
  if(!weight.value) weight.value=70;
  if(!age.value) age.value=26;
  if(!height.value) height.value=170;
  render();
})();
