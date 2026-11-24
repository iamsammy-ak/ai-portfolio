import { destination, hero, person, stops } from '../content.js'
import { useStore } from '../store.js'

const isExternal = (href) => /^https?:/.test(href)

function Links({ links }) {
  if (!links?.length) return null
  return (
    <p className="panel-links">
      {links.map((l) => (
        <a key={l.href} href={l.href} {...(isExternal(l.href) ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {l.text}
        </a>
      ))}
    </p>
  )
}

/* The scrolling text of the ride: one full-height section per stop. The 3D
   scene sits behind these and follows whichever one is on screen. */
export default function Ride() {
  const active = useStore((s) => s.active)
  const cls = (i) => `stop ${active === i ? 'is-active' : ''}`

  return (
    <>
      <section id={hero.id} data-stop className={`${cls(0)} stop-hero`}>
        <div className="panel panel-hero">
          <h1>{hero.title}</h1>
          <p className="lede">{hero.body}</p>
          <p className="hero-actions">
            <a className="button" href={`#${stops[0].id}`}>
              {hero.cta}
            </a>
            <span className="hint">{hero.hint}</span>
          </p>
        </div>
      </section>

      {stops.map((stop, i) => (
        <section key={stop.id} id={stop.id} data-stop className={cls(i + 1)} aria-labelledby={`${stop.id}-title`}>
          <div className="panel">
            <h2 id={`${stop.id}-title`}>{stop.title}</h2>
            <p className="where">{stop.where}</p>
            {stop.body && <p>{stop.body}</p>}
            {stop.steps && (
              <ol className="steps">
                {stop.steps.map((step) => (
                  <li key={step.name}>
                    <strong>{step.name}</strong> {step.text}
                  </li>
                ))}
              </ol>
            )}
            <p className="coach">
              <span>For your team</span>
              {stop.coach}
            </p>
            <Links links={stop.links} />
          </div>
        </section>
      ))}

      <section id={destination.id} data-stop className={`${cls(stops.length + 1)} stop-arrive`}>
        <div className="panel panel-hero">
          <h2 className="arrive-title">{destination.title}</h2>
          <p className="lede">{destination.body}</p>
          <p className="hero-actions">
            <a className="button" href={`mailto:${person.email}`}>
              Email me
            </a>
            <a className="button button-quiet" href={person.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="button button-quiet" href={person.links.cv} download>
              Download CV
            </a>
          </p>
        </div>
      </section>
    </>
  )
}
