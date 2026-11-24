import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LAST, frameAt, smooth } from './layout.js'
import { live, useStore } from '../store.js'

/* The camera. It chases the scooter from behind and to the left, so the
   landmark at each stop sits to the right of the rider, clear of the text. */
export default function Rig() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const scratch = useRef({ frame: {}, want: new THREE.Vector3(), look: new THREE.Vector3(), eye: new THREE.Vector3(), started: false })

  // Shift the picture so the action is not hidden under the text:
  // to the right on wide screens, upward on narrow ones.
  useEffect(() => {
    const wide = size.width >= 900
    const dx = wide ? -Math.round(size.width * 0.085) : 0
    const dy = wide ? Math.round(size.height * 0.02) : Math.round(size.height * 0.22)
    camera.setViewOffset(size.width, size.height, dx, dy, size.width, size.height)
    return () => camera.clearViewOffset()
  }, [camera, size.width, size.height])

  useFrame((_, dt) => {
    const s = scratch.current
    const step = Math.min(dt, 0.05) || 0.016
    live.time += step * live.motion

    // Ease the scooter toward where the scroll position says it should be.
    const ease = live.motion ? 3 : 40
    live.p += (live.target - live.p) * (1 - Math.exp(-ease * step))
    if (Math.abs(live.target - live.p) < 0.0004) live.p = live.target

    const f = frameAt(live.p, s.frame)
    const aspect = size.width / size.height
    const k = aspect < 0.7 ? 2 : aspect < 1.15 ? 1.4 : 1 // stand further back on tall screens

    const leaving = 1 - smooth(live.p) // 1 at the start line, 0 from the first stop on
    const arriving = smooth(live.p - (LAST - 1)) // 0 until the last stretch, 1 at the arch

    const back = (6.9 + leaving * 2.6 + arriving * 2.4) * k
    const side = 3.7 + leaving * 1.9 - arriving * 2.6
    const height = (2.45 + leaving * 0.75 + arriving * 1.9) * k
    const lookRight = 3.3 * (1 - leaving * 0.75) * (1 - arriving)
    const lookAhead = 2.4 + leaving * 1.5 + arriving * 2.6

    s.want.copy(f.pos).addScaledVector(f.tan, -back).addScaledVector(f.right, -side)
    s.want.y = height
    s.look.copy(f.pos).addScaledVector(f.right, lookRight).addScaledVector(f.tan, lookAhead)
    s.look.y = 1.9 + arriving * 0.4

    if (!s.started) {
      s.eye.copy(s.want)
      s.started = true
    }
    s.eye.lerp(s.want, 1 - Math.exp(-(live.motion ? 3.4 : 40) * step))
    camera.position.copy(s.eye)
    camera.position.x += live.px * 0.35 * live.motion
    camera.position.y += -live.py * 0.2 * live.motion
    camera.lookAt(s.look)
  })

  return null
}

/* Watches the frame rate and steps the quality down if the device struggles. */
export function Monitor() {
  const sample = useRef({ frames: 0, time: 0, slow: 0 })
  useFrame((_, dt) => {
    if (document.hidden || dt > 0.25) return
    const s = sample.current
    s.frames += 1
    s.time += dt
    if (s.time < 2.5) return
    const fps = s.frames / s.time
    s.frames = 0
    s.time = 0
    s.slow = fps < 38 ? s.slow + 1 : 0
    if (s.slow < 2) return
    s.slow = 0
    const tier = useStore.getState().tier
    if (tier === 'high') useStore.setState({ tier: 'medium' })
    else if (tier === 'medium') useStore.setState({ tier: 'low' })
  })
  return null
}
