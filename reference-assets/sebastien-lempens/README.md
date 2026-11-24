# Sébastien Lempens portfolio assets

Downloaded from https://sebastien-lempens.com/ on 2026-11-24.

## Contents

| Location | Contents |
| --- | --- |
| `gltf/country-france.glb` | France scenery; 18 meshes; `cameraFrance` and `cameraFranceLuxembourg` animations |
| `gltf/country-luxembourg.glb` | Luxembourg scenery; 8 meshes |
| `gltf/country-belgium.glb` | Belgium scenery; 13 meshes; `cameraBelgium` animation |
| `gltf/model.glb` | Shared models, character and animal animations; 14 meshes; 11 embedded images |
| `texture/` | Baked country textures in desktop/mobile versions, clouds, water normals, matcap and transitions |
| `hdri/` | Sunrise and sunshine cube maps, each with desktop/mobile versions |
| `sounds/` | Theme music and seven sound effects/ambient tracks |
| `image/` | Loading-screen artwork, interface images and original award graphics |
| `fonts/` | Three Radikal font files |
| `assets/`, `vendors/`, `index.html` | Original compiled browser files retained for reference |
| `_external/www.gstatic.com/draco/versioned/decoders/1.5.5/` | Draco decoder files referenced by the scene loader |

`manifest.json` records source URLs, file sizes and SHA-256 hashes. `model-inventory.json` lists GLB nodes, animations and required extensions. `extra-urls.json` records paths assembled dynamically in the original code, including the cube-map faces.

## Using the world in this project

This folder preserves the original download snapshot. The portfolio now generates its integrated copy in `public/world/` using `scripts/prepare-world.mjs`; edits and personalization happen in that build script and `src/world/`. This snapshot is not the original editable Blender/React source project.

The original HTML also requests Zen Dots from Google Fonts; that external stylesheet/font is not included. Analytics and Cloudflare scripts are not part of this asset collection.

All four GLB files use Draco mesh compression. Configure Three.js `GLTFLoader` with `DRACOLoader` and serve the included decoder directory. The country files also require the matching external baked textures; loading the GLB alone will not reproduce the site's appearance. The original components set `flipY = false` on these textures. Consult the saved country/building components for texture-to-mesh assignments, material settings and transforms.

Preserving the complete experience also requires the camera/scroll synchronization, lighting, shaders, object placement, animation playback and responsive adjustments implemented in the compiled JavaScript. The original Blender files and React source files were not available in the references inspected.

Replace the original biography, project content, contact links, identity, awards and analytics when implementing a personalized version. Some visible lettering may be geometry or baked into textures and will need editing separately. The saved HTML still contains the original analytics and external service references; it was saved as reference material, not prepared as a deployment entry point.

## Source and reuse status

No license granting reuse of the portfolio artwork, code, music or fonts was identified in the pages and bundles inspected. Public download availability does not establish permission to republish these assets. Confirm the applicable permissions with their rights holders before publishing an adaptation; third-party assets can have separate terms. Attribution alone is not a substitute for a reuse license.

Original portfolio: https://sebastien-lempens.com/

Creator's project description: https://pixila.net/projets/sebastien-lempens-portfolio

The creator describes a Blender scene and camera animation rendered through React Three Fiber. The project's page carries an all-rights-reserved footer.

## Resume the download

From the repository root:

```powershell
python scripts/download-reference-assets.py
```

The script reuses saved files, follows same-site asset references and downloads the explicitly referenced Draco decoder version. It does not execute the downloaded JavaScript. It is a resumable snapshot downloader, not an updater: remove or separately archive an old snapshot before intentionally fetching a newer version.
