import { destination, hero, person, route, stops } from '../content.js'
import { useStore } from '../store.js'

const isExternal = (href) => /^https?:/.test(href)

function Links({ links }) {
  if (!links?.length) return null
  return (
    <p className="card-links">
      {links.map((l) => (
        <a key={l.href} href={l.href} {...(isExternal(l.href) ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {l.text}
        </a>
      ))}
    </p>
  )
}

/* The ride has two layers.

   The track is a column of empty, screen-high sections. It only provides
   scroll distance and link targets: scrolling moves the scooter, not the page.

   The cards are fixed in place on top of the scene. Each one fades in when
   the scooter reaches its stop and fades out when it leaves. */
export default function Ride() {
  const shown = useStore((s) => s.shown)
  const state = (i) => ({ className: `card ${shown === i ? 'is-shown' : ''}`, inert: shown !== i })
  const lastIndex = stops.length + 1

  return (
    <>
      <div className="track" aria-hidden="true">
        {route.map((stop) => (
          <div key={stop.id} id={stop.id} data-stop className="track-stop" />
        ))}
      </div>

      <div className="cards">
        <section {...state(0)} className={`${state(0).className} card-title`}>
          <h1>{hero.title}</h1>
          <p className="lede">{hero.body}</p>
          <p className="actions">
            <a className="button" href={`#${stops[0].id}`}>
              {hero.cta}
            </a>
            <a className="button button-quiet" href={person.links.cv} download>
              Download CV
            </a>
          </p>
        </section>

        {stops.map((stop, i) => (
          <section key={stop.id} {...state(i + 1)} aria-labelledby={`${stop.id}-title`}>
            <p className="card-count">
              {String(i + 1).padStart(2, '0')} / {String(stops.length).padStart(2, '0')}
            </p>
            <h2 id={`${stop.id}-title`}>{stop.title}</h2>
            <p className="where">{stop.where}</p>
            {stop.body && <p className="card-body">{stop.body}</p>}
            {stop.steps && (
              <ol className="steps">
                {stop.steps.map((step) => (
                  <li key={step.name}>
                    <strong>{step.name}</strong> {step.text}
                  </li>
                ))}
              </ol>
            )}
            {stop.note && (
              <p className="note">
                <span>{stop.noteLabel}</span>
                {stop.note}
              </p>
            )}
            <Links links={stop.links} />
          </section>
        ))}

        <section {...state(lastIndex)} className={`${state(lastIndex).className} card-title`}>
          <h2 className="arrive-title">{destination.title}</h2>
          <p className="lede">{destination.body}</p>
          <p className="actions">
            <a className="button" href={`mailto:${person.email}`}>
              Email
            </a>
            <a className="button button-quiet" href={person.links.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="button button-quiet" href={person.links.cv} download>
              Download CV
            </a>
          </p>
        </section>
      </div>

      <p className={`cue ${shown === 0 ? 'is-shown' : ''}`} aria-hidden="true">
        <span className="cue-mouse" />
        Scroll
      </p>
    </>
  )
}
