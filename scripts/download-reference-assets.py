"""Download publicly referenced files from the supplied portfolio, preserving paths."""
import concurrent.futures
import hashlib
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ORIGIN = 'https://sebastien-lempens.com/'
ROOT = Path(__file__).resolve().parents[1] / 'reference-assets' / 'sebastien-lempens'
EXTENSIONS = r'(?:glb|gltf|bin|ktx2|hdr|exr|png|jpe?g|webp|gif|svg|ico|mp3|m4a|ogg|wav|mp4|webm|woff2?|ttf|otf|json|js|css|wasm)'
PATTERN = re.compile(r'''["'`(]([^"'`<>\s(){}]*?\.''' + EXTENSIONS + r'''(?:\?[^"'`<>\s(){}]*)?)["'`)]''', re.I)
DECODER_BASE = 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/'

def discover(text, base):
    found = set()
    for match in PATTERN.finditer(text.replace('\\/', '/')):
        value = match.group(1)
        if not re.fullmatch(r'[A-Za-z0-9_./%:@?=&+~-]+', value):
            continue
        if '=' in value.split('?', 1)[0]:
            continue
        # The scene components prepend `texture/` to these desktop/mobile filenames.
        if re.fullmatch(r'(?:france|belgium|luxembourg)-[A-Za-z0-9_@-]+\.webp', value):
            value = 'texture/' + value
        # These are library defaults, not actual site paths; cube maps are expanded in extra-urls.json.
        if '/' not in value.strip('/') and (value.endswith('.hdr') or value.lstrip('/') in {'px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png', 'draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js'}):
            continue
        # Bundler imports are module-relative; runtime loader paths resolve at the document root.
        context = base if value.startswith(('./', '../')) or not base.endswith('.js') else ORIGIN
        url = urllib.parse.urljoin(context, value)
        parsed = urllib.parse.urlsplit(url)
        if parsed.path.startswith('/cdn-cgi/') or Path(parsed.path).name.startswith('.'):
            continue
        if parsed.netloc == urllib.parse.urlsplit(ORIGIN).netloc and parsed.scheme == 'https':
            found.add(urllib.parse.urlunsplit(parsed._replace(fragment='')))
    return found

def download(url):
    parsed = urllib.parse.urlsplit(url)
    relative = urllib.parse.unquote(parsed.path).lstrip('/') or 'index.html'
    if parsed.netloc != urllib.parse.urlsplit(ORIGIN).netloc:
        if not url.startswith(DECODER_BASE):
            return {'url': url, 'error': 'External URL not in the dependency allowlist'}, set()
        relative = '_external/' + parsed.netloc + '/' + relative
    destination = (ROOT / relative).resolve()
    if not destination.is_relative_to(ROOT.resolve()):
        return {'url': url, 'error': 'Path outside output directory'}, set()
    try:
        if destination.exists():
            data = destination.read_bytes()
            mime = 'cached'
        else:
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': ORIGIN})
            for attempt in range(3):
                try:
                    with urllib.request.urlopen(request, timeout=30) as response:
                        mime = response.headers.get_content_type()
                        data = response.read()
                    break
                except urllib.error.HTTPError:
                    raise
                except (TimeoutError, urllib.error.URLError):
                    if attempt == 2:
                        raise
                    time.sleep(1)
            if relative != 'index.html' and (mime == 'text/html' or data.lstrip().lower().startswith(b'<!doctype html')):
                raise ValueError('Server returned HTML instead of an asset')
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
        record = {'url': url, 'path': relative, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'content_type': mime}
        children = discover(data.decode('utf-8', errors='replace'), url) if destination.suffix in ('.html', '.js', '.css', '.json', '.gltf') else set()
        return record, children
    except Exception as error:
        return {'url': url, 'error': str(error)}, set()

def main():
    ROOT.mkdir(parents=True, exist_ok=True)
    pending, seen, records = {ORIGIN}, set(), []
    pending.update(DECODER_BASE + name for name in ('draco_decoder.js', 'draco_wasm_wrapper.js', 'draco_decoder.wasm'))
    extra = ROOT / 'extra-urls.json'
    if extra.exists():
        pending.update(json.loads(extra.read_text(encoding='utf-8')))
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        while pending:
            batch = sorted(pending - seen)
            if not batch:
                break
            seen.update(batch)
            pending = set()
            for record, children in pool.map(download, batch):
                records.append(record)
                pending.update(children - seen)
                print(('FAIL ' if 'error' in record else 'OK ') + record.get('path', record['url']), flush=True)
            (ROOT / 'manifest.json').write_text(json.dumps({'source': ORIGIN, 'license': 'No reuse license identified. Download does not grant reuse permission.', 'files': records}, indent=2), encoding='utf-8')
    print(json.dumps({'downloaded': sum('error' not in x for x in records), 'failed': sum('error' in x for x in records), 'bytes': sum(x.get('bytes', 0) for x in records)}))

if __name__ == '__main__':
    main()
