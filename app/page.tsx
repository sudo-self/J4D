'use client';

import { useState, useEffect, useRef, useMemo } from 'react'
import Scene from '@/components/Scene'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ==================== WATER ====================
function Smoke({
  position = [10, 1, -6],
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

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * spread 
      arr[i * 3 + 1] = Math.random() * height         
      arr[i * 3 + 2] = (Math.random() - 0.5) * spread 
    }
    return arr
  }, [count, spread, height])

  const velocities = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = 0.001 + Math.random() * 0.01
    return arr
  }, [count])

  useFrame(() => {
    if (!particles.current) return
    const posArray = particles.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += velocities[i]
      if (posArray[i * 3 + 1] > height) posArray[i * 3 + 1] = 0
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

// ==================== PAGE.TSX ====================

export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [lightIntensity, setLightIntensity] = useState({ directional: 1.8, ambient: 1 })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setWindowSize({ width, height })

      if (width < 768) {
        setLightIntensity({ directional: 2.0, ambient: 1.2 })
      } else {
        setLightIntensity({ directional: 1.9, ambient: 1.1 })
      }
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
    
        <Smoke position={[1.8, 0.4, 1.7]} count={250} color="#0018F9" spread={0.60} height={2.0} />
        <Smoke position={[2.3, 0.9, 1.7]} count={250} color="#3399FF" spread={0.60} height={2.0} />
        <Smoke position={[2.5, 1.1, 1.7]} count={250} color="#3399FF" spread={0.60} height={1.0} />
      </Scene>
    </div>
  )
}








