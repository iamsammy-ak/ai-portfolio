import { Component, Suspense, lazy, useEffect, useRef, useState } from 'react'
import { caps, useStore } from './store.js'
import { useScrollProgress } from './useScrollProgress.js'
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

/* A short title card while the scene loads. It never blocks for long: it
   lifts when the first frame is drawn, or after a few seconds regardless. */
function Intro() {
  const ready = useStore((s) => s.ready)
  const lost = useStore((s) => s.lost)
  const [waited, setWaited] = useState(!caps.webgl)
  useEffect(() => {
    const timer = window.setTimeout(() => setWaited(true), 6000)
    return () => window.clearTimeout(timer)
  }, [])
  const done = ready || lost || waited
  return (
    <div className={`intro ${done ? 'is-done' : ''}`} aria-hidden="true">
      <p className="intro-name">{person.name}</p>
      <p className="intro-role">{person.role}</p>
      <span className="intro-bar" />
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
