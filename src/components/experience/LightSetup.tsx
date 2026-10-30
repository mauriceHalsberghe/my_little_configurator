import { useHelper } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const LightSetup = () => {
  const keyLightRef = useRef<THREE.DirectionalLight>(null!);
  const fillLightRef = useRef<THREE.DirectionalLight>(null!);
  const rimLightRef = useRef<THREE.DirectionalLight>(null!);

  useHelper(keyLightRef, THREE.DirectionalLightHelper, 1, "#00ff22");
  useHelper(fillLightRef, THREE.DirectionalLightHelper, 1, "#0062ff");
  useHelper(rimLightRef, THREE.DirectionalLightHelper, 1, "#fe0404");

  return (
    <>
      <directionalLight
        ref={keyLightRef}
        position={[-5, 7, 5]}
        intensity={6}
        color="#fff2d6"
        castShadow
      />
      <directionalLight
        ref={fillLightRef}
        position={[5, 4, 3]}
        intensity={1.5}
        color="#c8ddff"
      />
      <directionalLight
        ref={rimLightRef}
        position={[0, 3, -8]}
        intensity={2.5}
        color="#ffd6c8"
      />
    </>
  );
};

export default LightSetup;
