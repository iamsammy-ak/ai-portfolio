import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, G, HOT, M } from './materials.js'
import { frameAt } from './layout.js'
import { live } from '../store.js'

/* The scooter and its rider, built entirely from boxes, cylinders and
   spheres. Local +Z is forward. It only moves when the page scrolls. */

const body = new THREE.MeshStandardMaterial({ color: C.rose, roughness: 0.45, metalness: 0.15, flatShading: true })
const trim = new THREE.MeshStandardMaterial({ color: C.paper, roughness: 0.6, flatShading: true })
const helmet = new THREE.MeshStandardMaterial({ color: C.paper, roughness: 0.4, emissive: '#6b64ad', emissiveIntensity: 0.55 })
const rubber = new THREE.MeshStandardMaterial({ color: '#100c2c', roughness: 0.9, flatShading: true })
const seat = new THREE.MeshStandardMaterial({ color: '#1c1650', roughness: 0.8, flatShading: true })
const jacket = new THREE.MeshStandardMaterial({ color: C.periwinkle, roughness: 0.8, flatShading: true })
const trousers = new THREE.MeshStandardMaterial({ color: '#2b2478', roughness: 0.9, flatShading: true })
const lamp = new THREE.MeshBasicMaterial({ color: HOT, toneMapped: false })
const tail = new THREE.MeshBasicMaterial({ color: new THREE.Color(C.rose).multiplyScalar(1.6), toneMapped: false })

const WHEEL = 0.27

function Wheel({ z, spin }) {
  return (
    <group position={[0, WHEEL, z]} ref={spin}>
      <mesh geometry={G.cyl} material={rubber} rotation={[0, 0, Math.PI / 2]} scale={[WHEEL * 2, 0.14, WHEEL * 2]} />
      <mesh geometry={G.cyl} material={trim} rotation={[0, 0, Math.PI / 2]} scale={[WHEEL * 1.15, 0.15, WHEEL * 1.15]} />
      <mesh geometry={G.box} material={rubber} scale={[0.16, WHEEL * 1.1, 0.05]} />
    </group>
  )
}

