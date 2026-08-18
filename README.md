# FightScout

Landing page y formularios de registro para una plataforma de scouting de MMA y boxeo en Latinoamérica. Peleadores crean un perfil verificado; scouts y coaches lo encuentran por estilo, disciplina y récord.

Repositorio: https://github.com/oamatamorosl/FightScout

## Estructura del proyecto

```
index.html            Landing page
registro.html          Formulario de creación de perfil de peleador
registroScout.html      Formulario de creación de cuenta de scout
css/styles.css         Hoja de estilos única (mobile-first, variables, Flexbox/Grid)
ts/                    Fuente TypeScript (strict)
  nav.ts                 Menú hamburguesa + drawer (compartido por las 3 páginas)
  validarPerfilPeleador.ts   Validación del formulario de registro.html
  validarPerfilScout.ts      Validación del formulario de registroScout.html
js/                    Salida compilada de ts/ (generada, no editar a mano)
robots.txt / sitemap.xml   SEO técnico
favicon.svg             Ícono del sitio
```

## Cómo verlo localmente

No requiere build para HTML/CSS: cualquier servidor estático sirve. Por ejemplo:

```bash
npx serve .
```

y abrir la URL que imprime en consola (o abrir `index.html` directo en el navegador).

## Cómo compilar TypeScript

Los archivos fuente están en `ts/` y se compilan a `js/` (referenciado por los `<script>` de cada página):

```bash
npm install   # instala TypeScript (devDependency)
npx tsc       # compila ts/**/*.ts -> js/ en modo strict
```

`tsconfig.json` ya apunta `rootDir` a `./ts` y `outDir` a `./js`, así que basta con `npx tsc` desde la raíz.
