import { useState, useEffect, useRef } from 'react'

// Separate component for the 3D model viewer
function TVModelViewer({ project }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const modelGroupRef = useRef(null)
  const animationRef = useRef(null)
  const [threeReady, setThreeReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const ctrlRef = useRef({
    isRotating: false,
    lastX: 0,
    lastY: 0,
    spherical: null,
    target: null
  })

  // Load Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadThreeJS = async () => {
      if (!window.THREE) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.onload = () => loadGLTFLoader()
        document.head.appendChild(script)
      } else {
        loadGLTFLoader()
      }
    }

    const loadGLTFLoader = () => {
      if (!window.THREE.GLTFLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
        loaderScript.onload = () => setThreeReady(true)
        document.head.appendChild(loaderScript)
      } else {
        setThreeReady(true)
      }
    }

    loadThreeJS()
  }, [])

  // Scene setup
  useEffect(() => {
    if (!threeReady || !containerRef.current) return

    const THREE = window.THREE
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const d1 = new THREE.DirectionalLight(0xffffff, 1.5)
    d1.position.set(5, 5, 5)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.8)
    d2.position.set(-5, -5, -5)
    scene.add(d2)

    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)

    // Load model
    loadModel(project.gltfFile)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (rendererRef.current && containerRef.current?.contains(rendererRef.current.domElement)) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [project, threeReady])

  function loadModel(url) {
    const THREE = window.THREE
    setLoadingProgress(40)
    setIsLoading(true)

    if (!THREE.GLTFLoader) return

    const loader = new THREE.GLTFLoader()
    loader.load(
      url,
      (gltf) => {
        setLoadingProgress(80)
        const model = gltf.scene
        
        if (project.modelRotation) {
          model.rotation.set(project.modelRotation.x, project.modelRotation.y, project.modelRotation.z)
        }

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        model.position.sub(center)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 0.7 / maxDim
        model.scale.setScalar(scale)

        model.traverse((child) => {
          if (child.isMesh) {
            if (project.modelColor) {
              child.material.color = new THREE.Color(project.modelColor)
            }
            child.material.transparent = project.transparency > 0
            child.material.opacity = (project.transparency || 0) / 100
            child.material.needsUpdate = true
          }
        })

        sceneRef.current.add(model)
        modelGroupRef.current = model
        setIsLoading(false)
        setLoadingProgress(100)
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100
        setLoadingProgress(Math.min(progress, 95))
      },
      (error) => {
        console.error('Error loading model:', error)
        setIsLoading(false)
      }
    )
  }

  const updateCamera = () => {
    if (!cameraRef.current || !ctrlRef.current.spherical || !ctrlRef.current.target) return
    const { spherical, target } = ctrlRef.current
    const pos = new window.THREE.Vector3().setFromSpherical(spherical)
    cameraRef.current.position.copy(target).add(pos)
    cameraRef.current.lookAt(target)
  }

  const handleMouseDown = (e) => {
    ctrlRef.current.isRotating = true
    ctrlRef.current.lastX = e.clientX
    ctrlRef.current.lastY = e.clientY
  }

  const handleMouseMove = (e) => {
    if (!ctrlRef.current.isRotating) return
    const dx = e.clientX - ctrlRef.current.lastX
    const dy = e.clientY - ctrlRef.current.lastY
    ctrlRef.current.spherical.theta -= dx * 0.01
    ctrlRef.current.spherical.phi += dy * 0.01
    ctrlRef.current.spherical.phi = window.THREE.MathUtils.clamp(
      ctrlRef.current.spherical.phi,
      0.1,
      Math.PI - 0.1
    )
    ctrlRef.current.lastX = e.clientX
    ctrlRef.current.lastY = e.clientY
  }

  const handleMouseUp = () => {
    ctrlRef.current.isRotating = false
  }

  const handleWheel = (e) => {
    e.preventDefault()
    ctrlRef.current.spherical.radius = Math.max(
      1,
      Math.min(20, ctrlRef.current.spherical.radius + e.deltaY * 0.01)
    )
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      style={{
        width: '100%',
        height: '100%',
        cursor: 'grab',
        position: 'relative'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.9)',
          color: '#00ff00',
          fontSize: '0.9rem',
          gap: '1rem',
          zIndex: 20
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0,255,0,0.2)',
            borderTop: '3px solid #00ff00',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <div>LOADING MODEL...</div>
          {loadingProgress > 0 && (
            <div style={{
              width: '200px',
              height: '4px',
              background: 'rgba(0,255,0,0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: '#00ff00',
                transition: 'width 0.3s ease'
              }} />
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default TVModelViewer;