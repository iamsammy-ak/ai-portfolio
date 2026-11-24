import * as THREE from 'three'
import { route as stopsContent } from '../content.js'

/* The geometry of the road. Everything in the scene is placed relative
   to this one curve, so changing the numbers here reshapes the whole ride. */

export const STOPS = stopsContent.length
export const LAST = STOPS - 1

const SPACING = 30 // metres of road between two stops
const SWAY = 13 // how far the road swings left and right

// One control point per stop, plus a lead-in and a run-out so the road
// continues past the first and last stop instead of ending under the wheels.
const points = []
for (let i = -1; i <= STOPS; i++) {
  points.push(new THREE.Vector3(Math.sin(i * 0.85) * SWAY, 0, -i * SPACING))
}

export const road = new THREE.CatmullRomCurve3(points, false, 'centripetal')
road.arcLengthDivisions = 3000
road.updateArcLengths()

/* Stop index (may be fractional) -> curve parameter. */
export const tOf = (p) => (p + 1) / (STOPS + 1)

const UP = new THREE.Vector3(0, 1, 0)

/* Position, forward direction and right-hand direction at a stop. */
export function frameAt(p, out = {}) {
  const t = THREE.MathUtils.clamp(tOf(p), 0, 1)
  out.pos = road.getPoint(t, out.pos || new THREE.Vector3())
  out.tan = road.getTangent(t, out.tan || new THREE.Vector3())
  out.tan.y = 0
  out.tan.normalize()
  out.right = (out.right || new THREE.Vector3()).crossVectors(out.tan, UP).normalize()
  return out
}

/* Curve parameter -> fraction of the road's length (0..1). The curve's own
   parameter is not uniform in distance, so the lit trail needs this. */
const lengths = road.getLengths()
const total = lengths[lengths.length - 1]
export const roadLength = total
export function arcFraction(t) {
  const x = THREE.MathUtils.clamp(t, 0, 1) * (lengths.length - 1)
  const i = Math.min(Math.floor(x), lengths.length - 2)
  return (lengths[i] + (lengths[i + 1] - lengths[i]) * (x - i)) / total
}

/* A flat strip that follows the road: the asphalt and its painted lines. */
export function ribbon({ offset = 0, width = 1, y = 0, segments = 900 }) {
  const position = new Float32Array((segments + 1) * 6)
  const index = []
  const P = new THREE.Vector3()
  const T = new THREE.Vector3()
  const N = new THREE.Vector3()
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    road.getPoint(t, P)
    road.getTangent(t, T)
    N.crossVectors(T, UP).normalize()
    const a = offset - width / 2
    const b = offset + width / 2
    position.set([P.x + N.x * a, y, P.z + N.z * a, P.x + N.x * b, y, P.z + N.z * b], i * 6)
    if (i < segments) {
      const k = i * 2
      index.push(k, k + 1, k + 2, k + 1, k + 3, k + 2)
    }
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
  geometry.setIndex(index)
  geometry.computeVertexNormals()
  return geometry
}

/* Small deterministic random generator, so the scenery is identical on every visit. */
export function seeded(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const smooth = (x) => {
  const c = THREE.MathUtils.clamp(x, 0, 1)
  return c * c * (3 - 2 * c)
}
