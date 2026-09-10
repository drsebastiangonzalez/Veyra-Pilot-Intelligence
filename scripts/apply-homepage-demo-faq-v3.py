from pathlib import Path
import re

path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = '/* === Veyra Homepage Demo+FAQ v3 · 2026-09-10 === */'
if marker in text:
    print('Homepage demo+FAQ v3 already applied.')
    raise SystemExit(0)

tech_pattern = re.compile(r'<section class="homeTechStack" aria-label="Ecosistema tecnológico Veyra">.*?</section>', re.S)
tech_replacement = '''<section class="homeTechStack homeTechStackLogos" aria-label="Ecosistema tecnológico Veyra">
      <div class="homeTechHead">
        <span class="homeEyebrow">Ecosistema tecnológico</span>
        <h2>Conectado con las herramientas que forman parte de tu flujo.</h2>
        <p>Integraciones activas y compatibilidades se habilitan según el proyecto, los permisos del cliente y las políticas de cada proveedor. La presencia de una marca no implica alianza comercial.</p>
      </div>
      <div class="homeTechViewport" aria-label="Tecnologías e integraciones">
        <div class="homeTechTrack homeTechLogoTrack">
          <span class="techLogo"><img src="https://cdn.simpleicons.org/github/0F172A" alt="GitHub"><small>GitHub</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt="Supabase"><small>Supabase</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/whatsapp/25D366" alt="WhatsApp Business"><small>WhatsApp Business</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/meta/0866FF" alt="Meta"><small>Meta</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/openai/0F172A" alt="OpenAI"><small>OpenAI</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/anthropic/191919" alt="Claude by Anthropic"><small>Claude</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/googledrive/4285F4" alt="Google Drive"><small>Google Drive</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/gmail/EA4335" alt="Gmail"><small>Gmail</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/microsoftoutlook/0078D4" alt="Microsoft Outlook"><small>Outlook</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/googlecalendar/4285F4" alt="Google Calendar"><small>Google Calendar</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/apple/111827" alt="Apple iOS"><small>Apple iOS</small></span>
          <span class="techLogo"><img src="https://cdn.simpleicons.org/resend/111827" alt="Resend"><small>Resend</small></span>
          <span class="techLogo" aria-hidden="true"><img src="https://cdn.simpleicons.org/github/0F172A" alt=""><small>GitHub</small></span>
          <span class="techLogo" aria-hidden="true"><img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt=""><small>Supabase</small></span>
          <span class="techLogo" aria-hidden="true"><img src="https://cdn.simpleicons.org/whatsapp/25D366" alt=""><small>WhatsApp Business</small></span>
          <span class="techLogo" aria-hidden="true"><img src="https://cdn.simpleicons.org/meta/0866FF" alt=""><small>Meta</small></span>
          <span class="techLogo" aria-hidden="true"><img src="https://cdn.simpleicons.org/openai/0F172A" alt=""><small>OpenAI</small></span>
          <span class="techLogo" aria-hidden="true"><img src="https://cdn.simpleicons.org/anthropic/191919" alt=""><small>Claude</small></span>
        </div>
      </div>
    </section>'''
text, n = tech_pattern.subn(tech_replacement, text, count=1)
if n != 1:
    raise SystemExit('Could not replace technology section')

