import { useMemo, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { collectParts } from "./parts";

const ANALOG = ["Knob", "Interface_analog_screen"];
const DIGITAL = ["Interface_digital", "Interface_digital_texture"];

// These timing values define how fast each part of the panel transition plays.
// They are named by their role in the sequence, not by the object they animate.
// - fade: how quickly the panel layer fades in or out
// - knobPop: how long the knob's gentle scale motion takes
// - knobSettle: the short settle duration used to return the knob to its resting size
// - digitalIn: how slowly the digital panel scales into view
// - digitalOut: how slowly the digital panel scales back out of view
const TIMING = {
  fade: 0.24,
  knobPop: 0.22,
  knobSettle: 0.14,
  digitalIn: 0.5,
  digitalOut: 0.45,
};

type PanelPart = ReturnType<typeof collectParts>[number];

const setVisible = (parts: PanelPart[], visible: boolean) => {
  parts.forEach(({ obj }) => {
    obj.visible = visible;
  });
};

const resetParts = (parts: PanelPart[]) => {
  parts.forEach(({ obj, scale, mats }) => {
    obj.scale.copy(scale);

    mats.forEach(({ material, opacity, transparent, depthWrite }) => {
      material.opacity = opacity;
      if (material.transparent !== transparent) {
        material.transparent = transparent;
        material.needsUpdate = true;
      }
      material.depthWrite = depthWrite;
    });
  });
};

const prepareFade = (part: PanelPart) => {
  part.mats.forEach(({ material }) => {
    material.transparent = true;
    material.depthWrite = false;
    material.needsUpdate = true;
  });
};

// Fade an object out and hide it when the fade is finished.
const fadeOut = (
  timeline: gsap.core.Timeline,
  part: PanelPart,
  position: number,
) => {
  prepareFade(part);

  timeline.to(
    part.mats.map(({ material }) => material),
    {
      opacity: 0,
      duration: TIMING.fade,
      ease: "none",
    },
    position,
  );

  timeline.set(part.obj, { visible: false }, position + TIMING.fade);
};

// Show an object and fade its materials in.
const fadeIn = (
  timeline: gsap.core.Timeline,
  part: PanelPart,
  position: number,
) => {
  prepareFade(part);

  part.mats.forEach(({ material }) => {
    material.opacity = 0;
  });

  timeline.set(part.obj, { visible: true }, position);

  timeline.to(
    part.mats.map(({ material }) => material),
    {
      opacity: (i: number) => part.mats[i].opacity,
      duration: TIMING.fade,
      ease: "none",
    },
    position,
  );
};

// Scale an object down until it disappears.
const scaleOut = (
  timeline: gsap.core.Timeline,
  part: PanelPart,
  position: number,
) => {
  timeline.to(
    part.obj.scale,
    {
      x: 0,
      y: 0,
      z: 0,
      duration: TIMING.digitalOut,
      ease: "power2.in",
    },
    position,
  );

  timeline.set(part.obj, { visible: false }, position + TIMING.digitalOut);
};

// Scale the knob out until it disappears.
const scaleOutKnob = (
  timeline: gsap.core.Timeline,
  part: PanelPart,
  position: number,
  initiallyVisible: boolean,
) => {
  if (!initiallyVisible) {
    timeline.set(part.obj, { visible: true }, position);
  }

  timeline.to(
    part.obj.scale,
    {
      x: 0.18,
      y: 0.18,
      z: 0.18,
      duration: TIMING.knobPop,
      ease: "power2.in",
    },
    position,
  );

  timeline.set(part.obj, { visible: false }, position + TIMING.knobPop);
};

// Scale the knob in from zero to its resting size.
const scaleInKnob = (
  timeline: gsap.core.Timeline,
  part: PanelPart,
  position: number,
  initiallyHidden: boolean,
) => {
  if (initiallyHidden) {
    timeline.set(part.obj, { visible: true }, position);

    timeline.set(part.obj.scale, { x: 0, y: 0, z: 0 }, position);
  }

  timeline.to(
    part.obj.scale,
    {
      x: part.scale.x,
      y: part.scale.y,
      z: part.scale.z,
      duration: TIMING.knobPop,
      ease: "power2.out",
    },
    position,
  );
};

// Scale the digital interface up from zero.
const scaleIn = (
  timeline: gsap.core.Timeline,
  part: PanelPart,
  position: number,
) => {
  timeline.set(part.obj, { visible: true }, position);

  timeline.set(part.obj.scale, { x: 0, y: 0, z: 0 }, position);

  timeline.to(
    part.obj.scale,
    {
      x: part.scale.x,
      y: part.scale.y,
      z: part.scale.z,
      duration: TIMING.digitalIn,
      ease: "back.out(1.7)",
    },
    position,
  );
};

export function usePanelAnimation(scene: THREE.Object3D, digital: boolean) {
  const parts = useMemo(
    () => ({
      analog: collectParts(scene, ANALOG),
      digital: collectParts(scene, DIGITAL),
    }),
    [scene],
  );

  const current = useRef<boolean | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const { analog, digital: digitalParts } = parts;

      const analogScreen = analog.find(
        ({ obj }) => obj.name === "Interface_analog_screen",
      );

      const knob = analog.find(({ obj }) => obj.name === "Knob");

      const digitalInterface = digitalParts.find(
        ({ obj }) => obj.name === "Interface_digital",
      );

      const digitalTexture = digitalParts.find(
        ({ obj }) => obj.name === "Interface_digital_texture",
      );

      if (!analogScreen || !knob || !digitalInterface || !digitalTexture) {
        console.error(
          "PanelAnimation: One or more panel objects were not found.",
        );
        return;
      }

      // Initial setup: show the correct panel without animation.
      if (current.current === null) {
        setVisible(digital ? digitalParts : analog, true);
        setVisible(digital ? analog : digitalParts, false);

        resetParts(analog);
        resetParts(digitalParts);

        current.current = digital;
        return;
      }

      if (current.current === digital) return;

      // Finish an existing transition before starting a new one.
      tl.current?.progress(1).kill();

      current.current = digital;

      const timeline = gsap.timeline({
        onComplete: () => {
          // Restore the final visibility and original transforms.
          if (digital) {
            setVisible(analog, false);
            setVisible(digitalParts, true);
          } else {
            setVisible(digitalParts, false);
            setVisible(analog, true);
          }

          resetParts(analog);
          resetParts(digitalParts);
        },
      });

      tl.current = timeline;

      if (digital) {
        // =====================================
        // ANALOG -> DIGITAL
        // =====================================

        // 1. The analog screen fades out first.
        fadeOut(timeline, analogScreen, 0);

        // 2. The knob scales out while the old display is disappearing.
        scaleOutKnob(timeline, knob, TIMING.fade * 0.9, true);

        // 3. The digital interface scales in after the knob has left.
        scaleIn(
          timeline,
          digitalInterface,
          TIMING.fade + TIMING.knobPop + 0.06,
        );

        // 4. The digital texture fades in last.
        fadeIn(
          timeline,
          digitalTexture,
          TIMING.fade + TIMING.knobPop + TIMING.digitalIn + 0.08,
        );
      } else {
        // =====================================
        // DIGITAL -> ANALOG
        // =====================================

        // 1. The digital texture fades out first.
        fadeOut(timeline, digitalTexture, 0);

        // 2. The digital interface scales out.
        scaleOut(timeline, digitalInterface, TIMING.fade * 0.9);

        // 3. The knob scales in after the digital interface is removed.
        scaleInKnob(
          timeline,
          knob,
          TIMING.fade + TIMING.digitalOut + 0.05,
          true,
        );

        // 4. The analog screen fades in last.
        fadeIn(
          timeline,
          analogScreen,
          TIMING.fade + TIMING.digitalOut + TIMING.knobPop + 0.1,
        );
      }
    },
    { dependencies: [parts, digital] },
  );
}
