# Publicación de la guía PPA v7 — 2026-10-19

## Alcance aprobado

Publicar el archivo `Veyra_PPA_v7_Contenido_Tecnico_Restaurado.pdf` aceptado por el usuario, sin reescribir, resumir, rediseñar ni eliminar páginas. Es una publicación de la versión de revisión existente; no constituye una nueva validación técnica del FOM, AFM/POH o normativa.

## Integración

- Ubicación: Veyra → Training Center → PPA, en la tarjeta PPA existente de `index.html`.
- Ruta conservada: `assets/guias/guia-rapida-chequeo-ppa-veyra.pdf`.
- Botón actualizado: `Ver guía PPA · v7`.
- Parámetro de versión para evitar abrir la revisión anterior en caché: `?v=7-3ff6fe3e`.
- No se crea una clase separada ni una nueva página; no cambia el sitemap porque se conserva la ruta.
- PCA, Classes/GAPPRI, A320, autenticación y evaluación no se modifican.

## Identidad del PDF aprobado

- Páginas: 26.
- Tamaño: 261196 bytes.
- SHA-256: `3ff6fe3eb028d264492a0ad7726295fa8a5116abbf57ab2272d1f0f95490a6f4`.
- Git blob esperado: `ad550b8509ca5c9e0e7fd574be71e917d37d70ba`.

El documento conserva las secciones y la paginación editorial de las revisiones reunidas, incluida la portada con su rótulo anterior. No se modifica el archivo aceptado durante esta publicación.

## Transferencia y verificación

El transporte de texto del conector se resuelve mediante una transferencia sin pérdidas, usando bytes del PDF anterior y un paquete comprobado por SHA-256. Se verificó localmente que la reconstrucción es idéntica, byte por byte, al PDF adjunto aprobado. El PDF se abrió con PyMuPDF y se comprobaron sus 26 páginas.

Los archivos temporales de transferencia y su workflow se retiran antes de fusionar. El repositorio final almacena un PDF normal, no una dependencia de reconstrucción durante Pages ni un enlace temporal externo.

Antes de confirmar la publicación: comprobar que el PR final solo modifica PDF, botón PPA y esta nota; esperar checks satisfactorios; fusionar a main; comprobar GitHub Pages y la identidad del PDF servido en el dominio público.
