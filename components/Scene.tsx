'use client'

import { Canvas, useLoader, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei'
import { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'

interface SceneProps {
  modelPosition?: [number, number, number]
  modelScale?: number
  modelRotationY?: number
  floorPosition?: [number, number, number]
  backWallPosition?: [number, number, number]
  sideWallPosition?: [number, number, number]
  directionalLightPosition?: [number, number, number]
  directionalLightIntensity?: number
  ambientLightIntensity?: number
}

function Model({
  position,
  scale = 1,
  rotationY = 0,
}: {
  position?: [number, number, number]
  scale?: number
  rotationY?: number
}) {
  const pos: [number, number, number] = position ?? [1.5, -0.1, -1.5]
  const gltf = useGLTF('/j4d.glb')
  const { actions } = useAnimations(gltf.animations, gltf.scene)

  useEffect(() => {
    if (actions) {
      Object.values(actions).forEach(action => {
        if (action) {
          action.reset()
          action.setLoop(THREE.LoopRepeat, Infinity)
          action.fadeIn(0.5)
          action.play()
        }
      })
    }
  }, [actions])

  return (
    <primitive
      object={gltf.scene}
      position={pos}
      scale={scale}
      rotation-y={rotationY}
    />
  )
}


  return (
    <primitive
      object={gltf.scene}
      position={pos}
      scale={scale}
      rotation-y={rotationY}
    />
  )
}

function Rope({
  start,
  end,
  radius = 0.03,
  color = '#F5F507',
}: {
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
  color?: string
}) {
  const dir = new THREE.Vector3(...end).sub(new THREE.Vector3(...start))
  const length = dir.length()
  const mid = new THREE.Vector3(...start).add(dir.multiplyScalar(0.5))
  const axis = new THREE.Vector3(0, 1, 0)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, dir.clone().normalize())

  return (
    <mesh position={mid.toArray() as [number, number, number]} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  )
}

function FloorBlock({ position }: { position?: [number, number, number] }) {
  const pos: [number, number, number] = position ?? [0, -1, 0]

  const diffuse = useLoader(THREE.TextureLoader, '/checkered_pavement_tiles_diff_1k.png')
  const normal = useLoader(THREE.TextureLoader, '/checkered_pavement_tiles_normal_1k.png')
  const roughness = useLoader(THREE.TextureLoader, '/checkered_pavement_tiles_rough_1k.png')
  const displacement = useLoader(THREE.TextureLoader, '/checkered_pavement_tiles_disp_1k.png')

  ;[diffuse, normal, roughness, displacement].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(5, 5)
  })

  const stepHeight = 0.05
  const stepDepth = 10
  const stepWidth = 10
  const floorSize = 9

  const floorEdges: { start: [number, number, number]; end: [number, number, number] }[] = [
    { start: [-floorSize / 2, stepHeight + 0.03, floorSize / 2], end: [floorSize / 2, stepHeight + 0.03, floorSize / 2] },
    { start: [-floorSize / 2, stepHeight + 0.03, -floorSize / 2], end: [floorSize / 2, stepHeight + 0.03, -floorSize / 2] },
    { start: [floorSize / 2, stepHeight + 0.03, -floorSize / 2], end: [floorSize / 2, stepHeight + 0.03, floorSize / 2] },
    { start: [-floorSize / 2, stepHeight + 0.03, -floorSize / 2], end: [-floorSize / 2, stepHeight + 0.03, floorSize / 2] },
  ]

  return (
    <group position={pos}>
      {[2, 1, 0].map(i => (
        <mesh key={i} position={[0, -stepHeight * i, 0] as [number, number, number]} receiveShadow castShadow>
          <boxGeometry args={[stepWidth * (0.9 + i * 0.05), stepHeight, stepDepth * (0.9 + i * 0.05)]} />
          <meshStandardMaterial color={`#${(7 + i).toString().repeat(3)}`} />
        </mesh>
      ))}

      <mesh rotation-x={-Math.PI / 2} position={[0, stepHeight * 0.5, 0] as [number, number, number]} receiveShadow castShadow>
        <planeGeometry args={[floorSize, floorSize, 32, 32]} />
        <meshStandardMaterial
          map={diffuse}
          normalMap={normal}
          roughnessMap={roughness}
          displacementMap={displacement}
          displacementScale={0.05}
        />
      </mesh>

      {floorEdges.map((edge, idx) => (
        <Rope key={idx} start={edge.start} end={edge.end} />
      ))}
    </group>
  )
}

