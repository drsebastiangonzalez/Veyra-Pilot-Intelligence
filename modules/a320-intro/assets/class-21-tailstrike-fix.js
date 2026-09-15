(()=>{
  const eye=[...document.querySelectorAll('.eyebrow')].find(x=>x.textContent.includes('05 · TAILSTRIKE GEOMETRY'));
  const section=eye?.closest('section');
  if(!section)return;

  const planeSrc='assets/class-21-a320-tailstrike-approved.webp?v=1';
  const style=document.createElement('style');
  style.id='class21-tailstrike-v4-style';
  style.textContent=`
  .tsv4-lab{display:grid;grid-template-columns:.78fr 1.22fr;gap:18px}
  .tsv4-controls{display:grid;gap:10px;align-content:start}
  .tsv4-stage{border:1px solid rgba(255,255,255,.1);border-radius:24px;overflow:hidden;background:#06101a}
  .tsv4-canvas{position:relative;min-height:390px;overflow:hidden;background:linear-gradient(#06101a 0 70%,#12171d 70%)}
  .tsv4-canvas:after{content:"";position:absolute;left:0;right:0;top:70%;bottom:0;background:linear-gradient(180deg,rgba(255,255,255,.012),rgba(0,0,0,.18));pointer-events:none;z-index:1}
  .tsv4-metric{position:absolute;left:22px;top:18px;z-index:6;color:#8f9cad;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}
  .tsv4-aircraft{position:absolute;left:5.5%;top:64px;width:89%;z-index:3;transform-origin:49.5% 94%;transition:transform .38s ease,top .38s ease}
  .tsv4-aircraft img{display:block;width:100%;height:auto;user-select:none;-webkit-user-drag:none}
  .tsv4-stage[data-state="compressed"] .tsv4-aircraft{transform:none}
  .tsv4-stage[data-state="extended"] .tsv4-aircraft{transform:translateY(-4px) rotate(1.8deg)}
  .tsv4-geometry{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none}
  .tsv4-runway{stroke:#7b8590;stroke-width:2}.tsv4-reference{stroke:rgba(215,177,90,.48);stroke-width:2}.tsv4-pitch{stroke:#d7b15a;stroke-width:2.4}.tsv4-arc{fill:none;stroke:#d7b15a;stroke-width:2;opacity:.76}.tsv4-pivot{fill:#081018;stroke:#aab4bf;stroke-width:2}.tsv4-tailContact{fill:#e45c5c;stroke:#ff8b8b;stroke-width:1.2}.tsv4-label{fill:#8f9cad;font:12px Inter,-apple-system,sans-serif;letter-spacing:.08em}.tsv4-label.gold{fill:#f0d38d}
  .tsv4-caption{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:16px 18px;border-top:1px solid rgba(255,255,255,.08);background:rgba(3,7,12,.9)}
  .tsv4-state{max-width:66%;color:#a8b5c6;font-size:.92rem;line-height:1.45}
  .tsv4-tag{display:block;margin-top:8px;color:#f0d38d;font-size:.73rem;letter-spacing:.09em;text-transform:uppercase}
  .tsv4-read{flex:0 0 auto;color:#f0d38d;font:700 1.12rem Georgia,serif;background:rgba(215,177,90,.06);padding:9px 13px;border-radius:999px;border:1px solid rgba(215,177,90,.28);white-space:nowrap}
  @media(max-width:900px){.tsv4-lab{grid-template-columns:1fr}.tsv4-canvas{min-height:370px}.tsv4-aircraft{left:4%;width:92%;top:68px}}
  @media(max-width:650px){.tsv4-canvas{min-height:330px}.tsv4-metric{left:14px;top:14px;font-size:.58rem}.tsv4-aircraft{left:2%;width:96%;top:70px}.tsv4-caption{display:grid;grid-template-columns:1fr;padding:14px}.tsv4-state{max-width:none;font-size:.84rem}.tsv4-read{justify-self:start;font-size:.95rem}.tsv4-label{font-size:10px}}
  `;
  document.head.appendChild(style);

  section.innerHTML=`<div class="wrap">
    <div class="head"><div><div class="eyebrow">05 · TAILSTRIKE GEOMETRY</div><h2>Tail clearance changes with MLG compression.</h2></div><p class="lead">El ángulo de contacto es geometría. Cambia porque la relación entre fuselaje, tren principal y pavimento cambia.</p></div>
    <div class="tsv4-lab">
      <div class="tsv4-controls">
        <button class="gearBtn active" data-ts-state="compressed">MLG COMPRESSED · 11.7°</button>
        <button class="gearBtn" data-ts-state="extended">MLG EXTENDED · 13.5°</button>
        <div class="notice"><strong>A320 reference:</strong> 11.7° y 13.5° son referencias geométricas de pitch attitude para contacto de cola en el A320; no son una aircraft limitation equivalente a VMO/MMO.</div>
      </div>
      <div class="tsv4-stage" id="tsv4Stage" data-state="compressed">
        <div class="tsv4-canvas">
          <div class="tsv4-metric">RUNWAY · MLG REFERENCE · FUSELAGE ATTITUDE · TAIL CONTACT</div>
          <div class="tsv4-aircraft"><img src="${planeSrc}" alt="A320 side profile"></div>
          <svg class="tsv4-geometry" viewBox="0 0 1000 390" preserveAspectRatio="none" aria-hidden="true">
            <line class="tsv4-runway" x1="35" y1="300" x2="965" y2="300"/>
            <line class="tsv4-reference" x1="500" y1="300" x2="355" y2="300"/>
            <line class="tsv4-pitch" id="tsv4Pitch" x1="500" y1="300" x2="345" y2="267"/>
            <path class="tsv4-arc" id="tsv4Arc" d="M 430 300 A 70 70 0 0 0 431.5 286"/>
            <circle class="tsv4-pivot" cx="500" cy="300" r="11"/>
            <circle class="tsv4-tailContact" cx="858" cy="300" r="6"/>
            <text class="tsv4-label" x="45" y="320">RUNWAY</text>
            <text class="tsv4-label gold" x="515" y="320">MLG REFERENCE / PIVOT</text>
          </svg>
        </div>
        <div class="tsv4-caption">
          <div class="tsv4-state" id="tsv4State">MLG compression lowers the fuselage relative to the runway, reducing the pitch attitude available before tail contact.<span class="tsv4-tag">GEOMETRY ≠ CERTIFIED FLIGHT LIMITATION</span></div>
          <div class="tsv4-read" id="tsv4Read">11.7° · MLG compressed</div>
        </div>
      </div>
    </div>
  </div>`;

  const stage=document.getElementById('tsv4Stage');
  const read=document.getElementById('tsv4Read');
  const state=document.getElementById('tsv4State');
  const pitch=document.getElementById('tsv4Pitch');
  const arc=document.getElementById('tsv4Arc');
  const buttons=[...section.querySelectorAll('[data-ts-state]')];

  function geometry(angle){
    const cx=500,cy=300,rLine=158,rArc=70,a=angle*Math.PI/180;
    const x2=cx-rLine*Math.cos(a),y2=cy-rLine*Math.sin(a);
    pitch.setAttribute('x2',x2.toFixed(1)); pitch.setAttribute('y2',y2.toFixed(1));
    const sx=cx-rArc,sy=cy,ex=cx-rArc*Math.cos(a),ey=cy-rArc*Math.sin(a);
    arc.setAttribute('d',`M ${sx} ${sy} A ${rArc} ${rArc} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`);
  }

  function setState(next){
    const extended=next==='extended';
    const angle=extended?13.5:11.7;
    stage.dataset.state=next;
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.tsState===next));
    read.textContent=extended?'13.5° · MLG extended':'11.7° · MLG compressed';
    state.innerHTML=(extended?'With the strut extended, the fuselage sits higher relative to the runway, so more pitch attitude is geometrically available before tail contact.':'MLG compression lowers the fuselage relative to the runway, reducing the pitch attitude available before tail contact.')+'<span class="tsv4-tag">GEOMETRY ≠ CERTIFIED FLIGHT LIMITATION</span>';
    geometry(angle);
  }

  buttons.forEach(b=>b.addEventListener('click',()=>setState(b.dataset.tsState)));
  setState('compressed');
})();
