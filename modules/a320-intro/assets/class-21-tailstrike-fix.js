(()=>{
  const eye=[...document.querySelectorAll('.eyebrow')].find(x=>x.textContent.includes('05 · TAILSTRIKE GEOMETRY'));
  const section=eye?.closest('section');
  if(!section)return;

  const style=document.createElement('style');
  style.id='class21-tailstrike-v3-style';
  style.textContent=`
  .tsv3-lab{display:grid;grid-template-columns:.78fr 1.22fr;gap:18px}
  .tsv3-controls{display:grid;gap:10px;align-content:start}
  .tsv3-stage{border:1px solid rgba(255,255,255,.1);border-radius:24px;overflow:hidden;background:#06101a}
  .tsv3-canvas{position:relative;min-height:370px;background:linear-gradient(#06101a 0 69.5%,#12171d 69.5%)}
  .tsv3-canvas:after{content:"";position:absolute;left:0;right:0;top:69.5%;bottom:0;background:linear-gradient(180deg,rgba(255,255,255,.015),rgba(0,0,0,.16));pointer-events:none}
  .tsv3-metric{position:absolute;left:22px;top:18px;z-index:5;color:#8f9cad;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase}
  .tsv3-geometry{position:absolute;inset:0;width:100%;height:100%;z-index:2;pointer-events:none}
  .tsv3-runway{stroke:#7b8590;stroke-width:2}.tsv3-reference{stroke:rgba(215,177,90,.45);stroke-width:2}.tsv3-pitch{stroke:#d7b15a;stroke-width:2.3}.tsv3-arc{fill:none;stroke:#d7b15a;stroke-width:2;opacity:.82}.tsv3-pivot{fill:#d7b15a;stroke:#f0d38d;stroke-width:1}.tsv3-label{fill:#8f9cad;font:12px Inter,-apple-system,sans-serif;letter-spacing:.08em}.tsv3-label.gold{fill:#f0d38d}
  .tsv3-airframe{transition:transform .38s ease}.tsv3-bodyGroup{transition:transform .38s ease}.tsv3-body{fill:url(#tsv3BodyGrad);stroke:#9aa6b8;stroke-width:2}.tsv3-panel{fill:#142131;stroke:#607086;stroke-width:1.2}.tsv3-window{fill:#74b9d0;opacity:.48}.tsv3-wing,.tsv3-tail{fill:url(#tsv3WingGrad);stroke:#73839a;stroke-width:1.4}.tsv3-engine{fill:#142130;stroke:#7d8ba0;stroke-width:1.5}.tsv3-engineInlet{fill:#05090e;stroke:#9ba6b6;stroke-width:1.1}.tsv3-gear{stroke:#8b97a6;stroke-width:3}.tsv3-wheel{fill:#05080c;stroke:#939eaa;stroke-width:1.5}.tsv3-tailContact{fill:#e45c5c;stroke:#ff8b8b;stroke-width:1.2;filter:drop-shadow(0 0 5px rgba(228,92,92,.55))}
  .tsv3-caption{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:16px 18px;border-top:1px solid rgba(255,255,255,.08);background:rgba(3,7,12,.88)}
  .tsv3-state{max-width:66%;color:#a8b5c6;font-size:.92rem;line-height:1.45}
  .tsv3-tag{display:block;margin-top:8px;color:#f0d38d;font-size:.73rem;letter-spacing:.09em;text-transform:uppercase}
  .tsv3-read{flex:0 0 auto;color:#f0d38d;font:700 1.12rem Georgia,serif;background:rgba(215,177,90,.06);padding:9px 13px;border-radius:999px;border:1px solid rgba(215,177,90,.28);white-space:nowrap}
  @media(max-width:900px){.tsv3-lab{grid-template-columns:1fr}.tsv3-canvas{min-height:350px}}
  @media(max-width:650px){.tsv3-canvas{min-height:320px}.tsv3-metric{left:14px;top:14px;font-size:.58rem}.tsv3-caption{display:grid;grid-template-columns:1fr;padding:14px}.tsv3-state{max-width:none;font-size:.84rem}.tsv3-read{justify-self:start;font-size:.95rem}.tsv3-label{font-size:10px}}
  `;
  document.head.appendChild(style);

  section.innerHTML=`<div class="wrap">
    <div class="head"><div><div class="eyebrow">05 · TAILSTRIKE GEOMETRY</div><h2>Tail clearance changes with MLG compression.</h2></div><p class="lead">El ángulo de contacto es geometría. Cambia porque la relación entre fuselaje, tren principal y pavimento cambia.</p></div>
    <div class="tsv3-lab">
      <div class="tsv3-controls">
        <button class="gearBtn active" data-ts-state="compressed">MLG COMPRESSED · 11.7°</button>
        <button class="gearBtn" data-ts-state="extended">MLG EXTENDED · 13.5°</button>
        <div class="notice"><strong>A320 reference:</strong> 11.7° y 13.5° son referencias geométricas de pitch attitude para contacto de cola en el A320; no son una aircraft limitation equivalente a VMO/MMO.</div>
      </div>
      <div class="tsv3-stage" id="tsv3Stage" data-state="compressed">
        <div class="tsv3-canvas">
          <div class="tsv3-metric">RUNWAY · MLG REFERENCE · FUSELAGE ATTITUDE · TAIL CONTACT</div>
          <svg class="tsv3-geometry" viewBox="0 0 1000 370" preserveAspectRatio="none" role="img" aria-label="A320 tailstrike geometry diagram">
            <defs>
              <linearGradient id="tsv3BodyGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#253548"/><stop offset="100%" stop-color="#0f1823"/></linearGradient>
              <linearGradient id="tsv3WingGrad" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#233245"/><stop offset="100%" stop-color="#101824"/></linearGradient>
            </defs>
            <line class="tsv3-runway" x1="35" y1="300" x2="965" y2="300"/>
            <line class="tsv3-reference" x1="660" y1="300" x2="478" y2="300"/>
            <line class="tsv3-pitch" id="tsv3Pitch" x1="660" y1="300" x2="494" y2="265"/>
            <path class="tsv3-arc" id="tsv3Arc" d="M 590 300 A 70 70 0 0 0 591 286"/>
            <circle class="tsv3-pivot" cx="660" cy="300" r="5"/>
            <text class="tsv3-label" x="45" y="320">RUNWAY</text>
            <text class="tsv3-label gold" x="673" y="320">MLG REFERENCE / PIVOT</text>
            <g class="tsv3-airframe" id="tsv3Airframe" transform="rotate(11.7 660 300)">
              <g class="tsv3-bodyGroup" id="tsv3BodyGroup">
                <path class="tsv3-body" d="M125 225 C142 211 170 202 222 197 L660 185 C744 182 826 184 890 194 C924 199 947 207 957 217 C965 226 957 235 937 241 C904 250 840 255 760 257 L225 260 C175 260 143 253 127 242 C116 235 115 231 125 225 Z"/>
                <path class="tsv3-panel" d="M159 213 L201 199 L231 202 L225 224 L179 226 Z"/>
                <rect class="tsv3-window" x="258" y="207" width="16" height="7" rx="3"/><rect class="tsv3-window" x="285" y="206" width="16" height="7" rx="3"/><rect class="tsv3-window" x="312" y="205" width="16" height="7" rx="3"/><rect class="tsv3-window" x="339" y="204" width="16" height="7" rx="3"/><rect class="tsv3-window" x="366" y="203" width="16" height="7" rx="3"/><rect class="tsv3-window" x="393" y="202" width="16" height="7" rx="3"/><rect class="tsv3-window" x="420" y="201" width="16" height="7" rx="3"/><rect class="tsv3-window" x="447" y="200" width="16" height="7" rx="3"/><rect class="tsv3-window" x="474" y="199" width="16" height="7" rx="3"/><rect class="tsv3-window" x="501" y="198" width="16" height="7" rx="3"/><rect class="tsv3-window" x="528" y="197" width="16" height="7" rx="3"/><rect class="tsv3-window" x="555" y="196" width="16" height="7" rx="3"/><rect class="tsv3-window" x="582" y="195" width="16" height="7" rx="3"/>
                <path class="tsv3-wing" d="M485 242 L690 225 L596 284 L468 282 Z"/>
                <ellipse class="tsv3-engine" cx="544" cy="270" rx="49" ry="25"/><ellipse class="tsv3-engineInlet" cx="506" cy="268" rx="8" ry="18"/>
                <path class="tsv3-tail" d="M825 192 L859 127 L895 128 L908 215 L859 237 Z"/>
                <path class="tsv3-tail" d="M810 228 L939 214 L958 226 L835 245 Z"/>
                <line class="tsv3-gear" id="tsv3MainGear" x1="660" y1="244" x2="660" y2="300"/>
                <ellipse class="tsv3-wheel" cx="660" cy="301" rx="14" ry="6"/>
                <line class="tsv3-gear" x1="273" y1="251" x2="273" y2="286"/>
                <ellipse class="tsv3-wheel" cx="273" cy="287" rx="10" ry="5"/>
                <circle class="tsv3-tailContact" cx="888" cy="253" r="6"/>
              </g>
            </g>
          </svg>
        </div>
        <div class="tsv3-caption">
          <div class="tsv3-state" id="tsv3State">MLG compression lowers the fuselage relative to the runway, reducing the pitch attitude available before tail contact.<span class="tsv3-tag">GEOMETRY ≠ CERTIFIED FLIGHT LIMITATION</span></div>
          <div class="tsv3-read" id="tsv3Read">11.7° · MLG compressed</div>
        </div>
      </div>
    </div>
  </div>`;

  const stage=document.getElementById('tsv3Stage');
  const read=document.getElementById('tsv3Read');
  const state=document.getElementById('tsv3State');
  const pitch=document.getElementById('tsv3Pitch');
  const arc=document.getElementById('tsv3Arc');
  const airframe=document.getElementById('tsv3Airframe');
  const bodyGroup=document.getElementById('tsv3BodyGroup');
  const mainGear=document.getElementById('tsv3MainGear');
  const buttons=[...section.querySelectorAll('[data-ts-state]')];

  function geometry(angle){
    const cx=660,cy=300,rLine=168,rArc=70,a=angle*Math.PI/180;
    const x2=cx-rLine*Math.cos(a),y2=cy-rLine*Math.sin(a);
    pitch.setAttribute('x2',x2.toFixed(1));pitch.setAttribute('y2',y2.toFixed(1));
    const sx=cx-rArc,sy=cy,ex=cx-rArc*Math.cos(a),ey=cy-rArc*Math.sin(a);
    arc.setAttribute('d',`M ${sx} ${sy} A ${rArc} ${rArc} 0 0 0 ${ex.toFixed(1)} ${ey.toFixed(1)}`);
  }

  function setState(next){
    const extended=next==='extended';
    const angle=extended?13.5:11.7;
    stage.dataset.state=next;
    buttons.forEach(b=>b.classList.toggle('active',b.dataset.tsState===next));
    airframe.setAttribute('transform',`rotate(${angle} 660 300)`);
    bodyGroup.setAttribute('transform',extended?'translate(0 -8)':'translate(0 0)');
    mainGear.setAttribute('y1',extended?'236':'244');
    read.textContent=extended?'13.5° · MLG extended':'11.7° · MLG compressed';
    state.innerHTML=(extended?'With the strut extended, the fuselage sits higher relative to the runway, so more pitch attitude is geometrically available before tail contact.':'MLG compression lowers the fuselage relative to the runway, reducing the pitch attitude available before tail contact.')+'<span class="tsv3-tag">GEOMETRY ≠ CERTIFIED FLIGHT LIMITATION</span>';
    geometry(angle);
  }

  buttons.forEach(b=>b.addEventListener('click',()=>setState(b.dataset.tsState)));
  setState('compressed');
})();