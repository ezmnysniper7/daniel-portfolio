import { Mesh, Program, Renderer, Triangle } from 'ogl';

/** Render at 60% of CSS pixels, never above 1.5 DPR: a soft gradient doesn't need more. */
const RES_SCALE = 0.6;
const MAX_DPR = 1.5;
/** Measure this long (after warm-up); below MIN_FPS the shader freezes on its last frame. */
const PROBE_MS = 2000;
const WARMUP_FRAMES = 10;
const MIN_FPS = 45;

const vertex = /* glsl */ `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragment = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float uTime;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec2 uMouse;
varying vec2 vUv;

const vec3 INK = vec3(0.035, 0.043, 0.063);
const vec3 DEEP = vec3(0.035, 0.18, 0.25);
const vec3 SIGNAL = vec3(0.18, 0.86, 0.96);
const vec3 WARM = vec3(0.86, 0.56, 0.22);

// 2D simplex noise, Ashima Arts / Ian McEwan (MIT).
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  vec2 uv = vUv;
  vec2 q = vec2(uv.x * aspect, uv.y) * (0.8 + uScroll * 0.25);
  float t = uTime * 0.07;
  vec2 m = (uMouse - 0.5) * 0.3;

  // Low-frequency warp: big, slow folds rather than smoke. Four noise taps per pixel.
  vec2 w = vec2(snoise(q * 0.8 + vec2(t, -t * 0.5)), snoise(q * 0.8 + vec2(4.1 - t * 0.6, 2.3 + t * 0.4)));
  float n1 = snoise(q + w * 0.85 + m + vec2(0.0, t * 0.5));
  float n2 = snoise(q * 1.6 - w * 0.6 + vec2(t * 0.3, 3.0));
  float g = 0.5 + 0.4 * n1 + 0.14 * n2;

  vec3 col = mix(INK, DEEP, smoothstep(0.18, 0.62, g));
  col = mix(col, SIGNAL, smoothstep(0.56, 0.98, g) * 0.5);
  col += WARM * smoothstep(0.35, 0.95, 0.5 + 0.5 * n2) * smoothstep(0.6, 0.0, uv.y) * smoothstep(0.3, 1.0, uv.x) * 0.16;

  // Light lives top-right; the headline corner (bottom-left) stays dark and legible.
  vec2 focus = vec2(aspect * 0.8, 0.78);
  float glow = smoothstep(1.2 * max(aspect, 1.0), 0.0, distance(vec2(uv.x * aspect, uv.y), focus));
  col = mix(INK, col, 0.25 + 0.75 * glow);
  col = mix(INK, col, smoothstep(0.0, 0.32, uv.y));

  // Dither to stop banding in the dark gradients.
  col += (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}`;

export function mountShader(canvas: HTMLCanvasElement): () => void {
  const noop = () => {};
  const host = canvas.parentElement;
  if (!host) return noop;
  // Very weak devices skip straight to the CSS gradient.
  if ((navigator.hardwareConcurrency || 4) <= 2) return noop;

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR) * RES_SCALE,
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: 'low-power',
      webgl: 1,
    });
  } catch {
    return noop;
  }
  const gl = renderer.gl;
  if (!gl) return noop;

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uResolution: { value: [1, 1] },
      uMouse: { value: [0.5, 0.5] },
    },
  });
  if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
    renderer.gl.getExtension('WEBGL_lose_context')?.loseContext();
    return noop;
  }
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    if (!w || !h) return;
    renderer.setSize(w, h);
    program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    if (frozen) draw(lastTime);
  };

  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  const onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    mouse.tx = e.clientX / window.innerWidth;
    mouse.ty = 1 - e.clientY / window.innerHeight;
  };

  const t0 = performance.now();
  let raf = 0;
  let running = false;
  let inView = true;
  let frozen = false;
  let lastTime = 0;
  let shown = false;
  let probing = true;
  let probeFrames = 0;
  let probeStart = 0;

  const draw = (now: number) => {
    lastTime = now;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    program.uniforms.uTime.value = ((now - t0) / 1000) % 1000;
    program.uniforms.uMouse.value = [mouse.x, mouse.y];
    program.uniforms.uScroll.value = Math.min(1, window.scrollY / Math.max(1, host.clientHeight));
    renderer.render({ scene: mesh });
    if (!shown) {
      shown = true;
      canvas.classList.add('is-live');
    }
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    // Cap at ~60fps: on 120/144Hz screens a slow gradient gains nothing from extra draws.
    if (now - lastTime >= 15.5) draw(now);
    if (!probing) return;
    probeFrames++;
    if (probeFrames === WARMUP_FRAMES) probeStart = now;
    if (probeFrames > WARMUP_FRAMES && now - probeStart >= PROBE_MS) {
      probing = false;
      const fps = ((probeFrames - WARMUP_FRAMES) * 1000) / (now - probeStart);
      canvas.dataset.fps = String(Math.round(fps));
      if (fps < MIN_FPS) {
        // Too slow for this device: keep the last frame as a still image.
        frozen = true;
        canvas.dataset.frozen = 'true';
        stop();
      }
    }
  };

  function start() {
    if (running || frozen || !inView || document.hidden) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    // A probe interrupted by a pause would read low; measure again from scratch.
    if (probing) probeFrames = 0;
  }

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) start();
    else stop();
  });
  const ro = new ResizeObserver(resize);
  const onVisibility = () => (document.hidden ? stop() : start());
  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
    frozen = true;
    canvas.classList.remove('is-live');
  };

  resize();
  io.observe(canvas);
  ro.observe(host);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', onPointer, { passive: true });
  }
  start();

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    window.removeEventListener('pointermove', onPointer);
    canvas.classList.remove('is-live');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  };
}
