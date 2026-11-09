import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { applyAssetShadows, SCENE_ASSETS } from "../../config/sceneAssets";

const Scene = () => {
    const models = useLoader(
        GLTFLoader,
        SCENE_ASSETS.map(({ url }) => url),
    );

    useEffect(() => {
        models.forEach(({ scene }, index) => {
            applyAssetShadows(scene, SCENE_ASSETS[index]);
        });
    }, [models]);

    return (
        <>
            {SCENE_ASSETS.map((asset, index) => (
                <primitive
                    key={asset.id}
                    object={models[index].scene}
                    position={asset.position}
                    scale={asset.scale}
                    rotation-y={asset.rotationY}
                />
            ))}
        </>
    );
};

export default Scene;