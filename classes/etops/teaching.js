/* Essentials and worked examples. Basis: supplied ETOPS PDF/PPTX;
   retains the separately documented technical qualifications of edition 1.
   New teaching examples are fictitious, not dispatch guidance. */
window.ETOPS_TEACHING = [
{
 title:'¿Qué es ETOPS?', eyebrow:'OPERACIONES DE RANGO EXTENDIDO',
 definition:'ETOPS son operaciones en las que una parte de la ruta se aleja de un aeródromo adecuado más allá de un tiempo umbral. Para realizarlas se necesita una aprobación específica.',
 meaning:'FAA: Extended Operations. En español, operaciones extendidas. El material EASA utiliza Extended Range Operations for Two-Engine Aeroplanes.',
 why:'La idea es poder llegar a un lugar donde aterrizar con seguridad si aparece una falla, aunque ese lugar no esté cerca.',
 ideas:[['clock','Se mide en tiempo','En el ejemplo bimotor FAA, el umbral es 60 minutos. No son 60 minutos de duración total del vuelo.'],['plane','OEI = un motor inoperativo','Se usa una velocidad de crucero aprobada para esa condición, en atmósfera estándar y sin viento. El vuelo normal sigue siendo con ambos motores.'],['shield','La aprobación debe demostrarse','Importan el avión, la organización del operador, mantenimiento, despacho y preparación de la tripulación. No basta con tener combustible.']],
 example:{title:'Un vuelo de 6 horas puede no requerir ETOPS por alejamiento.',context:'Dos rutas ficticias, ambas para un bimotor bajo el ejemplo FAA. Comparamos el tiempo al aeródromo adecuado más cercano, no la duración del viaje.',rows:[['Ruta A','6 h de vuelo','Ningún punto a más de 45 min','No rebasa el umbral de 60 min.'],['Ruta B','2 h de vuelo','Un punto a 90 min','Rebasa el umbral: necesita aprobación ETOPS aplicable.']],steps:['Mira cuánto tardarías en llegar a un aeródromo adecuado, no cuánto dura tu vuelo.','Compara ese tiempo con el umbral: 45 < 60; 90 > 60.','Una aprobación ETOPS permite superar el umbral bajo condiciones. No autoriza cualquier ruta.'],answer:'ETOPS trata del alejamiento respecto de opciones de aterrizaje, no de la duración total del vuelo.'},
 task:'Mueve el tiempo de 45 a 90 minutos. Observa cuándo el avión queda fuera del círculo de 60 minutos y explica qué requisito aparece.',
 source:'PDF 0.1–0.4 · presentación 3–5. Precisión de alcance: FAA 14 CFR 1.1 y 121.161. Ejemplos de rutas añadidos para enseñanza.',
 terms:[['Aeródromo adecuado','Aeropuerto con las características, instalaciones y servicios necesarios para que ese avión pueda aterrizar.'],['Umbral','Tiempo de referencia a partir del cual se aplica el marco correspondiente. No es el máximo autorizado.'],['EDTO','Extended Diversion Time Operations: término OACI para operaciones con tiempo de desviación extendido. El marco aplicable determina sus requisitos.']]
},
{
 title:'Umbral y máximo autorizado',eyebrow:'DOS CIFRAS QUE RESPONDEN PREGUNTAS DISTINTAS',
 definition:'El tiempo umbral indica cuándo una operación entra en el marco ETOPS/EDTO. El tiempo máximo autorizado indica hasta dónde puede alejarse esa operación conforme a su aprobación.',
 meaning:'Threshold time = tiempo umbral. Maximum diversion time = tiempo máximo de desviación.',
 why:'Confundirlos lleva a creer que un avión con capacidad de 180 minutos permite a cualquier operador usar esos 180 minutos.',
 ideas:[['clock','Umbral','Lo fija el Estado. Para el supuesto bimotor FAA de esta clase: 60 minutos.'],['shield','Máximo autorizado','Depende de la aprobación aplicable al operador y de la capacidad de la combinación avión–motor.'],['tool','MEL = lista de equipo mínimo','Un equipo inoperativo puede impedir ETOPS o reducir el alcance de ese vuelo.']],
 example:{title:'180 de diseño no significa 180 para este vuelo.',context:'Supuesto ordinario de enseñanza, sin las disposiciones especiales de otras aprobaciones.',rows:[['Diseño','180 min','Capacidad técnica del caso'],['Operador','120 min','Alcance autorizado del caso'],['MEL','90 min','Restricción del vuelo de hoy']],steps:['Parte de la autorización operacional: 120 min.','Aplica la restricción del caso: la MEL reduce el máximo a 90 min.','Comprueba los demás requisitos; tomar el mínimo no aprueba una ruta real.'],answer:'El techo de este ejemplo es 90 min. El umbral de 60 min no cambió.'},
 task:'Cambia la autorización y después la restricción MEL. Distingue qué cifra permanece como umbral y cuál limita el caso.',source:'PDF 0.7 y 0.13 · presentación 9 y 16. Se conserva la precisión de la edición técnica sobre aprobaciones especiales.',terms:[]
},
{
 title:'Cómo se convierten minutos en millas',eyebrow:'PRIMERO LA REFERENCIA; DESPUÉS EL VIENTO',
 definition:'El tiempo aprobado y una velocidad de referencia permiten calcular una distancia. Esa distancia se representa con círculos alrededor de aeródromos.',
 meaning:'TAS = velocidad respecto al aire. kt = millas náuticas por hora. NM = millas náuticas. OEI = un motor inoperativo.',
 why:'Un círculo muestra alcance de referencia. El viento cambia los tiempos reales, pero no amplía la autorización.',
 ideas:[['clock','Convierte minutos a horas','Divide entre 60 antes de multiplicar por una velocidad expresada en kt.'],['map','Radio de referencia','Distancia = TAS OEI × minutos / 60, en atmósfera estándar y aire en calma.'],['fork','ETP = punto de tiempo igual','Desde ese punto tardarías lo mismo hacia dos alternos para un escenario determinado. No es automáticamente el punto crítico de combustible.']],
 example:{title:'400 kt durante 120 minutos = 800 NM.',context:'La velocidad de 400 kt es un supuesto del material, no una tabla de performance.',rows:[['Tiempo','120 min ÷ 60','2 horas'],['Distancia','400 NM/h × 2 h','800 NM'],['Sin viento','ETP entre dos opciones','Mitad de la línea si las velocidades son iguales']],steps:['Convierte 120 minutos en 2 horas.','Multiplica 400 kt por 2 horas: radio 800 NM.','Después, para el ETP, compara tiempos usando velocidades respecto al suelo hacia cada opción.'],answer:'Distancia de referencia y tiempo real de desvío no son la misma cosa.'},
 task:'Compara 60, 120 y 180 min. Luego modifica el viento: fíjate en el punto ETP, no en la autorización.',source:'PDF 0.6 y 0.8 · presentación 8 y 10. Se mantiene la corrección documentada: ETP no equivale siempre a punto crítico.',terms:[]
},
{
 title:'Qué convierte a un aeropuerto en alterno',eyebrow:'CAPACIDAD + DISPONIBILIDAD + CONDICIONES',
 definition:'Para seleccionar un alterno ETOPS no basta con que exista una pista. Debe ser adecuado para el avión y cumplir las condiciones exigidas durante el período en que podría utilizarse.',
 meaning:'Adequate = adecuado. Suitable = apto para las condiciones aplicables. EEP = punto de entrada al segmento ETOPS.',
 why:'Un buen pronóstico no sirve si el campo estará cerrado cuando podrías llegar.',
 ideas:[['map','Adecuación','Pista, performance, ayudas y servicios deben ser apropiados para el avión.'],['cloud','Meteorología y ventana','Se comprueban los mínimos aplicables durante el intervalo de uso, no solo en un instante.'],['clock','La fase importa','En el ejemplo FAA se distingue el filtro de despacho de la revisión operacional antes del EEP.']],
 example:{title:'Una pista abierta todavía puede no pasar el filtro.',context:'Supuestos didácticos: altura base 600 ft sobre el campo y visibilidad 1 SM. Para despacho el ejercicio proporciona +400 ft y +1 SM.',rows:[['Despacho','600 + 400 = 1.000 ft','Visibilidad requerida: 2 SM'],['Pronóstico del caso','900 ft y 2 SM','El techo queda por debajo del filtro'],['Campo cerrado','Cualquier techo','La disponibilidad no se cumple']],steps:['Identifica la fase y el criterio suministrado.','Compara techo y visibilidad con ese criterio.','Comprueba que el aeródromo estará disponible durante la ventana.'],answer:'Cumplir un solo filtro no convierte automáticamente al aeropuerto en un alterno válido.'},
 task:'Cambia techo, fase y disponibilidad. Los resultados solo evalúan los filtros visibles del ejemplo.',source:'PDF 0.8–0.9 · presentación 10–12. Se conserva la distinción FAA 121.624 / 121.631 revisada en la primera edición.',terms:[['SM','Milla terrestre usada en la visibilidad del ejemplo; no confundir con NM.']]
},
{
 title:'Qué es el combustible crítico',eyebrow:'COMPARAR, NO ADIVINAR',
 definition:'Es el combustible necesario para llegar a un alterno bajo los escenarios de falla exigidos, calculados desde el punto más crítico. Se toma el requisito mayor.',
 meaning:'Se comparan falla de motor, despresurización y ambas simultáneas. Despresurización significa pérdida de la presión adecuada de la cabina.',
 why:'El descenso, los motores disponibles y las condiciones cambian el consumo. El nombre de la falla no indica por sí solo qué escenario exige más.',
 ideas:[['plane','Motor inoperativo','Se calcula el desvío con la performance correspondiente a un motor.'],['cloud','Despresurización','Puede exigir descender a una altitud segura compatible con el oxígeno; cambia el consumo.'],['fuel','Cantidades comparables','Incluye los componentes y ajustes aplicables. Todos los resultados deben referirse al mismo punto.']],
 example:{title:'El combinado no gana por definición.',context:'Cantidades ficticias ya completas desde el mismo punto. No son flujos reales de un avión.',rows:[['Motor inoperativo','5.400 kg','Requisito A'],['Despresurización','6.600 kg','El mayor'],['Ambas','6.000 kg','Requisito C']],steps:['Asegúrate de que comparas cantidades con la misma referencia.','Busca el mayor: 6.600 kg.','Compara con lo disponible en ese punto. Con 6.200 kg faltarían 400 kg en este caso.'],answer:'En este ejemplo manda despresurización. En otro conjunto de datos puede mandar otro escenario.'},
 task:'Alterna entre Caso A y Caso B. Explica qué barra determina el requisito y por qué.',source:'PDF 0.10 · presentación 13 · quiz 10–12. Se conserva la corrección: comparar los tres escenarios sin elegir automáticamente el combinado.',terms:[]
},
{
 title:'Sistemas que sostienen una desviación',eyebrow:'NO ES SOLO TENER UN MOTOR FUNCIONANDO',
 definition:'ETOPS exige considerar si las capacidades técnicas que quedan disponibles permiten sostener una desviación prolongada. Algunos sistemas también tienen una duración limitada.',
 meaning:'Sistema significativo: su falla puede afectar la seguridad del desvío. Sistema limitado por tiempo: tiene una capacidad temporal que condiciona la planificación.',
 why:'Contar fuentes de energía no demuestra que estén disponibles ni que cubran la condición que se está planificando.',
 ideas:[['bolt','Redundancia','Fuentes independientes permiten conservar capacidades cuando falla una de ellas.'],['fire','Duración certificada','La protección contra incendio, por ejemplo, puede imponer una limitación temporal.'],['tool','Mantenimiento','Verificación previa, configuración, MEL y tareas de mantenimiento respaldan lo que el plan supone.']],
 example:{title:'195 − 15 = 180 no es una aprobación de vuelo.',context:'Ejemplo FAA hasta 180 min: sistema más limitante 195 min; margen aplicable 15 min; operador autorizado a 120 min.',rows:[['Sistema','195 − 15','Techo por sistema: 180 min'],['Operador','120 min','Menor que 180'],['Conclusión','120 min en este supuesto','Aún deben cumplirse los demás requisitos']],steps:['Calcula el techo por sistema dentro del supuesto.','Compáralo con la autorización del operador.','No uses el resultado como tiempo que puede esperarse ante una emergencia real.'],answer:'Capacidad de sistema y autorización operacional son controles diferentes.'},
 task:'Toca cada sistema. Relaciona su función con lo que hace falta durante una desviación.',source:'PDF 0.11–0.12 · presentación 14–15. Ejemplo acotado a FAA 121.633(a), no regla universal.',terms:[['PDSC','Chequeo de servicio previo a la salida ETOPS.'],['MEL','Lista de equipo mínimo del operador; contiene condiciones y limitaciones con equipo inoperativo.']]
},
{
 title:'Qué revisar antes del EEP',eyebrow:'LA PLANIFICACIÓN DEBE SEGUIR SIENDO VÁLIDA',
 definition:'El EEP es el punto de entrada a un segmento más allá del umbral aplicable. Antes de continuar, se revisa si los cambios del vuelo afectan las opciones y capacidades planificadas.',
 meaning:'EEP = ETOPS Entry Point. EXP = punto de salida del segmento. ETP = punto de tiempo igual: es otro concepto.',
 why:'Una demora, un cierre de pista, un sistema inoperativo o un cambio de combustible pueden alterar la decisión.',
 ideas:[['cloud','Alternos','Disponibilidad, condiciones meteorológicas y período de uso.'],['shield','Avión y combustible','Capacidades actuales y remanente frente a lo que requiere el análisis.'],['check','Coordinación','Revisar las novedades con despacho y tripulación, conforme al procedimiento aplicable.']],
 example:{title:'Bravo cierra antes de tu posible llegada.',context:'Caso ficticio: sin Bravo queda un tramo fuera de la cobertura autorizada y no hay otra opción validada.',rows:[['Antes','Bravo disponible','Cobertura demostrada'],['Novedad','NOTAM de cierre','La opción deja de estar disponible'],['Ahora','Alternativa aún no validada','Hay que reevaluar antes de comprometer el segmento']],steps:['Describe el cambio: el campo no estará disponible.','Identifica el efecto: se pierde una opción necesaria para la cobertura.','Coordina una alternativa o ruta válida; el diseño ETOPS del avión no reabre la pista.'],answer:'El chequeo confirma condiciones; no es una frase que se recita para poder seguir.'},
 task:'Recorre las cuatro comprobaciones. Explica qué información estás confirmando en cada una.',source:'PDF 0.9 y 0.14 · presentación 11 y 17. Se mantienen las precisiones de la primera edición.',terms:[['NOTAM','Aviso de información aeronáutica que puede afectar disponibilidad o condiciones de operación.']]
},
{
 title:'Cómo comparar dos opciones de desvío',eyebrow:'TIEMPO Y POSIBILIDAD DE ATERRIZAR',
 definition:'En el bimotor del ejemplo FAA con un motor inoperativo, se busca el aeródromo adecuado más cercano en tiempo donde pueda efectuarse un aterrizaje seguro.',
 meaning:'GS = groundspeed, velocidad respecto al suelo. El viento puede hacer que una opción con más millas se alcance antes.',
 why:'Elegir solamente por distancia ignora la velocidad efectiva y la aptitud del aeródromo.',
 ideas:[['clock','Calcula tiempos comparables','Tiempo en minutos = distancia en NM / GS en kt × 60.'],['cloud','Comprueba aptitud','Una pista cerrada o no utilizable no mejora por tener un tiempo corto.'],['fork','Considera la situación','El vuelo real añade descenso, aproximación, performance y procedimientos; aquí se aísla el concepto.']],
 example:{title:'600 NM pueden tomar menos tiempo que 420 NM.',context:'Supuesto de crucero constante con ambas opciones inicialmente utilizables.',rows:[['Bravo','600 NM / 400 kt','90 min'],['Charlie','420 NM / 240 kt','105 min'],['Comparación','Bravo tiene más millas','Pero se alcanza 15 min antes en el modelo']],steps:['600/400×60 = 90 min.','420/240×60 = 105 min.','Entre opciones utilizables del caso, Bravo tiene el menor tiempo. Si cierra, cambia la selección.'],answer:'No gana la menor distancia: compara tiempo y posibilidad de aterrizar con seguridad.'},
 task:'Cierra Bravo en el ejercicio. Explica por qué cambia la opción aunque las distancias sean iguales.',source:'PDF 0.14 · presentación 17 · quiz 19. Caso bimotor FAA; tiempos ficticios de crucero.',terms:[]
},
{
 title:'Integrar una decisión ETOPS',eyebrow:'DEL CAMBIO AL REQUISITO',
 definition:'Decidir en estos ejercicios consiste en identificar qué cambió, qué requisito afecta y qué opción sigue siendo válida. No basta con recordar una cifra ETOPS.',
 meaning:'La misión reúne autorización, disponibilidad de alternos, combustible y tiempos. No presupone un tipo de avión.',
 why:'Las pantallas de una operación deben contar una historia coherente: una condición nueva puede invalidar una decisión anterior.',
 ideas:[['map','Observa','Lee los datos del caso y detecta la novedad.'],['shield','Relaciona','Identifica qué condición o requisito deja de cumplirse.'],['fork','Justifica','Elige una respuesta y explica qué evidencia la sostiene.']],
 example:{title:'La condición cambia; tu razonamiento debe cambiar.',context:'Ejemplo separado de la misión, no una recomendación para un vuelo real.',rows:[['Dato','Diseño 180 min','Capacidad del avión del caso'],['Restricción','Operador 120 min','Límite de la autorización'],['Propuesta','Punto a 150 min','No cabe en el supuesto autorizado']],steps:['No uses 180 solo porque aparece en la ficha del avión.','Compara 150 con la autorización 120.','Replantea el caso; la capacidad técnica no sustituye una autorización operacional.'],answer:'Una cifra sin contexto no demuestra que la operación sea válida.'},
 task:'Resuelve las tres novedades de la misión. Cada respuesta tiene una explicación.',source:'Síntesis de los materiales recibidos y de las correcciones documentadas. Casos didácticos añadidos.',terms:[]
},
{
 title:'Comprobar lo que aprendiste',eyebrow:'EVALUACIÓN FORMATIVA, NO CERTIFICACIÓN',
 definition:'Las 20 preguntas permiten identificar conceptos que necesitas repasar. El resultado de este banco de práctica no acredita una habilitación ni una aprobación ETOPS.',
 meaning:'Aprender: retroalimentación después de responder. Comprobar: revisión completa al finalizar.',
 why:'Un error sirve para volver a un concepto y entenderlo, no solo para cambiar una nota.',
 ideas:[['book','Una pregunta por vez','El banco está organizado de lo conceptual a lo aplicado y permite barajar.'],['check','Referencia formativa','16/20, equivalente a 80 %, es la sugerencia del material recibido; no un requisito regulatorio.'],['map','Repaso dirigido','Las respuestas remiten a los módulos que conviene volver a estudiar.']],
 example:{title:'Una nota no explica el error; la retroalimentación sí.',context:'Ejemplo de razonamiento que ya trabajaste en la clase.',rows:[['Respuesta inicial','ETOPS 120 = vuelo de 120 min','Confunde alejamiento y duración'],['Idea para repasar','Tiempo a un aeródromo','No tiempo total del viaje'],['Nueva explicación','Ruta con puntos hasta el alcance autorizado','Sujeta a las condiciones de la aprobación']],steps:['Lee la explicación, no solo si acertaste.','Vuelve al concepto asociado.','Haz un nuevo intento cuando puedas explicarlo con tus palabras.'],answer:'El objetivo es comprender el motivo de la respuesta.'},
 task:'Elige Aprender o Comprobar. Tus respuestas se guardan solo en este navegador.',source:'etops-quiz.pdf: formato sugerido y referencia formativa 16/20. Se conserva el banco revisado de la primera edición.',terms:[]
}
];
