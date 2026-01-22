// src/CAD/TVBackground.jsx
'use client'

import { useRef, useEffect, useState } from 'react'

export default function TVBackground({ onScreenReady }) {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const rendererRef = useRef(null)
  const animationRef = useRef(null)
  const tvGroupRef = useRef(null)
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
      scene.add(new THREE.AmbientLight(0xffffff, 0.6))
      const light1 = new THREE.DirectionalLight(0xffffff, 1.0)
      light1.position.set(5, 5, 5)
      scene.add(light1)
      const light2 = new THREE.DirectionalLight(0xffffff, 0.5)
      light2.position.set(-5, -5, -5)
      scene.add(light2)

      // Create TV model using basic shapes
      const tvGroup = new THREE.Group()
      tvGroupRef.current = tvGroup
      
      // Main TV body (bezels and frame)
      const bodyGeometry = new THREE.BoxGeometry(2.4, 1.8, 0.4)
      const bodyMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x1a1a1a,
        shininess: 30
      })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      tvGroup.add(body)
      
      // Screen bezel (slightly raised)
      const bezelGeometry = new THREE.BoxGeometry(2.0, 1.5, 0.05)
      const bezelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x0a0a0a,
        shininess: 10
      })
      const bezel = new THREE.Mesh(bezelGeometry, bezelMaterial)
      bezel.position.z = 0.175
      tvGroup.add(bezel)
      
      // Screen (recessed area where model will be displayed)
      const screenGeometry = new THREE.BoxGeometry(1.8, 1.35, 0.02)
      const screenMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x000000,
        shininess: 100,
        reflectivity: 0.1
      })
      const screen = new THREE.Mesh(screenGeometry, screenMaterial)
      screen.position.z = 0.19
      tvGroup.add(screen)
      
      // Control panel below screen
      const panelGeometry = new THREE.BoxGeometry(1.5, 0.15, 0.05)
      const panelMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a2a2a,
        shininess: 20
      })
      const panel = new THREE.Mesh(panelGeometry, panelMaterial)
      panel.position.y = -0.75
      panel.position.z = 0.175
      tvGroup.add(panel)
      
      // Control knobs/buttons
      for (let i = 0; i < 3; i++) {
        const knobGeometry = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 16)
        const knobMaterial = new THREE.MeshPhongMaterial({ 
          color: 0x444444,
          shininess: 50
        })
        const knob = new THREE.Mesh(knobGeometry, knobMaterial)
        knob.position.x = -0.4 + i * 0.2
        knob.position.y = -0.75
        knob.position.z = 0.21
        knob.rotation.x = Math.PI / 2
        tvGroup.add(knob)
      }
      
      // Power button
      const powerGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 16)
      const powerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x00ff00,
        emissive: 0x00ff00,
        emissiveIntensity: 0.2,
        shininess: 100
      })
      const powerButton = new THREE.Mesh(powerGeometry, powerMaterial)
      powerButton.position.x = 0.8
      powerButton.position.y = -0.75
      powerButton.position.z = 0.205
      powerButton.rotation.x = Math.PI / 2
      tvGroup.add(powerButton)
      
      // Ventilation slots on sides
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < 5; i++) {
          const ventGeometry = new THREE.BoxGeometry(0.02, 0.08, 0.15)
          const ventMaterial = new THREE.MeshPhongMaterial({ color: 0x111111 })
          const vent = new THREE.Mesh(ventGeometry, ventMaterial)
          vent.position.x = side * 1.21
          vent.position.y = -0.3 + i * 0.15
          vent.position.z = 0
          tvGroup.add(vent)
        }
      }
      
      // Back of TV
      const backGeometry = new THREE.BoxGeometry(2.4, 1.8, 0.3)
      const backMaterial = new THREE.MeshPhongMaterial({ color: 0x151515 })
      const back = new THREE.Mesh(backGeometry, backMaterial)
      back.position.z = -0.35
      tvGroup.add(back)
      
      // Calculate screen area for embedded viewer
      // The screen is centered with 12.5% bezel on each side
      const screenInfo = {
        left: '12.5%',
        top: '12.5%',
        width: '75%',
        height: '75%'
      }
      
      scene.add(tvGroup)
      setIsLoaded(true)
      
      if (onScreenReady) {
        onScreenReady(screenInfo)
      }
      
      // Animation loop
      const animate = () => {
        animationRef.current = requestAnimationFrame(animate)
        // Subtle idle animation
        tvGroup.rotation.y = Math.sin(Date.now() * 0.0005) * 0.02
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