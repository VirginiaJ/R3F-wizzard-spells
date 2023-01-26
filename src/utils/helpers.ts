import { Camera, Vector3, Vector3Tuple } from "three"

const dist = 4.5
const characterPosition = new Vector3()
const groundPlane = new Vector3(0, 1, 0)
const projectedCameraPosition = new Vector3()
const cameraDir = new Vector3()

export const getCharacterPosition = (camera: Camera): Vector3Tuple => {
  camera.getWorldDirection(cameraDir)
  cameraDir.projectOnPlane(groundPlane)
  characterPosition.copy(cameraDir).multiplyScalar(dist)
  projectedCameraPosition.copy(camera.position).projectOnPlane(groundPlane)
  characterPosition.add(projectedCameraPosition)
  return [characterPosition.x, characterPosition.y, characterPosition.z]
}
