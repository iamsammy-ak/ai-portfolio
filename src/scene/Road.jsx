import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { G, HOT, M } from './materials.js'
import { arcFraction, ribbon, road, roadLength, tOf } from './layout.js'
import { live } from '../store.js'

const edgeMaterial = new THREE.MeshBasicMaterial({ color: '#8f8adf', side: THREE.DoubleSide })
const dashMaterial = new THREE.MeshBasicMaterial({ toneMapped: false })
const UNLIT = new THREE.Color('#6f69d6')

/* The asphalt, its edge lines, and centre dashes that stay lit behind the
   scooter, so the road already travelled reads as a warm trail. */
export default function Road() {
  const lit = useRef(-1)

  const { asphalt, left, right, dashes, count } = useMemo(() => {
    const count = Math.floor(roadLength / 3.6)
    const dashes = new THREE.InstancedMesh(G.box, dashMaterial, count)
    const dummy = new THREE.Object3D()
    const P = new THREE.Vector3()
    const T = new THREE.Vector3()
    for (let i = 0; i < count; i++) {
      const u = (i + 0.5) / count
      road.getPointAt(u, P)
      road.getTangentAt(u, T)
      dummy.position.set(P.x, 0.025, P.z)
      dummy.lookAt(P.x + T.x, 0.025, P.z + T.z)
      dummy.scale.set(0.16, 0.02, 1.5)
      dummy.updateMatrix()
      dashes.setMatrixAt(i, dummy.matrix)
      dashes.setColorAt(i, UNLIT)
    }
    dashes.instanceMatrix.needsUpdate = true
    dashes.frustumCulled = false
    return {
      asphalt: ribbon({ width: 4.6, y: 0 }),
      left: ribbon({ offset: -2.05, width: 0.1, y: 0.02 }),
      right: ribbon({ offset: 2.05, width: 0.1, y: 0.02 }),
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
      <mesh geometry={asphalt} material={M.asphalt} />
      <mesh geometry={left} material={edgeMaterial} />
      <mesh geometry={right} material={edgeMaterial} />
      <primitive object={dashes} />
    </>
  )
}
