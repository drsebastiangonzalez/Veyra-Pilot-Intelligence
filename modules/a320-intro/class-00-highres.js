(()=>{
'use strict';
const stage=document.getElementById('stage');
let cockpitData=null;
const zones={
  overhead:['Overhead panel','Controles de sistemas: eléctrico, hidráulico, combustible, neumático, antihielo, fuego, luces y APU.'],
  glareshield:['Glareshield / FCU','FCU, paneles EFIS y Master Warning / Master Caution.'],
  main:['Main instrument panel','PFD, ND, EWD y SD, además de las indicaciones principales de vuelo y sistemas.'],
  pedestal:['Pedestal','Thrust levers, engine master switches, MCDU, radios, speedbrake y controles ECAM.'],
  left:['Left side console','Sidestick y controles locales del lado izquierdo.'],
  right:['Right side console','Sidestick y controles locales del lado derecho.']
};

async function loadCockpit(){
  const text=await fetch('assets/b64hq/cockpit.0?v=1',{cache:'force-cache'})
    .then(r=>{if(!r.ok) throw new Error(`cockpit.0 ${r.status}`); return r.text();});
  cockpitData=`data:image/jpeg;base64,${text.replace(/\s/g,'')}`;
}

function coreDocument(){
  try{
    const outer=stage?.contentDocument;
    const inner=outer?.getElementById('classFrame');
    return inner?.contentDocument||outer||null;
  }catch(_){return null}
}

function addStyle(d){
  if(d.getElementById('veyraOriginalCockpitStyle'))return;
  const st=d.createElement('style');
  st.id='veyraOriginalCockpitStyle';
  st.textContent=`
    .airbusMark,.heroAirbusMark,.brandLegal,img[src*="airbus-logo"]{display:none!important}
    .realCockpit{
      position:relative;
      width:min(100%,1100px);
      margin:28px auto 0;
      background:#02060b;
      border:1px solid rgba(215,177,90,.35);
      overflow:hidden;
    }
    .realCockpit img{display:block;width:100%;height:auto;margin:0;image-rendering:auto}
    .cockpitHotspot{
      position:absolute;transform:translate(-50%,-50%);
      width:42px;height:42px;border-radius:50%;
      border:2px solid #e4bd63;background:rgba(7,17,31,.90);
      color:#f5d88c;font-weight:900;font-size:12px;
      box-shadow:0 8px 22px rgba(0,0,0,.45);cursor:pointer
    }
    .cockpitHotspot.active{background:#e4bd63;color:#07111f}
    .zoneInfo p{margin:6px 0 0;color:#aeb8c7}
    @media(max-width:700px){
      .realCockpit{margin-top:18px}
      .cockpitHotspot{width:32px;height:32px;font-size:9px}
    }
  `;
  d.head.appendChild(st);
}

function show(d,sec,key){
  const target=sec.querySelector('#zoneInfo');
  if(!target)return;
  target.replaceChildren();
  target.classList.add('zoneInfo');
  const b=d.createElement('strong'); b.textContent=zones[key][0];
  const p=d.createElement('p'); p.textContent=zones[key][1];
  target.append(b,p);
}

function apply(){
  if(!cockpitData)return false;
  const d=coreDocument();
  if(!d?.body)return false;
  addStyle(d);
  d.querySelectorAll('.airbusMark,.heroAirbusMark,.brandLegal,img[src*="airbus-logo"]').forEach(el=>el.remove());

  const sec=[...d.querySelectorAll('main>section')].find(s=>
    (s.querySelector('.eyebrow')?.textContent||'').toUpperCase().includes('05 · COCKPIT')
  );
  if(!sec)return false;

  const lead=sec.querySelector('.lead');
  if(lead) lead.textContent='Selecciona una zona de la cabina para identificar su función principal.';

  const current=sec.querySelector('.realCockpit');
  if(current?.dataset.original==='1') return true;

  const old=sec.querySelector('.cockpit,.cockpitMap,.realCockpit');
  if(!old)return false;

  const box=d.createElement('div');
  box.className='realCockpit';
  box.dataset.original='1';

  const img=d.createElement('img');
  img.src=cockpitData;
  img.alt='Cabina A320, vista frontal';
  box.appendChild(img);

  const pts=[
    ['overhead','1','50%','13%'],
    ['glareshield','2','50%','38%'],
    ['main','3','50%','53%'],
    ['pedestal','4','50%','72%'],
    ['left','5','23%','58%'],
    ['right','6','77%','58%']
  ];
  pts.forEach(([key,label,left,top])=>{
    const b=d.createElement('button');
    b.type='button'; b.className='cockpitHotspot'; b.textContent=label;
    b.style.left=left; b.style.top=top;
    b.setAttribute('aria-label',zones[key][0]);
    b.addEventListener('click',()=>{
      box.querySelectorAll('.cockpitHotspot').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      show(d,sec,key);
    });
    box.appendChild(b);
  });

  old.replaceWith(box);
  show(d,sec,'overhead');
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
  loadCockpit().then(retry).catch(err=>console.error('Veyra A320 cockpit media',err));
});
})();