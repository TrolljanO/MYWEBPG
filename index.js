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
  document.getElementById('print-cv')?.addEventListener('click', () => window.print());

  // Motion: Lenis scrolls; each .cut scrubs on Y by data-depth, drifts on X, and follows the pointer.
  // Paused or reduced motion tears everything down and leaves native scroll.
  const motionButton = document.getElementById('motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const cuts = [...document.querySelectorAll('.cut')];
  const fish = [...document.querySelectorAll('.gravura-anchor [class*="fish-"]')];
  const hero = document.getElementById('hero');
  const hasEngine = !!(window.gsap && window.ScrollTrigger && window.Lenis);
  const pointer = { x: 0, y: 0 };
  let paused = storage.get('gt-motion') === 'paused';
  let lenis = null, tick = null, drift = null;
  const canMove = () => hasEngine && !paused && !reduced.matches;
  function onPointer(event) {
    pointer.x = event.clientX / innerWidth - 0.5;
    pointer.y = event.clientY / innerHeight - 0.5;
  }
  function onFish(event) {
    const el = event.currentTarget;
    const note = document.getElementById('koi-note');
    if (note) note.textContent = el.dataset.who || '';
    gsap.fromTo(el, { rotation: -8 }, { rotation: 7, duration: 0.35, yoyo: true, repeat: 1, ease: 'sine.inOut' });
  }
  function onHero(event) {
    if (event.target.closest('a,button')) return;
    const pagoda = hero?.querySelector('.pagoda');
    if (!pagoda) return;
    gsap.fromTo(pagoda, { scale: 1 }, { scale: 1.07, duration: 0.32, yoyo: true, repeat: 1, transformOrigin: '50% 100%', ease: 'power2.out' });
  }
  function mount() {
    if (lenis) return;
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    tick = time => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const travel = 220;
    cuts.forEach((el, index) => {
      const depth = Number(el.dataset.depth) || 0.15;
      el.dataset.phase = String(index * 0.7);
      const stage = el.closest('.cut-stage') || el.parentElement;
      gsap.fromTo(el, { y: -travel * depth }, { y: travel * depth, ease: 'none',
        scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    drift = time => {
      cuts.forEach(el => {
        const depth = Number(el.dataset.depth) || 0.15;
        const sway = Math.sin(time * (0.7 + depth) + Number(el.dataset.phase)) * 28 * depth;
        const pose = { x: pointer.x * 160 * depth + sway, yPercent: pointer.y * 14 * depth };
        if (el.classList.contains('petal')) pose.rotation = Math.sin(time * 0.8 + Number(el.dataset.phase)) * 12;
        gsap.set(el, pose);
      });
    };
    gsap.ticker.add(drift);
    window.addEventListener('pointermove', onPointer);
    fish.forEach(el => el.addEventListener('click', onFish));
    hero?.addEventListener('click', onHero);
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
    window.removeEventListener('pointermove', onPointer);
    fish.forEach(el => el.removeEventListener('click', onFish));
    hero?.removeEventListener('click', onHero);
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    gsap.killTweensOf(cuts);
    gsap.set(cuts, { clearProps: 'transform' });
    gsap.ticker.remove(drift);
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
    drift = null;
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
