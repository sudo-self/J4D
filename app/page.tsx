'use client'

import { useState, useEffect } from 'react'
import Scene from '@/components/Scene'

export default function Home() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [lightIntensity, setLightIntensity] = useState({ directional: 1.8, ambient: 1 })

  useEffect(() => {
    function handleResize() {
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
    <div style={{ width: windowSize.width, height: windowSize.height }}>
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
      />
    </div>
  )
}



