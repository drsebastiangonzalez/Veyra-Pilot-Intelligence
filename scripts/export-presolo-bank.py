from pathlib import Path
import re, json

text=Path('index.html').read_text(encoding='utf-8')
m=re.search(r'<script\s+id=["\']question-data["\'][^>]*>(.*?)</script>', text, re.S|re.I)
if not m:
    raise SystemExit('question-data not found')
rows=json.loads(m.group(1))
out=Path('tmp-presolo-bank'); out.mkdir(exist_ok=True)
for i in range(0,len(rows),10):
    part=rows[i:i+10]
    (out/f'part-{i//10+1:02d}.json').write_text(json.dumps(part,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('Exported',len(rows),'questions into',len(list(out.glob('*.json'))),'parts')
