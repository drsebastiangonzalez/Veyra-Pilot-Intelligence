VEYRA IFR PATH — MÓDULO 06
Arcos DME: entrada, mantenimiento y salida

INSTALACIÓN
1. Conserve index.html y la carpeta assets en el mismo directorio.
2. Publique toda la carpeta en el hosting de VEYRA.
3. Abra index.html directamente o dentro de un iframe.

EJEMPLO
<iframe
  src="/training/VEYRA_IFR_DME_Modulo_06/index.html"
  title="VEYRA IFR Módulo 06"
  style="width:100%;height:100vh;border:0"
  allow="fullscreen"
></iframe>

EVENTOS POSTMESSAGE
- veyra:ready
- veyra:progress
- veyra:complete
- veyra:exit

IDENTIFICADOR
VEYRA_IFR_DME_06

NOTAS
- El módulo funciona sin librerías externas.
- El progreso se conserva en localStorage.
- La aprobación requiere 80 % y las preguntas críticas correctas.
- Los rangos numéricos de los laboratorios de entrada/salida son escenarios didácticos, no reglas universales.
- Deben prevalecer la carta vigente, el SOP, el POH/AFM y el suplemento de aviónica de la aeronave.
