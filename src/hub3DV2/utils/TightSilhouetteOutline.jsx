import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * TightSilhouetteOutline Component
 *
 * Uses an Inverted Hull Vertex Extrusion Shader normalized to World Space
 * to render a crisp, tight, shape-following contour outline around any 3D GLTF model
 * regardless of the model's local scaling factor.
 */
export default function TightSilhouetteOutline({
  scene,
  targetMesh,
  color = '#00f0ff',
  thickness = 0.007,
  visible = true,
}) {
  const uniformsRef = useRef(null)
  const target = scene || targetMesh

  const outlineScene = useMemo(() => {
    if (!target || typeof target.clone !== 'function') return null
    const cloned = target.clone(true)

    const outlineMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      side: THREE.BackSide,
      depthWrite: false,
    })

    outlineMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.outlineThickness = { value: thickness }
      shader.uniforms.uTime = { value: 0 }
      uniformsRef.current = shader.uniforms

      shader.vertexShader = `
        uniform float outlineThickness;
        uniform float uTime;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float worldScale = length(vec3(modelMatrix[0].x, modelMatrix[1].x, modelMatrix[2].x));
        float localThickness = (worldScale > 0.00001) ? (outlineThickness / worldScale) : outlineThickness;
        float pulse = 1.0 + 0.12 * sin(uTime * 5.0);
        transformed += normal * (localThickness * pulse);
        `
      )
    }

    cloned.traverse((child) => {
      if (child.isMesh) {
        child.material = outlineMaterial
      }
    })

    return cloned
  }, [target, color, thickness])

  useFrame(({ clock }) => {
    if (uniformsRef.current && uniformsRef.current.uTime) {
      uniformsRef.current.uTime.value = clock.getElapsedTime()
    }
  })

  if (!visible || !outlineScene) return null

  return <primitive object={outlineScene} />
}