faq_block = '''
    <section id="homeFaq" class="homeFaq" aria-label="Preguntas frecuentes">
      <div class="homeFaqHead">
        <span class="homeEyebrow">Preguntas frecuentes</span>
        <h2>¿Tienes preguntas?<br>Tenemos respuestas.</h2>
        <p>Respuestas claras sobre evaluación, entrenamiento, Instructor Assistant, analítica, personalización e implementación.</p>
      </div>
      <div class="homeFaqGrid">
        <details open><summary>¿Qué tipo de evaluaciones se pueden gestionar en Veyra?</summary><p>La plataforma puede estructurar procesos como Pre-Solo, PPA, PCA, evaluaciones de simulador y otros instrumentos definidos por cada organización.</p></details>
        <details><summary>¿Se puede hacer seguimiento individual del progreso?</summary><p>Sí. Veyra puede organizar historial de sesiones, resultados, fortalezas, áreas por mejorar, competencias observadas y evolución en el tiempo.</p></details>
        <details><summary>¿Cómo apoya Veyra al instructor?</summary><p>Instructor Assistant ayuda a preparar la sesión, registrar evidencia, estructurar observaciones y organizar la retroalimentación sin sustituir el criterio profesional del instructor.</p></details>
        <details><summary>¿La plataforma ayuda a estandarizar criterios?</summary><p>Sí. Formularios, competencias, comportamientos observables y estructuras de retroalimentación configurables ayudan a mantener un marco común entre instructores y programas.</p></details>
        <details><summary>¿Qué tipo de analítica puede mostrar Veyra?</summary><p>Puede consolidar tendencias por piloto, competencia, misión, evaluación o grupo, facilitando la identificación de fortalezas, brechas y prioridades de entrenamiento.</p></details>
        <details><summary>¿Veyra puede adaptarse a la operación de mi empresa?</summary><p>Sí. La experiencia visual, módulos, permisos, reportes, flujos y contenidos pueden configurarse según los objetivos, estándares y procesos autorizados de cada organización.</p></details>
        <details><summary>¿Veyra se integra con otras herramientas?</summary><p>Sí, según el alcance del proyecto y los permisos disponibles. Las integraciones pueden incluir autenticación, mensajería, correo, almacenamiento, automatización, calendarios y servicios de datos.</p></details>
        <details><summary>¿Todas las funciones trabajan sin conexión?</summary><p>No necesariamente. Algunos componentes pueden conservar continuidad local o recuperación posterior, pero la disponibilidad offline depende del módulo y de la implementación específica.</p></details>
        <details><summary>¿Cómo se protege la información?</summary><p>Veyra utiliza autenticación, políticas de acceso, separación de datos confidenciales y controles de seguridad en su infraestructura. Los permisos se definen según usuario, módulo y proyecto.</p></details>
        <details><summary>¿Cuánto tarda una implementación?</summary><p>Depende del alcance, número de módulos, integraciones y nivel de personalización. La demo inicial permite definir necesidades antes de establecer un plan de implementación.</p></details>
      </div>
      <div class="homeFaqContact">
        <div><span class="homeEyebrow">¿No encontraste la respuesta?</span><h3>Conversemos sobre tu operación.</h3><p>Cuéntanos qué necesitas y te mostramos cómo Veyra puede adaptarse a tu organización.</p></div>
        <button type="button" class="heroPrimary" onclick="showScreen('contact')">Contáctanos <span>→</span></button>
      </div>
    </section>
'''
needle = '    <section class="homeFinalCta" aria-label="Solicitar demostración de Veyra">'
if needle not in text:
    raise SystemExit('Could not locate final CTA')
text = text.replace(needle, faq_block + '\n' + needle, 1)

contact_pattern = re.compile(r'<section id="contact" class="screen">.*?</section>\s*<section id="exam"', re.S)
contact_replacement = '''<section id="contact" class="screen demoScreen">
  <div class="demoRequestWrap">
    <div class="demoRequestIntro">
      <span class="homeEyebrow">Solicitar demo</span>
      <h1>Conoce cómo Veyra puede adaptarse a tu operación.</h1>
      <p>Cuéntanos sobre tu organización y tus objetivos de entrenamiento. Revisaremos la solicitud para preparar una demostración enfocada en tus necesidades.</p>
      <div class="demoRequestPoints"><span>Evaluación y seguimiento</span><span>Instructor Assistant</span><span>Training Center</span><span>Analítica y reportes</span><span>VOA y automatización</span><span>Personalización empresarial</span></div>
      <div class="demoMotif" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    </div>
    <form id="demoRequestForm" class="demoRequestForm" onsubmit="submitDemoRequest(event)">
      <div class="demoFormHeader"><h2>Solicita una demo de Veyra</h2><p>Te contactaremos para coordinar la demostración.</p></div>
      <div class="demoFormGrid">
        <label>Nombre *<input name="first_name" autocomplete="given-name" maxlength="80" required></label>
        <label>Apellido *<input name="last_name" autocomplete="family-name" maxlength="80" required></label>
        <label>Correo corporativo *<input name="email" type="email" autocomplete="email" maxlength="180" required></label>
        <label>Teléfono *<input name="phone" type="tel" autocomplete="tel" maxlength="40" required></label>
        <label class="wide">Empresa / Organización *<input name="company" autocomplete="organization" maxlength="160" required></label>
        <label>Tipo de organización *<select name="organization_type" required><option value="">Selecciona</option><option value="academia">Academia</option><option value="training_center">Training Center</option><option value="operador_aereo">Operador aéreo</option><option value="aerolinea">Aerolínea</option><option value="instructor">Instructor independiente</option><option value="otro">Otro</option></select></label>
        <label>Cargo / Rol<input name="role" autocomplete="organization-title" maxlength="120"></label>
        <label class="wide">Tamaño aproximado<select name="organization_size"><option value="">Selecciona una opción</option><option>1–25 personas</option><option>26–100 personas</option><option>101–500 personas</option><option>Más de 500 personas</option></select></label>
        <label class="wide">¿Qué te gustaría resolver con Veyra? *<textarea name="message" minlength="10" maxlength="3000" required placeholder="Cuéntanos brevemente sobre tu operación, entrenamiento o necesidad."></textarea></label>
        <label class="demoHoneypot" aria-hidden="true">Sitio web<input name="website" tabindex="-1" autocomplete="off"></label>
      </div>
      <label class="demoConsent"><input name="consent" type="checkbox" required> <span>Acepto el tratamiento de mis datos para gestionar esta solicitud de acuerdo con la política de privacidad.</span></label>
      <button id="demoSubmitBtn" class="demoSubmit" type="submit">Solicitar demo <span>→</span></button>
      <div id="demoFormStatus" class="demoFormStatus" role="status" aria-live="polite"></div>
    </form>
  </div>
</section>
<section id="exam"'''
text, n = contact_pattern.subn(contact_replacement, text, count=1)
if n != 1:
    raise SystemExit('Could not replace contact section')

