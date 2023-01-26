import { useRef, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { Object3D } from "three"

export const Wizard = () => {
  const modelRef = useRef<Object3D>()
  // model --> https://market.pmnd.rs/model/druid
  const { nodes, materials, animations } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/druid/model.gltf"
  )
  const { actions } = useAnimations(animations, modelRef)

  useEffect(() => {
    actions.PortalOpen?.play()
  }, [actions])

  useFrame(() => {})

  return (
    <group ref={modelRef} scale={[1.91, 1.91, 1.91]}>
      <primitive object={nodes.root} />
      <skinnedMesh
        geometry={nodes.druid.geometry}
        material={materials.color_main}
        skeleton={nodes.druid.skeleton}
        castShadow
        receiveShadow
      />
    </group>
  )
}
