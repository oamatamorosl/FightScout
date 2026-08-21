# PLAN.md

Estado y pendientes de FightScout. Ver también `CLAUDE.md` para
convenciones de código.

## Estructura y navegación

- [x] 3 páginas HTML enlazadas entre sí (`index.html`, `registro.html`, `registroScout.html`)
- [x] Nav responsive: hamburguesa + drawer en móvil, barra inline desde 768px
- [x] Footer compartido con enlaces a las páginas internas

## CSS

- [x] Hoja única `css/styles.css`, mobile-first, con tokens de diseño (colores) en `:root`
- [x] Flexbox y Grid aplicados según corresponda a cada sección
- [ ] Modularizar `css/styles.css` en varios archivos (`variables.css`, `layout.css`, `components.css`, `pages.css`, `responsive.css`) si el proyecto crece — hoy es un solo archivo

## SEO técnico

- [x] `title` único, `meta description` (120–160 caracteres) y `viewport` en las 3 páginas
- [x] Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) y Twitter Card en las 3 páginas
- [x] `favicon.svg` enlazado en las 3 páginas
- [x] `robots.txt` y `sitemap.xml` en la raíz
- [ ] Reemplazar el dominio placeholder `https://www.fightscout.com/` (usado en `og:url` de las 3 páginas, `sitemap.xml` y `robots.txt`) por el dominio real cuando exista
- [ ] Reemplazar `og:image`/`twitter:image` provisional (`peleador1.jpeg`) por una imagen de marca de 1200×630

## Formularios

- [x] Formulario de perfil de peleador (`registro.html`) validado en TypeScript (`ts/validarPerfilPeleador.ts`)
- [x] Formulario de cuenta de scout (`registroScout.html`) validado en TypeScript (`ts/validarPerfilScout.ts`)
- [x] Validación con type guards (no `as`), mensajes de error accesibles vía `aria-describedby`, validación en tiempo real (blur/change)
- [x] Feedback visual nativo por campo (`:valid`/`:invalid`/`:focus` en `css/styles.css`, `:user-invalid`/`:user-valid` para los `<select>`), con ícono además del color, sin marcar nada antes de que el usuario interactúe
- [ ] Conectar los formularios a un backend real — hoy `action="#"`, el "envío" solo valida en el cliente y muestra un mensaje de confirmación local
- [ ] Definir si se necesita un campo de teléfono (y su validación de formato) en algún formulario

## Herramientas / calidad

- [x] TypeScript en modo `strict`, compilado sin errores desde `ts/` a `js/`
- [ ] No hay linter ni test runner configurado — evaluar si el proyecto lo necesita
- [ ] Revisar los comandos en `.claude/commands/` — `Meta.md`, `limpiar-css.md` y `nueva-seccion.md` están escritos para otros proyectos (referencian archivos y carpetas que no existen en FightScout)

## Decisiones

- TypeScript vive en `ts/` (fuente) y compila a `js/` (salida, no editar a
  mano) — sin bundler, `module: "preserve"`, scripts globales tipo IIFE.
- Un único `css/styles.css` mobile-first con tokens en `:root`, en vez de
  una arquitectura modular por archivos.
- Los formularios usan `novalidate` + validación propia en TS (en vez de
  depender solo de la validación nativa del navegador), para mostrar errores
  accesibles y consistentes con el diseño del sitio.
- Se usa `instanceof` como type guard para angostar elementos del DOM en vez
  de aserciones `as`.
- El color/ícono de los campos de formulario los decide el CSS puro
  (`:valid`/`:invalid`/`:user-valid`/`:user-invalid`), no JS: el TS solo
  llama `setCustomValidity()` para que la plataforma refleje también las
  reglas que el HTML nativo no puede expresar (ej. "nocauts ≤ victorias").
  Así el mensaje de texto (JS) y el color (CSS) nunca quedan desincronizados.
