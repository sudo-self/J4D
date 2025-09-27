'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Scene from '@/components/Scene'

// ==================== SMOKE ====================
function Smoke({
  position = [0, 0, 0],
  count = 400,
  color = '#0018F9',
  spread = 0.8,
  height = 3.0,
}: {
  position?: [number, number, number]
  count?: number
  color?: string
  spread?: number
  height?: number
}) {
  const particles = useRef<THREE.Points>(null)

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos.set([(Math.random() - 0.5) * spread, Math.random() * height, (Math.random() - 0.5) * spread], i * 3)
      vel[i] = 0.002 + Math.random() * 0.01
    }
    return { positions: pos, velocities: vel }
  }, [count, spread, height])

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
      <pointsMaterial color={color} size={0.05} transparent opacity={0.6} depthWrite={false} />
    </points>
  )
}

// ==================== PAGE ====================
export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [lightIntensity, setLightIntensity] = useState({ directional: 1.8, ambient: 1 })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setWindowSize({ width, height })
      setLightIntensity(width < 768 ? { directional: 2.0, ambient: 1.2 } : { directional: 1.9, ambient: 1.1 })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: windowSize.width || '100vw', height: windowSize.height || '100vh', overflow: 'hidden' }}>
      <Scene
        modelPosition={[1, -1.3, -2]}
        modelScale={2.0}
        modelRotationY={-4 * (Math.PI / 180)}
        floorPosition={[0, -0.6, 0]}
        backWallPosition={[0, 2, -5]}
        sideWallPosition={[5, 2, 0]}
        directionalLightPosition={[5, 12, 7]}
        directionalLightIntensity={lightIntensity.directional}
        ambientLightIntensity={lightIntensity.ambient}
      >
        <Smoke position={[1.8, 0.4, 1.7]} count={250} color="#0018F9" spread={0.6} height={2.0} />
        <Smoke position={[2.3, 0.9, 1.7]} count={250} color="#3399FF" spread={0.6} height={2.0} />
        <Smoke position={[2.5, 1.1, 1.7]} count={250} color="#3399FF" spread={0.6} height={1.0} />
      </Scene>
    </div>
  )
}









