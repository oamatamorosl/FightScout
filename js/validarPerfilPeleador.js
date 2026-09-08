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
    // Estilos de pelea por disciplina — mismo patrón que las divisiones de
    // peso: el checkbox de "estilo" depende de si el peleador es de boxeo o MMA.
    const ESTILOS_BOXEO = [
        { value: 'estilista', etiqueta: 'Estilista' },
        { value: 'contragolpeador', etiqueta: 'Contragolpeador' },
        { value: 'fajador', etiqueta: 'Fajador' },
    ];
    const ESTILOS_MMA = [
        { value: 'striker', etiqueta: 'Striker' },
        { value: 'grappler', etiqueta: 'Grappler' },
        { value: 'mixto', etiqueta: 'Mixto' },
    ];
    const ESTILOS_POR_DISCIPLINA = {
        boxeo: ESTILOS_BOXEO,
        mma: ESTILOS_MMA,
    };
    // Métodos de victoria por disciplina: MMA suma "por sumisión" (no aplica
    // en boxeo). El "name" es el id/name real del <input> que se crea en
    // poblarMetodosVictoria.
    const METODOS_BOXEO = [
        { name: 'methodKo', etiqueta: 'Por KO' },
        { name: 'methodTko', etiqueta: 'Por TKO' },
        { name: 'methodDec', etiqueta: 'Por decisión' },
        { name: 'methodDq', etiqueta: 'Por descalificación' },
    ];
    const METODOS_MMA = [
        { name: 'methodKo', etiqueta: 'Por KO' },
        { name: 'methodTko', etiqueta: 'Por TKO' },
        { name: 'methodSub', etiqueta: 'Por sumisión' },
        { name: 'methodDec', etiqueta: 'Por decisión' },
        { name: 'methodDq', etiqueta: 'Por descalificación' },
    ];
    const METODOS_POR_DISCIPLINA = {
        boxeo: METODOS_BOXEO,
        mma: METODOS_MMA,
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
            id: 'nationality',
            validar: (valor) => (valor ? null : 'Selecciona tu nacionalidad.'),
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
            id: 'residenceCountry',
            validar: (valor) => (valor ? null : 'Selecciona tu país de residencia actual.'),
        },
        {
            id: 'residenceCityState',
            validar: (valor) => (valor.trim() === '' ? 'Ingresa tu ciudad y estado de residencia.' : null),
        },
        {
            id: 'city',
            validar: (valor) => (valor.trim() === '' ? 'Ingresa tu ciudad.' : null),
        },
        {
            id: 'stateProvince',
            validar: (valor) => (valor.trim() === '' ? 'Ingresa tu estado o provincia.' : null),
        },
        // "gym" no tiene validador, igual que "nickname": es de texto libre y
        // opcional, sin ninguna regla que pueda hacerlo inválido.
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
            id: 'competitiveLevel',
            validar: (valor) => (valor ? null : 'Selecciona si sos amateur o profesional.'),
        },
        {
            id: 'debutDate',
            validar: (valor, datos) => {
                // Solo es obligatorio (y solo tiene sentido validar) si el peleador
                // se identificó como profesional — ver la cascada más abajo.
                if (datos.competitiveLevel !== 'profesional')
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
                if (datos.competitiveLevel !== 'amateur')
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
            id: 'competitiveStatus',
            validar: (valor) => (valor ? null : 'Selecciona tu estado competitivo.'),
        },
        {
            id: 'availableToFight',
            validar: (valor) => (valor ? null : 'Indica si estás disponible para pelear.'),
        },
        {
            id: 'lastFightDate',
            validar: (valor) => {
                if (valor.trim() === '')
                    return null;
                const ultimaPelea = aFecha(valor);
                if (ultimaPelea === null)
                    return 'Ingresa una fecha de última pelea válida.';
                const hoy = new Date();
                const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                if (ultimaPelea > hoySinHora)
                    return 'La fecha de última pelea no puede ser futura.';
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
            id: 'noContests',
            validar: (valor) => {
                if (valor.trim() === '')
                    return null;
                const sinResultado = aEntero(valor);
                if (sinResultado === null || sinResultado < 0)
                    return 'No puede ser negativo.';
                return null;
            },
        },
        {
            // TEMPORAL (Fase C1): "knockouts" se eliminó (ahora la victoria por
            // KO/TKO vive en los métodos de victoria dinámicos, más abajo), así
            // que este validador ya no puede compararse contra nocauts totales.
            // Queda validando solo ≥ 0 hasta que la Fase C2 lo reconecte contra
            // methodKo + methodTko.
            id: 'firstRoundKos',
            validar: (valor) => {
                if (valor.trim() === '')
                    return null;
                const primerRound = aEntero(valor);
                if (primerRound === null || primerRound < 0) {
                    return 'Los nocauts en el primer round no pueden ser negativos.';
                }
                return null;
            },
        },
    ];
    // Grupos de checkboxes: a diferencia de "validadores" (un id → un input),
    // acá un "name" identifica a varios <input type="checkbox"> hermanos y la
    // regla siempre es la misma — al menos uno marcado. martialArts solo se
    // valida cuando está visible (MMA); eso lo decide validarGrupoCheckbox
    // mirando la clase "oculto" del contenedor, no hace falta un caso especial acá.
    const gruposCheckbox = [
        { name: 'languages', mensaje: 'Selecciona al menos un idioma.' },
        { name: 'fightStyle', mensaje: 'Selecciona al menos un estilo de pelea.' },
        { name: 'martialArts', mensaje: 'Selecciona al menos un arte marcial.' },
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
    // ===== Grupos de checkboxes =====
    // El "campo" acá es el contenedor .campo-checkboxes completo, no un input
    // suelto: no hay un único elemento al que amarrarle setCustomValidity, así
    // que el error y el aria-describedby van en el contenedor (ver mostrarError/
    // limpiarError arriba, que hacen lo mismo pero sobre un CampoFormulario).
    function obtenerContenedorGrupo(name) {
        return document.querySelector(`.campo-checkboxes[data-grupo="${name}"]`);
    }
    function grupoEstaOculto(contenedor) {
        return contenedor.classList.contains('oculto');
    }
    function mostrarErrorGrupo(contenedor, mensaje) {
        contenedor.setAttribute('aria-invalid', 'true');
        const idError = `${contenedor.dataset.grupo}-error`;
        let error = contenedor.querySelector('.error-campo');
        if (!error) {
            error = document.createElement('p');
            error.className = 'error-campo';
            error.id = idError;
            contenedor.appendChild(error);
        }
        error.textContent = mensaje;
        contenedor.setAttribute('aria-describedby', idError);
    }
    function limpiarErrorGrupo(contenedor) {
        contenedor.removeAttribute('aria-invalid');
        contenedor.removeAttribute('aria-describedby');
        const error = contenedor.querySelector('.error-campo');
        if (error)
            error.remove();
    }
    // Al menos un checkbox marcado dentro del grupo "name". Un grupo oculto
    // (ej. martialArts en Boxeo) no es obligatorio: se limpia y se considera válido.
    function validarGrupoCheckbox(name, mensaje) {
        const contenedor = obtenerContenedorGrupo(name);
        if (!contenedor)
            return true;
        if (grupoEstaOculto(contenedor)) {
            limpiarErrorGrupo(contenedor);
            return true;
        }
        const marcados = document.querySelectorAll(`input[name="${name}"]:checked`).length;
        if (marcados === 0) {
            mostrarErrorGrupo(contenedor, mensaje);
            return false;
        }
        limpiarErrorGrupo(contenedor);
        return true;
    }
    function mensajeDeGrupo(name) {
        var _a;
        var _b;
        return (_b = (_a = gruposCheckbox.find((grupo) => grupo.name === name)) === null || _a === void 0 ? void 0 : _a.mensaje) !== null && _b !== void 0 ? _b : '';
    }
    // Revalida un grupo SOLO si ya tenía un error mostrado — así marcar o
    // desmarcar una opción en un grupo que el peleador todavía no tocó no lo
    // pone en rojo antes de tiempo, pero si ya falló en un submit, corregirlo
    // limpia el error al instante sin esperar a un nuevo intento de envío.
    function revalidarGrupoSiYaTeniaError(name) {
        const contenedor = obtenerContenedorGrupo(name);
        if (!contenedor || !contenedor.querySelector('.error-campo'))
            return;
        validarGrupoCheckbox(name, mensajeDeGrupo(name));
    }
    function agregarListenerGrupo(checkbox, name) {
        checkbox.addEventListener('change', () => revalidarGrupoSiYaTeniaError(name));
    }
    // Reconstruye las opciones de un grupo de checkboxes desde cero (mismo
    // espíritu que la cascada de weightClass: siempre arranca vacío para no
    // dejar marcada una opción de la disciplina anterior). Cada checkbox nuevo
    // sale de acá ya con su listener de revalidación en vivo enganchado.
    // conRevalidacion=false para grupos opcionales sin validación (ej.
    // alternativeWeightClasses): nunca van a mostrar un .error-campo, así que
    // el listener de revalidarGrupoSiYaTeniaError no tendría nada que hacer.
    function poblarCheckboxes(contenedorOpciones, name, opciones, conRevalidacion = true) {
        contenedorOpciones.innerHTML = '';
        opciones.forEach((opcion) => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.name = name;
            input.value = opcion.value;
            if (conRevalidacion)
                agregarListenerGrupo(input, name);
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${opcion.etiqueta}`));
            contenedorOpciones.appendChild(label);
        });
    }
    // ===== Métodos de victoria =====
    // Cada método es un <input type="number"> con su propio id/name (no un
    // checkbox): por eso NO usan el sistema de "grupos de checkboxes" de más
    // arriba, ni viven en el "validadores" genérico — son dinámicos como los
    // checkboxes (se recrean por disciplina) pero se validan individualmente
    // con mostrarError/limpiarError (los mismos que usa cualquier CampoFormulario)
    // más una regla cruzada de grupo (la suma vs. wins) mostrada en el
    // contenedor, igual en espíritu a mostrarErrorGrupo pero identificado por
    // id en vez de por data-grupo (el HTML de este contenedor no lleva data-grupo).
    let nombresMetodosVictoriaActuales = [];
    // ":scope > .error-campo" (no ".error-campo" a secas): #metodosVictoria
    // también contiene, más adentro, el .error-campo propio de cada input de
    // método individual (puesto por mostrarError). Sin acotar al hijo directo,
    // esta función encontraría y borraría el error de un método puntual
    // creyendo que era el suyo — y viceversa, ver el bug que se descubrió acá.
    function mostrarErrorMetodos(contenedor, mensaje) {
        contenedor.setAttribute('aria-invalid', 'true');
        const idError = `${contenedor.id}-error`;
        let error = contenedor.querySelector(':scope > .error-campo');
        if (!error) {
            error = document.createElement('p');
            error.className = 'error-campo';
            error.id = idError;
            contenedor.appendChild(error);
        }
        error.textContent = mensaje;
        contenedor.setAttribute('aria-describedby', idError);
    }
    function limpiarErrorMetodos(contenedor) {
        contenedor.removeAttribute('aria-invalid');
        contenedor.removeAttribute('aria-describedby');
        const error = contenedor.querySelector(':scope > .error-campo');
        if (error)
            error.remove();
    }
    function validarUnMetodoVictoria(input) {
        if (input.value.trim() === '') {
            limpiarError(input);
            return true;
        }
        const valor = aEntero(input.value);
        if (valor === null || valor < 0) {
            mostrarError(input, 'No puede ser negativo.');
            return false;
        }
        limpiarError(input);
        return true;
    }
    // Regla cruzada: la suma de los métodos vigentes no puede superar "wins"
    // — mismo espíritu que la vieja "nocauts ≤ victorias". Si wins todavía
    // está vacío o inválido, no hay con qué comparar: se deja pasar (mismo
    // criterio que usaban knockouts/firstRoundKos con datos.wins).
    function validarSumaMetodosVictoria() {
        var _a;
        const contenedor = document.getElementById('metodosVictoria');
        if (!contenedor)
            return true;
        const suma = nombresMetodosVictoriaActuales.reduce((total, name) => {
            const input = document.getElementById(name);
            const valor = input instanceof HTMLInputElement ? aEntero(input.value) : null;
            // Math.max(..., 0): un método negativo ya se marca inválido aparte
            // (validarUnMetodoVictoria) — acá no debe "restar" de la suma y
            // esconder un error real de "supera tus victorias".
            return total + Math.max(valor !== null && valor !== void 0 ? valor : 0, 0);
        }, 0);
        const winsEl = obtenerCampo('wins');
        const victorias = aEntero((_a = winsEl === null || winsEl === void 0 ? void 0 : winsEl.value) !== null && _a !== void 0 ? _a : '');
        if (victorias !== null && suma > victorias) {
            mostrarErrorMetodos(contenedor, 'La suma de los métodos de victoria no puede superar tu total de victorias.');
            return false;
        }
        limpiarErrorMetodos(contenedor);
        return true;
    }
    // Reconstruye los inputs de métodos de victoria desde cero por disciplina
    // (mismo espíritu que poblarCheckboxes/weightClass). Cada input revalida
    // su propio valor y la suma del grupo al perder el foco.
    function poblarMetodosVictoria(contenedorOpciones, metodos) {
        contenedorOpciones.innerHTML = '';
        nombresMetodosVictoriaActuales = metodos.map((metodo) => metodo.name);
        metodos.forEach((metodo) => {
            const campo = document.createElement('div');
            campo.className = 'campo';
            const label = document.createElement('label');
            label.htmlFor = metodo.name;
            label.textContent = metodo.etiqueta;
            const input = document.createElement('input');
            input.type = 'number';
            input.id = metodo.name;
            input.name = metodo.name;
            input.min = '0';
            input.addEventListener('blur', () => {
                validarUnMetodoVictoria(input);
                validarSumaMetodosVictoria();
            });
            campo.appendChild(label);
            campo.appendChild(input);
            contenedorOpciones.appendChild(campo);
        });
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
    // Divisiones alternativas: mismas divisiones que weightClass, pero como
    // checkboxes (el peleador puede marcar varias) y opcional — sin validación
    // de "al menos una", por eso NO está en gruposCheckbox.
    const alternativeWeightClassesOpcionesEl = document.getElementById('alternativeWeightClassesOpciones');
    const alternativeWeightClassesContenedor = obtenerContenedorGrupo('alternativeWeightClasses');
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
                // Sin disciplina no hay divisiones que ofrecer como alternativa.
                if (alternativeWeightClassesOpcionesEl instanceof HTMLElement) {
                    alternativeWeightClassesOpcionesEl.innerHTML = '';
                }
                alternativeWeightClassesContenedor === null || alternativeWeightClassesContenedor === void 0 ? void 0 : alternativeWeightClassesContenedor.classList.add('oculto');
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
            if (alternativeWeightClassesOpcionesEl instanceof HTMLElement) {
                poblarCheckboxes(alternativeWeightClassesOpcionesEl, 'alternativeWeightClasses', divisiones, false);
            }
            alternativeWeightClassesContenedor === null || alternativeWeightClassesContenedor === void 0 ? void 0 : alternativeWeightClassesContenedor.classList.remove('oculto');
        });
    }
    // Cascada disciplina → estilo de pelea / artes marciales / métodos de
    // victoria: fightStyle y métodos se repueblan con las opciones de la
    // disciplina elegida (mismo patrón que weightClass, pero con checkboxes o
    // inputs numéricos en vez de <option>). martialArts solo aplica a MMA: se
    // muestra/oculta como los campos condicionales de competitiveLevel, y se
    // desmarca al ocultarse para no dejar datos de un peleador que ya no es de MMA.
    const fightStyleOpcionesEl = document.getElementById('fightStyleOpciones');
    const martialArtsContenedor = obtenerContenedorGrupo('martialArts');
    const metodosVictoriaOpcionesEl = document.getElementById('metodosVictoriaOpciones');
    const metodosVictoriaContenedor = document.getElementById('metodosVictoria');
    if (disciplineEl instanceof HTMLSelectElement && fightStyleOpcionesEl instanceof HTMLElement) {
        disciplineEl.addEventListener('change', () => {
            var _a, _b;
            const fightStyleContenedor = obtenerContenedorGrupo('fightStyle');
            poblarCheckboxes(fightStyleOpcionesEl, 'fightStyle', (_a = ESTILOS_POR_DISCIPLINA[disciplineEl.value]) !== null && _a !== void 0 ? _a : []);
            if (fightStyleContenedor)
                limpiarErrorGrupo(fightStyleContenedor);
            if (martialArtsContenedor) {
                const esMma = disciplineEl.value === 'mma';
                martialArtsContenedor.classList.toggle('oculto', !esMma);
                if (!esMma) {
                    document
                        .querySelectorAll('input[name="martialArts"]:checked')
                        .forEach((casilla) => { casilla.checked = false; });
                    limpiarErrorGrupo(martialArtsContenedor);
                }
            }
            if (metodosVictoriaOpcionesEl instanceof HTMLElement) {
                poblarMetodosVictoria(metodosVictoriaOpcionesEl, (_b = METODOS_POR_DISCIPLINA[disciplineEl.value]) !== null && _b !== void 0 ? _b : []);
                if (metodosVictoriaContenedor)
                    limpiarErrorMetodos(metodosVictoriaContenedor);
            }
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
    const competitiveLevelEl = obtenerCampo('competitiveLevel');
    const debutDateEl = obtenerCampo('debutDate');
    const trainingYearsEl = obtenerCampo('trainingYears');
    if (competitiveLevelEl instanceof HTMLSelectElement &&
        debutDateEl instanceof HTMLInputElement &&
        trainingYearsEl instanceof HTMLInputElement) {
        const debutDateCampo = obtenerContenedor(debutDateEl);
        const trainingYearsCampo = obtenerContenedor(trainingYearsEl);
        competitiveLevelEl.addEventListener('change', () => {
            const esProfesional = competitiveLevelEl.value === 'profesional';
            const esAmateur = competitiveLevelEl.value === 'amateur';
            alternarCampoCondicional(debutDateEl, debutDateCampo, esProfesional);
            alternarCampoCondicional(trainingYearsEl, trainingYearsCampo, esAmateur);
        });
    }
    // TEMPORAL (Fase C1): la cascada "knockouts → firstRoundKos" (que lo
    // deshabilitaba hasta tener ≥1 nocaut total) se eliminó junto con el
    // campo knockouts. Por ahora firstRoundKos queda como un campo simple,
    // siempre habilitado y opcional — la Fase C2 lo reconecta a los nuevos
    // métodos de victoria (methodKo + methodTko).
    // Feedback en vivo: revalida un campo apenas el peleador lo abandona.
    validadores.forEach(({ id }) => {
        const campo = obtenerCampo(id);
        if (!campo)
            return;
        const evento = campo.tagName === 'SELECT' ? 'change' : 'blur';
        campo.addEventListener(evento, () => validarUnCampo(id));
    });
    // Mismo feedback en vivo, pero para los grupos de checkboxes que ya
    // existen en el HTML (languages, martialArts). Los de fightStyle no hacen
    // falta acá: nacen vacíos y cada uno se engancha al crearse, en poblarCheckboxes.
    gruposCheckbox.forEach(({ name }) => {
        document.querySelectorAll(`input[name="${name}"]`).forEach((checkbox) => {
            agregarListenerGrupo(checkbox, name);
        });
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
        var _a;
        evento.preventDefault();
        let primerCampoInvalido = null;
        validadores.forEach(({ id }) => {
            const esValido = validarUnCampo(id);
            if (!esValido && !primerCampoInvalido) {
                primerCampoInvalido = obtenerCampo(id);
            }
        });
        // Grupos de checkboxes: no hay un id de "campo" al que enfocar, así que
        // se enfoca el primer checkbox del grupo — sigue siendo un CampoFormulario
        // válido (todo <input>, incluido type="checkbox", es un HTMLInputElement).
        gruposCheckbox.forEach(({ name, mensaje }) => {
            const esValido = validarGrupoCheckbox(name, mensaje);
            if (!esValido && !primerCampoInvalido) {
                primerCampoInvalido = document.querySelector(`input[name="${name}"]`);
            }
        });
        // Métodos de victoria: no viven en "validadores" (son dinámicos, igual
        // que los grupos de checkboxes) — cada uno ≥ 0, más la regla cruzada de
        // la suma contra "wins".
        nombresMetodosVictoriaActuales.forEach((name) => {
            const input = document.getElementById(name);
            if (!(input instanceof HTMLInputElement))
                return;
            const esValido = validarUnMetodoVictoria(input);
            if (!esValido && !primerCampoInvalido)
                primerCampoInvalido = input;
        });
        const sumaMetodosValida = validarSumaMetodosVictoria();
        if (!sumaMetodosValida && !primerCampoInvalido) {
            const primerMetodo = document.getElementById((_a = nombresMetodosVictoriaActuales[0]) !== null && _a !== void 0 ? _a : '');
            if (primerMetodo instanceof HTMLInputElement)
                primerCampoInvalido = primerMetodo;
        }
        if (primerCampoInvalido) {
            primerCampoInvalido.focus();
            return;
        }
        mostrarConfirmacion();
    });
})();
//# sourceMappingURL=validarPerfilPeleador.js.map