# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

El resto de este archivo está en español, siguiendo la convención del resto
del proyecto (commits, comentarios, copy y `README.md`/`PLAN.md` en español).

## Qué es este proyecto

FightScout es un sitio de scouting de MMA y boxeo para Latinoamérica: una
landing (`index.html`) y dos formularios de registro — perfil de peleador
(`registro.html`) y cuenta de scout/coach (`registroScout.html`). No tiene
backend: los formularios validan y muestran una confirmación solo del lado
del cliente, no envían datos a ningún servidor.

## Stack

- HTML + CSS. Un único `css/styles.css`, mobile-first, con tokens de diseño
  (colores) como custom properties en `:root`. Sin framework ni preprocesador.
- TypeScript compilado a JS plano, sin bundler ni módulos ES en runtime.
  Fuente en `ts/`, salida compilada en `js/`.
- Sin test runner ni linter configurado.

## Estructura

```
index.html               Landing
registro.html             Formulario: crear perfil de peleador
registroScout.html         Formulario: crear cuenta de scout/coach
css/styles.css            Única hoja de estilos (mobile-first, variables, Flexbox/Grid)
ts/                       Fuente TypeScript
  nav.ts                    Menú hamburguesa + drawer, compartido por las 3 páginas
  validarPerfilPeleador.ts  Validación del formulario de registro.html
  validarPerfilScout.ts     Validación del formulario de registroScout.html
js/                       Salida compilada de ts/ — generada por tsc, no editar a mano
favicon.svg               Ícono del sitio
robots.txt / sitemap.xml   SEO técnico
tsconfig.json             rootDir ./ts, outDir ./js, strict: true
```

Las 3 páginas comparten el mismo esqueleto: header con logo + nav (hamburguesa
en móvil, barra inline desde 768px) + footer. No hay páginas internas ni
sistema de roles/sesión — todo el sitio es público.

## Comandos

- `npm install` — instala TypeScript (única dependencia del proyecto).
- `npx tsc` — compila `ts/**/*.ts` → `js/`. `tsconfig.json` ya trae
  `rootDir`/`outDir` configurados, así que alcanza con correrlo desde la raíz.
- No hay servidor de desarrollo propio: `npx serve .` sirve el sitio estático
  para probarlo en el navegador (HTML/CSS no necesitan build).

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
genérica y sí aplican tal cual, aunque `check-seo.md` menciona "las 4
páginas" — este proyecto tiene 3.

## Ver también

`PLAN.md` — pendientes del proyecto y decisiones de arquitectura ya tomadas.
