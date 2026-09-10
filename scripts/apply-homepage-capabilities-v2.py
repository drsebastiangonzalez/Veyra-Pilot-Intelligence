from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

marker = '/* === Veyra Homepage Capabilities v2 · 2026-09-10 === */'
if marker in text:
    print('Homepage capabilities v2 already applied.')
    raise SystemExit(0)

old_banner = '''    <section class="homePerformanceBanner" aria-label="Formación orientada al desempeño">
      <img src="assets/index-visuals/veyra-performance-banner.jpg" alt="Prepararse antes de ejecutar. Comprender antes de decidir. Formación orientada al desempeño." loading="lazy">
    </section>

    <section id="homeEnterprise" class="homeEnterprise" aria-label="Personalización empresarial">'''

new_block = '''    <section class="homePerformanceBanner homePerformanceBannerReal" aria-label="Formación orientada al desempeño">
      <div class="homePerformanceCopy">
        <h2>Prepararse antes de ejecutar.<br>Comprender antes de decidir.</h2>
        <p>Formación orientada al desempeño</p>
      </div>
    </section>

    <section id="homeCapabilities" class="homeCapabilitiesCatalog" aria-label="Capacidades de Veyra">
      <div class="homeCapabilitiesHead">
        <span class="homeEyebrow">Plataforma modular</span>
        <h2>Descubre todo lo que Veyra puede hacer</h2>
        <p>Una misma plataforma para evaluar, entrenar, registrar evidencia, automatizar tareas y convertir datos en decisiones de entrenamiento.</p>
      </div>
      <div class="homeCapabilitiesGrid">
        <button type="button" class="homeCapabilityCard" data-cap-open="cap-instructor"><span>01</span><h3>Instructor Assistant</h3><p>Preparación, evidencia y retroalimentación estructurada.</p><b>Explorar →</b></button>
        <button type="button" class="homeCapabilityCard" data-cap-open="cap-records"><span>02</span><h3>Evaluación & Evidencia</h3><p>Resultados, historial y trazabilidad del proceso formativo.</p><b>Explorar →</b></button>
        <button type="button" class="homeCapabilityCard" data-cap-open="cap-analytics"><span>03</span><h3>Analítica</h3><p>Indicadores por piloto, competencia, misión y grupo.</p><b>Explorar →</b></button>
        <button type="button" class="homeCapabilityCard" data-cap-open="cap-training"><span>04</span><h3>Training Design</h3><p>Rutas, módulos y contenidos adaptados a cada programa.</p><b>Explorar →</b></button>
        <button type="button" class="homeCapabilityCard" data-cap-open="cap-voa"><span>05</span><h3>VOA & Automatización</h3><p>Confirmaciones, recordatorios y seguimiento operativo.</p><b>Explorar →</b></button>
        <button type="button" class="homeCapabilityCard" data-cap-open="cap-custom"><span>06</span><h3>Personalización</h3><p>Flujos, marca, reportes y módulos por organización.</p><b>Explorar →</b></button>
      </div>

      <div class="homeCapabilityExplorer" aria-label="Explorador de módulos Veyra">
        <aside class="homeCapabilityTabs" role="tablist" aria-label="Módulos Veyra">
          <div class="homeCapabilityGroup">Estándar</div>
          <button type="button" class="active" role="tab" aria-selected="true" data-cap-target="cap-instructor">Instructor Assistant</button>
          <button type="button" role="tab" aria-selected="false" data-cap-target="cap-records">Evaluación & Evidencia</button>
          <button type="button" role="tab" aria-selected="false" data-cap-target="cap-analytics">Analítica</button>
          <button type="button" role="tab" aria-selected="false" data-cap-target="cap-training">Training Design</button>
          <div class="homeCapabilityGroup smart">Smart</div>
          <button type="button" role="tab" aria-selected="false" data-cap-target="cap-voa">VOA & Automatización</button>
          <button type="button" role="tab" aria-selected="false" data-cap-target="cap-custom">Personalización</button>
        </aside>

        <div class="homeCapabilityPanels">
          <article id="cap-instructor" class="homeCapabilityPanel active" role="tabpanel">
            <div class="homeCapabilityPanelCopy">
              <span class="homeEyebrow">Instructor Assistant</span>
              <h3>Más tiempo para observar. Menos fricción para registrar.</h3>
              <p>El asistente acompaña al instructor antes, durante y después de la sesión para organizar la evidencia sin sustituir su criterio profesional.</p>
              <ul>
                <li>Configuración de sesión e Instructor Focus.</li>
                <li>Observaciones estructuradas: Fortaleza / Por mejorar.</li>
                <li>Competencias y comportamientos observables.</li>
                <li>CM1 / CM2 y funciones PF / PM.</li>
                <li>Guardado y recuperación por usuario autenticado.</li>
              </ul>
              <button type="button" class="homeInlineCta" onclick="location.href='asistente-instructor-v3-8.html?v=3812#flight-training'">Conocer Instructor Assistant →</button>
            </div>
            <div class="homeCapabilityVisual instructorVisual" aria-label="Vista conceptual del Instructor Assistant">
              <div class="mockTop"><span>FLIGHT TRAINING</span><b>EVAL 1</b></div>
              <div class="mockSplit"><div><small>Instructor Focus</small><strong>Preparación y observación</strong><i>CM1 · PF</i></div><div><small>Evidencia</small><strong>Fortaleza</strong><p>Mantiene una secuencia clara y prioriza tareas.</p></div></div>
              <div class="mockCompetencies"><span>KNO</span><span>COM</span><span>SAW</span><span>WLM</span></div>
            </div>
          </article>

          <article id="cap-records" class="homeCapabilityPanel" role="tabpanel" hidden>
            <div class="homeCapabilityPanelCopy">
              <span class="homeEyebrow">Evaluación & Evidencia</span>
              <h3>Un historial estructurado que conserva el contexto.</h3>
              <p>Veyra centraliza resultados y registros para facilitar seguimiento académico, revisión posterior y continuidad entre evaluaciones.</p>
              <ul>
                <li>Resultados Pre-Solo, PPA y PCA.</li>
                <li>Intentos e historial por evaluación.</li>
                <li>Sesiones de Flight Training con control de revisión.</li>
                <li>Reportes individuales y grupales.</li>
                <li>Acceso protegido por cuenta y políticas RLS.</li>
              </ul>
            </div>
            <div class="homeCapabilityVisual recordsVisual" aria-label="Vista conceptual de registros">
              <div class="recordRow"><b>Pre-Solo</b><span>Aprobado</span><em>Hoy</em></div>
              <div class="recordRow"><b>PPA</b><span>Seguimiento</span><em>Sesión 04</em></div>
              <div class="recordRow"><b>Flight Training</b><span>Guardado</span><em>EVAL 1</em></div>
              <div class="recordFooter">Evidencia organizada · trazabilidad · recuperación</div>
            </div>
          </article>

          <article id="cap-analytics" class="homeCapabilityPanel" role="tabpanel" hidden>
            <div class="homeCapabilityPanelCopy">
              <span class="homeEyebrow">Analítica de desempeño</span>
              <h3>Convierte registros en prioridades de entrenamiento.</h3>
              <p>Los datos pueden visualizarse por piloto, competencia, misión o grupo para orientar debriefings y decisiones formativas con mayor claridad.</p>
              <ul>
                <li>Tendencias por competencia y comportamiento observable.</li>
                <li>Comparativos por misión, evaluación y cohorte.</li>
                <li>Fortalezas, brechas y recurrencias.</li>
                <li>Reportes individuales y consolidados.</li>
                <li>Lectura compatible con enfoques CBTA / EBT.</li>
              </ul>
            </div>
            <div class="homeCapabilityVisual analyticsVisual" aria-label="Vista conceptual de analítica">
              <div class="analyticsKpis"><div><small>Sesiones</small><b>28</b></div><div><small>Competencias</small><b>9</b></div><div><small>Seguimiento</small><b>Activo</b></div></div>
              <div class="miniBars"><span style="--w:84%"><b>SAW</b><i></i></span><span style="--w:72%"><b>COM</b><i></i></span><span style="--w:63%"><b>WLM</b><i></i></span><span style="--w:78%"><b>FPM</b><i></i></span></div>
              <div class="analyticsNote">Del dato → al debriefing → a la decisión de entrenamiento</div>
            </div>
          </article>

          <article id="cap-training" class="homeCapabilityPanel" role="tabpanel" hidden>
            <div class="homeCapabilityPanelCopy">
              <span class="homeEyebrow">Training Design</span>
              <h3>Diseña rutas de aprendizaje que reflejan tu operación.</h3>
              <p>Veyra permite estructurar módulos, guías y rutas de preparación para acompañar distintas fases del entrenamiento aeronáutico.</p>
              <ul>
                <li>Training Center modular.</li>
                <li>Curso inicial de instrumentos IFR / PBN.</li>
                <li>Guías PPA / PCA y preparación Pre-Solo.</li>
                <li>Introducción académica A320.</li>
                <li>Contenidos personalizados por organización.</li>
              </ul>
              <button type="button" class="homeInlineCta" onclick="showTrainingCenter()">Explorar Training Center →</button>
            </div>
            <div class="homeCapabilityVisual trainingVisual" aria-label="Vista conceptual de rutas de entrenamiento">
              <div class="trainingStage active"><small>01</small><b>Fundamentos</b><span>Preparación estructurada</span></div>
              <div class="trainingStage"><small>02</small><b>Aplicación</b><span>Escenarios y práctica</span></div>
              <div class="trainingStage"><small>03</small><b>Consolidación</b><span>Evaluación y seguimiento</span></div>
            </div>
          </article>

          <article id="cap-voa" class="homeCapabilityPanel" role="tabpanel" hidden>
            <div class="homeCapabilityPanelCopy">
              <span class="homeEyebrow">VOA & Automatización</span>
              <h3>Automatiza tareas repetitivas sin perder control operativo.</h3>
              <p>Los flujos VOA conectan programación, comunicación y seguimiento para reducir trabajo manual y mantener trazabilidad.</p>
              <ul>
                <li>Confirmación de asistencia por WhatsApp Business.</li>
                <li>Recordatorios y mensajes posteriores a la confirmación.</li>
                <li>Mission Briefs y seguimiento de estado.</li>
                <li>Panel operativo con filtros y control de programación.</li>
                <li>Automatizaciones configurables por proceso.</li>
              </ul>
            </div>
            <div class="homeCapabilityVisual voaVisual" aria-label="Vista conceptual de automatización VOA">
              <div class="voaMessage"><small>WhatsApp Business</small><b>Sesión programada</b><span>Confirmación pendiente</span></div>
              <div class="voaFlow"><i></i><span>Programación</span><i></i><span>Confirmación</span><i></i><span>Seguimiento</span></div>
              <div class="voaStatus"><b>Confirmada</b><span>Instructor asignado · información actualizada</span></div>
            </div>
          </article>

          <article id="cap-custom" class="homeCapabilityPanel" role="tabpanel" hidden>
            <div class="homeCapabilityPanelCopy">
              <span class="homeEyebrow">Personalización empresarial</span>
              <h3>Una base tecnológica, múltiples formas de operar.</h3>
              <p>La plataforma puede adaptarse a la identidad, procesos, reportes, permisos y objetivos de entrenamiento de cada organización.</p>
              <ul>
                <li>Marca y experiencia visual personalizada.</li>
                <li>Módulos y flujos por empresa.</li>
                <li>Roles, accesos y trazabilidad.</li>
                <li>Reportes y métricas según necesidades.</li>
                <li>Integraciones habilitadas según proyecto y autorización.</li>
              </ul>
              <button type="button" class="homeInlineCta" onclick="showScreen('contact')">Solicitar demo →</button>
            </div>
            <div class="homeCapabilityVisual customVisual" aria-label="Vista conceptual de personalización">
              <div class="customBrand"><strong>Tu marca</strong><span>Identidad y experiencia</span></div>
              <div class="customModules"><span>Evaluación</span><span>Training</span><span>Analytics</span><span>Automations</span></div>
              <div class="customFooter">Configuración por organización</div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="homeTechStack" aria-label="Ecosistema tecnológico Veyra">
      <div class="homeTechHead">
        <span class="homeEyebrow">Ecosistema tecnológico</span>
        <h2>Conectado con las herramientas que forman parte de tu flujo.</h2>
        <p>Las integraciones se habilitan según el proyecto, los permisos del cliente y las políticas de cada proveedor. La presencia de una marca no implica alianza comercial.</p>
      </div>
      <div class="homeTechViewport">
        <div class="homeTechTrack">
          <span><b>GitHub</b><small>Code & deployment</small></span>
          <span><b>Supabase</b><small>Data & Auth</small></span>
          <span><b>WhatsApp Business</b><small>Messaging</small></span>
          <span><b>Meta</b><small>Business Platform</small></span>
          <span><b>OpenAI</b><small>AI · optional</small></span>
          <span><b>Claude</b><small>AI · compatible</small></span>
          <span><b>Google Drive</b><small>Files</small></span>
          <span><b>Gmail</b><small>E-mail</small></span>
          <span><b>Outlook</b><small>E-mail</small></span>
          <span><b>Google Calendar</b><small>Scheduling</small></span>
          <span><b>Apple iOS</b><small>Mobile App</small></span>
          <span><b>Resend</b><small>E-mail infrastructure</small></span>
          <span aria-hidden="true"><b>GitHub</b><small>Code & deployment</small></span>
          <span aria-hidden="true"><b>Supabase</b><small>Data & Auth</small></span>
          <span aria-hidden="true"><b>WhatsApp Business</b><small>Messaging</small></span>
          <span aria-hidden="true"><b>Meta</b><small>Business Platform</small></span>
          <span aria-hidden="true"><b>OpenAI</b><small>AI · optional</small></span>
          <span aria-hidden="true"><b>Claude</b><small>AI · compatible</small></span>
          <span aria-hidden="true"><b>Google Drive</b><small>Files</small></span>
          <span aria-hidden="true"><b>Gmail</b><small>E-mail</small></span>
          <span aria-hidden="true"><b>Outlook</b><small>E-mail</small></span>
          <span aria-hidden="true"><b>Google Calendar</b><small>Scheduling</small></span>
          <span aria-hidden="true"><b>Apple iOS</b><small>Mobile App</small></span>
          <span aria-hidden="true"><b>Resend</b><small>E-mail infrastructure</small></span>
        </div>
      </div>
    </section>

    <section id="homeEnterprise" class="homeEnterprise" aria-label="Personalización empresarial">'''

