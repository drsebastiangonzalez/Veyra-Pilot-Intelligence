(() => {
  'use strict';

  const installHomePolish = () => {
    if (!document.getElementById('veyra-home-polish')) {
      const style = document.createElement('style');
      style.id = 'veyra-home-polish';
      style.textContent = `
        .veyraMenuToggle{display:none;width:48px;height:44px;padding:0;border:1px solid rgba(200,164,93,.48);border-radius:0;background:rgba(255,255,255,.025);align-items:center;justify-content:center;flex-direction:column;gap:5px;cursor:pointer}
        .veyraMenuToggle span{display:block;width:20px;height:1px;background:#f4ead6;transition:transform .2s ease,opacity .2s ease}
        .premiumTopbar.veyraNavOpen .veyraMenuToggle span:nth-child(1){transform:translateY(6px) rotate(45deg)}
        .premiumTopbar.veyraNavOpen .veyraMenuToggle span:nth-child(2){opacity:0}
        .premiumTopbar.veyraNavOpen .veyraMenuToggle span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
        .homeFaqContact{margin-top:36px!important}
        @media(max-width:1180px){
          .premiumTopbar{position:sticky!important;top:0!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;padding:14px 18px!important;min-height:82px!important;overflow:visible!important}
          .premiumBrand{min-width:0!important}
          .premiumTopbar .brand{font-size:34px!important}
          .premiumTopbar .brand:after{width:56px!important;margin-top:6px!important}
          .premiumTopbar .subtitle{font-size:10px!important;letter-spacing:.20em!important;margin-top:6px!important}
          .veyraMenuToggle{display:flex!important;flex:0 0 auto}
          .premiumNav{display:none!important;position:absolute!important;top:100%!important;left:0!important;right:0!important;z-index:1000!important;background:rgba(5,7,11,.985)!important;border-top:1px solid rgba(200,164,93,.18)!important;border-bottom:1px solid rgba(200,164,93,.36)!important;box-shadow:0 24px 50px rgba(0,0,0,.34)!important;padding:10px 18px 18px!important;flex-direction:column!important;align-items:stretch!important;gap:0!important}
          .premiumTopbar.veyraNavOpen .premiumNav{display:flex!important}
          .premiumNav .ghost{width:100%!important;text-align:left!important;border:0!important;border-bottom:1px solid rgba(255,255,255,.08)!important;border-radius:0!important;background:transparent!important;padding:13px 4px!important;font-size:12px!important;letter-spacing:.11em!important}
          .premiumNav .internalBtn{margin-top:10px!important;border:1px solid rgba(200,164,93,.62)!important;padding:13px 14px!important;color:#d8ad58!important}
        }
        @media(min-width:1181px){.veyraMenuToggle{display:none!important}}
        @media(max-width:560px){
          .premiumTopbar{padding:12px 14px!important;min-height:74px!important}
          .premiumTopbar .brand{font-size:31px!important}
          .premiumTopbar .subtitle{font-size:9px!important}
          .veyraMenuToggle{width:44px;height:42px}
          .homeFaqContact{margin-top:28px!important}
        }
      `;
      document.head.appendChild(style);
    }

    const header = document.querySelector('.premiumTopbar');
    const nav = header && header.querySelector('.premiumNav');
    if (header && nav && !header.querySelector('.veyraMenuToggle')) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'veyraMenuToggle';
      toggle.setAttribute('aria-label', 'Abrir menú');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span></span><span></span><span></span>';
      header.insertBefore(toggle, nav);

      const setOpen = (open) => {
        header.classList.toggle('veyraNavOpen', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      };

      toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpen(!header.classList.contains('veyraNavOpen'));
      });
      nav.addEventListener('click', (event) => {
        if (event.target.closest('button,a')) setOpen(false);
      });
      document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setOpen(false);
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1180) setOpen(false);
      }, {passive:true});
    }
  };

  installHomePolish();
  if (document.getElementById('veyra-operation-frame')) return;

  // Final public-home sequence must be:
  // Veyra en operación → Solicitar demo → Preguntas frecuentes.
  const finalCta = document.querySelector('.homeFinalCta');
  const faq = document.querySelector('#homeFaq');
  if (finalCta && faq && finalCta.parentNode === faq.parentNode) {
    const parent = faq.parentNode;
    if (finalCta.nextElementSibling !== faq) parent.insertBefore(finalCta, faq);
  }

  const anchor = finalCta || document.querySelector('.homeEditorialBand') || document.querySelector('.homeClosing');
  const story = document.querySelector('.veyraHomeStory');
  if (!anchor && !story) return;

  const frame = document.createElement('iframe');
  frame.id = 'veyra-operation-frame';
  frame.title = 'Veyra en operación';
  frame.src = 'assets/veyra-en-operacion.html?v=6';
  frame.loading = 'lazy';
  frame.setAttribute('scrolling', 'no');
  frame.style.display = 'block';
  frame.style.width = '100%';
  frame.style.border = '0';
  frame.style.background = '#07111f';
  frame.style.minHeight = '900px';

  const syncFrame = () => {
    try {
      const doc = frame.contentDocument;
      const body = doc && doc.body;
      if (!doc || !body) return;
      if (!doc.getElementById('veyra-operation-compact')) {
        const compact = doc.createElement('style');
        compact.id = 'veyra-operation-compact';
        compact.textContent = `
          @media(max-width:1180px){
            body{padding:72px 24px 76px!important}
            .head{gap:28px!important;margin-bottom:36px!important}
            .grid{gap:18px!important}
            .card{min-height:390px!important}
            .copy{padding:28px 26px!important}
            .no{margin-bottom:30px!important}
            .link{margin-top:22px!important}
            .flow{margin-top:24px!important;padding-top:18px!important}
          }
          @media(max-width:900px){
            body{padding:54px 20px 58px!important}
            .head{margin-bottom:30px!important}
            .grid{gap:16px!important}
            .copy{padding:24px 22px!important}
            .no{margin-bottom:22px!important}
            .demo{padding:14px!important}
            .flow{margin-top:20px!important}
          }
        `;
        doc.head.appendChild(compact);
      }
      requestAnimationFrame(() => {
        frame.style.height = Math.max(900, body.scrollHeight) + 'px';
      });
    } catch (_) {}
  };

  frame.addEventListener('load', syncFrame);

  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(frame, anchor);
  else story.appendChild(frame);

  window.addEventListener('resize', syncFrame, {passive:true});
})();
