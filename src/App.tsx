import { Canvas } from '@react-three/fiber'
import Configurator from './components/configurator/Configurator.tsx'
import Experience from './components/experience/Experience.tsx'
import * as THREE from "three";


export default function App() {

  return (
    <>
      <main className="page">
        <div className="viewer">
          <Canvas
            shadows
            camera={{ position: [7, 4, 9], fov: 45 }}
            gl={{ toneMapping: THREE.NoToneMapping }}
          >
           <Experience />
          </Canvas >
        </div>

        <Configurator />
      </main>
    </>
  )
}
