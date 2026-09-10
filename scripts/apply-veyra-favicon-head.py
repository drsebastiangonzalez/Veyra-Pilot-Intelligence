from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')
marker = '<link rel="icon" type="image/png" href="/favicon.png">'
if marker in text:
    print('Veyra favicon metadata already present.')
    raise SystemExit(0)

needle = '<meta name="description" content="Veyra Pilot Intelligence: plataforma de evaluación, CBTA/EBT y analítica de desempeño para formación aeronáutica." />'
if needle not in text:
    raise SystemExit('Description meta tag not found; refusing to patch.')

block = '''<meta name="description" content="Veyra Pilot Intelligence: plataforma de evaluación, CBTA/EBT y analítica de desempeño para formación aeronáutica." />
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" href="/favicon.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0b1014">
<meta name="application-name" content="Veyra Pilot Intelligence">
<meta property="og:site_name" content="Veyra Pilot Intelligence">
<meta property="og:title" content="Veyra | Pilot Intelligence">
<meta property="og:description" content="Evaluación, entrenamiento y analítica de desempeño para formación aeronáutica.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://veyrapilot.com/">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization","name":"Veyra Pilot Intelligence","url":"https://veyrapilot.com/","logo":"https://veyrapilot.com/favicon.png"}</script>'''

text = text.replace(needle, block, 1)
path.write_text(text, encoding='utf-8')
print('Veyra favicon metadata applied.')
