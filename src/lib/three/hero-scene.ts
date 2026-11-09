import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
type Battery = EventTarget & { level: number; charging: boolean };
export async function mountHero(host: HTMLElement) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
  } catch {
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  host.prepend(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
  camera.position.z = 5;
  const geometry = new THREE.IcosahedronGeometry(1.45, 1);
  const edges = new THREE.EdgesGeometry(geometry);
  const material = new THREE.LineBasicMaterial({
    color: getComputedStyle(host).getPropertyValue('--accent').trim(),
  });
  const object = new THREE.LineSegments(edges, material);
  scene.add(object);
  let visible = true,
    paused = false,
    lowBattery = false,
    disposed = false,
    time = 0;
  const pointer = { x: 0, y: 0 };
  const driver = { scroll: 0 };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(host);
  const theme = new MutationObserver(() =>
    material.color.set(
      getComputedStyle(host).getPropertyValue('--accent').trim(),
    ),
  );
  theme.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  const colorMedia = matchMedia('(prefers-color-scheme: dark)');
  const recolor = () =>
    material.color.set(
      getComputedStyle(host).getPropertyValue('--accent').trim(),
    );
  colorMedia.addEventListener('change', recolor);
  const move = (e: PointerEvent) => {
    const rect = host.getBoundingClientRect();
    pointer.x = (e.clientX - rect.left) / rect.width - 0.5;
    pointer.y = (e.clientY - rect.top) / rect.height - 0.5;
  };
  host.addEventListener('pointermove', move, { passive: true });
  const tween = gsap.to(driver, {
    scroll: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: host,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
  const tick = (_t: number, delta: number) => {
    if (
      disposed ||
      !visible ||
      document.hidden ||
      paused ||
      lowBattery ||
      reduced.matches
    )
      return;
    time += Math.min(delta, 50) * 0.00012;
    object.rotation.y = time + pointer.x * 0.25 + driver.scroll * 0.3;
    object.rotation.x = 0.3 + pointer.y * 0.15;
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);
  renderer.render(scene, camera);
  host.dataset.ready = 'true';
  const button = host.querySelector<HTMLButtonElement>('button')!;
  button.hidden = false;
  const toggle = () => {
    paused = !paused;
    button.setAttribute('aria-pressed', String(paused));
    button.textContent = paused ? 'Retomar movimento' : 'Pausar movimento';
  };
  button.addEventListener('click', toggle);
  let battery: Battery | undefined;
  const batteryChange = () => {
    lowBattery = !!battery && battery.level < 0.2 && !battery.charging;
  };
  const nav = navigator as Navigator & { getBattery?: () => Promise<Battery> };
  if (nav.getBattery)
    try {
      battery = await nav.getBattery();
      if (!disposed) {
        batteryChange();
        battery.addEventListener('levelchange', batteryChange);
        battery.addEventListener('chargingchange', batteryChange);
      }
    } catch {
      /* optional API */
    }
  const onReduced = () => {
    if (reduced.matches) cleanup();
  };
  reduced.addEventListener('change', onReduced);
  function cleanup() {
    if (disposed) return;
    disposed = true;
    gsap.ticker.remove(tick);
    tween.scrollTrigger?.kill();
    tween.kill();
    ro.disconnect();
    io.disconnect();
    theme.disconnect();
    host.removeEventListener('pointermove', move);
    button.removeEventListener('click', toggle);
    reduced.removeEventListener('change', onReduced);
    colorMedia.removeEventListener('change', recolor);
    battery?.removeEventListener('levelchange', batteryChange);
    battery?.removeEventListener('chargingchange', batteryChange);
    geometry.dispose();
    edges.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
    host.dataset.ready = 'false';
    button.hidden = true;
  }
  renderer.domElement.addEventListener('webglcontextlost', cleanup, {
    once: true,
  });
  // Preserve bfcache usability: ordinary pagehide disposes; persisted pages retain paused-by-visibility state.
  window.addEventListener(
    'pagehide',
    (event) => {
      if (!event.persisted) cleanup();
    },
    { once: true },
  );
}
