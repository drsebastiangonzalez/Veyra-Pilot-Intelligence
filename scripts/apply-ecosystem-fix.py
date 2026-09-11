from pathlib import Path
import html
import io
import re
import urllib.request
import zipfile

ROOT = Path('.')
TECH = ROOT / 'assets' / 'tech'
TECH.mkdir(parents=True, exist_ok=True)

UA = {'User-Agent': 'Veyra-Pilot-Intelligence/1.0'}

def download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=25) as r:
            data = r.read()
        if not data:
            return False
        dest.write_bytes(data)
        print('Downloaded', dest, len(data))
        return True
    except Exception as exc:
        print('Download warning', url, exc)
        return False

simple = {
    'github': ('github', '#0F172A'),
    'supabase': ('supabase', '#3ECF8E'),
    'whatsapp': ('whatsapp', '#25D366'),
    'meta': ('meta', '#0866FF'),
    'anthropic': ('anthropic', '#191919'),
    'googledrive': ('googledrive', '#4285F4'),
    'gmail': ('gmail', '#EA4335'),
    'googlecalendar': ('googlecalendar', '#4285F4'),
    'apple': ('apple', '#111827'),
    'resend': ('resend', '#111827'),
}

def fallback_svg(path: Path, label: str, color: str = '#111827'):
    initials = ''.join(word[0] for word in label.split()[:2]).upper() or '?'
    path.write_text(
        f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="{html.escape(label)}">
        <rect x="8" y="8" width="80" height="80" rx="20" fill="{color}"/>
        <text x="48" y="58" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#fff">{html.escape(initials)}</text>
        </svg>''', encoding='utf-8')

for out, (slug, color) in simple.items():
    p = TECH / f'{out}.svg'
    download(f'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/{slug}.svg', p)
    if not p.exists() or p.stat().st_size < 120:
        label = {'googledrive':'Google Drive','googlecalendar':'Google Calendar'}.get(out, out.title())
        fallback_svg(p, label, color)
        continue
    s = p.read_text(encoding='utf-8', errors='ignore')
    if '<svg' not in s:
        fallback_svg(p, out.title(), color)
        continue
    if re.search(r'<svg\b[^>]*\bfill=', s):
        s = re.sub(r'(<svg\b[^>]*\bfill=")[^"]*(")', rf'\1{color}\2', s, count=1)
    else:
        s = s.replace('<svg ', f'<svg fill="{color}" ', 1)
    p.write_text(s, encoding='utf-8')

# Outlook current multicolor Office mark.
outlook = TECH / 'outlook.svg'
download('https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg', outlook)
if not outlook.exists() or outlook.stat().st_size < 120:
    outlook.write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="Microsoft Outlook">
    <rect x="8" y="20" width="54" height="56" rx="6" fill="#0078D4"/>
    <path d="M48 30h40v42H48z" fill="#28A8EA"/>
    <path d="M48 38l20 15 20-15v34H48z" fill="#106EBE"/>
    <path d="M48 38l20 15 20-15" fill="none" stroke="#fff" stroke-width="4"/>
    <text x="35" y="59" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="#fff">O</text>
    </svg>''', encoding='utf-8')

