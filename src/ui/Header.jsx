import { person } from '../content.js'
import { useStore } from '../store.js'
import { setMuted } from '../audio.js'

export default function Header() {
  const inRide = useStore((s) => s.inRide)
  const muted = useStore((s) => s.muted)
  const toggleSound = () => {
    const next = !muted
    useStore.setState({ muted: next })
    setMuted(next)
  }
  return (
    <header className={`top ${inRide ? '' : 'on-paper'}`}>
      <a className="top-name" href="#start">
        {person.name}
        <span>{person.role}</span>
      </a>
      <nav className="top-links" aria-label="Sections">
        <a href="#projects">Projects</a>
        <a href="#experience">Experience</a>
        <a href={person.links.cv} download>
          CV
        </a>
        <button type="button" className={`sound ${muted ? 'is-muted' : ''}`} onClick={toggleSound} aria-pressed={!muted}>
          <span className="sound-bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {muted ? 'Sound off' : 'Sound on'}
        </button>
        <a className="top-cta" href="#contact">
          Contact
        </a>
      </nav>
    </header>
  )
}
