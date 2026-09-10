from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

if 'homeEnterpriseV1' in text:
    print('Homepage enterprise redesign already applied.')
    raise SystemExit(0)

old_cta = '''<button class="heroPrimary" onclick="showAssessment()">Iniciar evaluación <span>→</span></button>'''
new_cta = '''<button class="heroPrimary" onclick="showScreen('contact')">Solicitar demo <span>→</span></button>'''
if old_cta not in text:
    raise SystemExit('Expected hero CTA was not found.')
text = text.replace(old_cta, new_cta, 1)

start_marker = '  <div class="veyraHomeStory">'
end_marker = '\n\n\n</section>\n\n<section id="assessment" class="screen">'
start = text.find(start_marker)
if start < 0:
    raise SystemExit('Homepage story start marker not found.')
end = text.find(end_marker, start)
if end < 0:
    raise SystemExit('Homepage story end marker not found.')

home_block = r'''  <div class="veyraHomeStory homeEnterpriseV1">
    <section id="homeMethod" class="homeStoryIntro" aria-label="Qué es Veyra">
      <div class="homeStoryImage" role="img" aria-label="Aeronaves Veyra en plataforma"></div>
      <div class="homeStoryCopy">
        <span class="homeEyebrow">Pilot Training Intelligence</span>
        <h2>Una nueva forma de acompañar el progreso del piloto</h2>
        <p>Veyra integra evaluación académica, preparación estructurada y análisis de desempeño para apoyar decisiones más claras durante el entrenamiento aeronáutico.</p>
        <p>Cada resultado se transforma en información útil para orientar la retroalimentación, priorizar refuerzos y llegar mejor preparado a cada fase de formación.</p>
      </div>
    </section>

    <section class="homePillars" aria-label="Cuatro pilares de Veyra">
      <div class="homePillarsHead">
        <div>
          <span class="homeEyebrow">Nuestra solución</span>
          <h2>Cuatro pilares,<br>un mejor futuro para la aviación</h2>
        </div>
        <p>Una plataforma integral que convierte la información en decisiones, acelera el aprendizaje y eleva los estándares de la formación aeronáutica.</p>
      </div>
      <div class="homePillarGrid">
        <article class="homePillarCard">
          <div class="homePillarIcon">01</div>
          <h3>Evaluación</h3>
          <p>Evalúa competencias, preparación y conocimientos mediante instrumentos estructurados y seguimiento continuo.</p>
          <button type="button" onclick="showAssessment()">Saber más <span>→</span></button>
        </article>
        <article class="homePillarCard">
          <div class="homePillarIcon">02</div>
          <h3>Entrenamiento</h3>
          <p>Gestión de programas, contenidos y rutas de preparación para acompañar el progreso antes del simulador y el vuelo.</p>
          <button type="button" onclick="showTrainingCenter()">Saber más <span>→</span></button>
        </article>
        <article class="homePillarCard">
          <div class="homePillarIcon">03</div>
          <h3>Analítica</h3>
          <p>Convierte resultados en información útil para identificar tendencias, brechas y prioridades de entrenamiento.</p>
          <button type="button" onclick="showScreen('cbta')">Saber más <span>→</span></button>
        </article>
        <article class="homePillarCard">
          <div class="homePillarIcon">04</div>
          <h3>Personalización</h3>
          <p>Adapta flujos, reportes, módulos y experiencia visual a los objetivos y estándares de cada organización.</p>
          <button type="button" onclick="document.getElementById('homeEnterprise').scrollIntoView({behavior:'smooth'})">Saber más <span>→</span></button>
        </article>
      </div>
    </section>

    <section class="homeEcosystem" id="homeEcosystem" aria-label="Ecosistema conectado Veyra">
      <div class="homeEcosystemCopy">
        <span class="homeEyebrow">Ecosistema conectado</span>
        <h2>Todo tu entrenamiento en perfecta sincronía</h2>
        <p>Veyra integra herramientas, personas y datos para crear un flujo de información continuo, seguro y comprensible en un solo ecosistema.</p>
        <button class="homeOutlineCta" type="button" onclick="showScreen('contact')">Ver integraciones <span>→</span></button>
      </div>
      <div class="homeNetworkMap" aria-label="Red de módulos e integraciones de Veyra">
        <svg class="homeNetworkLines" viewBox="0 0 1000 640" role="img" aria-label="Conexiones entre Veyra y sus módulos">
          <defs>
            <linearGradient id="networkStroke" x1="0" x2="1"><stop offset="0" stop-color="#6c91b7" stop-opacity=".25"/><stop offset=".5" stop-color="#d7ad59" stop-opacity=".85"/><stop offset="1" stop-color="#6c91b7" stop-opacity=".25"/></linearGradient>
          </defs>
          <g fill="none" stroke="url(#networkStroke)" stroke-width="2">
            <path d="M500 320 C500 220 500 125 500 72"/><path d="M500 320 C360 265 275 190 185 125"/>
            <path d="M500 320 C650 250 745 170 825 125"/><path d="M500 320 C700 305 820 285 910 260"/>
            <path d="M500 320 C705 370 805 415 875 500"/><path d="M500 320 C590 450 620 510 640 575"/>
            <path d="M500 320 C420 455 390 525 360 580"/><path d="M500 320 C305 415 230 465 155 520"/>
            <path d="M500 320 C295 315 195 300 95 280"/><path d="M500 320 C355 215 325 155 300 92"/>
            <path d="M185 125 C330 120 420 150 500 205"/><path d="M825 125 C700 145 620 175 545 230"/>
            <path d="M95 280 C240 245 330 250 410 285"/><path d="M910 260 C770 250 680 265 590 295"/>
            <path d="M155 520 C290 485 375 445 430 385"/><path d="M875 500 C735 475 650 425 575 375"/>
          </g>
          <g fill="#d7ad59" opacity=".85">
            <circle cx="500" cy="205" r="5"/><circle cx="410" cy="285" r="4"/><circle cx="590" cy="295" r="4"/>
            <circle cx="430" cy="385" r="4"/><circle cx="575" cy="375" r="4"/><circle cx="360" cy="205" r="3"/>
            <circle cx="650" cy="205" r="3"/><circle cx="270" cy="420" r="3"/><circle cx="735" cy="430" r="3"/>
          </g>
        </svg>
        <div class="homeNetworkCore"><strong>Veyra</strong><small>Pilot Intelligence</small></div>
        <div class="homeNetworkNode n-lms"><b>LMS</b><span>Learning</span></div>
        <div class="homeNetworkNode n-instructor"><b>INS</b><span>Instructor Assistant</span></div>
        <div class="homeNetworkNode n-email"><b>@</b><span>E-mail</span></div>
        <div class="homeNetworkNode n-voa"><b>VOA</b><span>Data & Insights</span></div>
        <div class="homeNetworkNode n-training"><b>TC</b><span>Training Center</span></div>
        <div class="homeNetworkNode n-cbta"><b>CBT</b><span>CBTA / EBT</span></div>
        <div class="homeNetworkNode n-reports"><b>REP</b><span>Reportes</span></div>
        <div class="homeNetworkNode n-analytics"><b>ANA</b><span>Analytics</span></div>
        <div class="homeNetworkNode n-api"><b>API</b><span>Integraciones</span></div>
        <div class="homeNetworkNode n-app"><b>APP</b><span>App móvil</span></div>
      </div>
    </section>

    <section class="homePerformanceBanner" aria-label="Formación orientada al desempeño">
      <img src="assets/index-visuals/veyra-performance-banner.jpg" alt="Prepararse antes de ejecutar. Comprender antes de decidir. Formación orientada al desempeño." loading="lazy">
    </section>

    <section id="homeEnterprise" class="homeEnterprise" aria-label="Personalización empresarial">
      <div class="homeEnterpriseHead">
        <span class="homeEyebrow">Personalización empresarial</span>
        <h2>Personalizamos la plataforma para cada empresa.</h2>
        <p>Adaptamos Veyra a tus procesos, estándares, objetivos de entrenamiento y experiencia de marca.</p>
      </div>
      <div class="homeEnterpriseGrid">
        <article><div class="enterpriseMark">A</div><div><h3>Academias</h3><p>Forma a la próxima generación de pilotos con herramientas inteligentes, consistentes y escalables.</p></div></article>
        <article><div class="enterpriseMark">O</div><div><h3>Operadores Aéreos</h3><p>Estandariza, monitorea y mejora el rendimiento de tripulaciones y procesos de entrenamiento.</p></div></article>
        <article><div class="enterpriseMark">T</div><div><h3>Training Centers</h3><p>Digitaliza programas, centraliza información y maximiza la eficiencia de recursos y seguimiento.</p></div></article>
      </div>
    </section>

    <section class="homeTrust" aria-label="Sectores atendidos por Veyra">
      <div class="homeTrustTitle"><span class="homeEyebrow">Diseñado para la aviación que entrena</span><h2>Una plataforma preparada para crecer con tu operación.</h2></div>
      <div class="homeTrustRow" aria-label="Tipos de organizaciones">
        <span>Academias</span><span>Training Centers</span><span>Operadores</span><span>Instructores</span><span>Equipos de formación</span>
      </div>
      <p class="homeTrustLegal">Los logotipos de clientes y aliados se incorporarán únicamente cuando exista autorización de uso.</p>
    </section>

    <section class="homeFinalCta" aria-label="Solicitar demostración de Veyra">
      <div>
        <span class="homeEyebrow">El futuro del entrenamiento aeronáutico</span>
        <h2>Tecnología que impulsa personas, seguridad y oportunidades.</h2>
        <p>Conoce cómo Veyra puede adaptarse a los objetivos de tu organización.</p>
      </div>
      <button class="heroPrimary" type="button" onclick="showScreen('contact')">Solicitar demo <span>→</span></button>
    </section>
  </div>'''

