import { live } from './store.js'

/* Ambient sound, generated in the browser: a soft evening pad and a wind
   that rises with speed. There are no audio files. Browsers only allow
   sound after a click, which is why it starts from the Start button. */

let ctx = null
let master = null
let wind = null
let timer = 0

export function startSound() {
  if (ctx) return
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return
  try {
    ctx = new AudioContext()
  } catch {
    return
  }
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)

  // Pad: three quiet sine tones a fifth and an octave apart, slowly swelling.
  const pad = ctx.createGain()
  pad.gain.value = 0.05
  pad.connect(master)
  ;[110, 164.8, 220.6].forEach((frequency, i) => {
    const tone = ctx.createOscillator()
    tone.type = 'sine'
    tone.frequency.value = frequency
    const level = ctx.createGain()
    level.gain.value = 0.5
    const swell = ctx.createOscillator()
    swell.frequency.value = 0.05 + i * 0.03
    const depth = ctx.createGain()
    depth.gain.value = 0.4
    swell.connect(depth).connect(level.gain)
    tone.connect(level).connect(pad)
    tone.start()
    swell.start()
  })

  // Wind: filtered noise whose volume and brightness follow the speed of travel.
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const noise = ctx.createBufferSource()
  noise.buffer = buffer
  noise.loop = true
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 420
  filter.Q.value = 0.6
  wind = ctx.createGain()
  wind.gain.value = 0.012
  noise.connect(filter).connect(wind).connect(master)
  noise.start()

  timer = window.setInterval(() => {
    const pace = Math.min(1, live.speed / 22)
    wind.gain.setTargetAtTime(0.012 + pace * 0.09, ctx.currentTime, 0.25)
    filter.frequency.setTargetAtTime(380 + pace * 900, ctx.currentTime, 0.3)
  }, 120)

  setMuted(false)
}

export function setMuted(muted) {
  if (!ctx) return
  if (!muted && ctx.state === 'suspended') ctx.resume()
  master.gain.setTargetAtTime(muted ? 0 : 0.85, ctx.currentTime, 0.4)
}

export function stopSound() {
  window.clearInterval(timer)
  ctx?.close()
  ctx = null
}
