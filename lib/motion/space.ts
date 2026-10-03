import { Camera, Geometry, Mesh, Program, Renderer, Transform, Vec3 } from 'ogl';
import { EDGES, FLOWS, NODES } from '@/lib/system-graph';

/**
 * One fixed WebGL canvas behind every page: a field of stars with real depth that you travel through
 * as you scroll, and (on the home page) the "live system" graph placed over the hero.
 */

const RES_SCALE = 0.75;
const MAX_DPR = 1.5;
const PROBE_MS = 2000;
const WARMUP_FRAMES = 10;
const MIN_FPS = 45;
const FOV = 35;
const CAMERA_Z = 8;
const STAR_DEPTH = 40;
const PARTICLES_PER_EDGE = 4;
const TRAIL = 5;
const FLOW_MS = 4200;
const IDLE_MS = 1500;

const SIGNAL = 'vec3(0.18, 0.86, 0.96)';
const BONE = 'vec3(0.94, 0.92, 0.89)';
const header = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`;

const starVertex = /* glsl */ `
attribute vec3 position;
attribute float aSize;
attribute float aTone;
attribute float aPhase;
uniform mat4 projectionMatrix;
uniform float uTravel;
uniform float uScroll;
uniform float uTime;
uniform float uTanHalf;
uniform float uAspect;
uniform float uPx;
varying float vAlpha;
varying float vTone;
const float DEPTH = ${STAR_DEPTH.toFixed(1)};
void main() {
  // Travel forward with time and scroll; stars wrap from far to near.
  float depth = mod(position.z * DEPTH + uTravel, DEPTH);
  float z = -(2.0 + DEPTH - depth);
  float halfH = -z * uTanHalf;
  // Scroll parallax: near stars slide faster than far ones.
  float ny = mod(position.y + uScroll * 0.0025 / -z + 1.0, 2.0) - 1.0;
  vec3 p = vec3(position.x * halfH * uAspect * 1.15, ny * halfH * 1.15, z);
  gl_Position = projectionMatrix * vec4(p, 1.0);
  gl_PointSize = clamp(aSize * uPx * 24.0 / -z, 1.0, 6.0 * uPx);
  float fade = smoothstep(2.0, 6.0, -z) * smoothstep(DEPTH + 2.0, DEPTH - 6.0, -z);
  vAlpha = fade * (0.6 + 0.4 * sin(uTime * (0.5 + aPhase) + aPhase * 6.2831));
  vTone = aTone;
}`;

const starFragment = /* glsl */ `${header}
varying float vAlpha;
varying float vTone;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  a = a * a * vAlpha * 0.8;
  vec3 col = mix(${BONE}, ${SIGNAL}, vTone);
  gl_FragColor = vec4(col * a, a);
}`;

const nodeVertex = /* glsl */ `
attribute vec3 position;
attribute float aGlow;
attribute float aHub;
attribute float aIndex;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uPx;
uniform float uTime;
uniform float uScale;
varying float vGlow;
varying float vHub;
varying float vDepth;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float pulse = 1.0 + 0.07 * sin(uTime * 1.8 + aIndex * 1.7);
  float size = mix(26.0, 38.0, aHub) * (1.0 + 0.45 * aGlow) * pulse * uScale;
  gl_PointSize = size * uPx * (8.0 / -mv.z);
  vGlow = aGlow;
  vHub = aHub;
  vDepth = smoothstep(10.5, 6.5, -mv.z);
}`;

const nodeFragment = /* glsl */ `${header}
uniform float uFade;
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
  float a = (core + halo * (0.3 + 0.7 * vGlow) + ring * (0.35 + 0.65 * max(vHub, vGlow))) * (0.45 + 0.55 * vDepth) * uFade;
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
uniform float uFade;
varying float vGlow;
varying float vDepth;
void main() {
  vec3 col = mix(vec3(0.55, 0.6, 0.68), ${SIGNAL}, vGlow);
  float a = (0.14 + 0.55 * vGlow) * (0.5 + 0.5 * vDepth) * uFade;
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
uniform float uScale;
varying float vAlpha;
varying float vGlow;
void main() {
  float t = clamp(fract(uTime * 0.24 + aOffset) - aTrail * 0.03, 0.0, 1.0);
  if (aDir < 0.0) t = 1.0 - t;
  vec4 mv = modelViewMatrix * vec4(mix(aA, aB, t), 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (7.0 - aTrail * 4.5) * (1.0 + 0.5 * aGlow) * uScale * uPx * (8.0 / -mv.z);
  float ends = smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t);
  vAlpha = (1.0 - aTrail / ${TRAIL.toFixed(1)}) * ends * (0.18 + 0.82 * aGlow);
  vGlow = aGlow;
}`;

const particleFragment = /* glsl */ `${header}
uniform float uFade;
varying float vAlpha;
varying float vGlow;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = pow(smoothstep(0.5, 0.0, d), 1.6) * vAlpha * uFade;
  vec3 col = mix(${BONE}, ${SIGNAL}, 0.35 + 0.65 * vGlow);
  gl_FragColor = vec4(col * a, a);
}`;

export type Space = {
  /** Point the scene at the current page's hero (or null for pages without the graph). */
  setPage(root: HTMLElement | null): void;
  destroy(): void;
};

export function mountSpace(canvas: HTMLCanvasElement): Space {
  let page: HTMLElement | null = null;
  let api: Space | null = null;
  let cancelled = false;
  init(canvas).then((ready) => {
    if (cancelled) return ready?.destroy();
    api = ready;
    api?.setPage(page);
  });
  return {
    setPage(root) {
      page = root;
      api?.setPage(root);
    },
    destroy() {
      cancelled = true;
      api?.destroy();
    },
  };
}

/** Compile in the background (KHR_parallel_shader_compile) so OGL's synchronous compile hits the cache. */
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

/** Let the browser breathe between setup steps so none of them becomes a long task. */
const yieldToMain = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

async function init(canvas: HTMLCanvasElement): Promise<Space | null> {
  const root = document.documentElement;
  if ((navigator.hardwareConcurrency || 4) <= 2) return null;

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
    return null;
  }
  const gl = renderer.gl;
  if (!gl) return null;
  gl.clearColor(0, 0, 0, 0);
  const loseContext = () => gl.getExtension('WEBGL_lose_context')?.loseContext();
  // No real GPU (software rendering such as SwiftShader or llvmpipe): every frame would burn CPU,
  // so keep the static CSS stars instead.
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const gpu = String(gl.getParameter(debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER) || '');
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) {
    loseContext();
    document.documentElement.dataset.spaceFallback = 'software-gl';
    return null;
  }
  if (
    !(await precompile(gl, [
      [starVertex, starFragment],
      [nodeVertex, nodeFragment],
      [lineVertex, lineFragment],
      [particleVertex, particleFragment],
    ]))
  ) {
    loseContext();
    return null;
  }

  await yieldToMain();
  const camera = new Camera(gl, { fov: FOV, near: 0.1, far: 80 });
  camera.position.set(0, 0, CAMERA_Z);
  const scene = new Transform();
  const tanHalf = Math.tan(((FOV / 2) * Math.PI) / 180);
  const additive = (p: Program) => {
    p.setBlendFunc(gl.ONE, gl.ONE);
    return p;
  };
  const common = { transparent: true, depthTest: false, depthWrite: false };

  // ---------- Stars ----------
  const starCount = window.innerWidth >= 768 ? 1400 : 600;
  const starPos = new Float32Array(starCount * 3);
  const starSize = new Float32Array(starCount);
  const starTone = new Float32Array(starCount);
  const starPhase = new Float32Array(starCount);
  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = Math.random() * 2 - 1;
    starPos[i * 3 + 1] = Math.random() * 2 - 1;
    starPos[i * 3 + 2] = Math.random();
    starSize[i] = 0.6 + Math.random() ** 3 * 1.6;
    starTone[i] = Math.random() < 0.12 ? 1 : 0;
    starPhase[i] = Math.random();
  }
  const starUniforms = {
    uTravel: { value: 0 },
    uScroll: { value: 0 },
    uTime: { value: 0 },
    uTanHalf: { value: tanHalf },
    uAspect: { value: 1 },
    uPx: { value: renderer.dpr },
  };
  const stars = new Mesh(gl, {
    mode: gl.POINTS,
    geometry: new Geometry(gl, {
      position: { size: 3, data: starPos },
      aSize: { size: 1, data: starSize },
      aTone: { size: 1, data: starTone },
      aPhase: { size: 1, data: starPhase },
    }),
    program: additive(new Program(gl, { vertex: starVertex, fragment: starFragment, uniforms: starUniforms, ...common })),
    frustumCulled: false,
    renderOrder: -1,
  });
  stars.setParent(scene);
  await yieldToMain();

  // ---------- The live system graph ----------
  const graphUniforms = { uPx: { value: renderer.dpr }, uTime: { value: 0 }, uFade: { value: 0 }, uScale: { value: 1 } };
  const graph = new Transform();
  const graphInner = new Transform();
  graphInner.position.set(-0.125, -0.225, 0); // centre the graph on its own bounds
  graphInner.setParent(graph);
  graph.setParent(scene);

  const nodeGlow = new Float32Array(NODES.length);
  const nodeGeometry = new Geometry(gl, {
    position: { size: 3, data: new Float32Array(NODES.flatMap((p) => [p.x, p.y, p.z])) },
    aGlow: { size: 1, data: nodeGlow },
    aHub: { size: 1, data: new Float32Array(NODES.map((p) => (p.hub ? 1 : 0))) },
    aIndex: { size: 1, data: new Float32Array(NODES.map((_, i) => i)) },
  });
  const lineGlow = new Float32Array(EDGES.length * 2);
  const lineGeometry = new Geometry(gl, {
    position: {
      size: 3,
      data: new Float32Array(EDGES.flatMap(([a, b]) => [NODES[a], NODES[b]].flatMap((p) => [p.x, p.y, p.z]))),
    },
    aGlow: { size: 1, data: lineGlow },
  });
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
      for (let t = 0; t < TRAIL; t++, k++) {
        aA.set([NODES[a].x, NODES[a].y, NODES[a].z], k * 3);
        aB.set([NODES[b].x, NODES[b].y, NODES[b].z], k * 3);
        aOffset[k] = p / PARTICLES_PER_EDGE + e * 0.137;
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
  const graphProgram = (vertex: string, fragment: string) =>
    additive(new Program(gl, { vertex, fragment, uniforms: graphUniforms, ...common }));
  const programs: Program[] = [];
  for (const [vertex, fragment] of [
    [lineVertex, lineFragment],
    [particleVertex, particleFragment],
    [nodeVertex, nodeFragment],
  ]) {
    programs.push(graphProgram(vertex, fragment));
    await yieldToMain();
  }
  for (const program of [stars.program, ...programs]) {
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      loseContext();
      return null;
    }
  }
  new Mesh(gl, { mode: gl.LINES, geometry: lineGeometry, program: programs[0], frustumCulled: false }).setParent(graphInner);
  new Mesh(gl, { mode: gl.POINTS, geometry: particleGeometry, program: programs[1], frustumCulled: false }).setParent(graphInner);
  new Mesh(gl, { mode: gl.POINTS, geometry: nodeGeometry, program: programs[2], frustumCulled: false }).setParent(graphInner);

  // ---------- Page wiring (anchor, labels, caption) ----------
  let anchor: HTMLElement | null = null;
  let labels: HTMLElement[] = [];
  let labelLayer: HTMLElement | null = null;
  let caption: HTMLElement | null = null;
  let captions: string[] = [];
  let showLabels = false;
  let labelsShown = false;
  /** Anchor box in page coordinates; refreshed on resize, page change and every couple of seconds. */
  let anchorBox: { left: number; top: number; width: number; height: number } | null = null;
  let anchorMeasuredAt = 0;
  const measureAnchor = () => {
    anchorMeasuredAt = performance.now();
    if (!anchor) return (anchorBox = null);
    const r = anchor.getBoundingClientRect();
    anchorBox = { left: r.left, top: r.top + window.scrollY, width: r.width, height: r.height };
  };
  const setPage = (hero: HTMLElement | null) => {
    anchor = hero?.querySelector<HTMLElement>('[data-system-anchor]') ?? null;
    labelLayer = hero?.querySelector<HTMLElement>('[data-system-labels]') ?? null;
    labels = labelLayer ? Array.from(labelLayer.querySelectorAll<HTMLElement>('[data-system-label]')) : [];
    caption = hero?.querySelector<HTMLElement>('[data-system-caption]') ?? null;
    try {
      captions = JSON.parse(hero?.dataset.flows || '[]');
    } catch {
      captions = [];
    }
    showLabels = !!labelLayer && getComputedStyle(labelLayer).display !== 'none';
    measureAnchor();
    flow = -1;
    kick();
  };

  // ---------- Size ----------
  let width = 0;
  let height = 0;
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    // Phones resize the viewport as the address bar slides; ignore small height-only changes.
    if (w === width && Math.abs(h - height) < 160) return;
    width = w;
    height = h;
    renderer.setSize(width, height);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    camera.perspective({ aspect: width / height });
    starUniforms.uAspect.value = width / height;
    if (labelLayer) showLabels = getComputedStyle(labelLayer).display !== 'none';
    measureAnchor();
    kick();
  };

  // ---------- Input ----------
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, px: -1, py: -1 };
  let lastInput = performance.now();
  const onPointer = (e: PointerEvent) => {
    pointer.tx = e.clientX / window.innerWidth - 0.5;
    pointer.ty = e.clientY / window.innerHeight - 0.5;
    pointer.px = e.clientX;
    pointer.py = e.clientY;
    lastInput = performance.now();
  };
  const onScroll = () => {
    lastInput = performance.now();
  };

  // ---------- Flows ----------
  let flow = -1;
  let flowSince = 0;
  const edgeTarget = new Float32Array(EDGES.length);
  const edgeGlow = new Float32Array(EDGES.length);
  const edgeDir = new Float32Array(EDGES.length).fill(1);
  const nodeTarget = new Float32Array(NODES.length);
  let dirDirty = true;
  let lastHovered = -2;
  const setFlow = (i: number) => {
    flow = i;
    dirDirty = true;
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

  // ---------- Loop ----------
  const projected = new Vec3();
  const t0 = performance.now();
  let raf = 0;
  let running = false;
  let lastTime = 0;
  let frameIndex = 0;
  let shown = false;
  let probing = true;
  let probeFrames = 0;
  let probeStart = 0;

  const draw = (now: number) => {
    const dt = Math.min(0.05, (now - (lastTime || now)) / 1000);
    lastTime = now;
    const time = (now - t0) / 1000;
    const scrollY = window.scrollY;

    starUniforms.uTime.value = time % 1000;
    starUniforms.uScroll.value = scrollY;
    starUniforms.uTravel.value = (time * 0.6 + scrollY * 0.006) % STAR_DEPTH;
    graphUniforms.uTime.value = time % 1000;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    // Place the graph over its anchor (it scrolls with the hero) and fade it as the hero leaves.
    let fade = 0;
    let hovered = -1;
    if (anchor && now - anchorMeasuredAt > 2000) measureAnchor(); // late layout changes (fonts, images)
    const rect = anchorBox
      ? { left: anchorBox.left, top: anchorBox.top - scrollY, width: anchorBox.width, height: anchorBox.height, bottom: anchorBox.top - scrollY + anchorBox.height }
      : null;
    if (rect && rect.bottom > 0 && rect.top < height) {
      const halfH = CAMERA_Z * tanHalf;
      const halfW = halfH * (width / height);
      const cx = ((rect.left + rect.width / 2) / width) * 2 - 1;
      const cy = -(((rect.top + rect.height / 2) / height) * 2 - 1);
      const worldW = (rect.width / width) * 2 * halfW;
      const worldH = (rect.height / height) * 2 * halfH;
      const s = Math.min(worldW / 5.2, worldH / 3.9);
      graph.position.set(cx * halfW, cy * halfH, 0);
      graph.scale.set(s, s, s);
      graph.rotation.y = Math.sin(time * 0.12) * 0.55 + pointer.x * 0.5;
      graph.rotation.x = -0.12 + pointer.y * 0.35;
      fade = Math.min(1, Math.max(0, rect.bottom / (rect.height * 0.7)));
      graph.visible = true;

      if (flow < 0 || now - flowSince > FLOW_MS) {
        setFlow((flow + 1) % FLOWS.length);
        flowSince = now;
      }

      scene.updateMatrixWorld();
      let best = 52 * 52;
      NODES.forEach((node, i) => {
        projected.set(node.x, node.y, node.z).applyMatrix4(graphInner.worldMatrix);
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
          labelsShown = true;
          label.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0)`;
          label.style.opacity = String(fade * (0.45 + 0.55 * Math.min(1, Math.max(nodeGlow[i], i === hovered ? 1 : 0))));
        }
      });
    } else {
      graph.visible = false;
      // Hero scrolled away: labels must not linger over the next section.
      if (labelsShown) {
        labels.forEach((l) => (l.style.opacity = '0'));
        labelsShown = false;
      }
    }
    graphUniforms.uFade.value = fade;
    graphUniforms.uScale.value = graph.scale.x;

    if (graph.visible) {
      const ease = 1 - Math.exp(-dt * 6);
      let change = 0;
      for (let i = 0; i < NODES.length; i++) {
        const d = (Math.max(nodeTarget[i], i === hovered ? 1 : 0) - nodeGlow[i]) * ease;
        nodeGlow[i] += d;
        change = Math.max(change, Math.abs(d));
      }
      for (let e = 0; e < EDGES.length; e++) {
        const near = hovered >= 0 && (EDGES[e][0] === hovered || EDGES[e][1] === hovered) ? 0.8 : 0;
        const d = (Math.max(edgeTarget[e], near) - edgeGlow[e]) * ease;
        edgeGlow[e] += d;
        change = Math.max(change, Math.abs(d));
      }
      // Glows settle a moment after each flow change; skip the buffer uploads once they have.
      if (change > 0.0005 || dirDirty) {
        for (let e = 0; e < EDGES.length; e++) {
          lineGlow[e * 2] = lineGlow[e * 2 + 1] = edgeGlow[e];
          const start = e * PARTICLES_PER_EDGE * TRAIL;
          particleGlow.fill(edgeGlow[e], start, start + PARTICLES_PER_EDGE * TRAIL);
          particleDir.fill(edgeDir[e], start, start + PARTICLES_PER_EDGE * TRAIL);
        }
        nodeGeometry.attributes.aGlow.needsUpdate = true;
        lineGeometry.attributes.aGlow.needsUpdate = true;
        particleGeometry.attributes.aGlow.needsUpdate = true;
        particleGeometry.attributes.aDir.needsUpdate = true;
        dirDirty = false;
      }
      if (showLabels && (change > 0.0005 || hovered !== lastHovered)) {
        labels.forEach((l, i) => l.classList.toggle('is-active', i === hovered || nodeTarget[i] > 0));
      }
      lastHovered = hovered;
    }

    renderer.render({ scene, camera });
    if (!shown) {
      shown = true;
      root.classList.add('space-live');
    }
  };

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    frameIndex++;
    // Idle (no scroll or pointer for a moment): draw every other frame; the drift is slow anyway.
    const idle = now - lastInput > IDLE_MS;
    if ((fine && !idle) || frameIndex % 2 === 0) draw(now);
    if (!probing) return;
    probeFrames++;
    if (probeFrames === WARMUP_FRAMES) probeStart = now;
    if (probeFrames > WARMUP_FRAMES && now - probeStart >= PROBE_MS) {
      probing = false;
      const fps = ((probeFrames - WARMUP_FRAMES) * 1000) / (now - probeStart);
      root.dataset.spaceFps = String(Math.round(fps));
      // Too slow for this device: hand over to the static CSS stars and SVG graph.
      if (fps < MIN_FPS) fallback();
    }
  };

  function kick() {
    lastInput = performance.now();
  }
  function start() {
    if (running || document.hidden) return;
    running = true;
    lastTime = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    if (probing) probeFrames = 0;
  }
  let failed = false;
  function fallback() {
    failed = true;
    stop();
    root.classList.remove('space-live');
    root.dataset.spaceFallback = 'true';
  }

  const onVisibility = () => (document.hidden ? stop() : !failed && start());
  const onLost = (e: Event) => {
    e.preventDefault();
    fallback();
  };

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', onScroll, { passive: true });
  if (fine) window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onLost);
  start();

  return {
    setPage,
    destroy() {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onLost);
      root.classList.remove('space-live');
      loseContext();
    },
  };
}
