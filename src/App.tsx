import "./styles.css"
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Wizard } from "./components/Wizard"
import { Ground } from "./components/Ground"
import { Forest } from "./components/Forest"
import { Ruins } from "./components/Ruins"
import { Character } from "./components/Character"

export default function App() {
  return (
    <div className="App" id="container">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{
          position: [1, 3, 9],
          fov: 45,
        }}
      >
        <color attach="background" args={["#202030"]} />
        <fog attach="fog" args={["#202030", 10, 25]} />
        <hemisphereLight intensity={0.5} color="#91907e" groundColor="blue" />
        <Suspense fallback={null}>
          <Character />
          <Wizard />
          <Forest />
          <Ground />
          <Ruins position={[-10, 0.4, -9]} scale={[0.3, 0.3, 0.3]} />
        </Suspense>
        <ambientLight intensity={1} />
        <directionalLight
          color="#fcfcfa"
          position={[4, 5, 5]}
          intensity={1.5}
          castShadow
          shadow-bias={-0.0001}
        />
      </Canvas>
    </div>
  )
}
