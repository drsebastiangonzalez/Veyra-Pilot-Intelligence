(()=>{
  const stage=document.getElementById('stage');
  const zones={
    overhead:['Overhead panel','Controles de sistemas principales y auxiliares.'],
    glareshield:['Glareshield / FCU','FCU, EFIS y alertas maestras.'],
    main:['Main instrument panel','PFD, ND, EWD y SD.'],
    pedestal:['Pedestal','Thrust levers, MCDU, radios y controles ECAM.'],
    left:['Left side console','Sidestick y controles laterales izquierdos.'],
    right:['Right side console','Sidestick y controles laterales derechos.']
  };
  function apply(){
    const outer=stage?.contentDocument;
    const inner=outer?.getElementById('classFrame');
    const d=inner?.contentDocument || outer;
    if(!d?.body)return;
    d.querySelectorAll('.airbusMark,.heroAirbusMark,.brandLegal').forEach(el=>el.remove());
    const sec=[...d.querySelectorAll('main>section')].find(s=>(s.querySelector('.eyebrow')?.textContent||'').toUpperCase().includes('05 · COCKPIT'));
    const old=sec?.querySelector('.cockpit,.cockpitMap');
    if(!old || old.dataset.real==='1')return;
    old.dataset.real='1';
    const style=d.createElement('style');
    style.textContent='.realCockpit{position:relative;background:#02060b;border:1px solid rgba(215,177,90,.35);overflow:hidden}.realCockpit img{display:block;width:auto;max-width:100%;height:auto;margin:auto}.hotspot{position:absolute;transform:translate(-50%,-50%);width:38px;height:38px;border-radius:50%;border:2px solid #e4bd63;background:rgba(7,17,31,.9);color:#f5d88c;font-weight:900}.hotspot.active{background:#e4bd63;color:#07111f}.zoneInfo p{margin:6px 0 0;color:#aeb8c7}@media(max-width:700px){.hotspot{width:30px;height:30px;font-size:9px}}';
    d.head.appendChild(style);
    const box=d.createElement('div');box.className='realCockpit';
    const img=d.createElement('img');img.src='assets/a320-cockpit-user.jpg?v=5';img.alt='Cabina A320';box.appendChild(img);
    const target=sec.querySelector('#zoneInfo');
    const show=k=>{if(!target)return;target.replaceChildren();target.classList.add('zoneInfo');const b=d.createElement('strong');b.textContent=zones[k][0];const p=d.createElement('p');p.textContent=zones[k][1];target.append(b,p)};
    [['overhead','1','50%','16%'],['glareshield','2','50%','41%'],['main','3','50%','54%'],['pedestal','4','50%','75%'],['left','5','18%','61%'],['right','6','82%','61%']].forEach(([k,n,l,t])=>{const b=d.createElement('button');b.type='button';b.className='hotspot';b.textContent=n;b.style.left=l;b.style.top=t;b.onclick=()=>{box.querySelectorAll('.hotspot').forEach(x=>x.classList.remove('active'));b.classList.add('active');show(k)};box.appendChild(b)});
    old.replaceWith(box);show('overhead');
  }
  stage?.addEventListener('load',()=>{setTimeout(apply,100);setTimeout(apply,500);setTimeout(apply,1200)});
})();
