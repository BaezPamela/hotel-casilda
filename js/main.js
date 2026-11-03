(() => {
  'use strict';

  
  const WHATSAPP_NUMBER = '543464623650'; 
  // Año del footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Header con sombra al hacer scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menú móvil
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('nav');
  const closeMenu = () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // Animación de aparición al hacer scroll
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('visible'));
  }

  // Lightbox de la galería (solo si la imagen existe)
  document.querySelectorAll('.gallery .photo').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = fig.querySelector('img');
      if (!img) return;
      const box = document.createElement('div');
      box.className = 'lightbox';
      box.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
      const close = () => { box.remove(); document.removeEventListener('keydown', onKey); };
      const onKey = (e) => { if (e.key === 'Escape') close(); };
      box.addEventListener('click', close);
      document.addEventListener('keydown', onKey);
      document.body.appendChild(box);
    });
  });

  // Fechas: egreso no puede ser anterior al ingreso
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-msg');
  const ingreso = form.elements.ingreso;
  const egreso = form.elements.egreso;
  const today = new Date().toISOString().split('T')[0];
  ingreso.min = today;
  egreso.min = today;
  ingreso.addEventListener('change', () => { egreso.min = ingreso.value || today; });

  // Carrusel de logos: duplica la lista para un loop continuo y sin saltos
const logos = document.querySelector('.logos');
if (logos) {
  const track = logos.querySelector('.logos-track');
  const originals = Array.from(track.children);
  originals.forEach(li => {
    const clone = li.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
  // Velocidad constante: ~4 segundos por logo
  logos.style.setProperty('--logos-duration', `${Math.max(20, originals.length * 4)}s`);
  logos.classList.add('is-animated');
}

  // Formulario -> WhatsApp
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ['nombre', 'email', 'mensaje'].forEach(name => {
      const field = form.elements[name];
      const valid = field.value.trim() && field.checkValidity();
      field.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      msg.textContent = 'Por favor completá los campos marcados.';
      return;
    }
    const d = Object.fromEntries(new FormData(form).entries());
    const lineas = [
      'Hola, quiero hacer una consulta al Hotel Casilda.',
      `Nombre: ${d.nombre}`,
      `Email: ${d.email}`,
      d.ingreso ? `Ingreso: ${d.ingreso}` : '',
      d.egreso ? `Egreso: ${d.egreso}` : '',
      `Mensaje: ${d.mensaje}`
    ].filter(Boolean);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lineas.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
    msg.textContent = 'Te abrimos WhatsApp para enviar tu consulta.';
    form.reset();
  });
  // Botón "Volver arriba"
const backToTop = document.querySelector('.site-footer a[href="#top"]');

if (backToTop) {
  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
  // Mostrar el botón de WhatsApp después de un pequeño scroll
const whatsappBtn = document.querySelector('.whatsapp-float');

if (whatsappBtn) {
  whatsappBtn.style.opacity = '0';
  whatsappBtn.style.pointerEvents = 'none';

  const toggleWhatsapp = () => {
    const visible = window.scrollY > 200;
    whatsappBtn.style.opacity = visible ? '1' : '0';
    whatsappBtn.style.pointerEvents = visible ? 'auto' : 'none';
  };

  window.addEventListener('scroll', toggleWhatsapp, { passive: true });
  toggleWhatsapp();
}
})();