# OpenAI official brand package when available; fallback stays local if the package cannot be read.
openai_out = TECH / 'openai.svg'
chosen = None
try:
    req = urllib.request.Request('https://cdn.openai.com/brand/OpenAI-Logos-2025.zip', headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        package = r.read()
    with zipfile.ZipFile(io.BytesIO(package)) as zf:
        names = [n for n in zf.namelist() if n.lower().endswith('.svg') and '__macosx' not in n.lower()]
        preferred = [n for n in names if any(k in n.lower() for k in ('blossom','symbol','mark'))]
        standalone = [n for n in names if 'partnership' not in n.lower() and 'lockup' not in n.lower()]
        pool = preferred or standalone or names
        if pool:
            chosen = sorted(pool, key=lambda n: (len(n), n))[0]
            openai_out.write_bytes(zf.read(chosen))
except Exception as exc:
    print('OpenAI package warning:', exc)

if not openai_out.exists() or openai_out.stat().st_size < 120:
    openai_out.write_text('''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="OpenAI">
    <g fill="none" stroke="#0F172A" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M47 13c11-7 25 0 26 13 10 2 15 13 10 22 6 9 1 22-10 25-1 13-15 20-26 13-10 7-24 1-26-12-11-3-16-16-9-25-6-10 0-22 10-24 2-13 15-19 25-12Z"/>
      <path d="M34 28l29 17-29 17M62 28L33 45l29 17M48 22v34"/>
    </g></svg>''', encoding='utf-8')
print('OpenAI asset:', chosen or 'local fallback')

path = Path('index.html')
text = path.read_text(encoding='utf-8')

start = text.index('    <section class="homeEcosystem" id="homeEcosystem"')
end = text.index('    <section class="homePerformanceBanner', start)

ecosystem = '''    <section class="homeEcosystem" id="homeEcosystem" aria-label="Ecosistema conectado Veyra">
      <div class="homeEcosystemCopy">
        <span class="homeEyebrow">Ecosistema conectado</span>
        <h2>Todo tu entrenamiento en perfecta sincronía</h2>
        <p>Veyra integra herramientas, personas y datos para crear un flujo de información continuo, seguro y comprensible en un solo ecosistema.</p>
        <button class="homeOutlineCta" type="button" onclick="showScreen('contact')">Ver integraciones <span>→</span></button>
      </div>
      <div class="homeNetworkMap homeNetworkMapV2" aria-label="Red de módulos e integraciones de Veyra">
        <svg class="homeNetworkSvgV2" viewBox="0 0 1000 680" role="img" aria-labelledby="veyraNetworkTitle veyraNetworkDesc">
          <title id="veyraNetworkTitle">Ecosistema conectado Veyra</title>
          <desc id="veyraNetworkDesc">Veyra conecta Instructor Assistant, LMS, correo, VOA, Training Center, CBTA y EBT, reportes, analítica, integraciones y la app móvil.</desc>
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="55%"><stop offset="0" stop-color="#17263a"/><stop offset="1" stop-color="#07111f"/></radialGradient>
            <linearGradient id="edgeGold" x1="0" x2="1"><stop offset="0" stop-color="#557899" stop-opacity=".42"/><stop offset=".5" stop-color="#d7ad59" stop-opacity=".95"/><stop offset="1" stop-color="#557899" stop-opacity=".42"/></linearGradient>
            <filter id="networkGlow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="9" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <g fill="none" stroke="#5d7997" stroke-opacity=".23" stroke-width="1.5" vector-effect="non-scaling-stroke">
            <path d="M250 122 Q365 75 500 72"/><path d="M500 72 Q650 72 800 122"/><path d="M800 122 Q900 170 910 260"/><path d="M910 260 Q925 380 870 470"/>
            <path d="M870 470 Q790 550 675 570"/><path d="M675 570 Q590 620 500 600"/><path d="M500 600 Q415 620 330 570"/><path d="M330 570 Q215 550 140 475"/>
            <path d="M140 475 Q70 390 90 280"/><path d="M90 280 Q130 170 250 122"/><path d="M250 122 Q390 210 500 320"/><path d="M800 122 Q650 210 500 320"/>
            <path d="M90 280 Q300 245 500 320"/><path d="M910 260 Q700 245 500 320"/><path d="M140 475 Q325 425 500 320"/><path d="M870 470 Q680 425 500 320"/>
          </g>
          <g fill="none" stroke="url(#edgeGold)" stroke-width="2.2" vector-effect="non-scaling-stroke">
            <path d="M500 320 L500 72"/><path d="M500 320 L250 122"/><path d="M500 320 L800 122"/><path d="M500 320 L910 260"/><path d="M500 320 L870 470"/>
            <path d="M500 320 L675 570"/><path d="M500 320 L500 600"/><path d="M500 320 L330 570"/><path d="M500 320 L140 475"/><path d="M500 320 L90 280"/>
          </g>
          <g fill="#d7ad59" opacity=".92"><circle cx="375" cy="196" r="4"/><circle cx="650" cy="197" r="4"/><circle cx="710" cy="290" r="4"/><circle cx="700" cy="395" r="4"/><circle cx="590" cy="475" r="4"/><circle cx="410" cy="480" r="4"/><circle cx="310" cy="402" r="4"/><circle cx="285" cy="290" r="4"/></g>
          <circle cx="500" cy="320" r="118" fill="#d7ad59" opacity=".08" filter="url(#networkGlow)"/>
          <circle cx="500" cy="320" r="102" fill="url(#coreGlow)" stroke="#d7ad59" stroke-width="2.2"/>
          <text x="500" y="314" text-anchor="middle" fill="#fff" font-family="Georgia,serif" font-size="48">Veyra</text>
          <text x="500" y="344" text-anchor="middle" fill="#d7ad59" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="4">PILOT INTELLIGENCE</text>
          <g font-family="Arial,sans-serif" text-anchor="middle">
            <g transform="translate(500 72)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="18" font-weight="700">LMS</text><text y="65" fill="#cbd5e1" font-size="14">Learning</text></g>
            <g transform="translate(250 122)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="17" font-weight="700">INS</text><text y="65" fill="#cbd5e1" font-size="14">Instructor Assistant</text></g>
            <g transform="translate(800 122)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="21" font-weight="700">@</text><text y="65" fill="#cbd5e1" font-size="14">E-mail</text></g>
            <g transform="translate(910 260)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="17" font-weight="700">VOA</text><text y="65" fill="#cbd5e1" font-size="14">Data &amp; Insights</text></g>
            <g transform="translate(870 470)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="17" font-weight="700">TC</text><text y="65" fill="#cbd5e1" font-size="14">Training Center</text></g>
            <g transform="translate(675 570)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="16" font-weight="700">CBT</text><text y="65" fill="#cbd5e1" font-size="14">CBTA / EBT</text></g>
            <g transform="translate(500 600)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="16" font-weight="700">REP</text><text y="65" fill="#cbd5e1" font-size="14">Reportes</text></g>
            <g transform="translate(330 570)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="16" font-weight="700">ANA</text><text y="65" fill="#cbd5e1" font-size="14">Analytics</text></g>
            <g transform="translate(140 475)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="16" font-weight="700">API</text><text y="65" fill="#cbd5e1" font-size="14">Integraciones</text></g>
            <g transform="translate(90 280)"><circle r="38" fill="#0a1625" stroke="#7893ac" stroke-width="1.5"/><text y="7" fill="#fff" font-size="16" font-weight="700">APP</text><text y="65" fill="#cbd5e1" font-size="14">App móvil</text></g>
          </g>
          <path d="M45 662 C265 590 735 590 955 662" fill="none" stroke="#49647d" stroke-opacity=".28" stroke-width="1.4"/>
        </svg>
      </div>
    </section>

'''
text = text[:start] + ecosystem + text[end:]

replacements = {
    'https://cdn.simpleicons.org/github/0F172A': 'assets/tech/github.svg',
    'https://cdn.simpleicons.org/supabase/3ECF8E': 'assets/tech/supabase.svg',
    'https://cdn.simpleicons.org/whatsapp/25D366': 'assets/tech/whatsapp.svg',
    'https://cdn.simpleicons.org/meta/0866FF': 'assets/tech/meta.svg',
    'https://cdn.simpleicons.org/openai/0F172A': 'assets/tech/openai.svg',
    'https://cdn.simpleicons.org/anthropic/191919': 'assets/tech/anthropic.svg',
    'https://cdn.simpleicons.org/googledrive/4285F4': 'assets/tech/googledrive.svg',
    'https://cdn.simpleicons.org/gmail/EA4335': 'assets/tech/gmail.svg',
    'https://cdn.simpleicons.org/microsoftoutlook/0078D4': 'assets/tech/outlook.svg',
    'https://cdn.simpleicons.org/googlecalendar/4285F4': 'assets/tech/googlecalendar.svg',
    'https://cdn.simpleicons.org/apple/111827': 'assets/tech/apple.svg',
    'https://cdn.simpleicons.org/resend/111827': 'assets/tech/resend.svg',
}
for old, new in replacements.items():
    text = text.replace(old, new)

css = '''
/* Veyra ecosystem visual fix — unified SVG + local technology assets */
.homeNetworkMapV2{position:relative!important;min-height:560px!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:visible!important;padding:0!important}
.homeNetworkSvgV2{width:100%!important;height:auto!important;max-height:650px!important;display:block!important;overflow:visible!important}
.homeTechLogoTrack .techLogo img{width:58px!important;height:58px!important;max-width:58px!important;max-height:58px!important;object-fit:contain!important;display:block!important;margin:0 auto 14px!important}
.homeTechLogoTrack .techLogo{min-width:210px!important}
@media(max-width:900px){.homeNetworkMapV2{min-height:430px!important;overflow:hidden!important}.homeNetworkSvgV2{min-width:720px!important;transform:translateX(-2%) scale(.9);transform-origin:center center}.homeTechLogoTrack .techLogo{min-width:180px!important}}
@media(max-width:560px){.homeNetworkMapV2{min-height:390px!important}.homeNetworkSvgV2{min-width:660px!important;transform:translateX(-6%) scale(.82)}}
'''
if 'Veyra ecosystem visual fix — unified SVG + local technology assets' not in text:
    text = text.replace('</style>', css + '\n</style>', 1)

path.write_text(text, encoding='utf-8')
print('Homepage patched; local assets:', len(list(TECH.glob('*'))))
