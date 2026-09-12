(()=>{
  const stage=document.getElementById('stage');
  const zones={
    overhead:['Overhead Panel','Controles y paneles de sistemas ubicados sobre la tripulación.'],
    glareshield:['Glareshield / FCU','FCU, EFIS y controles de guiado situados sobre el panel principal.'],
    main:['Main Instrument Panel','PFD, ND, EWD, SD e instrumentos principales de vuelo.'],
    pedestal:['Pedestal','Thrust levers, MCDU, radios y controles centrales.'],
    left:['Left Side Console','Sidestick y controles laterales del puesto izquierdo.'],
    right:['Right Side Console','Sidestick y controles laterales del puesto derecho.']
  };

  function apply(){
    const outer=stage?.contentDocument;
    const inner=outer?.getElementById('classFrame');
    const d=inner?.contentDocument || outer;
    if(!d?.body)return;

    d.querySelectorAll('.airbusMark,.heroAirbusMark,.brandLegal').forEach(el=>el.remove());

    const sec=[...d.querySelectorAll('main>section')].find(s=>(s.querySelector('.eyebrow')?.textContent||'').toUpperCase().includes('05 · COCKPIT'));
    if(!sec)return;

    const obsolete=[...sec.querySelectorAll('p')].find(p=>(p.textContent||'').includes('Este esquema es didáctico'));
    if(obsolete)obsolete.remove();
    sec.querySelector('.head')?.classList.add('realCockpitHead');

    const old=sec.querySelector('.cockpit,.cockpitMap');
    if(!old || old.dataset.real==='1')return;
    old.dataset.real='1';

    if(!d.getElementById('veyraCockpitGeographyStyle')){
      const style=d.createElement('style');
      style.id='veyraCockpitGeographyStyle';
      style.textContent=`
        .realCockpitHead{grid-template-columns:1fr!important}
        .realCockpitHead h2{max-width:860px}
        .realCockpit{position:relative;width:100%;aspect-ratio:16/9;background:#02060b;border:1px solid rgba(215,177,90,.35);overflow:hidden}
        .realCockpit img{display:block;width:100%;height:100%;object-fit:contain;image-rendering:auto}
        .hotspot{position:absolute;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;border:2px solid #e4bd63;background:rgba(7,17,31,.88);color:#f5d88c;font-size:12px;font-weight:900;cursor:pointer;box-shadow:0 7px 22px rgba(0,0,0,.45)}
        .hotspot:hover,.hotspot:focus-visible,.hotspot.active{background:#e4bd63;color:#07111f;outline:none}
        .zoneInfo p{margin:6px 0 0;color:#aeb8c7}
        @media(max-width:700px){.hotspot{width:31px;height:31px;font-size:9px}.realCockpitHead h2{max-width:none}}
      `;
      d.head.appendChild(style);
    }

    const box=d.createElement('div');
    box.className='realCockpit';

    const img=d.createElement('img');
    img.src='assets/a320-cockpit-geography.jpg?v=1';
    img.alt='Cabina A320 frontal para Cockpit Geography';
    img.loading='eager';
    img.decoding='async';
    box.appendChild(img);

    const target=sec.querySelector('#zoneInfo');
    const show=k=>{
      if(!target)return;
      target.replaceChildren();
      target.classList.add('zoneInfo');
      const b=d.createElement('strong');
      b.textContent=zones[k][0];
      const p=d.createElement('p');
      p.textContent=zones[k][1];
      target.append(b,p);
    };

    [
      ['overhead','1','50%','13%'],
      ['glareshield','2','50%','39%'],
      ['main','3','50%','49%'],
      ['pedestal','4','50%','72%'],
      ['left','5','19%','57%'],
      ['right','6','81%','57%']
    ].forEach(([k,n,l,t])=>{
      const b=d.createElement('button');
      b.type='button';
      b.className='hotspot';
      b.textContent=n;
      b.style.left=l;
      b.style.top=t;
      b.setAttribute('aria-label',zones[k][0]);
      b.onclick=()=>{
        box.querySelectorAll('.hotspot').forEach(x=>x.classList.remove('active'));
        b.classList.add('active');
        show(k);
      };
      box.appendChild(b);
    });

    old.replaceWith(box);
    box.querySelector('.hotspot')?.classList.add('active');
    show('overhead');
  }

  stage?.addEventListener('load',()=>{
    setTimeout(apply,100);
    setTimeout(apply,500);
    setTimeout(apply,1200);
  });
})();
