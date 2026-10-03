import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const DESKTOP = '(min-width: 1024px)';
const root = document.documentElement;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

let lenis: Lenis | null = null;
let globalsReady = false;

const q = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) => scope.querySelector<T>(sel);
const qa = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  Array.from(scope.querySelectorAll<T>(sel));
const belowFold = (el: Element) => el.getBoundingClientRect().top > window.innerHeight * 0.9;

/** One-time setup that survives client-side navigation: smooth scroll + cursor. */
function setupGlobals() {
  if (globalsReady) return;
  globalsReady = true;

  ScrollTrigger.config({ ignoreMobileResize: true });

  // Touch devices keep native scroll; Lenis only for a real mouse/trackpad.
  if (finePointer) {
    lenis = new Lenis({ lerp: 0.1, anchors: true, autoRaf: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    setupCursor();
  }

  // <details> rows change the page height; re-measure every trigger after them.
  let t: ReturnType<typeof setTimeout>;
  document.addEventListener(
    'toggle',
    () => {
      clearTimeout(t);
      t = setTimeout(() => ScrollTrigger.refresh(), 60);
    },
    true
  );
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

function setupCursor() {
  const dot = q('[data-cursor-dot]');
  const ring = q('[data-cursor-ring]');
  if (!dot || !ring) return;

  root.classList.add('has-cursor');
  gsap.set([dot, ring], { x: -100, y: -100, autoAlpha: 0 });
  const dotX = gsap.quickSetter(dot, 'x', 'px');
  const dotY = gsap.quickSetter(dot, 'y', 'px');
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  let visible = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
      }
    },
    { passive: true }
  );
  document.addEventListener('mouseleave', () => {
    visible = false;
    gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
  });
  document.addEventListener(
    'pointerover',
    (e) => {
      const target = (e.target as Element).closest('a, button, summary, [data-cursor]');
      const view = !!target?.matches('[data-cursor="view"]');
      root.classList.toggle('cursor-view', view);
      root.classList.toggle('cursor-hover', !!target && !view);
    },
    { passive: true }
  );
}

function magnetic(el: HTMLElement) {
  const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
  let rect: DOMRect | null = null;
  const enter = () => {
    rect = el.getBoundingClientRect();
  };
  const move = (e: PointerEvent) => {
    if (!rect) rect = el.getBoundingClientRect();
    const strength = Math.min(0.35, 18 / Math.max(rect.width, rect.height) + 0.15);
    xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
    yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const leave = () => {
    rect = null;
    gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)', overwrite: true });
  };
  el.addEventListener('pointerenter', enter);
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointerenter', enter);
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
  };
}

