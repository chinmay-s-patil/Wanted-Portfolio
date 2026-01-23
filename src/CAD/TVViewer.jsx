// src/CAD/TVViewer.jsx
'use client'

import { useRef, useEffect, useState } from 'react'

export default function TVViewer({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const modelGroupRef = useRef(null)
  const animationRef = useRef(null)
  const [threeReady, setThreeReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isTransparent, setIsTransparent] = useState(project.transparency > 0)
  const [modelRotation, setModelRotation] = useState(project.modelRotation || { x: 0, y: 0, z: 0 })

  const ctrlRef = useRef({
    isRotating: false,
    lastX: 0,
    lastY: 0,
    spherical: null,
    target: null
  })

  const fileExtension = project.gltfFile.toLowerCase().split('.').pop()
  const isGLTF = fileExtension === 'gltf' || fileExtension === 'glb'

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

  // Scene setup - only when containerRef is available
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

    const onResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }
    }
    animate()

    return () => {
      window.removeEventListener('resize', onResize)
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
        model.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z)

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        model.position.sub(center)
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2 / maxDim
        model.scale.setScalar(scale)

        model.traverse((child) => {
          if (child.isMesh) {
            if (project.modelColor) {
              child.material.color = new THREE.Color(project.modelColor)
            }
            child.material.transparent = isTransparent
            child.material.opacity = (project.transparency || 50) / 100
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

  const resetView = () => {
    ctrlRef.current.spherical.set(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.target.set(0, 0, 0)
    const originalRotation = project.modelRotation || { x: 0, y: 0, z: 0 }
    setModelRotation(originalRotation)
    if (modelGroupRef.current) {
      modelGroupRef.current.rotation.set(originalRotation.x, originalRotation.y, originalRotation.z)
    }
  }

  const toggleTransparency = () => {
    if (!modelGroupRef.current) return
    const newTransparent = !isTransparent
    setIsTransparent(newTransparent)
    const opacity = newTransparent ? (project.transparency || 50) / 100 : 1.0

    modelGroupRef.current.traverse((child) => {
      if (child.isMesh) {
        child.material.transparent = newTransparent
        child.material.opacity = opacity
        child.material.needsUpdate = true
      }
    })
  }

  const setViewX = () => {
    ctrlRef.current.spherical.theta = Math.PI / 2
    ctrlRef.current.spherical.phi = Math.PI / 2
  }

  const setViewY = () => {
    ctrlRef.current.spherical.theta = 0
    ctrlRef.current.spherical.phi = 0.1
  }

  const setViewZ = () => {
    ctrlRef.current.spherical.theta = 0
    ctrlRef.current.spherical.phi = Math.PI / 2
  }

  const rotateModelX = () => {
    if (!modelGroupRef.current) return
    const newRotation = { ...modelRotation, x: modelRotation.x + Math.PI / 2 }
    setModelRotation(newRotation)
    modelGroupRef.current.rotation.x += Math.PI / 2
  }

  const rotateModelY = () => {
    if (!modelGroupRef.current) return
    const newRotation = { ...modelRotation, y: modelRotation.y + Math.PI / 2 }
    setModelRotation(newRotation)
    modelGroupRef.current.rotation.y += Math.PI / 2
  }

  const rotateModelZ = () => {
    if (!modelGroupRef.current) return
    const newRotation = { ...modelRotation, z: modelRotation.z + Math.PI / 2 }
    setModelRotation(newRotation)
    modelGroupRef.current.rotation.z += Math.PI / 2
  }

  return {
    containerRef,
    isLoading,
    loadingProgress,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    resetView,
    toggleTransparency,
    setViewX,
    setViewY,
    setViewZ,
    rotateModelX,
    rotateModelY,
    rotateModelZ,
    isTransparent
  }
}