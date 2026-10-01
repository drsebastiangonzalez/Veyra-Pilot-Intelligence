# CRM y TEM · Veyra Classes

Fuente recibida el 30/09/2026:
- `crm-tem.html` — clase interactiva original.

## Estructura preservada
- Modelo pedagógico ver → aplicar → comprobar.
- 7 bloques de recorrido, 4 instrumentos y 12 comprobaciones.
- Misión transversal basada en los escenarios ya usados en las clases anteriores.
- Progreso local con `localStorage` (`veyra-crm`).

## Revisión técnica antes de publicar
La arquitectura y la mayor parte del contenido se conservan. Se hicieron ajustes puntuales para evitar convertir herramientas de CRM u operator-specific SOPs en reglas universales:

1. **Casos históricos**
   - United 173: se corrige la frase que sugería que la tripulación no advirtió sobre combustible. El NTSB documenta que hubo advisories de la tripulación, pero el comandante no monitorizó/respondió adecuadamente y los otros tripulantes no lograron comunicar la criticidad con suficiente eficacia.
   - Avianca 052: se evita decir simplemente que “nunca declaró emergencia”; el informe NTSB muestra que el comandante pidió comunicar emergencia después de la aproximación frustrada, pero la transmisión a ATC siguió expresándose como “running out of fuel”.

2. **CRM vigente**
   - EASA ORO.FC.115 integra CRM en formación inicial/operador, conversión, recurrente y curso de mando e incluye TEM, automatización, monitoreo/intervención, resiliencia, sorpresa/sobresalto y diferencias culturales.
   - FAA AC 120-51E continúa vigente como guía de CRM.
   - En Colombia, la referencia operacional es el RAC vigente y el programa/Manual de Operaciones aprobado del operador.

3. **Competencias**
   - Se mantiene el marco de nueve dominios usado por Veyra/CBTA-EBT.
   - KNO se presenta como Application of Knowledge; Doc 9868 describe la aplicación del conocimiento como elemento que sustenta las competencias del piloto.
   - Se eliminan mínimos CAT III/A320 concretos del ejemplo para no convertir valores de una configuración en una regla genérica.

4. **PACE, two-challenge rule, NITS y FORDEC**
   - Se mantienen como herramientas didácticas.
   - Se aclara que no son una fraseología universal de EASA/OACI y que su uso/toma de control depende del OM/SOP del operador.

5. **Sorpresa y sobresalto**
   - Se elimina una receta universal de pitch/power o inputs de mando.
   - La enseñanza queda en estabilizar la trayectoria, evitar acciones impulsivas, verbalizar el estado y aplicar el procedimiento específico de la aeronave.

6. **Just Culture y reportes**
   - Se alinea el concepto con Regulation (EU) 376/2014: acciones acordes con experiencia y entrenamiento reciben protección, mientras negligencia grave, violaciones deliberadas y actos destructivos no.
   - Se eliminan afirmaciones universales de “ASR obligatorio ante cualquier evento” y “reporte de fatiga sin consecuencias”; cada autoridad/operador define canales y protecciones.

7. **Escenarios**
   - Se retiraron valores como `Vapp +15`, autobrake específico y mínimos CAT III concretos cuando no estaban sustentados por un SOP/aircraft-specific source.
   - Los escenarios siguen siendo formativos y no sustituyen procedimientos de aeronave u operador.

## Referencias externas usadas para la revisión
- ICAO Doc 9868 — PANS-TRG / pilot competencies and Application of Knowledge.
- ICAO CBTA/EBT workshop material showing the nine pilot competency domains.
- EASA Easy Access Rules for Air Operations, Revision 24, March 2026 — ORO.FC.115 and AMC/GM.
- FAA AC 120-51E — Crew Resource Management Training (active).
- NTSB AAR-79-07 — United 173.
- NTSB AAR-91-04 — Avianca 052.
- EASA Easy Access Rules for Occurrence Reporting — Just Culture.
- Aerocivil official RAC page; RAC 121 listed with last amendment 09-MAY-2025.

## Alcance
Material formativo. No sustituye OM/SOP, FCOM/QRH, programa CRM/EBT aprobado, ni procedimientos del operador. Los ejemplos de intervención, automatización, windshear, mínimos y toma de control deben adaptarse a la aeronave y al operador.
