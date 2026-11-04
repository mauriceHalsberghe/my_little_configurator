import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Configurator from "./components/configurator/Configurator.tsx";
import Experience from "./components/experience/Experience.tsx";
import type { ConfiguratorSection } from "./components/navigation/Navigation.tsx";
import * as THREE from "three";

export default function App() {
  const [activeSection, setActiveSection] =
    useState<ConfiguratorSection>("color");

  return (
    <>
      <main className="page">
        <div className="viewer">
          <Canvas
            shadows
            camera={{ position: [-9, 3.5, 11], fov: 35 }}
            gl={{ toneMapping: THREE.NoToneMapping }}
          >
            <Experience section={activeSection} />
          </Canvas>
        </div>

        <Configurator
          activeSection={activeSection}
          onSelectSection={setActiveSection}
        />
      </main>
    </>
  );
}
