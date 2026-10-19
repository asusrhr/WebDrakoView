// ---- Tema claro / oscuro (se recuerda la elección) ----
const root = document.documentElement, themeBtn = document.getElementById('themeBtn');
const setLabel = () => themeBtn.setAttribute('aria-label', root.getAttribute('data-bs-theme') === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
setLabel();
themeBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-bs-theme', next);
  try { localStorage.setItem('drako-theme', next); } catch (e) {}
  setLabel();
});

// ---- Barra transparente arriba, sólida al bajar ----
const nb = document.getElementById('mainNav');
const onScroll = () => nb.classList.toggle('scrolled', window.scrollY > 40);
onScroll(); addEventListener('scroll', onScroll, { passive: true });

// ---- Cierra el menú móvil al elegir una sección ----
document.querySelectorAll('#menu .nav-link, #menu .btn').forEach(a => a.addEventListener('click', () => {
  const m = document.getElementById('menu'); if (m.classList.contains('show')) bootstrap.Collapse.getInstance(m).hide();
}));

// ---- Galería: foto ampliada con flechas, teclado y deslizar ----
const lb = document.getElementById('lb');
const photos = [...document.querySelectorAll('.gallery .g-item img')].map(i => ({ src: i.currentSrc || i.src, alt: i.alt }));
if (lb && photos.length) {
  let cur = 0, last = null, x0 = null;
  const img = document.getElementById('lb-img');
  const show = n => {
    cur = (n + photos.length) % photos.length; img.src = photos[cur].src; img.alt = photos[cur].alt;
    document.getElementById('lb-cap').textContent = photos[cur].alt;
    document.getElementById('lb-count').textContent = (cur + 1) + ' / ' + photos.length;
  };
  const open = (n, from) => { last = from; show(n); lb.hidden = false; document.body.style.overflow = 'hidden'; requestAnimationFrame(() => lb.classList.add('show')); lb.querySelector('.lb-x').focus(); };
  const close = () => { lb.classList.remove('show'); document.body.style.overflow = ''; setTimeout(() => { lb.hidden = true; }, 250); if (last) last.focus(); };
  document.querySelectorAll('[data-i]').forEach(b => b.addEventListener('click', () => open(+b.dataset.i, b)));
  lb.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb || e.target.closest('[data-lb-close]')) close(); });
  lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(cur - 1); else if (e.key === 'ArrowRight') show(cur + 1);
  });
}

// ---- Servicios: al abrir uno, se desplaza para que quede completo a la vista ----
const svcList = document.getElementById('svcList');
if (svcList) svcList.addEventListener('shown.bs.collapse', e => {
  const card = e.target.closest('.svc'); if (!card) return;
  const r = card.getBoundingClientRect();
  if (r.top < 90 || r.bottom > window.innerHeight) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
