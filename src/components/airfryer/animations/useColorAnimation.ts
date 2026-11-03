import { useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { getMaterials } from "./parts";

export function useColorAnimation(scene: THREE.Object3D, materialName: string, color: string) {
    const first = useRef(true);

    useGSAP(() => {
        const mats = getMaterials<THREE.MeshPhysicalMaterial>(scene, materialName);
        if (!mats.length) return;
            const target = new THREE.Color(color);

        if (first.current) {
            mats.forEach((m) => m.color.copy(target));
            first.current = false;
            return;
        }
        gsap.to(mats.map((m) => m.color), {
            r: target.r, g: target.g, b: target.b,
            duration: 0.6, ease: "power2.out", overwrite: "auto",
        });
    }, { dependencies: [scene, color] });
}
