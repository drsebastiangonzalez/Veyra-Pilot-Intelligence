VEYRA IFR PATH — MÓDULO 04
TO/FROM, reverse sensing y paso sobre la estación

ARCHIVO PRINCIPAL
index.html

RECURSOS
assets/g1000-cdi-vor.jpg
assets/g1000-cdi-loc.jpg

INSTALACIÓN
1. Aloje la carpeta completa conservando la carpeta assets.
2. Abra index.html directamente o insértelo mediante iframe.
3. No se requieren librerías externas ni conexión a internet.

IFRAME SUGERIDO
<iframe
  src="/ruta/VEYRA_IFR_VOR_Modulo_04/index.html"
  title="VEYRA IFR PATH - Módulo 04"
  style="width:100%;height:100vh;border:0;"
  allow="fullscreen"
></iframe>

EVENTOS POSTMESSAGE
veyra:ready
veyra:progress
veyra:complete
veyra:exit

EJEMPLO DE RECEPCIÓN
window.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || data.source !== 'veyra-module') return;
  console.log(data.type, data);
});

MÓDULO ID
veyra-ifr-vor-module-04

EVALUACIÓN
8 preguntas.
Aprobación: 80 %.
Las preguntas críticas de fuente y validez deben ser correctas.
Persistencia local: localStorage.

NOTA TÉCNICA
La simbología exacta y las funciones disponibles pueden variar según aeronave,
software e instalación. El AFMS, POH y documentación aprobada aplicable prevalecen.
Las capturas suministradas se utilizan como recurso de entrenamiento interno.
