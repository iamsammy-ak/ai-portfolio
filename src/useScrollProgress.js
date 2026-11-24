import { useEffect } from 'react'
import { live, useStore } from './store.js'

/* Turns the page's native scroll position into "how far along the road".
   Each element marked [data-stop] is one stop; the value is the index of
   the stop at the middle of the screen, with a fraction for the gap. */
export function useScrollProgress(journeyRef) {
  useEffect(() => {
    const journey = journeyRef.current
    if (!journey) return
    const stops = Array.from(journey.querySelectorAll('[data-stop]'))
    let centers = []
    let frame = 0

    const measure = () => {
      centers = stops.map((el) => {
        const box = el.getBoundingClientRect()
        return box.top + window.scrollY + box.height / 2
      })
      update()
    }

    const update = () => {
      frame = 0
      const middle = window.scrollY + window.innerHeight / 2
      const last = centers.length - 1
      let p = 0
      if (middle >= centers[last]) p = last
      else if (middle > centers[0]) {
        let i = 0
        while (i < last - 1 && middle >= centers[i + 1]) i++
        p = i + (middle - centers[i]) / (centers[i + 1] - centers[i])
      }
      live.target = p

      const active = Math.round(p)
      // Text is on screen only while the scooter is at a stop, not on the road between two.
      const shown = Math.abs(p - active) < 0.3 ? active : -1
      const inRide = journey.getBoundingClientRect().bottom > 0
      const state = useStore.getState()
      if (state.active !== active || state.inRide !== inRide || state.shown !== shown) useStore.setState({ active, inRide, shown })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const onPointer = (e) => {
      live.px = (e.clientX / window.innerWidth) * 2 - 1
      live.py = (e.clientY / window.innerHeight) * 2 - 1
    }

    measure()
    // A link to a specific stop (page.html#hackathons) opens on that stop.
    const linked = window.location.hash && document.getElementById(window.location.hash.slice(1))
    if (linked) {
      linked.scrollIntoView({ behavior: 'instant' })
      update()
    }
    // Start exactly where the page is, so a reload mid-page does not replay the whole road.
    live.p = live.target
    const resize = new ResizeObserver(measure)
    resize.observe(journey)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      resize.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      window.removeEventListener('pointermove', onPointer)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [journeyRef])
}
