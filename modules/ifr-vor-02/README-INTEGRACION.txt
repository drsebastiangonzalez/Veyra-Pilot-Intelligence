VEYRA IFR PATH — Módulo 02
Interceptación y seguimiento de radiales

ARCHIVOS
- index.html
- assets/g1000-vor1-intercept.jpg

PUBLICACIÓN
1. Alojar la carpeta completa preservando la subcarpeta assets.
2. Abrir index.html directamente o incluirlo en un iframe.

EJEMPLO DE IFRAME
<iframe
  src="/training/VEYRA_IFR_VOR_Modulo_02/index.html"
  title="Interceptación y seguimiento de radiales"
  style="width:100%;min-height:900px;border:0"
  allow="fullscreen"
></iframe>

EVENTOS POSTMESSAGE
- veyra:ready
- veyra:progress
- veyra:complete
- veyra:exit

EJEMPLO DE RECEPTOR
window.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || data.source !== 'veyra-module') return;

  if (data.type === 'veyra:progress') {
    // Guardar data.moduleId, data.progress, data.currentStep y data.totalSteps en Supabase.
  }

  if (data.type === 'veyra:complete') {
    // Guardar data.score, data.passed, data.timeSeconds y data.attemptedAt.
  }
});

NOTAS
- El módulo no usa librerías externas.
- El avance también se conserva en localStorage.
- Aprobación configurada en 80 %.
- La fotografía G1000 fue suministrada por Veyra.