text = text[:start] + home_block + text[end:]

css = r'''

/* === Veyra Homepage Enterprise v1 · 2026-09-10 === */
.homeEnterpriseV1{background:#f4efe5;color:#0b1421;margin:0 calc(50% - 50vw);width:100vw;overflow:hidden}
.homeEnterpriseV1 .homeStoryIntro{background:#f7f2e8}
.homeEnterpriseV1 .homeStoryCopy h2{font-family:Georgia,'Times New Roman',serif;font-weight:400;color:#0a1728;line-height:1.03;letter-spacing:-.045em}
.homeEnterpriseV1 .homeStoryCopy p{color:#596274;line-height:1.68}
.homePillars{background:radial-gradient(circle at 82% 10%,rgba(200,164,93,.08),transparent 28%),#06101b;color:#fff;padding:72px max(28px,calc((100vw - 1180px)/2));border-top:1px solid rgba(200,164,93,.26);border-bottom:1px solid rgba(200,164,93,.26)}
.homePillarsHead{display:grid;grid-template-columns:1.1fr .9fr;gap:70px;align-items:end;margin-bottom:32px}
.homePillarsHead h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(42px,4.2vw,66px);font-weight:400;line-height:.98;letter-spacing:-.045em;margin:0;color:#fff}
.homePillarsHead p{margin:0;color:#c4cad4;font-size:17px;line-height:1.65;max-width:540px}
.homePillarGrid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}
.homePillarCard{min-height:260px;border:1px solid rgba(200,164,93,.42);background:linear-gradient(145deg,rgba(255,255,255,.035),rgba(255,255,255,.015));padding:24px;display:flex;flex-direction:column;align-items:flex-start}
.homePillarIcon{width:48px;height:48px;border:1px solid #d7ad59;border-radius:50%;display:grid;place-items:center;color:#e7c77f;font:700 12px/1 Inter,sans-serif;letter-spacing:.08em;margin-bottom:22px}
.homePillarCard h3{font-family:Georgia,'Times New Roman',serif;font-size:29px;font-weight:400;margin:0 0 10px;color:#fff}
.homePillarCard p{margin:0;color:#c4cad4;font-size:14px;line-height:1.55;flex:1}
.homePillarCard button{margin-top:22px;padding:0;background:none;border:0;color:#d7ad59;text-transform:uppercase;letter-spacing:.12em;font-size:11px;font-weight:900;border-radius:0}
.homePillarCard button span{font-size:17px;margin-left:8px}
.homeEcosystem{background:radial-gradient(circle at 68% 46%,rgba(47,97,139,.20),transparent 34%),radial-gradient(circle at 62% 50%,rgba(200,164,93,.09),transparent 18%),linear-gradient(180deg,#06101b,#071421);color:#fff;padding:72px max(28px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:.76fr 1.24fr;gap:40px;align-items:center;overflow:hidden;position:relative}
.homeEcosystem:after{content:"";position:absolute;left:35%;right:-10%;bottom:-160px;height:300px;border-radius:50%;border-top:1px solid rgba(111,157,194,.25);box-shadow:0 -20px 80px rgba(50,111,159,.08)}
.homeEcosystemCopy{position:relative;z-index:2}
.homeEcosystemCopy h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(42px,4.5vw,64px);font-weight:400;line-height:1;letter-spacing:-.045em;margin:0 0 18px;color:#fff}
.homeEcosystemCopy p{color:#c6cdd8;font-size:16px;line-height:1.62;max-width:420px;margin:0 0 24px}
.homeOutlineCta{border:1px solid #d7ad59;background:transparent;color:#fff;border-radius:0;padding:14px 21px;text-transform:uppercase;letter-spacing:.09em;font-size:11px}
.homeNetworkMap{position:relative;min-height:560px;z-index:2}
.homeNetworkLines{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.homeNetworkCore{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:174px;height:174px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 45%,#122235,#07101b 72%);border:1.5px solid #d7ad59;box-shadow:0 0 0 10px rgba(215,173,89,.025),0 0 42px rgba(215,173,89,.26);z-index:3}
.homeNetworkCore strong{font-family:Georgia,'Times New Roman',serif;font-size:39px;font-weight:400}.homeNetworkCore small{color:#d7ad59;text-transform:uppercase;letter-spacing:.17em;font-size:8px;margin-top:5px}
.homeNetworkNode{position:absolute;width:100px;min-height:78px;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;z-index:4;color:#fff}
.homeNetworkNode b{width:48px;height:48px;border-radius:50%;display:grid;place-items:center;background:#0d1d2e;border:1px solid rgba(126,170,205,.8);box-shadow:0 0 20px rgba(79,140,186,.12);color:#f3e5bd;font-size:11px;letter-spacing:.04em}
.homeNetworkNode span{font-size:10px;line-height:1.15;color:#d7dde6;margin-top:7px;max-width:100px}
.n-lms{left:50%;top:9%}.n-instructor{left:19%;top:19%}.n-email{left:82%;top:18%}.n-voa{left:91%;top:41%}.n-training{left:87%;top:70%}.n-cbta{left:67%;top:90%}.n-reports{left:50%;top:94%}.n-analytics{left:31%;top:91%}.n-api{left:12%;top:72%}.n-app{left:8%;top:43%}
.homePerformanceBanner{background:#05070b;padding:0;line-height:0;border-top:1px solid rgba(200,164,93,.22);border-bottom:1px solid rgba(200,164,93,.22)}
.homePerformanceBanner img{display:block;width:100%;height:auto;max-height:520px;object-fit:cover}
.homeEnterprise{background:#f7f2e8;padding:70px max(28px,calc((100vw - 1180px)/2)) 54px}
.homeEnterpriseHead{max-width:850px;margin-bottom:30px}.homeEnterpriseHead h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(40px,4.2vw,60px);font-weight:400;letter-spacing:-.045em;line-height:1.02;margin:0 0 12px;color:#0a1728}.homeEnterpriseHead p{margin:0;color:#667080;font-size:16px;line-height:1.55}
.homeEnterpriseGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.homeEnterpriseGrid article{border:1px solid #ddd4c5;background:rgba(255,255,255,.48);padding:24px;display:grid;grid-template-columns:52px 1fr;gap:16px;align-items:start}.enterpriseMark{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;border:1px solid #c8a45d;color:#0a1728;font-family:Georgia,serif;font-size:20px}.homeEnterpriseGrid h3{margin:0 0 7px;color:#0a1728;font-size:17px}.homeEnterpriseGrid p{margin:0;color:#667080;font-size:13px;line-height:1.5}
.homeTrust{background:#fbf8f1;padding:42px max(28px,calc((100vw - 1180px)/2)) 36px;border-top:1px solid #e2dacd}.homeTrustTitle{display:grid;grid-template-columns:.8fr 1.2fr;gap:32px;align-items:end}.homeTrustTitle h2{font-family:Georgia,'Times New Roman',serif;font-size:31px;font-weight:400;line-height:1.05;color:#0a1728;margin:0}.homeTrustRow{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid #ded6c9;border-bottom:1px solid #ded6c9;margin-top:24px}.homeTrustRow span{padding:23px 12px;text-align:center;text-transform:uppercase;letter-spacing:.12em;color:#566170;font-size:11px;font-weight:800;border-right:1px solid #e4ddd1}.homeTrustRow span:last-child{border-right:0}.homeTrustLegal{font-size:11px;color:#8a8f97;margin:14px 0 0}
.homeFinalCta{min-height:270px;padding:58px max(28px,calc((100vw - 1180px)/2));display:grid;grid-template-columns:1fr auto;gap:36px;align-items:center;color:#fff;background:linear-gradient(90deg,rgba(5,10,18,.96) 0%,rgba(5,10,18,.76) 55%,rgba(5,10,18,.42) 100%),url('assets/index-visuals/index-visual-3.jpg') center 47%/cover no-repeat;border-top:1px solid rgba(200,164,93,.25)}
.homeFinalCta h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(38px,4.3vw,58px);font-weight:400;line-height:1.02;letter-spacing:-.04em;margin:0 0 10px;max-width:760px;color:#fff}.homeFinalCta p{color:#d4d9e1;font-size:15px;margin:0}.homeFinalCta .heroPrimary{white-space:nowrap}
.siteFooter{margin-top:0!important;background:#040910!important;padding:48px 28px 24px!important;text-align:left!important;border-top:1px solid rgba(200,164,93,.30)!important}.footerEnterprise{max-width:1180px;margin:0 auto;color:#d8dee7}.footerGridEnterprise{display:grid;grid-template-columns:1.4fr repeat(4,1fr);gap:28px}.footerBrandEnterprise h2{font-family:Georgia,'Times New Roman',serif;font-size:39px;font-weight:400;color:#fff;margin:0}.footerBrandEnterprise small{display:block;color:#d7ad59;text-transform:uppercase;letter-spacing:.19em;font-size:9px;margin:4px 0 14px}.footerBrandEnterprise p{color:#aeb7c4;font-size:13px;line-height:1.55;max-width:250px}.footerColumn h3{color:#f2e7cc;font-size:12px;text-transform:uppercase;letter-spacing:.09em;margin:0 0 13px}.footerColumn button,.footerColumn a{display:block;padding:4px 0;background:none;border:0;color:#aeb7c4;text-decoration:none;font-size:12px;text-align:left;border-radius:0;font-weight:500}.footerColumn button:hover,.footerColumn a:hover{color:#d7ad59}.footerBottomEnterprise{margin-top:34px;padding-top:18px;border-top:1px solid rgba(255,255,255,.09);display:flex;gap:20px;justify-content:space-between;flex-wrap:wrap;color:#7f8997;font-size:11px}.footerLegalLinks{display:flex;gap:18px;flex-wrap:wrap}.footerLegalLinks a{color:#929ba8;text-decoration:none}
@media(max-width:980px){.homePillarsHead,.homeEcosystem,.homeTrustTitle,.homeFinalCta{grid-template-columns:1fr}.homePillarGrid{grid-template-columns:1fr 1fr}.homeNetworkMap{min-height:520px}.homeEnterpriseGrid{grid-template-columns:1fr}.homeTrustRow{grid-template-columns:1fr 1fr}.homeTrustRow span{border-bottom:1px solid #e4ddd1}.footerGridEnterprise{grid-template-columns:1fr 1fr 1fr}.homeFinalCta .heroPrimary{justify-self:start}}
@media(max-width:680px){.homePillars{padding:50px 20px}.homePillarGrid{grid-template-columns:1fr}.homePillarCard{min-height:auto}.homeEcosystem{padding:52px 20px}.homeNetworkMap{min-height:470px;transform:scale(.9);transform-origin:center}.homeNetworkNode span{font-size:9px}.homeNetworkCore{width:145px;height:145px}.homeNetworkCore strong{font-size:32px}.homePerformanceBanner img{min-height:230px;object-fit:cover;object-position:center}.homeEnterprise{padding:48px 20px}.homeTrust{padding:36px 20px}.homeTrustRow{grid-template-columns:1fr}.homeTrustRow span{border-right:0}.homeFinalCta{padding:48px 20px}.footerGridEnterprise{grid-template-columns:1fr 1fr}.footerBrandEnterprise{grid-column:1/-1}.siteFooter{padding:40px 20px 22px!important}}
'''

