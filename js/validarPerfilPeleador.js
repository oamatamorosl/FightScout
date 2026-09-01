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
    // Convierte un <input type="date"> ("YYYY-MM-DD") a Date en hora local —
    // mismo motivo que en calcularEdad: evita el desfasaje de interpretar el
    // string como medianoche UTC al compararlo contra la fecha de hoy.
    function aFecha(valor) {
        const partes = valor.split('-');
        if (partes.length !== 3)
            return null;
        const [anio, mes, dia] = partes.map(Number);
        if (!Number.isFinite(anio) || !Number.isFinite(mes) || !Number.isFinite(dia))
            return null;
        return new Date(anio, mes - 1, dia);
    }
    // Calcula la edad a partir de un <input type="date"> (formato "YYYY-MM-DD").
    // Arma la fecha con año/mes/día sueltos en vez de "new Date(fechaNacimiento)"
    // a propósito: un string de solo fecha se interpreta como medianoche UTC,
    // mientras que "new Date()" da la hora local — comparar ambas directamente
    // puede correr la edad un día según la zona horaria de quien complete el
    // formulario. Construyendo los dos Date en hora local se evita ese desfasaje.
    function calcularEdad(fechaNacimiento) {
        const partes = fechaNacimiento.split('-');
        if (partes.length !== 3)
            return null;
        const [anio, mes, dia] = partes.map(Number);
        if (!Number.isFinite(anio) || !Number.isFinite(mes) || !Number.isFinite(dia))
            return null;
        const nacimiento = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const noCumplioAnioTodavia = hoy.getMonth() < nacimiento.getMonth() ||
            (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
        if (noCumplioAnioTodavia)
            edad -= 1;
        return edad;
    }
    // Divisiones de peso oficiales por disciplina. El value es estable y en
    // minúsculas (sin el límite): así el dato guardado no depende de si más
    // adelante cambia el texto visible (ej. se agrega el límite en kg también).
    const DIVISIONES_BOXEO = [
        { value: 'peso-pesado', etiqueta: 'Peso pesado (201+ lb)' },
        { value: 'peso-crucero', etiqueta: 'Peso crucero (200 lb)' },
        { value: 'peso-semipesado', etiqueta: 'Peso semipesado (175 lb)' },
        { value: 'peso-super-mediano', etiqueta: 'Peso súper mediano (168 lb)' },
        { value: 'peso-mediano', etiqueta: 'Peso mediano (160 lb)' },
        { value: 'peso-mediano-junior', etiqueta: 'Peso mediano junior (154 lb)' },
        { value: 'peso-welter', etiqueta: 'Peso welter (147 lb)' },
        { value: 'peso-welter-junior', etiqueta: 'Peso welter junior (140 lb)' },
        { value: 'peso-ligero', etiqueta: 'Peso ligero (135 lb)' },
        { value: 'peso-ligero-juvenil', etiqueta: 'Peso ligero juvenil (130 lb)' },
        { value: 'peso-pluma', etiqueta: 'Peso pluma (126 lb)' },
        { value: 'peso-pluma-junior', etiqueta: 'Peso pluma junior (122 lb)' },
        { value: 'peso-gallo', etiqueta: 'Peso gallo (118 lb)' },
        { value: 'peso-gallo-junior', etiqueta: 'Peso gallo junior (115 lb)' },
        { value: 'peso-mosca', etiqueta: 'Peso mosca (112 lb)' },
        { value: 'peso-mosca-junior', etiqueta: 'Peso mosca junior (108 lb)' },
        { value: 'peso-paja', etiqueta: 'Peso paja (105 lb)' },
    ];
    const DIVISIONES_MMA = [
        { value: 'peso-pesado', etiqueta: 'Peso pesado (206–265 lb)' },
        { value: 'peso-semipesado', etiqueta: 'Peso semipesado (205 lb)' },
        { value: 'peso-mediano', etiqueta: 'Peso mediano (185 lb)' },
        { value: 'peso-welter', etiqueta: 'Peso welter (170 lb)' },
        { value: 'peso-ligero', etiqueta: 'Peso ligero (155 lb)' },
        { value: 'peso-pluma', etiqueta: 'Peso pluma (145 lb)' },
        { value: 'peso-gallo', etiqueta: 'Peso gallo (135 lb)' },
        { value: 'peso-mosca', etiqueta: 'Peso mosca (125 lb)' },
        { value: 'peso-paja', etiqueta: 'Peso paja (115 lb)' },
    ];
    const DIVISIONES_POR_DISCIPLINA = {
        boxeo: DIVISIONES_BOXEO,
        mma: DIVISIONES_MMA,
    };
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
            id: 'birthDate',
            validar: (valor) => {
                if (valor.trim() === '')
                    return 'Ingresa tu fecha de nacimiento.';
                const edad = calcularEdad(valor);
                if (edad === null)
                    return 'Ingresa una fecha de nacimiento válida.';
                if (edad < 18)
                    return 'Debes ser mayor de 18 años para registrarte.';
                return null;
            },
        },
        {
            id: 'discipline',
            validar: (valor) => (valor ? null : 'Selecciona tu disciplina.'),
        },
        {
            id: 'weightClass',
            validar: (valor) => (valor ? null : 'Selecciona tu división de peso.'),
        },
        {
            id: 'stance',
            validar: (valor) => (valor ? null : 'Selecciona tu guardia.'),
        },
        {
            id: 'height',
            validar: (valor) => {
                const estatura = aEntero(valor);
                if (estatura === null)
                    return 'Ingresa tu estatura.';
                if (estatura < 120)
                    return 'La estatura mínima es 120 cm.';
                if (estatura > 230)
                    return 'La estatura máxima es 230 cm.';
                return null;
            },
        },
        {
            id: 'reach',
            validar: (valor) => {
                const alcance = aEntero(valor);
                if (alcance === null)
                    return 'Ingresa tu alcance.';
                if (alcance < 120)
                    return 'El alcance mínimo es 120 cm.';
                if (alcance > 250)
                    return 'El alcance máximo es 250 cm.';
                return null;
            },
        },
        {
            id: 'walkAroundWeight',
            validar: (valor) => {
                if (valor.trim() === '')
                    return null;
                const peso = aDecimal(valor);
                if (peso === null || peso <= 0)
                    return 'Ingresa un peso natural válido.';
                return null;
            },
        },
        {
            id: 'fighterType',
            validar: (valor) => (valor ? null : 'Selecciona si sos amateur o profesional.'),
        },
        {
            id: 'debutDate',
            validar: (valor, datos) => {
                // Solo es obligatorio (y solo tiene sentido validar) si el peleador
                // se identificó como profesional — ver la cascada más abajo.
                if (datos.fighterType !== 'profesional')
                    return null;
                if (valor.trim() === '')
                    return 'Ingresa tu fecha de debut profesional.';
                const debut = aFecha(valor);
                if (debut === null)
                    return 'Ingresa una fecha de debut válida.';
                const hoy = new Date();
                const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                if (debut > hoySinHora)
                    return 'La fecha de debut no puede ser futura.';
                return null;
            },
        },
        {
            id: 'trainingYears',
            validar: (valor, datos) => {
                // Solo obligatorio si el peleador se identificó como amateur.
                if (datos.fighterType !== 'amateur')
                    return null;
                if (valor.trim() === '')
                    return 'Ingresa cuántos años llevas entrenando.';
                const anios = aEntero(valor);
                if (anios === null || anios < 0)
                    return 'Ingresa un número válido de años.';
                if (anios > 60)
                    return 'Revisa el número de años ingresado.';
                return null;
            },
        },
        {
            id: 'achievements',
            validar: (valor) => (valor.length > 600 ? 'Máximo 600 caracteres.' : null),
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
        {
            // Cadena de tres niveles: firstRoundKos ≤ knockouts (acá abajo) y
            // knockouts ≤ wins (arriba, sin tocar) — por transitividad,
            // firstRoundKos también queda acotado por wins.
            id: 'firstRoundKos',
            validar: (valor, datos) => {
                var _a;
                if (valor.trim() === '')
                    return null;
                const primerRound = aEntero(valor);
                if (primerRound === null || primerRound < 0) {
                    return 'Los nocauts en el primer round no pueden ser negativos.';
                }
                const nocautsTotales = aEntero((_a = datos.knockouts) !== null && _a !== void 0 ? _a : '');
                if (nocautsTotales !== null && primerRound > nocautsTotales) {
                    return 'Los nocauts en el primer round no pueden superar tus nocauts totales.';
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
        // El color/ícono del campo los decide el CSS (:invalid). Acá solo le
        // avisamos a la plataforma que es inválido —también cubre reglas que
        // el HTML nativo no puede expresar, como "nocauts ≤ victorias"— y
        // dejamos el mensaje accesible en su propio elemento.
        campo.setCustomValidity(mensaje);
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
        campo.setCustomValidity('');
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
        // Un campo deshabilitado (ej. weightClass antes de elegir disciplina)
        // queda fuera de la validación nativa del navegador — lo tratamos igual,
        // para no mostrar "Selecciona tu división de peso" sobre un select que
        // todavía no se puede tocar.
        if (campo.disabled) {
            limpiarError(campo);
            return true;
        }
        const mensaje = config.validar(campo.value, recolectarDatos());
        if (mensaje) {
            mostrarError(campo, mensaje);
            return false;
        }
        limpiarError(campo);
        return true;
    }
    // Cascada disciplina → división de peso: weightClass arranca deshabilitado
    // y solo se puebla (con las divisiones reales de esa disciplina) una vez
    // que se elige disciplina.
    const disciplineEl = obtenerCampo('discipline');
    const weightClassEl = obtenerCampo('weightClass');
    if (disciplineEl instanceof HTMLSelectElement && weightClassEl instanceof HTMLSelectElement) {
        disciplineEl.addEventListener('change', () => {
            // Siempre arranca de cero: evita que quede seleccionada una división
            // de MMA después de cambiar la disciplina a Boxeo (o viceversa).
            weightClassEl.innerHTML = '';
            limpiarError(weightClassEl);
            const divisiones = DIVISIONES_POR_DISCIPLINA[disciplineEl.value];
            if (!divisiones) {
                const placeholder = document.createElement('option');
                placeholder.value = '';
                placeholder.textContent = 'Primero elige disciplina';
                weightClassEl.appendChild(placeholder);
                weightClassEl.disabled = true;
                return;
            }
            const placeholder = document.createElement('option');
            placeholder.value = '';
            placeholder.textContent = 'Selecciona tu división de peso';
            weightClassEl.appendChild(placeholder);
            divisiones.forEach((division) => {
                const opcion = document.createElement('option');
                opcion.value = division.value;
                opcion.textContent = division.etiqueta;
                weightClassEl.appendChild(opcion);
            });
            weightClassEl.disabled = false;
        });
    }
    // Cascada tipo de peleador → debut profesional / años entrenando: son
    // mutuamente excluyentes, cada uno se muestra y se vuelve obligatorio solo
    // para el tipo que le corresponde; el otro se oculta, deja de ser
    // obligatorio y se limpia.
    function alternarCampoCondicional(campo, contenedor, activo) {
        contenedor.classList.toggle('oculto', !activo);
        campo.required = activo;
        if (!activo) {
            campo.value = '';
            limpiarError(campo);
        }
    }
    const fighterTypeEl = obtenerCampo('fighterType');
    const debutDateEl = obtenerCampo('debutDate');
    const trainingYearsEl = obtenerCampo('trainingYears');
    if (fighterTypeEl instanceof HTMLSelectElement &&
        debutDateEl instanceof HTMLInputElement &&
        trainingYearsEl instanceof HTMLInputElement) {
        const debutDateCampo = obtenerContenedor(debutDateEl);
        const trainingYearsCampo = obtenerContenedor(trainingYearsEl);
        fighterTypeEl.addEventListener('change', () => {
            const esProfesional = fighterTypeEl.value === 'profesional';
            const esAmateur = fighterTypeEl.value === 'amateur';
            alternarCampoCondicional(debutDateEl, debutDateCampo, esProfesional);
            alternarCampoCondicional(trainingYearsEl, trainingYearsCampo, esAmateur);
        });
    }
    // Cascada nocauts totales → nocauts en el primer round: firstRoundKos
    // arranca deshabilitado y solo se habilita cuando knockouts tiene un
    // valor ≥ 1. Usa 'input' (no 'change') para que la revalidación sea
    // inmediata mientras se escribe, no recién al salir del campo.
    const knockoutsEl = obtenerCampo('knockouts');
    const firstRoundKosEl = obtenerCampo('firstRoundKos');
    if (knockoutsEl instanceof HTMLInputElement && firstRoundKosEl instanceof HTMLInputElement) {
        knockoutsEl.addEventListener('input', () => {
            const nocautsTotales = aEntero(knockoutsEl.value);
            if (nocautsTotales !== null && nocautsTotales >= 1) {
                firstRoundKosEl.disabled = false;
            }
            else {
                firstRoundKosEl.disabled = true;
                firstRoundKosEl.value = '';
                limpiarError(firstRoundKosEl);
            }
            // Si knockouts baja de 2 a 1 y firstRoundKos ya tenía 2 cargado, el
            // error debe aparecer al instante, sin esperar a que el peleador
            // toque firstRoundKos.
            validarUnCampo('firstRoundKos');
        });
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