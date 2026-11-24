import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { C, G, M } from './materials.js'
import { STOPS, frameAt, road, seeded } from './layout.js'
import { useStore } from '../store.js'

/* Sky, horizon, ground and roadside trees: everything that is not the
   road, the scooter or a landmark. */

const skyMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  fog: false,
  uniforms: {
    top: { value: new THREE.Color(C.top) },
    mid: { value: new THREE.Color(C.mid) },
    low: { value: new THREE.Color(C.horizon) },
    glow: { value: new THREE.Color('#c0609c') },
  },
  vertexShader: /* glsl */ `
    varying vec3 vDir;
    void main() {
      vDir = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform vec3 top;
    uniform vec3 mid;
    uniform vec3 low;
    uniform vec3 glow;
    varying vec3 vDir;
    void main() {
      float h = clamp(vDir.y, 0.0, 1.0);
      vec3 col = mix(low, mid, smoothstep(0.0, 0.2, h));
      col = mix(col, top, smoothstep(0.14, 0.7, h));
      // a warm band of afterglow in the direction the road is heading
      float ahead = smoothstep(0.2, 1.0, dot(normalize(vDir.xz + 0.0001), normalize(vec2(0.35, -1.0))));
      col = mix(col, glow, ahead * (1.0 - smoothstep(0.0, 0.16, h)) * 0.55);
      gl_FragColor = vec4(col, 1.0);
      #include <colorspace_fragment>
    }
  `,
})

const moonMaterial = new THREE.MeshBasicMaterial({ color: '#ffe9c8', fog: false, toneMapped: false })
const farRange = new THREE.MeshBasicMaterial({ color: '#4a3889', fog: false })
const nearRange = new THREE.MeshBasicMaterial({ color: '#33276f', fog: false })
const starMaterial = new THREE.PointsMaterial({ color: C.paper, size: 1.15, sizeAttenuation: true, transparent: true, opacity: 0.85, fog: false, depthWrite: false })

function Backdrop() {
  const group = useRef()
  const tier = useStore((s) => s.tier)

  const stars = useMemo(() => {
    const rand = seeded(7)
    const count = tier === 'low' ? 220 : 520
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const azimuth = rand() * Math.PI * 2
      const height = 0.16 + rand() * 0.84
      const r = Math.sqrt(1 - height * height)
      positions.set([Math.cos(azimuth) * r * 300, height * 300, Math.sin(azimuth) * r * 300], i * 3)
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geometry
  }, [tier])

  const peaks = useMemo(() => {
    const rand = seeded(21)
    const list = []
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 + rand() * 0.12
      const h = 26 + rand() * 34
      list.push({ far: true, x: Math.cos(a) * 250, z: Math.sin(a) * 250, h, w: 46 + rand() * 34, turn: rand() * 3 })
    }
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 + rand() * 0.2
      const h = 10 + rand() * 16
      list.push({ far: false, x: Math.cos(a) * 205, z: Math.sin(a) * 205, h, w: 40 + rand() * 30, turn: rand() * 3 })
    }
    return list
  }, [])

  // The backdrop travels with the camera, so the horizon never gets closer.
  useFrame(({ camera }) => {
    group.current.position.set(camera.position.x, 0, camera.position.z)
  })

  return (
    <group ref={group}>
      <mesh material={skyMaterial} renderOrder={-10}>
        <sphereGeometry args={[320, 32, 16]} />
      </mesh>
      <points geometry={stars} material={starMaterial} renderOrder={-9} />
      <mesh position={[120, 66, -270]} material={moonMaterial} renderOrder={-8}>
        <circleGeometry args={[8, 40]} />
      </mesh>
      {peaks.map((p, i) => (
        <mesh
          key={i}
          geometry={G.cone4}
          material={p.far ? farRange : nearRange}
          position={[p.x, p.h / 2 - 1.5, p.z]}
          rotation={[0, p.turn, 0]}
          scale={[p.w, p.h, p.w]}
          renderOrder={p.far ? -7 : -6}
        />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} material={M.ground}>
        <circleGeometry args={[420, 48]} />
      </mesh>
    </group>
  )
}

/* Cypress trees along the road, kept clear of the asphalt and the landmarks. */
function Trees() {
  const tier = useStore((s) => s.tier)
  const mesh = useMemo(() => {
    const rand = seeded(1234)
    const count = tier === 'low' ? 120 : 260
    const anchors = []
    for (let i = 0; i < STOPS; i++) {
      const f = frameAt(i)
      anchors.push(f.pos.clone().addScaledVector(f.right, 6.6).addScaledVector(f.tan, 3))
    }
    const instanced = new THREE.InstancedMesh(G.cone6, M.tree, count)
    const dummy = new THREE.Object3D()
    const P = new THREE.Vector3()
    const T = new THREE.Vector3()
    const N = new THREE.Vector3()
    const up = new THREE.Vector3(0, 1, 0)
    let placed = 0
    let guard = 0
    while (placed < count && guard++ < count * 20) {
      const t = rand()
      road.getPointAt(t, P)
      road.getTangentAt(t, T)
      N.crossVectors(T, up).normalize()
      const side = rand() < 0.5 ? -1 : 1
      // The camera travels down the left side of the road, so that side is kept clear.
      const away = (side < 0 ? 12 : 5) + Math.pow(rand(), 1.6) * 34
      P.addScaledVector(N, side * away)
      if (anchors.some((a) => a.distanceTo(P) < 10.5)) continue
      const h = 3 + rand() * 4.2
      dummy.position.set(P.x, h / 2 - 0.05, P.z)
      dummy.scale.set(0.9 + rand() * 0.8, h, 0.9 + rand() * 0.8)
      dummy.rotation.set(0, rand() * 6, 0)
      dummy.updateMatrix()
      instanced.setMatrixAt(placed++, dummy.matrix)
    }
    instanced.count = placed
    instanced.instanceMatrix.needsUpdate = true
    instanced.frustumCulled = false
    return instanced
  }, [tier])
  return <primitive object={mesh} />
}

export default function World() {
  return (
    <>
      <hemisphereLight args={['#9a93ff', '#1d1650', 1.35]} />
      <directionalLight position={[40, 60, -120]} color="#ffd2a8" intensity={1.1} />
      <directionalLight position={[-30, 20, 40]} color="#8e8bff" intensity={0.5} />
      <Backdrop />
      <Trees />
    </>
  )
}
