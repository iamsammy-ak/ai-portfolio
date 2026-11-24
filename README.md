# Abhishek Kumar ? AI coach portfolio

Live: https://iamsammy-ak.github.io/ai-portfolio/

An interactive journey through France, Luxembourg and Belgium, paired with a complete readable profile for hiring teams. The portfolio connects AI engineering projects to coaching, responsible adoption and measurable efficiency.

## Run

```sh
npm ci
npm run dev
npm run build
npm test
```

The build prepares a local copy of the original 3D world before Vite compiles the profile. No external assets or analytics are needed at runtime. Tests use installed Chrome and serve the production build under `/ai-portfolio/` to catch GitHub Pages path errors. Build before running tests.

## Edit

- `src/content.js`: personal details, experience, education, hackathons and toolkit.
- `src/profile.js`: journey chapters and featured GitHub case studies.
- `src/github-projects.json`: public, non-fork repository snapshot verified on 24 November 2026.
- `src/ui/Overview.jsx`: readable profile, search/filter directory and illustrative efficiency calculator.
- `src/world/bridge.js`: same-origin integration with the original scene, travel controls and optional audio.
- `scripts/prepare-world.mjs`: checked patches, personalized 3D gallery artwork and local asset paths.
- `reference-assets/sebastien-lempens/`: original captured scene files and provenance; preserved as build inputs.
- `public/Abhishek_Kumar_CV.pdf`: downloadable CV.

`public/world/` and `dist/` are generated and ignored. The source snapshot is committed so builds are reproducible without downloading the original website again.

## Reading and accessibility

Use `?plain` or a section link such as `#projects` to open the readable profile directly. Reduced-motion preferences default to the readable profile. The 3D experience supports wheel, touch, keyboard arrows, travel buttons and chapter navigation. Sound starts muted. A loading or graphics failure leaves the readable profile accessible. The profile can be printed from its contact section.

## Evidence

Professional history is retained from the existing portfolio. GitHub project descriptions and featured benchmark documentation were checked against public repositories. The RAG figure is from 69 synthetic test questions with offline generation. Gateway cost savings use synthetic traffic and illustrative pricing; quality tradeoffs are shown alongside the result. Calculator outputs are explicitly illustrative, not claimed client outcomes.

## World attribution

Original 3D world, art and scene implementation: S?bastien Lempens, https://sebastien-lempens.com/.

The owner authorized this adaptation in the working session. That authorization is not a new blanket license for third-party assets. The original asset licensing status and sources are recorded in the snapshot README. The deployed application removes the original analytics and award claims and uses Abhishek?s project information. Original asset provenance is preserved, and visible credits are included in the profile footer.

## Deployment

Pushing `main` runs `.github/workflows/deploy.yml` and publishes `dist/` to GitHub Pages. All runtime asset paths support the `/ai-portfolio/` subdirectory.
