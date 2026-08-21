import React from 'react'
import { useGLTF } from '@react-three/drei'

export default function TableModel(props) {
  const { scene } = useGLTF('/hubModels/CENTER TABLE.glb')
  
  return (
    <primitive 
      object={scene} 
      position={[0.18, 0.24, 1.25]} 
      scale={10} 
      {...props} 
    />
  )
}