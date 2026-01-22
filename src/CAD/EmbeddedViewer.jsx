// src/CAD/EmbeddedViewer.jsx
'use client'

import { useRef, useEffect, useState } from 'react'

export default function EmbeddedViewer({ project, screenArea }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const ctrlRef = useRef({
    isRotating: false,
    lastX: 0,
    lastY: 0,
    target: null,
    spherical: null
  })

  useEffect(() => {
    if (!containerRef.current) return

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

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const light1 = new THREE.DirectionalLight(0xffffff, 1.5)
    light1.position.set(5, 5, 5)
    scene.add(light1)
    const light2 = new THREE.DirectionalLight(0xffffff, 0.8)
    light2.position.set(-5, -5, -5)
    scene.add(light2)

    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)

    // Load model
    const fileExtension = project.gltfFile.toLowerCase().split('.').pop()
    if (fileExtension === 'gltf' || fileExtension === 'glb') {
      const loader = new THREE.GLTFLoader()
      loader.load(
        project.gltfFile,
        (gltf) => {
          const model = gltf.scene
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          
          model.position.sub(center)
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 2 / maxDim
          model.scale.setScalar(scale)
          
          if (project.modelRotation) {
            model.rotation.set(
              project.modelRotation.x,
              project.modelRotation.y,
              project.modelRotation.z
            )
          }
          
          model.traverse((child) => {
            if (child.isMesh && project.modelColor) {
              child.material.color = new THREE.Color(project.modelColor)
              child.material.transparent = project.transparency > 0
              child.material.opacity = project.transparency ? project.transparency / 100 : 1
              child.material.needsUpdate = true
            }
          })
          
          scene.add(model)
          meshRef.current = model
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
      const { spherical, target } = ctrlRef.current
      const pos = new THREE.Vector3().setFromSpherical(spherical)
      camera.position.copy(target).add(pos)
      camera.lookAt(target)
    }

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      if (!containerRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (rendererRef.current) {
        containerRef.current?.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [project])

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
        position: 'absolute',
        left: screenArea?.left || '20%',
        top: screenArea?.top || '15%',
        width: screenArea?.width || '60%',
        height: screenArea?.height || '70%',
        cursor: ctrlRef.current.isRotating ? 'grabbing' : 'grab',
        pointerEvents: 'auto',
        borderRadius: '12px',
        overflow: 'hidden'
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
          gap: '1rem'
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