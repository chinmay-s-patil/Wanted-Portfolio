// ProjectorModel.jsx - Critical Fixes Only
import { useRef, useEffect, useState } from 'react'

export default function ProjectorModel({ isOn = false, state = 'idle' }) {
  const mountRef = useRef(null)
  const rendererRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    let isActive = true
    let scene, camera, renderer, modelGroup, light
    
    const init = async () => {
      try {
        if (!window.THREE) {
          // Load three.js
          await new Promise((resolve, reject) => {
            const s = document.createElement('script')
            s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
            s.onload = resolve
            s.onerror = () => reject('Failed to load Three.js')
            document.head.appendChild(s)
          })
        }
        
        if (!isActive) return
        
        const THREE = window.THREE
        
        // Scene
        scene = new THREE.Scene()
        // NO background set - keeps it transparent
        
        // Camera
        camera = new THREE.PerspectiveCamera(45, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000)
        camera.position.set(3, 2, 4)
        
        // Renderer - CRITICAL TRANSPARENCY SETTINGS
        renderer = new THREE.WebGLRenderer({ 
          antialias: true, 
          alpha: true,
          premultipliedAlpha: false
        })
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.setClearColor(0x000000, 0) // Transparent clear
        mountRef.current.appendChild(renderer.domElement)
        rendererRef.current = renderer
        
        // Lights
        const ambient = new THREE.AmbientLight(0xffecd1, 0.4)
        scene.add(ambient)
        
        const main = new THREE.DirectionalLight(0xffecd1, 0.8)
        main.position.set(5, 5, 5)
        scene.add(main)
        
        // Spotlight
        light = new THREE.SpotLight(0xffd700, isOn ? (state === 'open' ? 0.8 : 1.5) : 0)
        light.position.set(0, 0.3, 0.8)
        light.angle = Math.PI / 5
        light.penumbra = 0.4
        light.distance = 15
        scene.add(light)
        
        // Load or create model
        if (window.THREE.GLTFLoader) {
          try {
            await loadModel(THREE, scene)
          } catch (e) {
            createPlaceholder(THREE, scene)
          }
        } else {
          createPlaceholder(THREE, scene)
        }
        
        // Animation loop
        const animate = () => {
          if (!isActive) return
          requestAnimationFrame(animate)
          
          if (modelGroup) {
            // Idle rotation
            if (state === 'idle') {
              modelGroup.rotation.y += 0.002
            }
            
            // Back away animation
            const targetZ = state === 'projecting' ? -1.5 : state === 'open' ? -3 : 0
            const targetScale = state === 'projecting' ? 0.9 : state === 'open' ? 0.75 : 1
            
            modelGroup.position.z += (targetZ - modelGroup.position.z) * 0.08
            const currentScale = modelGroup.scale.x
            const newScale = currentScale + (targetScale - currentScale) * 0.08
            modelGroup.scale.set(newScale, newScale, newScale)
          }
          
          // Pulsing light
          if (light && isOn) {
            const base = state === 'open' ? 0.5 : 1.5
            light.intensity = base + Math.sin(Date.now() * 0.003) * 0.2
          } else if (light) {
            light.intensity = 0
          }
          
          renderer.render(scene, camera)
        }
        animate()
        
      } catch (err) {
        console.error(err)
        setError(err.message || 'Failed to load')
      }
    }
    
    init()
    
    return () => {
      isActive = false
      if (renderer) {
        renderer.dispose()
        if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
          mountRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [state, isOn])
  
  const loadModel = (THREE, scene) => {
    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader()
      loader.load(
        '/SectionModels/Old Projector/movieprojector.gltf',
        (gltf) => {
          const model = gltf.scene
          model.position.set(0, -0.5, 0)
          model.scale.set(1.2, 1.2, 1.2)
          model.rotation.set(0, Math.PI, 0)
          scene.add(model)
          resolve()
        },
        undefined,
        (err) => reject(err)
      )
    })
  }
  
  const createPlaceholder = (THREE, scene) => {
    const group = new THREE.Group()
    
    // Simple vintage projector
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.9, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x3d2817, metalness: 0.4, roughness: 0.6 })
    )
    group.add(body)
    
    // Lens
    const lens = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32),
      new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8 })
    )
    lens.rotation.z = Math.PI / 2
    lens.position.set(0.9, 0, 0)
    group.add(lens)
    
    // Reels
    const reelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32)
    const reelMat = new THREE.MeshStandardMaterial({ color: 0x8b6914 })
    
    const topReel = new THREE.Mesh(reelGeo, reelMat)
    topReel.position.set(-0.4, 0.7, 0)
    group.add(topReel)
    
    const bottomReel = new THREE.Mesh(reelGeo, reelMat)
    bottomReel.position.set(-0.4, -0.7, 0)
    group.add(bottomReel)
    
    scene.add(group)
  }

  if (error) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ff6b6b'
      }}>
        Error loading projector
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