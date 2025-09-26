'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import Scene from '@/components/Scene'
import * as THREE from 'three'


function Smoke({ position = [0, 0, 0], count = 150 }: { position?: [number, number, number]; count?: number }) {
  const particles = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 0.1 // x
      arr[i * 3 + 1] = Math.random() * 0.5         // y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.1 // z
    }
    return arr
  }, [count])

  const velocities = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) arr[i] = 0.01 + Math.random() * 0.01
    return arr
  }, [count])

  useFrame(() => {
    if (!particles.current) return
    const posArray = particles.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += velocities[i] // rise
      if (posArray[i * 3 + 1] > 1) posArray[i * 3 + 1] = 0 // reset
    }
    particles.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={particles} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.05} transparent opacity={0.6} depthWrite={false} />
    </points>
  )
}

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
    <div
      style={{
        width: windowSize.width || '100vw',
        height: windowSize.height || '100vh',
        overflow: 'hidden',
      }}
    >
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
        {/* Smoke at the tip of the model */}
        <Smoke position={[1, 0.5, -5]} count={200} />
      </Scene>
    </div>
  )
}





