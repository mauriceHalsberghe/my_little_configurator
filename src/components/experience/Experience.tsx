import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import AirFryer from "../airfryer/AirFryer";
import Floor from "../floor/Floor";
import LightSetup from "./LightSetup";
import type { ConfiguratorSection } from "../navigation/Navigation";

const CAMERA_PRESETS: Record<
  ConfiguratorSection,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  color: { position: [-9, 3.5, 11], target: [1.5, -1, 0] },
  finish: { position: [-11, 2.5, 8], target: [1.5, -1, 0] },
  trays: { position: [1, 5, 12], target: [1, 0, 4] },
  interface: { position: [0.5, 5, 7], target: [0.5, 1, 0] },
  glass: { position: [8, 1, 8], target: [0.5, -1.5, 0] },
};

const CameraRig = ({ section }: { section: ConfiguratorSection }) => {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(1.5, -1, 0));

  useGSAP(
    () => {
      const preset = CAMERA_PRESETS[section];
      const timeline = gsap.timeline({
        onUpdate: () => camera.lookAt(target.current),
      });

      timeline.to(
        camera.position,
        {
          x: preset.position[0],
          y: preset.position[1],
          z: preset.position[2],
          duration: 0.9,
          ease: "power2.inOut",
        },
        0,
      );
      timeline.to(
        target.current,
        {
          x: preset.target[0],
          y: preset.target[1],
          z: preset.target[2],
          duration: 0.9,
          ease: "power2.inOut",
        },
        0,
      );

      return () => timeline.kill();
    },
    { dependencies: [camera, section] },
  );

  return null;
};

const Experience = ({ section }: { section: ConfiguratorSection }) => {
  return (
    <>
      <CameraRig section={section} />
      <AirFryer />
      <Floor />
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.5}
        blur={2.5}
        far={3}
        scale={10}
      />
      <LightSetup />
    </>
  );
};

export default Experience;
