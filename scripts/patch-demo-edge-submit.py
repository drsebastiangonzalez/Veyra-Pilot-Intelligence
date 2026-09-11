from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
needle = 'async function submitDemoRequest(event){'
start = text.find(needle)
if start < 0:
    raise SystemExit('submitDemoRequest not found')

# Find the matching closing brace for the function while respecting strings/templates/comments.
i = start + text[start:].find('{')
depth = 0
quote = None
escape = False
in_line_comment = False
in_block_comment = False
in_template = False
j = i
while j < len(text):
    ch = text[j]
    nxt = text[j+1] if j + 1 < len(text) else ''
    if in_line_comment:
        if ch == '\n': in_line_comment = False
        j += 1; continue
    if in_block_comment:
        if ch == '*' and nxt == '/': in_block_comment = False; j += 2; continue
        j += 1; continue
    if quote:
        if escape: escape = False
        elif ch == '\\': escape = True
        elif ch == quote: quote = None
        j += 1; continue
    if in_template:
        if escape: escape = False
        elif ch == '\\': escape = True
        elif ch == '`': in_template = False
        j += 1; continue
    if ch == '/' and nxt == '/': in_line_comment = True; j += 2; continue
    if ch == '/' and nxt == '*': in_block_comment = True; j += 2; continue
    if ch in ('"', "'"): quote = ch; j += 1; continue
    if ch == '`': in_template = True; j += 1; continue
    if ch == '{': depth += 1
    elif ch == '}':
        depth -= 1
        if depth == 0:
            end = j + 1
            break
    j += 1
else:
    raise SystemExit('Could not locate end of submitDemoRequest')

replacement = r'''async function submitDemoRequest(event){
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.getElementById('demoFormStatus');
  const btn = document.getElementById('demoSubmitBtn');
  if(form.website && form.website.value){ status.textContent='Solicitud recibida.'; form.reset(); return; }
  if(!form.reportValidity()) return;
  const payload = {
    first_name: form.first_name.value.trim(), last_name: form.last_name.value.trim(), email: form.email.value.trim(), phone: form.phone.value.trim(), company: form.company.value.trim(), organization_type: form.organization_type.value,
    role: form.role.value.trim() || null, organization_size: form.organization_size.value || null, message: form.message.value.trim(), consent: form.consent.checked, website: ''
  };
  btn.disabled = true; btn.textContent = 'Enviando…'; status.className='demoFormStatus'; status.textContent='';
  try{
    const response = await fetch(SUPABASE_URL + '/functions/v1/veyra-demo-request', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(payload)
    });
    const data = await response.json().catch(()=>({}));
    if(!response.ok) throw new Error(data.error || 'No se pudo registrar la solicitud.');
    status.className='demoFormStatus ok';
    status.textContent='Solicitud recibida. Gracias; revisaremos la información para coordinar la demo.';
    form.reset();
  }catch(error){
    console.error('Demo request error', error);
    status.className='demoFormStatus err';
    status.textContent='No pudimos enviar la solicitud en este momento. Intenta nuevamente en unos minutos.';
  }finally{
    btn.disabled=false;
    btn.innerHTML='Solicitar demo <span>→</span>';
  }
}'''

new_text = text[:start] + replacement + text[end:]
if new_text == text:
    raise SystemExit('No change applied')
path.write_text(new_text, encoding='utf-8')
print('submitDemoRequest now uses veyra-demo-request Edge Function')
