(function () {
  // Elements
  const formState = document.getElementById('form-state');
  const analysisState = document.getElementById('analysis-state');
  const resultState = document.getElementById('result-state');
  const caseInput = document.getElementById('case-description');
  const validationMsg = document.getElementById('validation-msg');
  const btnSearch = document.getElementById('btn-search');
  const btnReset = document.getElementById('btn-reset');
  const quickPills = document.querySelectorAll('.quick-pill');
  const scanStatusText = document.getElementById('scan-status-text');
  const scanProgressBar = document.getElementById('scan-progress-bar');

  // Result elements to update dynamically
  const resSpecialtyBadge = document.getElementById('res-specialty-badge');
  const resFirmName = document.getElementById('res-firm-name');
  const resFirmInitials = document.getElementById('res-firm-initials');
  const resLocation = document.getElementById('res-location');
  const resMatchReason = document.getElementById('res-match-reason');
  const resWhatsappBtn = document.getElementById('res-whatsapp-btn');
  const jurisdictionSelect = document.getElementById('jurisdiction-select');

  // Firm Database Simulation
  // Pool real de estudios. Por ahora solo Estudio Launes.
  const firmsData = {
    launes: {
      name: "Estudio Jurídico Launes & Asociados",
      initials: "L&A",
      specialty: "Civil, Laboral, Penal, Familia y Sucesiones",
      reason: "Estudio con equipo multidisciplinario y sedes en Pilar y CABA, con atención directa del titular y asesoramiento a empresas y particulares.",
      waNumber: "5491124502746",
      waMsg: "Hola, me comunico vía TuAbogado De Confianza para realizar una consulta legal."
    }
  };

  // Largo maximo del texto que se manda en la URL de wa.me. Los
  // navegadores tienen un tope de URL y sin esto un caso largo la rompe.
  const MAX_CONSULTA_WA = 600;

  // Quick Pill Fill functionality
  quickPills.forEach(pill => {
    pill.addEventListener('click', () => {
      caseInput.value = pill.getAttribute('data-fill');
      validationMsg.classList.add('hidden');
      caseInput.focus();
    });
  });

  // Handle Search Trigger
  btnSearch.addEventListener('click', () => {
    const caseText = caseInput.value.trim();

    if (!caseText) {
      validationMsg.classList.remove('hidden');
      caseInput.focus();
      return;
    }
    validationMsg.classList.add('hidden');

    // Provisional: un unico estudio para cualquier area del caso.
    const matchedKey = 'launes';

    /* COMENTADO: seleccion por palabra clave (5 estudios). Reactivar
       borrando este comentario y el matchedKey de arriba.
    // Determine appropriate firm contextual match based on keywords
    const lower = caseText.toLowerCase();
    let matchedKey = 'laboral'; // Default

    if (lower.includes('accidente') || lower.includes('choque') || lower.includes('seguro') || lower.includes('tránsito') || lower.includes('transito')) {
      matchedKey = 'transito';
    } else if (lower.includes('divorcio') || lower.includes('alimento') || lower.includes('familia') || lower.includes('hijo')) {
      matchedKey = 'familia';
    } else if (lower.includes('sucesión') || lower.includes('sucesion') || lower.includes('herencia') || lower.includes('fallecid')) {
      matchedKey = 'sucesiones';
    } else if (lower.includes('empresa') || lower.includes('contrato') || lower.includes('sociedad') || lower.includes('socio') || lower.includes('pyme')) {
      matchedKey = 'comercial';
    }
    */

    const firm = firmsData[matchedKey];
    const selectedJurisdiction = jurisdictionSelect.value;

    // Update Result fields ahead of reveal
    resFirmName.textContent = firm.name;
    resFirmInitials.textContent = firm.initials;
    resSpecialtyBadge.textContent = firm.specialty;
    resMatchReason.textContent = firm.reason;
    resLocation.textContent = selectedJurisdiction;

    // Lo que cargo la persona en el asistente viaja al chat de WhatsApp.
    const consulta = caseText.length > MAX_CONSULTA_WA
      ? caseText.slice(0, MAX_CONSULTA_WA).trimEnd() + '…'
      : caseText;

    const mensajeCompleto = `${firm.waMsg}\n\n${consulta}\n\nJurisdicción: ${selectedJurisdiction}`;
    const encodedMsg = encodeURIComponent(mensajeCompleto);
    resWhatsappBtn.href = `https://wa.me/${firm.waNumber}?text=${encodedMsg}`;

    // Transition to State 2: Simulated Analysis
    formState.classList.add('hidden');
    analysisState.classList.remove('hidden');
    analysisState.classList.add('flex');

    // Step-by-step scanner animation
    scanProgressBar.style.width = '15%';
    scanStatusText.textContent = "Analizando la naturaleza de tu caso y materia legal...";

    setTimeout(() => {
      scanProgressBar.style.width = '55%';
      scanStatusText.textContent = "Filtrando entre más de 180 estudios jurídicos matriculados y evaluados...";
    }, 1000);

    setTimeout(() => {
      scanProgressBar.style.width = '88%';
      scanStatusText.textContent = "Seleccionando el especialista con mayor índice de resolución favorable...";
    }, 2000);

    setTimeout(() => {
      scanProgressBar.style.width = '100%';
      scanStatusText.textContent = "¡Estudio asignado con éxito!";
    }, 2700);

    setTimeout(() => {
      // Transition to State 3: Show Result
      analysisState.classList.add('hidden');
      analysisState.classList.remove('flex');
      resultState.classList.remove('hidden');
      resultState.classList.add('flex');
    }, 3100);
  });

  // Reset workflow
  btnReset.addEventListener('click', () => {
    resultState.classList.add('hidden');
    resultState.classList.remove('flex');
    analysisState.classList.add('hidden');
    analysisState.classList.remove('flex');
    formState.classList.remove('hidden');

    scanProgressBar.style.width = '0%';
    caseInput.value = '';
    caseInput.focus();
  });

})();