css = r'''
/* === Veyra Homepage Demo+FAQ v3 · 2026-09-10 === */
.homeTechStackLogos .homeTechTrack{gap:18px}.homeTechLogoTrack{align-items:stretch}.techLogo{min-width:190px!important;height:128px;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:13px;background:#fff;border:1px solid #e3ded4;padding:20px!important}.techLogo img{width:48px;height:48px;object-fit:contain;display:block}.techLogo small{font-size:12px!important;color:#273447!important;text-transform:none!important;letter-spacing:.02em!important;font-weight:800}
.homeFaq{background:#f8f7f4;padding:76px max(28px,calc((100vw - 1120px)/2));border-top:1px solid #e2ddd3}.homeFaqHead{text-align:center;max-width:800px;margin:0 auto 44px}.homeFaqHead h2{font-family:Georgia,'Times New Roman',serif;font-size:clamp(42px,5vw,67px);font-weight:400;line-height:1.02;letter-spacing:-.045em;margin:10px 0 18px;color:#102033}.homeFaqHead p{color:#657184;font-size:16px;line-height:1.6;margin:0 auto;max-width:680px}.homeFaqGrid{border-top:1px solid #d9d7d1}.homeFaqGrid details{border-bottom:1px solid #d9d7d1;padding:0}.homeFaqGrid summary{list-style:none;cursor:pointer;padding:25px 54px 25px 0;position:relative;font-size:17px;font-weight:850;color:#192536}.homeFaqGrid summary::-webkit-details-marker{display:none}.homeFaqGrid summary:after{content:'+';position:absolute;right:8px;top:18px;width:30px;height:30px;border:1px solid #89919c;border-radius:50%;display:grid;place-items:center;font-size:22px;font-weight:400}.homeFaqGrid details[open] summary:after{content:'−'}.homeFaqGrid details p{margin:-4px 54px 24px 0;color:#59677a;line-height:1.65;font-size:15px;max-width:920px}.homeFaqContact{margin-top:54px;background:linear-gradient(135deg,#09111d,#102437);color:#fff;padding:38px 42px;border:1px solid rgba(200,164,93,.28);display:flex;align-items:center;justify-content:space-between;gap:30px}.homeFaqContact h3{font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:400;margin:4px 0 8px}.homeFaqContact p{margin:0;color:#c5ccd6;max-width:600px;line-height:1.55}
.demoScreen{background:#f7f7f5!important;margin:-36px -22px -64px!important;padding:62px max(28px,calc((100vw - 1160px)/2)) 84px!important}.demoRequestWrap{display:grid;grid-template-columns:.92fr 1.08fr;gap:54px;align-items:start}.demoRequestIntro{position:sticky;top:145px;padding-top:24px}.demoRequestIntro h1{font-family:Georgia,'Times New Roman',serif;font-size:clamp(45px,5.2vw,72px);font-weight:400;line-height:.98;letter-spacing:-.05em;margin:10px 0 24px;color:#102033}.demoRequestIntro>p{font-size:17px;line-height:1.68;color:#606c7b;max-width:520px}.demoRequestPoints{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:30px}.demoRequestPoints span{border-top:1px solid #d7d1c4;padding:12px 0;color:#263447;font-size:13px;font-weight:800}.demoMotif{margin-top:42px;display:flex;gap:0;align-items:center}.demoMotif i{display:block;width:56px;height:56px;border-radius:50%;margin-left:-12px;background:#c8a45d;opacity:.22}.demoMotif i:nth-child(2){opacity:.4}.demoMotif i:nth-child(3){opacity:.62}.demoMotif i:nth-child(4){opacity:.9}.demoRequestForm{background:#fff;border:1px solid #ded9cf;padding:34px;box-shadow:0 22px 54px rgba(20,31,45,.07)}.demoFormHeader h2{font-family:Georgia,'Times New Roman',serif;font-size:35px;font-weight:400;color:#102033;margin:0 0 7px}.demoFormHeader p{margin:0 0 26px;color:#6a7483}.demoFormGrid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.demoFormGrid label{font-size:13px;color:#263447}.demoFormGrid .wide{grid-column:1/-1}.demoFormGrid input,.demoFormGrid select,.demoFormGrid textarea{border-radius:0;margin-top:8px;padding:14px 13px;border:1px solid #d8d7d2;background:#fff;font-size:15px;font-family:inherit}.demoFormGrid textarea{width:100%;min-height:145px;resize:vertical}.demoHoneypot{position:absolute!important;left:-9999px!important}.demoConsent{display:flex!important;gap:10px;align-items:flex-start;margin-top:20px;font-size:13px!important;font-weight:600!important;line-height:1.45;color:#5e6876!important}.demoConsent input{width:auto!important;margin:2px 0 0!important}.demoSubmit{width:100%;margin-top:20px;border-radius:0;background:linear-gradient(135deg,#cda75c,#e3bd6b);color:#111827;padding:16px 18px;text-transform:uppercase;letter-spacing:.08em;font-size:12px}.demoFormStatus{margin-top:14px;min-height:22px;font-size:14px;font-weight:700}.demoFormStatus.ok{color:#047857}.demoFormStatus.err{color:#b42318}
@media(max-width:900px){.demoRequestWrap{grid-template-columns:1fr}.demoRequestIntro{position:static;padding-top:0}.demoFormGrid{grid-template-columns:1fr}.demoFormGrid .wide{grid-column:auto}.homeFaqContact{flex-direction:column;align-items:flex-start}.techLogo{min-width:160px!important}.homeFaq{padding-left:22px;padding-right:22px}}
'''
text = text.replace('</style>', css + '\n</style>', 1)

