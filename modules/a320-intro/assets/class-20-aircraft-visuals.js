(async()=>{
  const css=`
  .airTop{height:min(88%,540px)!important;width:auto!important;max-width:92%!important;filter:drop-shadow(0 18px 30px rgba(0,0,0,.42))}
  .airTop path{pointer-events:none}
  .aspectStage{min-height:360px!important;background:radial-gradient(ellipse at 50% 46%,rgba(98,168,255,.055),transparent 55%),#020507!important}
  .aspectPlane{display:none!important}
  .aspectAircraftViews{position:absolute;inset:20px 26px 52px;display:grid;place-items:center}
  .aspectAsset{display:none;position:relative;width:100%;height:100%;place-items:center}
  .aspectAsset.active{display:grid}
  .aspectAsset svg{display:block;width:min(94%,760px);max-height:245px;height:auto;overflow:visible;filter:drop-shadow(0 16px 22px rgba(0,0,0,.48))}
  .aspectAsset[data-view="aft"] svg{width:min(76%,560px);max-height:250px}
  .aspectGlow{position:absolute;width:18px;height:18px;border-radius:50%;box-shadow:0 0 18px currentColor,0 0 36px currentColor;z-index:4}
  .aspectAsset[data-view="left"] .aspectGlow{color:#ff4f5d;background:currentColor;left:31%;top:54%}
  .aspectAsset[data-view="right"] .aspectGlow{color:#66e08a;background:currentColor;right:31%;top:54%}
  .aspectAsset[data-view="aft"] .aspectGlow{color:#fff;background:currentColor;left:50%;top:36%;transform:translateX(-50%)}
  @media(max-width:760px){.airTop{height:min(82%,450px)!important}.aspectAircraftViews{inset:16px 12px 56px}.aspectAsset svg{width:98%;max-height:210px}}
  `;
  const style=document.createElement('style');style.textContent=css;document.head.appendChild(style);

  const load=async url=>{const r=await fetch(url,{cache:'force-cache'});if(!r.ok)throw new Error(url+' '+r.status);return r.text()};
  try{
    const [top,left,right,aft]=await Promise.all([
      load('assets/class-20-a320-top.svg?v=2'),
      load('assets/class-20-a320-left.svg?v=2'),
      load('assets/class-20-a320-right.svg?v=2'),
      load('assets/class-20-a320-aft.svg?v=2')
    ]);
    const oldTop=document.querySelector('svg.airTop');
    if(oldTop){oldTop.outerHTML=top;}

    const stage=document.querySelector('.aspectStage');
    if(stage){
      const old=stage.querySelector('.aspectPlane');if(old)old.remove();
      const host=document.createElement('div');host.className='aspectAircraftViews';
      host.innerHTML=`
        <div class="aspectAsset active" data-view="left">${left}<span class="aspectGlow"></span></div>
        <div class="aspectAsset" data-view="right">${right}<span class="aspectGlow"></span></div>
        <div class="aspectAsset" data-view="aft">${aft}<span class="aspectGlow"></span></div>`;
      stage.insertBefore(host,stage.querySelector('.aspectText'));
      document.querySelectorAll('.aspectBtn').forEach(b=>b.addEventListener('click',()=>{
        host.querySelectorAll('.aspectAsset').forEach(x=>x.classList.toggle('active',x.dataset.view===b.dataset.aspect));
      }));
    }
    if(typeof syncLighting==='function')syncLighting();
  }catch(err){console.error('Class 20 aircraft visual patch:',err)}
})();
