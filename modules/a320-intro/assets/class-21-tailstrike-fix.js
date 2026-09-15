(()=>{
  const eye=[...document.querySelectorAll('.eyebrow')].find(x=>x.textContent.includes('05 · TAILSTRIKE GEOMETRY'));
  const section=eye?.closest('section');
  if(!section)return;

  const style=document.createElement('style');
  style.id='class21-tailstrike-v2-style';
  style.textContent=`
  .tsv2-lab{display:grid;grid-template-columns:.78fr 1.22fr;gap:18px}
  .tsv2-controls{display:grid;gap:10px;align-content:start}
  .tsv2-stage{border:1px solid rgba(255,255,255,.1);border-radius:24px;min-height:430px;position:relative;overflow:hidden;background:linear-gradient(#06101a 0 61%,#12171d 61%)}
  .tsv2-stage:after{content:"";position:absolute;left:0;right:0;top:61%;bottom:0;background:linear-gradient(180deg,rgba(255,255,255,.01),rgba(0,0,0,.18));pointer-events:none}
  .tsv2-metric{position:absolute;left:22px;top:18px;z-index:5;color:#8f9cad;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}
  .tsv2-geometry{position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none}
  .tsv2-runway{stroke:#7b8590;stroke-width:2}.tsv2-reference{stroke:rgba(215,177,90,.48);stroke-width:2}.tsv2-pitch{stroke:#d7b15a;stroke-width:2}.tsv2-arc{fill:none;stroke:#d7b15a;stroke-width:2;opacity:.78}.tsv2-pivot{fill:#d7b15a}.tsv2-svg-label{fill:#8f9cad;font:12px Inter,-apple-system,sans-serif;letter-spacing:.08em}.tsv2-svg-label.gold{fill:#f0d38d}
  .tsv2-aircraft{position:absolute;left:5.5%;top:32%;width:88%;z-index:3;transform-origin:68.2% 73%;transition:transform .38s ease,top .38s ease}
  .tsv2-aircraft img{display:block;width:100%;height:auto;filter:brightness(.9) contrast(1.03) saturate(.82);opacity:.96}
  .tsv2-tail-dot{position:absolute;right:2.4%;top:64%;width:13px;height:13px;border-radius:50%;background:#e45c5c;box-shadow:0 0 18px rgba(228,92,92,.5)}
  .tsv2-stage[data-state="compressed"] .tsv2-aircraft{transform:rotate(11.7deg) translateY(7px)}
  .tsv2-stage[data-state="extended"] .tsv2-aircraft{transform:rotate(13.5deg) translateY(-1px)}
  .tsv2-mlg{position:absolute;left:65.55%;top:48.5%;width:2px;height:78px;z-index:4;background:linear-gradient(#9ba6b1,#606b78);transform-origin:top center;transform:rotate(11.7deg);transition:transform .38s ease,height .38s ease}
  .tsv2-mlg:after{content:"";position:absolute;left:-11px;bottom:-6px;width:24px;height:10px;border-radius:50%;background:#06090d;border:1px solid #8b95a0}
  .tsv2-stage[data-state="extended"] .tsv2-mlg{height:91px;transform:rotate(13.5deg)}
  .tsv2-read{position:absolute;right:20px;bottom:20px;z-index:6;color:#f0d38d;font:700 1.12rem Georgia,serif;background:rgba(5,10,15,.86);padding:9px 13px;border-radius:999px;border:1px solid rgba(215,177,90,.26)}
  .tsv2-state{position:absolute;left:20px;bottom:20px;z-index:6;max-width:58%;color:#a8b5c6;font-size:.9rem;line-height:1.42;background:rgba(5,10,15,.86);padding:10px 12px;border-radius:15px;border:1px solid rgba(255,255,255,.08)}
  .tsv2-tag{display:inline-block;margin-top:6px;color:#f0d38d;font-size:.74rem;letter-spacing:.08em}
  @media(max-width:900px){.tsv2-lab{grid-template-columns:1fr}.tsv2-stage{min-height:390px}}
  @media(max-width:650px){.tsv2-stage{min-height:350px}.tsv2-aircraft{left:2%;width:96%;top:35%}.tsv2-metric{font-size:.6rem;left:14px}.tsv2-state{left:14px;bottom:14px;max-width:60%;font-size:.8rem}.tsv2-read{right:14px;bottom:14px;font-size:.92rem}.tsv2-mlg{left:65.8%;top:50%}}
  `;
  document.head.appendChild(style);

  section.innerHTML=`<div class="wrap">
    <div class="head"><div><div class="eyebrow">05 · TAILSTRIKE GEOMETRY</div><h2>Tail clearance changes with MLG compression.</h2></div><p class="lead">El ángulo de contacto es geometría. Cambia porque la relación entre fuselaje, tren principal y pavimento cambia.</p></div>
    <div class="tsv2-lab">
      <div class="tsv2-controls">
        <button class="gearBtn active" data-ts-state="compressed">MLG COMPRESSED · 11.7°</button>
        <button class="gearBtn" data-ts-state="extended">MLG EXTENDED · 13.5°</button>
        <div class="notice"><strong>A320 reference:</strong> 11.7° y 13.5° son referencias geométricas de pitch attitude para contacto de cola en el A320; no son una aircraft limitation equivalente a VMO/MMO.</div>
      </div>
      <div class="tsv2-stage" id="tsv2Stage" data-state="compressed">
        <div class="tsv2-metric">RUNWAY · MLG REFERENCE · FUSELAGE ATTITUDE · TAIL CONTACT</div>
        <svg class="tsv2-geometry" viewBox="0 0 1000 430" preserveAspectRatio="none" aria-hidden="true">
          <line class="tsv2-runway" x1="35" y1="262" x2="965" y2="262"/>
          <line class="tsv2-reference" x1="675" y1="262" x2="520" y2="262"/>
          <line class="tsv2-pitch" id="tsv2Pitch" x1="675" y1="262" x2="523" y2="230"/>
          <path class="tsv2-arc" id="tsv2Arc" d="M 575 262 A 100 100 0 0 0 577 242"/>
          <circle class="tsv2-pivot" cx="675" cy="262" r="5"/>
          <text class="tsv2-svg-label" x="45" y="281">RUNWAY</text>
          <text class="tsv2-svg-label gold" x="684" y="281">MLG REFERENCE</text>
        </svg>
        <div class="tsv2-aircraft"><img src="assets/class-20-a320-left.svg" alt="A320 side profile used to illustrate tailstrike geometry"><span class="tsv2-tail-dot" aria-hidden="true"></span></div>
        <div class="tsv2-mlg" aria-hidden="true"></div>
        <div class="tsv2-state" id="tsv2State">MLG compression lowers the fuselage relative to the runway, reducing the pitch attitude available before tail contact.<span class="tsv2-tag">GEOMETRY ≠ CERTIFIED FLIGHT LIMITATION</span></div>
        <div class="tsv2-read" id="tsv2Read">11.7° · MLG compressed</div>
      </div>
    </div>
  </div>`;

  const stage=document.getElementById('tsv2Stage');
  const read=document.getElementById('tsv2Read');
  const state=document.getElementById('tsv2State');
  const pitch=document.getElementById('tsv2Pitch');
  const arc=document.getElementById('tsv2Arc');
  const buttons=[...section.querySelectorAll('[data-ts-state]')];

  function geometry(angle){
    const cx=675,cy=262,rLine=155,rArc=100,a=angle*Math.PI/180;
    const x2=cx-rLine*Math.cos(a),y2=cy-rLine*Math.sin(a);
    pitch.setAttribute('x2',x2.toFixed(1));pitch.setAttribute('y2',y2.toFixed(1));
    const sx=cx-rArc,sy=cy,ex=cx-rArc*Math.cos(a),ey=cy-rArc*Math.sin(a);
    arc.setAttribute('d',`M ${sx} ${sy} A ${rArc} ${rArc} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`);
  }

  function setState(next){
    const extended=next==='extended';
    stage.dataset.state=next;
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.tsState===next));
    read.textContent=extended?'13.5° · MLG extended':'11.7° · MLG compressed';
    state.innerHTML=(extended?'With the strut extended, the fuselage sits higher relative to the runway, so more pitch attitude is geometrically available before tail contact.':'MLG compression lowers the fuselage relative to the runway, reducing the pitch attitude available before tail contact.')+'<span class="tsv2-tag">GEOMETRY ≠ CERTIFIED FLIGHT LIMITATION</span>';
    geometry(extended?13.5:11.7);
  }
  buttons.forEach(b=>b.addEventListener('click',()=>setState(b.dataset.tsState)));
  setState('compressed');
})();