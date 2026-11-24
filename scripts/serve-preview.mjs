import http from 'node:http'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
const root = path.resolve('dist')
const types = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp', '.jpg':'image/jpeg', '.glb':'model/gltf-binary', '.wasm':'application/wasm', '.woff2':'font/woff2', '.mp3':'audio/mpeg', '.m4a':'audio/mp4', '.pdf':'application/pdf' }
http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  if (!pathname.startsWith('/ai-portfolio/')) { res.writeHead(404); res.end(); return }
  const file = path.resolve(root, pathname.slice('/ai-portfolio/'.length) || 'index.html')
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return }
  try { const body = await readFile(file); res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }); res.end(body) }
  catch { res.writeHead(404); res.end('Not found') }
}).listen(4173, '127.0.0.1', () => console.log('Preview http://127.0.0.1:4173/ai-portfolio/'))
