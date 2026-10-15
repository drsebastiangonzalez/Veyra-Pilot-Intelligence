(() => {
  'use strict';

  const installHomePolish = () => {
    if (!document.getElementById('veyra-home-polish')) {
      const style = document.createElement('style');
      style.id = 'veyra-home-polish';
      style.textContent = `
        .premiumTopbar.veyraUnifiedNav .mobileNavMenu{display:none!important}
        .veyraMenuToggle:focus-visible,.premiumNav button:focus-visible{outline:2px solid #f0d58e;outline-offset:4px}
        .veyraMenuToggle{display:none;width:48px;height:44px;padding:0;border:1px solid rgba(200,164,93,.48);border-radius:0;background:rgba(255,255,255,.025);align-items:center;justify-content:center;flex-direction:column;gap:5px;cursor:pointer}
        .veyraMenuToggle span{display:block;width:20px;height:1px;background:#f4ead6;transition:transform .2s ease,opacity .2s ease}
        .premiumTopbar.veyraNavOpen .veyraMenuToggle span:nth-child(1){transform:translateY(6px) rotate(45deg)}
        .premiumTopbar.veyraNavOpen .veyraMenuToggle span:nth-child(2){opacity:0}
        .premiumTopbar.veyraNavOpen .veyraMenuToggle span:nth-child(3){transform:translateY(-6px) rotate(-45deg)}
        .homeFaqContact{margin-top:36px!important}
        #training .launchTrainingCard{position:relative}
        #training .launchTrainingCard .trainingLaunchBadge{position:absolute;z-index:5;top:18px;right:18px;background:#d6ad55;color:#07111f;border-radius:999px;padding:7px 12px;font-size:10px;font-weight:900;letter-spacing:.13em;line-height:1.4;box-shadow:0 2px 9px #00000012;pointer-events:none}
        @media(max-width:1180px){
          .premiumTopbar{position:sticky!important;top:0!important;display:flex!important;flex-direction:row!important;align-items:center!important;justify-content:space-between!important;padding:14px 18px!important;min-height:82px!important;overflow:visible!important}
          .premiumTopbar.veyraNavOpen{transform:translate3d(0,0,0)!important}
          .premiumBrand{min-width:0!important}
          .premiumTopbar .brand{font-size:34px!important}
          .premiumTopbar .brand:after{width:56px!important;margin-top:6px!important}
          .premiumTopbar .subtitle{font-size:10px!important;letter-spacing:.20em!important;margin-top:6px!important}
          .veyraMenuToggle{display:flex!important;flex:0 0 auto;margin-left:auto}
          .premiumNav{display:none!important;position:absolute!important;top:100%!important;left:0!important;right:0!important;z-index:1000!important;background:#05070b!important;border-top:1px solid rgba(200,164,93,.18)!important;border-bottom:1px solid rgba(200,164,93,.36)!important;box-shadow:0 24px 50px rgba(0,0,0,.34)!important;padding:10px 18px calc(18px + env(safe-area-inset-bottom,0px))!important;flex-direction:column!important;flex-wrap:nowrap!important;align-items:stretch!important;gap:0!important;margin:0!important;width:100%!important;max-height:calc(100vh - 90px);max-height:var(--veyra-nav-max-height,calc(100dvh - 90px));overflow-y:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}
          .premiumTopbar.veyraNavOpen .premiumNav{display:flex!important}
          .premiumNav .navTabletOptional{display:block!important}
          .premiumNav .ghost{flex:0 0 auto!important;min-height:44px!important;width:100%!important;text-align:left!important;border:0!important;border-bottom:1px solid rgba(255,255,255,.08)!important;border-radius:0!important;background:transparent!important;padding:13px 4px!important;font-size:12px!important;letter-spacing:.11em!important}
          .premiumNav .internalBtn{margin-top:10px!important;border:1px solid rgba(200,164,93,.62)!important;padding:13px 14px!important;color:#d8ad58!important}
        }
        @media(min-width:1181px){.veyraMenuToggle{display:none!important}}
        @media(max-width:560px){
          .premiumTopbar{padding:12px 14px!important;min-height:74px!important}
          .premiumTopbar .brand{font-size:31px!important}
          .premiumTopbar .subtitle{font-size:9px!important}
          .veyraMenuToggle{width:44px;height:44px}
          .homeFaqContact{margin-top:28px!important}
        }
      `;
      document.head.appendChild(style);
    }

    // Presentation only: keep the original A320 course link and every other card intact.
    document.querySelectorAll('#training .trainingCard').forEach(card => {
      const title = card.querySelector('h3');
      if (!title || !/^A320\s/.test(title.textContent.trim()) || card.querySelector('.trainingLaunchBadge')) return;
      card.classList.add('launchTrainingCard');
      const badge = document.createElement('span');
      badge.className = 'trainingLaunchBadge';
      badge.textContent = 'LANZAMIENTO';
      card.appendChild(badge);
    });

    const header = document.querySelector('.premiumTopbar');
    const nav = header && header.querySelector('.premiumNav');
    if (header && nav && !header.querySelector('.veyraMenuToggle')) {
      const mobile = window.matchMedia('(max-width:1180px)');
      const legacyMenu = header.querySelector('.mobileNavMenu');
      const toggle = document.createElement('button');
      if (!nav.id) nav.id = 'veyra-primary-navigation';
      toggle.type = 'button';
      toggle.className = 'veyraMenuToggle';
      toggle.setAttribute('aria-label', 'Abrir menú');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', nav.id);
      toggle.innerHTML = '<span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>';
      header.insertBefore(toggle, nav);

      // One controller and one set of routes. Keep native <details> only as a
      // fallback when this enhancement has not loaded, never as a second menu.
      const syncPanelHeight = () => {
        const viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
        header.style.setProperty('--veyra-nav-max-height', Math.max(0, Math.floor(viewportHeight - header.offsetHeight - 8)) + 'px');
      };
      const setOpen = (open, restoreFocus = false) => {
        const expanded = Boolean(open) && mobile.matches;
        if (legacyMenu) legacyMenu.removeAttribute('open');
        header.classList.toggle('veyraNavOpen', expanded);
        if (expanded || restoreFocus) header.classList.remove('mobileNavHidden');
        toggle.setAttribute('aria-expanded', String(expanded));
        toggle.setAttribute('aria-label', expanded ? 'Cerrar menú' : 'Abrir menú');
        if (expanded) syncPanelHeight();
        if (restoreFocus) toggle.focus({preventScroll:true});
      };

      toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        setOpen(!header.classList.contains('veyraNavOpen'));
      });
      nav.addEventListener('click', (event) => {
        if (event.target.closest('button,a')) setOpen(false);
      });
      header.addEventListener('click', (event) => {
        if (event.target.closest('.premiumBrand')) setOpen(false);
      });
      document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) setOpen(false);
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && header.classList.contains('veyraNavOpen')) {
          event.preventDefault();
          setOpen(false, true);
        }
      });
      document.addEventListener('focusin', (event) => {
        if (!header.contains(event.target)) setOpen(false);
      });
      window.addEventListener('resize', () => {
        if (!mobile.matches) setOpen(false);
        syncPanelHeight();
      }, {passive:true});
      if (window.visualViewport) window.visualViewport.addEventListener('resize', syncPanelHeight, {passive:true});
      window.addEventListener('pageshow', () => setOpen(false));
      if (typeof ResizeObserver === 'function') new ResizeObserver(syncPanelHeight).observe(header);

      setOpen(false);
      syncPanelHeight();
      if (legacyMenu) legacyMenu.hidden = true;
      header.classList.add('veyraUnifiedNav');
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
