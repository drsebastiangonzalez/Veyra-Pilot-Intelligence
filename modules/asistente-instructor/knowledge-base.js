/*
 * Veyra · Asistente del instructor · Base académica v1
 *
 * Esta base no califica ni determina competencias por sí sola. Resume el MES
 * suministrado por el proyecto y contiene los comportamientos observables (OB)
 * enviados por el usuario. Toda asociación automática es solamente candidata
 * y requiere confirmación de un instructor autorizado.
 */

window.VEYRA_KB = (() => {
  const missions = [
    {
      id: "M01",
      program: "PPA",
      title: "Introducción al simulador",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Familiarización con el entorno del simulador y la cabina antes de iniciar la práctica de vuelo.",
      objectives: [
        "Reconocer las capacidades y limitaciones del simulador.",
        "Ubicar controles, instrumentos y elementos principales de cabina.",
        "Aplicar listas de verificación básicas de puesta en marcha y apagado."
      ],
      focus: ["KNO", "PRO", "COM"]
    },
    {
      id: "M02",
      program: "PPA",
      title: "Procedimientos iniciales",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Ejecución ordenada de los procedimientos de tierra y preparación de la aeronave.",
      objectives: [
        "Realizar la inspección y preparación previas al arranque.",
        "Gestionar los sistemas eléctricos, de combustible, motor, aviónica y comunicaciones.",
        "Ejecutar procedimientos normales y reconocer condiciones anormales en tierra."
      ],
      focus: ["KNO", "PRO", "COM", "WLM"]
    },
    {
      id: "M03",
      program: "PPA",
      title: "Rodaje y configuración de despegue",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Operación segura en tierra y preparación completa para el despegue.",
      objectives: [
        "Controlar la aeronave durante el rodaje y mantener conciencia del entorno.",
        "Aplicar comunicaciones, señales y autorizaciones pertinentes.",
        "Configurar la aeronave para el despegue e identificar criterios para interrumpirlo."
      ],
      focus: ["PRO", "COM", "SAW", "WLM"]
    },
    {
      id: "M04",
      program: "PPA",
      title: "Primeras maniobras en vuelo",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Desarrollo inicial del control manual mediante actitud, potencia y compensación.",
      objectives: [
        "Ejecutar un despegue estándar y establecer el ascenso.",
        "Realizar vuelo recto y nivelado, ascensos, descensos y virajes básicos en VMC.",
        "Coordinar actitud, potencia, velocidad y compensación con referencias visuales e instrumentos."
      ],
      focus: ["FPM", "PRO", "SAW", "WLM"]
    },
    {
      id: "M05",
      program: "PPA",
      title: "Procedimientos de emergencia básicos",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Reconocimiento y gestión inicial de fallas y emergencias básicas.",
      objectives: [
        "Identificar fallas simuladas de motor, aviónica u otros sistemas.",
        "Aplicar prioridades, listas y decisiones apropiadas ante la condición presentada.",
        "Gestionar retorno, aterrizaje de emergencia y factores humanos asociados."
      ],
      focus: ["PSD", "SAW", "WLM", "PRO", "COM"]
    },
    {
      id: "M06",
      program: "PPA",
      title: "Refuerzo pre-solo: control básico de la aeronave",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Consolidación del control básico y de la relación entre actitud, potencia, velocidad y compensación.",
      objectives: [
        "Reforzar inspección, preparación y conocimiento de sistemas.",
        "Mantener vuelo estable con diferentes configuraciones de potencia y flaps.",
        "Coordinar cabeceo, alabeo y guiñada mientras administra la carga de trabajo."
      ],
      focus: ["FPM", "PRO", "KNO", "WLM"]
    },
    {
      id: "M07",
      program: "PPA",
      title: "Refuerzo de maniobras básicas: clima adverso",
      phase: "Postvuelo",
      duration: "2 horas",
      synthesis: "Control de la aeronave y toma de decisiones con turbulencia y referencias externas reducidas.",
      objectives: [
        "Mantener el control durante turbulencia moderada simulada.",
        "Realizar maniobras básicas con referencias visuales externas limitadas.",
        "Gestionar carga de trabajo, amenazas meteorológicas y decisiones operacionales."
      ],
      focus: ["FPM", "SAW", "WLM", "PSD"]
    },
    {
      id: "M08",
      program: "PPA",
      title: "Refuerzo de cruceros básicos: navegación y corrección",
      phase: "En vuelo",
      duration: "2 horas",
      synthesis: "Navegación visual y radioeléctrica básica con detección y corrección de desviaciones.",
      objectives: [
        "Aplicar navegación visual y ayudas radioeléctricas básicas.",
        "Detectar y corregir desviaciones de rumbo y altitud.",
        "Considerar viento y condiciones meteorológicas durante la navegación."
      ],
      focus: ["FPM", "SAW", "PSD", "WLM"]
    },
    {
      id: "M09",
      program: "PCA",
      title: "Operaciones avanzadas y maniobras de alta precisión",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Maniobras de precisión y recuperación de actitudes inusuales con mayor exigencia operacional.",
      objectives: [
        "Ejecutar virajes pronunciados manteniendo parámetros definidos.",
        "Recuperar actitudes inusuales de manera segura y ordenada.",
        "Gestionar precisión, energía y carga de trabajo en espacio aéreo exigente."
      ],
      focus: ["FPM", "SAW", "WLM", "PSD"]
    },
    {
      id: "M10",
      program: "PCA",
      title: "Aproximaciones avanzadas y aterrizajes complejos",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Aproximaciones estabilizadas y aterrizajes bajo condiciones operacionales complejas.",
      objectives: [
        "Mantener criterios de aproximación estabilizada en condiciones adversas.",
        "Gestionar viento cruzado, control lateral y configuración de aterrizaje.",
        "Ejecutar una aproximación frustrada cuando no se cumplen los criterios."
      ],
      focus: ["FPM", "PRO", "SAW", "PSD", "WLM"]
    },
    {
      id: "M11",
      program: "Instrumentos",
      title: "Introducción al vuelo por instrumentos",
      phase: "Prevuelo",
      duration: "2 horas",
      synthesis: "Fundamentos del control de la aeronave por instrumentos y transición entre referencias visuales e instrumentales.",
      objectives: [
        "Interpretar los instrumentos primarios y mantener control sin referencias visuales.",
        "Realizar virajes cronometrados, nivelaciones y cambios de velocidad.",
        "Gestionar transiciones VFR/IFR y patrones instrumentales básicos."
      ],
      focus: ["KNO", "FPM", "PRO", "SAW"]
    },
    {
      id: "M12",
      program: "Instrumentos",
      title: "Virajes, ascensos y descensos IFR",
      phase: "En vuelo",
      duration: "2 horas",
      synthesis: "Control instrumental de trayectoria vertical y lateral en condiciones IMC simuladas.",
      objectives: [
        "Ejecutar virajes estándar por instrumentos.",
        "Realizar ascensos y descensos mediante actitud y potencia con cambios de velocidad.",
        "Mantener precisión y carga de trabajo en espacio aéreo controlado."
      ],
      focus: ["FPM", "PRO", "SAW", "WLM"]
    },
    {
      id: "M13",
      program: "Instrumentos",
      title: "Interceptación y seguimiento de radiales",
      phase: "En vuelo",
      duration: "2 horas",
      synthesis: "Uso del VOR para interceptar y mantener radiales aplicando correcciones por viento.",
      objectives: [
        "Configurar e interpretar correctamente la información VOR.",
        "Interceptar y seguir radiales con corrección por viento.",
        "Detectar desviaciones y aplicar correcciones oportunas."
      ],
      focus: ["KNO", "FPM", "SAW", "PSD", "PRO"]
    },
    {
      id: "M14",
      program: "Instrumentos",
      title: "Procedimientos de espera y entradas",
      phase: "En vuelo",
      duration: "2 horas",
      synthesis: "Planificación y ejecución de esperas, entradas y arcos DME.",
      objectives: [
        "Seleccionar y ejecutar la entrada apropiada al patrón de espera.",
        "Corregir tiempo y deriva durante la espera.",
        "Ejecutar arcos DME y mantener coordinación con el tránsito IFR."
      ],
      focus: ["KNO", "PRO", "FPM", "SAW", "WLM"]
    },
    {
      id: "M15",
      program: "Instrumentos",
      title: "Aproximaciones instrumentales básicas",
      phase: "En vuelo",
      duration: "2 horas",
      synthesis: "Ejecución de aproximaciones VOR e ILS y aplicación de criterios de estabilización.",
      objectives: [
        "Interceptar y seguir localizador, senda o guía lateral según corresponda.",
        "Mantener configuración, velocidad y trayectoria de aproximación estabilizada.",
        "Ejecutar la aproximación frustrada o escape cuando sea requerido."
      ],
      focus: ["FPM", "PRO", "SAW", "PSD", "WLM"]
    },
    {
      id: "M16",
      program: "Instrumentos",
      title: "Emergencias en vuelo IFR",
      phase: "En vuelo",
      duration: "2 horas",
      synthesis: "Gestión de fallas instrumentales y de navegación en IMC simuladas.",
      objectives: [
        "Reconocer y gestionar la falla de instrumentos primarios.",
        "Gestionar pérdida de ayudas de navegación y condiciones anormales en IMC.",
        "Priorizar control, navegación, comunicación y decisiones bajo carga de trabajo."
      ],
      focus: ["PSD", "SAW", "WLM", "PRO", "COM", "FPM"]
    },
    {
      id: "M17",
      program: "Instrumentos",
      title: "Procedimientos de espera y entradas: consolidación",
      phase: "Postvuelo",
      duration: "2 horas",
      synthesis: "Consolidación de esperas, entradas, tiempo, deriva y coordinación IFR.",
      objectives: [
        "Planificar y ejecutar patrones de espera de mayor complejidad.",
        "Aplicar correcciones de tiempo y viento de manera consistente.",
        "Mantener conciencia situacional y coordinación operacional."
      ],
      focus: ["KNO", "PRO", "FPM", "SAW", "WLM"]
    },
    {
      id: "M18",
      program: "Instrumentos",
      title: "Aproximaciones instrumentales avanzadas bajo concepto PBN",
      phase: "Postvuelo",
      duration: "2 horas",
      synthesis: "Uso de navegación GNSS y especificaciones PBN en procedimientos instrumentales.",
      objectives: [
        "Configurar y verificar la navegación GNSS para el procedimiento.",
        "Interceptar y mantener trayectorias y esperas definidas por waypoints.",
        "Ejecutar aproximaciones RNP aplicando los mínimos y limitaciones correspondientes."
      ],
      focus: ["KNO", "PRO", "FPA", "FPM", "SAW", "PSD"]
    },
    {
      id: "M19",
      program: "Instrumentos",
      title: "Procedimientos de salida y llegada IFR",
      phase: "Postvuelo",
      duration: "2 horas",
      synthesis: "Planificación y ejecución de SID y STAR con gestión del perfil y coordinación ATC.",
      objectives: [
        "Interpretar y preparar procedimientos SID y STAR.",
        "Gestionar restricciones, perfil vertical y energía de la aeronave.",
        "Mantener comunicación, automatización y conciencia situacional."
      ],
      focus: ["PRO", "COM", "FPA", "SAW", "WLM"]
    },
    {
      id: "M20",
      program: "Instrumentos",
      title: "Simulación de vuelo completo IFR",
      phase: "Postvuelo",
      duration: "2 horas",
      synthesis: "Integración de un vuelo IFR completo con amenazas, desviaciones y condiciones anormales.",
      objectives: [
        "Planificar y ejecutar todas las fases de un vuelo IFR.",
        "Gestionar meteorología, desviaciones, fallas o pérdida de ayudas de navegación.",
        "Integrar control, procedimientos, comunicación, decisiones y carga de trabajo."
      ],
      focus: ["KNO", "PRO", "COM", "FPA", "FPM", "LTW", "PSD", "SAW", "WLM"]
    },
    {
      id: "M21",
      program: "Instrumentos",
      title: "Evaluación final en simulador",
      phase: "Postvuelo",
      duration: "2 horas",
      synthesis: "Demostración integrada de las competencias requeridas durante una operación IFR completa.",
      objectives: [
        "Ejecutar de manera integrada las fases y transiciones del vuelo IFR.",
        "Gestionar maniobras, esperas, aproximaciones y condiciones anormales.",
        "Demostrar decisiones, conciencia situacional y gestión de la carga de trabajo."
      ],
      focus: ["KNO", "PRO", "COM", "FPA", "FPM", "LTW", "PSD", "SAW", "WLM"]
    }
  ];

  const competencyNames = {
    KNO: "Aplicación de conocimientos",
    PRO: "Aplicación de procedimientos y cumplimiento",
    COM: "Comunicación",
    FPA: "Gestión de la trayectoria mediante automatización",
    FPM: "Gestión de la trayectoria mediante vuelo manual",
    LTW: "Liderazgo y trabajo en equipo",
    PSD: "Resolución de problemas y toma de decisiones",
    SAW: "Conciencia de la situación",
    WLM: "Gestión de la carga de trabajo"
  };

  const obs = [
    ["1.1", "KNO", "Demuestra conocimiento práctico y aplicable de las limitaciones y sistemas, y su interacción."],
    ["1.2", "KNO", "Demuestra el conocimiento requerido de las instrucciones de operación publicadas."],
    ["1.3", "KNO", "Demuestra conocimiento del entorno físico, el entorno del tráfico aéreo, incluyendo las rutas, condiciones meteorológicas, los aeropuertos y la infraestructura operativa."],
    ["1.4", "KNO", "Demuestra conocimiento apropiado de la legislación aplicable."],
    ["1.5", "KNO", "Sabe dónde obtener la información requerida."],
    ["1.6", "KNO", "Demuestra un interés positivo en adquirir conocimientos."],
    ["1.7", "KNO", "Es capaz de aplicar el conocimiento efectivamente."],
    ["2.1", "PRO", "Identifica dónde encontrar los procedimientos y las regulaciones."],
    ["2.2", "PRO", "Aplica las instrucciones de operación relevantes, procedimientos y técnicas de manera oportuna."],
    ["2.3", "PRO", "Sigue los SOP a menos que una desviación apropiada sea requerida para obtener un grado de seguridad más alto."],
    ["2.4", "PRO", "Opera los sistemas de la aeronave y el equipo asociado correctamente."],
    ["2.5", "PRO", "Monitorea correctamente los sistemas de la aeronave y sus equipos asociados."],
    ["2.6", "PRO", "Cumple la regulación aplicable."],
    ["2.7", "PRO", "Aplica el conocimiento procedimental relevante."],
    ["3.1", "COM", "Se asegura de que el receptor está listo y es capaz de recibir la información."],
    ["3.2", "COM", "Selecciona de forma apropiada qué comunicar, cuándo, cómo y con quién."],
    ["3.3", "COM", "Transmite mensajes de forma clara, precisa y concisa."],
    ["3.4", "COM", "Confirma que el receptor demuestra el entendimiento de la información importante."],
    ["3.5", "COM", "Escucha activamente y demuestra entendimiento al recibir la información."],
    ["3.6", "COM", "Formula preguntas relevantes y efectivas."],
    ["3.7", "COM", "Utiliza la escalación en comunicaciones adecuadamente para resolver desviaciones identificadas."],
    ["3.8", "COM", "Utiliza e interpreta la comunicación no verbal en una manera apropiada a la cultura organizacional y social."],
    ["3.9", "COM", "Se adhiere a la fraseología y los procedimientos radiotelefónicos estándar."],
    ["3.10", "COM", "Lee, interpreta, crea y responde con precisión a los mensajes de enlace de datos en inglés."],
    ["4.1", "FPA", "Utiliza la gestión de vuelo, sistemas de guía y la automatización apropiada, como están instalados y aplicable a las condiciones."],
    ["4.2", "FPA", "Monitorea y detecta desviaciones de la trayectoria de vuelo deseada y toma las acciones apropiadas."],
    ["4.3", "FPA", "Gestiona la trayectoria de vuelo de manera segura para lograr un desempeño operacional óptimo."],
    ["4.4", "FPA", "Mantiene la trayectoria deseada durante el vuelo utilizando la automatización, mientras gestiona otras tareas y distracciones."],
    ["4.5", "FPA", "Selecciona en tiempo oportuno el nivel y modo de automatización apropiados, teniendo en cuenta la fase de vuelo y la carga de trabajo."],
    ["4.6", "FPA", "Monitorea eficazmente la automatización, incluyendo su activación y las transiciones de modo automático."],
    ["5.1", "FPM", "Controla la aeronave manualmente, con precisión y suavidad como sea apropiado para la situación."],
    ["5.2", "FPM", "Monitorea y detecta desviaciones de la trayectoria de vuelo deseada y toma las acciones apropiadas."],
    ["5.3", "FPM", "Manualmente controla la aeronave usando la relación entre la actitud, velocidad y empuje de la aeronave y señales de navegación o información visual."],
    ["5.4", "FPM", "Gestiona la trayectoria de vuelo de manera segura para lograr un desempeño operacional óptimo."],
    ["5.5", "FPM", "Mantiene la trayectoria deseada durante el vuelo manual mientras gestiona otras tareas y distracciones."],
    ["5.6", "FPM", "Utiliza apropiadamente la gestión de vuelo, los sistemas de guía de vuelo, de estar instalados y aplicable a las condiciones."],
    ["5.7", "FPM", "Monitorea eficazmente los sistemas de guía de vuelo, incluyendo su activación y las transiciones de modo automático."],
    ["6.1", "LTW", "Alienta la participación y comunicación abierta del equipo."],
    ["6.2", "LTW", "Demuestra iniciativa y provee direccionamiento cuando es requerido."],
    ["6.3", "LTW", "Involucra a los otros en la planificación."],
    ["6.4", "LTW", "Considera aportes de los demás."],
    ["6.5", "LTW", "Da y recibe retroalimentación constructiva."],
    ["6.6", "LTW", "Afronta y resuelve conflictos y desacuerdos de manera constructiva."],
    ["6.7", "LTW", "Ejerce liderazgo decisivo cuando es requerido."],
    ["6.8", "LTW", "Acepta la responsabilidad de sus decisiones y acciones."],
    ["6.9", "LTW", "Lleva a cabo instrucciones cuando se le indica."],
    ["6.10", "LTW", "Aplica estrategias de intervención efectivas para resolver desviaciones identificadas."],
    ["6.11", "LTW", "Maneja los desafíos culturales y de lenguaje, de ser aplicable."],
    ["7.1", "PSD", "Identifica, evalúa y gestiona amenazas y errores en el momento oportuno."],
    ["7.2", "PSD", "Busca información precisa y adecuada de fuentes apropiadas."],
    ["7.3", "PSD", "Identifica y verifica qué y por qué no han salido bien las cosas, si es apropiado."],
    ["7.4", "PSD", "Persevera en la resolución de problemas priorizando la seguridad operacional."],
    ["7.5", "PSD", "Identifica y considera opciones apropiadas."],
    ["7.6", "PSD", "Aplica técnicas apropiadas y oportunas de toma de decisiones."],
    ["7.7", "PSD", "Monitorea, revisa y adapta las decisiones cuando se requiera."],
    ["7.8", "PSD", "Se adapta cuando se enfrenta a situaciones donde no existen guías o procedimientos."],
    ["7.9", "PSD", "Demuestra resiliencia cuando encuentra un evento inesperado."],
    ["8.1", "SAW", "Monitorea y evalúa con precisión el estado de la aeronave y de sus sistemas."],
    ["8.2", "SAW", "Monitorea y evalúa con precisión el estado de la energía de la aeronave y la trayectoria de vuelo anticipada."],
    ["8.3", "SAW", "Monitorea y evalúa con precisión el entorno general que pueda afectar a la operación."],
    ["8.4", "SAW", "Valida la precisión de la información y verifica errores graves."],
    ["8.5", "SAW", "Se mantiene alerta sobre las personas involucradas en, o que se ven afectadas por, la operación y de su capacidad para desempeñarse como es esperado."],
    ["8.6", "SAW", "Desarrolla planes de contingencia efectivos, basados en los riesgos potenciales asociados a las amenazas y errores."],
    ["8.7", "SAW", "Responde según las indicaciones de disminución de la conciencia de la situación."],
    ["9.1", "WLM", "Mantiene el autocontrol en todas las situaciones."],
    ["9.2", "WLM", "Planea, prioriza y programa las tareas apropiadas efectivamente."],
    ["9.3", "WLM", "Gestiona efectivamente el tiempo mientras desempeña tareas."],
    ["9.4", "WLM", "Ofrece y acepta asistencia."],
    ["9.5", "WLM", "Delega tareas cuando es necesario."],
    ["9.6", "WLM", "Busca y acepta asistencia cuando es apropiado."],
    ["9.7", "WLM", "Monitorea, revisa y comprueba por distintos medios las acciones conscientemente."],
    ["9.8", "WLM", "Verifica que se completen las tareas de acuerdo con los resultados esperados."],
    ["9.9", "WLM", "Gestiona y se recupera efectivamente de interrupciones, distracciones, variaciones y fallas durante el desarrollo de tareas."]
  ].map(([code, competency, text]) => ({ code, competency, text }));

  /*
   * Reglas conservadoras. Cada regla exige evidencia lingüística explícita.
   * No cubren todos los OB: los demás siguen disponibles para selección manual.
   */
  const evidenceRules = {
    "1.1": [["limitacion", "sistema"], ["sistemas", "interaccion"]],
    "1.2": [["manual", "consult"], ["instruccion", "operacion", "public"]],
    "1.3": [["meteorolog", "ruta"], ["trafico", "aeropuerto"]],
    "1.5": [["consult", "poh"], ["consult", "sop"], ["busco", "manual"], ["verifico", "fuente"]],
    "2.1": [["ubico", "procedimiento"], ["consult", "regulacion"]],
    "2.2": [["aplico", "procedimiento"], ["ejecuto", "lista"], ["checklist", "complet"]],
    "2.3": [["siguio", "sop"], ["aplico", "sop"], ["desvio", "sop", "seguridad"]],
    "2.4": [["opero", "sistema", "correct"], ["configuro", "equipo", "correct"]],
    "2.5": [["monitoreo", "sistema"], ["vigilo", "parametro", "sistema"]],
    "3.2": [["comunico", "atc"], ["informo", "momento", "oportun"]],
    "3.3": [["comunicacion", "clara", "precisa"], ["mensaje", "claro", "conciso"]],
    "3.4": [["confirmo", "entendimiento"], ["verifico", "comprend"]],
    "3.5": [["escucho", "instruccion"], ["colaciono", "correct"]],
    "3.6": [["pregunta", "relevante"], ["pregunto", "aclarar"]],
    "3.9": [["fraseologia", "estandar"], ["radiotelefon", "correct"]],
    "4.1": [["automatizacion", "apropiad"], ["piloto automatico", "utilizo"]],
    "4.2": [["automat", "desviacion", "corrig"], ["automat", "trayectoria", "monitore"]],
    "4.5": [["selecciono", "modo", "automat"], ["cambio", "modo", "oportun"]],
    "4.6": [["monitoreo", "modo", "automat"], ["transicion", "modo", "verific"]],
    "5.1": [["vuelo manual", "precision"], ["controlo", "manual", "suav"]],
    "5.2": [["desviacion", "trayectoria", "corrig"], ["desviacion", "rumbo", "corrig"], ["desviacion", "altitud", "corrig"]],
    "5.3": [["actitud", "velocidad", "potencia"], ["actitud", "empuje", "manual"]],
    "5.5": [["vuelo manual", "distraccion"], ["manual", "otra tarea", "trayectoria"]],
    "6.1": [["invito", "participar"], ["comunicacion", "abierta", "equipo"]],
    "6.2": [["tomo", "iniciativa"], ["dio", "direccion", "equipo"]],
    "6.3": [["involucro", "planificacion"], ["planifico", "equipo"]],
    "6.4": [["considero", "aporte"], ["acepto", "sugerencia"]],
    "6.5": [["retroalimentacion", "constructiva"], ["feedback", "constructiv"]],
    "6.7": [["liderazgo", "decisivo"], ["tomo", "liderazgo", "requer"]],
    "6.8": [["acepto", "responsabilidad"], ["asumio", "responsabilidad"]],
    "7.1": [["amenaza", "error", "gestion"], ["identifico", "amenaza", "oportun"]],
    "7.2": [["busco", "informacion", "fuente"], ["consulto", "fuente", "apropiad"]],
    "7.3": [["identifico", "causa"], ["verifico", "por que", "fall"]],
    "7.4": [["resolvio", "problema", "seguridad"], ["priorizo", "seguridad", "problema"]],
    "7.5": [["considero", "opciones"], ["evaluo", "alternativas"]],
    "7.6": [["tomo", "decision", "oportun"], ["decision", "apropiada"]],
    "7.7": [["reviso", "decision"], ["adapto", "decision"]],
    "7.9": [["evento", "inesperado", "recuper"], ["falla", "inesperada", "gestion"]],
    "8.1": [["monitoreo", "estado", "aeronave"], ["monitoreo", "sistemas", "aeronave"]],
    "8.2": [["energia", "trayectoria", "monitore"], ["anticip", "trayectoria", "energia"]],
    "8.3": [["monitoreo", "meteorolog"], ["monitoreo", "trafico"], ["evalua", "entorno", "operacion"]],
    "8.4": [["verifico", "informacion", "error"], ["cruzo", "informacion", "fuente"]],
    "8.6": [["plan", "contingencia", "riesgo"], ["alterno", "amenaza", "plan"]],
    "9.1": [["mantuvo", "autocontrol"], ["conservo", "calma", "falla"]],
    "9.2": [["priorizo", "tareas"], ["planifico", "tareas"]],
    "9.3": [["gestiono", "tiempo"], ["tiempo", "tareas", "efectiv"]],
    "9.4": [["ofrecio", "asistencia"], ["acepto", "asistencia"]],
    "9.6": [["solicito", "asistencia"], ["pidio", "ayuda", "oportun"]],
    "9.7": [["verifico", "accion", "otro medio"], ["comprobo", "accion"]],
    "9.8": [["verifico", "tarea", "resultado"], ["confirmo", "lista", "completa"]],
    "9.9": [["distraccion", "recuper"], ["interrupcion", "recuper"], ["falla", "carga", "gestion"]]
  };

  const referencesByProgram = {
    PPA: [
      "MES: misión seleccionada y objetivos aplicables.",
      "SOP de la organización: secuencia y técnica normal o anormal aplicable.",
      "POH/AFM: limitaciones, procedimientos y datos específicos de la aeronave.",
      "FOM: apoyo operacional; no reemplaza al POH/AFM ni al SOP vigente."
    ],
    PCA: [
      "MES: misión seleccionada y objetivos aplicables.",
      "SOP de la organización: criterios de aproximación, maniobra o contingencia.",
      "POH/AFM: limitaciones y técnica específica de la aeronave.",
      "FOM: apoyo operacional; el POH/AFM conserva la autoridad final."
    ],
    Instrumentos: [
      "MES: misión seleccionada y objetivos aplicables.",
      "SOP de la organización: procedimientos IFR y criterios operacionales.",
      "POH/AFM y documentación de aviónica: limitaciones, modos y procedimientos aplicables.",
      "Carta o publicación aeronáutica vigente usada durante la sesión.",
      "FOM: apoyo operacional; no sustituye ninguna publicación autorizada."
    ]
  };

  return {
    version: "1.0-prototipo",
    sourceNotice: "Síntesis de trabajo basada en el MES y en los OB suministrados. Validación final requerida por la organización.",
    missions,
    competencyNames,
    obs,
    evidenceRules,
    referencesByProgram
  };
})();
