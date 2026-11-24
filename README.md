# Abhishek Kumar: AI coach portfolio

**Live site: https://iamsammy-ak.github.io/ai-coach-portfolio/**

A portfolio you ride through. Scroll, and a scooter travels a dusk road past
twelve stops. Each stop is one piece of evidence for a single claim: I learned AI
by shipping it, and I can coach a team to do the same.

Below the ride is the plain version of the same story: every public project,
hackathons, experience and toolkit.

## The stops

| Stop | What it shows |
| --- | --- |
| Engineer first | Computer engineering and data analysis, including client training |
| Three years of building with AI | Daily work with assistants, agents, local and hosted models |
| Fast under pressure | Three hackathon podiums in 2026 |
| AI under the hood | Eleven open-source systems that make up an agent stack |
| Safe to use at work | Privacy, verification and a human in the loop |
| A use case for every department | Ten working assistants for business teams |
| Where your people already work | Microsoft 365 Copilot, Copilot Studio, Power Platform |
| Products people use | Apps built for real users |
| Leading people | Running a 1,000+ member student association |
| How I'd coach your team | The four-step method I would bring |

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
- **three.js through React Three Fiber** for the scene. Every shape in it, from the
  scooter to the landmarks, is drawn in code from boxes, cylinders and cones.
  There are no 3D model files and no image textures.
- **A small state store (zustand)** connects the scroll position to the scene
  without re-rendering the page on every frame.
- **Post-processing** adds bloom and a vignette on capable machines.

| Where | What |
| --- | --- |
| `src/content.js` | Every word on the site |
| `src/scene/layout.js` | The shape of the road |
| `src/scene/Scooter.jsx` | The scooter and rider |
| `src/scene/Landmarks.jsx` | One landmark per stop |
| `src/scene/World.jsx` | Sky, mountains, trees, lights |
| `src/scene/Rig.jsx` | The camera, and the frame-rate monitor |
| `src/ui/` | Header, route map, stop text, résumé section |

## Built to open everywhere

The text is ordinary HTML and is readable before the 3D scene has loaded. The
scene is a separate download that fades in behind it, so nothing waits on a
loading screen.

- Quality is chosen per device with no network request, and steps down on its
  own if the frame rate drops.
- If WebGL is missing, or the graphics driver drops the context, the page falls
  back to a still backdrop and keeps working.
- Reduced-motion settings are respected, and every stop can be reached by
  keyboard through the route map.
- Add `?plain` to the address to turn the scene off, or `?quality=low`,
  `?quality=medium` or `?quality=high` to choose a quality level by hand.
