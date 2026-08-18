"use strict";
// Menú de navegación: hamburguesa + drawer (móvil). Compartido por las 3 páginas.
(function initNavDrawer() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('navPrincipal');
    const backdrop = document.getElementById('navBackdrop');
    if (!toggle || !nav || !backdrop)
        return;
    function abrirMenu() {
        nav.classList.add('nav-drawer-abierto');
        backdrop.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('nav-toggle-activo');
        document.body.classList.add('nav-bloqueo-scroll');
    }
    function cerrarMenu() {
        nav.classList.remove('nav-drawer-abierto');
        backdrop.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('nav-toggle-activo');
        document.body.classList.remove('nav-bloqueo-scroll');
    }
    toggle.addEventListener('click', () => {
        const estaAbierto = toggle.getAttribute('aria-expanded') === 'true';
        if (estaAbierto) {
            cerrarMenu();
        }
        else {
            abrirMenu();
        }
    });
    backdrop.addEventListener('click', cerrarMenu);
    // Cierra el drawer al elegir un enlace (útil en móvil, tras navegar).
    nav.addEventListener('click', (evento) => {
        const objetivo = evento.target;
        if (objetivo.tagName === 'A') {
            cerrarMenu();
        }
    });
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            cerrarMenu();
            toggle.focus();
        }
    });
    // Si la ventana crece a escritorio con el drawer abierto, lo resetea.
    const mediaEscritorio = window.matchMedia('(min-width: 768px)');
    mediaEscritorio.addEventListener('change', (evento) => {
        if (evento.matches) {
            cerrarMenu();
        }
    });
})();
//# sourceMappingURL=nav.js.map