import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import { caps, useStore } from './store.js'
import { useScrollProgress } from './useScrollProgress.js'
import { startSound } from './audio.js'
import { person } from './content.js'
import Header from './ui/Header.jsx'
import RouteMap from './ui/RouteMap.jsx'
import Ride from './ui/Ride.jsx'
import Resume from './ui/Resume.jsx'

// The 3D scene is its own chunk, loaded behind the intro screen.
const Scene = lazy(() => import('./scene/Scene.jsx'))

/* If WebGL fails for any reason, the page carries on without the scene. */
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/* The opening screen: a counter while the scene loads, then a Start button.
   The click is what allows sound to play. The counter never stalls: if the
   scene has not appeared after a few seconds, Start is offered anyway. */
function Intro() {
  const ready = useStore((s) => s.ready)
  const lost = useStore((s) => s.lost)
  const entered = useStore((s) => s.entered)
  const [count, setCount] = useState(0)
  const [waited, setWaited] = useState(!caps.webgl)
  const loaded = ready || lost || waited

  useEffect(() => {
    const timer = window.setTimeout(() => setWaited(true), 7000)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const tick = window.setInterval(() => {
      setCount((n) => {
        const ceiling = loaded ? 100 : 88
        if (n >= ceiling) return n
        return Math.min(ceiling, n + (loaded ? 4 : Math.max(1, Math.round((ceiling - n) / 14))))
      })
    }, 45)
    return () => window.clearInterval(tick)
  }, [loaded])

  const canStart = loaded && count >= 100
  const enter = () => {
    startSound()
    useStore.setState({ entered: true })
  }

  return (
    <div className={`intro ${entered ? 'is-done' : ''}`} inert={entered}>
      <p className="intro-count" aria-hidden="true">
        {String(count).padStart(3, '0')}
      </p>
      <p className="intro-name">{person.name}</p>
      <p className="intro-role">{person.role}</p>
      <span className={`intro-bar ${canStart ? 'is-full' : ''}`} style={{ '--load': count / 100 }} aria-hidden="true" />
      <button type="button" className={`intro-start ${canStart ? 'is-ready' : ''}`} onClick={enter} disabled={!canStart}>
        Start
      </button>
      <p className={`intro-hint ${canStart ? 'is-ready' : ''}`}>Best with sound on, on a large screen</p>
    </div>
  )
}

export default function App() {
  const journey = useRef(null)
  useScrollProgress(journey)
  const lost = useStore((s) => s.lost)
  const attempt = useStore((s) => s.attempt)

  return (
    <>
      <a className="skip" href="#projects">
        Skip to projects
      </a>
      <div className="backdrop" aria-hidden="true" />
      {caps.webgl && !lost && (
        <SceneBoundary key={attempt}>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="scrim" aria-hidden="true" />
      <Intro />
      <Header />
      <RouteMap />
      <main>
        <div className="journey" ref={journey}>
          <Ride />
        </div>
        <Resume />
      </main>
    </>
  )
}
