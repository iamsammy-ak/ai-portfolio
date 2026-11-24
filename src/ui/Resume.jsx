import {
  certificates,
  education,
  experience,
  hackathons,
  languages,
  person,
  projectGroups,
  toolkit,
} from '../content.js'

const count = projectGroups.reduce((n, g) => n + g.items.length, 0)

/* Everything below the ride: the plain, scannable version of the same
   story, for the reader who wants to check the details. */
export default function Resume() {
  return (
    <div className="paper">
      <section id="projects" className="sheet" aria-labelledby="projects-title">
        <header className="sheet-head">
          <h2 id="projects-title">Projects</h2>
          <p>
            {count} public repositories, grouped by what they show. Every name links to the code.
          </p>
        </header>
        {projectGroups.map((group) => (
          <div className="group" key={group.title}>
            <div className="group-head">
              <h3>{group.title}</h3>
              <p>{group.note}</p>
            </div>
            <ul className="repos">
              {group.items.map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.name}
                  </a>
                  <span className="repo-tech">{item.tech}</span>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section id="hackathons" className="sheet" aria-labelledby="hackathons-title">
        <header className="sheet-head">
          <h2 id="hackathons-title">Hackathons</h2>
          <p>Three AI builds under a clock, three podiums, all in 2026.</p>
        </header>
        <ul className="rows">
          {hackathons.map((h) => (
            <li key={h.name}>
              <p className="row-side">
                <strong>{h.place}</strong>
              </p>
              <div>
                <h3>{h.name}</h3>
                <p className="row-meta">{h.event}</p>
                <p>{h.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="experience" className="sheet" aria-labelledby="experience-title">
        <header className="sheet-head">
          <h2 id="experience-title">Experience</h2>
          <p>Engineering, data and leading people.</p>
        </header>
        <ul className="rows">
          {experience.map((e) => (
            <li key={e.org}>
              <p className="row-side">{e.period}</p>
              <div>
                <h3>{e.role}</h3>
                <p className="row-meta">{e.org}</p>
                <p>{e.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="toolkit" className="sheet" aria-labelledby="toolkit-title">
        <header className="sheet-head">
          <h2 id="toolkit-title">Toolkit</h2>
          <p>What I work with, and what I can teach.</p>
        </header>
        <div className="kit">
          {toolkit.map((set) => (
            <div key={set.title}>
              <h3>{set.title}</h3>
              <ul>
                {set.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="kit kit-facts">
          <div>
            <h3>Education</h3>
            <ul>
              {education.map((e) => (
                <li key={e.title}>
                  {e.title}, {e.org}, {e.period}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Certificates</h3>
            <ul>
              {certificates.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Languages</h3>
            <ul>
              {languages.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer id="contact" className="contact">
        <h2>Bring me in to coach your team.</h2>
        <p>
          I’m based in {person.location} and open to AI coaching and enablement roles, on site or remote. The fastest
          way to reach me is email.
        </p>
        <p className="contact-links">
          <a className="button" href={`mailto:${person.email}`}>
            {person.email}
          </a>
          <a className="button button-quiet" href={person.links.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="button button-quiet" href={person.links.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="button button-quiet" href={person.links.cv} download>
            Download CV
          </a>
        </p>
        <p className="colophon">
          Designed and built with an AI coding agent, three.js and React Three Fiber. Every shape in the ride is drawn in
          code.
        </p>
      </footer>
    </div>
  )
}
