// Menú de navegación: hamburguesa + drawer (móvil). Compartido por las 3 páginas.
(function initNavDrawer(): void {
  const toggle = document.getElementById('navToggle') as HTMLButtonElement | null;
  const nav = document.getElementById('navPrincipal') as HTMLElement | null;
  const backdrop = document.getElementById('navBackdrop') as HTMLElement | null;

  if (!toggle || !nav || !backdrop) return;

  function abrirMenu(): void {
    nav!.classList.add('nav-drawer-abierto');
    backdrop!.hidden = false;
    toggle!.setAttribute('aria-expanded', 'true');
    toggle!.classList.add('nav-toggle-activo');
    document.body.classList.add('nav-bloqueo-scroll');
  }

  function cerrarMenu(): void {
    nav!.classList.remove('nav-drawer-abierto');
    backdrop!.hidden = true;
    toggle!.setAttribute('aria-expanded', 'false');
    toggle!.classList.remove('nav-toggle-activo');
    document.body.classList.remove('nav-bloqueo-scroll');
  }

  toggle.addEventListener('click', () => {
    const estaAbierto = toggle!.getAttribute('aria-expanded') === 'true';
    if (estaAbierto) {
      cerrarMenu();
    } else {
      abrirMenu();
    }
  });

  backdrop.addEventListener('click', cerrarMenu);

  // Cierra el drawer al elegir un enlace (útil en móvil, tras navegar).
  nav.addEventListener('click', (evento: MouseEvent) => {
    const objetivo = evento.target as HTMLElement;
    if (objetivo.tagName === 'A') {
      cerrarMenu();
    }
  });

  document.addEventListener('keydown', (evento: KeyboardEvent) => {
    if (evento.key === 'Escape' && toggle!.getAttribute('aria-expanded') === 'true') {
      cerrarMenu();
      toggle!.focus();
    }
  });

  // Si la ventana crece a escritorio con el drawer abierto, lo resetea.
  const mediaEscritorio = window.matchMedia('(min-width: 768px)');
  mediaEscritorio.addEventListener('change', (evento: MediaQueryListEvent) => {
    if (evento.matches) {
      cerrarMenu();
    }
  });
})();
