from pathlib import Path


def replace_once(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(f'{label}: expected 1 match, found {count}')
    return text.replace(old, new, 1)

# training-dashboard.html
path = Path('training-dashboard.html')
text = path.read_text(encoding='utf-8')
marker = '<script src="./internal-admin-auth.js"></script>'
if marker not in text:
    text = replace_once(
        text,
        '<script>\nconst SUPABASE_URL=',
        marker + '\n<script>\nconst SUPABASE_URL=',
        'training helper include'
    )
text = replace_once(
    text,
    '"Authorization":"Bearer "+SUPABASE_KEY',
    '"Authorization":"Bearer "+VeyraAdminAuth.getAccessToken()',
    'training auth header'
)
text = replace_once(
    text,
    '<button class="gold" onclick="exportAttemptsCsv()">Exportar CSV</button>',
    '<button class="gold" onclick="exportAttemptsCsv()">Exportar CSV</button>\n<button class="ghost" onclick="VeyraAdminAuth.signOut().then(()=>location.replace(VeyraAdminAuth.loginUrl(\'training-dashboard.html\')))">Cerrar sesión</button>',
    'training logout button'
)
text = replace_once(
    text,
    'loadAttempts();\n</script>',
    "VeyraAdminAuth.ensureAdmin().then(function(ok){\n  if(ok) loadAttempts();\n  else location.replace(VeyraAdminAuth.loginUrl('training-dashboard.html'));\n});\n</script>",
    'training init'
)
path.write_text(text, encoding='utf-8')

# presolo-instructor-dashboard.html
path = Path('presolo-instructor-dashboard.html')
text = path.read_text(encoding='utf-8')
if marker not in text:
    text = replace_once(
        text,
        '<script>\n\nconst PANEL_ACCESS_HASH',
        marker + '\n<script>\n\nconst PANEL_ACCESS_HASH',
        'presolo helper include'
    )
start = text.find('const PANEL_ACCESS_HASH')
end = text.find('\nconst SUPABASE_URL=', start)
if start == -1 or end == -1:
    raise SystemExit('presolo auth block not found')
new_auth = '''function isPanelUnlocked(){\n  return VeyraAdminAuth.hasSession();\n}\nfunction showOrHideLock(){\n  const lock=document.getElementById("lockScreen");\n  if(lock) lock.style.display=isPanelUnlocked()?"none":"flex";\n}\nfunction unlockPanel(){\n  location.replace(VeyraAdminAuth.loginUrl('presolo-instructor-dashboard.html'));\n}\nasync function cerrarPanelInstructor(){\n  await VeyraAdminAuth.signOut();\n  location.replace(VeyraAdminAuth.loginUrl('presolo-instructor-dashboard.html'));\n}\n'''
text = text[:start] + new_auth + text[end:]
text = replace_once(
    text,
    '"Authorization":"Bearer "+SUPABASE_KEY',
    '"Authorization":"Bearer "+VeyraAdminAuth.getAccessToken()',
    'presolo auth header'
)
text = replace_once(
    text,
    'showOrHideLock();\nif(isPanelUnlocked()) loadData();',
    "VeyraAdminAuth.ensureAdmin().then(function(ok){\n  if(ok){ showOrHideLock(); loadData(); }\n  else location.replace(VeyraAdminAuth.loginUrl('presolo-instructor-dashboard.html'));\n});",
    'presolo init'
)
path.write_text(text, encoding='utf-8')

print('Admin dashboard authentication patch applied.')
