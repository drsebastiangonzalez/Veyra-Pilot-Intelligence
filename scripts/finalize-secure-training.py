from pathlib import Path
import re

p=Path('index.html')
text=p.read_text(encoding='utf-8')
original=text

# Remove the embedded Pre-Solo answer bank while preserving the JSON node expected by legacy code.
text,n=re.subn(r'(<script\s+id=["\']question-data["\'][^>]*>).*?(</script>)',r'\1[]\2',text,count=1,flags=re.S|re.I)
if n!=1: raise SystemExit('question-data block not found')

# Remove the embedded PPA Training Center bank.
text,n=re.subn(r'const VEYRA_TRAINING_BANK\s*=\s*\[.*?\];','const VEYRA_TRAINING_BANK = [];',text,count=1,flags=re.S)
if n!=1: raise SystemExit('VEYRA_TRAINING_BANK assignment not found')

# Remove the legacy public dashboard password.
text,n=re.subn(r"const DASHBOARD_PASSWORD\s*=\s*['\"][^'\"]*['\"];","const DASHBOARD_PASSWORD = '';",text,count=1)
if n!=1: raise SystemExit('DASHBOARD_PASSWORD not found')

# Load the secure adapters only after the existing legacy script is parsed, so their global overrides win.
marker='<script src="assets/js/secure-presolo-exam.js?v=1"></script>'
if marker not in text:
    text=text.replace('</body>',marker+'\n</body>',1)

if 'PPA-AER-001' in text: raise SystemExit('Embedded PPA bank still present')
if '"correct": "C"' in re.search(r'<script\s+id=["\']question-data["\'][^>]*>(.*?)</script>',text,re.S|re.I).group(1): raise SystemExit('Pre-Solo answers still embedded')
if 'VEYRA2026' in text: raise SystemExit('Legacy dashboard password still present')
if text==original: raise SystemExit('No index changes')
p.write_text(text,encoding='utf-8')

# Disable the obsolete direct-Supabase test page; the real secure PPA practice is ppa-practice.html.
Path('ppa-supabase-test.html').write_text('''<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0;url=ppa-practice.html"><title>Veyra · PPA</title></head><body><p>Redirigiendo al simulacro PPA seguro… <a href="ppa-practice.html">Continuar</a></p></body></html>''',encoding='utf-8')
print('Final secure training patch applied')
