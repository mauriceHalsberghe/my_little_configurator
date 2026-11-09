import { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

const SCENE_MODELS = [
    "/models/floor.glb",
    "/models/wall.glb",
    "/models/salt_and_pepper_shakers.glb",
    "/models/olive_oil.glb",
    "/models/knives.glb",
    "/models/plate.glb",
    "/models/fries.glb",
    "/models/pan.glb",
];

const Scene = () => {
    const [
        floor,
        wall,
        saltAndPepper,
        oliveOil,
        knives,
        plate,
        fries,
        pan,
    ] = useLoader(GLTFLoader, SCENE_MODELS);
    const floorScene = floor.scene;
    const wallScene = wall.scene;
    const saltAndPepperScene = saltAndPepper.scene;
    const oliveOilScene = oliveOil.scene;
    const knivesScene = knives.scene;
    const plateScene = plate.scene;
    const friesScene = fries.scene;
    const panScene = pan.scene;

    useEffect(() => {
        floorScene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.receiveShadow = true;
        });
        wallScene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.receiveShadow = true;
        });
        saltAndPepperScene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.castShadow = true;
        });
        oliveOilScene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.castShadow = true;
        });
        knivesScene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.castShadow = true;
        });
        plateScene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                object.castShadow = true;
                object.receiveShadow = true;
            }
        });
        friesScene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.castShadow = true;
        });
        panScene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.castShadow = true;
        });
    }, [
        floorScene,
        wallScene,
        saltAndPepperScene,
        oliveOilScene,
        knivesScene,
        plateScene,
        friesScene,
        panScene,
    ]);

    return (
        <>
            <primitive object={floorScene} position={[0, -3.001, 4]} />
            <primitive object={wallScene} position={[0, -4.65, 0]}/>
            
            <primitive object={saltAndPepperScene} scale={10} position={[5, -3, -2]} rotation-y={- Math.PI / 8} />
            <primitive object={oliveOilScene} scale={0.1} position={[8, -3.15, -1]} />

            <primitive object={knivesScene} scale={3} position={[-4.5, -3, -4]} rotation-y={Math.PI / 16} />

            <primitive object={plateScene} scale={0.01} position={[-5.5, -3, 2]} />
            <primitive object={friesScene} scale={0.18} position={[-5.9, -2.85, 2.6]} />

            <primitive object={panScene} scale={0.27} position={[8, -1.5, -6.2]} rotation-y={-Math.PI / 2} />
        </>
    );
};

export default Scene;