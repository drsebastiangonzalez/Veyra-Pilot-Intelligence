from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
old = '''<button class="heroSecondary" onclick="document.getElementById('homeMethod').scrollIntoView({behavior:'smooth'})">Conocer Veyra <span>→</span></button>'''
new = '''<button class="heroSecondary" onclick="window.location.href='/que-es-veyra.html'">Conocer Veyra <span>→</span></button>'''

if old not in text:
    raise SystemExit('No se encontró el botón Conocer Veyra esperado')

text = text.replace(old, new, 1)
path.write_text(text, encoding='utf-8')
print('Conocer Veyra conectado a /que-es-veyra.html')