/* ==========================================================
   Navegación: resaltar el enlace activo según la sección
   que se está viendo. Aplica las clases declaradas en el
   atributo data-active-classes del <nav>.
   ========================================================== */
(function initNavHighlight() {
  const nav = document.querySelector('nav[data-active-classes]');
  if (!nav) return;

  // Solo enlaces con ancla real (ignora href="#" y los comentados)
  const links = Array.from(nav.querySelectorAll('a[href^="#"]')).filter(
    (a) => a.getAttribute('href').length > 1
  );
  // Empareja link <-> seccion y ORDENA POR POSICION EN EL DOCUMENTO, que no
  // necesariamente coincide con el orden del menu. Sin este sort, el
  // resaltado se equivoca al saltar entre secciones.
  const sections = links
    .map((link) => ({ link, el: document.querySelector(link.getAttribute('href')) }))
    .filter((p) => p.el)
    .sort((a, b) => a.el.getBoundingClientRect().top - b.el.getBoundingClientRect().top);
  if (!sections.length) return;

  const activeClasses = (nav.dataset.activeClasses || '').split(/\s+/).filter(Boolean);
  const BASE_TEXT_CLASS = 'text-on-surface-variant';

  const setActive = (link) => {
    links.forEach((l) => {
      const on = l === link;
      if (on) l.classList.add(...activeClasses);
      else l.classList.remove(...activeClasses);
      // text-on-surface (activo) y text-on-surface-variant (inactivo) son
      // excluyentes: hay que sacar el del estado contrario para que gane.
      l.classList.toggle(BASE_TEXT_CLASS, !on);
      if (on) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  };

  // La sección actual es la última cuyo inicio ya pasó la línea de lectura
  // (justo debajo del header fijo). Se calcula por posición en vez de por
  // IntersectionObserver porque algunas anclas (como la banner de
  // confidencialidad) son más bajas que la banda central de observación.
  const header = document.querySelector('header');
  let ticking = false;

  const update = () => {
    ticking = false;
    const readLine =
      (header ? header.offsetHeight : 0) + 24; // header + aire
    let current = null;
    sections.forEach((s) => {
      if (s.el.getBoundingClientRect().top <= readLine) current = s;
    });
    setActive(current ? current.link : null);
  };

  const onScroll = () => {
    if (ticking) return; // agrupa los eventos en un solo frame
    ticking = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

/* ==========================================================
   Boton "Consultar al asistente": lleva al formulario y
   enfoca el campo de detalle del caso para escribir de una.
   Si el flujo estaba en analisis o resultado, vuelve primero
   al formulario: un campo con `hidden` no se puede enfocar.
   No se borra lo ya escrito, a diferencia de "buscar de nuevo".
   ========================================================== */
(function initAssistantShortcut() {
  const trigger = document.querySelector('[data-path="asistente"]');
  const formState = document.getElementById('form-state');
  const analysisState = document.getElementById('analysis-state');
  const resultState = document.getElementById('result-state');
  const field = document.getElementById('case-description');
  const card = document.getElementById('interactive-box');
  if (!trigger || !formState || !field) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault(); // el href="#inicio" no debe navegar

    [analysisState, resultState].forEach((s) => {
      if (!s) return;
      s.classList.add('hidden');
      s.classList.remove('flex');
    });
    formState.classList.remove('hidden');

    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Un frame alcanza: el hidden ya se quito de forma sincronica.
    // preventScroll evita que el foco pelee con el scroll suave.
    window.requestAnimationFrame(() => field.focus({ preventScroll: true }));
  });
})();
