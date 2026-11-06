import { Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const LightSetup = () => {
    const keyLightRef = useRef<THREE.DirectionalLight>(null!);
    const fillLightRef = useRef<THREE.DirectionalLight>(null!);
    const topLightRef = useRef<THREE.DirectionalLight>(null!);

    // useHelper(keyLightRef, THREE.DirectionalLightHelper, 1, "#00ff22");
    // useHelper(fillLightRef, THREE.DirectionalLightHelper, 1, "#0062ff");
    // useHelper(topLightRef, THREE.DirectionalLightHelper, 1, "#fee904");

    return (
        <>
            <Environment preset="apartment" background={false} environmentIntensity={0.2}  />

            <directionalLight
                ref={topLightRef}
                position={[0, 20, 2]}
                scale={5}
                intensity={2.5}
                color="#fff7e4"
                castShadow
                shadow-mapSize={[2048, 2048]}
                shadow-bias={-0.0001}
                shadow-normalBias={0.02}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={12}
                shadow-camera-bottom={-12}
                shadow-camera-near={0.1}
                shadow-camera-far={40}
            />

            <directionalLight
                ref={keyLightRef}
                position={[-5, 7, 5]}
                intensity={0.5}
                color="#fff2d6"
            />
            <directionalLight
                ref={fillLightRef}
                position={[5, 4, 3]}
                intensity={0.5}
                color="#fff2d6"
                
            />


        </>
    );
};

export default LightSetup;
