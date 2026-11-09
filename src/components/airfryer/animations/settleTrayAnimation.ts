import type { ConfiguratorSection } from "../../../config/configuratorSections";
import type { Part } from "./parts";

type TrayGroups = {
    tray1: Part[];
    tray2: Part[];
    glassTray1: Part[];
    glassTray2: Part[];
};

type SlideAxis = "x" | "y" | "z";

export function settleTrayAnimation(
    groups: TrayGroups,
    tray2: boolean,
    glass: boolean,
    section: ConfiguratorSection,
    slideAxis: SlideAxis,
    sectionOffset: number,
) {
    const allGroups = [
        groups.tray1,
        groups.tray2,
        groups.glassTray1,
        groups.glassTray2,
    ];
    const selected = glass
        ? tray2
            ? groups.glassTray2
            : groups.glassTray1
        : tray2
            ? groups.tray2
            : groups.tray1;

    allGroups.forEach((group) => {
        group.forEach(({ obj, position, mats }) => {
            obj.position.copy(position);
            obj.visible = group === selected;

            mats.forEach(({ material, opacity, transparent, depthWrite }) => {
                const transparencyChanged = material.transparent !== transparent;
                material.opacity = opacity;
                material.transparent = transparent;
                material.depthWrite = depthWrite;

                if (transparencyChanged) {
                    material.needsUpdate = true;
                }
            });
        });
    });

    if (section === "trays") {
        selected.forEach(({ obj, position }) => {
            obj.position[slideAxis] = position[slideAxis] + sectionOffset;
        });
    }
}
