/**
 * The hero's "live system": the kind of fintech platform Daniel builds, as a graph.
 * World units; the 3D scene and the static SVG fallback both draw from this.
 */
export type SystemNode = { id: string; x: number; y: number; z: number; hub?: boolean };
export type SystemEdge = [from: number, to: number];
export type SystemFlow = { id: string; edges: [edge: number, dir: 1 | -1][] };

export const NODES: SystemNode[] = [
  { id: 'client', x: -1.9, y: 1.25, z: 0.6 },
  { id: 'api', x: -0.85, y: 0.35, z: 0.9 },
  { id: 'mq', x: 0.25, y: -0.1, z: 0, hub: true },
  { id: 'bo', x: 1.6, y: 1.0, z: -0.4 },
  { id: 'pay', x: -1.4, y: -1.25, z: -0.3 },
  { id: 'trade', x: 1.35, y: -1.3, z: 0.7 },
  { id: 'db', x: -0.1, y: 1.75, z: -0.9 },
  { id: 'risk', x: 2.15, y: -0.2, z: -1.0 },
];

const n = (id: string) => NODES.findIndex((node) => node.id === id);

export const EDGES: SystemEdge[] = [
  [n('client'), n('api')], // 0
  [n('api'), n('pay')], // 1
  [n('pay'), n('mq')], // 2
  [n('mq'), n('bo')], // 3
  [n('api'), n('mq')], // 4
  [n('mq'), n('trade')], // 5
  [n('trade'), n('risk')], // 6
  [n('risk'), n('mq')], // 7
  [n('bo'), n('db')], // 8
  [n('api'), n('db')], // 9
];

/** Message paths the scene lights up in turn. Captions live in the dictionary under the same ids. */
export const FLOWS: SystemFlow[] = [
  { id: 'deposit', edges: [[0, 1], [1, 1], [2, 1], [3, 1], [8, 1]] },
  { id: 'trade', edges: [[0, 1], [4, 1], [5, 1], [6, 1]] },
  { id: 'kyc', edges: [[3, -1], [4, -1], [9, 1]] },
];
