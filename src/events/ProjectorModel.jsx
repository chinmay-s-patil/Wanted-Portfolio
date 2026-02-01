// src/events/ProjectorModel.jsx
import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

export default function ProjectorModel({ isOn = false, state = 'idle', modelPath = '/movieprojector.gltf' }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const cameraRef = useRef(null)
  const modelGroupRef = useRef(null)
  const lightRef = useRef(null)
  const reelsRef = useRef([])
  const frameIdRef = useRef(null)
  
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)

  // Multiple paths to try for the GLTF model - prioritize the provided modelPath
  const MODEL_PATHS = [
    modelPath,
    '/movieprojector.gltf',
    '/SectionModels/Old Projector/movieprojector.gltf',
    './movieprojector.gltf',
    './SectionModels/Old Projector/movieprojector.gltf',
    '/public/movieprojector.gltf',
    '/public/SectionModels/Old Projector/movieprojector.gltf'
  ]

  // Cleanup function
  const cleanup = useCallback(() => {
    if (frameIdRef.current) {
      cancelAnimationFrame(frameIdRef.current)
    }
    if (rendererRef.current && mountRef.current) {
      rendererRef.current.dispose()
      if (rendererRef.current.domElement && mountRef.current.contains(rendererRef.current.domElement)) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
    }
    sceneRef.current = null
    rendererRef.current = null
    cameraRef.current = null
    modelGroupRef.current = null
    reelsRef.current = []
  }, [])

  useEffect(() => {
    let isActive = true
    
    const init = async () => {
      try {
        // Verify WebGL support
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (!gl) {
          throw new Error('WebGL not supported')
        }

        if (!mountRef.current) return
        
        // Scene setup
        const scene = new THREE.Scene()
        sceneRef.current = scene
        
        // Camera setup
        const camera = new THREE.PerspectiveCamera(
          45, 
          mountRef.current.clientWidth / mountRef.current.clientHeight, 
          0.1, 
          1000
        )
        camera.position.set(3, 2, 5)
        cameraRef.current = camera
        
        // Renderer with transparency
        const renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance"
        })
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1.2
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        mountRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer
        
        // Lighting setup for vintage projector
        const ambientLight = new THREE.AmbientLight(0xffecd1, 0.3)
        scene.add(ambientLight)
        
        const mainLight = new THREE.DirectionalLight(0xffecd1, 1.2)
        mainLight.position.set(5, 5, 5)
        mainLight.castShadow = true
        mainLight.shadow.mapSize.width = 1024
        mainLight.shadow.mapSize.height = 1024
        scene.add(mainLight)
        
        // Rim light for metallic edges
        const rimLight = new THREE.SpotLight(0x00E0FF, 0.8)
        rimLight.position.set(-3, 2, -3)
        rimLight.lookAt(0, 0, 0)
        scene.add(rimLight)
        
        // Projector spotlight (the beam)
        const spotLight = new THREE.SpotLight(0xffd700, 0)
        spotLight.position.set(0.8, 0, 1.5)
        spotLight.target.position.set(0, 0, 10)
        spotLight.angle = Math.PI / 5
        spotLight.penumbra = 0.4
        spotLight.distance = 25
        spotLight.castShadow = true
        scene.add(spotLight)
        scene.add(spotLight.target)
        lightRef.current = spotLight
        
        // Try loading GLTF model with multiple paths
        let gltfLoaded = false
        
        const tryLoadGLTF = async (pathIndex = 0) => {
          if (pathIndex >= MODEL_PATHS.length) {
            console.log('[ProjectorModel] All GLTF paths failed, using procedural fallback')
            return false
          }

          const currentPath = MODEL_PATHS[pathIndex]
          
          try {
            const loader = new GLTFLoader()
            
            // Setup DRACO for compressed models
            const dracoLoader = new DRACOLoader()
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
            loader.setDRACOLoader(dracoLoader)
            
            console.log(`[ProjectorModel] Attempt ${pathIndex + 1}/${MODEL_PATHS.length}: Loading ${currentPath}`)
            setLoadAttempt(pathIndex + 1)
            
            const gltf = await new Promise((resolve, reject) => {
              loader.load(
                currentPath,
                resolve,
                (progress) => {
                  const percent = (progress.loaded / progress.total) * 100
                  console.log(`[ProjectorModel] ${currentPath}: ${percent.toFixed(1)}%`)
                },
                (err) => reject(new Error(`Failed: ${err.message}`))
              )
            })
            
            if (!isActive) return false
            
            const model = gltf.scene
            
            // Auto-calculate bounding box and center
            const box = new THREE.Box3().setFromObject(model)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            
            // Normalize scale to fit view
            const maxDim = Math.max(size.x, size.y, size.z)
            const scale = 1.5 / maxDim
            model.scale.setScalar(scale)
            
            // Center the model
            model.position.sub(center.multiplyScalar(scale))
            model.position.y -= 0.8 // Lower slightly
            model.rotation.y = -Math.PI / 2
            
            // Enable shadows
            model.traverse((child) => {
              if (child.isMesh) {
                child.castShadow = true
                child.receiveShadow = true
                
                // Enhance materials
                if (child.material) {
                  child.material.metalness = Math.max(child.material.metalness, 0.6)
                  child.material.roughness = Math.min(child.material.roughness, 0.7)
                  child.material.envMapIntensity = 1.5
                }
              }
            })
            
            scene.add(model)
            modelGroupRef.current = model
            
            console.log(`[ProjectorModel] ✓ GLTF loaded successfully from ${currentPath}`)
            
            // Identify reel objects for animation
            model.traverse((child) => {
              const name = child.name.toLowerCase()
              if (name.includes('reel') || name.includes('spool') || name.includes('film')) {
                reelsRef.current.push(child)
                console.log(`[ProjectorModel] Found reel: ${child.name}`)
              }
            })
            
            return true
            
          } catch (gltfError) {
            console.warn(`[ProjectorModel] Path ${pathIndex + 1} failed:`, gltfError.message)
            // Try next path
            return tryLoadGLTF(pathIndex + 1)
          }
        }
        
        gltfLoaded = await tryLoadGLTF(0)
        
        // Procedural fallback if all GLTF attempts failed
        if (!gltfLoaded) {
          console.log('[ProjectorModel] Generating procedural projector...')
          const fallbackModel = createProceduralProjector()
          scene.add(fallbackModel)
          modelGroupRef.current = fallbackModel
          
          // Identify reels in procedural model
          fallbackModel.traverse((child) => {
            if (child.name?.includes('reel')) {
              reelsRef.current.push(child)
            }
          })
        }
        
        setModelLoaded(true)
        setLoading(false)
        
        // Animation loop
        const animate = () => {
          if (!isActive) return
          frameIdRef.current = requestAnimationFrame(animate)
          
          const delta = 0.016 // approximate delta
          const time = Date.now() * 0.001
          
          if (modelGroupRef.current) {
            // Smooth state transitions
            const targetZ = state === 'projecting' ? -1.5 : state === 'open' ? -2.5 : 0
            const targetScale = state === 'open' ? 0.7 : state === 'projecting' ? 0.85 : 1.0
            
            modelGroupRef.current.position.z += (targetZ - modelGroupRef.current.position.z) * 0.05
            
            const currentScale = modelGroupRef.current.scale.x
            const newScale = currentScale + (targetScale - currentScale) * 0.05
            modelGroupRef.current.scale.set(newScale, newScale, newScale)
            
            // Subtle idle rotation
            if (state === 'idle') {
              modelGroupRef.current.rotation.y = -Math.PI / 2 + Math.sin(time * 0.5) * 0.05
            }
            
            // Rotate reels when projecting
            if (reelsRef.current.length > 0 && isOn) {
              reelsRef.current.forEach((reel, i) => {
                if (reel) {
                  const direction = i % 2 === 0 ? 1 : -1
                  reel.rotation.z -= 2.0 * delta * direction
                }
              })
            }
          }
          
          // Dynamic spotlight intensity with flicker effect
          if (lightRef.current) {
            let targetIntensity = 0
            if (isOn) {
              targetIntensity = state === 'open' ? 2.5 : 2.0
              // Add subtle flicker
              targetIntensity += Math.sin(time * 20) * 0.1 + Math.sin(time * 45) * 0.05
            }
            lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 0.1
          }
          
          renderer.render(scene, camera)
        }
        
        animate()
        
      } catch (err) {
        console.error('[ProjectorModel] Initialization error:', err)
        setError(err.message)
        setLoading(false)
      }
    }
    
    init()
    
    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current) return
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(width, height)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      isActive = false
      window.removeEventListener('resize', handleResize)
      cleanup()
    }
  }, [cleanup])

  // Update state animations when props change
  useEffect(() => {
    // This runs when isOn or state changes, handled in animation loop
  }, [isOn, state])

  const createProceduralProjector = () => {
    const group = new THREE.Group()
    
    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0x3d2817, 
      metalness: 0.7, 
      roughness: 0.3,
      name: 'body'
    })
    
    const metalMat = new THREE.MeshStandardMaterial({ 
      color: 0x5a5a5a, 
      metalness: 0.9, 
      roughness: 0.2 
    })
    
    const goldMat = new THREE.MeshStandardMaterial({ 
      color: 0x8b6914, 
      metalness: 0.8, 
      roughness: 0.3,
      emissive: 0x000000
    })
    
    // Main chassis
    const chassisGeo = new THREE.BoxGeometry(2.2, 1.4, 1.6)
    const chassis = new THREE.Mesh(chassisGeo, bodyMat)
    chassis.position.y = 0.2
    chassis.castShadow = true
    chassis.receiveShadow = true
    group.add(chassis)
    
    // Lens assembly
    const lensHousingGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.2, 32)
    const lensHousing = new THREE.Mesh(lensHousingGeo, metalMat)
    lensHousing.rotation.z = Math.PI / 2
    lensHousing.position.set(1.4, 0.2, 0)
    lensHousing.castShadow = true
    group.add(lensHousing)
    
    // Lens glass
    const lensGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.1, 32)
    const lensMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x88ccff, 
      transmission: 0.9,
      opacity: 1,
      metalness: 0,
      roughness: 0,
      ior: 1.5,
      thickness: 0.5
    })
    const lens = new THREE.Mesh(lensGeo, lensMat)
    lens.rotation.z = Math.PI / 2
    lens.position.set(2.05, 0.2, 0)
    group.add(lens)
    
    // Film reels
    const createReel = (yPos, name) => {
      const reelGroup = new THREE.Group()
      reelGroup.position.set(-0.4, yPos, 0)
      reelGroup.name = name
      
      // Outer rim
      const rimGeo = new THREE.TorusGeometry(0.5, 0.08, 16, 64)
      const rim = new THREE.Mesh(rimGeo, goldMat)
      reelGroup.add(rim)
      
      // Center hub
      const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16)
      const hub = new THREE.Mesh(hubGeo, metalMat)
      hub.rotation.x = Math.PI / 2
      reelGroup.add(hub)
      
      // spokes
      for (let i = 0; i < 5; i++) {
        const spokeGeo = new THREE.BoxGeometry(0.6, 0.04, 0.04)
        const spoke = new THREE.Mesh(spokeGeo, goldMat)
        spoke.rotation.z = (i / 5) * Math.PI
        spoke.rotation.x = Math.PI / 2
        reelGroup.add(spoke)
      }
      
      return reelGroup
    }
    
    const topReel = createReel(1.0, 'reel_top')
    const bottomReel = createReel(-0.6, 'reel_bottom')
    group.add(topReel)
    group.add(bottomReel)
    
    // Control knobs
    const knobGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.25, 16)
    const knob1 = new THREE.Mesh(knobGeo, metalMat)
    knob1.rotation.z = Math.PI / 2
    knob1.position.set(0.6, -0.3, 0.7)
    group.add(knob1)
    
    const knob2 = new THREE.Mesh(knobGeo, metalMat)
    knob2.rotation.z = Math.PI / 2
    knob2.position.set(0.2, -0.3, 0.7)
    group.add(knob2)
    
    // Vents
    for (let i = 0; i < 3; i++) {
      const ventGeo = new THREE.BoxGeometry(0.8, 0.02, 0.1)
      const vent = new THREE.Mesh(ventGeo, metalMat)
      vent.position.set(-0.2, 0.4 - (i * 0.15), 0.8)
      group.add(vent)
    }
    
    return group
  }

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff6b6b',
        background: 'rgba(0,0,0,0.5)',
        borderRadius: '12px',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
        border: '1px solid rgba(255,100,100,0.2)'
      }}>
        <div style={{ fontSize: '1.5rem' }}>⚠️</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8, fontFamily: 'monospace' }}>
          {error}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#666' }}>
          Using procedural fallback model
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#c4a574',
        fontSize: '0.9rem',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid rgba(196, 165, 116, 0.2)',
          borderTop: '3px solid #c4a574',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <style jsx>{`
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div style={{ fontFamily: 'monospace' }}>
          Loading projector...
          {loadAttempt > 0 && <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '4px' }}>
            Attempt {loadAttempt}/{MODEL_PATHS.length}
          </div>}
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        background: 'transparent',
        cursor: 'grab'
      }}
    />
  )
}