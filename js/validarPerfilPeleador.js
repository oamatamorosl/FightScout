"use strict";
// Validación del formulario "Crear perfil de peleador" (registro.html).
(function initValidacionPerfilPeleador() {
    const formulario = document.getElementById('formPerfilPeleador');
    if (!formulario)
        return;
    function aEntero(valor) {
        const limpio = valor.trim();
        if (!/^-?\d+$/.test(limpio))
            return null;
        return parseInt(limpio, 10);
    }
    function aDecimal(valor) {
        const limpio = valor.trim();
        if (limpio === '')
            return null;
        const numero = Number(limpio);
        return Number.isFinite(numero) ? numero : null;
    }
    const validadores = [
        {
            id: 'fighterName',
            validar: (valor) => {
                const nombre = valor.trim();
                if (!nombre)
                    return 'Ingresa tu nombre completo.';
                if (nombre.length < 3)
                    return 'El nombre debe tener al menos 3 caracteres.';
                return null;
            },
        },
        {
            id: 'country',
            validar: (valor) => (valor ? null : 'Selecciona tu país.'),
        },
        {
            id: 'age',
            validar: (valor) => {
                const edad = aEntero(valor);
                if (edad === null)
                    return 'Ingresa tu edad.';
                if (edad < 18)
                    return 'Debes ser mayor de 18 años.';
                if (edad > 60)
                    return 'La edad máxima permitida es 60 años.';
                return null;
            },
        },
        {
            id: 'weight',
            validar: (valor) => {
                const peso = aDecimal(valor);
                if (peso === null)
                    return 'Ingresa tu peso.';
                if (peso < 40)
                    return 'El peso mínimo es 40.';
                if (peso > 200)
                    return 'El peso máximo es 200.';
                return null;
            },
        },
        {
            id: 'weightUnit',
            validar: (valor) => (valor ? null : 'Selecciona la unidad de peso.'),
        },
        {
            id: 'discipline',
            validar: (valor) => (valor ? null : 'Selecciona tu disciplina.'),
        },
        {
            id: 'stance',
            validar: (valor) => (valor ? null : 'Selecciona tu guardia.'),
        },
        {
            id: 'style',
            validar: (valor) => (valor.length > 400 ? 'Máximo 400 caracteres.' : null),
        },
        {
            id: 'wins',
            validar: (valor) => {
                const victorias = aEntero(valor);
                if (victorias === null)
                    return 'Ingresa el número de victorias.';
                if (victorias < 0)
                    return 'Las victorias no pueden ser negativas.';
                return null;
            },
        },
        {
            id: 'losses',
            validar: (valor) => {
                const derrotas = aEntero(valor);
                if (derrotas === null)
                    return 'Ingresa el número de derrotas.';
                if (derrotas < 0)
                    return 'Las derrotas no pueden ser negativas.';
                return null;
            },
        },
        {
            id: 'draws',
            validar: (valor) => {
                if (valor.trim() === '')
                    return null;
                const empates = aEntero(valor);
                if (empates === null || empates < 0)
                    return 'Los empates no pueden ser negativos.';
                return null;
            },
        },
        {
            id: 'knockouts',
            validar: (valor, datos) => {
                var _a;
                if (valor.trim() === '')
                    return null;
                const nocauts = aEntero(valor);
                if (nocauts === null || nocauts < 0)
                    return 'Los nocauts no pueden ser negativos.';
                const victorias = aEntero((_a = datos.wins) !== null && _a !== void 0 ? _a : '');
                if (victorias !== null && nocauts > victorias) {
                    return 'Los nocauts no pueden superar tus victorias.';
                }
                return null;
            },
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
    function recolectarDatos() {
        const datos = {};
        validadores.forEach(({ id }) => {
            var _a;
            var _b;
            datos[id] = (_b = (_a = obtenerCampo(id)) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '';
        });
        return datos;
    }
    function validarUnCampo(id) {
        const config = validadores.find((v) => v.id === id);
        const campo = obtenerCampo(id);
        if (!config || !campo)
            return true;
        const mensaje = config.validar(campo.value, recolectarDatos());
        if (mensaje) {
            mostrarError(campo, mensaje);
            return false;
        }
        limpiarError(campo);
        return true;
    }
    // Feedback en vivo: revalida un campo apenas el peleador lo abandona.
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
        confirmacion.textContent = 'Perfil validado correctamente. (Demo: aún no se envía a un servidor.)';
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
//# sourceMappingURL=validarPerfilPeleador.js.map