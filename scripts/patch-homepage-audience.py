from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

css_marker = '/* === Veyra Audience Paths v1 · 2026-09-11 === */'
if css_marker not in s:
    css = r'''

/* === Veyra Audience Paths v1 · 2026-09-11 === */
.homeAudiencePaths{margin:0 calc(50% - 50vw);background:#f2ede3;color:#0a1728;padding:64px max(28px,calc((100vw - 1180px)/2));border-top:1px solid #ded5c7;border-bottom:1px solid #ded5c7}
.homeAudienceIntro{text-align:center;max-width:830px;margin:0 auto 34px}.homeAudienceIntro .homeEyebrow{justify-content:center}.homeAudienceIntro h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(38px,4.5vw,60px);font-weight:400;line-height:1.04;letter-spacing:-.04em;margin:0 0 13px;color:#0a1728}.homeAudienceIntro p{margin:0;color:#657080;font-size:16px;line-height:1.6}
.homeAudienceGrid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.homeAudienceCard{border:1px solid #d8cfbf;background:#fffaf2;padding:32px;min-height:270px;display:flex;flex-direction:column;justify-content:space-between}.homeAudienceCard.org{background:linear-gradient(145deg,#08111c,#102235);border-color:rgba(200,164,93,.34);color:#fff}.homeAudienceLabel{display:inline-flex;align-items:center;gap:9px;color:#987029;text-transform:uppercase;letter-spacing:.14em;font-size:11px;font-weight:900}.homeAudienceCard.org .homeAudienceLabel{color:#d7ad59}.homeAudienceLabel:before{content:'';width:28px;height:1px;background:currentColor}.homeAudienceCard h3{font-family:Georgia,'Times New Roman',serif;font-size:clamp(30px,3vw,42px);font-weight:400;line-height:1.05;letter-spacing:-.035em;margin:20px 0 12px;color:#0a1728}.homeAudienceCard.org h3{color:#fff}.homeAudienceCard p{color:#667080;line-height:1.6;margin:0;max-width:490px}.homeAudienceCard.org p{color:#b8c1cd}.homeAudienceLinks{display:flex;gap:9px;flex-wrap:wrap;margin-top:28px}.homeAudienceLinks a{display:inline-flex;align-items:center;min-height:40px;padding:10px 13px;border:1px solid #d8cfbf;color:#263447;text-decoration:none;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.07em;background:#fff}.homeAudienceLinks a:hover,.homeAudienceLinks a:focus{border-color:#c8a45d;color:#8d6725;outline:none}.homeAudienceCard.org .homeAudienceLinks a{border-color:rgba(200,164,93,.36);background:rgba(255,255,255,.035);color:#e7dcc5}.homeAudienceCard.org .homeAudienceLinks a:hover,.homeAudienceCard.org .homeAudienceLinks a:focus{border-color:#d7ad59;color:#f0d58e}
.homeCapabilitiesFoot{margin-top:-18px;border-top:1px solid #ded6ca;padding-top:30px;display:flex;justify-content:space-between;align-items:center;gap:28px}.homeCapabilitiesFoot p{margin:0;color:#687181;line-height:1.55;max-width:680px;font-size:14px}.homeCapabilityDemoLink{color:#8f6826;text-decoration:none;font-weight:900;font-size:11px;text-transform:uppercase;letter-spacing:.1em;white-space:nowrap;border-bottom:1px solid #c8a45d;padding-bottom:5px}
@media(max-width:820px){.homeAudienceGrid{grid-template-columns:1fr}.homeAudienceCard{min-height:auto}.homeCapabilitiesFoot{align-items:flex-start;flex-direction:column}.homeCapabilityDemoLink{white-space:normal}}
@media(max-width:560px){.homeAudiencePaths{padding:52px 20px}.homeAudienceCard{padding:25px}.homeAudienceLinks{display:grid}.homeAudienceLinks a{justify-content:center}}
'''
    pos = s.rfind('</style>')
    if pos < 0:
        raise SystemExit('Closing style tag not found')
    s = s[:pos] + css + '\n' + s[pos:]

hero_anchor = '''        <div class="microTagline">Precision. Readiness. Pilot Intelligence.</div>
      </div>
    </div>
  </div>

  <div class="veyraHomeStory homeEnterpriseV1">'''
