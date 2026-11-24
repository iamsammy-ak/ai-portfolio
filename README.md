# Abhishek Kumar ? interactive portfolio

Live: https://iamsammy-ak.github.io/ai-portfolio/

The original loading screen, start interaction, 3D journey, typography, navigation and project gallery from the reference world, personalized with Abhishek's CV and GitHub projects. No separate profile page.

## Run

`npm ci`, `npm run dev`, `npm run build`, `npm test`.

`predev` and `prebuild` create the local world from the checked-in snapshot. Tests serve the production build under `/ai-portfolio/`.

## Edit

- `scripts/prepare-world.mjs`: original loader, personal biography, skills, contact and gallery adaptation.
- `src/profile.js`: featured GitHub project metadata.
- `src/world/bridge.js`: loading/error reporting and keyboard navigation.
- `src/world/world.css`: minimal accessibility overrides.
- `public/Abhishek_Kumar_CV.pdf`: source CV and download.
- `reference-assets/sebastien-lempens/`: captured reference assets and provenance.

The original world and art are by S?bastien Lempens, https://sebastien-lempens.com/. Resource credits and licensing information remain in the in-world credits and snapshot documentation. Original analytics and award claims are excluded. Generated `public/world/` and `dist/` are ignored.

Pushes to `main` deploy through GitHub Pages. The AI coaching page is maintained separately in `iamsammy-ak/coach-portfolio`.
