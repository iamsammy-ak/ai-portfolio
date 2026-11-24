import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { C } from './materials.js'
import World from './World.jsx'
import Road from './Road.jsx'
import Scooter from './Scooter.jsx'
import Landmarks from './Landmarks.jsx'
import Rig, { Monitor } from './Rig.jsx'
import { useStore } from '../store.js'

/* The WebGL scene. This file and everything it imports is loaded as a
   separate chunk after the page's text is already readable. */
export default function Scene() {
  const tier = useStore((s) => s.tier)
  const inRide = useStore((s) => s.inRide)
  const ready = useStore((s) => s.ready)

  // Renderer options are fixed at creation; quality changes after that go through dpr and effects.
  const gl = useMemo(() => ({ antialias: tier !== 'low', powerPreference: 'high-performance' }), []) // eslint-disable-line react-hooks/exhaustive-deps
  const dpr = tier === 'high' ? [1, 1.75] : tier === 'medium' ? [1, 1.5] : 1

  return (
    <div className={`stage ${ready ? 'is-ready' : ''}`} aria-hidden="true">
      <Canvas
        flat
        dpr={dpr}
        gl={gl}
        camera={{ fov: 40, near: 0.3, far: 900, position: [0, 4, 14] }}
        frameloop={inRide ? 'always' : 'never'}
        onCreated={({ gl }) => {
          // If the graphics driver drops the context, fall back to the still backdrop
          // instead of leaving a frozen or blank canvas on screen.
          gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
            useStore.setState({ lost: true, ready: false })
          })
          useStore.setState({ ready: true })
        }}
      >
        <color attach="background" args={[C.ink]} />
        <fogExp2 attach="fog" args={[C.horizon, 0.0105]} />
        <World />
        <Road />
        <Scooter />
        <Landmarks />
        <Rig />
        <Monitor />
        {tier === 'high' && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.68} luminanceSmoothing={0.22} radius={0.72} />
            <Vignette offset={0.24} darkness={0.5} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
