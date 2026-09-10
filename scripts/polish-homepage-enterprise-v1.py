from pathlib import Path

path = Path('index.html')
text = path.read_text(encoding='utf-8')

old = ".footerColumn button,.footerColumn a{display:block;padding:4px 0;background:none;border:0;color:#aeb7c4;text-decoration:none;font-size:12px;text-align:left;border-radius:0;font-weight:500}"
new = ".footerColumn button,.footerColumn a,.footerColumn span{display:block;padding:4px 0;background:none;border:0;color:#aeb7c4;text-decoration:none;font-size:12px;text-align:left;border-radius:0;font-weight:500}"
if old in text:
    text = text.replace(old, new, 1)

required = [
    'homeEnterpriseV1',
    '>Solicitar demo <span>→</span></button>',
    'Todo tu entrenamiento en perfecta sincronía',
    'assets/index-visuals/veyra-performance-banner.jpg',
    'Personalizamos la plataforma para cada empresa.',
    'Los logotipos de clientes y aliados se incorporarán únicamente cuando exista autorización de uso.',
    '© 2026 Veyra Pilot Intelligence.'
]
missing = [item for item in required if item not in text]
if missing:
    raise SystemExit('Homepage validation failed: ' + ', '.join(missing))

if text.count('id="homeEnterprise"') != 1:
    raise SystemExit('Homepage validation failed: homeEnterprise id must be unique.')
if text.count('id="homeEcosystem"') != 1:
    raise SystemExit('Homepage validation failed: homeEcosystem id must be unique.')

path.write_text(text, encoding='utf-8')
print('Homepage polish and validation passed.')
