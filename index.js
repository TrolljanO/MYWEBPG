(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const storage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    themeButton?.setAttribute('aria-pressed', String(dark));
    themeButton?.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#111111' : '#ffffff');
  }
  syncTheme();
  themeButton?.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    storage.set('gt-theme', root.dataset.theme);
    syncTheme();
  });
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-category]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(other => { const active = other === button; other.classList.toggle('active', active); other.setAttribute('aria-pressed', String(active)); });
    let count = 0;
    projects.forEach(project => { project.hidden = button.dataset.filter !== 'all' && button.dataset.filter !== project.dataset.category; if (!project.hidden) count++; });
    document.getElementById('filter-count').textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
  }));
  document.getElementById('print-cv')?.addEventListener('click', () => window.print());
  const frame = document.getElementById('print-frame');
  if (!frame) {
    document.getElementById('motion-toggle')?.setAttribute('hidden', '');
    return;
  }
  const layers = [...frame.querySelectorAll('.art-layer')];
  const unfold = document.getElementById('unfold');
  const motionButton = document.getElementById('motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = storage.get('gt-motion') === 'paused';
  let open = false;
  let x = 0, y = 0, raf = 0;
  const canMove = () => !paused && !reduced.matches;
  function render() {
    raf = 0;
    layers.forEach(layer => {
      const depth = Number(layer.dataset.depth);
      const dx = open ? Number(layer.dataset.openX || 0) : 0;
      const dy = open ? Number(layer.dataset.openY || 0) : 0;
      const angle = open ? Number(layer.dataset.openRotate || 0) : 0;
      layer.style.transform = canMove() ? `translate(${x * depth * 1.5 + dx}px, ${y * depth + dy}px) rotate(${angle}deg)` : '';
      frame.classList.toggle('is-open', open && canMove());
    });
  }
  function requestRender() { if (!raf) raf = requestAnimationFrame(render); }
  function syncMotion() {
    root.dataset.motion = canMove() ? 'active' : 'paused';
    motionButton.setAttribute('aria-pressed', String(!canMove()));
    motionButton.textContent = reduced.matches ? 'Movimento reduzido' : paused ? 'Ativar movimento' : 'Pausar movimento';
    motionButton.disabled = reduced.matches;
    unfold.disabled = !canMove();
    if (!canMove()) {
      open = false;
      unfold.setAttribute('aria-pressed', 'false');
      unfold.innerHTML = 'Desdobrar gravura <span aria-hidden="true">+</span>';
    }
    render();
  }
  unfold.addEventListener('click', () => {
    open = !open;
    unfold.setAttribute('aria-pressed', String(open));
    unfold.innerHTML = `${open ? 'Reunir recortes' : 'Desdobrar gravura'} <span aria-hidden="true">+</span>`;
    render();
  });
  frame.addEventListener('pointermove', event => {
    if (!canMove() || event.pointerType === 'touch') return;
    const box = frame.getBoundingClientRect();
    x = ((event.clientX - box.left) / box.width - .5) * 2;
    y = ((event.clientY - box.top) / box.height - .5) * 2;
    requestRender();
  });
  frame.addEventListener('pointerleave', () => { x = y = 0; requestRender(); });
  motionButton.addEventListener('click', () => { paused = !paused; storage.set('gt-motion', paused ? 'paused' : 'active'); syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  syncMotion();

  const cuts = [...document.querySelectorAll('.cut')];
  if (cuts.length && !reduced.matches && window.gsap && window.ScrollTrigger && window.Lenis) {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    cuts.forEach(el => {
      const depth = Number(el.dataset.depth) || 0.15;
      const stage = el.closest('.cut-stage') || el.parentElement;
      gsap.fromTo(el, { y: -40 * depth }, {
        y: 70 * depth,
        ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
    document.querySelector('#motion-toggle')?.addEventListener('click', () => {
      if (document.documentElement.dataset.motion === 'paused') lenis.stop();
      else lenis.start();
    });
  }
})();