if old_banner not in text:
    raise SystemExit('Expected performance banner block not found.')
text = text.replace(old_banner, new_block, 1)

css = r'''

/* === Veyra Homepage Capabilities v2 · 2026-09-10 === */
.homePerformanceBannerReal{
  min-height:360px!important;
  display:flex!important;
  align-items:center!important;
  padding:64px max(28px,calc((100vw - 1180px)/2))!important;
  background:
    linear-gradient(90deg,rgba(3,5,9,.96) 0%,rgba(3,5,9,.86) 40%,rgba(3,5,9,.35) 70%,rgba(3,5,9,.55) 100%),
    linear-gradient(180deg,rgba(3,5,9,.05),rgba(3,5,9,.65)),
    url('avion-negro.jpg') center 54%/cover no-repeat!important;
  line-height:normal!important;
}
.homePerformanceCopy{max-width:760px;color:#fff}
.homePerformanceCopy h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(40px,4.6vw,64px);font-weight:400;line-height:1.04;letter-spacing:-.04em;margin:0;color:#fff}
.homePerformanceCopy p{margin:20px 0 0;color:#d7ad59;text-transform:uppercase;letter-spacing:.22em;font-size:11px;font-weight:900}
.homeCapabilitiesCatalog{background:#f6f2e9;padding:78px max(28px,calc((100vw - 1180px)/2)) 82px;color:#0a1728}
.homeCapabilitiesHead{text-align:center;max-width:900px;margin:0 auto 38px}
.homeCapabilitiesHead .homeEyebrow{justify-content:center}
.homeCapabilitiesHead h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(44px,4.9vw,68px);font-weight:400;letter-spacing:-.045em;line-height:1.02;margin:0 0 16px;color:#0a1728}
.homeCapabilitiesHead p{max-width:760px;margin:0 auto;color:#667080;font-size:17px;line-height:1.62}
.homeCapabilitiesGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:56px}
.homeCapabilityCard{appearance:none;text-align:left;min-height:205px;border:1px solid #ded6ca;background:#fffdf8;padding:24px;border-radius:0;box-shadow:0 13px 30px rgba(23,31,44,.055);transition:.2s ease;color:#0a1728}
.homeCapabilityCard:hover,.homeCapabilityCard:focus{transform:translateY(-3px);border-color:#c8a45d;box-shadow:0 18px 38px rgba(23,31,44,.09);outline:none}
.homeCapabilityCard>span{display:grid;place-items:center;width:42px;height:42px;border:1px solid #c8a45d;border-radius:50%;color:#9a712a;font-size:11px;letter-spacing:.09em;font-weight:900;margin-bottom:20px}
.homeCapabilityCard h3{font-family:Georgia,'Times New Roman',serif;font-size:27px;font-weight:400;margin:0 0 9px;color:#0a1728}
.homeCapabilityCard p{margin:0;color:#687181;font-size:13px;line-height:1.5}
.homeCapabilityCard b{display:block;margin-top:20px;color:#9a712a;font-size:11px;text-transform:uppercase;letter-spacing:.11em}
.homeCapabilityExplorer{display:grid;grid-template-columns:290px minmax(0,1fr);gap:38px;align-items:start;border-top:1px solid #ded6ca;padding-top:48px}
.homeCapabilityTabs{position:sticky;top:130px;display:grid;gap:2px}
.homeCapabilityGroup{font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.12em;color:#9a712a;margin:0 0 8px;padding:0 14px}.homeCapabilityGroup.smart{margin-top:20px;color:#7365c7}
.homeCapabilityTabs button{border:0;border-radius:0;background:#fff;color:#273142;padding:16px 16px;text-align:left;font-size:14px;font-weight:750;border-left:3px solid transparent;box-shadow:0 6px 18px rgba(23,31,44,.03)}
.homeCapabilityTabs button:hover,.homeCapabilityTabs button:focus{background:#f1ece2;outline:none}.homeCapabilityTabs button.active{background:#e8e3da;border-left-color:#c8a45d;color:#0a1728}
.homeCapabilityPanels{min-height:610px}
.homeCapabilityPanel{display:grid;grid-template-columns:1fr .95fr;gap:48px;align-items:center;padding:24px 0 10px}
.homeCapabilityPanel[hidden]{display:none!important}
.homeCapabilityPanelCopy h3{font-family:Georgia,'Times New Roman',serif;font-size:clamp(40px,4vw,58px);font-weight:400;line-height:1.02;letter-spacing:-.04em;margin:0 0 18px;color:#0a1728}
.homeCapabilityPanelCopy>p{color:#4e5866;font-size:16px;line-height:1.62;margin:0 0 18px}.homeCapabilityPanelCopy ul{margin:0;padding-left:19px;color:#384351}.homeCapabilityPanelCopy li{margin:9px 0;line-height:1.45}
.homeInlineCta{margin-top:24px;padding:0;border:0;background:none;color:#9a712a;border-radius:0;text-transform:uppercase;letter-spacing:.09em;font-size:11px;font-weight:900}
.homeCapabilityVisual{min-height:410px;background:linear-gradient(145deg,#07101b,#101b2a);border:1px solid rgba(200,164,93,.35);padding:24px;box-shadow:0 25px 65px rgba(8,15,25,.18);color:#fff;display:flex;flex-direction:column;justify-content:center}
.mockTop{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,.1);padding-bottom:14px;margin-bottom:20px}.mockTop span{font-size:10px;text-transform:uppercase;letter-spacing:.14em;color:#d7ad59}.mockTop b{font-family:Georgia,serif;font-size:20px;font-weight:400}
.mockSplit{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mockSplit>div{border:1px solid rgba(255,255,255,.1);padding:17px;background:rgba(255,255,255,.035)}.mockSplit small{display:block;color:#94a0b1;font-size:10px;text-transform:uppercase;letter-spacing:.08em}.mockSplit strong{display:block;margin-top:7px;color:#fff}.mockSplit i{display:inline-block;margin-top:14px;color:#d7ad59;font-style:normal;font-size:11px}.mockSplit p{color:#cbd2dc;font-size:12px;line-height:1.45;margin:10px 0 0}.mockCompetencies{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}.mockCompetencies span{border:1px solid rgba(200,164,93,.45);color:#efd69b;padding:8px 11px;border-radius:999px;font-size:10px;font-weight:900;letter-spacing:.05em}
.recordsVisual{gap:10px}.recordRow{display:grid;grid-template-columns:1fr auto auto;gap:12px;align-items:center;border:1px solid rgba(255,255,255,.1);padding:16px;background:rgba(255,255,255,.03)}.recordRow b{font-size:14px}.recordRow span{color:#d7ad59;font-size:11px}.recordRow em{color:#93a0b1;font-style:normal;font-size:11px}.recordFooter{margin-top:10px;padding-top:18px;border-top:1px solid rgba(255,255,255,.1);color:#9fa9b7;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
.analyticsKpis{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.analyticsKpis>div{border:1px solid rgba(255,255,255,.1);padding:14px}.analyticsKpis small{display:block;color:#8f9aa8;font-size:10px}.analyticsKpis b{display:block;color:#f0d58e;font-size:19px;margin-top:5px}.miniBars{display:grid;gap:13px;margin-top:22px}.miniBars span{display:grid;grid-template-columns:46px 1fr;gap:12px;align-items:center}.miniBars b{font-size:11px;color:#d3d9e2}.miniBars i{height:10px;background:linear-gradient(90deg,#d7ad59 var(--w),rgba(255,255,255,.08) var(--w));border:1px solid rgba(255,255,255,.05)}.analyticsNote{margin-top:24px;color:#aab3c0;font-size:11px;text-align:center;text-transform:uppercase;letter-spacing:.09em}
.trainingVisual{gap:12px}.trainingStage{display:grid;grid-template-columns:48px 1fr;grid-template-rows:auto auto;gap:2px 14px;border:1px solid rgba(255,255,255,.1);padding:16px;background:rgba(255,255,255,.025)}.trainingStage small{grid-row:1/3;display:grid;place-items:center;border:1px solid rgba(200,164,93,.4);color:#d7ad59}.trainingStage b{font-family:Georgia,serif;font-size:19px;font-weight:400}.trainingStage span{color:#97a2b1;font-size:11px}.trainingStage.active{border-color:rgba(200,164,93,.45);background:rgba(200,164,93,.06)}
.voaVisual{gap:18px}.voaMessage{align-self:flex-start;width:78%;border:1px solid rgba(255,255,255,.1);padding:16px;background:#10263a}.voaMessage small{color:#7fb899}.voaMessage b,.voaMessage span{display:block;margin-top:6px}.voaMessage span{color:#bdc6d2;font-size:11px}.voaFlow{display:flex;align-items:center;gap:7px;flex-wrap:wrap;color:#9ea9b7;font-size:10px}.voaFlow i{width:18px;height:1px;background:#d7ad59}.voaStatus{align-self:flex-end;width:82%;border:1px solid rgba(200,164,93,.32);padding:16px;background:rgba(200,164,93,.06)}.voaStatus b{color:#f0d58e}.voaStatus span{display:block;color:#aeb8c5;font-size:11px;margin-top:6px}
.customVisual{justify-content:space-between}.customBrand{padding:22px;border:1px solid rgba(200,164,93,.35);background:rgba(255,255,255,.025)}.customBrand strong{font-family:Georgia,serif;font-size:32px;font-weight:400}.customBrand span{display:block;color:#9ba6b4;margin-top:5px;font-size:11px}.customModules{display:grid;grid-template-columns:1fr 1fr;gap:8px}.customModules span{border:1px solid rgba(255,255,255,.1);padding:14px;color:#d4dae3;font-size:11px}.customFooter{border-top:1px solid rgba(255,255,255,.1);padding-top:14px;color:#d7ad59;font-size:10px;text-transform:uppercase;letter-spacing:.1em}
.homeTechStack{background:#fff;padding:64px 0 56px;border-top:1px solid #e2ddd3;border-bottom:1px solid #e2ddd3;overflow:hidden}.homeTechHead{max-width:1180px;margin:0 auto 28px;padding:0 28px}.homeTechHead h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(36px,3.8vw,54px);font-weight:400;line-height:1.05;letter-spacing:-.035em;margin:0 0 12px;color:#0a1728;max-width:820px}.homeTechHead p{color:#727b88;font-size:13px;line-height:1.55;max-width:850px}.homeTechViewport{overflow:hidden;mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}.homeTechTrack{display:flex;gap:14px;width:max-content;animation:veyraTechMarquee 42s linear infinite}.homeTechTrack>span{width:210px;min-height:88px;border:1px solid #e1ddd4;background:#fbfaf6;padding:17px 18px;display:flex;flex-direction:column;justify-content:center}.homeTechTrack b{font-size:14px;color:#1b2737}.homeTechTrack small{color:#8a929c;margin-top:5px;font-size:10px;text-transform:uppercase;letter-spacing:.06em}@keyframes veyraTechMarquee{to{transform:translateX(calc(-50% - 7px))}}
@media(prefers-reduced-motion:reduce){.homeTechTrack{animation:none;flex-wrap:wrap;width:auto;padding:0 20px;justify-content:center}}
@media(max-width:980px){.homeCapabilitiesGrid{grid-template-columns:1fr 1fr}.homeCapabilityExplorer{grid-template-columns:1fr}.homeCapabilityTabs{position:static;display:flex;gap:8px;flex-wrap:wrap}.homeCapabilityGroup{width:100%;padding:0;margin-top:10px}.homeCapabilityTabs button{flex:1 1 220px}.homeCapabilityPanel{grid-template-columns:1fr}.homeCapabilityPanels{min-height:auto}.homeCapabilityVisual{min-height:340px}}
@media(max-width:680px){.homePerformanceBannerReal{min-height:300px!important;padding:46px 20px!important;background-position:62% center!important}.homePerformanceCopy h2{font-size:38px}.homeCapabilitiesCatalog{padding:56px 20px 62px}.homeCapabilitiesGrid{grid-template-columns:1fr}.homeCapabilityCard{min-height:170px}.homeCapabilityExplorer{gap:22px;padding-top:34px}.homeCapabilityPanelCopy h3{font-size:39px}.homeCapabilityVisual{padding:18px}.mockSplit{grid-template-columns:1fr}.homeTechHead{padding:0 20px}.homeTechTrack>span{width:180px}}
'''

