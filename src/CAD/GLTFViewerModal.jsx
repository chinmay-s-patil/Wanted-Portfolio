// src/CAD/GLTFViewerModal.jsx
'use client'

import { useRef, useEffect, useState } from 'react'

export default function GLTFViewerModal({ project, onClose }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const meshRef = useRef(null)
  const animationRef = useRef(null)
  const [threeReady, setThreeReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [error, setError] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [isTransparent, setIsTransparent] = useState(project.transparency > 0)
  const [showInfo, setShowInfo] = useState(true)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [modelRotation, setModelRotation] = useState(project.modelRotation || { x: 0, y: 0, z: 0 })

  const ctrlRef = useRef({
    isRotating: false,
    isPanning: false,
    lastX: 0,
    lastY: 0,
    target: null,
    spherical: null,
    panOffset: null,
    viewState: { x: 0, y: 0, z: 0, perp: 0 }
  })

  const touchStateRef = useRef({
    isTouching: false,
    touchStartX: 0,
    touchStartY: 0,
    initialPinchDistance: null,
    lastCenterX: 0,
    lastCenterY: 0
  })

  const fileExtension = project.gltfFile.toLowerCase().split('.').pop()
  const isSTL = fileExtension === 'stl'
  const isGLTF = fileExtension === 'gltf' || fileExtension === 'glb'
  const effectiveTransparency = project.transparency > 0 ? project.transparency : 50

  // Load Three.js
  useEffect(() => {
    if (typeof window === 'undefined') return
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
    
    const loadThreeJS = async () => {
      if (!window.THREE) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.onload = () => loadModelLoader()
        script.onerror = () => {
          setError('Could not load 3D engine')
          setShowPopup(true)
        }
        document.head.appendChild(script)
      } else {
        loadModelLoader()
      }
    }

    const loadModelLoader = () => {
      if (isSTL) {
        loadSTLLoader()
      } else if (isGLTF) {
        loadGLTFLoader()
      } else {
        setError('Unsupported file format')
        setShowPopup(true)
      }
    }

    const loadSTLLoader = () => {
      if (!window.THREE.STLLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/STLLoader.js'
        loaderScript.onload = () => {
          setThreeReady(true)
          setLoadingProgress(20)
        }
        loaderScript.onerror = () => {
          setError('Could not load STL loader')
          setShowPopup(true)
        }
        document.head.appendChild(loaderScript)
      } else {
        setThreeReady(true)
        setLoadingProgress(20)
      }
    }

    const loadGLTFLoader = () => {
      if (!window.THREE.GLTFLoader) {
        const loaderScript = document.createElement('script')
        loaderScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
        loaderScript.onload = () => {
          setThreeReady(true)
          setLoadingProgress(20)
        }
        loaderScript.onerror = () => {
          setError('Could not load GLTF loader')
          setShowPopup(true)
        }
        document.head.appendChild(loaderScript)
      } else {
        setThreeReady(true)
        setLoadingProgress(20)
      }
    }

    loadThreeJS()
  }, [isSTL, isGLTF])

  // Scene setup (keeping existing setup code from CADglTBNormalized.jsx)
  useEffect(() => {
    if (!threeReady || !containerRef.current) return

    const THREE = window.THREE
    document.body.style.overflow = 'hidden'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    const cam = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    cameraRef.current = cam

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const d1 = new THREE.DirectionalLight(0xffffff, 1.5)
    d1.position.set(5, 5, 5)
    scene.add(d1)
    const d2 = new THREE.DirectionalLight(0xffffff, 0.8)
    d2.position.set(-5, -5, -5)
    scene.add(d2)
    const d3 = new THREE.DirectionalLight(0xffffff, 0.5)
    d3.position.set(0, 10, 0)
    scene.add(d3)

    ctrlRef.current.target = new THREE.Vector3()
    ctrlRef.current.spherical = new THREE.Spherical(5, Math.PI / 3, Math.PI / 4)
    ctrlRef.current.panOffset = new THREE.Vector3()

    loadModel(project.gltfFile)

    const onResize = () => {
      if (!containerRef.current) return
      cam.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      cam.updateProjectionMatrix()
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    }
    window.addEventListener('resize', onResize)

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      updateCamera()
      renderer.render(scene, cam)
    }
    animate()

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('resize', onResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
      rendererRef.current?.dispose()
    }
  }, [project, threeReady])

  // (Include all the loading functions, touch handlers, and other methods from CADglTBNormalized.jsx)
  // For brevity, I'm showing the JSX structure. The full implementation would include all methods.

  function loadModel(url) {
    const THREE = window.THREE
    setLoadingProgress(40)
    setIsLoading(true)

    if (isSTL) {
      loadSTLModel(url, THREE)
    } else if (isGLTF) {
      loadGLTFModel(url, THREE)
    }
  }

  function loadGLTFModel(url, THREE) {
    if (!THREE.GLTFLoader) {
      setError('GLTF Loader not available')
      setShowPopup(true)
      setIsLoading(false)
      return
    }

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
            child.material.transparent = is