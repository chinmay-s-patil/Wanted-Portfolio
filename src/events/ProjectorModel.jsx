// src/events/ProjectorModel.jsx
import { useRef, useEffect, useState } from 'react'

export default function ProjectorModel({ isOn = false, state = 'idle' }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const modelGroupRef = useRef(null)
  const lightRef = useRef(null)
  const animationRef = useRef(null)
  const [threeReady, setThreeReady] = useState(false)
  const [gltfLoaderReady, setGltfLoaderReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Load Three.js and GLTFLoader
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadThreeJS = async () => {
      if (!window.THREE) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.async = true
        script.onload = () => {
          setThreeReady(true)
          loadGLTFLoader()
        }
        script.onerror = () => setLoadError('Failed to load Three.js')
        document.head.appendChild(script)
      } else {
        setThreeReady(true)
        loadGLTFLoader()
      }
    }

    const loadGLTFLoader = () => {
      if (!window.THREE.GLTFLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
        loaderScript.async = true
        loaderScript.onload = () => setGltfLoaderReady(true)
        loaderScript.onerror = () => {
          setGltfLoaderReady(true)
          console.warn('GLTFLoader failed, using placeholder')
        }
        document.head.appendChild(loaderScript)
      } else {
        setGltfLoaderReady(true)
      }
    }

    loadThreeJS()
  }, [])

  // Scene setup
  useEffect(() => {
    if (!threeReady || !gltfLoaderReady || !mountRef.current) return

    const THREE = window.THREE
    
    // Scene setup - CRITICAL: No background color for transparency
    const scene = new THREE.Scene()
    scene.background = null  // This ensures transparency
    sceneRef.current = scene

    const width = mountRef.current.clientWidth
    const height = mountRef.current.clientHeight

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(3, 2, 4)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,  // CRITICAL: Enable alpha channel
      premultipliedAlpha: false  // CRITICAL: For proper transparency blending
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)  // CRITICAL: Transparent clear color
    
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd1, 0.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffecd1, 0.8)
    mainLight.position.set(5, 5, 5)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 1024
    mainLight.shadow.mapSize.height = 1024
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0x8b7355, 0.4)
    fillLight.position.set(-5, 0, -5)
    scene.add(fillLight)

    // Projector spotlight (warm golden hue)
    const projectorLight = new THREE.SpotLight(0xffd700, 0)
    projectorLight.position.set(0, 0.3, 0.8)
    projectorLight.angle = Math.PI / 5
    projectorLight.penumbra = 0.4
    projectorLight.decay = 2
    projectorLight.distance = 15
    projectorLight.target.position.set(0, 0, -5)
    projectorLight.castShadow = true
    scene.add(projectorLight)
    scene.add(projectorLight.target)
    lightRef.current = projectorLight

    // Load model or create placeholder
    if (window.THREE.GLTFLoader) {
      loadGLTFModel(THREE, scene)
    } else {
      const projectorGroup = createPlaceholderProjector(THREE)
      scene.add(projectorGroup)
      modelGroupRef.current = projectorGroup
      setIsLoading(false)
    }

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      
      if (modelGroupRef.current) {
        // Idle rotation
        if (state === 'idle') {
          modelGroupRef.current.rotation.y += 0.002
        }
        // Smooth backing away animation based on state
        const targetZ = state === 'projecting' ? -1.5 : state === 'open' ? -2 : 0
        const targetScale = state === 'projecting' ? 0.92 : state === 'open' ? 0.85 : 1
        const targetOpacity = state === 'projecting' ? 0.6 : state === 'open' ? 0.4 : 1
        
        modelGroupRef.current.position.z += (targetZ - modelGroupRef.current.position.z) * 0.1
        const currentScale = modelGroupRef.current.scale.x
        const newScale = currentScale + (targetScale - currentScale) * 0.1
        modelGroupRef.current.scale.set(newScale, newScale, newScale)
      }
      
      // Pulsing light effect when on
      if (lightRef.current && isOn) {
        const baseIntensity = state === 'open' ? 0.8 : 1.5
        lightRef.current.intensity = baseIntensity + Math.sin(Date.now() * 0.003) * 0.2
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return
      const w = mountRef.current.clientWidth
      const h = mountRef.current.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose())
          } else {
            object.material.dispose()
          }
          if (object.material.map) object.material.map.dispose()
        }
      })
      renderer.dispose()
    }
  }, [threeReady, gltfLoaderReady, state, isOn])

  const loadGLTFModel = (THREE, scene) => {
    const loader = new THREE.GLTFLoader()
    
    loader.load(
      '/SectionModels/Old Projector/movieprojector.gltf',
      (gltf) => {
        const model = gltf.scene
        model.position.set(0, -0.5, 0)
        model.scale.set(1.2, 1.2, 1.2)
        model.rotation.set(0, Math.PI, 0)
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            if (child.material) {
              child.material.metalness = 0.3
              child.material.roughness = 0.7
              child.material.envMapIntensity = 1
            }
          }
        })
        
        scene.add(model)
        modelGroupRef.current = model
        setIsLoading(false)
      },
      undefined,
      (error) => {
        console.warn('GLTF load failed, using placeholder:', error)
        const projectorGroup = createPlaceholderProjector(THREE)
        scene.add(projectorGroup)
        modelGroupRef.current = projectorGroup
        setIsLoading(false)
      }
    )
  }

  const createPlaceholderProjector = (THREE) => {
    const group = new THREE.Group()

    // Vintage projector body
    const bodyGeometry = new THREE.BoxGeometry(1.6, 0.9, 1.1)
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x3d2817,
      metalness: 0.4,
      roughness: 0.6
    })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.castShadow = true
    body.receiveShadow = true
    group.add(body)

    // Lens housing
    const lensHousingGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.4, 32)
    const lensHousingMat = new THREE.MeshStandardMaterial({ 
      color: 0x2a1a10,
      metalness: 0.6,
      roughness: 0.4
    })
    const lensHousing = new THREE.Mesh(lensHousingGeo, lensHousingMat)
    lensHousing.rotation.z = Math.PI / 2
    lensHousing.position.set(1, 0, 0)
    group.add(lensHousing)

    // Lens glass
    const glassGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32)
    const glassMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x88ccff,
      metalness: 0,
      roughness: 0,
      transmission: 0.9,
      thickness: 0.5,
      clearcoat: 1
    })
    const glass = new THREE.Mesh(glassGeo, glassMat)
    glass.rotation.z = Math.PI / 2
    glass.position.set(1.2, 0, 0)
    group.add(glass)

    // Film reels
    const reelGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.12, 32)
    const reelMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x8b6914,
      metalness: 0.5,
      roughness: 0.4
    })
    
    const topReel = new THREE.Mesh(reelGeometry, reelMaterial)
    topReel.position.set(-0.4, 0.7, 0)
    topReel.castShadow = true
    group.add(topReel)

    const bottomReel = new THREE.Mesh(reelGeometry, reelMaterial)
    bottomReel.position.set(-0.4, -0.7, 0)
    bottomReel.castShadow = true
    group.add(bottomReel)

    // Reel arms
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16)
    const armMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
    
    const topArm = new THREE.Mesh(armGeo, armMat)
    topArm.position.set(-0.4, 0.35, 0)
    group.add(topArm)
    
    const bottomArm = new THREE.Mesh(armGeo, armMat)
    bottomArm.position.set(-0.4, -0.35, 0)
    group.add(bottomArm)

    // Base
    const baseGeo = new THREE.BoxGeometry(2, 0.15, 1.4)
    const baseMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1410,
      metalness: 0.7,
      roughness: 0.5
    })
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.y = -0.52
    base.receiveShadow = true
    group.add(base)

    return group
  }

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative',
        background: 'transparent',  // CRITICAL: Transparent container
        overflow: 'hidden'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#c4a574',
          fontSize: '0.9rem',
          background: 'transparent',  // CRITICAL: No gray background
          pointerEvents: 'none',
          zIndex: 10
        }}>
          <div style={{
            background: 'rgba(26, 15, 8, 0.9)',
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: '2px solid #8b7355',
            backdropFilter: 'blur(4px)',
            fontFamily: "'Special Elite', monospace"
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                border: '2px solid #8b7355',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 0.5rem'
              }} />
              Initializing projector...
            </div>
          </div>
        </div>
      )}
      {loadError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          <div style={{
            background: 'rgba(40, 10, 10, 0.9)',
            padding: '1rem 2rem',
            borderRadius: '8px',
            border: '2px solid #ff6b6b',
            color: '#ff6b6b',
            fontSize: '0.8rem',
            textAlign: 'center'
          }}>
            ⚠️ {loadError}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}