import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, G, HOT } from './materials.js'
import { frameAt } from './layout.js'
import { live } from '../store.js'

/* The scooter and its rider, modelled from rounded boxes, capsules and
   spheres. Local +Z is forward and +X is to the left of the rider. It only
   moves when the page scrolls. */

const paint = new THREE.MeshStandardMaterial({ color: C.rose, roughness: 0.32, metalness: 0.25 })
const chrome = new THREE.MeshStandardMaterial({ color: '#f4f0f9', roughness: 0.25, metalness: 0.6 })
const rubber = new THREE.MeshStandardMaterial({ color: '#1b1730', roughness: 0.85 })
const leather = new THREE.MeshStandardMaterial({ color: '#2a2350', roughness: 0.7 })
const jacket = new THREE.MeshStandardMaterial({ color: '#3b3aa8', roughness: 0.85 })
const denim = new THREE.MeshStandardMaterial({ color: '#28244f', roughness: 0.9 })
const shell = new THREE.MeshStandardMaterial({ color: '#f6f2fb', roughness: 0.3, metalness: 0.1 })
const skin = new THREE.MeshStandardMaterial({ color: '#c98f6f', roughness: 0.8 })
const caseBody = new THREE.MeshStandardMaterial({ color: C.saffron, roughness: 0.5 })
const lamp = new THREE.MeshBasicMaterial({ color: HOT, toneMapped: false })
const tail = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.rose).multiplyScalar(2), toneMapped: false })

const R = 0.27 // wheel radius
const Y = new THREE.Vector3(0, 1, 0)

const Part = ({ g = G.soft, m = paint, p, s, r }) => <mesh geometry={g} material={m} position={p} scale={s} rotation={r} />

function Wheel({ z, spin }) {
  return (
    <group position={[0, R, z]} ref={spin}>
      <mesh geometry={G.tyre} material={rubber} scale={[0.34, 0.385, 0.385]} />
      <mesh geometry={G.cyl} material={chrome} rotation={[0, 0, Math.PI / 2]} scale={[0.3, 0.13, 0.3]} />
      <mesh geometry={G.box} material={rubber} scale={[0.14, 0.26, 0.04]} />
    </group>
  )
}

/* One arm or leg segment: a capsule stretched between two points. */
function Limb({ from, to, radius, m }) {
  const a = new THREE.Vector3(...from)
  const b = new THREE.Vector3(...to)
  const mid = a.clone().add(b).multiplyScalar(0.5)
  const length = a.distanceTo(b)
  const q = new THREE.Quaternion().setFromUnitVectors(Y, b.clone().sub(a).normalize())
  return <mesh geometry={G.capsule} material={m} position={mid} quaternion={q} scale={[radius * 2, length / 2, radius * 2]} />
}

