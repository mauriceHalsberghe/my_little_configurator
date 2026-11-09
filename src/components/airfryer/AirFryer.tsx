import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import type { ConfiguratorSection } from "../../config/configuratorSections";
import { AIRFRYER_ASSET, applyAssetShadows } from "../../config/sceneAssets";
import { useConfig } from "../../store";
import { useColorAnimation } from "./animations/useColorAnimation";
import { useFinishAnimation } from "./animations/useFinishAnimation";
import { useTrayAnimation } from "./animations/useTrayAnimation";
import { usePanelAnimation } from "./animations/usePanelAnimation";

const AirFryer = ({ section }: { section: ConfiguratorSection }) => {
    const { scene } = useLoader(
        GLTFLoader,
        AIRFRYER_ASSET.url,
    );
    const color = useConfig((s) => s.color);
    const shiny = useConfig((s) => s.shiny);
    const tray = useConfig((s) => s.tray);
    const digital = useConfig((s) => s.digital);
    const glass = useConfig((s) => s.glass);


    useEffect(() => {
        applyAssetShadows(scene, AIRFRYER_ASSET);
    }, [scene]);

    useColorAnimation(scene, "Red plastic", color);
    useFinishAnimation(scene, "Red plastic", shiny);
    useTrayAnimation(scene, tray, glass, section);
    usePanelAnimation(scene, digital);

    return (
        <primitive
            object={scene}
            position={AIRFRYER_ASSET.position}
            scale={AIRFRYER_ASSET.scale}
            rotation-y={AIRFRYER_ASSET.rotationY}
        />
    );
};

export default AirFryer;
