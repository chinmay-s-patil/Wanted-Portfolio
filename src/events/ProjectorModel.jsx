// ProjectorModel.jsx - Fixed Version
import { useRef, useEffect, useState } from 'react'

export default function ProjectorModel({ isOn = false, state = 'idle' }) {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let isActive = true
    let scene, camera, renderer, modelGroup, light, filmReels = []
    
    const init = async () => {
      try {
        // Load three.js if not present
        if (!window.THREE) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script')
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
            s.onload = resolve
            s.onerror = () => reject('Failed to load Three.js')
            document.head.appendChild(s)
          })
        }
        
        // Load GLTFLoader if not present (CRITICAL FIX)
        if (!window.THREE.GLTFLoader) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script')
            s.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
            s.onload = resolve
            s.onerror = () => reject('Failed to load GLTFLoader')
            document.head.appendChild(s)
          })
        }
        
        if (!isActive) return
        
        const THREE = window.THREE
        
        // Scene setup
        scene = new THREE.Scene()
        camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
        camera.position.set(3, 2, 5)
        
        // Renderer with transparency
        renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          premultipliedAlpha: false
        })
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0)
        mountRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer
        
        // Lighting
        const ambient = new THREE.AmbientLight(0xffecd1, 0.5)
        scene.add(ambient)
        
        const main = new THREE.DirectionalLight(0xffecd1, 1.0)
        main.position.set(5, 5, 5)
        scene.add(main)
        
        // Projector spotlight
        light = new THREE.SpotLight(0xffd700, 0)
        light.position.set(0.8, 0, 1.5)
        light.target.position.set(0, 0, 10)
        light.angle = Math.PI / 6
        light.penumbra = 0.5
        light.distance = 20
        scene.add(light)
        scene.add(light.target)
        
        // Try to load the model
        let modelLoaded = false
        try {
          // Try multiple possible paths (FIX FOR FILE LOCATION)
          const possiblePaths = [
            '/SectionModels/Old Projector/movieprojector.gltf',
            '/movieprojector.gltf',
            '/models/movieprojector.gltf',
            'movieprojector.gltf'
          ]
          
          // Since you mentioned movieprojector.txt is the GLTF data, 
          // you might need to change it to .gltf extension in your public folder
          
          const loader = new THREE.GLTFLoader()
          
          // Add a DRACOLoader if the model is compressed (optional but recommended)
          // const dracoLoader = new THREE.DRACOLoader()
          // dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/')
          // loader.setDRACOLoader(dracoLoader)
          
          for (const path of possiblePaths) {
            try {
              const gltf = await new Promise((resolve, reject) => {
                loader.load(
                  path,
                  resolve,
                  (progress) => {
                    console.log(`Loading model from ${path}:`, (progress.loaded / progress.total * 100) + '%')
                  },
                  reject
                )
              })
              
              modelGroup = gltf.scene
              modelGroup.position.set(0, -0.8, 0)
              modelGroup.scale.set(1.5, 1.5, 1.5)
              modelGroup.rotation.set(0, -Math.PI / 2, 0)
              scene.add(modelGroup)
              modelLoaded = true
              console.log(`Successfully loaded model from: ${path}`)
              break
            } catch (e) {
              console.warn(`Failed to load from ${path}:`, e.message)
              continue
            }
          }
        } catch (modelErr) {
          console.warn('Model loading failed, using fallback:', modelErr)
        }
        
        // Fallback: Create procedural vintage projector
        if (!modelLoaded) {
          console.log('Using procedural fallback model')
          modelGroup = createVintageProjector(THREE)
          scene.add(modelGroup)
        }
        
        // Store reels for animation
        modelGroup.traverse((child) => {
          if (child.name && child.name.toLowerCase().includes('reel')) {
            filmReels.push(child)
          }
        })
        
        setLoading(false)
        
        // Animation loop
        const animate = () => {
          if (!isActive) return
          requestAnimationFrame(animate)
          
          if (modelGroup) {
            // Smooth state transitions
            const targetZ = state === 'projecting' ? -1 : state === 'open' ? -2 : 0
            const targetScale = state === 'projecting' ? 0.9 : state === 'open' ? 0.7 : 1
            
            modelGroup.position.z += (targetZ - modelGroup.position.z) * 0.05
            
            const currentScale = modelGroup.scale.x
            const targetS = state === 'open' ? 0.7 : state === 'projecting' ? 0.85 : 1.0
            const newScale = currentScale + (targetS - currentScale) * 0.05
            modelGroup.scale.set(newScale, newScale, newScale)
            
            // Rotate reels when projecting
            if (filmReels.length > 0 && isOn) {
              filmReels.forEach((reel, i) => {
                reel.rotation.z -= 0.02 * (i % 2 === 0 ? 1 : -1)
              })
            }
          }
          
          // Dynamic spotlight
          if (light) {
            const targetIntensity = isOn ? (state === 'open' ? 2 : 1.8) : 0
            light.intensity += (targetIntensity - light.intensity) * 0.1
            
            if (isOn) {
              light.intensity += Math.sin(Date.now() * 0.002) * 0.1
            }
          }
          
          renderer.render(scene, camera)
        }
        animate()
        
      } catch (err) {
        console.error('Projector initialization error:', err)
        setError(err.message || 'Failed to initialize 3D scene')
        setLoading(false)
      }
    }
    
    init()
    
    // Resize handler
    const handleResize = () => {
      if (!camera || !renderer || !mountRef.current) return
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      isActive = false
      window.removeEventListener('resize', handleResize)
      if (renderer) {
        renderer.dispose()
        if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [state, isOn])
  
  // Procedural vintage projector generator
  const createVintageProjector = (THREE) => {
    const group = new THREE.Group()
    
    // Main body - vintage metal case
    const bodyGeo = new THREE.BoxGeometry(2, 1.2, 1.4)
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0x3d2817, 
      metalness: 0.6, 
      roughness: 0.4,
      name: 'body'
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.castShadow = true
    group.add(body)
    
    // Lens housing
    const lensHousingGeo = new THREE.CylinderGeometry(0.4, 0.5, 0.8, 32)
    const lensHousingMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, metalness: 0.8, roughness: 0.3 })
    const lensHousing = new THREE.Mesh(lensHousingGeo, lensHousingMat)
    lensHousing.rotation.z = Math.PI / 2
    lensHousing.position.set(1.2, 0, 0)
    group.add(lensHousing)
    
    // Lens glass
    const lensGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32)
    const lensMat = new THREE.MeshPhysicalMaterial({ 
      color: 0x88ccff, 
      transmission: 0.9, 
      opacity: 1,
      metalness: 0,
      roughness: 0,
      ior: 1.5,
      thickness: 0.1
    })
    const lens = new THREE.Mesh(lensGeo, lensMat)
    lens.rotation.z = Math.PI / 2
    lens.position.set(1.6, 0, 0)
    group.add(lens)
    
    // Film reels (gold colored)
    const createReel = (yPos) => {
      const reelGroup = new THREE.Group()
      reelGroup.position.set(-0.6, yPos, 0)
      reelGroup.name = `reel_${yPos > 0 ? 'top' : 'bottom'}`
      
      // Reel discs
      const discGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.08, 32)
      const discMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, metalness: 0.7, roughness: 0.3 })
      
      const topDisc = new THREE.Mesh(discGeo, discMat)
      topDisc.position.y = 0.2
      reelGroup.add(topDisc)
      
      const bottomDisc = new THREE.Mesh(discGeo, discMat)
      bottomDisc.position.y = -0.2
      reelGroup.add(bottomDisc)
      
      // Center hub
      const hubGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.45, 16)
      const hubMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9 })
      const hub = new THREE.Mesh(hubGeo, hubMat)
      reelGroup.add(hub)
      
      // Spokes
      for (let i = 0; i < 6; i++) {
        const spokeGeo = new THREE.BoxGeometry(0.4, 0.05, 0.05)
        const spoke = new THREE.Mesh(spokeGeo, discMat)
        spoke.position.y = 0.2
        spoke.rotation.y = (i / 6) * Math.PI
        spoke.position.x = Math.cos((i / 6) * Math.PI * 2) * 0.3
        spoke.position.z = Math.sin((i / 6) * Math.PI * 2) * 0.3
        reelGroup.add(spoke)
        
        const spoke2 = spoke.clone()
        spoke2.position.y = -0.2
        reelGroup.add(spoke2)
      }
      
      return reelGroup
    }
    
    group.add(createReel(0.9))
    group.add(createReel(-0.9))
    
    // Control knobs
    const knobGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 16)
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5 })
    const knob = new THREE.Mesh(knobGeo, knobMat)
    knob.rotation.z = Math.PI / 2
    knob.position.set(0.5, -0.3, 0.6)
    group.add(knob)
    
    // Feet
    const footGeo = new THREE.BoxGeometry(0.2, 0.15, 0.2)
    const footMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a })
    const positions = [[-0.8, -0.7, 0.5], [0.8, -0.7, 0.5], [-0.8, -0.7, -0.5], [0.8, -0.7, -0.5]]
    positions.forEach(pos => {
      const foot = new THREE.Mesh(footGeo, footMat)
      foot.position.set(...pos)
      group.add(foot)
    })
    
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
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem' }}>⚠️ Projector Error</div>
        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{error}</div>
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
        fontSize: '0.9rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🎬</div>
          Loading projector...
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
        background: 'transparent'
      }}
    />
  )
}