export default function Scooter() {
  const root = useRef()
  const lean = useRef()
  const front = useRef()
  const rear = useRef()
  const spot = useRef()
  const aim = useRef()
  const state = useRef({ frame: {}, last: new THREE.Vector3(), step: new THREE.Vector3(), heading: 0, started: false, tilt: 0 })

  useEffect(() => {
    spot.current.target = aim.current
  }, [])

  useFrame((_, dt) => {
    const s = state.current
    // The scooter is parked at the start line: it is the subject of the opening
    // shot, and the camera leaves it behind when the glide begins.
    const f = frameAt(0, s.frame)
    const heading = Math.atan2(f.tan.x, f.tan.z)
    root.current.position.copy(f.pos)
    root.current.rotation.y = heading

    if (!s.started) {
      s.last.copy(f.pos)
      s.heading = heading
      s.started = true
    }
    const step = Math.min(dt, 0.05) || 0.016
    s.step.copy(f.pos).sub(s.last)
    const travelled = s.step.length() * Math.sign(f.tan.dot(s.step) || 1)
    let turn = heading - s.heading
    if (turn > Math.PI) turn -= Math.PI * 2
    if (turn < -Math.PI) turn += Math.PI * 2
    s.last.copy(f.pos)
    s.heading = heading

    live.speed = Math.abs(travelled) / step
    front.current.rotation.x += travelled / R
    rear.current.rotation.x += travelled / R

    // Bank into the corner, and settle upright when stopped.
    const wanted = THREE.MathUtils.clamp((-turn / step) * 0.17, -0.4, 0.4)
    s.tilt += (wanted - s.tilt) * (1 - Math.exp(-6 * step))
    lean.current.rotation.z = s.tilt
    lean.current.position.y = Math.sin(live.time * 24) * 0.005 * Math.min(1, live.speed / 5)
  })

  return (
    <group ref={root} scale={1.28}>
      <group ref={lean}>
        <Wheel z={0.68} spin={front} />
        <Wheel z={-0.62} spin={rear} />

        {/* bodywork */}
        <Part p={[0, 0.31, 0.06]} s={[0.4, 0.09, 0.66]} />
        <Part g={G.sphere} p={[0, 0.55, -0.52]} s={[0.5, 0.5, 0.98]} />
        <Part p={[0, 0.5, -0.3]} s={[0.44, 0.34, 0.5]} />
        <Part g={G.sphere} p={[0, 0.47, 0.68]} s={[0.24, 0.26, 0.66]} />
        <Part p={[0, 0.72, 0.43]} s={[0.52, 0.74, 0.12]} r={[-0.3, 0, 0]} />
        <Part g={G.sphere} p={[0, 0.7, 0.5]} s={[0.4, 0.62, 0.2]} r={[-0.3, 0, 0]} />
        <Part m={chrome} p={[0, 0.74, 0.535]} s={[0.07, 0.56, 0.04]} r={[-0.3, 0, 0]} />
        <Part m={chrome} p={[0, 0.6, -0.5]} s={[0.51, 0.04, 0.6]} />
        <Part m={leather} p={[0, 0.84, -0.42]} s={[0.36, 0.13, 0.74]} />
        <Part g={G.sphere} m={tail} p={[0, 0.6, -0.99]} s={[0.16, 0.08, 0.06]} />

        {/* steering column, headset and handlebar */}
        <Part g={G.cyl} m={leather} p={[0, 1.08, 0.35]} s={[0.08, 0.34, 0.08]} r={[-0.3, 0, 0]} />
        <Part p={[0, 1.22, 0.32]} s={[0.3, 0.18, 0.24]} />
        <Part g={G.sphere} m={lamp} p={[0, 1.22, 0.44]} s={[0.17, 0.17, 0.08]} />
        <Part g={G.capsule} m={chrome} p={[0, 1.31, 0.26]} s={[0.05, 0.36, 0.05]} r={[0, 0, Math.PI / 2]} />
        <Part g={G.capsule} m={rubber} p={[0.36, 1.31, 0.26]} s={[0.07, 0.06, 0.07]} r={[0, 0, Math.PI / 2]} />
        <Part g={G.capsule} m={rubber} p={[-0.36, 1.31, 0.26]} s={[0.07, 0.06, 0.07]} r={[0, 0, Math.PI / 2]} />
        <Limb from={[0.3, 1.33, 0.26]} to={[0.4, 1.56, 0.2]} radius={0.012} m={chrome} />
        <Limb from={[-0.3, 1.33, 0.26]} to={[-0.4, 1.56, 0.2]} radius={0.012} m={chrome} />
        <Part g={G.sphere} m={chrome} p={[0.41, 1.59, 0.2]} s={[0.12, 0.09, 0.03]} />
        <Part g={G.sphere} m={chrome} p={[-0.41, 1.59, 0.2]} s={[0.12, 0.09, 0.03]} />

        {/* top case */}
        <Part m={caseBody} p={[0, 1.1, -0.96]} s={[0.46, 0.38, 0.4]} />
        <Part m={leather} p={[0, 0.9, -0.92]} s={[0.3, 0.05, 0.3]} />

        {/* rider */}
        <Part g={G.sphere} m={denim} p={[0, 0.98, -0.4]} s={[0.4, 0.3, 0.36]} />
        <Limb from={[0.12, 0.98, -0.34]} to={[0.15, 0.9, 0.04]} radius={0.085} m={denim} />
        <Limb from={[-0.12, 0.98, -0.34]} to={[-0.15, 0.9, 0.04]} radius={0.085} m={denim} />
        <Limb from={[0.15, 0.9, 0.04]} to={[0.15, 0.46, 0.14]} radius={0.07} m={denim} />
        <Limb from={[-0.15, 0.9, 0.04]} to={[-0.15, 0.46, 0.14]} radius={0.07} m={denim} />
        <Part m={shell} p={[0.15, 0.4, 0.2]} s={[0.12, 0.09, 0.26]} />
        <Part m={shell} p={[-0.15, 0.4, 0.2]} s={[0.12, 0.09, 0.26]} />
        <Limb from={[0, 1.02, -0.4]} to={[0, 1.46, -0.3]} radius={0.17} m={jacket} />
        <Part g={G.sphere} m={jacket} p={[0, 1.46, -0.29]} s={[0.5, 0.26, 0.3]} />
        <Limb from={[0.24, 1.46, -0.28]} to={[0.31, 1.2, -0.02]} radius={0.068} m={jacket} />
        <Limb from={[-0.24, 1.46, -0.28]} to={[-0.31, 1.2, -0.02]} radius={0.068} m={jacket} />
        <Limb from={[0.31, 1.2, -0.02]} to={[0.35, 1.32, 0.24]} radius={0.058} m={jacket} />
        <Limb from={[-0.31, 1.2, -0.02]} to={[-0.35, 1.32, 0.24]} radius={0.058} m={jacket} />
        <Part g={G.cyl} m={skin} p={[0, 1.6, -0.27]} s={[0.11, 0.1, 0.11]} />
        <Part g={G.sphere} m={shell} p={[0, 1.76, -0.25]} s={[0.36, 0.36, 0.39]} />
        <Part m={paint} p={[0, 1.79, -0.25]} s={[0.07, 0.33, 0.4]} />
        <Part g={G.sphere} m={leather} p={[0, 1.74, -0.12]} s={[0.3, 0.17, 0.22]} />

        {/* headlight beam */}
        <spotLight ref={spot} position={[0, 1.22, 0.5]} color="#ffd9a0" intensity={160} distance={36} angle={0.5} penumbra={0.9} decay={1.8} />
        <object3D ref={aim} position={[0, 0, 11]} />
      </group>
    </group>
  )
}
