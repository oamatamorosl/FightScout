// Buscar peleadores (peleadores.html): alterna los filtros del sidebar según la
// disciplina elegida y limpia el formulario. NO filtra las tarjetas: la página
// es una maqueta estática, los resultados no dependen de estos filtros todavía.
(function initBuscarPeleadores(): void {
  const sidebar = document.querySelector<HTMLElement>('.buscar-sidebar');
  const chips = document.querySelectorAll<HTMLButtonElement>('.chip-disciplina');
  if (!sidebar || chips.length === 0) return;

  // Categoría de peso y estilo de pelea existen en las dos disciplinas pero con
  // opciones distintas: hay un grupo por disciplina y se muestra el que coincide
  // con la activa. Artes marciales base es solo de MMA, por eso va marcado con
  // data-solo en vez de tener un par boxeo/mma.
  function aplicarDisciplina(disciplina: string): void {
    document.querySelectorAll<HTMLElement>('[data-disciplina-grupo]').forEach((grupo) => {
      grupo.classList.toggle('oculto', grupo.dataset.disciplinaGrupo !== disciplina);
    });
    document.querySelectorAll<HTMLElement>('[data-solo="mma"]').forEach((grupo) => {
      grupo.classList.toggle('oculto', disciplina !== 'mma');
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((otroChip) => {
        otroChip.classList.remove('is-activo');
        otroChip.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-activo');
      chip.setAttribute('aria-pressed', 'true');

      const disciplina = chip.dataset.disciplina;
      if (disciplina) aplicarDisciplina(disciplina);
    });
  });

  document.getElementById('limpiarFiltros')?.addEventListener('click', () => {
    sidebar.querySelectorAll<HTMLInputElement>('input[type="text"], input[type="number"]').forEach((input) => {
      input.value = '';
    });
    // Solo los visibles: los checkboxes de la disciplina que no está activa
    // viven dentro de un grupo con .oculto y no son parte de la búsqueda actual.
    sidebar.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((checkbox) => {
      if (!checkbox.closest('.oculto')) checkbox.checked = false;
    });
  });
})();
