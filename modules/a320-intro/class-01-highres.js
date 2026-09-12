(()=>{
'use strict';
const stage=document.getElementById('stage');
let spriteData=null;

async function loadSprite(){
  const parts=await Promise.all([0,1,2,3].map(i=>
    fetch(`assets/b64hq/family.${i}?v=1`,{cache:'force-cache'})
      .then(r=>{if(!r.ok) throw new Error(`family.${i} ${r.status}`); return r.text();})
  ));
  spriteData=`data:image/jpeg;base64,${parts.join('').replace(/\s/g,'')}`;
}

function coreDocument(){
  try{
    const v2=stage?.contentDocument;
    const inner=v2?.getElementById('stage');
    return inner?.contentDocument||null;
  }catch(_){return null}
}

function addStyle(d){
  if(d.getElementById('veyraOriginalMediaStyle')) return;
  const st=d.createElement('style');
  st.id='veyraOriginalMediaStyle';
  st.textContent=`
    .airbus,.heroLogo,.airbusMark,.heroAirbusMark,img[src*="airbus-logo"]{display:none!important}
    .aircraftSilhouette.realAircraft{
      position:relative!important;
      display:block!important;
      height:auto!important;
      min-height:0!important;
      aspect-ratio:3/2!important;
      overflow:hidden!important;
      background:#020305!important;
      border:1px solid rgba(215,177,90,.34)!important
    }
    .familySpriteVisual{
      position:absolute;inset:0;
      background-repeat:no-repeat;
      background-size:200% 200%;
      background-color:#020305;
      image-rendering:auto;
    }
    .realAircraft .familySpriteVisual{z-index:0}
    .realAircraft .realHot{z-index:2}
    .familyPlane.realFamilyPlane{
      position:relative!important;
      display:block!important;
      width:100%!important;
      height:auto!important;
      aspect-ratio:3/2!important;
      min-height:0!important;
      overflow:hidden!important;
      background:#020305!important
    }
    .realFamilyPlane:before,.realFamilyPlane:after{display:none!important}
    .realFamilyPlane .familySpriteVisual{z-index:0}
    @media(max-width:700px){
      .familyPlane.realFamilyPlane{height:auto!important;aspect-ratio:3/2!important}
    }
  `;
  d.head.appendChild(st);
}

const positions={A318:'0% 0%',A319:'100% 0%',A320:'0% 100%',A321:'100% 100%'};

function addVisual(d,host,kind,family){
  host.querySelectorAll('img').forEach(n=>n.remove());
  let visual=host.querySelector(`.familySpriteVisual[data-kind="${kind}"]`);
  if(!visual){
    visual=d.createElement('div');
    visual.className='familySpriteVisual';
    visual.dataset.kind=kind;
    host.prepend(visual);
  }
  visual.style.backgroundImage=`url("${spriteData}")`;
  visual.style.backgroundPosition=positions[family]||positions.A320;
  visual.setAttribute('role','img');
  visual.setAttribute('aria-label',`Vista lateral ${family}`);
  return visual;
}

function apply(){
  if(!spriteData) return false;
  const d=coreDocument();
  if(!d?.body) return false;
  addStyle(d);
  d.querySelectorAll('.airbus,.heroLogo,.airbusMark,.heroAirbusMark,img[src*="airbus-logo"]').forEach(el=>el.remove());

  const config=d.querySelector('.aircraftSilhouette.realAircraft')||d.querySelector('.aircraftSilhouette');
  const familyHost=d.getElementById('familyPlane')||d.querySelector('.familyPlane');
  if(!config || !familyHost) return false;

  config.classList.add('realAircraft');
  addVisual(d,config,'config','A320');

  familyHost.classList.add('realFamilyPlane');
  familyHost.replaceChildren();
  const familyVisual=addVisual(d,familyHost,'family','A320');

  d.querySelectorAll('[data-family]').forEach(btn=>{
    if(btn.dataset.originalBound==='1') return;
    btn.dataset.originalBound='1';
    btn.addEventListener('click',()=>{
      const fam=String(btn.dataset.family||'').toUpperCase();
      if(!positions[fam]) return;
      familyVisual.style.backgroundPosition=positions[fam];
      familyVisual.setAttribute('aria-label',`Vista lateral ${fam}`);
    });
  });
  return true;
}

function retry(){
  let n=0;
  const timer=setInterval(()=>{
    n++;
    if(apply()||n>40) clearInterval(timer);
  },150);
}

stage?.addEventListener('load',()=>{
  loadSprite().then(retry).catch(err=>console.error('Veyra A320 original media',err));
});
})();