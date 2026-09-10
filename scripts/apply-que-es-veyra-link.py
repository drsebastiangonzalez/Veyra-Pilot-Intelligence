from pathlib import Path
import re

text = Path('index.html').read_text(encoding='utf-8')
found = False
for m in re.finditer(r'conoc', text, re.I):
    found = True
    start = max(0, m.start() - 260)
    end = min(len(text), m.end() + 420)
    print('--- MATCH ---')
    print(text[start:end].replace('\n', ' '))

if not found:
    print('No CONOC* matches. Showing hero/demo/button contexts instead:')
    for term in ('Solicitar demo', 'demo', 'hero', 'Veyra'):
        print(f'=== {term} ===')
        count = 0
        for m in re.finditer(re.escape(term), text, re.I):
            start = max(0, m.start() - 220)
            end = min(len(text), m.end() + 360)
            print(text[start:end].replace('\n', ' '))
            count += 1
            if count >= 8:
                break
