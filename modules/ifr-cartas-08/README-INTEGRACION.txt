
VEYRA IFR PATH — MÓDULO 08
Lectura de cartas IFR

ARCHIVOS
- index.html
- assets/ (cartas reales usadas en el módulo)
- README-INTEGRACION.txt

OBJETIVO DEL AJUSTE
Esta versión corrige tres puntos clave:
1. El módulo ahora sí utiliza cartas reales Jeppesen dentro del contenido.
2. La explicación de Jeppesen se enfoca en que es un estándar global de lectura y briefing.
3. Se reemplazó la nota previa por una nota académica adecuada para el estudiante final.

INSTALACIÓN
1. Publique la carpeta completa en el hosting de VEYRA.
2. Abra index.html directamente o dentro de un iframe.

EJEMPLO
<iframe
  src="/training/VEYRA_IFR_Cartas_Modulo_08/index.html"
  title="VEYRA IFR Módulo 08"
  style="width:100%;height:100vh;border:0"
  allow="fullscreen"
></iframe>

EVENTOS POSTMESSAGE
- veyra:ready
- veyra:progress
- veyra:complete
- veyra:exit

IDENTIFICADOR
VEYRA_IFR_CHART_08

CONTENIDO
- Por qué se aconseja usar Jeppesen
- Verificación inicial de la carta
- Airport diagram con casos reales
- SID y STAR con casos reales
- Aproximaciones ILS/LOC, VOR, RNAV/GPS, LPV y RNP AR
- Mínimos y categorías
- Método de briefing
- Práctica y evaluación

NOTAS
- Diseñado como material académico interno.
- Guardado de progreso en localStorage.
- Aprobación: 80 % y preguntas críticas correctas.
