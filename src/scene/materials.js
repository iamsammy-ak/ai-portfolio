import * as THREE from 'three'

/* The palette: a dusk ride. Indigo night, violet horizon, one warm light. */
export const C = {
  ink: '#17133a',
  top: '#110d31',
  mid: '#2a2270',
  horizon: '#6a4ba6',
  ground: '#1b1548',
  asphalt: '#221b5a',
  wall: '#3b3399',
  dark: '#241d66',
  light: '#6e68d8',
  periwinkle: '#8e8bff',
  paper: '#f1eeff',
  saffron: '#ffb627',
  rose: '#ff5d8f',
}

const standard = (color, extra = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.75, metalness: 0.05, flatShading: true, ...extra })

/* Shared materials. Meshes reuse these so the whole scene is a handful of draw states. */
export const M = {
  wall: standard(C.wall),
  dark: standard(C.dark),
  light: standard(C.light),
  paper: standard(C.paper, { roughness: 0.9 }),
  rose: standard(C.rose, { roughness: 0.6 }),
  tree: standard('#2f2b85', { roughness: 1 }),
  asphalt: standard(C.asphalt, { roughness: 1, flatShading: false }),
  ground: standard(C.ground, { roughness: 1, flatShading: false }),
  line: new THREE.LineBasicMaterial({ color: C.periwinkle, transparent: true, opacity: 0.6 }),
  board: new THREE.MeshBasicMaterial({ color: '#cdc7ee' }),
  roseGlow: new THREE.MeshBasicMaterial({ color: new THREE.Color(C.rose).multiplyScalar(1.25), toneMapped: false }),
}

/* Things that glow rest at IDLE and warm up to HOT as the scooter arrives. */
export const IDLE = new THREE.Color('#544ec0')
export const HOT = new THREE.Color(C.saffron).multiplyScalar(1.22)

/* Shared geometries, all unit-sized and scaled per mesh. */
export const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 20),
  cyl6: new THREE.CylinderGeometry(0.5, 0.5, 1, 6),
  cone: new THREE.ConeGeometry(0.5, 1, 10),
  cone4: new THREE.ConeGeometry(0.5, 1, 4),
  cone6: new THREE.ConeGeometry(0.5, 1, 6),
  sphere: new THREE.SphereGeometry(0.5, 14, 10),
  octa: new THREE.OctahedronGeometry(0.5),
  ring: new THREE.TorusGeometry(0.5, 0.04, 8, 40),
  cup: new THREE.CylinderGeometry(0.5, 0.2, 1, 12),
}
