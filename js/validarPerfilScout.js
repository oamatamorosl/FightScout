"use strict";
// Validación del formulario "Crear cuenta de scout" (registroScout.html).
(function initValidacionPerfilScout() {
    const formulario = document.getElementById('formPerfilScout');
    if (!formulario)
        return;
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validadores = [
        {
            id: 'firstName',
            validar: (valor) => {
                const nombre = valor.trim();
                if (!nombre)
                    return 'Ingresa tu nombre.';
                if (nombre.length < 2)
                    return 'El nombre debe tener al menos 2 caracteres.';
                return null;
            },
        },
        {
            id: 'lastName',
            validar: (valor) => {
                const apellido = valor.trim();
                if (!apellido)
                    return 'Ingresa tu apellido.';
                if (apellido.length < 2)
                    return 'El apellido debe tener al menos 2 caracteres.';
                return null;
            },
        },
        {
            id: 'email',
            validar: (valor) => {
                const correo = valor.trim();
                if (!correo)
                    return 'Ingresa tu correo electrónico.';
                if (!patronCorreo.test(correo))
                    return 'Ingresa un correo electrónico válido.';
                return null;
            },
        },
        {
            id: 'country',
            validar: (valor) => (valor ? null : 'Selecciona tu país.'),
        },
        {
            id: 'role',
            validar: (valor) => (valor ? null : 'Selecciona tu rol.'),
        },
        {
            id: 'bio',
            validar: (valor) => (valor.length > 400 ? 'Máximo 400 caracteres.' : null),
        },
    ];
    // Type guard: confirma en runtime que el elemento es uno de los que sabemos validar,
    // en vez de simplemente afirmarlo con "as" (que no comprueba nada al ejecutarse).
    function esCampoValidable(el) {
        return (el instanceof HTMLInputElement ||
            el instanceof HTMLSelectElement ||
            el instanceof HTMLTextAreaElement);
    }
    function obtenerCampo(id) {
        const el = document.getElementById(id);
        return esCampoValidable(el) ? el : null;
    }
    function obtenerContenedor(campo) {
        var _a, _b;
        return (_b = (_a = campo.closest('.campo')) !== null && _a !== void 0 ? _a : campo.parentElement) !== null && _b !== void 0 ? _b : campo;
    }
    function mostrarError(campo, mensaje) {
        campo.classList.add('campo-invalido');
        campo.setAttribute('aria-invalid', 'true');
        const contenedor = obtenerContenedor(campo);
        const idError = `${campo.id}-error`;
        let error = contenedor.querySelector('.error-campo');
        if (!error) {
            error = document.createElement('p');
            error.className = 'error-campo';
            error.id = idError;
            contenedor.appendChild(error);
        }
        error.textContent = mensaje;
        campo.setAttribute('aria-describedby', idError);
    }
    function limpiarError(campo) {
        campo.classList.remove('campo-invalido');
        campo.removeAttribute('aria-invalid');
        campo.removeAttribute('aria-describedby');
        const contenedor = obtenerContenedor(campo);
        const error = contenedor.querySelector('.error-campo');
        if (error)
            error.remove();
    }
    function validarUnCampo(id) {
        const config = validadores.find((v) => v.id === id);
        const campo = obtenerCampo(id);
        if (!config || !campo)
            return true;
        const mensaje = config.validar(campo.value);
        if (mensaje) {
            mostrarError(campo, mensaje);
            return false;
        }
        limpiarError(campo);
        return true;
    }
    // Feedback en vivo: revalida un campo apenas el scout lo abandona.
    validadores.forEach(({ id }) => {
        const campo = obtenerCampo(id);
        if (!campo)
            return;
        const evento = campo.tagName === 'SELECT' ? 'change' : 'blur';
        campo.addEventListener(evento, () => validarUnCampo(id));
    });
    function mostrarConfirmacion() {
        var _a;
        let confirmacion = formulario.querySelector('.formulario-confirmacion');
        if (!confirmacion) {
            confirmacion = document.createElement('p');
            confirmacion.className = 'formulario-confirmacion';
            confirmacion.setAttribute('role', 'status');
            (_a = formulario.querySelector('.acciones-form')) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement('beforebegin', confirmacion);
        }
        confirmacion.textContent = 'Cuenta validada correctamente. (Demo: aún no se envía a un servidor.)';
    }
    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault();
        let primerCampoInvalido = null;
        validadores.forEach(({ id }) => {
            const esValido = validarUnCampo(id);
            if (!esValido && !primerCampoInvalido) {
                primerCampoInvalido = obtenerCampo(id);
            }
        });
        if (primerCampoInvalido) {
            primerCampoInvalido.focus();
            return;
        }
        mostrarConfirmacion();
    });
})();
//# sourceMappingURL=validarPerfilScout.js.map