function Wall({ position, rotationY = 0 }: { position?: [number, number, number]; rotationY?: number }) {
  const pos: [number, number, number] = position ?? [0, 2.5, -5]

  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useLoader(THREE.TextureLoader, '/wall.jpg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1, 1)

  const material = useRef(
    new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 }, texture1: { value: texture } },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform sampler2D texture1;
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec2 uv = vUv;
          uv += 0.015 * vec2(sin(time + uv.y * 8.0), cos(time + uv.x * 8.0));
          uv = clamp(uv, 0.0, 1.0);
          vec4 texColor = texture2D(texture1, uv);
          vec3 gold = vec3(1.0, 0.84, 0.0);
          gl_FragColor = vec4(mix(texColor.rgb, gold, 0.15), 1.0);
        }
      `,
      side: THREE.DoubleSide,
    })
  ).current

  useFrame(({ clock }) => {
    material.uniforms.time.value = clock.getElapsedTime()
  })

  const wallWidth = 10
  const wallHeight = 5
  const trimOffset = 0.05

  const wallTrims: { start: [number, number, number]; end: [number, number, number] }[] = [
    { start: [-wallWidth / 2, wallHeight / 2 - trimOffset, 0], end: [wallWidth / 2, wallHeight / 2 - trimOffset, 0] },
    { start: [-wallWidth / 2, -wallHeight / 2 + trimOffset, 0], end: [wallWidth / 2, -wallHeight / 2 + trimOffset, 0] },
  ]

  const verticalRopes: { start: [number, number, number]; end: [number, number, number] }[] = [
    { start: [-wallWidth / 2, -wallHeight / 2 + trimOffset, 0], end: [-wallWidth / 2, wallHeight / 2 - trimOffset, 0] },
    { start: [wallWidth / 2, -wallHeight / 2 + trimOffset, 0], end: [wallWidth / 2, wallHeight / 2 - trimOffset, 0] },
  ]

  return (
    <group position={pos} rotation-y={rotationY}>
      <mesh ref={meshRef} receiveShadow>
        <planeGeometry args={[wallWidth, wallHeight]} />
        <primitive object={material} attach="material" />
      </mesh>

      {wallTrims.map((trim, idx) => (
        <Rope key={`trim-${idx}`} start={trim.start} end={trim.end} />
      ))}
      {verticalRopes.map((rope, idx) => (
        <Rope key={`vert-${idx}`} start={rope.start} end={rope.end} />
      ))}
    </group>
  )
}

export default function Scene({
  modelPosition,
  modelScale,
  modelRotationY,
  floorPosition,
  backWallPosition,
  sideWallPosition,
  directionalLightPosition,
  directionalLightIntensity,
  ambientLightIntensity,
}: SceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [-8, 5, 8], fov: 60 }}
      gl={{ antialias: true }}
      onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000))}
    >
      <ambientLight intensity={ambientLightIntensity ?? 1.2} />
      <directionalLight
        position={directionalLightPosition ?? [5, 10, 7]}
        intensity={directionalLightIntensity ?? 2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-5, 5, 5]} intensity={1} color={0xffffff} />
      <directionalLight position={[0, 5, -5]} intensity={0.8} color={0xffffff} />

      <FloorBlock position={floorPosition ?? [0, -0.5, 0]} />
      <Wall position={backWallPosition ?? [0, 2.5, -5]} />
      <Wall position={sideWallPosition ?? [5, 2.5, 0]} rotationY={Math.PI / 2} />

      <Suspense fallback={null}>
        <Model
          position={modelPosition ?? [1.5, -0.1, -1.5]}
          scale={modelScale}
          rotationY={modelRotationY}
        />
      </Suspense>

      <OrbitControls enableDamping target={[-0.7, 0.5, -0.5]} />
    </Canvas>
  )
}



