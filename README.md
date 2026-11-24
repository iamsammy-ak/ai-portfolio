# Abhishek Kumar: portfolio

**Live site: https://iamsammy-ak.github.io/ai-portfolio/**

A portfolio you ride through. Scrolling moves a scooter along a street at golden
hour, past twelve stops. The page itself does not scroll during the ride: the
world moves, and a card of text fades in when the scooter reaches each stop.

Below the ride is a plain résumé section: every public project, hackathons,
experience and toolkit.

## The stops

| Stop | What it covers |
| --- | --- |
| Engineering and data | Computer engineering and data analysis |
| Three years of building with AI | Everyday work with assistants, agents, local and hosted models |
| Three podiums in 2026 | Hackathon results |
| How AI systems work | Eleven open-source systems that make up an agent stack |
| Responsible use | Privacy, verification and human oversight |
| AI across business functions | Ten working assistants |
| The Microsoft stack | Microsoft 365 Copilot, Copilot Studio, Power Platform |
| Products in use | Apps built for everyday users |
| Leading people | Running a student association of more than 1,000 members |
| How I work | The four steps applied on every project |

## Change the content

All of the words, links and projects are in one file: [`src/content.js`](src/content.js).
Edit it and the ride, the route map and the résumé section all update. To replace
the CV, overwrite `public/Abhishek_Kumar_CV.pdf`.

## Run it locally

```bash
npm install
npm run dev      # development server
npm run build    # production build into dist/
```

Pushing to `main` rebuilds and publishes the site through the workflow in
`.github/workflows/deploy.yml`.

## How it is built

- **Vite and React** for the page.
- **three.js through React Three Fiber** for the scene. Everything in it is
  modelled in code: the scooter and rider, the city blocks, the landmarks and
  the sky. There are no 3D model files and no image textures.
- **Real-time shadows** from a low sun, a procedural sunset sky with clouds,
  and bloom, vignette and filmic tone mapping as post-processing.
- **A small state store (zustand)** connects the scroll position to the scene
  without re-rendering the page on every frame.

| Where | What |
| --- | --- |
| `src/content.js` | Every word on the site |
| `src/scene/layout.js` | The shape of the road |
| `src/scene/Scooter.jsx` | The scooter and rider |
| `src/scene/Landmarks.jsx` | One landmark per stop |
| `src/scene/World.jsx` | Sky, sun, city blocks, street lamps, trees |
| `src/scene/Rig.jsx` | The camera, and the frame-rate monitor |
| `src/ui/` | Header, route map, cards, résumé section |

## Built to open everywhere

- Quality is chosen per device with no network request, and steps down on its
  own if the frame rate drops.
- Some graphics drivers drop the WebGL context under load. If that happens the
  scene is rebuilt once at the lightest quality, and if it happens again the
  page falls back to a still backdrop and keeps working.
- The intro screen never blocks for more than a few seconds.
- Reduced-motion settings are respected.
- Add `?plain` to the address to turn the scene off, or `?quality=low`,
  `?quality=medium` or `?quality=high` to choose a quality level by hand.
