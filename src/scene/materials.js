import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/* The look: a city modelled in matte clay at golden hour. Almost everything
   is one pale material, so the low sun does the colouring: warm where it
   lands, cool violet in the shade. Colour is saved for the scooter and for
   the lights that come on as it arrives. */
export const C = {
  ink: '#17133a',
  clay: '#dcd3e6',
  clayPale: '#f4f0f9',
  clayMid: '#b6abd0',
  clayDeep: '#8a7fa9',
  asphalt: '#a59bb9',
  pavement: '#c9c0d8',
  ground: '#c6b9cf',
  haze: '#f2b592',
  saffron: '#ffb627',
  rose: '#e8456f',
  periwinkle: '#6d68e8',
}

const clay = (color, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.92, metalness: 0, ...extra })

/* Shared materials. Meshes reuse these so the whole scene is a handful of draw states. */
export const M = {
  wall: clay(C.clay),
  dark: clay(C.clayDeep),
  light: clay(C.clayMid),
  paper: clay(C.clayPale),
  rose: clay(C.rose, { roughness: 0.6 }),
  tree: clay('#a69bc2'),
  asphalt: clay(C.asphalt),
  pavement: clay(C.pavement),
  ground: clay(C.ground),
  window: clay('#7d7299', { roughness: 0.5 }),
  line: new THREE.LineBasicMaterial({ color: C.clayDeep }),
  board: new THREE.MeshBasicMaterial({ color: '#f1ecf8' }),
  roseGlow: new THREE.MeshBasicMaterial({ color: new THREE.Color(C.rose).multiplyScalar(1.5), toneMapped: false }),
  lamp: new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc46b').multiplyScalar(2.2), toneMapped: false }),
}

/* Things that light up rest at IDLE and warm to HOT as the scooter arrives. */
export const IDLE = new THREE.Color('#a79dc6')
export const HOT = new THREE.Color(C.saffron).multiplyScalar(1.5)

/* Shared geometries, all unit-sized and scaled per mesh. */
export const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  soft: new RoundedBoxGeometry(1, 1, 1, 4, 0.16),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 28),
  cyl6: new THREE.CylinderGeometry(0.5, 0.5, 1, 6),
  cone: new THREE.ConeGeometry(0.5, 1, 24),
  cone4: new THREE.ConeGeometry(0.5, 1, 4),
  cone6: new THREE.ConeGeometry(0.5, 1, 14),
  roof: new THREE.ConeGeometry(0.5, 1, 4).rotateY(Math.PI / 4),
  sphere: new THREE.SphereGeometry(0.5, 28, 20),
  octa: new THREE.OctahedronGeometry(0.5),
  ring: new THREE.TorusGeometry(0.5, 0.04, 10, 56),
  cup: new THREE.CylinderGeometry(0.5, 0.2, 1, 24),
  capsule: new THREE.CapsuleGeometry(0.5, 1, 6, 16),
  tyre: new THREE.TorusGeometry(0.5, 0.2, 12, 28).rotateY(Math.PI / 2),
}
