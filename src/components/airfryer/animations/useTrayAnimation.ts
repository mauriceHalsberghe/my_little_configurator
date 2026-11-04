import { useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collectParts, type Part } from "./parts";

const TRAY_1 = ["Tray1_Handle", "Tray1_Container"];
const TRAY_2 = ["Tray2_Handle", "Tray2_Container"];
const GLASS_TRAY_1 = [
  "Tray1_Handle_glass",
  "Tray1_Container_glass",
  "Tray_1_panel_glass",
];
const GLASS_TRAY_2 = [
  "Tray2_Handle_glass",
  "Tray2_Container_glass",
  "Tray_2_panel_glass",
];

const SLIDE = { axis: "z" as "x" | "y" | "z", distance: 2 };

const TIMING = { slideOut: 0.5, fadeOut: 0.5, fadeIn: 0.5, slideIn: 0.5 };

// Flatten each part into its material list so we can fade opacity and depth writes together.
const mats = (parts: Part[]) => parts.flatMap((p) => p.mats);

const positions = (parts: Part[]) => parts.map((p) => p.obj.position);
const setVisible = (parts: Part[], v: boolean) =>
  parts.forEach((p) => (p.obj.visible = v));

const setFading = (parts: Part[]) =>
  mats(parts).forEach(({ material }) => {
    if (!material.transparent) {
      material.transparent = true;
      material.needsUpdate = true;
    }
    material.depthWrite = false;
  });

const restoreMaterialState = (parts: Part[]) =>
  mats(parts).forEach(({ material, transparent, depthWrite }) => {
    if (material.transparent !== transparent) {
      material.transparent = transparent;
      material.needsUpdate = true;
    }
    material.depthWrite = depthWrite;
  });

const slideValue = (parts: Part[], out: boolean) => ({
  [SLIDE.axis]: (i: number) =>
    parts[i].position[SLIDE.axis] + (out ? SLIDE.distance : 0),
});

export function useTrayAnimation(
  scene: THREE.Object3D,
  tray2: boolean,
  glass: boolean,
) {
  const parts = useMemo(
    () => ({
      tray1: collectParts(scene, TRAY_1),
      tray2: collectParts(scene, TRAY_2),
      glassTray1: collectParts(scene, GLASS_TRAY_1),
      glassTray2: collectParts(scene, GLASS_TRAY_2),
    }),
    [scene],
  );

  const current = useRef<boolean | null>(null);
  const currentGlass = useRef<boolean | null>(null);

  // Stores the running GSAP timeline so we can cancel or replay it when a new transition starts.
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const allGlassParts = [...parts.glassTray1, ...parts.glassTray2];

      if (current.current === null || currentGlass.current !== glass) {
        if (current.current !== null && currentGlass.current !== glass) {
          tl.current?.progress(1).kill();
        }

        if (glass) {
          setVisible(parts.tray1, false);
          setVisible(parts.tray2, false);
        } else {
          setVisible(tray2 ? parts.tray2 : parts.tray1, true);
          setVisible(tray2 ? parts.tray1 : parts.tray2, false);
        }

        setVisible(allGlassParts, glass);
        setVisible(tray2 ? parts.glassTray1 : parts.glassTray2, false);
        current.current = tray2;
        currentGlass.current = glass;
        return;
      }

      // Pick the tray that should become visible and the one that should leave.
      const tray1 = glass ? parts.glassTray1 : parts.tray1;
      const tray2Parts = glass ? parts.glassTray2 : parts.tray2;
      const incoming = tray2 ? tray2Parts : tray1;
      const outgoing = tray2 ? tray1 : tray2Parts;

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
        {
          ...slideValue(outgoing, true),
          duration: slideOut,
          ease: "power2.inOut",
        },
        0,
      );

      // Phase 2: fade the outgoing tray completely before preparing the incoming tray.
      timeline.call(() => setFading(outgoing), undefined, tFadeOut);
      timeline.to(
        outMats.map((m) => m.material),
        { opacity: 0, duration: fadeOut, ease: "none" },
        tFadeOut,
      );

      timeline.call(
        () => {
          setVisible(outgoing, false);
          outgoing.forEach(({ obj, position }) => obj.position.copy(position));
          outMats.forEach(
            ({ material, opacity }) => (material.opacity = opacity),
          );
          restoreMaterialState(outgoing);
          incoming.forEach(({ obj, position }) => {
            obj.position[SLIDE.axis] = position[SLIDE.axis] + SLIDE.distance;
            obj.visible = true;
          });
          setFading(incoming);
          inMats.forEach(({ material }) => {
            material.opacity = 0;
          });
        },
        undefined,
        tFadeIn,
      );

      // Phase 3: fade the incoming tray in while it is still offset.
      timeline.to(
        inMats.map((m) => m.material),
        {
          opacity: (i: number) => inMats[i].opacity,
          duration: fadeIn,
          ease: "none",
        },
        tFadeIn,
      );

      // Phase 4: once fully visible, restore depth writing and slide into place.
      timeline.call(() => restoreMaterialState(incoming), undefined, tSlideIn);

      timeline.to(
        positions(incoming),
        {
          ...slideValue(incoming, false),
          duration: slideIn,
          ease: "power3.out",
        },
        tSlideIn,
      );
    },
    { dependencies: [parts, tray2, glass] },
  );
}
