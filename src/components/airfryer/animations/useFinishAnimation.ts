import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getMaterials } from "./parts";

const SHINY = { roughness: 0.1, clearcoat: 1, clearcoatRoughness: 0.03 };
const MATTE = { roughness: 0.55, clearcoat: 0 };

export function useFinishAnimation(scene: THREE.Object3D, materialName: string, shiny: boolean) {
    const first = useRef(true);

    useGSAP(() => {
        const mats = getMaterials<THREE.MeshPhysicalMaterial>(scene, materialName);
        if (!mats.length) return;
        const values = shiny ? SHINY : MATTE;

        if (first.current) {
            mats.forEach((m) => m.setValues(values));
            first.current = false;
            return;
        }
        gsap.to(mats, { ...values, duration: 0.6, overwrite: "auto" });
    }, { dependencies: [scene, shiny] });
}
