import {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react"
import { Camera, Euler, Group, Vector3 } from "three"
import { useStore } from "../store"

type ControlKeys =
  | "ArrowUp"
  | "KeyW"
  | "ArrowDown"
  | "KeyS"
  | "ArrowLeft"
  | "KeyA"
  | "ArrowRight"
  | "KeyD"

const groundPlane = new Vector3(0, 1, 0)
const cameraDir = new Vector3()
const characterRotation = new Euler()
const rotationEuler = new Euler()
const cameraPos = new Vector3()
const movementSpeed = 1
const cameraDist = 4.5

export const useCharacterControls = (
  characterRef: MutableRefObject<Group | null>,
  camera: Camera
) => {
  const moveForward = useRef(false)
  const moveBackward = useRef(false)
  const moveLeft = useRef(false)
  const moveRight = useRef(false)
  const setControls = useStore((state) => state.setControls)

  const keyMap: Record<ControlKeys, (state: boolean) => void> = useMemo(
    () => ({
      ArrowUp: (ifActive: boolean) => setControls("moveForward", ifActive),
      KeyW: (ifActive: boolean) => setControls("moveForward", ifActive),
      ArrowDown: (ifActive: boolean) => setControls("moveBack", ifActive),
      KeyS: (ifActive: boolean) => setControls("moveBack", ifActive),
      ArrowLeft: (ifActive: boolean) => setControls("moveLeft", ifActive),
      KeyA: (ifActive: boolean) => setControls("moveLeft", ifActive),
      ArrowRight: (ifActive: boolean) => setControls("moveRight", ifActive),
      KeyD: (ifActive: boolean) => setControls("moveRight", ifActive),
    }),
    [setControls]
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault()
      if (Object.keys(keyMap).includes(e.code)) {
        keyMap[e.code as ControlKeys](true)
      }

      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.current = true
          break

        case "ArrowLeft":
        case "KeyA":
          moveLeft.current = true
          break

        case "ArrowDown":
        case "KeyS":
          moveBackward.current = true
          break

        case "ArrowRight":
        case "KeyD":
          moveRight.current = true
          break
      }
    },
    [keyMap]
  )

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (Object.keys(keyMap).includes(e.code)) {
        keyMap[e.code as ControlKeys](false)
      }

      switch (e.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward.current = false
          break

        case "ArrowLeft":
        case "KeyA":
          moveLeft.current = false
          break

        case "ArrowDown":
        case "KeyS":
          moveBackward.current = false
          break

        case "ArrowRight":
        case "KeyD":
          moveRight.current = false
          break
      }
    },
    [keyMap]
  )

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown)
    document.addEventListener("keyup", onKeyUp)
    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.removeEventListener("keyup", onKeyUp)
    }
  }, [onKeyDown, onKeyUp])

  const updateCharacterControls = useCallback(
    (delta: number) => {
      if (!characterRef.current || !camera) return

      camera.getWorldDirection(cameraDir)
      const speed = delta * movementSpeed
      characterRef.current.rotation.set(0, 0, 0)

      if (moveForward.current) {
        characterRotation.set(0, Math.PI, 0)
        characterRef.current.translateZ(-speed)
      }
      if (moveBackward.current) {
        characterRotation.set(0, 0, 0)
        rotationEuler.set(0, 0, 0)
        characterRef.current.translateZ(speed)
      }
      if (moveLeft.current) {
        characterRotation.set(0, -Math.PI / 2, 0)
        characterRef.current.translateX(-speed)
      }
      if (moveRight.current) {
        characterRotation.set(0, Math.PI / 2, 0)
        characterRef.current.translateX(speed)
      }
      if (moveForward.current && moveLeft.current)
        characterRotation.set(0, -(3 * Math.PI) / 4, 0)

      if (moveForward.current && moveRight.current)
        characterRotation.set(0, (3 * Math.PI) / 4, 0)

      if (moveBackward.current && moveLeft.current)
        characterRotation.set(0, -Math.PI / 4, 0)

      if (moveBackward.current && moveRight.current)
        characterRotation.set(0, Math.PI / 4, 0)

      characterRef.current.rotation.copy(characterRotation)

      cameraDir.multiplyScalar(cameraDist)
      cameraPos.copy(characterRef.current.position).sub(cameraDir)
      camera.position.copy(cameraPos)
    },
    [characterRef, camera]
  )

  return { updateCharacterControls }
}
