import { Component, Suspense, lazy, useRef } from 'react'
import { caps, useStore } from './store.js'
import { useScrollProgress } from './useScrollProgress.js'
import Header from './ui/Header.jsx'
import RouteMap from './ui/RouteMap.jsx'
import Ride from './ui/Ride.jsx'
import Resume from './ui/Resume.jsx'

// The 3D scene is its own chunk. The words on the page never wait for it.
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

export default function App() {
  const journey = useRef(null)
  useScrollProgress(journey)
  const lost = useStore((s) => s.lost)

  return (
    <>
      <a className="skip" href="#projects">
        Skip the ride and go to projects
      </a>
      <div className="backdrop" aria-hidden="true" />
      {caps.webgl && !lost && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="scrim" aria-hidden="true" />
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
