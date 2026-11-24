import { cp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { featuredProjects } from '../src/profile.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'reference-assets/sebastien-lempens')
const avatar = path.join(root, 'custom-assets/avatar/model.glb')
const avatarImages = ['motorbike.png', 'thumbnail-contact.png', 'thumbnail-x.png', 'thumbnail-credit.png']
// Give every adapted runtime a new URL, including its imported modules and CSS.
// Fixed upstream filenames otherwise let a browser combine two deployments.
const fingerprint = createHash('sha256')
for (const file of ['scripts/prepare-world.mjs', 'src/profile.js', 'src/world/bridge.js', 'src/world/bootstrap.js', 'src/world/world.css']) fingerprint.update(await readFile(path.join(root, file)))
fingerprint.update(await readFile(avatar))
for (const name of avatarImages) fingerprint.update(await readFile(path.join(root, 'custom-assets/avatar/image', name)))
const revision = fingerprint.digest('hex').slice(0, 12)
const generatedRoot = path.resolve(root, 'public/world')
if (path.relative(root, generatedRoot).replaceAll('\\', '/') !== 'public/world') throw new Error('Unsafe generated directory')
await rm(generatedRoot, { recursive: true, force: true })
const output = path.join(generatedRoot, revision)
await writeFile(path.join(root, 'src/world-path.json'), JSON.stringify(`world/${revision}/index.html`))
await mkdir(output, { recursive: true })
await writeFile(path.join(generatedRoot, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${revision}/index.html"><title>Abhishek Kumar portfolio</title></head><body><a href="${revision}/index.html">Open the portfolio</a></body></html>`)
for (const folder of ['assets', 'gltf', 'texture', 'hdri', 'sounds', 'fonts', 'image', 'vendors', '_external']) {
  await cp(path.join(source, folder), path.join(output, folder), { recursive: true })
}
// The approved avatar keeps the original scene nodes, skeletons and animation clips.
// Override only the generated bundle so the captured source remains reproducible.
await cp(avatar, path.join(output, 'gltf/model.glb'))
for (const name of avatarImages) await cp(path.join(root, 'custom-assets/avatar/image', name), path.join(output, 'image', name))

// Keep the captured scene intact. Apply small, checked integration patches to the generated copy.
async function patch(name, replacements) {
  const target = path.join(output, 'assets', name)
  let text = await readFile(target, 'utf8')
  for (const [before, after] of replacements) {
    if (!text.includes(before)) throw new Error(`World integration anchor missing: ${name}: ${before}`)
    text = text.replaceAll(before, after)
  }
  // Root-relative asset requests otherwise escape /ai-portfolio/world/ on GitHub Pages.
  text = text.replace(/(["'`])\/(sounds|hdri|texture|image|fonts)\//g, '$1$2/')
  await writeFile(target, text)
}

await patch('index-DjXkBzPf.js', [['pw=function(s){return"/"+s}', 'pw=function(s){return new URL(s,document.baseURI).href}']])
await patch('Scene-CdCGEhkU.js', [
  ['https://www.gstatic.com/draco/versioned/decoders/1.5.5/', '_external/www.gstatic.com/draco/versioned/decoders/1.5.5/'],
  ['or=s=>vo(()=>Ma(s),["useDetectGPU"])', 'or=()=>({isMobile:innerWidth<760,tier:innerWidth<760?2:3})'],
  ['transition:"onExit",isSoundsMuted:!1', 'transition:"onExit",isSoundsMuted:!0'],
  ['a.playAll(),document.querySelector(".cursor-scroll")', 'document.querySelector(".cursor-scroll")'],
  ['else a.completion=a.completion,e=0', 'else he.setState({scroll:a.completion}),e=0'],
  ['const o=n/45;o<=1&&I.setState({scene_load_progress:o})', 'const o=Math.min(.99,n/Math.max(r,1));I.setState({scene_load_progress:Math.max(I.getState().scene_load_progress||0,o)});window.akLoadingProgress?.(n,r)'],
  ['g.innerText=B', 'g.innerText=String(Math.max(parseInt(g.innerText)||0,T)).padStart(3,"0")'],
  ['I.setState({scene_loaded:!0})', 'I.setState({scene_loaded:!0,scene_load_progress:1});window.akLoadingProgress?.(1,1)'],
  ['function p(){console.log("%c Scene Loaded"', 'let startBound=false;setTimeout(p,2400);function p(){if(startBound)return;startBound=true;console.log("%c Scene Loaded"'],
])
await patch('Skills-DFKl31g5.js', [
  ['html:"Project Management"', 'html:"Project Management"'], ['html:"Web Design"', 'html:"Python & SQL"'],
  ['html:"UX/UI Process"', 'html:"Data Analysis"'], ['html:"Front-End Development"', 'html:"Web Development"'],
  ['html:"Back-End Development"', 'html:"AI & Machine Learning"'],
])

await patch('HtmlTitle-BnxYPVZT.js', [
  ['["Sébastien","Lempens"]', '["Abhishek","Kumar"]'],
  ['["creative","web","engineer"]', '["computer","engineer"]'],
])
await patch('CountryFrance-CABRcqX6.js', [
  ['I\'m Sébastien Lempens, a french "Gen X" Web Engineer. Throughout my career, I have worked on multiple sized projects in various roles, including Project Manager, Designer and Front/Back-end Developer.', "I'm Abhishek Kumar, a computer engineer in Turin, Italy. I graduated in Computer Engineering from Politecnico di Torino in 2025 and am pursuing a Master's in Engineering Management, focusing on Business Solutions and Finance."],
  ["I'm entirely self-taught, I haven't attended a specialized school or completed a bootcamp. I learned on the job and with over 20 years experience I'm proud to say I'm still as passionate as ever.", 'At OpenSky VR Italia, I built a property visualisation platform with interactive 3D walkthroughs and VR previews. At Fibzio, I worked with SQL, Power BI, budget forecasting and performance analysis. I previously led a marketing team at AIESEC.'],
  ['Through this website, I wanted to leverage what I have learned in recent years, particularly in terms of 3D. You will also find a overview of my most important projects.', 'Outside work, I lead the Politecnico Indian Students Association, supporting a community of more than 1,000 students. My hackathon projects earned first place at Therness and LOKI Urban Monitoring, and second place at the Automation Hackathon in 2026.'],
  ["U.jsx(\"p\",{children:\"Let's keep scrolling to discover the rest :)\"})", 'U.jsxs("p",{children:["Keep scrolling to explore my skills and GitHub projects. ",U.jsx("a",{href:"../Abhishek_Kumar_CV.pdf",target:"_blank",children:"Download my CV"})," / ",U.jsx("a",{href:"https://github.com/iamsammy-ak",target:"_blank",children:"GitHub"})]})'],
])
await patch('Buttons-Bu6-RSra.js', [
  ['mailto:contact@sebastien-lempens.com', 'mailto:kumarabhishekk363@gmail.com'],
  ['https://twitter.com/s_lempens', 'https://github.com/iamsammy-ak'],
  ['Join me on X', 'My GitHub'],
  ['Sébastien Lempens Contact', 'Contact Abhishek Kumar'],
  ['Sébastien Lempens X Twitter', 'Abhishek Kumar on GitHub'],
  ['Sébastien Lempens Credit & Thanks', 'World credits'],
  ['Credits & Thanks', 'World credits'],
])

// Preserve the original resources and licenses, without claiming its personal thanks.
const creditsPath = path.join(output, 'assets/Credits-Fnp023Ib.js')
let credits = await readFile(creditsPath, 'utf8')
credits = credits.replace('Tools and resources that helped me complete this project', 'Tools and resources used in the original world')
const thanksStart = credits.indexOf('e.jsx("article",{children:e.jsxs("div",{children:[e.jsx("h3",{children:"Thanks"})')
const thanksEnd = credits.indexOf('e.jsx("img",{src:', thanksStart)
if (thanksStart < 0 || thanksEnd < 0) throw new Error('Credits anchor missing')
credits = credits.slice(0, thanksStart) + 'e.jsx("article",{children:e.jsxs("div",{children:[e.jsx("h3",{children:"World credits"}),e.jsxs("p",{children:["Original world, artwork and implementation by ",e.jsx("a",{href:"https://sebastien-lempens.com/",target:"_blank",children:"Sébastien Lempens"}),". Personal content adapted for Abhishek Kumar."]}),e.jsx("a",{href:"../Abhishek_Kumar_CV.pdf",target:"_blank",children:"Download my CV"})]})}),' + credits.slice(thanksEnd)
await writeFile(creditsPath, credits)

// The original gallery uses dynamically constructed image names. Replace the gallery
// data itself with Abhishek's projects and generate local, self-contained title artwork.
const portfolioPath = path.join(output, 'assets/Portfolio-CRbW23xQ.js')
let portfolio = await readFile(portfolioPath, 'utf8')
const projectsAnchor = /projects:\[\{id:"dupont-airguard"[\s\S]*?\}\]\}\),Vt=/
if (!projectsAnchor.test(portfolio)) throw new Error('Original portfolio data anchor missing')
const projectData = featuredProjects.map(p => ({ id: p.slug, title: p.name, desc: p.description, role: 'Development', tech: p.tags.join(' / '), url: p.href, logoScale: 1 }))
portfolio = portfolio.replace(projectsAnchor, `projects:${JSON.stringify(projectData)}}),Vt=`).replace('image/${e.reference}.webp', 'image/${e.reference}.svg')
await writeFile(portfolioPath, portfolio)
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
for (const [index, project] of featuredProjects.entries()) {
  const colors = ['#5c4c7b', '#4c6c59', '#856754', '#436776', '#79556c', '#4d5c82']
  // Text-free artwork tolerates the original gallery's moving texture crop.
  // Project names live in the foreground logo and the original hover detail panel.
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><defs><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="white" stroke-opacity=".07"/></pattern></defs><rect width="1200" height="800" fill="${colors[index]}"/><rect width="1200" height="800" fill="url(#grid)"/><g fill="none" stroke="#e4d1eb" stroke-width="3" opacity=".22"><path d="M0 400H270L430 220H770L930 400H1200M0 600H270L430 420H770L930 600H1200"/><circle cx="600" cy="320" r="180"/><circle cx="600" cy="320" r="100"/></g><g fill="#ffffff" opacity=".15"><rect x="230" y="365" width="80" height="70" rx="12"/><rect x="890" y="365" width="80" height="70" rx="12"/><circle cx="600" cy="320" r="26"/></g></svg>`
  await writeFile(path.join(output, 'image', `${project.slug}.svg`), svg)
}
const initials = ['NB', 'MCP', 'SC', 'RAG', 'RF', 'AT']
await writeFile(path.join(output, 'image/logos.svg'), `<svg xmlns="http://www.w3.org/2000/svg">${featuredProjects.map((p, index) => {
  const words = p.name.split(' '), split = Math.ceil(words.length / 2)
  return `<symbol id="${p.slug}" viewBox="0 0 100 100"><text x="50" y="47" text-anchor="middle" fill="white" font-family="sans-serif" font-size="32">${initials[index]}</text><text x="50" y="66" text-anchor="middle" fill="white" font-family="sans-serif" font-size="8">${escape(words.slice(0, split).join(' '))}</text><text x="50" y="78" text-anchor="middle" fill="white" font-family="sans-serif" font-size="8">${escape(words.slice(split).join(' '))}</text></symbol>`
}).join('')}</svg>`)

// Reuse only the loading layout, not the original analytics, challenge scripts, identity or awards.
const original = await readFile(path.join(source, 'index.html'), 'utf8')
const loadingStyle = original.match(/<style>([\s\S]*?)<\/style>/)[1].replaceAll('url("/', 'url("')
await writeFile(path.join(output, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Abhishek Kumar — interactive world</title><link rel="stylesheet" href="assets/index-CaPdr700.css">
<style>${loadingStyle}</style><link rel="stylesheet" href="world.css"></head><body>
<div id="preloader" class="preloader--france" data-progress="0"><div class="motorbike active"><img src="image/motorbike.png" width="312" height="260" alt="Abhishek riding a scooter" /><code>000</code></div><div class="city"></div><div class="preloader-enter"><a class="button-start" href="javascript:void(0)"> start </a><p>For the best experience</p><p>Turn your sound on / Switch to desktop</p></div></div>
<div class="load-status" role="status">Loading the 3D engine…</div><div id="awards"></div><div id="root"></div>
<script src="vendors/momentum.min.js"></script><script type="module" src="bootstrap.js"></script></body></html>`)
for (const file of ['bridge.js', 'bootstrap.js', 'world.css']) await cp(path.join(root, 'src/world', file), path.join(output, file))
// CSS font and image URLs need the same subdirectory fix.
const cssPath = path.join(output, 'assets/index-CaPdr700.css')
let css = await readFile(cssPath, 'utf8')
css = css.replace(/url\((["']?)\//g, 'url($1../')
await writeFile(cssPath, css)
for (const name of await readdir(path.join(output, 'assets'))) {
  if (!name.endsWith('.js')) continue
  const file = path.join(output, 'assets', name)
  const code = await readFile(file, 'utf8')
  await writeFile(file, code.replace(/(["'`])\/(sounds|hdri|texture|image|fonts)\//g, '$1$2/').replaceAll('../Abhishek_Kumar_CV.pdf', '../../Abhishek_Kumar_CV.pdf'))
}
console.log('Prepared the original world with local assets and the portfolio bridge.')
