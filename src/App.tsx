import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import Experience from "./components/experience/Experience.tsx";
import type { ConfiguratorSection } from "./components/ui/navigation/Navigation.tsx";
import * as THREE from "three";
import Configurator from "./components/ui/configurator/Configurator.tsx";
import LoadingScreen from "./components/ui/loading/LoadingScreen.tsx";

export default function App() {
    const [activeSection, setActiveSection] =
        useState<ConfiguratorSection>("color");
    const [isLoading, setIsLoading] = useState(true);

    return (
        <>
            <main className="page">
                <div className="viewer">
                    <Canvas
                        shadows
                        camera={{ position: [-9, 3.5, 11], fov: 28 }}
                        gl={{ toneMapping: THREE.NoToneMapping }}
                    >
                        <Experience section={activeSection} />
                        {/* <OrbitControls makeDefault /> */}
                    </Canvas>
                    {isLoading && (
                        <LoadingScreen onLoaded={() => setIsLoading(false)} />
                    )}
                </div>

                <Configurator
                    activeSection={activeSection}
                    onSelectSection={setActiveSection}
                />
            </main>
        </>
    );
}
