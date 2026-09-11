from pathlib import Path
import re

for filename, license_code, timer_key in [
    ('ppa-practice.html','PPA','veyra_ppa_practice_timer'),
    ('pca-practice.html','PCA','veyra_pca_practice_timer'),
]:
    path=Path(filename)
    text=path.read_text(encoding='utf-8')
    original=text

    # Remove the legacy publishable-key constant from these practice pages.
    text=re.sub(r'^const SUPABASE_KEY\s*=\s*"[^"]*";\s*\n', '', text, flags=re.M)

    # Remove the legacy direct question-bank fetch that requested correct answers/explanations.
    pattern=r'async function fetchQuestions\(\)\{.*?\n\}\n\nfunction shuffle\(arr\)\{'
    repl='async function fetchQuestions(){ return []; }\n\nfunction shuffle(arr){'
    text,count=re.subn(pattern,repl,text,count=1,flags=re.S)
    if count!=1:
        raise SystemExit(f'{filename}: no se encontró fetchQuestions legacy')

    # Prevent the legacy init from making any bank request and install the secure adapter instead.
    install=(
        "</script>\n"
        "<script src=\"assets/js/secure-training-practice.js?v=1\"></script>\n"
        f"<script>VeyraSecurePractice.install({{license:'{license_code}',timerKey:'{timer_key}'}});</script>"
    )
    text,count=re.subn(r'init\(\);\s*</script>', install, text, count=1)
    if count!=1:
        raise SystemExit(f'{filename}: no se encontró init final')

    if text==original:
        raise SystemExit(f'{filename}: no se produjeron cambios')
    path.write_text(text,encoding='utf-8')
    print(f'Patched {filename}')

# Diagnostics only: show where the embedded bank is referenced before we remove it.
idx=Path('index.html').read_text(encoding='utf-8')
needle='VEYRA_TRAINING_BANK'
positions=[m.start() for m in re.finditer(needle,idx)]
print(f'INDEX_OCCURRENCES={len(positions)}')
for i,pos in enumerate(positions[:20],1):
    start=max(0,pos-450); end=min(len(idx),pos+650)
    print(f'--- INDEX CONTEXT {i} ---')
    print(idx[start:end].replace('\n',' '))
