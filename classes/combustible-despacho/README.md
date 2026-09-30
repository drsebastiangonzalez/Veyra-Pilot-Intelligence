# Planificación de combustible y despacho · Veyra Classes

Fuente recibida el 30/09/2026:
- `index(2).html` — clase interactiva.
- `README(1).pdf` — arquitectura pedagógica.
- `modulo-combustible-despacho.pdf` — módulo de referencia.
- `combustible-quiz.pdf` — banco de 20 preguntas.

## Estructura preservada
- Modelo ver → aplicar → comprobar.
- 7 bloques académicos + bienvenida/resultado.
- 26 pasos, 4 instrumentos y 11 comprobaciones integradas.
- Misión Cali → Bogotá, continuidad del módulo de Meteorología.
- Progreso local con `localStorage` (`veyra-fuel`).
- Evaluación adicional de 20 preguntas en `evaluacion.html`.

## Revisión técnica antes de publicar
La arquitectura y la mayor parte del contenido se conservan. Se hicieron correcciones explícitas donde el material recibido podía quedar desactualizado frente a referencias vigentes:

1. **EASA planning minima** — la clase original usaba la antigua escalera CAT II/III → CAT I → NPA. La revisión 24 de las Easy Access Rules (marzo 2026), AMC6 CAT.OP.MPA.182, usa en el esquema básico:
   - Type B: DA/H + 200 ft y RVR/VIS + 800 m.
   - Type A: DA/H o MDA/H + 400 ft y RVR/VIS + 1.500 m.
   - Circling: MDA/H + 400 ft y VIS + 1.500 m.
   Los esquemas con variaciones tienen tablas propias (AMC8/AMC9).

2. **Sin alterno de destino** — se identifica como una posibilidad del esquema básico con variaciones, no una regla general del esquema básico. Se conserva el mínimo de 15 minutos de holding a 1.500 ft para el componente cuando no se requiere alterno, además de la FRF.

3. **Final reserve / MINIMUM FUEL / MAYDAY FUEL** — se evita enseñar la FRF como una “capa físicamente intocable”. La protección es operacional: MINIMUM FUEL cuando un cambio a la autorización puede llevar por debajo de FRF; MAYDAY MAYDAY MAYDAY FUEL cuando el combustible utilizable previsto al aterrizar en el aeródromo seguro más cercano será menor que la FRF planificada.

4. **Compromiso al destino** — se presenta como una decisión/procedimiento sujeto al esquema y al Manual de Operaciones, no como una autorización universal basada únicamente en dos pistas y buen tiempo.

5. **FAA** — se mantienen 14 CFR 121.639, 121.645 y 121.647 como referencias de comparación. No se afirma equivalencia literal con RAC 121; para Colombia manda el RAC vigente y el Manual de Operaciones aprobado.

6. **Eficiencia** — el costo de transportar combustible (3–4 % por hora en los ejercicios) y los valores A320 son heurísticas de aula, no performance certificada.

## Referencias externas usadas para la revisión
- EASA Easy Access Rules for Air Operations, Revision 24, March 2026: CAT.OP.MPA.180/181/182/185 y AMC/GM asociados.
- ICAO Annex 6, Part I: fuel planning and in-flight fuel management / MINIMUM FUEL / MAYDAY FUEL.
- 14 CFR Part 121: §§ 121.639, 121.645 y 121.647.
- Aerocivil: página oficial de RAC; RAC 121 figura con última enmienda publicada 09-MAY-2025.

## Alcance
Material formativo. Los consumos, pesos, METAR/TAF, alternos, “bingo” y resultados son datos didácticos. No sustituye OFP, AFM/FCOM, MEL, Manual de Operaciones, OpSpecs ni normativa vigente del operador/Estado.
