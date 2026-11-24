import { useEffect, useRef, useState } from 'react'
import { person } from './content.js'
import worldPath from './world-path.json'

export default function App() {
  const frame = useRef(null)
  const [failed, setFailed] = useState(false)
  const [version, setVersion] = useState(0)
  useEffect(() => {
    const timeout = setTimeout(() => setFailed(true), 90000)
    const receive = event => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.source !== 'ak-world') return
      if (event.data.ready) { clearTimeout(timeout); setFailed(false) }
      if (event.data.type === 'error') { clearTimeout(timeout); setFailed(true) }
    }
    window.addEventListener('message', receive)
    return () => { clearTimeout(timeout); window.removeEventListener('message', receive) }
  }, [version])
  return <main className="portfolio">
    <iframe key={version} ref={frame} className="world" src={`${import.meta.env.BASE_URL}${worldPath}${version ? `?retry=${version}` : ''}`} title="Abhishek Kumar interactive portfolio" allow="autoplay" onLoad={() => frame.current?.contentWindow?.postMessage({ source: 'ak-portfolio', type: 'ping' }, location.origin)} />
    {failed && <aside className="load-error" role="alert"><p>The world could not load.</p><a href={person.links.cv} download>Download CV</a><a href={person.links.github}>GitHub projects</a><button onClick={() => { setFailed(false); setVersion(value => value + 1) }}>Try again</button></aside>}
  </main>
}
