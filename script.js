const qs=(s,c=document)=>c.querySelector(s);const qsa=(s,c=document)=>[...c.querySelectorAll(s)];
const progress=qs('.progress span'),topButton=qs('.to-top'),header=qs('.header'),menu=qs('.menu');
const preloader=qs('.preloader'),enterSite=qs('.enter-site'),cursor=qs('.cursor-orb'),storyProduct=qs('.story-product');
qs('#year').textContent=new Date().getFullYear();

function closeLoader(){preloader.classList.add('is-hidden');document.body.classList.remove('is-loading');setTimeout(()=>preloader.remove(),900)}
enterSite?.addEventListener('click',closeLoader);window.addEventListener('load',()=>setTimeout(closeLoader,1750),{once:true});

menu.addEventListener('click',()=>{header.classList.toggle('menu-active');document.body.classList.toggle('menu-open')});
qsa('.header nav a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('menu-active');document.body.classList.remove('menu-open')}));
topButton.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

const reveals=qsa('.reveal');const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -45px'});reveals.forEach(el=>revealObserver.observe(el));

const chapterLinks=qsa('.chapter-rail a');const chapterSections=qsa('[data-chapter-section]');
const chapterObserver=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){const key=e.target.dataset.chapterSection;chapterLinks.forEach(a=>a.classList.toggle('active',a.dataset.chapter===key))}})},{rootMargin:'-38% 0px -48%',threshold:0});chapterSections.forEach(s=>chapterObserver.observe(s));

let mouseX=innerWidth/2,mouseY=innerHeight/2;window.addEventListener('pointermove',e=>{mouseX=e.clientX;mouseY=e.clientY;if(cursor){cursor.style.opacity='1';cursor.style.left=mouseX+'px';cursor.style.top=mouseY+'px'}},{passive:true});

qsa('[data-parallax]').forEach(el=>{el.dataset.base='0'});
function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight;const pct=max>0?scrollY/max:0;
  progress.style.width=`${pct*100}%`;topButton.classList.toggle('show',scrollY>700);
  header.classList.toggle('scrolled',scrollY>80);
  qsa('[data-parallax]').forEach(el=>{const speed=Number(el.dataset.parallax||.1);el.style.transform=`translate3d(0,${scrollY*speed}px,0)`});
  if(storyProduct){
    const start=innerHeight*.55,end=document.documentElement.scrollHeight-innerHeight*1.3;
    const active=scrollY>start&&scrollY<end&&innerWidth>1100;storyProduct.classList.toggle('is-visible',active);
    if(active){const t=Math.min(1,Math.max(0,(scrollY-start)/(end-start)));const x=Math.sin(t*Math.PI*4)*18;const y=(t-.5)*120;const scale=.68+Math.sin(t*Math.PI)*.16;storyProduct.style.transform=`translate3d(${x}px,calc(-50% + ${y}px),0) scale(${scale}) rotate(${Math.sin(t*Math.PI*3)*3}deg)`;storyProduct.style.opacity=String(Math.min(1,(scrollY-start)/240,(end-scrollY)/240));}
  }
  const journey=qs('.journey-map');if(journey){const r=journey.getBoundingClientRect();const jp=Math.min(1,Math.max(0,(innerHeight*.75-r.top)/(r.height+innerHeight*.4)));journey.style.setProperty('--journey-progress',`${jp*100}%`);const cards=qsa('.process-line article',journey);cards.forEach((c,i)=>c.classList.toggle('is-current',jp>i/cards.length&&jp<(i+1.3)/cards.length));}
}
addEventListener('scroll',updateScroll,{passive:true});addEventListener('resize',updateScroll,{passive:true});updateScroll();

function addTilt(el){el.addEventListener('pointermove',e=>{if(innerWidth<900)return;const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.transform=`perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-4px)`});el.addEventListener('pointerleave',()=>el.style.transform='')}
qsa('.tilt-card,.tilt-group>article,.product-gallery figure,.system-block').forEach(addTilt);

qsa('.interactive-decisions article').forEach((item,i)=>{if(i===0)item.classList.add('open');item.setAttribute('tabindex','0');const toggle=()=>{qsa('.interactive-decisions article').forEach(x=>{if(x!==item)x.classList.remove('open')});item.classList.toggle('open')};item.addEventListener('click',toggle);item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle()}})});

const counters=qsa('.outcome-grid strong');const metricObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;const raw=el.textContent.trim();const n=parseInt(raw,10);if(Number.isFinite(n)){let start=0;const dur=900,t0=performance.now();const tick=t=>{const p=Math.min(1,(t-t0)/dur);el.textContent=String(Math.round(n*(1-Math.pow(1-p,3)))).padStart(raw.length,'0');if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)}metricObserver.unobserve(el)}),{threshold:.7});counters.forEach(c=>metricObserver.observe(c));

qsa('.button').forEach(btn=>btn.addEventListener('pointermove',e=>{if(innerWidth<900)return;const r=btn.getBoundingClientRect(),x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;btn.style.transform=`translate(${x*.08}px,${y*.12}px)`}));qsa('.button').forEach(btn=>btn.addEventListener('pointerleave',()=>btn.style.transform=''));
