import { aM as world, aN as scroll, aR as audio } from './assets/index-DjXkBzPf.js'

const origin = location.origin
let entered = false
let lastSent = 0
let canEnter = false
const send = (data) => parent.postMessage({ source: 'ak-world', ...data }, origin)
const state = () => {
  const s = world.getState()
  return { country: s.country, progress: scroll.getState().scroll, ready: canEnter, entered, muted: s.isSoundsMuted }
}

// The original loader registers Start after its CSS transition. Keep that animation alive,
// then expose readiness to the parent. No fabricated loading percentage.
world.subscribe(s => s.scene_loaded_after_progress, ready => {
  if (ready) setTimeout(() => { canEnter = true; enter(); send({ type: 'ready', ...state() }) }, 1800)
}, { fireImmediately: true })
world.subscribe(s => s.country, () => send({ type: 'state', ...state() }))
scroll.subscribe(s => s.scroll, () => {
  if (performance.now() - lastSent < 120) return
  lastSent = performance.now()
  send({ type: 'state', ...state() })
})

function enter() {
  if (!canEnter || entered) return
  document.querySelector('.button-start')?.click()
  entered = true
  world.setState({ isSoundsMuted: true })
  send({ type: 'state', ...state() })
}

window.addEventListener('message', event => {
  if (event.origin !== origin || event.source !== parent || event.data?.source !== 'ak-portfolio') return
  const { type, value } = event.data
  if (type === 'ping') send({ type: canEnter ? 'ready' : 'loading', ...state() })
  if (type === 'enter') enter()
  if (type === 'wheel' && entered && Number.isFinite(value)) {
    const s = scroll.getState(), handler = s.scrollHandler
    if (!handler || s.disableScroll || world.getState().transition) return
    // Works on touch too, without the original joystick requiring simultaneous gestures.
    world.setState({ mobileJoystickActive: false })
    handler.active = true
    handler.deltaY = Math.max(0, Math.min(s.scroll_path_length, handler.deltaY + Math.max(-1800, Math.min(1800, value))))
  }
  if (type === 'chapter' && entered && ['fr', 'frlux', 'luxbe', 'befr'].includes(value)) {
    document.querySelector(`[data-country-code="${value}"]`)?.click()
  }
  if (type === 'sound' && entered) {
    const muted = value !== true
    world.setState({ isSoundsMuted: muted })
    if (!muted) {
      const context = world.getState().soundTheme?.context
      context?.resume().catch(() => {})
      audio().playAll()
    } else audio().muteAll()
    send({ type: 'state', ...state() })
  }
})
window.addEventListener('error', event => send({ type: 'error', message: event.message }))
window.addEventListener('unhandledrejection', () => send({ type: 'error', message: 'World asset failed to load.' }))
document.addEventListener('webglcontextlost', () => send({ type: 'error', message: 'Graphics context lost.' }), true)
send({ type: 'loading' })
