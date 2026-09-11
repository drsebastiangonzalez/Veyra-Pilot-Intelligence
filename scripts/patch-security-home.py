from pathlib import Path

p = Path('index.html')
s = p.read_text(encoding='utf-8')

org_anchor = '<a href="voa.html">VOA</a>\n          <a href="#demo" onclick="showScreen(\'contact\');return false;">Solicitar demo</a>'
org_replacement = '<a href="voa.html">VOA</a>\n          <a href="seguridad-gobernanza-ia.html">Seguridad & IA</a>\n          <a href="#demo" onclick="showScreen(\'contact\');return false;">Solicitar demo</a>'
if org_anchor not in s:
    raise SystemExit('Organization audience links anchor not found')
s = s.replace(org_anchor, org_replacement, 1)

faq_old = '<details><summary>¿Cómo se protege la información?</summary><p>Veyra utiliza autenticación, políticas de acceso, separación de datos confidenciales y controles de seguridad en su infraestructura. Los permisos se definen según usuario, módulo y proyecto.</p></details>'
faq_new = '<details><summary>¿Cómo se protege la información?</summary><p>Veyra utiliza autenticación, políticas de acceso, separación de datos confidenciales y controles de seguridad en su infraestructura. Los permisos se definen según usuario, módulo y proyecto. <a href="seguridad-gobernanza-ia.html">Conoce nuestros principios de seguridad, gobernanza e IA responsable →</a></p></details>'
if faq_old not in s:
    raise SystemExit('Security FAQ anchor not found')
s = s.replace(faq_old, faq_new, 1)

if s.count('seguridad-gobernanza-ia.html') < 2:
    raise SystemExit('Expected homepage security links missing')

p.write_text(s, encoding='utf-8')
print('Homepage security links patched successfully.')
