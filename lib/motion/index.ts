import Lenis from 'lenis';

const root = document.documentElement;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;
let globalsReady = false;
let space: import('./space').Space | null = null;
let currentHero: HTMLElement | null = null;

const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const qa = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));

/** Smooth scroll for mouse and trackpad only; touch keeps native scrolling. */
function setupGlobals() {
  if (globalsReady) return;
  globalsReady = true;
  if (finePointer) lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: true });

  // The one WebGL element: a fixed starfield behind every page (plus the hero graph on the home page).
  // Its own chunk, loaded after first paint.
  const canvas = q<HTMLCanvasElement>('[data-space-canvas]');
  if (canvas) {
    import('./space').then(({ mountSpace }) => {
      space = mountSpace(canvas);
      space.setPage(currentHero);
    });
  }
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
  // Keep Lenis in step with wherever the router left the page.
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis?.resize();

  const teardown: (() => void)[] = [setupReveals(), setupHeader()];
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
