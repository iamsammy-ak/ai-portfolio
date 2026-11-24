# Approved avatar

`model.glb` is the approved second avatar revision for Abhishek Kumar, integrated on 2026-11-25. It contains the adapted head, disconnected moustache and beard, right-eyebrow cut, black wavy hair and navy pinstripe outfit.

This bundle derives from `reference-assets/sebastien-lempens/gltf/model.glb`. It preserves the original scene nodes, skin definitions, props and all ten animation clips. Head and clothing geometry, UVs and materials are adapted; a skinned hair mesh is added. The original creator and resource credits remain applicable.

The build copies this bundle over the generated world's `gltf/model.glb`, and includes its bytes in the world URL fingerprint so avatar changes invalidate cached assets.

The editable Blender scene and authoring script remain in the local ignored `artifacts/avatar/` folder. Reference photographs and the Blender installation are not published. Face and suit albedo maps were adapted with image generation, then packed into the exported model.
