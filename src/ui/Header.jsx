import { person } from '../content.js'
import { useStore } from '../store.js'

export default function Header() {
  const inRide = useStore((s) => s.inRide)
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
        <a className="top-cta" href="#contact">
          Contact
        </a>
      </nav>
    </header>
  )
}
