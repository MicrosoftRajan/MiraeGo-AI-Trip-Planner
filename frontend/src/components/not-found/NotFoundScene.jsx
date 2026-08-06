import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'

const FONT_URL = '/fonts/helvetiker_regular.typeface.json'

function FloatingFourOhFour({ reduceMotion }) {
  const group = useRef(null)
  const t0 = useRef(performance.now())

  useFrame(() => {
    if (!group.current || reduceMotion) return
    const t = (performance.now() - t0.current) / 1000
    group.current.position.y = Math.sin(t * 0.7) * 0.18
    group.current.rotation.y = Math.sin(t * 0.35) * 0.12
    group.current.rotation.x = Math.sin(t * 0.28) * 0.04
  })

  return (
    <group ref={group} position={[0, 0.4, 0]}>
      <Center>
        <Text3D
          font={FONT_URL}
          size={1.35}
          height={0.28}
          curveSegments={8}
          bevelEnabled
          bevelThickness={0.04}
          bevelSize={0.025}
          bevelOffset={0}
          bevelSegments={3}
          letterSpacing={0.06}
        >
          404
          <meshStandardMaterial
            color="#f2ebe0"
            roughness={0.55}
            metalness={0.08}
            emissive="#c4a574"
            emissiveIntensity={0.12}
          />
        </Text3D>
      </Center>
    </group>
  )
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.45} color="#fff4e8" />
      {/* Warm key from upper-left to match the photo */}
      <directionalLight
        position={[-6, 5, 4]}
        intensity={1.35}
        color="#ffd7a8"
        castShadow={false}
      />
      <directionalLight position={[4, 1, -2]} intensity={0.35} color="#b8c4d4" />
    </>
  )
}

export default function NotFoundScene() {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduceMotion(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const camera = useMemo(
    () => ({ position: [0, 0.2, 6.2], fov: 42, near: 0.1, far: 40 }),
    [],
  )

  return (
    <Canvas
      className="!absolute inset-0 h-full w-full"
      style={{ background: 'transparent' }}
      camera={camera}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0)
      }}
    >
      <SceneLights />
      <Suspense fallback={null}>
        <FloatingFourOhFour reduceMotion={reduceMotion} />
      </Suspense>
    </Canvas>
  )
}
