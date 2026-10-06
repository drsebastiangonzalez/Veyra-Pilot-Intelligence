# Low Visibility Operations (LVO) · Veyra Classes

Fuente recibida el 06/10/2026:
- `baja-visibilidad.html` — clase interactiva de Operaciones de baja visibilidad.

## Estructura preservada
- Recorrido visual e interactivo.
- 31 pasos.
- 6 bloques de contenido + bienvenida/resultado.
- 6 escenas interactivas.
- 13 comprobaciones.
- Glosario final.
- Progreso local con `localStorage` (`veyra-lvo2`).

## Revisión técnica antes de publicar
Se mantuvo la arquitectura y la misión Bogotá → Rionegro como escenario de entrenamiento, pero se corrigieron afirmaciones que podían interpretarse como reglas universales.

1. **Definiciones CAT I / II / III**
   - EASA Rev. 24: CAT I = DH >= 200 ft y VIS >= 800 m o RVR >= 550 m.
   - CAT II = DH < 200 ft pero >= 100 ft y RVR >= 300 m.
   - CAT III = DH < 100 ft o sin DH, con RVR < 300 m o sin limitación de RVR.
   - Los mínimos operacionales reales pueden ser superiores y dependen de procedimiento, pista, aeronave, tripulación y aprobación.

2. **RVR y approach ban**
   - Para continuación de aproximación EASA, TDZ RVR es controlante; si no se reporta, puede usarse MID.
   - MID/STOP-END adicionales son informativos salvo límites propios del operador.
   - El approach ban se aplica a la continuación más allá de 1.000 ft sobre elevación del aeródromo (o FAS cuando corresponda). Un deterioro reportado después de ese punto no obliga automáticamente a discontinuar; siguen aplicando las referencias visuales requeridas en DA/H.

3. **CMV**
   - Puede sustituir RVR en casos permitidos.
   - No se usa para mínimos de despegue ni para continuación de una aproximación LVO.
   - Para planificación EASA usa factor 1,0; fuera de planificación los factores dependen de iluminación y día/noche.

4. **LVP**
   - No se publica un único umbral de activación universal.
   - Cada aeródromo define criterios de preparación/inicio/terminación basados en RVR y techo, coordinados con ATS y aprobados por la autoridad.
   - EASA requiere LVP donde se pretendan LVTO, aproximaciones/aterrizajes con RVR < 550 m o DH < 200 ft, u operaciones con créditos con RVR < 550 m.

5. **LVTO**
   - LVTO = despegue con RVR < 550 m.
   - En EASA, RVR < 400 m requiere aprobación específica.
   - AMC: 150 m requiere marcas de eje, luces de fin, borde y eje; 125 m añade límites de espaciamiento (borde <= 60 m, eje <= 15 m).
   - Por debajo de 125 m se necesita un sistema certificado para la operación; no se enseña HUD = 75 m como regla universal.

6. **CAT III / Airbus**
   - Valores 175 m / 50 ft y 75 m / no-DH se conservan únicamente como matriz de ejercicio.
   - Etiquetas CAT 3 DUAL/SINGLE, Alert Height y AUTOLAND se presentan como ejemplos Airbus; la operación real se rige por AFM/FCOM/QRH/MEL/OM y la aprobación del operador.
   - En CAT III con DH, las referencias visuales requeridas se ajustaron a la guía EASA vigente (segmentos de luces según el sistema), no a la antigua simplificación de “una luz de eje” para todo fail-passive.

## Referencias de revisión
- EASA Easy Access Rules for Air Operations, Revision 24, March 2026.
  https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-air-operations
- EASA Easy Access Rules for Aerodromes, Revision March 2026.
  https://www.easa.europa.eu/en/document-library/easy-access-rules/easy-access-rules-aerodromes
- EASA SPA.LVO / CAT.OP.MPA material referenced in the online rules.

## Alcance
Material formativo. La misión y cifras de aeródromos son datos de entrenamiento. No sustituye AIP/NOTAM, AFM/FCOM/QRH, MEL, SOP/OM, aprobación SPA.LVO ni criterios de la autoridad competente.
