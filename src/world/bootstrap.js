// Run before the large runtime imports, so network/startup errors are observable.
const status = document.querySelector('.load-status')
const counter = () => document.querySelector('#preloader code')
const fail = message => {
  if (status) status.textContent = 'The 3D world could not load. Please try again.'
  parent.postMessage({ source: 'ak-world', type: 'error', message }, location.origin)
}
window.addEventListener('error', event => fail(event.message || 'A world asset failed to load.'))
window.addEventListener('unhandledrejection', event => fail(String(event.reason?.message || event.reason)))
window.akLoadingProgress = (loaded, total) => {
  const percentage = Math.min(100, Math.round(100 * loaded / Math.max(total, 1)))
  const element = counter()
  if (element) element.textContent = String(Math.max(Number.parseInt(element.textContent) || 0, percentage)).padStart(3, '0')
  if (status) status.textContent = loaded === total ? 'Preparing the world…' : `Loading world assets: ${loaded} of ${total}`
}
if (counter()) counter().textContent = '…'
try {
  await import('./bridge.js')
  if (status) status.textContent = 'Loading the world…'
} catch (error) {
  fail(error.message)
}
