VEYRA IFR PATH — MÓDULO 03
Fuentes del CDI en G1000: VOR, GPS y LOC

ARCHIVO PRINCIPAL
index.html

RECURSOS
assets/g1000-cdi-vor.jpg
assets/g1000-cdi-gps.jpg
assets/g1000-cdi-loc.jpg

INSTALACIÓN
1. Aloje la carpeta completa en el mismo directorio del servidor.
2. Abra index.html directamente o insértelo mediante iframe.
3. No se requieren librerías externas ni conexión a internet.

IFRAME SUGERIDO
<iframe
  src="/ruta/VEYRA_IFR_CDI_Modulo_03/index.html"
  title="VEYRA IFR PATH - Módulo 03"
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
veyra-ifr-cdi-module-03

EVALUACIÓN
8 preguntas.
Aprobación: 80 %.
Persistencia local: localStorage.

NOTA TÉCNICA
La simbología exacta puede variar según aeronave, software e instalación.
El AFMS, POH y documentación aprobada aplicable prevalecen.
