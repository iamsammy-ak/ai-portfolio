import { cp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { featuredProjects } from '../src/profile.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const source = path.join(root, 'reference-assets/sebastien-lempens')
const output = path.join(root, 'public/world')
await mkdir(output, { recursive: true })
for (const folder of ['assets', 'gltf', 'texture', 'hdri', 'sounds', 'fonts', 'image', 'vendors', '_external']) {
  await cp(path.join(source, folder), path.join(output, folder), { recursive: true })
}

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
])
await patch('Skills-DFKl31g5.js', [
  ['html:"Project Management"', 'html:"AI coaching"'], ['html:"Web Design"', 'html:"Prompt design"'],
  ['html:"UX/UI Process"', 'html:"Workflow discovery"'], ['html:"Front-End Development"', 'html:"Agents & automation"'],
  ['html:"Back-End Development"', 'html:"Evaluation & safety"'],
])

// The original gallery uses dynamically constructed image names. Replace the gallery
// data itself with Abhishek's projects and generate local, self-contained title artwork.
const portfolioPath = path.join(output, 'assets/Portfolio-CRbW23xQ.js')
let portfolio = await readFile(portfolioPath, 'utf8')
const projectsAnchor = /projects:\[\{id:"dupont-airguard"[\s\S]*?\}\]\}\),Vt=/
if (!projectsAnchor.test(portfolio)) throw new Error('Original portfolio data anchor missing')
const projectData = featuredProjects.map(p => ({ id: p.slug, title: p.name, desc: p.description, role: 'Engineering & AI workflows', tech: p.tags.join(' / '), url: p.href, logoScale: 1 }))
portfolio = portfolio.replace(projectsAnchor, `projects:${JSON.stringify(projectData)}}),Vt=`).replace('image/${e.reference}.webp', 'image/${e.reference}.svg')
await writeFile(portfolioPath, portfolio)
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;')
for (const [index, project] of featuredProjects.entries()) {
  const colors = ['#5c4c7b', '#4c6c59', '#856754', '#436776', '#79556c', '#4d5c82']
  const words = project.title.split(' '), line1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), line2 = words.slice(Math.ceil(words.length / 2)).join(' ')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800"><rect width="1200" height="800" fill="${colors[index]}"/><circle cx="1060" cy="110" r="270" fill="#ffffff" opacity=".04"/><text x="90" y="120" font-family="Arial,sans-serif" font-size="26" fill="#efddc4">${escape(project.category)}</text><text x="85" y="340" font-family="Arial,sans-serif" font-weight="bold" font-size="64" fill="white">${escape(line1)}</text><text x="85" y="425" font-family="Arial,sans-serif" font-weight="bold" font-size="64" fill="white">${escape(line2)}</text><path d="M90 540H1110" stroke="#ffffff" opacity=".3"/><text x="90" y="610" font-family="Arial,sans-serif" font-size="30" fill="white">${escape(project.name)}</text><text x="90" y="690" font-family="Arial,sans-serif" font-size="22" fill="#e5dce9">Abhishek Kumar / github.com/iamsammy-ak</text></svg>`
  await writeFile(path.join(output, 'image', `${project.slug}.svg`), svg)
}
await writeFile(path.join(output, 'image/logos.svg'), `<svg xmlns="http://www.w3.org/2000/svg">${featuredProjects.map(p => `<symbol id="${p.slug}" viewBox="0 0 100 100"><text x="10" y="70" fill="white" font-family="sans-serif" font-size="60">ak.</text></symbol>`).join('')}</svg>`)

// Reuse only the loading layout, not the original analytics, challenge scripts, identity or awards.
const original = await readFile(path.join(source, 'index.html'), 'utf8')
const loadingStyle = original.match(/<style>([\s\S]*?)<\/style>/)[1].replaceAll('url("/', 'url("')
await writeFile(path.join(output, 'index.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Abhishek Kumar — interactive world</title><link rel="stylesheet" href="assets/index-CaPdr700.css">
<style>${loadingStyle}</style><link rel="stylesheet" href="world.css"></head><body>
<div id="preloader" class="preloader--france"><div class="motorbike active"><code>000</code></div><div class="city"></div><div class="preloader-enter"><a class="button-start" href="#">Start</a></div></div>
<div id="awards"></div><div id="root"></div>
<script src="vendors/momentum.min.js"></script><script type="module" src="bridge.js"></script></body></html>`)
for (const file of ['bridge.js', 'world.css']) await cp(path.join(root, 'src/world', file), path.join(output, file))
// CSS font and image URLs need the same subdirectory fix.
const cssPath = path.join(output, 'assets/index-CaPdr700.css')
let css = await readFile(cssPath, 'utf8')
css = css.replace(/url\((["']?)\//g, 'url($1../')
await writeFile(cssPath, css)
for (const name of await readdir(path.join(output, 'assets'))) {
  if (!name.endsWith('.js')) continue
  const file = path.join(output, 'assets', name)
  const code = await readFile(file, 'utf8')
  await writeFile(file, code.replace(/(["'`])\/(sounds|hdri|texture|image|fonts)\//g, '$1$2/'))
}
console.log('Prepared the original world with local assets and the portfolio bridge.')
