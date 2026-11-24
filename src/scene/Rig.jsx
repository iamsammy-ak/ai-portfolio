import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { LAST, frameAt, smooth } from './layout.js'
import { live, useStore } from '../store.js'

const SPACING = 30 // metres between stops, used to turn scroll speed into road speed

/* The camera.

   It opens on a held shot of the parked scooter. On the first scroll it
   lifts away and becomes a first-person glide down the street. At each stop
   it eases its gaze to the right, toward that stop's landmark, then looks
   back down the road as it moves on. */
export default function Rig() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const scratch = useRef({
    frame: {},
    start: frameAt(0),
    want: new THREE.Vector3(),
    look: new THREE.Vector3(),
    heldEye: new THREE.Vector3(),
    heldLook: new THREE.Vector3(),
    eye: new THREE.Vector3(),
    gaze: new THREE.Vector3(),
    lastP: 0,
    started: false,
  })

  // Shift the picture so the action is not hidden under the text:
  // to the right on wide screens, upward on narrow ones.
  useEffect(() => {
    const wide = size.width >= 900
    const dx = wide ? -Math.round(size.width * 0.07) : 0
    const dy = wide ? 0 : Math.round(size.height * 0.2)
    camera.setViewOffset(size.width, size.height, dx, dy, size.width, size.height)
    return () => camera.clearViewOffset()
  }, [camera, size.width, size.height])

  useFrame((_, dt) => {
    const s = scratch.current
    const step = Math.min(dt, 0.05) || 0.016
    live.time += step * live.motion

    // Ease toward where the scroll position says we should be: this is the momentum.
    const ease = live.motion ? 2.6 : 40
    live.p += (live.target - live.p) * (1 - Math.exp(-ease * step))
    if (Math.abs(live.target - live.p) < 0.0004) live.p = live.target
    live.speed = (Math.abs(live.p - s.lastP) * SPACING) / step
    s.lastP = live.p

    const f = frameAt(live.p, s.frame)
    const aspect = size.width / size.height
    const tall = aspect < 0.7 ? 1.5 : aspect < 1.15 ? 1.2 : 1

    // The held opening shot, from behind and to the left of the parked scooter.
    const a = s.start
    s.heldEye.copy(a.pos).addScaledVector(a.tan, -7.6 * tall).addScaledVector(a.right, -4.4)
    s.heldEye.y = 2.5 * tall
    s.heldLook.copy(a.pos).addScaledVector(a.tan, 4).addScaledVector(a.right, 1.2)
    s.heldLook.y = 1.9

    // The glide: a little behind the scroll position, at eye height, looking down the road.
    const stop = Math.round(live.p)
    const atLandmark = stop > 0 && stop < LAST ? smooth(1 - Math.abs(live.p - stop) / 0.42) : 0
    const atArch = smooth(live.p - (LAST - 1))
    s.want.copy(f.pos).addScaledVector(f.tan, -9 * tall).addScaledVector(f.right, -0.8 - atLandmark * 1.6)
    s.want.y = (2.5 + atArch * 0.6) * tall + Math.sin(live.time * 0.7) * 0.04
    s.look.copy(f.pos).addScaledVector(f.tan, 5 + (1 - atLandmark) * 9).addScaledVector(f.right, atLandmark * 5.6)
    s.look.y = 2.5 - atLandmark * 0.2

    const held = 1 - smooth(live.p / 0.6)
    s.want.lerp(s.heldEye, held)
    s.look.lerp(s.heldLook, held)

    if (!s.started) {
      s.eye.copy(s.want)
      s.gaze.copy(s.look)
      s.started = true
    }
    const follow = 1 - Math.exp(-(live.motion ? 3 : 40) * step)
    s.eye.lerp(s.want, follow)
    s.gaze.lerp(s.look, follow)
    camera.position.copy(s.eye)
    camera.position.x += live.px * 0.3 * live.motion
    camera.position.y += -live.py * 0.16 * live.motion
    camera.lookAt(s.gaze)
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
