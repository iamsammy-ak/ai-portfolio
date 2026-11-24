import { createContext, useContext, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { G, HOT, IDLE, M } from './materials.js'
import { LAST, frameAt, smooth } from './layout.js'
import { live } from '../store.js'

/* One landmark per stop, each built from simple shapes and each showing
   the idea of its stop. They rest in cool violet and warm up as the
   scooter's headlight arrives.

   Local space for every landmark: the ground is y = 0 and +Z faces the
   camera. */

const Ctx = createContext(null)
const useLandmark = () => useContext(Ctx)

function Landmark({ index, onRoad = false, children }) {
  const ctx = useMemo(
    () => ({
      act: 0, // 0 far away .. 1 scooter parked here
      on: false, // close enough to bother animating
      hot: new THREE.MeshBasicMaterial({ color: IDLE.clone(), toneMapped: false }),
      hotLine: new THREE.LineBasicMaterial({ color: IDLE.clone(), toneMapped: false }),
    }),
    [],
  )

  const placement = useMemo(() => {
    const f = frameAt(index)
    if (onRoad) {
      return { position: f.pos.clone().addScaledVector(f.tan, 5), rotation: [0, Math.atan2(-f.tan.x, -f.tan.z), 0] }
    }
    const position = f.pos.clone().addScaledVector(f.right, 6.8).addScaledVector(f.tan, 3.2)
    const facing = f.tan.clone().multiplyScalar(-0.8).addScaledVector(f.right, -0.6)
    return { position, rotation: [0, Math.atan2(facing.x, facing.z), 0] }
  }, [index, onRoad])

  useFrame(() => {
    const distance = Math.abs(live.p - index)
    ctx.on = distance < 1.7
    if (!ctx.on && ctx.act === 0) return
    ctx.act = smooth(1 - distance / 0.95)
    ctx.hot.color.lerpColors(IDLE, HOT, ctx.act)
    ctx.hotLine.color.copy(ctx.hot.color)
  })

  return (
    <group position={placement.position} rotation={placement.rotation}>
      <Ctx.Provider value={ctx}>{children}</Ctx.Provider>
    </group>
  )
}

/* ---- small building blocks ---- */

const Shape = ({ g = G.box, p, s, r, m = M.wall, ref }) => (
  <mesh ref={ref} geometry={g} material={m} position={p} scale={s} rotation={r} />
)

const Person = ({ p, s = 1, m = M.light, head = M.paper }) => (
  <group position={p} scale={s}>
    <mesh geometry={G.cone} material={m} position={[0, 0.45, 0]} scale={[0.44, 0.9, 0.44]} />
    <mesh geometry={G.sphere} material={head} position={[0, 1.06, 0]} scale={0.3} />
  </group>
)

const setLit = (mesh, on, lm, base = M.light) => {
  const wanted = on ? lm.hot : base
  if (mesh && mesh.material !== wanted) mesh.material = wanted
}

/* ---- 0. Start: a signpost pointing down the road ---- */
function Signpost() {
  const lm = useLandmark()
  return (
    <group position={[-2.2, 0, 0.5]}>
      <Shape g={G.cyl} p={[0, 1.9, 0]} s={[0.14, 3.8, 0.14]} m={M.paper} />
      <Shape p={[0.75, 3.35, 0]} s={[1.9, 0.46, 0.08]} m={lm.hot} r={[0, 0, 0.05]} />
      <Shape p={[-0.6, 2.75, 0]} s={[1.6, 0.42, 0.08]} m={M.rose} r={[0, 0, -0.06]} />
      <Shape p={[0.6, 2.18, 0]} s={[1.5, 0.4, 0.08]} m={M.light} r={[0, 0, 0.04]} />
      <Shape g={G.cyl} p={[0, 0.1, 0]} s={[0.9, 0.2, 0.9]} m={M.dark} />
    </group>
  )
}

/* ---- 1. Engineer first: a Turin spire and a bar chart ---- */
const BARS = [1.0, 1.7, 1.3, 2.3, 3.0]
function Campus() {
  const lm = useLandmark()
  const bars = useRef([])
  useFrame(() => {
    if (!lm.on) return
    bars.current.forEach((bar, i) => {
      const h = BARS[i] * (0.3 + 0.7 * lm.act)
      bar.scale.y = h
      bar.position.y = 0.3 + h / 2
    })
  })
  return (
    <>
      <group position={[-1.5, 0, -0.5]} scale={0.6}>
        <Shape p={[0, 1.1, 0]} s={[3.2, 2.2, 3.2]} />
        <Shape p={[0, 2.45, 0]} s={[2.7, 0.5, 2.7]} m={M.light} />
        <Shape g={G.cone4} p={[0, 4.1, 0]} s={[3.9, 2.8, 3.9]} r={[0, Math.PI / 4, 0]} />
        <Shape p={[0, 5.8, 0]} s={[0.7, 0.9, 0.7]} m={M.light} />
        <Shape p={[0, 5.8, 0.36]} s={[0.3, 0.5, 0.03]} m={lm.hot} />
        <Shape g={G.cone} p={[0, 8.05, 0]} s={[0.55, 3.6, 0.55]} m={M.paper} />
        <Shape g={G.sphere} p={[0, 9.95, 0]} s={0.3} m={lm.hot} />
        {[-1, 0, 1].map((x) => (
          <Shape key={x} p={[x, 1.25, 1.61]} s={[0.42, 0.95, 0.03]} m={lm.hot} />
        ))}
      </group>
      <Shape p={[2.3, 0.15, 0.7]} s={[3.3, 0.3, 1.2]} m={M.dark} />
      {BARS.map((_, i) => (
        <Shape
          key={i}
          ref={(el) => {
            bars.current[i] = el
          }}
          p={[1.1 + i * 0.6, 0.8, 0.7]}
          s={[0.42, 1, 0.7]}
          m={i === BARS.length - 1 ? lm.hot : M.light}
        />
      ))}
    </>
  )
}

/* ---- 2. Building with AI: a workstation with tools in orbit ---- */
const CODE = [2.6, 1.7, 3.1, 2.2, 1.2, 2.8]
function Workbench() {
  const lm = useLandmark()
  const lines = useRef([])
  const orbit = useRef()
  useFrame(() => {
    if (!lm.on) return
    const written = Math.floor((live.time * 2.4) % 9)
    lines.current.forEach((line, i) => setLit(line, i < written && lm.act > 0.3, lm))
    orbit.current.rotation.y = live.time * 0.45
  })
  return (
    <>
      <Shape p={[0, 0.08, 0]} s={[2.4, 0.16, 1.3]} m={M.dark} />
      <Shape p={[0, 0.55, -0.1]} s={[0.4, 0.9, 0.3]} m={M.dark} />
      <Shape p={[0, 2.55, 0]} s={[4.8, 3.1, 0.22]} m={M.dark} />
      <Shape p={[0, 2.55, 0.12]} s={[4.5, 2.8, 0.02]} />
      {CODE.map((length, i) => (
        <Shape
          key={i}
          ref={(el) => {
            lines.current[i] = el
          }}
          p={[-1.95 + length / 2 + (i % 3 === 1 ? 0.4 : 0), 3.55 - i * 0.4, 0.15]}
          s={[length, 0.16, 0.03]}
          m={M.light}
        />
      ))}
      <Shape p={[0, 0.24, 0.85]} s={[1.7, 0.08, 0.5]} m={M.light} />
      <group ref={orbit} position={[0, 2.6, 0]}>
        <Shape g={G.octa} p={[3.3, 0.9, 0]} s={0.6} m={lm.hot} />
        <Shape p={[-3.3, 0.2, 0]} s={0.5} m={M.rose} r={[0.6, 0.4, 0]} />
        <Shape g={G.sphere} p={[0, 1.5, 3.3]} s={0.5} m={M.paper} />
        <Shape g={G.cone4} p={[0, -0.3, -3.3]} s={[0.6, 0.7, 0.6]} m={M.light} />
      </group>
    </>
  )
}

/* ---- 3. Fast under pressure: a podium, three trophies, a stopwatch ---- */
const RESULTS = [
  { x: -1.55, h: 1.9, first: true },
  { x: 0, h: 1.25, first: false },
  { x: 1.55, h: 1.9, first: true },
]
function Podium() {
  const lm = useLandmark()
  const hand = useRef()
  useFrame(() => {
    if (lm.on) hand.current.rotation.z = -live.time * 1.6
  })
  return (
    <>
      {RESULTS.map((r, i) => (
        <group key={i} position={[r.x, 0, 0]}>
          <Shape p={[0, r.h / 2, 0]} s={[1.45, r.h, 1.45]} m={r.first ? M.wall : M.dark} />
          <Shape g={G.cyl} p={[0, r.h + 0.07, 0]} s={[0.56, 0.14, 0.56]} m={M.dark} />
          <Shape g={G.cyl} p={[0, r.h + 0.32, 0]} s={[0.12, 0.4, 0.12]} m={r.first ? lm.hot : M.paper} />
          <Shape g={G.cup} p={[0, r.h + 0.86, 0]} s={[0.78, 0.7, 0.78]} m={r.first ? lm.hot : M.paper} />
          <Shape p={[0, r.h + 0.92, 0]} s={[1.06, 0.1, 0.1]} m={r.first ? lm.hot : M.paper} />
        </group>
      ))}
      <group position={[0, 4.3, -1.3]}>
        <Shape g={G.ring} s={2.5} m={M.light} />
        <Shape p={[0, 1.4, 0]} s={[0.3, 0.3, 0.2]} m={M.light} />
        <group ref={hand}>
          <Shape p={[0, 0.5, 0]} s={[0.09, 1, 0.09]} m={lm.hot} />
        </group>
      </group>
    </>
  )
}

/* ---- 4. AI under the hood: eleven connected systems and turning gears ---- */
const NODES = Array.from({ length: 11 }, (_, i) =>
  i < 6 ? new THREE.Vector3(-2 + i * 0.8, 2.85, 0) : new THREE.Vector3(1.6 - (i - 6) * 0.8, 1.6, 0),
)
function Engine() {
  const lm = useLandmark()
  const nodes = useRef([])
  const big = useRef()
  const small = useRef()
  const wire = useMemo(() => new THREE.Line(new THREE.BufferGeometry().setFromPoints(NODES), M.line), [])
  useFrame(() => {
    if (!lm.on) return
    const reached = Math.floor((live.time * 3.2) % 14)
    nodes.current.forEach((node, i) => setLit(node, i <= reached && lm.act > 0.3, lm))
    big.current.rotation.z = live.time * 0.5
    small.current.rotation.z = -live.time * 0.86
  })
  return (
    <>
      <Shape p={[-2.9, 1.9, -0.5]} s={[0.3, 3.8, 0.3]} m={M.dark} />
      <Shape p={[2.9, 1.9, -0.5]} s={[0.3, 3.8, 0.3]} m={M.dark} />
      <Shape p={[0, 3.9, -0.5]} s={[6.1, 0.3, 0.3]} m={M.dark} />
      <Shape p={[0, 0.35, 0]} s={[4.6, 0.7, 1.1]} />
      <primitive object={wire} />
      {NODES.map((n, i) => (
        <Shape
          key={i}
          g={G.sphere}
          ref={(el) => {
            nodes.current[i] = el
          }}
          p={n.toArray()}
          s={0.36}
          m={M.light}
        />
      ))}
      <group ref={big} position={[3.75, 1.05, 0.9]}>
        <Shape g={G.cyl6} r={[Math.PI / 2, 0, 0]} s={[1.5, 0.3, 1.5]} m={M.light} />
        <Shape g={G.cyl} r={[Math.PI / 2, 0, 0]} s={[0.5, 0.34, 0.5]} m={M.dark} />
      </group>
      <group ref={small} position={[4.6, 2.05, 0.9]}>
        <Shape g={G.cyl6} r={[Math.PI / 2, 0, 0]} s={[0.95, 0.3, 0.95]} m={M.paper} />
      </group>
    </>
  )
}

/* ---- 5. Safe to use at work: a shield, a scanner, and what gets stopped ---- */
function Shield() {
  const lm = useLandmark()
  const scan = useRef()
  const stopped = useRef([])
  useFrame(() => {
    if (!lm.on) return
    scan.current.position.y = 0.5 + ((live.time * 0.45) % 1) * 3.3
    stopped.current.forEach((cube, i) => {
      const phase = (live.time * 0.5 + i * 0.33) % 1
      cube.position.x = -5.2 + smooth(Math.min(1, phase * 2)) * 1.6 - smooth(Math.max(0, phase * 2 - 1)) * 1.6
      cube.rotation.y = live.time + i
    })
  })
  return (
    <>
      <Shape p={[0, 2.1, -0.5]} s={[6, 4.2, 0.22]} m={M.dark} />
      <Shape g={G.cyl6} p={[0, 2.2, 0]} r={[Math.PI / 2, 0, 0]} s={[3, 0.3, 3]} m={M.paper} />
      <Shape g={G.cyl6} p={[0, 2.2, 0.06]} r={[Math.PI / 2, 0, 0]} s={[2.2, 0.3, 2.2]} m={lm.hot} />
      <Shape p={[-0.3, 1.95, 0.24]} s={[0.17, 0.62, 0.06]} r={[0, 0, 0.8]} m={M.dark} />
      <Shape p={[0.22, 2.25, 0.24]} s={[0.17, 1.1, 0.06]} r={[0, 0, -0.6]} m={M.dark} />
      <Shape ref={scan} p={[0, 1, -0.36]} s={[5.8, 0.07, 0.06]} m={lm.hot} />
      {[0, 1, 2].map((i) => (
        <Shape
          key={i}
          ref={(el) => {
            stopped.current[i] = el
          }}
          p={[-4.6, 1 + i * 1.05, 0.3]}
          s={0.42}
          m={M.roseGlow}
        />
      ))}
    </>
  )
}

/* ---- 6. Every department: a street of ten small offices ---- */
const AWNINGS = [M.rose, M.paper, M.light]
function Kiosks() {
  const lm = useLandmark()
  const windows = useRef([])
  useFrame(() => {
    if (!lm.on) return
    const open = Math.floor((live.time * 2.4) % 14)
    windows.current.forEach((w, i) => setLit(w, i <= open && lm.act > 0.3, lm))
  })
  return (
    <>
      {Array.from({ length: 10 }, (_, j) => {
        const back = j >= 5
        const x = ((j % 5) - 2) * 1.34
        const z = back ? -0.9 : 0.9
        const h = back ? 2.7 : 1.6
        return (
          <group key={j} position={[x, 0, z]}>
            <Shape p={[0, h / 2, 0]} s={[1.08, h, 1.08]} m={j % 2 ? M.wall : M.dark} />
            <Shape p={[0, h + 0.08, 0.2]} s={[1.24, 0.14, 0.86]} m={AWNINGS[j % 3]} />
            <Shape
              ref={(el) => {
                windows.current[j] = el
              }}
              p={[0, h - 0.62, 0.55]}
              s={[0.66, 0.56, 0.03]}
              m={M.light}
            />
          </group>
        )
      })}
    </>
  )
}

/* ---- 7. The Microsoft stack: stacked platforms, an agent, a project plan ---- */
function Platform() {
  const lm = useLandmark()
  const agent = useRef()
  const halo = useRef()
  useFrame(() => {
    if (!lm.on) return
    agent.current.rotation.y = live.time * 0.9
    agent.current.position.y = 4.35 + Math.sin(live.time * 1.6) * 0.12
    halo.current.rotation.z = live.time * 0.4
  })
  return (
    <>
      {[3.9, 3.2, 2.5, 1.8].map((w, i) => (
        <group key={i} position={[-0.5, 0.3 + i * 0.85, 0]} rotation={[0, i * 0.22, 0]}>
          <Shape s={[w, 0.4, w]} m={i % 2 ? M.light : M.wall} />
          <Shape g={G.cyl} p={[0, 0.43, 0]} s={[0.6, 0.45, 0.6]} m={M.dark} />
        </group>
      ))}
      <Shape g={G.octa} ref={agent} p={[-0.5, 4.35, 0]} s={0.95} m={lm.hot} />
      <Shape g={G.ring} ref={halo} p={[-0.5, 4.35, 0]} s={1.9} r={[Math.PI / 2.4, 0, 0]} m={M.paper} />
      <group position={[3.3, 0, 0.7]} rotation={[0, -0.4, 0]}>
        <Shape p={[0, 2, 0]} s={[2.7, 2.3, 0.12]} m={M.dark} />
        <Shape p={[-1.1, 0.45, 0]} s={[0.12, 0.9, 0.12]} m={M.dark} />
        <Shape p={[1.1, 0.45, 0]} s={[0.12, 0.9, 0.12]} m={M.dark} />
        {[0, 1, 2, 3].map((i) => (
          <Shape key={i} p={[-0.62 + i * 0.36, 2.7 - i * 0.46, 0.08]} s={[1.05, 0.22, 0.04]} m={i === 1 ? lm.hot : M.light} />
        ))}
      </group>
    </>
  )
}

/* ---- 8. Products people use: a phone, its apps, a map pin, two citations ---- */
function Phone() {
  const lm = useLandmark()
  const tiles = useRef([])
  const pin = useRef()
  useFrame(() => {
    if (!lm.on) return
    const open = Math.floor(live.time * 1.3) % 6
    tiles.current.forEach((tile, i) => setLit(tile, i === open && lm.act > 0.3, lm))
    pin.current.position.y = 2.1 + Math.abs(Math.sin(live.time * 2)) * 0.35
  })
  return (
    <>
      <Shape p={[0, 2.4, 0]} s={[2.4, 4.6, 0.3]} m={M.dark} />
      <Shape p={[0, 2.4, 0.16]} s={[2.1, 4.2, 0.02]} />
      <Shape p={[0, 4.1, 0.19]} s={[1.76, 0.26, 0.03]} m={M.paper} />
      {Array.from({ length: 6 }, (_, i) => (
        <Shape
          key={i}
          ref={(el) => {
            tiles.current[i] = el
          }}
          p={[i % 2 ? 0.48 : -0.48, 3.35 - Math.floor(i / 2) * 1.0, 0.19]}
          s={[0.8, 0.8, 0.03]}
          m={M.light}
        />
      ))}
      <group ref={pin} position={[2.5, 2.1, 0.9]}>
        <Shape g={G.cone} r={[Math.PI, 0, 0]} s={[0.62, 1, 0.62]} m={M.rose} />
        <Shape g={G.sphere} p={[0, 0.5, 0]} s={0.8} m={M.rose} />
        <Shape g={G.sphere} p={[0, 0.5, 0.3]} s={0.3} m={M.paper} />
      </group>
      <Shape p={[-2.4, 3.3, 0.5]} s={[1.3, 0.85, 0.05]} r={[0, 0.35, 0.08]} m={M.paper} />
      <Shape p={[-2.6, 2.1, 0.8]} s={[1.1, 0.7, 0.05]} r={[0, 0.45, -0.06]} m={M.paper} />
      <Shape p={[-2.3, 3.3, 0.56]} s={[0.8, 0.1, 0.03]} r={[0, 0.35, 0.08]} m={lm.hot} />
    </>
  )
}

/* ---- 9. Leading people: a speaker, a stage and a crowd ---- */
const CROWD = []
for (let row = 0; row < 3; row++) {
  const n = 7 + row * 2
  const radius = 2.5 + row * 0.9
  for (let i = 0; i < n; i++) {
    const a = ((i / (n - 1)) * 2 - 1) * 1.05
    CROWD.push([Math.sin(a) * radius, 0, -1.5 + Math.cos(a) * radius])
  }
}
function Stage() {
  const lm = useLandmark()
  return (
    <>
      <Shape g={G.cyl} p={[0, 0.2, -1.5]} s={[3.2, 0.4, 3.2]} m={M.dark} />
      <Person p={[0, 0.4, -1.5]} s={1.35} m={M.rose} />
      <Shape g={G.cyl} p={[1.3, 2, -2]} s={[0.07, 3.6, 0.07]} m={M.paper} />
      <Shape p={[1.75, 3.45, -2]} s={[0.85, 0.55, 0.04]} m={M.rose} />
      {CROWD.map((p, i) => (
        <Person key={i} p={p} s={0.8} head={lm.hot} />
      ))}
    </>
  )
}

/* ---- 10. Approach: a workshop with a four-step plan on the board ---- */
const STEPS = [1.6, 2.3, 3.0, 3.7]
function Classroom() {
  const lm = useLandmark()
  const steps = useRef([])
  useFrame(() => {
    if (!lm.on) return
    const reached = Math.floor((live.time * 1.3) % 7)
    steps.current.forEach((step, i) => setLit(step, i <= reached && lm.act > 0.3, lm))
  })
  return (
    <>
      <Shape p={[0, 2.6, -1.58]} s={[5, 2.8, 0.1]} m={M.dark} />
      <Shape p={[0, 2.6, -1.5]} s={[4.7, 2.5, 0.1]} m={M.board} />
      <Shape p={[-2, 0.65, -1.55]} s={[0.12, 1.3, 0.12]} m={M.dark} />
      <Shape p={[2, 0.65, -1.55]} s={[0.12, 1.3, 0.12]} m={M.dark} />
      {STEPS.map((length, i) => (
        <group key={i}>
          <Shape g={G.cyl} p={[-2, 3.4 - i * 0.52, -1.42]} r={[Math.PI / 2, 0, 0]} s={[0.26, 0.04, 0.26]} m={M.dark} />
          <Shape
            ref={(el) => {
              steps.current[i] = el
            }}
            p={[-1.7 + length / 2, 3.4 - i * 0.52, -1.43]}
            s={[length, 0.2, 0.03]}
            m={M.light}
          />
        </group>
      ))}
      <Person p={[-3.2, 0, -0.9]} s={1.3} m={M.rose} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = ((i % 3) - 1) * 1.7
        const z = 0.2 + Math.floor(i / 3) * 1.5
        return (
          <group key={i} position={[x, 0, z]}>
            <Shape p={[0, 0.4, 0]} s={[1.15, 0.8, 0.6]} m={M.dark} />
            <Shape p={[0, 0.98, -0.06]} s={[0.52, 0.36, 0.04]} r={[-0.25, 0, 0]} m={lm.hot} />
            <Person p={[0, 0, 0.62]} s={0.78} />
          </group>
        )
      })}
    </>
  )
}

