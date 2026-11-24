import { route } from '../content.js'
import { useStore } from '../store.js'

/* The stops on the road as a line map. It doubles as navigation and as a
   progress indicator: passed stops are filled, the current one is lit. */
export default function RouteMap() {
  const active = useStore((s) => s.active)
  const inRide = useStore((s) => s.inRide)
  const last = route.length - 1

  return (
    <nav className={`map ${inRide ? '' : 'is-hidden'}`} aria-label="Stops on the ride">
      <ol style={{ '--done': active / last }}>
        {route.map((stop, i) => (
          <li key={stop.id} className={i === active ? 'is-here' : i < active ? 'is-passed' : ''}>
            <a href={`#${stop.id}`} aria-current={i === active ? 'step' : undefined}>
              <span className="map-label">{stop.label}</span>
              <span className="map-dot" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
