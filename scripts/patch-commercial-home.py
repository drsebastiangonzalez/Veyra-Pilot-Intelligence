from pathlib import Path
import re

p=Path('index.html')
s=p.read_text(encoding='utf-8')

new_grid='''<div class="homeCapabilitiesGrid">
        <a class="homeCapabilityCard" href="instructor-assistant.html"><span>01</span><h3>Instructor Assistant</h3><p>Observación, evidencia y retroalimentación estructurada.</p><b>Conocer solución →</b></a>
        <button type="button" class="homeCapabilityCard" data-cap-open="cap-records"><span>02</span><h3>Evaluación & Evidencia</h3><p>Resultados, historial y trazabilidad del proceso formativo.</p><b>Explorar →</b></button>
        <a class="homeCapabilityCard" href="analytics.html"><span>03</span><h3>Analytics</h3><p>Indicadores por piloto, competencia, misión y grupo.</p><b>Conocer solución →</b></a>
        <a class="homeCapabilityCard" href="training-center.html"><span>04</span><h3>Training Center</h3><p>Rutas, práctica y contenidos antes del simulador y el vuelo.</p><b>Conocer solución →</b></a>
        <a class="homeCapabilityCard" href="voa.html"><span>05</span><h3>VOA</h3><p>Coordinación de sesiones, confirmaciones y mission briefs.</p><b>Conocer solución →</b></a>
      </div>'''

pat=r'<div class="homeCapabilitiesGrid">.*?</div>'
s2,n=re.subn(pat,new_grid,s,count=1,flags=re.S)
if n!=1:
    raise SystemExit(f'Expected one capability grid, found {n}')
s=s2

old='.homeCapabilityCard{appearance:none;text-align:left;'
new='.homeCapabilityCard{display:block;text-decoration:none;appearance:none;text-align:left;'
if old not in s:
    raise SystemExit('homeCapabilityCard CSS signature not found')
s=s.replace(old,new,1)

s=s.replace('data-cap-target="cap-analytics">Analítica</button>','data-cap-target="cap-analytics">Analytics</button>',1)
s=s.replace('data-cap-target="cap-training">Training Design</button>','data-cap-target="cap-training">Training Center</button>',1)

for href in ['instructor-assistant.html','analytics.html','training-center.html','voa.html']:
    if href not in s:
        raise SystemExit(f'Missing homepage link: {href}')

p.write_text(s,encoding='utf-8')
print('Homepage solution links patched successfully.')
