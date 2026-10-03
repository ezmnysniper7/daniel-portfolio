import { Camera, Geometry, Mesh, Program, Renderer, Transform, Vec3 } from 'ogl';
import { EDGES, FLOWS, NODES } from '@/lib/system-graph';

/** Render below CSS resolution, never above 1.5 DPR: soft glows don't need more pixels. */
const RES_SCALE = 0.75;
const MAX_DPR = 1.5;
/** FPS probe: measure after warm-up; below MIN_FPS the scene freezes on its last frame. */
const PROBE_MS = 2000;
const WARMUP_FRAMES = 10;
const MIN_FPS = 45;
const PARTICLES_PER_EDGE = 4;
const TRAIL = 5;
const FLOW_MS = 4200;

const SIGNAL = 'vec3(0.18, 0.86, 0.96)';
const BONE = 'vec3(0.94, 0.92, 0.89)';

const header = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

const nodeVertex = /* glsl */ `
attribute vec3 position;
attribute float aGlow;
attribute float aHub;
attribute float aIndex;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPx;
uniform float uTime;
varying float vGlow;
varying float vHub;
varying float vDepth;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float pulse = 1.0 + 0.07 * sin(uTime * 1.8 + aIndex * 1.7);
  float size = mix(26.0, 38.0, aHub) * (1.0 + 0.45 * aGlow) * pulse;
  gl_PointSize = size * uPx * (8.0 / -mv.z);
  vGlow = aGlow;
  vHub = aHub;
  vDepth = smoothstep(10.5, 6.5, -mv.z);
}`;

const nodeFragment = /* glsl */ `${header}
varying float vGlow;
varying float vHub;
varying float vDepth;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float halo = pow(smoothstep(0.5, 0.0, d), 2.2);
  float core = smoothstep(0.13, 0.09, d);
  float ring = smoothstep(0.025, 0.0, abs(d - 0.24)) * 0.55;
  vec3 col = mix(${BONE}, ${SIGNAL}, max(vHub, vGlow));
  float a = (core + halo * (0.3 + 0.7 * vGlow) + ring * (0.35 + 0.65 * max(vHub, vGlow))) * (0.45 + 0.55 * vDepth);
  gl_FragColor = vec4(col * a, a);
}`;

const lineVertex = /* glsl */ `
attribute vec3 position;
attribute float aGlow;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying float vGlow;
varying float vDepth;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  vGlow = aGlow;
  vDepth = smoothstep(10.5, 6.5, -mv.z);
}`;

const lineFragment = /* glsl */ `${header}
varying float vGlow;
varying float vDepth;
void main() {
  vec3 col = mix(vec3(0.55, 0.6, 0.68), ${SIGNAL}, vGlow);
  float a = (0.12 + 0.55 * vGlow) * (0.5 + 0.5 * vDepth);
  gl_FragColor = vec4(col * a, a);
}`;

const particleVertex = /* glsl */ `
attribute vec3 aA;
attribute vec3 aB;
attribute float aOffset;
attribute float aTrail;
attribute float aGlow;
attribute float aDir;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPx;
uniform float uTime;
varying float vAlpha;
varying float vGlow;
void main() {
  float t = clamp(fract(uTime * 0.24 + aOffset) - aTrail * 0.03, 0.0, 1.0);
  if (aDir < 0.0) t = 1.0 - t;
  vec4 mv = modelViewMatrix * vec4(mix(aA, aB, t), 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (7.0 - aTrail * 4.5) * (1.0 + 0.5 * aGlow) * uPx * (8.0 / -mv.z);
  float ends = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t);
  vAlpha = (1.0 - aTrail / ${TRAIL.toFixed(1)}) * ends * (0.18 + 0.82 * aGlow);
  vGlow = aGlow;
}`;

const particleFragment = /* glsl */ `${header}
varying float vAlpha;
varying float vGlow;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha;
  vec3 col = mix(${BONE}, ${SIGNAL}, 0.35 + 0.65 * vGlow);
  gl_FragColor = vec4(col * a, a);
}`;

