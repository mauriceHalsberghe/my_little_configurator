import { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ConfiguratorSection } from "../ui/navigation/Navigation";
import { useConfig } from "../../store";
import { useColorAnimation } from "./animations/useColorAnimation";
import { useFinishAnimation } from "./animations/useFinishAnimation";
import { useTrayAnimation } from "./animations/useTrayAnimation";
import { usePanelAnimation } from "./animations/usePanelAnimation";

const AirFryer = ({ section }: { section: ConfiguratorSection }) => {
    const { scene } = useGLTF("./models/airfryer_model_v006.glb");
    const color = useConfig((s) => s.color);
    const shiny = useConfig((s) => s.shiny);
    const tray = useConfig((s) => s.tray);
    const digital = useConfig((s) => s.digital);
    const glass = useConfig((s) => s.glass);


    useEffect(() => {
        scene.traverse((o) => {
            if (o instanceof THREE.Mesh) o.castShadow = true;
        });
    }, [scene]);

    useColorAnimation(scene, "Red plastic", color);
    useFinishAnimation(scene, "Red plastic", shiny);
    useTrayAnimation(scene, tray, glass, section);
    usePanelAnimation(scene, digital);

    return <primitive object={scene} position-y={-3} castShadow />;
};

export default AirFryer;
