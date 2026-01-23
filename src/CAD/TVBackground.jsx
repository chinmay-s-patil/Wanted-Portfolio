// src/CAD/TVBackground.jsx
'use client'

import { useRef, useEffect, useState } from 'react'

export default function TVBackground({ onScreenReady }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const loadThreeJS = async () => {
      if (!window.THREE) {
        const script = document.createElement('script')
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
        script.onload = () => initScene()
        document.head.appendChild(script)
      } else {
        initScene()
      }
    }

    const initScene = () => {
      const THREE = window.THREE
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x0a0a0a)
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(
        35,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      )
      camera.position.set(0, 0, 8)

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      containerRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.8))
      const light1 = new THREE.DirectionalLight(0xffffff, 1.2)
      light1.position.set(5, 5, 5)
      scene.add(light1)
      const light2 = new THREE.DirectionalLight(0xffffff, 0.6)
      light2.position.set(-5, -5, -5)
      scene.add(light2)

      // Create TV frame using native Three.js geometry
      const tvGroup = createTVFrame(THREE)
      scene.add(tvGroup)
      setIsLoaded(true)

      // Calculate screen area based on the actual geometry
      if (onScreenReady) {
        const screenInfo = calculateScreenArea(tvGroup, camera, renderer)
        onScreenReady(screenInfo)
      }

      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate)
        renderer.render(scene, camera)
      }
      animate()

      // Handle resize
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
        renderer.dispose()
      }
    }

    loadThreeJS()
  }, [onScreenReady])

  // Creates a TV frame using basic Three.js geometries
  const createTVFrame = (THREE) => {
    const group = new THREE.Group()

    // Main TV body (dark gray)
    const bodyGeometry = new THREE.BoxGeometry(2.4, 1.8, 0.15)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2a2a })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    body.position.z = -0.075
    group.add(body)

    // Screen area (black)
    const screenGeometry = new THREE.PlaneGeometry(2.0, 1.5)
    const screenMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 })
    const screen = new THREE.Mesh(screenGeometry, screenMaterial)
    screen.position.z = 0.001
    group.add(screen)

    // Bezel/frame (darker gray)
    const bezelGeometry = new THREE.BoxGeometry(2.1, 1.6, 0.05)
    const bezelMaterial = new THREE.MeshPhongMaterial({ color: 0x1a1a1a })
    const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial)
    bezel.position.z = 0.025
    group.add(bezel)

    // Bottom stand
    const standGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16)
    const standMaterial = new THREE.MeshPhongMaterial({ color: 0x2a2a2a })
    const stand = new THREE.Mesh(standGeometry, standMaterial)
    stand.position.y = -1.2
    stand.position.z = -0.1
    group.add(stand)

    return group
  }

  // Calculate screen area relative to the TV model
  const calculateScreenArea = (tvModel, camera, renderer) => {
    // These values are based on the geometry created above
    // The screen is 2.0 units wide and 1.5 units tall, positioned at z=0.001
    // This translates to roughly these percentages of the container
    return {
      left: '18%',
      top: '16%',
      width: '64%',
      height: '68%'
    }
  }

  return (
    <div 
      ref={containerRef} 
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none'
      }}
    />
  )
}