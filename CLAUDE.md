# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

El resto de este archivo está en español, siguiendo la convención del resto
del proyecto (commits, comentarios, copy y `README.md`/`PLAN.md` en español).

## Qué es este proyecto

FightScout es un sitio de scouting de MMA y boxeo para Latinoamérica: una
landing (`index.html`) y dos formularios de registro — perfil de peleador
(`registro.html`) y cuenta de scout/coach (`registroScout.html`). El
formulario de peleador ya no es un formulario simple: tiene cascadas de
campos según la disciplina elegida (divisiones de peso, estilo de pelea,
métodos de victoria), grupos de checkboxes con validación de grupo, y una
sección de logros repetible con estado "tarjeta" (edición ↔ resumen de
lectura). No tiene backend: los formularios validan y muestran una
confirmación solo del lado del cliente, no envían datos a ningún servidor.

Además del sitio público, el repo tiene `playground.html`: un catálogo
interno de componentes de UI para un futuro backoffice, no una página de
cara al usuario — ver "Playground / Backoffice" más abajo.

## Stack

- HTML + CSS. Los tokens de diseño viven centralizados en
  `css/variables.css` — colores (marca + semánticos), tipografía (familias
  `--fuente-titulo`/`--fuente-cuerpo`, tamaños `--texto-*`, pesos
  `--peso-*`) y una escala de espaciado (`--espacio-4` a `--espacio-90`,
  nombrada por su valor en px). Se carga antes que `css/styles.css`, que
  consume esos tokens vía `var()` y ya no tiene su propio `:root` de
  colores. Sin framework ni preprocesador.
- TypeScript compilado a JS plano, sin bundler ni módulos ES en runtime.
  Fuente en `ts/`, salida compilada en `js/`.
- Sin test runner ni linter configurado.

## Estructura

```
index.html               Landing
registro.html             Formulario: crear perfil de peleador
registroScout.html         Formulario: crear cuenta de scout/coach
playground.html           Catálogo de componentes del backoffice (interno, noindex)
css/variables.css         Tokens centralizados (colores, tipografía, espaciado) — fuente única de verdad, se carga primero
css/styles.css            Estilos del sitio público (mobile-first, Flexbox/Grid, consume los tokens de variables.css)
css/playground.css        Agregador (@import) de variables.css + los CSS de componentes del playground
css/botones.css, alerts.css, dialogs.css              Componentes ya estilizados del playground
css/checkboxes-radios.css, menus.css, toasts.css       Componentes del playground aún vacíos (scaffold)
ts/                       Fuente TypeScript
  nav.ts                    Menú hamburguesa + drawer, compartido por las 3 páginas públicas
  validarPerfilPeleador.ts  Validación del formulario de registro.html
  validarPerfilScout.ts     Validación del formulario de registroScout.html
  playground.ts             Interactividad de los componentes del playground (dialogs, menús, toasts)
js/                       Salida compilada de ts/ — generada por tsc, no editar a mano
img/                      Imágenes de peleadores (movidas desde la raíz)
favicon.svg               Ícono del sitio
robots.txt / sitemap.xml   SEO técnico
tsconfig.json             rootDir ./ts, outDir ./js, strict: true
```

Las 3 páginas públicas (`index.html`, `registro.html`, `registroScout.html`)
comparten el mismo esqueleto: header con logo + nav (hamburguesa en móvil,
barra inline desde 768px) + footer. No hay sistema de roles/sesión — esas 3
páginas son públicas. `playground.html` es aparte: no comparte ese esqueleto
(tiene su propio `<nav>` de catálogo), está marcado `noindex, nofollow` y no
es una página de cara al usuario final — ver "Playground / Backoffice" abajo.

## Playground / Backoffice

`playground.html` es un catálogo de componentes de UI pensado para un
futuro backoffice, no una página de cara al usuario. Carga sus estilos vía
el agregador `css/playground.css` (que hace `@import` de `variables.css` +
los CSS de cada componente), a diferencia del sitio público, que enlaza sus
hojas de estilo directo con `<link>`.

Componentes ya estilizados:
- **Alertas** (`css/alerts.css`): patrón de tinte de fondo con
  `color-mix()`; `role="alert"` para error/warning, `role="status"` para
  success/info.
- **Botones** (`css/botones.css`): 4 variantes. El destructivo es fantasma
  (borde, sin relleno) para no competir con el rojo de marca, que es la
  acción principal del sitio.
- **Dialog** (`css/dialogs.css`): fondo oscuro acorde a la identidad del
  sitio + `::backdrop` propio.

Aún vacíos (scaffold, selectores sin reglas): `checkboxes-radios.css`,
`menus.css`, `toasts.css`.

## Comandos

- `npm install` — instala TypeScript (única dependencia del proyecto).
- `npx tsc` — compila `ts/**/*.ts` → `js/`. `tsconfig.json` ya trae
  `rootDir`/`outDir` configurados, así que alcanza con correrlo desde la raíz.
- No hay servidor de desarrollo propio: se prueba con **Live Server** (o
  equivalente, ej. `npx serve .`) en vez de abrir los HTML con `file://` —
  no por los scripts de `ts/` (son globales, sin `<script type="module">`),
  sino porque `css/playground.css` usa `@import` y hay rutas relativas que
  se resuelven mejor servidas por HTTP.

## Convenciones

