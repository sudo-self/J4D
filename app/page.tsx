'use client'

import { useState, useEffect } from 'react'
import Scene from '@/components/Scene'

export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ width: windowSize.width, height: windowSize.height }}>
      <Scene
        modelPosition={[1, -0.5, -2]}
        modelScale={2.0}
        modelRotationY={-4 * (Math.PI / 180)}
        floorPosition={[0, -0.6, 0]}
        backWallPosition={[0, 2, -5]}
        sideWallPosition={[5, 2, 0]}
        directionalLightPosition={[5, 12, 7]}
        directionalLightIntensity={1.8}
        ambientLightIntensity={1}
      />
    </div>
  )
}


