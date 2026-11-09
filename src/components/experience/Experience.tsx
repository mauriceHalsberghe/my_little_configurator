import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import { BakeShadows, SoftShadows } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import AirFryer from "../airfryer/AirFryer";
import Scene from "../scene/Scene";
import LightSetup from "./LightSetup";
import type { ConfiguratorSection } from "../../config/configuratorSections";

const CAMERA_PRESETS: Record<
    ConfiguratorSection,
    { position: [number, number, number]; target: [number, number, number] }
> = {
    color: { position: [-3, 3, 18], target: [0, -0.5, 0] },
    finish: { position: [-8, 3.5, 15], target: [0, -0.5, 0] },
    trays: { position: [0, 9, 10], target: [0, -5, 0] },
    interface: { position: [0, 5, 7], target: [0, 1, 0] },
    glass: { position: [7, 1, 10], target: [-1, -2, -0.5] },
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
            <SoftShadows size={25} samples={16} focus={4} />
            <BakeShadows />

            <CameraRig section={section} />
            <AirFryer section={section} />
            <Scene />
            <LightSetup />
        </>
    );
};

export default Experience;
