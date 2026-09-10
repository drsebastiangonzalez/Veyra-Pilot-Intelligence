from pathlib import Path
import re

path = Path('index.html')
text = path.read_text(encoding='utf-8')
original = text

# Anchor whose visible label is CONOCER VEYRA / Conocer Veyra.
anchor_pattern = re.compile(r'(<a\b[^>]*)(>\s*CONOCER\s+VEYRA\s*</a>)', re.I)

def anchor_repl(match):
    start = match.group(1)
    if re.search(r'\bhref\s*=\s*["\'][^"\']*["\']', start, re.I):
        start = re.sub(r'\bhref\s*=\s*(["\'])[^"\']*\1', 'href="/que-es-veyra.html"', start, flags=re.I)
    else:
        start += ' href="/que-es-veyra.html"'
    start = re.sub(r'\s+onclick\s*=\s*(["\']).*?\1', '', start, flags=re.I)
    return start + match.group(2)

text, anchor_count = anchor_pattern.subn(anchor_repl, text)

# Button whose visible label is CONOCER VEYRA / Conocer Veyra.
button_pattern = re.compile(r'(<button\b[^>]*)(>\s*CONOCER\s+VEYRA\s*</button>)', re.I)

def button_repl(match):
    start = re.sub(r'\s+onclick\s*=\s*(["\']).*?\1', '', match.group(1), flags=re.I)
    start += ' onclick="window.location.href=\'/que-es-veyra.html\'"'
    return start + match.group(2)

text, button_count = button_pattern.subn(button_repl, text)

if anchor_count + button_count == 0:
    raise SystemExit('No se encontró el control CONOCER VEYRA en index.html')

if text == original:
    raise SystemExit('El control se encontró pero no se produjo ningún cambio')

path.write_text(text, encoding='utf-8')
print(f'Updated CONOCER VEYRA controls: anchors={anchor_count}, buttons={button_count}')
