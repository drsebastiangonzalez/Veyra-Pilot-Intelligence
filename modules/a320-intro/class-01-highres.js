(()=>{
'use strict';
const stage=document.getElementById('stage');
const names=['a318','a319','a320','a321'];
const uris={};
async function loadImage(name){
  const parts=await Promise.all([0,1,2].map(i=>fetch(`assets/b64/${name}.${i}?v=2`,{cache:'force-cache'}).then(r=>{if(!r.ok)throw new Error(`${name}.${i} ${r.status}`);return r.text()})));
  return `data:image/webp;base64,${parts.join('').replace(/\s/g,'')}`;
}
const ready=Promise.all(names.map(async n=>{uris[n.toUpperCase()]=await loadImage(n)}));
function coreDocument(){
  try{
    const v2=stage?.contentDocument;
    const inner=v2?.getElementById('stage');
    return inner?.contentDocument||null;
  }catch(_){return null}
}
function applyHighRes(){
  const d=coreDocument();
  if(!d?.body || !uris.A320)return false;
  d.querySelectorAll('.airbus,.heroLogo,.airbusMark,.heroAirbusMark,img[src*="airbus-logo"]').forEach(el=>el.remove());
  if(!d.getElementById('veyraHighResStyle')){
    const st=d.createElement('style');st.id='veyraHighResStyle';
    st.textContent='.realAircraft>img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;image-rendering:auto!important}.realFamilyPlane img{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;image-rendering:auto!important}';
    d.head.appendChild(st);
  }
  const family=d.getElementById('familyUserImage');
  if(family){
    if(family.dataset.highres!=='1'){
      family.src=uris.A320;family.dataset.highres='1';family.alt='Vista lateral A320 en alta resolución';
    }
    d.querySelectorAll('[data-family]').forEach(btn=>{
      if(btn.dataset.highresBound==='1')return;
      btn.dataset.highresBound='1';
      btn.addEventListener('click',()=>{
        const fam=String(btn.dataset.family||'').toUpperCase();
        if(!uris[fam])return;
        setTimeout(()=>{family.src=uris[fam];family.alt=`Vista lateral ${fam} en alta resolución`},0);
      });
    });
  }
  return Boolean(family);
}
function retry(){let n=0;const t=setInterval(()=>{n++;if(applyHighRes()||n>20)clearInterval(t)},150)}
stage?.addEventListener('load',()=>{ready.then(()=>retry()).catch(err=>console.error('Veyra A320 media load',err))});
})();
