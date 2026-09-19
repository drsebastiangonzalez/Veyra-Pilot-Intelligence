# A320 · App Content Contract

Este directorio define el contrato de contenido que la app Veyra utilizará para incorporar A320 sin modificar las funcionalidades existentes de Training Center, exámenes, evaluaciones, Instructor Assistant ni demás módulos.

## Principios

- **A320 Foundations**: acceso gratuito para usuarios autenticados.
- **A320 Procedures & Operations**: requiere el entitlement `a320_procedures`.
- El contenido Premium no debe depender de una URL pública como control de acceso.
- En producción, la app resolverá los recursos Premium mediante un asset autorizado/firmado.
- Los módulos web conservan su diseño e interactividad dentro de `WKWebView`.
- El progreso local sigue funcionando aunque la app no esté presente.
- Cuando el módulo se ejecuta dentro de la app, publica eventos por el handler `veyraApp`.

## Bridge WKWebView v1

Todos los mensajes tienen esta forma:

```json
{
  "schema": 1,
  "moduleId": "a320.flow-patterns",
  "contentVersion": "2026.09.19",
  "type": "progress_changed",
  "payload": {}
}
```

Eventos iniciales:

- `module_ready`
- `view_changed`
- `flow_opened`
- `progress_changed`
- `practice_started`
- `practice_completed`

La app debe registrar un `WKScriptMessageHandler` llamado `veyraApp`. En navegador normal el módulo ignora silenciosamente la ausencia del handler.

## Offline

El manifiesto separa dos políticas:

- Foundations: cache después de la primera apertura.
- Procedures & Operations: descarga solo después de validar el entitlement.

La app debe conservar una copia local válida y actualizarla cuando la versión del manifiesto cambie.

## Seguridad

Este manifiesto no contiene claves, tokens ni URLs Premium directas. El `assetId` se resolverá del lado autorizado (Supabase/Edge Function) antes de entregar el recurso al usuario.