function setupNowPin(scrub: true | number) {
  const section = q('[data-now]');
  if (!section) return;
  const chapters = qa('[data-now-chapter]', section);
  const progress = q('[data-now-progress]', section);
  const dot = q('[data-now-dot]', section);
  const bus = q('[data-now-bus]', section);
  if (chapters.length < 2) return;

  section.classList.add('now-pinned');
  const steps = chapters.length - 1;
  gsap.set(chapters.slice(1), { autoAlpha: 0, y: 56 });
  if (progress) gsap.set(progress, { scaleY: 1 / chapters.length });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${window.innerHeight * steps * 0.85}`,
      pin: true,
      scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
  chapters.forEach((chapter, i) => {
    if (i === 0) return;
    tl.to(chapters[i - 1], { autoAlpha: 0, y: -56, duration: 0.35, ease: 'power2.in' }, i - 0.55);
    tl.to(chapter, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power3.out' }, i - 0.3);
  });
  if (progress) tl.to(progress, { scaleY: 1, duration: steps }, 0);
  if (dot && bus) tl.fromTo(dot, { x: 0 }, { x: () => bus.offsetWidth - dot.offsetWidth, duration: steps }, 0);

  return () => section.classList.remove('now-pinned');
}

function setupWorkRail(scrub: true | number) {
  const wrap = q('[data-hscroll]');
  const track = wrap && q('[data-hscroll-track]', wrap);
  if (!wrap || !track) return;
  const bar = q('[data-hscroll-progress]', wrap);
  const cards = qa('.hs-card', track);
  const last = cards[cards.length - 1];
  if (!last) return;

  wrap.classList.add('hs-on');
  const gutter = () => parseFloat(getComputedStyle(track).paddingRight) || 0;
  const distance = () => Math.max(0, last.offsetLeft + last.offsetWidth + gutter() - track.clientWidth);
  const setBar = bar ? gsap.quickSetter(bar, 'scaleX') : null;

  const rail = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => setBar?.(self.progress),
    },
  });

  // Each card's artwork drifts against the rail for depth.
  qa('[data-art-inner]', track).forEach((inner) => {
    gsap.fromTo(
      inner,
      { xPercent: -5 },
      {
        xPercent: 5,
        ease: 'none',
        scrollTrigger: {
          trigger: inner.closest('.hs-card'),
          containerAnimation: rail,
          start: 'left right',
          end: 'right left',
          scrub: true,
        },
      }
    );
  });

  return () => wrap.classList.remove('hs-on');
}

function setupSplits() {
  const english = root.lang === 'en';
  qa('[data-split]').forEach((el) => {
    if (!belowFold(el)) return;
    if (!english) {
      // CJK has no spaces to find line breaks with, so reveal the block as one piece.
      gsap.from(el, {
        autoAlpha: 0,
        y: 40,
        duration: 1.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
      return;
    }
    SplitText.create(el, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'split-line',
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.lines, {
          yPercent: 110,
          duration: 1.15,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        }),
    });
  });
}

function setupReveals() {
  const items = qa('[data-reveal]').filter(belowFold);
  if (!items.length) return;
  gsap.set(items, { autoAlpha: 0, y: 36 });
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });
}

function setupCounters() {
  const fmt = new Intl.NumberFormat(root.lang === 'zh-CN' ? 'zh-CN' : 'en-US');
  const restore: (() => void)[] = [];
  qa('[data-count]').forEach((el) => {
    if (!belowFold(el)) return;
    const end = Number(el.dataset.count);
    const final = fmt.format(end);
    const state = { v: 0 };
    el.textContent = fmt.format(0);
    restore.push(() => (el.textContent = final));
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: end,
          duration: 1.4 + Math.min(end, 1000) / 1000,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = fmt.format(Math.round(state.v))),
        }),
    });
  });
  return () => restore.forEach((fn) => fn());
}

function setupWordmark() {
  const mark = q('[data-wordmark]');
  if (!mark) return;
  SplitText.create(mark, {
    type: 'chars',
    onSplit: (self) =>
      gsap.from(self.chars, {
        yPercent: 105,
        ease: 'none',
        stagger: 0.06,
        scrollTrigger: { trigger: mark.parentElement, start: 'top bottom', end: 'bottom bottom', scrub: true },
      }),
  });
}

function setupHero() {
  const hero = q('[data-hero]');
  const content = hero && q('[data-hero-content]', hero);
  if (!hero || !content) return;
  gsap.to(content, {
    yPercent: -14,
    autoAlpha: 0.1,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}

function setupHeader() {
  const header = q('[data-header]');
  if (!header) return;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => header.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 160),
  });
  return () => header.classList.remove('is-hidden');
}

/** Builds every scroll effect for the current page and returns a teardown. */
export function mountPage(): () => void {
  setupGlobals();

  // Keep Lenis in sync with wherever the router left the page (top, or a #hash).
  let hashTarget: HTMLElement | null = null;
  try {
    hashTarget = location.hash ? q(decodeURIComponent(location.hash)) : null;
  } catch {
    hashTarget = null;
  }
  const hashTopBefore = hashTarget ? hashTarget.getBoundingClientRect().top : 0;
  const atHash = !!hashTarget && Math.abs(hashTopBefore) < 160;
  lenis?.scrollTo(window.scrollY, { immediate: true, force: true });
  lenis?.resize();

  const teardown: (() => void)[] = [];
  const mm = gsap.matchMedia();
  const scrub: true | number = lenis ? true : 0.6;

  const ctx = gsap.context(() => {
    // Pinned sections first so later triggers measure their pin spacing.
    mm.add(DESKTOP, () => {
      const undo = [setupNowPin(scrub), setupWorkRail(scrub)];
      return () => undo.forEach((fn) => fn?.());
    });
    setupHero();
    setupSplits();
    setupReveals();
    teardown.push(setupCounters() ?? (() => {}));
    setupWordmark();
    teardown.push(setupHeader() ?? (() => {}));
  });

  if (finePointer) qa('[data-magnetic]').forEach((el) => teardown.push(magnetic(el)));

  ScrollTrigger.refresh();
  // Pin spacing can move the anchor; put the reader back where the link pointed.
  if (hashTarget && atHash && Math.abs(hashTarget.getBoundingClientRect().top - hashTopBefore) > 2) {
    if (lenis) lenis.scrollTo(hashTarget, { immediate: true, force: true });
    else hashTarget.scrollIntoView();
  }

  return () => {
    teardown.forEach((fn) => fn());
    mm.revert();
    ctx.revert();
  };
}