audience = '''        <div class="microTagline">Precision. Readiness. Pilot Intelligence.</div>
      </div>
    </div>
  </div>

  <section class="homeAudiencePaths" aria-labelledby="homeAudienceTitle">
    <div class="homeAudienceIntro">
      <span class="homeEyebrow">Elige tu ruta</span>
      <h2 id="homeAudienceTitle">Veyra se adapta a quién entrena y a quién gestiona el entrenamiento.</h2>
      <p>Accede directamente a las soluciones que responden a tu rol, sin recorrer toda la plataforma para encontrar lo que necesitas.</p>
    </div>
    <div class="homeAudienceGrid">
      <article class="homeAudienceCard">
        <div>
          <span class="homeAudienceLabel">Pilotos e instructores</span>
          <h3>Prepárate, evalúate y entiende tu progreso.</h3>
          <p>Formación, práctica, evaluaciones y evidencia para llegar mejor preparado a cada fase y aprovechar mejor el tiempo con el instructor.</p>
        </div>
        <div class="homeAudienceLinks">
          <a href="training-center.html">Training Center</a>
          <a href="evaluacion-evidencia.html">Evaluación & Evidencia</a>
          <a href="instructor-assistant.html">Instructor Assistant</a>
        </div>
      </article>
      <article class="homeAudienceCard org">
        <div>
          <span class="homeAudienceLabel">Organizaciones</span>
          <h3>Convierte entrenamiento disperso en información accionable.</h3>
          <p>Observación estructurada, analítica, coordinación operativa y personalización para academias, operadores y Training Centers.</p>
        </div>
        <div class="homeAudienceLinks">
          <a href="instructor-assistant.html">Instructor Assistant</a>
          <a href="analytics.html">Analytics</a>
          <a href="voa.html">VOA</a>
          <a href="#demo" onclick="showScreen('contact');return false;">Solicitar demo</a>
        </div>
      </article>
    </div>
  </section>

  <div class="veyraHomeStory homeEnterpriseV1">'''
if 'homeAudiencePaths' not in s:
    if hero_anchor not in s:
        raise SystemExit('Hero insertion anchor not found')
    s = s.replace(hero_anchor, audience, 1)

s = s.replace('<h2>Descubre todo lo que Veyra puede hacer</h2>', '<h2>Una plataforma. Cinco soluciones conectadas.</h2>', 1)
s = s.replace('<p>Una misma plataforma para evaluar, entrenar, registrar evidencia, automatizar tareas y convertir datos en decisiones de entrenamiento.</p>', '<p>Explora cada solución por separado y entra únicamente al flujo que responde a tu necesidad.</p>', 1)

old_eval = '<button type="button" class="homeCapabilityCard" data-cap-open="cap-records"><span>02</span><h3>Evaluación & Evidencia</h3><p>Resultados, historial y trazabilidad del proceso formativo.</p><b>Explorar →</b></button>'
new_eval = '<a class="homeCapabilityCard" href="evaluacion-evidencia.html"><span>02</span><h3>Evaluación & Evidencia</h3><p>Resultados, historial y trazabilidad del proceso formativo.</p><b>Conocer solución →</b></a>'
if old_eval in s:
    s = s.replace(old_eval, new_eval, 1)
elif 'href="evaluacion-evidencia.html"' not in s:
    raise SystemExit('Evaluation capability card not found')

explorer_start = s.find('      <div class="homeCapabilityExplorer" aria-label="Explorador de módulos Veyra">')
tech_marker = '    <section class="homeTechStack homeTechStackLogos"'
if explorer_start >= 0:
    tech_start = s.find(tech_marker, explorer_start)
    if tech_start < 0:
        raise SystemExit('Technology section marker not found after explorer')
    compact = '''      <div class="homeCapabilitiesFoot">
        <p>¿No sabes qué módulo necesitas? Cuéntanos cómo entrenas hoy y te mostramos una configuración Veyra adecuada para tu operación.</p>
        <a class="homeCapabilityDemoLink" href="#demo" onclick="showScreen('contact');return false;">Hablar con Veyra →</a>
      </div>
    </section>

'''
    s = s[:explorer_start] + compact + s[tech_start:]

script_start_marker = "\n<script>\n(() => {\n  const catalog = document.getElementById('homeCapabilities');"
script_start = s.find(script_start_marker)
if script_start >= 0:
    script_end = s.find('})();\n</script>', script_start)
    if script_end < 0:
        raise SystemExit('Capability explorer script end not found')
    script_end += len('})();\n</script>')
    s = s[:script_start] + s[script_end:]

checks = {
    'audience section': 'class="homeAudiencePaths"',
    'pilot route': 'Pilotos e instructores',
    'organization route': 'Organizaciones',
    'evaluation page link': 'href="evaluacion-evidencia.html"',
    'compact capabilities footer': 'class="homeCapabilitiesFoot"',
}
for label, token in checks.items():
    if token not in s:
        raise SystemExit(f'Missing {label}')
if 'aria-label="Explorador de módulos Veyra"' in s:
    raise SystemExit('Old capability explorer still present')

p.write_text(s, encoding='utf-8')
print('Homepage audience architecture patched successfully.')