/** Mount the scene; returns a teardown. Setup is async so shader compiles never block the main thread. */
export function mountSystem(root: HTMLElement): () => void {
  let cancelled = false;
  let dispose = () => {};
  init(root).then((teardown) => {
    if (cancelled) teardown();
    else dispose = teardown;
  });
  return () => {
    cancelled = true;
    dispose();
  };
}

/** Compile in the background (KHR_parallel_shader_compile when available) so OGL's sync compile hits the cache. */
function precompile(gl: WebGLRenderingContext, pairs: [string, string][]): Promise<boolean> {
  const ext = gl.getExtension('KHR_parallel_shader_compile');
  const programs = pairs.map(([vs, fs]) => {
    const program = gl.createProgram()!;
    for (const [type, src] of [
      [gl.VERTEX_SHADER, vs],
      [gl.FRAGMENT_SHADER, fs],
    ] as const) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    return program;
  });
  const t0 = performance.now();
  return new Promise((resolve) => {
    const check = () => {
      const done =
        !ext || programs.every((p) => gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR)) || performance.now() - t0 > 4000;
      if (!done) {
        setTimeout(check, 40);
        return;
      }
      const ok = programs.every((p) => gl.getProgramParameter(p, gl.LINK_STATUS));
      programs.forEach((p) => gl.deleteProgram(p));
      resolve(ok);
    };
    setTimeout(check, ext ? 0 : 300);
  });
}