- El copy y los nombres de variables/funciones en TypeScript están en
  español; los `id`/`name` del DOM están en inglés porque son los que
  viajarían como `name` de un formulario a un backend real.
- CSS mobile-first: la regla base es para móvil; `@media (min-width: 480px)`
  y `@media (min-width: 768px)` agregan complejidad hacia pantallas grandes.
  Nunca se usa `max-width` para "desarmar" el layout de desktop.
- Los scripts de `ts/` son IIFEs autoinvocadas
  (`(function initX(): void { ... })();`), sin `import`/`export` —
  `tsconfig.json` usa `module: "preserve"` porque no hay bundler. Cada una
  empieza con un guard clause (`if (!elemento) return;`) para poder incluirse
  en las 3 páginas sin romper en la que no tiene ese elemento.
- Para angostar un `document.getElementById(...)` a un tipo de elemento
  concreto se usa un **type guard** con `instanceof`
  (`function x(el): el is HTMLInputElement | ...`), no una aserción `as` —
  ver `esCampoValidable` en los dos validadores de formulario.
- Los formularios usan `novalidate` + validación propia en TS, pero el color
  del campo lo decide **CSS puro** (`:valid`/`:invalid`/`:focus`, y
  `:user-invalid`/`:user-valid` para los `<select>`, que no soportan
  `:placeholder-shown`) — nunca un `classList.add()` de color. El TS solo
  llama `campo.setCustomValidity(mensaje)` / `('')` para que la validez
  nativa refleje también reglas que el HTML no puede expresar (ej. "nocauts
  ≤ victorias" en `validarPerfilPeleador.ts`). El mensaje de texto vive en
  `<p class="error-campo">` ligado al campo con `aria-describedby`.
  Revalidación en vivo: `blur` en inputs, `change` en selects.
- El dominio `https://www.fightscout.com/` usado en `og:url` de las 3
  páginas, `sitemap.xml` y `robots.txt` es un **placeholder** — si cambia,
  hay que actualizarlo de forma consistente en los 5 lugares (ver `PLAN.md`).
- Los campos de formulario creados dinámicamente (`createElement` en las
  cascadas de disciplina: divisiones de peso, estilo de pelea, artes
  marciales, métodos de victoria, y las filas de logros) reciben sus event
  listeners en el momento de crearse, no en una pasada de wiring al cargar
  la página — no existen en el DOM inicial.
- La clase utilitaria `.oculto` usa `display: none !important` para ganar
  siempre sobre `.campo { display: flex }` (misma especificidad; sin
  `!important` se resolvía por orden en la hoja, algo frágil). Es de los
  pocos usos legítimos de `!important` en el proyecto.
- `type="date"` ignora el atributo `placeholder`, así que para evitar el
  check verde de `:valid` en un date opcional vacío se lo excluye
  directamente del `background-image` del ícono en vez de usar el truco del
  placeholder. Los inputs numéricos opcionales sí usan `placeholder` para
  lograr lo mismo vía `:placeholder-shown`.
- Las validaciones cruzadas del récord (`validarPerfilPeleador.ts`) son
  transitivas: suma de métodos de victoria ≤ `wins`, y `firstRoundKos` ≤
  `methodKo` + `methodTko`. Usan `Math.max(valor, 0)` en las sumas para que
  un valor negativo no enmascare el tope.
- Los grupos de checkboxes y las filas dinámicas (logros) se validan
  recorriendo el DOM en el submit, no el array fijo `validadores` — son
  dinámicos, pueden no existir o variar en cantidad. Su revalidación en
  vivo solo actúa si el grupo/campo ya mostró error, para no marcar en rojo
  antes de tiempo.

## Cuidado con `.claude/commands/` y `skills/`

Algunos comandos/skills en el repo **no fueron escritos para FightScout**
(parecen copiados de otros proyectos de la misma serie de ejercicios):

- `.claude/commands/Meta.md` documenta las meta tags de otro proyecto
  ("TechFix Agenda").
- `.claude/commands/limpiar-css.md` asume una arquitectura CSS modular
  (`css/components.css`, `css/pages.css`, etc.) y páginas
  (`catalogo.html`, `iniciar-sesion.html`, `privacidad.html`) de otro
  proyecto ("Purple Bloom").
- `.claude/commands/nueva-seccion.md` asume esa misma arquitectura CSS
  modular más páginas internas con sesión/roles (`paneles.html`,
  `usuarios.html`, `importar.html`, `ts/session.ts`, `ts/theme.ts`) que no
  existen en este repo.
- `skills/check-aria/SKILL.md` revisa "el formulario de `contacto.html`" —
  esa página tampoco existe acá (los formularios reales son `registro.html`
  y `registroScout.html`).

Si se van a usar en FightScout, hay que adaptarlos primero a la estructura
real del proyecto (arriba). El resto de los comandos (`check-seo`,
`check-responsive`, `check-accesibilidad`, `revisar-formulario`,
`feedback-visual-formulario`, `agregar-testimonio`) están escritos de forma
genérica y sí aplican tal cual — aunque ahora que el repo tiene 4 archivos
HTML (`index.html`, `registro.html`, `registroScout.html`,
`playground.html`), conviene tener presente que `check-seo.md` habla de
páginas públicas indexables: solo las primeras 3 aplican, `playground.html`
es interno (`noindex, nofollow`) y no lleva meta tags de SEO.

## Ver también

`PLAN.md` — pendientes del proyecto y decisiones de arquitectura ya tomadas.
