import * as THREE from "three";

export type SceneAsset = {
    id: string;
    url: string;
    position: [number, number, number];
    scale: number;
    rotationY: number;
    castShadow: boolean;
    receiveShadow: boolean;
};

const modelUrl = (fileName: string) =>
    `${import.meta.env.BASE_URL}models/${fileName}`;

export const AIRFRYER_ASSET: SceneAsset = {
    id: "airfryer",
    url: modelUrl("airfryer_model_v006.glb"),
    position: [0, -3, 0],
    scale: 1,
    rotationY: 0,
    castShadow: true,
    receiveShadow: true,
};

export const SCENE_ASSETS: SceneAsset[] = [
    {
        id: "floor",
        url: modelUrl("floor.glb"),
        position: [0, -3.001, 4],
        scale: 1,
        rotationY: 0,
        castShadow: false,
        receiveShadow: true,
    },
    {
        id: "wall",
        url: modelUrl("wall.glb"),
        position: [0, -4.65, 0],
        scale: 1,
        rotationY: 0,
        castShadow: false,
        receiveShadow: true,
    },
    {
        id: "salt-and-pepper-shakers",
        url: modelUrl("salt_and_pepper_shakers.glb"),
        position: [5, -3, -2],
        scale: 10,
        rotationY: -Math.PI / 8,
        castShadow: true,
        receiveShadow: false,
    },
    {
        id: "olive-oil",
        url: modelUrl("olive_oil.glb"),
        position: [8, -3.15, -1],
        scale: 0.1,
        rotationY: 0,
        castShadow: true,
        receiveShadow: false,
    },
    {
        id: "knives",
        url: modelUrl("knives.glb"),
        position: [-4.5, -3, -4],
        scale: 3,
        rotationY: Math.PI / 16,
        castShadow: true,
        receiveShadow: false,
    },
    {
        id: "plate",
        url: modelUrl("plate.glb"),
        position: [-5.5, -3, 2],
        scale: 0.01,
        rotationY: 0,
        castShadow: true,
        receiveShadow: true,
    },
    {
        id: "fries",
        url: modelUrl("fries.glb"),
        position: [-5.9, -2.85, 2.6],
        scale: 0.18,
        rotationY: 0,
        castShadow: true,
        receiveShadow: false,
    },
    {
        id: "pan",
        url: modelUrl("pan.glb"),
        position: [8, -1.5, -6.2],
        scale: 0.27,
        rotationY: -Math.PI / 2,
        castShadow: true,
        receiveShadow: false,
    },
];

export function applyAssetShadows(
    object: THREE.Object3D,
    asset: Pick<SceneAsset, "castShadow" | "receiveShadow">,
) {
    object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            if (asset.castShadow) child.castShadow = true;
            if (asset.receiveShadow) child.receiveShadow = true;
        }
    });
}
