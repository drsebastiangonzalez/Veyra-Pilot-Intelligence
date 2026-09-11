from pathlib import Path
import re, json, collections

text=Path('index.html').read_text(encoding='utf-8')
m=re.search(r'<script\s+id=["\']question-data["\'][^>]*>(.*?)</script>', text, re.S|re.I)
if not m:
    raise SystemExit('question-data not found')
rows=json.loads(m.group(1))
print('PRESOLO_COUNT=',len(rows))
print('PRESOLO_KEYS=',sorted(rows[0].keys()) if rows else [])
print('EVALUATIONS=',dict(collections.Counter(str(x.get('evaluation','')) for x in rows)))
print('CATEGORIES=',dict(collections.Counter(str(x.get('category','')) for x in rows)))
print('FIRST_ID=',rows[0].get('id') if rows else None,'LAST_ID=',rows[-1].get('id') if rows else None)

for needle in ['question-data','QUESTION_DATA','questionData','allQuestions','examQuestions','currentQuestions','startExam','finishExam','submitExam','exam_results']:
    positions=[x.start() for x in re.finditer(re.escape(needle),text,re.I)]
    if positions:
        print(f'=== {needle}: {len(positions)} occurrences ===')
        for i,pos in enumerate(positions[:12],1):
            print(f'--- {needle} CONTEXT {i} ---')
            print(text[max(0,pos-500):min(len(text),pos+850)].replace('\n',' '))