style_close = text.rfind('</style>')
if style_close < 0:
    raise SystemExit('Final style closing tag not found.')
text = text[:style_close] + css + '\n' + text[style_close:]

js = r'''
<script>
(() => {
  const catalog = document.getElementById('homeCapabilities');
  if (!catalog) return;
  const explorer = catalog.querySelector('.homeCapabilityExplorer');
  const tabs = [...catalog.querySelectorAll('[data-cap-target]')];
  const panels = [...catalog.querySelectorAll('.homeCapabilityPanel')];

  function activateCapability(id, shouldScroll) {
    tabs.forEach((tab) => {
      const active = tab.dataset.capTarget === id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach((panel) => {
      const active = panel.id === id;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
    if (shouldScroll && explorer) explorer.scrollIntoView({behavior:'smooth', block:'start'});
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => activateCapability(tab.dataset.capTarget, false)));
  catalog.querySelectorAll('[data-cap-open]').forEach((button) => button.addEventListener('click', () => activateCapability(button.dataset.capOpen, true)));
})();
</script>
'''

body_close = text.rfind('</body>')
if body_close < 0:
    raise SystemExit('Body closing tag not found.')
text = text[:body_close] + js + '\n' + text[body_close:]

required = [
    marker,
    'Descubre todo lo que Veyra puede hacer',
    'Instructor Assistant',
    'Evaluación & Evidencia',
    'Analítica de desempeño',
    'VOA & Automatización',
    'Ecosistema tecnológico',
    'GitHub', 'Supabase', 'WhatsApp Business', 'OpenAI', 'Claude',
    "url('avion-negro.jpg')",
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit('Homepage v2 validation failed: ' + ', '.join(missing))

if text.count('id="homeCapabilities"') != 1:
    raise SystemExit('Homepage v2 validation failed: homeCapabilities must be unique.')

path.write_text(text, encoding='utf-8')
print('Homepage capabilities v2 applied and validated.')
