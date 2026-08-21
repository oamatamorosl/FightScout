// Validación del formulario "Crear cuenta de scout" (registroScout.html).
(function initValidacionPerfilScout(): void {
  const formulario = document.getElementById('formPerfilScout') as HTMLFormElement | null;
  if (!formulario) return;

  type CampoFormulario = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
  type Validador = (valor: string) => string | null;
  interface ConfigCampo {
    id: string;
    validar: Validador;
  }

  const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validadores: ConfigCampo[] = [
    {
      id: 'firstName',
      validar: (valor) => {
        const nombre = valor.trim();
        if (!nombre) return 'Ingresa tu nombre.';
        if (nombre.length < 2) return 'El nombre debe tener al menos 2 caracteres.';
        return null;
      },
    },
    {
      id: 'lastName',
      validar: (valor) => {
        const apellido = valor.trim();
        if (!apellido) return 'Ingresa tu apellido.';
        if (apellido.length < 2) return 'El apellido debe tener al menos 2 caracteres.';
        return null;
      },
    },
    {
      id: 'email',
      validar: (valor) => {
        const correo = valor.trim();
        if (!correo) return 'Ingresa tu correo electrónico.';
        if (!patronCorreo.test(correo)) return 'Ingresa un correo electrónico válido.';
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
  function esCampoValidable(el: HTMLElement | null): el is CampoFormulario {
    return (
      el instanceof HTMLInputElement ||
      el instanceof HTMLSelectElement ||
      el instanceof HTMLTextAreaElement
    );
  }

  function obtenerCampo(id: string): CampoFormulario | null {
    const el = document.getElementById(id);
    return esCampoValidable(el) ? el : null;
  }

  function obtenerContenedor(campo: CampoFormulario): HTMLElement {
    return (campo.closest('.campo') as HTMLElement | null) ?? campo.parentElement ?? campo;
  }

  function mostrarError(campo: CampoFormulario, mensaje: string): void {
    // El color/ícono del campo los decide el CSS (:invalid). Acá solo le
    // avisamos a la plataforma que es inválido y dejamos el mensaje
    // accesible en su propio elemento.
    campo.setCustomValidity(mensaje);
    campo.setAttribute('aria-invalid', 'true');

    const contenedor = obtenerContenedor(campo);
    const idError = `${campo.id}-error`;
    let error = contenedor.querySelector<HTMLParagraphElement>('.error-campo');
    if (!error) {
      error = document.createElement('p');
      error.className = 'error-campo';
      error.id = idError;
      contenedor.appendChild(error);
    }
    error.textContent = mensaje;
    campo.setAttribute('aria-describedby', idError);
  }

  function limpiarError(campo: CampoFormulario): void {
    campo.setCustomValidity('');
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');

    const contenedor = obtenerContenedor(campo);
    const error = contenedor.querySelector('.error-campo');
    if (error) error.remove();
  }

  function validarUnCampo(id: string): boolean {
    const config = validadores.find((v) => v.id === id);
    const campo = obtenerCampo(id);
    if (!config || !campo) return true;

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
    if (!campo) return;
    const evento = campo.tagName === 'SELECT' ? 'change' : 'blur';
    campo.addEventListener(evento, () => validarUnCampo(id));
  });

  function mostrarConfirmacion(): void {
    let confirmacion = formulario!.querySelector<HTMLParagraphElement>('.formulario-confirmacion');
    if (!confirmacion) {
      confirmacion = document.createElement('p');
      confirmacion.className = 'formulario-confirmacion';
      confirmacion.setAttribute('role', 'status');
      formulario!.querySelector('.acciones-form')?.insertAdjacentElement('beforebegin', confirmacion);
    }
    confirmacion.textContent = 'Cuenta validada correctamente. (Demo: aún no se envía a un servidor.)';
  }

  formulario.addEventListener('submit', (evento: SubmitEvent) => {
    evento.preventDefault();

    let primerCampoInvalido: CampoFormulario | null = null;
    validadores.forEach(({ id }) => {
      const esValido = validarUnCampo(id);
      if (!esValido && !primerCampoInvalido) {
        primerCampoInvalido = obtenerCampo(id);
      }
    });

    if (primerCampoInvalido) {
      (primerCampoInvalido as CampoFormulario).focus();
      return;
    }

    mostrarConfirmacion();
  });
})();
