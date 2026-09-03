"use strict";
// Comportamiento de los componentes de interacción del playground de
// backoffice (playground.html): Dialogs, Menús y Toasts.
(function initPlayground() {
    // ===== DIALOGS =====
    // Confirmación de eliminación con <dialog> nativo, abierto como modal
    // real (.showModal(), nunca .show() ni confirm()).
    function inicializarDialogEliminar() {
        const trigger = document.getElementById('triggerDialogEliminar');
        const dialogo = document.getElementById('dialogEliminarPerfil');
        const btnCancelar = document.getElementById('dialogEliminarCancelar');
        const btnConfirmar = document.getElementById('dialogEliminarConfirmar');
        if (!(trigger instanceof HTMLButtonElement) ||
            !(dialogo instanceof HTMLDialogElement) ||
            !(btnCancelar instanceof HTMLButtonElement) ||
            !(btnConfirmar instanceof HTMLButtonElement)) {
            return;
        }
        trigger.addEventListener('click', () => {
            // Modal real: el navegador atrapa el foco dentro del <dialog> y
            // bloquea la interacción con el resto de la página mientras esté
            // abierto — comportamiento nativo de showModal(), no hay que
            // reimplementarlo.
            dialogo.showModal();
        });
        btnCancelar.addEventListener('click', () => {
            dialogo.close();
        });
        btnConfirmar.addEventListener('click', () => {
            // Demo del playground: sin backend, solo cierra el diálogo.
            dialogo.close();
        });
        // Escape también dispara 'close' de forma nativa. El navegador NO
        // garantiza devolver el foco al disparador original al cerrarse —
        // lo hacemos explícito acá, para cualquier vía de cierre.
        dialogo.addEventListener('close', () => {
            trigger.focus();
        });
    }
    // ===== MENÚS =====
    // Disclosure widget simple (mismo patrón que el drawer de ts/nav.ts):
    // aria-expanded, sin role="menu"/"menuitem" porque no implementamos
    // navegación con flechas — agregar esos roles sin ese comportamiento
    // sería peor que no ponerlos.
    function inicializarMenuDesplegable(idToggle, idLista) {
        const toggle = document.getElementById(idToggle);
        const lista = document.getElementById(idLista);
        if (!(toggle instanceof HTMLButtonElement) || !(lista instanceof HTMLUListElement)) {
            return;
        }
        function abrirMenu() {
            lista.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
        }
        function cerrarMenu() {
            lista.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');
        }
        toggle.addEventListener('click', (evento) => {
            // Sin esto, el listener de "clic afuera" (más abajo) vería este
            // mismo clic burbujeando hasta document y cerraría el menú apenas
            // se abre.
            evento.stopPropagation();
            const estaAbierto = toggle.getAttribute('aria-expanded') === 'true';
            if (estaAbierto) {
                cerrarMenu();
            }
            else {
                abrirMenu();
            }
        });
        document.addEventListener('click', (evento) => {
            const objetivo = evento.target;
            if (!(objetivo instanceof Node))
                return;
            const estaAbierto = toggle.getAttribute('aria-expanded') === 'true';
            if (estaAbierto && !lista.contains(objetivo) && !toggle.contains(objetivo)) {
                cerrarMenu();
            }
        });
        document.addEventListener('keydown', (evento) => {
            if (evento.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
                cerrarMenu();
                toggle.focus();
            }
        });
    }
    // ===== TOASTS =====
    // No son foco-interactivos: se anuncian solos vía aria-live="polite" en
    // el contenedor, nunca le sacan el foco a lo que el usuario esté
    // haciendo, se retiran solos, y nunca hay más de 3 visibles a la vez.
    function inicializarToasts() {
        const contenedor = document.getElementById('toastContainer');
        if (!(contenedor instanceof HTMLElement))
            return;
        const disparador = document.getElementById('toastDemoTrigger');
        const DURACION_MS = 5000;
        const MAX_VISIBLES = 3;
        function eliminarToast(toast) {
            toast.remove();
        }
        function programarEliminacion(toast) {
            window.setTimeout(() => eliminarToast(toast), DURACION_MS);
        }
        function agregarToast(tipo, mensaje) {
            // El máximo de 3 se cumple retirando el toast visible más antiguo,
            // nunca bloqueando la interacción para hacer lugar al nuevo.
            const visibles = contenedor.querySelectorAll('.c-toast');
            if (visibles.length >= MAX_VISIBLES) {
                eliminarToast(visibles[0]);
            }
            const toast = document.createElement('div');
            toast.className = `c-toast c-toast--${tipo}`;
            const mensajeEl = document.createElement('p');
            mensajeEl.textContent = mensaje;
            toast.appendChild(mensajeEl);
            contenedor.appendChild(toast);
            programarEliminacion(toast);
        }
        // Los dos toasts de ejemplo que ya vienen en el HTML entran al mismo
        // ciclo de vida que uno creado dinámicamente — también se retiran solos.
        contenedor.querySelectorAll('.c-toast').forEach(programarEliminacion);
        // Botón de demo (reutiliza c-btn/c-btn--secondary, no es un componente
        // nuevo) para disparar toasts y ver el comportamiento real en vivo.
        if (disparador instanceof HTMLButtonElement) {
            let contador = 0;
            disparador.addEventListener('click', () => {
                contador += 1;
                const tipo = contador % 2 === 0 ? 'error' : 'success';
                const mensaje = tipo === 'success'
                    ? `Perfil #${contador} verificado correctamente.`
                    : `No se pudo verificar el perfil #${contador}.`;
                agregarToast(tipo, mensaje);
            });
        }
    }
    inicializarDialogEliminar();
    inicializarMenuDesplegable('menuTextoToggle', 'menuTextoLista');
    inicializarMenuDesplegable('menuIconoToggle', 'menuIconoLista');
    inicializarToasts();
})();
//# sourceMappingURL=playground.js.map