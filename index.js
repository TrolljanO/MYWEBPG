(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const storage = { get(key) { try { return localStorage.getItem(key); } catch { return null; } }, set(key, value) { try { localStorage.setItem(key, value); } catch {} } };
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    themeButton?.setAttribute('aria-pressed', String(dark));
    themeButton?.setAttribute('aria-label', dark ? 'Ativar tema claro' : 'Ativar tema escuro');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#1C1B19' : '#FAF9F6');
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

  // Motion: Lenis is the only smooth scroll; GSAP scrubs each .cut by data-depth.
  // Paused or reduced motion tears everything down and leaves native scroll.
  const motionButton = document.getElementById('motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cuts = [...document.querySelectorAll('.cut')];
  const hasEngine = !!(window.gsap && window.ScrollTrigger && window.Lenis);
  let paused = storage.get('gt-motion') === 'paused';
  let lenis = null, tick = null;
  const canMove = () => hasEngine && !paused && !reduced.matches;
  function mount() {
    if (lenis) return;
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    tick = time => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    cuts.forEach(el => {
      const depth = Number(el.dataset.depth) || 0.15;
      const stage = el.closest('.cut-stage') || el.parentElement;
      gsap.fromTo(el, { y: -40 * depth }, { y: 70 * depth, ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // Dobradura: cada camada se levanta da mesa, do fundo para a frente, uma vez.
    document.querySelectorAll('.cut-stage').forEach(stage => {
      const layers = stage.querySelectorAll('.cut');
      if (!layers.length) return;
      gsap.from(layers, { rotateX: -86, opacity: 0, transformOrigin: '50% 100%', duration: 0.64, ease: 'back.out(1.3)', stagger: 0.07,
        scrollTrigger: { trigger: stage, start: 'top 85%', once: true } });
    });
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }
  function unmount() {
    if (!lenis) return;
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.set(cuts, { clearProps: 'transform' });
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  }
  function syncMotion() {
    root.dataset.motion = canMove() ? 'active' : 'paused';
    if (motionButton) {
      motionButton.hidden = !hasEngine;
      motionButton.setAttribute('aria-pressed', String(!canMove()));
      motionButton.textContent = reduced.matches ? 'Movimento reduzido' : paused ? 'Ativar movimento' : 'Pausar movimento';
      motionButton.disabled = reduced.matches;
    }
    if (canMove()) mount(); else unmount();
  }
  motionButton?.addEventListener('click', () => { paused = !paused; storage.set('gt-motion', paused ? 'paused' : 'active'); syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  window.addEventListener('load', () => { if (lenis) ScrollTrigger.refresh(); });
  window.addEventListener('pagehide', unmount);
  syncMotion();
})();
