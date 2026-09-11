from pathlib import Path
import json
import re

SITE = "https://veyrapilot.com"
IMAGE = f"{SITE}/avion-negro.jpg"
ORG = f"{SITE}/#organization"
WEBSITE = f"{SITE}/#website"

pages = {
    "index.html": {
        "title": "Veyra Pilot Intelligence | Inteligencia para entrenamiento aeronáutico",
        "description": "Veyra Pilot Intelligence integra evaluación, Training Center, Instructor Assistant, Analytics y automatización para el entrenamiento aeronáutico.",
        "url": f"{SITE}/",
        "name": "Veyra Pilot Intelligence",
        "home": True,
    },
    "que-es-veyra.html": {
        "title": "Qué es Veyra | Inteligencia para entrenamiento aeronáutico",
        "description": "Conoce Veyra Pilot Intelligence: evaluación, formación, seguimiento, competencias y analítica para transformar datos de entrenamiento en decisiones útiles.",
        "url": f"{SITE}/que-es-veyra.html",
        "name": "Qué es Veyra",
    },
    "instructor-assistant.html": {
        "title": "Instructor Assistant | Evidencia y feedback | Veyra Pilot Intelligence",
        "description": "Instructor Assistant de Veyra estructura observaciones, evidencia, competencias y retroalimentación para dar continuidad al entrenamiento aeronáutico.",
        "url": f"{SITE}/instructor-assistant.html",
        "name": "Instructor Assistant",
    },
    "evaluacion-evidencia.html": {
        "title": "Evaluación & Evidencia | Seguimiento del piloto | Veyra Pilot Intelligence",
        "description": "Veyra organiza evaluaciones, resultados y evidencia de entrenamiento para conectar cada resultado con el seguimiento y progreso del piloto.",
        "url": f"{SITE}/evaluacion-evidencia.html",
        "name": "Evaluación & Evidencia",
    },
    "analytics.html": {
        "title": "Analytics para entrenamiento aeronáutico | Veyra Pilot Intelligence",
        "description": "Veyra Analytics convierte registros de entrenamiento en indicadores por piloto, competencia, misión y grupo para apoyar decisiones formativas.",
        "url": f"{SITE}/analytics.html",
        "name": "Analytics",
    },
    "training-center.html": {
        "title": "Training Center | Preparación aeronáutica | Veyra Pilot Intelligence",
        "description": "Veyra Training Center reúne preparación PPA/PCA, rutas de instrumentos y práctica progresiva antes del simulador y el vuelo.",
        "url": f"{SITE}/training-center.html",
        "name": "Training Center",
    },
    "voa.html": {
        "title": "VOA | Coordinación de entrenamiento | Veyra Pilot Intelligence",
        "description": "VOA de Veyra organiza coordinación de sesiones, confirmaciones, mission briefs y seguimiento operativo del entrenamiento.",
        "url": f"{SITE}/voa.html",
        "name": "VOA",
    },
}

solution_items = [
    ("Instructor Assistant", f"{SITE}/instructor-assistant.html"),
    ("Evaluación & Evidencia", f"{SITE}/evaluacion-evidencia.html"),
    ("Analytics", f"{SITE}/analytics.html"),
    ("Training Center", f"{SITE}/training-center.html"),
    ("VOA", f"{SITE}/voa.html"),
]

def structured(page):
    if page.get("home"):
        graph = [
            {
                "@type": "Organization",
                "@id": ORG,
                "name": "Veyra Pilot Intelligence",
                "url": f"{SITE}/",
                "logo": {"@type": "ImageObject", "url": f"{SITE}/favicon.png"},
            },
            {
                "@type": "WebSite",
                "@id": WEBSITE,
                "url": f"{SITE}/",
                "name": "Veyra Pilot Intelligence",
                "publisher": {"@id": ORG},
                "inLanguage": "es",
            },
            {
                "@type": "ItemList",
                "name": "Soluciones Veyra Pilot Intelligence",
                "itemListElement": [
                    {"@type": "ListItem", "position": i, "name": name, "url": url}
                    for i, (name, url) in enumerate(solution_items, 1)
                ],
            },
        ]
    else:
        graph = [
            {
                "@type": "WebPage",
                "@id": page["url"] + "#webpage",
                "url": page["url"],
                "name": page["title"],
                "description": page["description"],
                "isPartOf": {"@id": WEBSITE},
                "about": {"@id": ORG},
                "inLanguage": "es",
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {"@type": "ListItem", "position": 1, "name": "Veyra Pilot Intelligence", "item": f"{SITE}/"},
                    {"@type": "ListItem", "position": 2, "name": page["name"], "item": page["url"]},
                ],
            },
        ]
    return {"@context": "https://schema.org", "@graph": graph}

for filename, page in pages.items():
    p = Path(filename)
    s = p.read_text(encoding="utf-8")

    s, n = re.subn(r"<title>.*?</title>", f"<title>{page['title']}</title>", s, count=1, flags=re.S)
    if n != 1:
        raise SystemExit(f"Missing title in {filename}")

    desc_tag = f'<meta name="description" content="{page["description"]}">' 
    s, n = re.subn(r'<meta\s+name=["\']description["\']\s+content=["\'].*?["\']\s*/?>', desc_tag, s, count=1, flags=re.S | re.I)
    if n != 1:
        raise SystemExit(f"Missing description in {filename}")

    s = re.sub(r'\n?<link\s+rel=["\']canonical["\'][^>]*>', '', s, flags=re.I)
    s = re.sub(r'\n?<link\s+rel=["\']sitemap["\'][^>]*>', '', s, flags=re.I)
    s = re.sub(r'\n?<meta\s+property=["\']og:[^"\']+["\'][^>]*>', '', s, flags=re.I)
    s = re.sub(r'\n?<meta\s+name=["\']twitter:[^"\']+["\'][^>]*>', '', s, flags=re.I)
    s = re.sub(r'\n?<script\s+type=["\']application/ld\+json["\']>.*?</script>', '', s, flags=re.I | re.S)

    seo = "\n".join([
        f'<link rel="canonical" href="{page["url"]}">',
        '<link rel="sitemap" type="application/xml" href="/sitemap.xml">',
        '<meta property="og:site_name" content="Veyra Pilot Intelligence">',
        '<meta property="og:locale" content="es_CO">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:title" content="{page["title"]}">',
        f'<meta property="og:description" content="{page["description"]}">',
        f'<meta property="og:url" content="{page["url"]}">',
        f'<meta property="og:image" content="{IMAGE}">',
        '<meta name="twitter:card" content="summary_large_image">',
        f'<meta name="twitter:title" content="{page["title"]}">',
        f'<meta name="twitter:description" content="{page["description"]}">',
        f'<meta name="twitter:image" content="{IMAGE}">',
        '<script type="application/ld+json">' + json.dumps(structured(page), ensure_ascii=False, separators=(",", ":")) + '</script>',
    ])

    anchor = desc_tag
    if anchor not in s:
        raise SystemExit(f"SEO insertion anchor missing in {filename}")
    s = s.replace(anchor, anchor + "\n" + seo, 1)
    p.write_text(s, encoding="utf-8")

print("SEO metadata and structured data patched on 7 public pages.")
