import { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { C } from './materials.js'
import World from './World.jsx'
import Road from './Road.jsx'
import Scooter from './Scooter.jsx'
import Landmarks from './Landmarks.jsx'
import Rig, { Monitor } from './Rig.jsx'
import { reportContextLost, useStore } from '../store.js'

/* The WebGL scene. This file and everything it imports is loaded as a
   separate chunk, behind the intro screen. */
export default function Scene() {
  const tier = useStore((s) => s.tier)
  const inRide = useStore((s) => s.inRide)
  const ready = useStore((s) => s.ready)

  // Renderer options are fixed at creation; quality changes after that go through dpr, shadows and effects.
  const gl = useMemo(() => ({ antialias: true, powerPreference: 'high-performance' }), []) // eslint-disable-line react-hooks/exhaustive-deps
  const dpr = tier === 'high' ? [1, 1.6] : tier === 'medium' ? [1, 1.5] : 1

  return (
    <div className={`stage ${ready ? 'is-ready' : ''}`} aria-hidden="true">
      <Canvas
        shadows={tier === 'low' ? false : 'soft'}
        dpr={dpr}
        gl={gl}
        camera={{ fov: 44, near: 0.3, far: 900, position: [0, 3, 12] }}
        frameloop={inRide ? 'always' : 'never'}
        onCreated={({ gl: renderer }) => {
          // If the graphics driver drops the context, retry once at the lightest
          // quality, then fall back to the still backdrop rather than a frozen canvas.
          renderer.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
            reportContextLost()
          })
          useStore.setState({ ready: true })
        }}
      >
        <color attach="background" args={[C.haze]} />
        <fogExp2 attach="fog" args={[C.haze, 0.0092]} />
        <World />
        <Road />
        <Scooter />
        <Landmarks />
        <Rig />
        <Monitor />
        {tier === 'high' && (
          <EffectComposer multisampling={4}>
            <Bloom mipmapBlur intensity={0.7} luminanceThreshold={0.95} luminanceSmoothing={0.3} radius={0.72} />
            <Vignette offset={0.28} darkness={0.36} />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
