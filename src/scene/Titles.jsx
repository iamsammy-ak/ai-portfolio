import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { stops } from '../content.js'
import { frameAt, smooth } from './layout.js'
import { live } from '../store.js'

/* The name of each stop, hanging over the street a little before it. Each
   one fades in as the camera sets off toward it, grows as it approaches,
   and passes overhead.

   The lettering is drawn with the page's own display typeface onto a
   transparent texture, so no font file has to be shipped for the 3D scene. */

const FONT = '700 150px "Bricolage Grotesque Variable", "Arial Narrow", sans-serif'
const AHEAD = 0.6 // how far before its stop a title hangs, in stops

function drawTitle(text) {
  const canvas = document.createElement('canvas')
  const measure = canvas.getContext('2d')
  measure.font = FONT
  const width = Math.ceil(measure.measureText(text).width) + 80
  canvas.width = width
  canvas.height = 230
  const ctx = canvas.getContext('2d')
  ctx.font = FONT
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'
  ctx.shadowColor = 'rgba(40, 24, 80, 0.45)'
  ctx.shadowBlur = 26
  ctx.fillStyle = '#fffaf2'
  ctx.fillText(text, width / 2, 118)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return { texture, aspect: width / canvas.height }
}

export default function Titles() {
  const [fontReady, setFontReady] = useState(false)
  const materials = useRef([])

  useEffect(() => {
    let alive = true
    const done = () => alive && setFontReady(true)
    if (document.fonts?.load) document.fonts.load(FONT).then(done, done)
    else done()
    return () => {
      alive = false
    }
  }, [])

  const signs = useMemo(() => {
    if (!fontReady) return []
    return stops.map((stop, i) => {
      const at = i + 1 - AHEAD
      const f = frameAt(at)
      const { texture, aspect } = drawTitle(stop.title)
      const width = Math.min(1.7 * aspect, 15)
      return {
        id: stop.id,
        at,
        texture,
        size: [width, width / aspect],
        position: [f.pos.x, 5.1, f.pos.z],
        rotation: [0, Math.atan2(-f.tan.x, -f.tan.z), 0],
      }
    })
  }, [fontReady])

  // A title is invisible until the camera has left the previous stop.
  useFrame(() => {
    signs.forEach((sign, i) => {
      const material = materials.current[i]
      if (!material) return
      const opacity = smooth((live.p - (sign.at - 0.36)) / 0.2)
      material.opacity = opacity
      material.visible = opacity > 0.01
    })
  })

  return signs.map((sign, i) => (
    <mesh key={sign.id} position={sign.position} rotation={sign.rotation} userData={{ noShadow: true }}>
      <planeGeometry args={sign.size} />
      <meshBasicMaterial
        ref={(el) => {
          materials.current[i] = el
        }}
        map={sign.texture}
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  ))
}
