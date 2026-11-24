import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { C, G, M } from './materials.js'
import { STOPS, frameAt, road, roadLength, seeded } from './layout.js'
import { live, useStore } from '../store.js'

/* Sky, sun, mountains, the city blocks, street lamps and trees: everything
   that is not the road, the scooter or a landmark. */

// Low in the sky, ahead and to the left, so it lights the side of everything the
// camera sees and throws long shadows across the street.
export const SUN = new THREE.Vector3(-0.9, 0.36, -0.34).normalize()

/* A painted sunset: gradient, a sun with a soft halo, and drifting clouds
   that catch the light on the side facing it. All computed in the shader. */
const skyMaterial = new THREE.ShaderMaterial({
  side: THREE.BackSide,
  depthWrite: false,
  fog: false,
  uniforms: {
    uTime: { value: 0 },
    uSun: { value: SUN },
    uTop: { value: new THREE.Color('#2a3572') },
    uMid: { value: new THREE.Color('#a86f9c') },
    uLow: { value: new THREE.Color(C.haze) },
    uSunColor: { value: new THREE.Color('#ffe2a8') },
    uCloudLit: { value: new THREE.Color('#ffb98a') },
    uCloudShade: { value: new THREE.Color('#6d5a92') },
  },
  vertexShader: /* glsl */ `
    varying vec3 vDir;
    void main() {
      vDir = normalize(position);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform float uTime;
    uniform vec3 uSun, uTop, uMid, uLow, uSunColor, uCloudLit, uCloudShade;
    varying vec3 vDir;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(13.7, 7.1); a *= 0.5; }
      return v;
    }

    void main() {
      vec3 dir = normalize(vDir);
      float h = clamp(dir.y, 0.0, 1.0);
      float toSun = max(dot(dir, uSun), 0.0);

      vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.26, h));
      col = mix(col, uTop, smoothstep(0.18, 0.8, h));
      col += uSunColor * pow(toSun, 6.0) * 0.38;
      col += uSunColor * pow(toSun, 60.0) * 0.5;
      col = mix(col, vec3(1.0, 0.96, 0.84) * 1.6, smoothstep(0.9990, 0.9996, toSun));

      // Clouds live on a flat layer above the scene; the divide stretches them toward the horizon.
      vec2 uv = dir.xz / (dir.y + 0.16) * 1.15 + vec2(uTime * 0.006, 0.0);
      float body = fbm(uv);
      float wisps = fbm(uv * 2.6 + 4.0);
      float cover = smoothstep(0.46, 0.78, body * 0.78 + wisps * 0.3);
      cover *= smoothstep(0.015, 0.16, dir.y) * (1.0 - smoothstep(0.55, 0.95, dir.y));
      vec3 cloud = mix(uCloudShade, uCloudLit, pow(toSun, 1.6) * 0.85 + wisps * 0.25);
      cloud += uSunColor * pow(toSun, 10.0) * 0.5;
      col = mix(col, cloud, cover * 0.86);

      gl_FragColor = vec4(col, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
})

const farRange = new THREE.MeshBasicMaterial({ color: '#d79aa0', fog: false })
const nearRange = new THREE.MeshBasicMaterial({ color: '#b98aa6', fog: false })
const litWindow = new THREE.MeshBasicMaterial({ color: new THREE.Color('#ffc46b').multiplyScalar(1.7), toneMapped: false })

function Backdrop() {
  const group = useRef()
  const peaks = useMemo(() => {
    const rand = seeded(21)
    const list = []
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 + rand() * 0.12
      list.push({ far: true, x: Math.cos(a) * 265, z: Math.sin(a) * 265, h: 26 + rand() * 36, w: 50 + rand() * 36, turn: rand() * 3 })
    }
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2 + rand() * 0.2
      list.push({ far: false, x: Math.cos(a) * 225, z: Math.sin(a) * 225, h: 10 + rand() * 16, w: 44 + rand() * 30, turn: rand() * 3 })
    }
    return list
  }, [])

  // The backdrop travels with the camera, so the horizon never gets closer.
  useFrame(({ camera }) => {
    group.current.position.set(camera.position.x, 0, camera.position.z)
    skyMaterial.uniforms.uTime.value = live.time
  })

  return (
    <group ref={group} userData={{ noShadow: true }}>
      <mesh material={skyMaterial} renderOrder={-10}>
        <sphereGeometry args={[340, 48, 24]} />
      </mesh>
      {peaks.map((p, i) => (
        <mesh
          key={i}
          geometry={G.cone4}
          material={p.far ? farRange : nearRange}
          position={[p.x, p.h / 2 - 1.5, p.z]}
          rotation={[0, p.turn, 0]}
          scale={[p.w, p.h, p.w]}
          renderOrder={p.far ? -7 : -6}
        />
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]} material={M.ground} userData={{ receiveOnly: true }}>
        <circleGeometry args={[440, 48]} />
      </mesh>
    </group>
  )
}

/* The low sun. It follows the scooter so the shadow map always covers the
   part of the street that is on screen. */
function Sun() {
  const light = useRef()
  const tier = useStore((s) => s.tier)
  const scene = useThree((s) => s.scene)
  const scratch = useRef({})

  useEffect(() => {
    const l = light.current
    scene.add(l.target)
    return () => scene.remove(l.target)
  }, [scene])

  useFrame(() => {
    const f = frameAt(live.p, scratch.current)
    light.current.target.position.copy(f.pos)
    light.current.position.copy(f.pos).addScaledVector(SUN, 90)
  })

  const size = tier === 'high' ? 2048 : 1024
  return (
    <directionalLight
      ref={light}
      color="#ffc08c"
      intensity={4.6}
      castShadow={tier !== 'low'}
      shadow-mapSize={[size, size]}
      shadow-bias={-0.0005}
      shadow-normalBias={0.06}
      shadow-camera-left={-42}
      shadow-camera-right={42}
      shadow-camera-top={42}
      shadow-camera-bottom={-42}
      shadow-camera-near={10}
      shadow-camera-far={200}
    />
  )
}

const UP = new THREE.Vector3(0, 1, 0)
const NO_TURN = new THREE.Quaternion()

/* Where the landmarks stand, so nothing else is built on top of them. */
function landmarkAnchors() {
  const list = []
  for (let i = 0; i < STOPS; i++) {
    const f = frameAt(i)
    list.push(f.pos.clone().addScaledVector(f.right, 6.8).addScaledVector(f.tan, 3.2))
  }
  return list
}

/* City blocks on both sides of the street: a body, a darker ground floor,
   a roof and rows of windows, some of them lit. */
function Buildings() {
  const tier = useStore((s) => s.tier)
  const meshes = useMemo(() => {
    const rand = seeded(99)
    const bodies = []
    const bases = []
    const roofs = []
    const flats = []
    const dark = []
    const lit = []
    const base = new THREE.Matrix4()
    const quat = new THREE.Quaternion()
    const P = new THREE.Vector3()
    const T = new THREE.Vector3()
    const N = new THREE.Vector3()
    const put = (list, x, y, z, sx, sy, sz) =>
      list.push(base.clone().multiply(new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), NO_TURN, new THREE.Vector3(sx, sy, sz))))

    for (const side of [-1, 1]) {
      let u = 0.004
      while (u < 0.996) {
        const w = 7 + rand() * 6 // along the street
        const d = 7 + rand() * 4 // away from it
        const h = 7 + rand() * 10
        const setback = (side < 0 ? 17.5 : 16) + rand() * 3.5 + d / 2
        road.getPointAt(u, P)
        road.getTangentAt(u, T)
        N.crossVectors(T, UP).normalize()
        P.addScaledVector(N, side * setback)
        quat.setFromAxisAngle(UP, Math.atan2(T.x, T.z))
        base.compose(P, quat, new THREE.Vector3(1, 1, 1))

        put(bodies, 0, h / 2, 0, d, h, w)
        put(bases, 0, 1.25, 0, d + 0.24, 2.5, w + 0.24)
        if (rand() < 0.55) put(roofs, 0, h + 1.1, 0, d * 1.5, 2.2, w * 1.5)
        else put(flats, 0, h + 0.2, 0, d + 0.5, 0.4, w + 0.5)

        // In local space the street lies toward +X on the left side and -X on the right.
        const face = side * (d / 2 + 0.03)
        const cols = Math.max(2, Math.floor(w / 2))
        const rows = Math.max(1, Math.floor((h - 3.2) / 2.2))
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const list = rand() < 0.2 ? lit : dark
            put(list, face, 3.9 + r * 2.2, (c - (cols - 1) / 2) * 2, 0.08, 1.25, 0.82)
          }
        }
        u += (w + 1.2 + rand() * 3.5) / roadLength
      }
    }

    const build = (geometry, material, list) => {
      const mesh = new THREE.InstancedMesh(geometry, material, list.length)
      list.forEach((m, i) => mesh.setMatrixAt(i, m))
      mesh.instanceMatrix.needsUpdate = true
      mesh.frustumCulled = false
      return mesh
    }
    const windows = build(G.box, litWindow, lit)
    windows.userData.noShadow = true
    const panes = build(G.box, M.window, tier === 'low' ? dark.filter((_, i) => i % 2 === 0) : dark)
    panes.userData.noShadow = true
    return [build(G.box, M.wall, bodies), build(G.box, M.light, bases), build(G.roof, M.light, roofs), build(G.box, M.paper, flats), panes, windows]
  }, [tier])

  return meshes.map((mesh, i) => <primitive key={i} object={mesh} />)
}

/* Street lamps along the right-hand kerb, and trees in the gaps. */
function Street() {
  const tier = useStore((s) => s.tier)
  const meshes = useMemo(() => {
    const rand = seeded(1234)
    const anchors = landmarkAnchors()
    const clear = (p, r) => !anchors.some((a) => a.distanceTo(p) < r)
    const P = new THREE.Vector3()
    const T = new THREE.Vector3()
    const N = new THREE.Vector3()
    const dummy = new THREE.Object3D()

    const posts = []
    const arms = []
    const heads = []
    for (let s = 6; s < roadLength - 6; s += 15) {
      const u = s / roadLength
      road.getPointAt(u, P)
      road.getTangentAt(u, T)
      N.crossVectors(T, UP).normalize()
      const foot = P.clone().addScaledVector(N, 3.5)
      if (!clear(foot, 6.5)) continue
      const turn = Math.atan2(T.x, T.z)
      dummy.rotation.set(0, turn, 0)
      dummy.position.set(foot.x, 2.3, foot.z)
      dummy.scale.set(0.13, 4.6, 0.13)
      dummy.updateMatrix()
      posts.push(dummy.matrix.clone())
      const over = foot.clone().addScaledVector(N, -0.55)
      dummy.position.set(over.x, 4.55, over.z)
      dummy.scale.set(1.2, 0.1, 0.1)
      dummy.updateMatrix()
      arms.push(dummy.matrix.clone())
      const lamp = foot.clone().addScaledVector(N, -1.1)
      dummy.position.set(lamp.x, 4.36, lamp.z)
      dummy.scale.set(0.42, 0.3, 0.42)
      dummy.updateMatrix()
      heads.push(dummy.matrix.clone())
    }

    const trees = []
    const wanted = tier === 'low' ? 50 : 110
    let guard = 0
    while (trees.length < wanted && guard++ < wanted * 30) {
      const u = rand()
      road.getPointAt(u, P)
      road.getTangentAt(u, T)
      N.crossVectors(T, UP).normalize()
      const side = rand() < 0.4 ? -1 : 1
      // The camera travels down the left side of the street, so that side is kept clear.
      const away = side < 0 ? 11.5 + rand() * 3.5 : 5 + rand() * 8
      P.addScaledVector(N, side * away)
      if (!clear(P, 11)) continue
      const h = 3.2 + rand() * 4
      dummy.rotation.set(0, rand() * 6, 0)
      dummy.position.set(P.x, h / 2 - 0.05, P.z)
      dummy.scale.set(1 + rand() * 0.8, h, 1 + rand() * 0.8)
      dummy.updateMatrix()
      trees.push(dummy.matrix.clone())
    }

    const build = (geometry, material, list) => {
      const mesh = new THREE.InstancedMesh(geometry, material, list.length)
      list.forEach((m, i) => mesh.setMatrixAt(i, m))
      mesh.instanceMatrix.needsUpdate = true
      mesh.frustumCulled = false
      return mesh
    }
    const glow = build(G.sphere, M.lamp, heads)
    glow.userData.noShadow = true
    return [build(G.cyl, M.dark, posts), build(G.box, M.dark, arms), glow, build(G.cone6, M.tree, trees)]
  }, [tier])

  return meshes.map((mesh, i) => <primitive key={i} object={mesh} />)
}

/* Turns shadow casting and receiving on for everything solid, once the scene has mounted. */
function Shadows() {
  const scene = useThree((s) => s.scene)
  const tier = useStore((s) => s.tier)
  useEffect(() => {
    const visit = (node, off) => {
      const skip = off || node.userData.noShadow
      if (node.isMesh) {
        const solid = !skip && !node.material.isMeshBasicMaterial && !node.material.isShaderMaterial
        node.castShadow = solid && !node.userData.receiveOnly
        node.receiveShadow = solid || !!node.userData.receiveOnly
      }
      node.children.forEach((child) => visit(child, skip && !child.userData.receiveOnly))
    }
    visit(scene, false)
  }, [scene, tier])
  return null
}

export default function World() {
  return (
    <>
      <hemisphereLight args={['#c3b6f5', '#b08aa0', 1.75]} />
      <Sun />
      <Backdrop />
      <Buildings />
      <Street />
      <Shadows />
    </>
  )
}
