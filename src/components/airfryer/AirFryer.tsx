import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { ConfiguratorSection } from "../../config/configuratorSections";
import { useConfig } from "../../store";
import { useColorAnimation } from "./animations/useColorAnimation";
import { useFinishAnimation } from "./animations/useFinishAnimation";
import { useTrayAnimation } from "./animations/useTrayAnimation";
import { usePanelAnimation } from "./animations/usePanelAnimation";

const AirFryer = ({ section }: { section: ConfiguratorSection }) => {
    const { scene } = useLoader(
        GLTFLoader,
        "/models/airfryer_model_v006.glb",
    );
    const color = useConfig((s) => s.color);
    const shiny = useConfig((s) => s.shiny);
    const tray = useConfig((s) => s.tray);
    const digital = useConfig((s) => s.digital);
    const glass = useConfig((s) => s.glass);


    useEffect(() => {
        scene.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
                obj.castShadow = true;
                obj.receiveShadow = true;
            }
        });
    }, [scene]);

    useColorAnimation(scene, "Red plastic", color);
    useFinishAnimation(scene, "Red plastic", shiny);
    useTrayAnimation(scene, tray, glass, section);
    usePanelAnimation(scene, digital);

    return <primitive object={scene} position-y={-3} />;
};

export default AirFryer;
