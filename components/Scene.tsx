// ==================== Scene.tsx ====================
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations, useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// 🔹 Preload GLTF for faster entry
useGLTF.preload('/j4final.glb')

// ==================== MODEL ====================
function Model({ position = [1.5, -0.1, -1.5], scale = 1, rotationY = 0 }) {
  const { scene, animations } = useGLTF('/j4final.glb')
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    Object.values(actions || {}).forEach(action => {
      action?.reset().setLoop(THREE.LoopRepeat, Infinity).fadeIn(0.5).play()
    })
  }, [actions])

  return <primitive object={scene} position={position} scale={scale} rotation-y={rotationY} />
}

// ==================== FLOOR ====================
function FloorBlock({ position = [0, -1, 0] }) {
  const [diffuse, normal, roughness, displacement] = useTexture([
    '/checkered_pavement_tiles_diff_1k.png',
    '/checkered_pavement_tiles_normal_1k.png',
    '/checkered_pavement_tiles_rough_1k.png',
    '/checkered_pavement_tiles_disp_1k.png',
  ])

  ;[diffuse, normal, roughness, displacement].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(5, 5)
  })

  return (
    <mesh position={position} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[9, 9, 32, 32]} />
      <meshStandardMaterial
        map={diffuse}
        normalMap={normal}
        roughnessMap={roughness}
        displacementMap={displacement}
        displacementScale={0.05}
      />
    </mesh>
  )
}

// ==================== SMOKE ====================
function Smoke({ position = [0, 0, 0], count = 600, height = 2 }) {
  const particles = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(Math.random() - 0.5) * 0.6, Math.random() * height, (Math.random() - 0.5) * 0.6], i * 3)
      vel[i] = 0.002 + Math.random() * 0.01
    }
    return { positions: pos, velocities: vel }
  }, [count, height])

  useFrame(() => {
    if (!particles.current) return
    const arr = particles.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += velocities[i]
      if (arr[i * 3 + 1] > height) arr[i * 3 + 1] = 0
    }
    particles.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particles} position={position as [number, number, number]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#3399FF" size={0.05} transparent opacity={0.6} depthWrite={false} />
    </points>
  )
}

// ==================== SCENE ====================
export default function Scene({
  modelPosition,
  modelScale,
  modelRotationY,
  floorPosition,
  children,
}: {
  modelPosition?: [number, number, number]
  modelScale?: number
  modelRotationY?: number
  floorPosition?: [number, number, number]
  children?: React.ReactNode
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]} // limits render resolution on high DPI
      camera={{ position: [-8, 5, 8], fov: 60 }}
      gl={{ antialias: false }}
      onCreated={({ gl }) => gl.setClearColor(0x000000)}
    >
      {/* Lights */}
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[5, 10, 7]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Objects */}
      <Suspense fallback={null}>
        <Model
          position={modelPosition ?? [1.5, -0.1, -1.5]}
          scale={modelScale ?? 2}
          rotationY={modelRotationY ?? 0}
        />
        <FloorBlock position={floorPosition ?? [0, -0.5, 0]} />
      </Suspense>

      {/* Effects */}
      <Smoke position={[2, 0.5, 1.7]} />

      {children}

      {/* Camera controls */}
      <OrbitControls enableDamping target={[-0.7, 0.5, -0.5]} />
    </Canvas>
  )
}

