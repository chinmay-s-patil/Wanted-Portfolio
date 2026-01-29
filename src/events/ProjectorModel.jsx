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
        loaderScript.onload = () => setGltfLoaderReady(true)
        loaderScript.onerror = () => {
          setGltfLoaderReady(true) // Continue with placeholder
          console.warn('GLTFLoader failed to load, using placeholder')
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
    const scene = new THREE.Scene()
    scene.background = null
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(3, 2, 4)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      premultipliedAlpha: false
    })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0)
    mainLight.position.set(5, 5, 5)
    mainLight.castShadow = true
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5)
    fillLight.position.set(-5, 0, -5)
    scene.add(fillLight)

    // Projector spotlight (for beam effect)
    const projectorLight = new THREE.SpotLight(0xffd700, 0)
    projectorLight.position.set(0, 0.5, 1)
    projectorLight.angle = Math.PI / 6
    projectorLight.penumbra = 0.3
    projectorLight.decay = 2
    projectorLight.distance = 10
    projectorLight.target.position.set(0, 0, -5)
    scene.add(projectorLight)
    scene.add(projectorLight.target)
    lightRef.current = projectorLight

    // Try to load GLTF model, fallback to placeholder
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
      
      // Gentle rotation when idle
      if (state === 'idle' && modelGroupRef.current) {
        modelGroupRef.current.rotation.y += 0.002
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current) return
      
      const width = mountRef.current.clientWidth
      const height = mountRef.current.clientHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
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
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      renderer.dispose()
    }
  }, [threeReady, gltfLoaderReady, state])

  // Load GLTF model function
  const loadGLTFModel = (THREE, scene) => {
    const loader = new THREE.GLTFLoader()
    
    // Try to load the actual projector model
    // NOTE: .stp files need to be converted to .gltf/.glb first
    // For now, using placeholder. To use real model, convert to GLTF
    loader.load(
      '/SectionModels/Old Projector/movieprojector.gltf', // You'll need to convert .stp to .gltf
      (gltf) => {
        const model = gltf.scene
        
        // RECOMMENDED SETTINGS FOR PROJECTOR MODEL:
        // Position: (0, 0, 0) - centered
        // Scale: uniform 0.01 to 0.1 depending on model units
        // Rotation: 
        //   - X: 0 (no pitch)
        //   - Y: Math.PI (180° to face forward)
        //   - Z: 0 (no roll)
        
        model.position.set(0, 0, 0)
        model.scale.set(0.05, 0.05, 0.05) // Adjust based on your model
        model.rotation.set(0, Math.PI, 0) // Face forward
        
        // Enable shadows
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            // Optional: adjust materials
            if (child.material) {
              child.material.metalness = 0.4
              child.material.roughness = 0.6
            }
          }
        })
        
        scene.add(model)
        modelGroupRef.current = model
        setIsLoading(false)
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded')
      },
      (error) => {
        console.warn('GLTF model not found, using placeholder:', error)
        // Fallback to placeholder
        const projectorGroup = createPlaceholderProjector(THREE)
        scene.add(projectorGroup)
        modelGroupRef.current = projectorGroup
        setIsLoading(false)
      }
    )
  }

  // Update projector light intensity based on state
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.intensity = isOn ? 1.5 : 0
    }
  }, [isOn])

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8b7355',
          fontSize: '0.9rem'
        }}>
          Initializing projector...
        </div>
      )}
      {loadError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ff6b6b',
          fontSize: '0.8rem',
          textAlign: 'center',
          padding: '1rem'
        }}>
          {loadError}
        </div>
      )}
    </div>
  )
}

// Helper function to create a placeholder projector
// function createPlaceholderProjector(THREE) {
//   const group = new THREE.Group()

//   // Projector body
//   const bodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 1)
//   const bodyMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0x2a2a2a,
//     metalness: 0.6,
//     roughness: 0.4
//   })
//   const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
//   body.castShadow = true
//   body.receiveShadow = true
//   group.add(body)

//   // Lens
//   const lensGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32)
//   const lensMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0x1a1a1a,
//     metalness: 0.9,
//     roughness: 0.1
//   })
//   const lens = new THREE.Mesh(lensGeometry, lensMaterial)
//   lens.rotation.z = Math.PI / 2
//   lens.position.set(0.85, 0, 0)
//   lens.castShadow = true
//   group.add(lens)

//   // Lens glass
//   const glassGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32)
//   const glassMaterial = new THREE.MeshPhysicalMaterial({ 
//     color: 0x88ccff,
//     metalness: 0,
//     roughness: 0.1,
//     transmission: 0.9,
//     thickness: 0.5
//   })
//   const glass = new THREE.Mesh(glassGeometry, glassMaterial)
//   glass.rotation.z = Math.PI / 2
//   glass.position.set(0.95, 0, 0)
//   group.add(glass)

//   // Film reels (top and bottom)
//   const reelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32)
//   const reelMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0x3d2817,
//     metalness: 0.3,
//     roughness: 0.7
//   })
  
//   const topReel = new THREE.Mesh(reelGeometry, reelMaterial)
//   topReel.position.set(-0.3, 0.6, 0)
//   topReel.castShadow = true
//   group.add(topReel)

//   const bottomReel = new THREE.Mesh(reelGeometry, reelMaterial)
//   bottomReel.position.set(-0.3, -0.6, 0)
//   bottomReel.castShadow = true
//   group.add(bottomReel)

//   // Base
//   const baseGeometry = new THREE.BoxGeometry(1.8, 0.1, 1.2)
//   const baseMaterial = new THREE.MeshStandardMaterial({ 
//     color: 0x1a1a1a,
//     metalness: 0.8,
//     roughness: 0.5
//   })
//   const base = new THREE.Mesh(baseGeometry, baseMaterial)
//   base.position.y = -0.45
//   base.receiveShadow = true
//   group.add(base)

//   return group
// }