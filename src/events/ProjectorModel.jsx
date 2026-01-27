// src/events/ProjectorModel.jsx
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default function ProjectorModel({ isOn = false }) {
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const lightRef = useRef(null)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0f0d0a)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(3, 2, 4)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6)
    mainLight.position.set(5, 5, 5)
    mainLight.castShadow = true
    scene.add(mainLight)

    // Projector light (spotlight for beam effect)
    const projectorLight = new THREE.SpotLight(0xffd700, 0)
    projectorLight.position.set(0, 0.5, 0)
    projectorLight.angle = Math.PI / 6
    projectorLight.penumbra = 0.3
    projectorLight.decay = 2
    projectorLight.distance = 10
    scene.add(projectorLight)
    lightRef.current = projectorLight

    // Load 3D model or create placeholder
    const loader = new GLTFLoader()
    
    // Try to load the uploaded model
    // Replace '/models/projector.glb' with your actual model path
    loader.load(
      '/models/projector.glb',
      (gltf) => {
        const model = gltf.scene
        
        // Center and scale
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        
        model.position.sub(center)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        model.scale.setScalar(scale)
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        scene.add(model)
      },
      undefined,
      (error) => {
        console.log('Loading placeholder projector...')
        // Create a simple placeholder projector if model fails to load
        const placeholder = createPlaceholderProjector()
        scene.add(placeholder)
      }
    )

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
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

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (mountRef.current && renderer.domElement) {
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
  }, [])

  // Update projector light when isOn changes
  useEffect(() => {
    if (lightRef.current) {
      lightRef.current.intensity = isOn ? 2 : 0
    }
  }, [isOn])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}

// Helper function to create a placeholder projector
function createPlaceholderProjector() {
  const group = new THREE.Group()

  // Projector body
  const bodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 1)
  const bodyMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x2a2a2a,
    metalness: 0.6,
    roughness: 0.4
  })
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // Lens
  const lensGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32)
  const lensMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.9,
    roughness: 0.1
  })
  const lens = new THREE.Mesh(lensGeometry, lensMaterial)
  lens.rotation.z = Math.PI / 2
  lens.position.set(0.85, 0, 0)
  lens.castShadow = true
  group.add(lens)

  // Lens glass
  const glassGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32)
  const glassMaterial = new THREE.MeshPhysicalMaterial({ 
    color: 0x88ccff,
    metalness: 0,
    roughness: 0.1,
    transmission: 0.9,
    thickness: 0.5
  })
  const glass = new THREE.Mesh(glassGeometry, glassMaterial)
  glass.rotation.z = Math.PI / 2
  glass.position.set(0.95, 0, 0)
  group.add(glass)

  // Film reels
  const reelGeometry = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32)
  const reelMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x3d2817,
    metalness: 0.3,
    roughness: 0.7
  })
  
  const topReel = new THREE.Mesh(reelGeometry, reelMaterial)
  topReel.position.set(-0.3, 0.6, 0)
  topReel.castShadow = true
  group.add(topReel)

  const bottomReel = new THREE.Mesh(reelGeometry, reelMaterial)
  bottomReel.position.set(-0.3, -0.6, 0)
  bottomReel.castShadow = true
  group.add(bottomReel)

  // Base
  const baseGeometry = new THREE.BoxGeometry(1.8, 0.1, 1.2)
  const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x1a1a1a,
    metalness: 0.8,
    roughness: 0.5
  })
  const base = new THREE.Mesh(baseGeometry, baseMaterial)
  base.position.y = -0.45
  base.receiveShadow = true
  group.add(base)

  return group
}