export default function Scooter() {
  const root = useRef()
  const lean = useRef()
  const front = useRef()
  const rear = useRef()
  const spot = useRef()
  const aim = useRef()
  const state = useRef({ frame: {}, last: new THREE.Vector3(), heading: 0, started: false, tilt: 0 })

  useEffect(() => {
    spot.current.target = aim.current
  }, [])

  useFrame((_, dt) => {
    const s = state.current
    const f = frameAt(live.p, s.frame)
    const heading = Math.atan2(f.tan.x, f.tan.z)
    root.current.position.copy(f.pos)
    root.current.rotation.y = heading

    if (!s.started) {
      s.last.copy(f.pos)
      s.heading = heading
      s.started = true
    }
    const step = Math.min(dt, 0.05) || 0.016
    const travelled = f.pos.distanceTo(s.last) * Math.sign(f.tan.dot(f.pos.clone().sub(s.last)) || 1)
    let turn = heading - s.heading
    if (turn > Math.PI) turn -= Math.PI * 2
    if (turn < -Math.PI) turn += Math.PI * 2
    s.last.copy(f.pos)
    s.heading = heading

    live.speed = Math.abs(travelled) / step
    front.current.rotation.x += travelled / WHEEL
    rear.current.rotation.x += travelled / WHEEL

    // Bank into the corner, more at speed, and settle upright when stopped.
    const wanted = THREE.MathUtils.clamp((-turn / step) * 0.16, -0.38, 0.38)
    s.tilt += (wanted - s.tilt) * (1 - Math.exp(-6 * step))
    lean.current.rotation.z = s.tilt
    lean.current.position.y = Math.sin(live.time * 22) * 0.006 * Math.min(1, live.speed / 5)
  })

  return (
    <group ref={root} scale={1.3}>
      <group ref={lean}>
        <Wheel z={0.66} spin={front} />
        <Wheel z={-0.62} spin={rear} />

        {/* frame */}
        <mesh geometry={G.box} material={body} position={[0, 0.33, 0.04]} scale={[0.4, 0.07, 0.72]} />
        <mesh geometry={G.box} material={body} position={[0, 0.56, -0.5]} scale={[0.46, 0.4, 0.78]} />
        <mesh geometry={G.box} material={body} position={[0, 0.5, -0.94]} scale={[0.36, 0.26, 0.2]} rotation={[0.5, 0, 0]} />
        <mesh geometry={G.box} material={trim} position={[0, 0.56, -0.5]} scale={[0.47, 0.05, 0.6]} />
        <mesh geometry={G.box} material={seat} position={[0, 0.8, -0.44]} scale={[0.36, 0.1, 0.68]} />
        <mesh geometry={G.box} material={tail} position={[0, 0.62, -0.91]} scale={[0.2, 0.07, 0.04]} />

        {/* front shield, column and handlebar */}
        <mesh geometry={G.box} material={body} position={[0, 0.7, 0.44]} scale={[0.48, 0.74, 0.09]} rotation={[-0.28, 0, 0]} />
        <mesh geometry={G.box} material={trim} position={[0, 0.72, 0.49]} scale={[0.1, 0.6, 0.02]} rotation={[-0.28, 0, 0]} />
        <mesh geometry={G.box} material={body} position={[0, 0.56, 0.68]} scale={[0.22, 0.09, 0.5]} />
        <mesh geometry={G.cyl} material={seat} position={[0, 1.08, 0.34]} scale={[0.07, 0.36, 0.07]} rotation={[-0.28, 0, 0]} />
        <mesh geometry={G.box} material={body} position={[0, 1.2, 0.33]} scale={[0.26, 0.17, 0.2]} />
        <mesh geometry={G.cyl} material={seat} position={[0, 1.27, 0.27]} scale={[0.05, 0.74, 0.05]} rotation={[0, 0, Math.PI / 2]} />
        <mesh geometry={G.sphere} material={lamp} position={[0, 1.2, 0.44]} scale={[0.17, 0.17, 0.1]} />

        {/* a courier box on the back: the toolkit */}
        <mesh geometry={G.box} material={jacket} position={[0, 1.02, -0.92]} scale={[0.42, 0.36, 0.34]} />
        <mesh geometry={G.box} material={trim} position={[0, 1.22, -0.92]} scale={[0.44, 0.05, 0.36]} />

        {/* rider */}
        <mesh geometry={G.box} material={trousers} position={[0.13, 0.66, -0.12]} scale={[0.13, 0.13, 0.56]} rotation={[0.22, 0, 0]} />
        <mesh geometry={G.box} material={trousers} position={[-0.13, 0.66, -0.12]} scale={[0.13, 0.13, 0.56]} rotation={[0.22, 0, 0]} />
        <mesh geometry={G.box} material={trousers} position={[0.13, 0.5, 0.14]} scale={[0.12, 0.34, 0.13]} />
        <mesh geometry={G.box} material={trousers} position={[-0.13, 0.5, 0.14]} scale={[0.12, 0.34, 0.13]} />
        <mesh geometry={G.box} material={jacket} position={[0, 1.16, -0.36]} scale={[0.36, 0.6, 0.24]} rotation={[0.16, 0, 0]} />
        <mesh geometry={G.box} material={jacket} position={[0.21, 1.25, -0.04]} scale={[0.1, 0.1, 0.62]} rotation={[0.04, -0.12, 0]} />
        <mesh geometry={G.box} material={jacket} position={[-0.21, 1.25, -0.04]} scale={[0.1, 0.1, 0.62]} rotation={[0.04, 0.12, 0]} />
        <mesh geometry={G.sphere} material={helmet} position={[0, 1.66, -0.28]} scale={[0.34, 0.34, 0.36]} />
        <mesh geometry={G.box} material={body} position={[0, 1.7, -0.28]} scale={[0.05, 0.3, 0.37]} />
        <mesh geometry={G.box} material={seat} position={[0, 1.66, -0.11]} scale={[0.26, 0.11, 0.08]} />

        {/* headlight beam and a warm pool of light that reaches the landmark */}
        <spotLight ref={spot} position={[0, 1.2, 0.5]} color="#ffcf7a" intensity={340} distance={44} angle={0.52} penumbra={0.85} decay={1.7} />
        <object3D ref={aim} position={[0, 0, 11]} />
        <pointLight position={[-4.6, 3.4, 3.6]} color="#ffb627" intensity={70} distance={28} decay={1.7} />
      </group>
    </group>
  )
}
