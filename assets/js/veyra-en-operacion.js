(() => {
  'use strict';
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
  frame.src = 'assets/veyra-en-operacion.html?v=5';
  frame.loading = 'lazy';
  frame.setAttribute('scrolling', 'no');
  frame.style.display = 'block';
  frame.style.width = '100%';
  frame.style.border = '0';
  frame.style.background = '#07111f';
  frame.style.minHeight = '1750px';

  frame.addEventListener('load', () => {
    try {
      const body = frame.contentDocument && frame.contentDocument.body;
      if (body) frame.style.height = Math.max(900, body.scrollHeight) + 'px';
    } catch (_) {}
  });

  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(frame, anchor);
  else story.appendChild(frame);

  const resize = () => {
    try {
      const body = frame.contentDocument && frame.contentDocument.body;
      if (body) frame.style.height = Math.max(900, body.scrollHeight) + 'px';
    } catch (_) {}
  };
  window.addEventListener('resize', resize, {passive:true});
})();
