import Lenis from 'lenis';

const root = document.documentElement;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;
let globalsReady = false;
let space: import('./space').Space | null = null;
/** The canvas the scene is drawing into; React replaces it when the root layout re-renders (a language switch). */
let spaceCanvas: HTMLCanvasElement | null = null;
let currentHero: HTMLElement | null = null;

const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const qa = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

function afterFirstPaint(): Promise<void> {
  return new Promise((resolve) => {
    if (performance.getEntriesByName('first-contentful-paint').length) return resolve();
    try {
      const observer = new PerformanceObserver((list) => {
        if (list.getEntriesByName('first-contentful-paint').length) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch {
      resolve();
    }
  });
}

function whenIdle(): Promise<void> {
  return new Promise((resolve) => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(() => resolve(), { timeout: 2000 });
    else setTimeout(resolve, 300);
  });
}

/** Smooth scroll for mouse and trackpad only; touch keeps native scrolling. */
function setupGlobals() {
  if (globalsReady) return;
  globalsReady = true;
  if (finePointer) lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });
}

/**
 * The one WebGL element: a fixed starfield behind every page (plus the hero graph on the home page).
 * Its own chunk, started only after the first contentful paint and once the browser is idle,
 * so creating the GPU context never competes with getting the page on screen.
 * Runs on every page mount: if React has swapped the canvas, the old scene is released and a new one starts.
 */
function ensureSpace() {
  const canvas = q<HTMLCanvasElement>('[data-space-canvas]');
  if (!canvas || canvas === spaceCanvas) return;
  space?.destroy();
  space = null;
  spaceCanvas = canvas;
  afterFirstPaint()
    .then(whenIdle)
    .then(() => import('./space'))
    .then(({ mountSpace }) => {
      if (spaceCanvas !== canvas) return;
      space = mountSpace(canvas);
      space.setPage(currentHero);
    });
}

/** Gentle fade-up as content enters. Only content below the fold waits; nothing else is touched. */
function setupReveals() {
  const items = qa('[data-reveal]').filter((el) => el.getBoundingClientRect().top > window.innerHeight * 0.92);
  items.forEach((el) => el.classList.add('reveal-pending'));
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('reveal-in');
        entry.target.classList.remove('reveal-pending');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -6% 0px' }
  );
  items.forEach((el) => io.observe(el));
  return () => {
    io.disconnect();
    items.forEach((el) => el.classList.remove('reveal-pending', 'reveal-in'));
  };
}

/** Header slides away while scrolling down and comes back on the way up. */
function setupHeader() {
  const header = q('[data-header]');
  if (!header) return () => {};
  let last = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 4) header.classList.toggle('is-hidden', y > last && y > 160);
      last = y;
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    window.removeEventListener('scroll', onScroll);
    header.classList.remove('is-hidden');
  };
}

/**
 * The shooting star on the home page rail: its tail stretches with scroll speed and settles when you stop.
 * One custom property on one small element, written only while it is changing.
 */
function setupTrace() {
  const packet = q('.trace-packet');
  if (!packet || !matchMedia('(min-width: 768px)').matches) return () => {};
  let last = window.scrollY;
  let lastT = performance.now();
  let speed = 0;
  let trail = 0.32;
  let raf = 0;
  const tick = (now: number) => {
    const y = window.scrollY;
    const dt = Math.max(8, now - lastT);
    speed += (Math.abs(y - last) / dt - speed) * 0.2; // px per ms, smoothed
    last = y;
    lastT = now;
    const target = Math.min(1, 0.32 + speed * 0.28);
    trail += (target - trail) * 0.16;
    packet.style.setProperty('--trail', trail.toFixed(3));
    raf = speed > 0.01 || Math.abs(target - trail) > 0.003 ? requestAnimationFrame(tick) : 0;
  };
  const onScroll = () => {
    if (raf) return;
    lastT = performance.now();
    raf = requestAnimationFrame(tick);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('scroll', onScroll);
    packet.style.removeProperty('--trail');
  };
}

/** A small pull toward the pointer, for the main buttons only. Transform only. */
function magnetic(el: HTMLElement) {
  let x = 0;
  let y = 0;
  let tx = 0;
  let ty = 0;
  let raf = 0;
  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    tx = (e.clientX - (r.left + r.width / 2)) * 0.25;
    ty = (e.clientY - (r.top + r.height / 2)) * 0.25;
    kick();
  };
  const leave = () => {
    tx = 0;
    ty = 0;
    kick();
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    cancelAnimationFrame(raf);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    el.style.transform = '';
  };
}

/** Sets up the current page and returns a teardown (runs again on client-side navigation). */
export function mountPage(): () => void {
  setupGlobals();
  // A language switch re-renders <html>, which drops the classes set outside React.
  root.classList.add('js');
  ensureSpace();
  // Keep Lenis in step with wherever the router left the page.
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis?.resize();

  const teardown: (() => void)[] = [setupReveals(), setupHeader(), setupTrace()];
  if (finePointer) qa('[data-magnetic]').forEach((el) => teardown.push(magnetic(el)));

  // Tell the space scene about this page's hero graph (none on most pages).
  currentHero = q('[data-system]');
  space?.setPage(currentHero);

  return () => {
    teardown.forEach((fn) => fn());
    currentHero = null;
    space?.setPage(null);
  };
}
