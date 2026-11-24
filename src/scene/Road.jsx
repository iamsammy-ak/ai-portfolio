import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { G, HOT, M } from './materials.js'
import { arcFraction, ribbon, road, roadLength, tOf } from './layout.js'
import { live } from '../store.js'

const kerb = new THREE.MeshStandardMaterial({ color: '#efe9f6', roughness: 0.9 })
const dashMaterial = new THREE.MeshBasicMaterial({ toneMapped: false })
const UNLIT = new THREE.Color('#e9e2f2')

/* The street: asphalt, a pavement and kerb on each side, and centre dashes
   that stay lit behind the scooter, so the distance covered reads as a warm trail. */
export default function Road() {
  const lit = useRef(-1)

  const { strips, dashes, count } = useMemo(() => {
    const count = Math.floor(roadLength / 3.6)
    const dashes = new THREE.InstancedMesh(G.box, dashMaterial, count)
    const dummy = new THREE.Object3D()
    const P = new THREE.Vector3()
    const T = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count
      road.getPointAt(u, P)
      road.getTangentAt(u, T)
      dummy.position.set(P.x, 0.03, P.z)
      dummy.lookAt(P.x + T.x, 0.03, P.z + T.z)
      dummy.scale.set(0.16, 0.02, 1.5)
      dummy.updateMatrix()
      dashes.setMatrixAt(i, dummy.matrix)
      dashes.setColorAt(i, UNLIT)
    }
    dashes.instanceMatrix.needsUpdate = true
    dashes.frustumCulled = false
    dashes.userData.noShadow = true
    return {
      strips: [
        [ribbon({ width: 5, y: 0.01 }), M.asphalt],
        [ribbon({ offset: -4.4, width: 3.8, y: 0.09 }), M.pavement],
        [ribbon({ offset: 4.4, width: 3.8, y: 0.09 }), M.pavement],
        [ribbon({ offset: -2.56, width: 0.16, y: 0.11 }), kerb],
        [ribbon({ offset: 2.56, width: 0.16, y: 0.11 }), kerb],
      ],
      dashes,
      count,
    }
  }, [])

  useFrame(() => {
    const now = Math.floor(arcFraction(tOf(live.p)) * count)
    if (now === lit.current) return
    const from = Math.max(0, Math.min(now, lit.current))
    const to = Math.min(count, Math.max(now, lit.current))
    for (let i = from; i < to; i++) dashes.setColorAt(i, i < now ? HOT : UNLIT)
    dashes.instanceColor.needsUpdate = true
    lit.current = now
  })

  return (
    <>
      {strips.map(([geometry, material], i) => (
        <mesh key={i} geometry={geometry} material={material} userData={{ receiveOnly: true }} />
      ))}
      <primitive object={dashes} />
    </>
  )
}
