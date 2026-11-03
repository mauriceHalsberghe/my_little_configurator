import { useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collectParts, type Part } from "./parts";

const TRAY_1 = ["Tray1_Handle", "Tray1_Container"];
const TRAY_2 = ["Tray2_Handle", "Tray2_Container"];

const SLIDE = { axis: "z" as "x" | "y" | "z", distance: 2 };

const TIMING = { slideOut: 0.5, fadeOut: 0.5, fadeIn: 0.5, slideIn: 0.5 };

// Flatten each part into its material list so we can fade opacity and depth writes together.
const mats = (parts: Part[]) => parts.flatMap((p) => p.mats);

const positions = (parts: Part[]) => parts.map((p) => p.obj.position);
const setVisible = (parts: Part[], v: boolean) => parts.forEach((p) => (p.obj.visible = v));

const setDepthWrite = (parts: Part[], v: boolean) =>
    mats(parts).forEach(({ material }) => (material.depthWrite = v));


const slideValue = (parts: Part[], out: boolean) => ({
    [SLIDE.axis]: (i: number) => parts[i].position[SLIDE.axis] + (out ? SLIDE.distance : 0),
});

export function useTrayAnimation(scene: THREE.Object3D, tray2: boolean) {

    const parts = useMemo(
        () => ({ tray1: collectParts(scene, TRAY_1), tray2: collectParts(scene, TRAY_2) }),
        [scene]
    );

    const current = useRef<boolean | null>(null);

    // Stores the running GSAP timeline so we can cancel or replay it when a new transition starts.
    const tl = useRef<gsap.core.Timeline | null>(null);

    useGSAP(() => {
        // Pick the tray that should become visible and the one that should leave.
        const incoming = tray2 ? parts.tray2 : parts.tray1;
        const outgoing = tray2 ? parts.tray1 : parts.tray2;

        // On the first pass, we skip the animation and instantly show the correct tray.
        // This avoids a blank state before the scene is initialized.
        if (current.current === null) {
            setVisible(incoming, true);
            setVisible(outgoing, false);
            current.current = tray2;
            return;
        }

        // If the same tray is already active, there is nothing to animate.
        if (current.current === tray2) return;

        // Update the remembered tray before building the new timeline.
        current.current = tray2;

        // If a previous transition is still running, finish it immediately so the next one starts cleanly.
        tl.current?.progress(1).kill();

        const { slideOut, fadeOut, fadeIn, slideIn } = TIMING;
        const tFadeOut = slideOut;
        const tFadeIn = tFadeOut + fadeOut;
        const tSlideIn = tFadeIn + fadeIn;

        // Cache materials for the outgoing and incoming trays so we can fade them independently.
        const outMats = mats(outgoing);
        const inMats = mats(incoming);

        // Create the transition timeline that drives the whole tray swap.
        const timeline = gsap.timeline();
        tl.current = timeline;

        // Phase 1: the currently visible tray slides outward to simulate it being pulled away.
        timeline.to(
            positions(outgoing),
            { ...slideValue(outgoing, true), duration: slideOut, ease: "power2.inOut" },
            0
        );

        // Phase 2: fade the outgoing tray completely before preparing the incoming tray.
        timeline.call(() => setDepthWrite(outgoing, false), undefined, tFadeOut);
        timeline.to(
            outMats.map((m) => m.material),
            { opacity: 0, duration: fadeOut, ease: "none" },
            tFadeOut
        );

        timeline.call(() => {
            setVisible(outgoing, false);
            outgoing.forEach(({ obj, position }) => obj.position.copy(position));
            outMats.forEach(({ material, opacity }) => (material.opacity = opacity));
            setDepthWrite(outgoing, true);
            incoming.forEach(({ obj, position }) => {
                obj.position[SLIDE.axis] = position[SLIDE.axis] + SLIDE.distance;
                obj.visible = true;
            });
            inMats.forEach(({ material }) => {
                material.opacity = 0;
                material.depthWrite = false;
            });
        }, undefined, tFadeIn);

        // Phase 3: fade the incoming tray in while it is still offset.
        timeline.to(
            inMats.map((m) => m.material),
            {
                opacity: (i: number) => inMats[i].opacity,
                duration: fadeIn,
                ease: "none",
            },
            tFadeIn
        );

        // Phase 4: once fully visible, restore depth writing and slide into place.
        timeline.call(() => setDepthWrite(incoming, true), undefined, tSlideIn);

        timeline.to(
            positions(incoming),
            { ...slideValue(incoming, false), duration: slideIn, ease: "power3.out" },
            tSlideIn
        );
    }, { dependencies: [parts, tray2] });
}
