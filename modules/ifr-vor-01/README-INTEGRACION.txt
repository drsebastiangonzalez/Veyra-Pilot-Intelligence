VEYRA IFR PATH — Módulo 01: El lenguaje del VOR
Versión: 1.0.0
Formato: HTML responsive independiente, sin dependencias externas.

ARCHIVOS
- index.html
- assets/g1000-vor1-green.jpg
- assets/g1000-gps-magenta.jpg

CARGA EN VEYRA
1. Copiar la carpeta completa al hosting/CDN de VEYRA.
2. Abrir index.html directamente o cargarlo dentro de un iframe.
3. Mantener la carpeta assets al mismo nivel relativo que index.html.

IFRAME RECOMENDADO
<iframe
  src="/ruta/VEYRA_IFR_VOR_Modulo_01/index.html"
  title="VEYRA IFR Path — El lenguaje del VOR"
  style="width:100%;min-height:900px;border:0;border-radius:16px"
  allow="fullscreen"
></iframe>

EVENTOS PARA INTEGRACIÓN CON SUPABASE
El módulo emite eventos mediante window.parent.postMessage(payload, '*'):
- veyra:ready
- veyra:progress
- veyra:complete
- veyra:exit

Ejemplo de escucha en la página padre:
window.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || data.source !== 'veyra-module') return;

  if (data.type === 'veyra:complete') {
    // Guardar en Supabase: moduleId, score, passed, timeSeconds, attemptedAt.
    console.log('Resultado del módulo', data);
  }
});

PERSISTENCIA LOCAL
El módulo guarda el paso, puntuación y finalización en localStorage del navegador.
Claves principales:
- veyra-ifr-vor-01:step
- veyra-ifr-vor-01:score
- veyra-ifr-vor-01:complete

DERECHOS
- El contenido, diagramas SVG, preguntas e interacción fueron creados de forma original para VEYRA.
- No se incluyen preguntas copiadas de ASA Prepware ni cartas Jeppesen.
- Las imágenes G1000 fueron suministradas por VEYRA para uso educativo. Verificar autorización antes de publicación pública.
- Garmin y G1000 son marcas de sus respectivos titulares.

REFERENCIAS OFICIALES
- FAA ACS: https://www.faa.gov/training_testing/testing/acs/instrument_rating_airplane_acs_8.pdf
- FAA Handbooks: https://www.faa.gov/regulations_policies/handbooks_manuals/aviation
- FAA Instrument Procedures Handbook: https://www.faa.gov/sites/faa.gov/files/regulations_policies/handbooks_manuals/aviation/instrument_procedures_handbook/FAA-H-8083-16B.pdf
- EASA Easy Access Rules for Aircrew: https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-aircrew-regulation-eu-no-11782011
- Garmin G1000 manuals: https://www.garmin.com/en-US/aviation/
