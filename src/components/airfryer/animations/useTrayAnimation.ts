import { useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ConfiguratorSection } from "../../../config/configuratorSections";
import { collectParts, type Part } from "./parts";
import { settleTrayAnimation } from "./settleTrayAnimation";

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

const SLIDE = { axis: "z" as "x" | "y" | "z", distance: 3 };
const TRAY_SECTION_OPEN_OFFSET = 1.5;
const GLASS_TRANSITION_DURATION = 0.8;

const TIMING = { slideOut: 0.35, fadeOut: 0.4, fadeIn: 0.4, slideIn: 0.35 };

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

const slideValue = (parts: Part[], distance: number) => ({
  [SLIDE.axis]: (i: number) => parts[i].position[SLIDE.axis] + distance,
});

export function useTrayAnimation(
  scene: THREE.Object3D,
  tray2: boolean,
  glass: boolean,
  section: ConfiguratorSection,
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
  const currentSection = useRef<ConfiguratorSection | null>(null);

  // Stores the running GSAP timeline so we can cancel or replay it when a new transition starts.
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const allGlassParts = [...parts.glassTray1, ...parts.glassTray2];
      const trayOpenOffset = section === "trays" ? TRAY_SECTION_OPEN_OFFSET : 0;

      if (current.current === null || currentGlass.current !== glass) {
        if (current.current !== null && currentGlass.current !== glass) {
          tl.current?.kill();
          tl.current = null;
          settleTrayAnimation(
            parts,
            current.current,
            currentGlass.current ?? false,
            currentSection.current ?? section,
            SLIDE.axis,
            TRAY_SECTION_OPEN_OFFSET,
          );

          const activeTray = tray2 ? parts.tray2 : parts.tray1;
          const activeGlassTray = tray2 ? parts.glassTray2 : parts.glassTray1;
          const leaving = currentGlass.current ? activeGlassTray : activeTray;
          const entering = glass ? activeGlassTray : activeTray;

          setVisible(parts.tray1, false);
          setVisible(parts.tray2, false);
          setVisible(parts.glassTray1, false);
          setVisible(parts.glassTray2, false);

          setVisible(leaving, true);
          setVisible(entering, true);

          const leavingMats = mats(leaving);
          const enteringMats = mats(entering);

          setFading(leaving);
          setFading(entering);
          enteringMats.forEach(({ material }) => {
            material.opacity = 0;
          });

          const timeline = gsap.timeline();
          tl.current = timeline;

          timeline.to(
            leavingMats.map((m) => m.material),
            {
              opacity: 0,
              duration: GLASS_TRANSITION_DURATION,
              ease: "sine.inOut",
            },
            0,
          );

          timeline.to(
            enteringMats.map((m) => m.material),
            {
              opacity: (i: number) => enteringMats[i].opacity,
              duration: GLASS_TRANSITION_DURATION,
              ease: "sine.inOut",
            },
            0,
          );

          timeline.call(() => {
            setVisible(leaving, false);
            leavingMats.forEach(({ material, opacity }) => {
              material.opacity = opacity;
            });
            enteringMats.forEach(({ material, opacity }) => {
              material.opacity = opacity;
            });
            restoreMaterialState(leaving);
            restoreMaterialState(entering);
          }, undefined, GLASS_TRANSITION_DURATION);

          current.current = tray2;
          currentGlass.current = glass;
          currentSection.current = section;
          return;
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

        if (section === "trays") {
          const visibleTray = glass ? (tray2 ? parts.glassTray2 : parts.glassTray1) : tray2 ? parts.tray2 : parts.tray1;
          visibleTray.forEach(({ obj, position }) => {
            obj.position[SLIDE.axis] = position[SLIDE.axis] + trayOpenOffset;
          });
        }

        current.current = tray2;
        currentGlass.current = glass;
        currentSection.current = section;
        return;
      }

      // Pick the tray that should become visible and the one that should leave.
      const tray1 = glass ? parts.glassTray1 : parts.tray1;
      const tray2Parts = glass ? parts.glassTray2 : parts.tray2;
      const incoming = tray2 ? tray2Parts : tray1;
      const outgoing = tray2 ? tray1 : tray2Parts;

      if (current.current === tray2) {
        if (currentSection.current !== section) {
          const activeTray = glass
            ? tray2
              ? parts.glassTray2
              : parts.glassTray1
            : tray2
              ? parts.tray2
              : parts.tray1;

          tl.current?.kill();
          tl.current = null;
          settleTrayAnimation(
            parts,
            tray2,
            glass,
            currentSection.current ?? section,
            SLIDE.axis,
            TRAY_SECTION_OPEN_OFFSET,
          );
          tl.current = gsap.timeline().to(positions(activeTray), {
            ...slideValue(activeTray, trayOpenOffset),
            duration: 0.5,
            ease: "power2.inOut",
          });
          currentSection.current = section;
        }
        return;
      }

      // Stop and normalize the previous transition before changing the selection refs.
      tl.current?.kill();
      tl.current = null;
      settleTrayAnimation(
        parts,
        current.current ?? tray2,
        currentGlass.current ?? glass,
        currentSection.current ?? section,
        SLIDE.axis,
        TRAY_SECTION_OPEN_OFFSET,
      );
      current.current = tray2;
      currentSection.current = section;

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

      const incomingEndOffset = section === "trays" ? TRAY_SECTION_OPEN_OFFSET : 0;

      // Phase 1: the currently visible tray slides outward to simulate it being pulled away.
      timeline.to(
        positions(outgoing),
        {
          ...slideValue(outgoing, SLIDE.distance),
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
          ...slideValue(incoming, incomingEndOffset),
          duration: slideIn,
          ease: "power3.out",
        },
        tSlideIn,
      );
    },
    { dependencies: [parts, tray2, glass, section] },
  );
}