async function init(root: HTMLElement): Promise<() => void> {
  const noop = () => {};
  const canvas = root.querySelector<HTMLCanvasElement>('[data-system-canvas]');
  if (!canvas) return noop;
  if ((navigator.hardwareConcurrency || 4) <= 2) return noop;

  let renderer: Renderer;
  try {
    renderer = new Renderer({
      canvas,
      dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR) * RES_SCALE,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      webgl: 1,
    });
  } catch {
    return noop;
  }
  const gl = renderer.gl;
  if (!gl) return noop;
  gl.clearColor(0, 0, 0, 0);
  const loseContext = () => gl.getExtension('WEBGL_lose_context')?.loseContext();
  const sources: [string, string][] = [
    [nodeVertex, nodeFragment],
    [lineVertex, lineFragment],
    [particleVertex, particleFragment],
  ];
  if (!(await precompile(gl, sources))) {
    loseContext();
    return noop;
  }

  const camera = new Camera(gl, { fov: 35, near: 0.1, far: 50 });
  camera.position.set(0, 0, 8);
  const scene = new Transform();
  // Centre the graph on its own bounds so it sits in the middle of its frame.
  scene.position.set(-0.12, -0.2, 0);

  const additive = (program: Program) => {
    program.setBlendFunc(gl.ONE, gl.ONE);
    return program;
  };
  const uniforms = { uPx: { value: renderer.dpr }, uTime: { value: 0 } };

  // Nodes
  const nodeGlow = new Float32Array(NODES.length);
  const nodeGeometry = new Geometry(gl, {
    position: { size: 3, data: new Float32Array(NODES.flatMap((p) => [p.x, p.y, p.z])) },
    aGlow: { size: 1, data: nodeGlow },
    aHub: { size: 1, data: new Float32Array(NODES.map((p) => (p.hub ? 1 : 0))) },
    aIndex: { size: 1, data: new Float32Array(NODES.map((_, i) => i)) },
  });
  const nodeProgram = additive(
    new Program(gl, { vertex: nodeVertex, fragment: nodeFragment, uniforms, transparent: true, depthTest: false, depthWrite: false })
  );

  // Edges
  const lineGlow = new Float32Array(EDGES.length * 2);
  const lineGeometry = new Geometry(gl, {
    position: {
      size: 3,
      data: new Float32Array(EDGES.flatMap(([a, b]) => [NODES[a], NODES[b]].flatMap((p) => [p.x, p.y, p.z]))),
    },
    aGlow: { size: 1, data: lineGlow },
  });
  const lineProgram = additive(
    new Program(gl, { vertex: lineVertex, fragment: lineFragment, uniforms, transparent: true, depthTest: false, depthWrite: false })
  );

  // Messages: PARTICLES_PER_EDGE per edge, each drawn as TRAIL points that lag behind the head.
  const count = EDGES.length * PARTICLES_PER_EDGE * TRAIL;
  const aA = new Float32Array(count * 3);
  const aB = new Float32Array(count * 3);
  const aOffset = new Float32Array(count);
  const aTrail = new Float32Array(count);
  const particleGlow = new Float32Array(count);
  const particleDir = new Float32Array(count).fill(1);
  let k = 0;
  EDGES.forEach(([a, b], e) => {
    for (let p = 0; p < PARTICLES_PER_EDGE; p++) {
      const offset = p / PARTICLES_PER_EDGE + e * 0.137;
      for (let t = 0; t < TRAIL; t++, k++) {
        aA.set([NODES[a].x, NODES[a].y, NODES[a].z], k * 3);
        aB.set([NODES[b].x, NODES[b].y, NODES[b].z], k * 3);
        aOffset[k] = offset;
        aTrail[k] = t;
      }
    }
  });
  const particleGeometry = new Geometry(gl, {
    aA: { size: 3, data: aA },
    aB: { size: 3, data: aB },
    aOffset: { size: 1, data: aOffset },
    aTrail: { size: 1, data: aTrail },
    aGlow: { size: 1, data: particleGlow },
    aDir: { size: 1, data: particleDir },
  });
  const particleProgram = additive(
    new Program(gl, {
      vertex: particleVertex,
      fragment: particleFragment,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })
  );

  for (const program of [nodeProgram, lineProgram, particleProgram]) {
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      loseContext();
      return noop;
    }
  }

  new Mesh(gl, { mode: gl.LINES, geometry: lineGeometry, program: lineProgram, frustumCulled: false }).setParent(scene);
  new Mesh(gl, { mode: gl.POINTS, geometry: particleGeometry, program: particleProgram, frustumCulled: false }).setParent(scene);
  new Mesh(gl, { mode: gl.POINTS, geometry: nodeGeometry, program: nodeProgram, frustumCulled: false }).setParent(scene);

  // ---- DOM: labels, caption, hover ----
  const labels = Array.from(root.querySelectorAll<HTMLElement>('[data-system-label]'));
  const labelLayer = labels[0]?.parentElement;
  let showLabels = false;
  const caption = root.querySelector<HTMLElement>('[data-system-caption]');
  let captions: string[] = [];
  try {
    captions = JSON.parse(root.dataset.flows || '[]');
  } catch {
    captions = [];
  }

  let width = 1;
  let height = 1;
  const resize = () => {
    // Measure the container: OGL writes an explicit pixel size onto the canvas itself.
    width = root.clientWidth || 1;
    height = root.clientHeight || 1;
    renderer.setSize(width, height);
    const aspect = width / height;
    camera.perspective({ aspect });
    // Keep the whole graph in frame on narrow (portrait) canvases.
    camera.position.z = aspect < 1.05 ? 8 / Math.max(aspect, 0.55) ** 0.85 : 8;
    // Labels are hidden on small screens: skip positioning them every frame there.
    showLabels = !!labelLayer && getComputedStyle(labelLayer).display !== 'none';
    if (frozen) draw(lastTime);
  };

  const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: -1, py: -1 };
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const onPointer = (e: PointerEvent) => {
    pointer.tx = e.clientX / window.innerWidth - 0.5;
    pointer.ty = e.clientY / window.innerHeight - 0.5;
    const r = canvas.getBoundingClientRect();
    pointer.px = e.clientX - r.left;
    pointer.py = e.clientY - r.top;
  };

  // ---- flows ----
  let flow = -1;
  let flowSince = 0;
  const edgeTarget = new Float32Array(EDGES.length);
  const edgeGlow = new Float32Array(EDGES.length);
  const edgeDir = new Float32Array(EDGES.length).fill(1);
  const nodeTarget = new Float32Array(NODES.length);
  const setFlow = (i: number) => {
    flow = i;
    edgeTarget.fill(0);
    nodeTarget.fill(0);
    for (const [e, dir] of FLOWS[i].edges) {
      edgeTarget[e] = 1;
      edgeDir[e] = dir;
      nodeTarget[EDGES[e][0]] = 1;
      nodeTarget[EDGES[e][1]] = 1;
    }
    if (caption && captions[i]) caption.textContent = captions[i];
  };

  const projected = new Vec3();
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
    const dt = Math.min(0.05, (now - (lastTime || now)) / 1000);
    lastTime = now;
    const time = (now - t0) / 1000;
    uniforms.uTime.value = time % 1000;

    if (flow < 0 || now - flowSince > FLOW_MS) {
      setFlow((flow + 1) % FLOWS.length);
      flowSince = now;
    }

    // Slow turn plus a gentle tilt toward the pointer; the hero scrolling away tips it back.
    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;
    const scrolled = Math.min(1, window.scrollY / Math.max(1, root.clientHeight));
    scene.rotation.y = Math.sin(time * 0.12) * 0.55 + pointer.x * 0.5;
    scene.rotation.x = -0.12 + pointer.y * 0.35 + scrolled * 0.5;

    // Hover: nearest node label within reach.
    let hovered = -1;
    let best = 52 * 52;

    scene.updateMatrixWorld();
    NODES.forEach((node, i) => {
      projected.set(node.x, node.y, node.z).applyMatrix4(scene.worldMatrix);
      camera.project(projected);
      const sx = (projected.x * 0.5 + 0.5) * width;
      const sy = (-projected.y * 0.5 + 0.5) * height;
      if (fine && pointer.px >= 0) {
        const d = (sx - pointer.px) ** 2 + (sy - pointer.py) ** 2;
        if (d < best) {
          best = d;
          hovered = i;
        }
      }
      const label = showLabels ? labels[i] : undefined;
      if (label) {
        label.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
        label.style.opacity = String(0.45 + 0.55 * Math.min(1, Math.max(nodeGlow[i], i === hovered ? 1 : 0)));
      }
    });

    const ease = 1 - Math.exp(-dt * 6);
    for (let i = 0; i < NODES.length; i++) {
      const target = Math.max(nodeTarget[i], i === hovered ? 1 : 0);
      nodeGlow[i] += (target - nodeGlow[i]) * ease;
    }
    for (let e = 0; e < EDGES.length; e++) {
      const near = hovered >= 0 && (EDGES[e][0] === hovered || EDGES[e][1] === hovered) ? 0.8 : 0;
      edgeGlow[e] += (Math.max(edgeTarget[e], near) - edgeGlow[e]) * ease;
      lineGlow[e * 2] = lineGlow[e * 2 + 1] = edgeGlow[e];
      const start = e * PARTICLES_PER_EDGE * TRAIL;
      particleGlow.fill(edgeGlow[e], start, start + PARTICLES_PER_EDGE * TRAIL);
      particleDir.fill(edgeDir[e], start, start + PARTICLES_PER_EDGE * TRAIL);
    }
    nodeGeometry.attributes.aGlow.needsUpdate = true;
    lineGeometry.attributes.aGlow.needsUpdate = true;
    particleGeometry.attributes.aGlow.needsUpdate = true;
    particleGeometry.attributes.aDir.needsUpdate = true;
    root.classList.toggle('system-hover', hovered >= 0);
    if (showLabels) labels.forEach((l, i) => l.classList.toggle('is-active', i === hovered || nodeTarget[i] > 0));

    renderer.render({ scene, camera });
    if (!shown) {
      shown = true;
      root.classList.add('system-live');
    }
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    draw(now);
    if (!probing) return;
    probeFrames++;
    if (probeFrames === WARMUP_FRAMES) probeStart = now;
    if (probeFrames > WARMUP_FRAMES && now - probeStart >= PROBE_MS) {
      probing = false;
      const fps = ((probeFrames - WARMUP_FRAMES) * 1000) / (now - probeStart);
      root.dataset.fps = String(Math.round(fps));
      if (fps < MIN_FPS) {
        frozen = true;
        root.dataset.frozen = 'true';
        stop();
      }
    }
  };

  function start() {
    if (running || frozen || !inView || document.hidden) return;
    running = true;
    lastTime = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
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
    root.classList.remove('system-live');
  };

  resize();
  io.observe(canvas);
  ro.observe(root);
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  if (fine) window.addEventListener('pointermove', onPointer, { passive: true });
  start();

  return () => {
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onLost);
    window.removeEventListener('pointermove', onPointer);
    root.classList.remove('system-live', 'system-hover');
    loseContext();
  };
}
