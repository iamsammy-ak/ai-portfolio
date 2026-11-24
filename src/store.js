import { create } from 'zustand'

/* What this device can do, decided once before the 3D scene loads.
   No network request is involved, so a blocked CDN can never stall the page. */
function detect() {
  if (typeof document === 'undefined') return { webgl: false, tier: 'low' }
  // Adding ?plain to the address turns the 3D scene off, for testing or for a slow machine.
  const query = new URLSearchParams(window.location.search)
  if (query.has('plain')) return { webgl: false, tier: 'low' }
  // ?quality=high, medium or low overrides the automatic choice below.
  const forced = ['high', 'medium', 'low'].find((t) => t === query.get('quality'))
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2')
    if (!gl) return { webgl: false, tier: 'low' }
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    const software = /swiftshader|llvmpipe|software|basic render/i.test(renderer)
    const handheld = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 760
    return { webgl: true, tier: forced || (software ? 'low' : handheld ? 'medium' : 'high') }
  } catch {
    return { webgl: false, tier: 'low' }
  }
}

export const caps = detect()

export const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Reactive state: only things the interface needs to re-render for. */
export const useStore = create(() => ({
  active: 0, // index of the stop nearest the middle of the screen
  inRide: true, // false once the reader has scrolled past the ride
  tier: caps.tier, // 'high' | 'medium' | 'low'
  ready: false, // true once the first 3D frame is on screen
  lost: false, // true if the graphics context was lost; the scene is then removed
}))

/* Per-frame values. The scene reads these inside its render loop, so
   scrolling never triggers a React re-render. */
export const live = {
  target: 0, // where the scroll position says the scooter should be
  p: 0, // smoothed position, in stops
  time: 0, // animation clock; stays at 0 when motion is reduced
  motion: reducedMotion ? 0 : 1,
  px: 0, // pointer, -1..1
  py: 0,
  speed: 0, // scooter speed in metres per second
}
