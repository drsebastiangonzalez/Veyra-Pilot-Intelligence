from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
tag = '<script src="assets/js/veyra-en-operacion.js?v=1" defer></script>'
if tag not in text:
    text = text.replace('</body>', tag + '\n</body>', 1)
    path.write_text(text, encoding='utf-8')
