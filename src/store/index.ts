import create from "zustand"

export type ControlsMode = "moveForward" | "moveBack" | "moveLeft" | "moveRight"

type State = {
  controls: Record<ControlsMode, boolean>
  setControls: (mode: ControlsMode, ifActive: boolean) => void
}

export const useStore = create<State>((set) => ({
  controls: {
    moveForward: false,
    moveBack: false,
    moveLeft: false,
    moveRight: false,
  },
  setControls: (mode: ControlsMode, ifActive: boolean) =>
    set((state) => ({ controls: { ...state.controls, [mode]: ifActive } })),
}))