style_close = text.rfind('</style>')
head_close = text.find('</head>', style_close)
if style_close < 0 or head_close < 0:
    raise SystemExit('Final style block was not found.')
text = text[:style_close] + css + '\n' + text[style_close:]

footer_start = text.find('<footer class="siteFooter">')
if footer_start < 0:
    raise SystemExit('Global footer start marker not found.')
footer_end = text.find('</footer>', footer_start)
if footer_end < 0:
    raise SystemExit('Global footer end marker not found.')
footer_end += len('</footer>')

footer = r'''<footer class="siteFooter">
  <div class="footerEnterprise">
    <div class="footerGridEnterprise">
      <div class="footerBrandEnterprise">
        <h2>Veyra</h2>
        <small>Pilot Intelligence</small>
        <p>Tecnología para un entrenamiento aeronáutico más seguro, eficiente y humano.</p>
      </div>
      <div class="footerColumn">
        <h3>Soluciones</h3>
        <button type="button" onclick="showAssessment()">Evaluación</button>
        <button type="button" onclick="showTrainingCenter()">Training Center</button>
        <a href="asistente-instructor-v3-8.html?v=3812">Instructor Assistant</a>
        <button type="button" onclick="showScreen('cbta')">CBTA / EBT</button>
      </div>
      <div class="footerColumn">
        <h3>Para quién</h3>
        <span>Academias</span><span>Training Centers</span><span>Operadores</span><span>Instructores</span>
      </div>
      <div class="footerColumn">
        <h3>Recursos</h3>
        <button type="button" onclick="showScreen('help')">Ayuda</button>
        <a href="privacidad-app.html">Privacidad</a>
        <a href="terminos-app.html">Términos</a>
      </div>
      <div class="footerColumn">
        <h3>Contacto</h3>
        <a href="mailto:veyrapilotintelligence@gmail.com">veyrapilotintelligence@gmail.com</a>
        <span>Bogotá, Colombia</span>
        <a href="https://veyrapilot.com/">veyrapilot.com</a>
      </div>
    </div>
    <div class="footerBottomEnterprise">
      <span>© 2026 Veyra Pilot Intelligence. Todos los derechos reservados.</span>
      <div class="footerLegalLinks"><a href="privacidad-app.html">Política de privacidad</a><a href="terminos-app.html">Términos de uso</a></div>
    </div>
  </div>
</footer>'''

text = text[:footer_start] + footer + text[footer_end:]
path.write_text(text, encoding='utf-8')
print('Homepage enterprise redesign applied.')