/* ---- 11. Arrival: an arch over the road ---- */
function Arch() {
  const lm = useLandmark()
  return (
    <>
      <Shape g={G.cyl} p={[-3.1, 2.4, 0]} s={[0.34, 4.8, 0.34]} m={M.light} />
      <Shape g={G.cyl} p={[3.1, 2.4, 0]} s={[0.34, 4.8, 0.34]} m={M.light} />
      <Shape p={[0, 4.95, 0]} s={[6.9, 0.42, 0.42]} />
      <Shape p={[0, 4.25, 0.06]} s={[4.4, 0.7, 0.06]} m={lm.hot} />
      {Array.from({ length: 9 }, (_, i) => (
        <Shape key={i} g={G.cone4} p={[-2.8 + i * 0.7, 5.45, 0]} s={[0.4, 0.6, 0.4]} m={AWNINGS[i % 3]} />
      ))}
      <Shape g={G.sphere} p={[-3.1, 5, 0]} s={0.5} m={lm.hot} />
      <Shape g={G.sphere} p={[3.1, 5, 0]} s={0.5} m={lm.hot} />
      <Shape p={[0, 0.03, 0]} s={[4.6, 0.02, 0.55]} m={M.light} />
    </>
  )
}

const ROADSIDE = [Signpost, Campus, Workbench, Podium, Engine, Shield, Kiosks, Platform, Phone, Stage, Classroom]

export default function Landmarks() {
  return (
    <>
      {ROADSIDE.map((Piece, i) => (
        <Landmark key={i} index={i}>
          <Piece />
        </Landmark>
      ))}
      <Landmark index={LAST} onRoad>
        <Arch />
      </Landmark>
    </>
  )
}
