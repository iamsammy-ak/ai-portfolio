import { useEffect, useRef, useState } from 'react'
import { person } from './content.js'
import Overview from './ui/Overview.jsx'
import { chapters } from './profile.js'

const initialPlain = () => new URLSearchParams(location.search).has('plain') || matchMedia('(prefers-reduced-motion: reduce)').matches || ['#projects', '#approach', '#efficiency', '#experience', '#contact'].includes(location.hash)

export default function App() {
  const [plain, setPlain] = useState(initialPlain)
  const [entered, setEntered] = useState(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [muted, setMuted] = useState(true)
  const [chapter, setChapter] = useState(0)
  const [progress, setProgress] = useState(0)
  const [quiet, setQuiet] = useState(false)
  const frame = useRef(null)
  const touchY = useRef(null)
  const root = useRef(null)
  const send = (type, value) => frame.current?.contentWindow?.postMessage({ source: 'ak-portfolio', type, value }, location.origin)

  useEffect(() => {
    document.body.classList.toggle('in-world', !plain)
    return () => document.body.classList.remove('in-world')
  }, [plain])
  useEffect(() => {
    if (plain) return
    const timeout = setTimeout(() => setFailed(true), 45000)
    const receive = (event) => {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || event.data?.source !== 'ak-world') return
      const message = event.data
      if (message.type === 'ready' || message.ready) { setReady(true); setFailed(false); clearTimeout(timeout) }
      if (message.type === 'error') { setFailed(true); clearTimeout(timeout) }
      if (message.country) {
        setChapter(message.country === 'fr' ? 0 : message.country === 'frlux' ? 1 : ['lux', 'luxbe'].includes(message.country) ? 2 : 3)
        setProgress(Math.max(0, Math.min(1, message.progress || 0)))
      }
      if (typeof message.muted === 'boolean') setMuted(message.muted)
    }
    window.addEventListener('message', receive)
    return () => { clearTimeout(timeout); window.removeEventListener('message', receive) }
  }, [plain])
  useEffect(() => {
    if (plain || !entered) return
    const wheel = (event) => {
      const copy = event.target.closest('.journey-copy')
      if (copy && copy.scrollHeight > copy.clientHeight) return
      event.preventDefault()
      send('wheel', event.deltaY * (event.deltaMode === 1 ? 28 : 2.5))
    }
    const key = (event) => {
      if (event.target.closest('button,a,input,select,textarea')) return
      if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp', ' '].includes(event.key)) {
        event.preventDefault(); send('wheel', ['ArrowUp', 'PageUp'].includes(event.key) ? -1200 : 1200)
      }
    }
    const element = root.current
    element?.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    return () => { element?.removeEventListener('wheel', wheel); window.removeEventListener('keydown', key) }
  }, [plain, entered])

  function readProfile(anchor = '') {
    send('sound', false); setPlain(true)
    if (anchor) history.replaceState(null, '', `#${anchor}`)
    requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView())
  }
  function openWorld() {
    history.replaceState(null, '', location.pathname)
    setReady(false); setEntered(false); setFailed(false); setPlain(false); setChapter(0); setQuiet(false)
    window.scrollTo(0, 0)
  }
  function start() { send('enter'); setEntered(true) }
  const current = chapters[chapter]
  if (plain) return <Overview onJourney={openWorld} />

  return <main className={`world-shell ${ready ? 'world-ready' : ''} ${entered ? 'world-entered' : ''}`} ref={root}
    onTouchStart={event => { touchY.current = event.touches[0].clientY }}
    onTouchMove={event => {
      if (!entered || touchY.current === null || event.target.closest('button,a,.journey-copy')) return
      const y = event.touches[0].clientY
      send('wheel', (touchY.current - y) * 15); touchY.current = y
    }}>
    <a className="skip-link" href="#projects" onClick={event => { event.preventDefault(); readProfile('projects') }}>Skip to projects</a>
    <div className="world-backdrop" />
    <iframe ref={frame} className="world-frame" src={`${import.meta.env.BASE_URL}world/index.html`} title="Animated journey through France, Luxembourg and Belgium" tabIndex={-1} aria-hidden="true" onLoad={() => send('ping')} allow="autoplay" />
    <div className={`world-shade ${quiet ? 'is-quiet' : ''}`} />
    <header className="site-header world-header">
      <button className="wordmark" onClick={() => { if (entered) { send('chapter', 'fr'); setQuiet(false) } }} aria-label="Abhishek Kumar, start of journey"><span className="monogram">ak.</span><span>Abhishek Kumar<small>AI coach candidate & engineer</small></span></button>
      <nav aria-label="Main navigation"><button className="text-button" onClick={() => readProfile()}>Read profile</button><a className="pill-link" href={person.links.cv} download>Download CV</a></nav>
    </header>
    {!entered ? <section className="welcome" aria-labelledby="welcome-title">
      <p className="location-line">Turin, Italy <span /> Open to AI coaching roles</p>
      <h1 id="welcome-title">Make AI<br />useful.</h1>
      <p className="welcome-lead">For the work.<br />For the people doing it.</p>
      <p className="welcome-about">I’m Abhishek. Computer engineer, AI builder, and a translator between technology and the people who use it.</p>
      <div className="welcome-actions"><button className="button primary" onClick={start} disabled={!ready || failed}>{failed ? '3D unavailable' : ready ? 'Explore my world' : 'Preparing the world…'}<span aria-hidden="true">{ready ? '↗' : '◌'}</span></button><button className="text-button" onClick={() => readProfile('projects')}>Go straight to the work</button></div>
      <p className="loading-note" role="status">{failed ? 'You can still explore every project in the readable profile.' : ready ? 'Scroll to travel. Sound is optional.' : 'Loading the real 3D scene. The readable profile is available now.'}</p>
    </section> : <>
      {!quiet && <section className="journey-copy" key={chapter} aria-labelledby="chapter-title"><p className="chapter-kicker">{current.kicker}</p><h1 id="chapter-title">{current.title}</h1><p className="chapter-body">{current.body}</p><div className="chapter-evidence"><strong>{current.evidence.title}</strong><p>{current.evidence.text}</p></div><button className="button light" onClick={() => readProfile(current.anchor)}>{current.action}</button></section>}
      <div className="world-controls"><button className="control-button" onClick={() => { const next = !muted; send('sound', !next); setMuted(next) }} aria-pressed={!muted}>{muted ? 'Sound off' : 'Sound on'}</button><button className="control-button" onClick={() => setQuiet(!quiet)} aria-pressed={quiet}>{quiet ? 'Show story' : 'Enjoy the view'}</button></div>
      <footer className="journey-footer"><div className="travel-hint"><span className="scroll-symbol" aria-hidden="true">↓</span><span>Scroll or swipe to travel<small>Or choose a stop below</small></span><div className="travel-buttons"><button onClick={() => send('wheel', -1600)} aria-label="Travel backward">−</button><button onClick={() => send('wheel', 1600)} aria-label="Travel forward">+</button></div></div><nav className="chapter-nav" aria-label="Journey stops">{chapters.map((item, index) => <button key={item.code} className={chapter === index ? 'active' : ''} aria-current={chapter === index ? 'step' : undefined} onClick={() => { send('chapter', item.code); setQuiet(false) }}><span>{item.label}</span><i style={{ transform: `scaleX(${chapter === index ? Math.max(.04, progress) : chapter > index ? 1 : 0})` }} /></button>)}</nav></footer>
    </>}
    {!entered && <div className="welcome-footer"><span>Engineering depth. Human perspective.</span><a href={person.links.github} target="_blank" rel="noreferrer">GitHub</a><a href={person.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
    {failed && entered && <div className="world-error" role="alert">The 3D world could not continue. <button onClick={() => readProfile()}>Open the readable profile</button></div>}
  </main>
}
