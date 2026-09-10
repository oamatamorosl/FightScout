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
- [x] Expansión de `registro.html` (fieldsets reorganizados, campos nuevos, checkboxes dinámicos, métodos de victoria, logros estructurados):
  - [x] Fase A — campos simples: nacionalidad (antes `country`), país/ciudad de residencia, ciudad, estado/provincia, gimnasio; renombrado `fighterType`→`competitiveLevel`; nuevos: estado competitivo, disponible para pelear, fecha última pelea. Fieldsets reorganizados (Identidad, Ubicación y equipo, Disciplina y categoría, Trayectoria, Récord y estilo).
  - [x] Fase B1 — grupos de checkboxes: idiomas (obligatorio mín. 1), estilo de pelea condicional por disciplina y obligatorio (Boxeo: Estilista/Contragolpeador/Fajador · MMA: Striker/Grappler/Mixto), artes/fortalezas solo MMA obligatorio cuando visible. Validación de grupo + revalidación en vivo (solo si el grupo ya tenía error).
  - [x] Fase B2 — divisiones de peso alternativas (checkboxes dinámicos por disciplina, opcional), reutilizan las constantes de divisiones existentes.
  - [x] Fase C1 — métodos de victoria dinámicos por disciplina (Boxeo: KO/TKO/DEC/DQ · MMA: +SUB), suman ≤ `wins`. Eliminado el campo `knockouts`. Agregado `noContests` (opcional).
  - [x] Fase C2 — `firstRoundKos` reconectado a la suma KO+TKO (habilitación dinámica + validación ≤ KO+TKO + revalidación en vivo).
  - [x] Fase D — logros estructurados repetibles con estado tarjeta: agregar fila → completar → "Guardar logro" colapsa a recuadro de lectura (título / org·año·nivel / descripción) con Editar/Borrar. Opcional; si se agrega una fila, sus campos (menos descripción) son obligatorios. Submit bloquea si queda una fila en edición sin guardar. Reemplazó el textarea `achievements`.
- [ ] Conectar los formularios a un backend real — hoy `action="#"`, el "envío" solo valida en el cliente y muestra un mensaje de confirmación local
- [x] Campo de teléfono: no se agrega — el formulario ya cubre validación de formato con email, fechas y rangos numéricos; no aporta cobertura adicional relevante

## Herramientas / calidad

- [x] TypeScript en modo `strict`, compilado sin errores desde `ts/` a `js/`
- [ ] No hay linter ni test runner configurado — evaluar si el proyecto lo necesita
- [ ] Revisar los comandos en `.claude/commands/` — `Meta.md`, `limpiar-css.md` y `nueva-seccion.md` están escritos para otros proyectos (referencian archivos y carpetas que no existen en FightScout)

## Pendientes generales

- [ ] `perfil.html` — página de perfil público del peleador (siguiente objetivo, aún no iniciada)
- [ ] `max` dinámico en los `<input type="date">` calculado con JS al cargar la página (hoy es un valor estático en el HTML)
- [ ] Componentes vacíos del playground (`checkboxes-radios`, `menus`, `toasts`)

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
- La cadena de validación del récord es transitiva: suma de métodos de
  victoria ≤ `wins`, y `firstRoundKos` ≤ (`methodKo` + `methodTko`). Se usa
  `Math.max(valor, 0)` en las sumas para que un valor negativo no enmascare
  el tope.
- Los campos de formulario dinámicos (creados con `createElement` en las
  cascadas de disciplina) reciben sus listeners en el momento de crearse, no
  en una pasada de wiring al cargar la página, porque no existen en el DOM
  inicial.
- La clase `.oculto` usa `display: none !important` para ganar siempre sobre
  `.campo { display: flex }` (misma especificidad; sin `!important` se
  resolvía por orden en la hoja, algo frágil).
- `type="date"` ignora el atributo `placeholder`, así que para quitarle el
  check verde de `:valid` en vacío se lo excluye directamente del
  `background-image` del ícono (el truco del placeholder no se le puede
  aplicar ahí). Los inputs numéricos opcionales sí usan `placeholder` para eso.