js = r'''
<script>
async function submitDemoRequest(event){
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('demoFormStatus');
  const btn = document.getElementById('demoSubmitBtn');
  if(form.website && form.website.value){ status.textContent='Solicitud recibida.'; form.reset(); return; }
  if(!form.reportValidity()) return;
  const payload = {
    first_name: form.first_name.value.trim(), last_name: form.last_name.value.trim(), email: form.email.value.trim(), phone: form.phone.value.trim(), company: form.company.value.trim(), organization_type: form.organization_type.value,
    role: form.role.value.trim() || null, organization_size: form.organization_size.value || null, message: form.message.value.trim(), consent: form.consent.checked, source: 'website', status: 'new'
  };
  btn.disabled = true; btn.textContent = 'Enviando…'; status.className='demoFormStatus'; status.textContent='';
  try{
    const response = await fetch(SUPABASE_URL + '/rest/v1/veyra_demo_requests', {method:'POST',headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify(payload)});
    if(!response.ok) throw new Error('No se pudo registrar la solicitud.');
    status.className='demoFormStatus ok'; status.textContent='Solicitud recibida. Gracias; revisaremos la información para coordinar la demo.'; form.reset();
  }catch(error){
    console.error('Demo request error', error); status.className='demoFormStatus err'; status.textContent='No pudimos enviar la solicitud en este momento. Intenta nuevamente en unos minutos.';
  }finally{btn.disabled=false; btn.innerHTML='Solicitar demo <span>→</span>';}
}
</script>
'''
text = text.replace('</body>', js + '\n</body>', 1)

required = ['homeTechStackLogos','cdn.simpleicons.org/github','id="homeFaq"','id="demoRequestForm"','submitDemoRequest(event)','veyra_demo_requests','¿No encontraste la respuesta?']
missing=[x for x in required if x not in text]
if missing: raise SystemExit('Validation failed: '+', '.join(missing))
path.write_text(text, encoding='utf-8')
print('Homepage demo+FAQ v3 applied and validated.')
