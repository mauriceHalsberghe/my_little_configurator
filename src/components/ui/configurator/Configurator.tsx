import { COLORS } from "../../../config/colors";
import { useConfig } from "../../../store";
import Navigation, { type ConfiguratorSection } from "../navigation/Navigation";

import OptionGroup from "./OptionGroup";
import styles from "./configurator.module.css";

const FINISH_OPTIONS = [
    { label: "Shiny", value: true },
    { label: "Matte", value: false },
];

const TRAY_OPTIONS = [
    { label: "Single", value: false },
    { label: "Double", value: true },
];

const INTERFACE_OPTIONS = [
    { label: "Analog", value: false },
    { label: "Digital", value: true },
];

const GLASS_OPTIONS = [
    { label: "No glass", value: false },
    { label: "Glass", value: true },
];

type ConfiguratorProps = {
    activeSection: ConfiguratorSection;
    onSelectSection: (section: ConfiguratorSection) => void;
};

export default function Configurator({
    activeSection,
    onSelectSection,
}: ConfiguratorProps) {
    const {
        color,
        setColor,
        shiny,
        setShiny,
        tray,
        setTray,
        digital,
        setDigital,
        glass,
        setGlass,
    } = useConfig();

    const sectionOrder: ConfiguratorSection[] = [
        "color",
        "finish",
        "trays",
        "interface",
        "glass",
    ];

    const isLastSection = activeSection === "glass";
    const nextSection = sectionOrder[sectionOrder.indexOf(activeSection) + 1];

    return (
        <>
            <Navigation
                activeSection={activeSection}
                onSelectSection={onSelectSection}
            />

            <aside className={styles.configurator}>
                <h1 className={styles["configurator__title"]}>Customize your own</h1>

                {activeSection === "color" && (
                    <OptionGroup
                        title="Color"
                        name="color"
                        options={COLORS}
                        value={color}
                        onChange={setColor}
                    />
                )}

                {activeSection === "finish" && (
                    <OptionGroup
                        title="Finish"
                        name="shiny"
                        options={FINISH_OPTIONS}
                        value={shiny}
                        onChange={setShiny}
                    />
                )}

                {activeSection === "trays" && (
                    <OptionGroup
                        title="Trays"
                        name="tray"
                        options={TRAY_OPTIONS}
                        value={tray}
                        onChange={setTray}
                    />
                )}

                {activeSection === "interface" && (
                    <OptionGroup
                        title="Interface"
                        name="digital"
                        options={INTERFACE_OPTIONS}
                        value={digital}
                        onChange={setDigital}
                    />
                )}

                {activeSection === "glass" && (
                    <OptionGroup
                        title="Glass"
                        name="glass"
                        options={GLASS_OPTIONS}
                        value={glass}
                        onChange={setGlass}
                    />
                )}

                <button
                    type="button"
                    className={styles.button}
                    onClick={() => {
                        if (!isLastSection && nextSection) {
                            onSelectSection(nextSection);
                        }
                    }}
                >
                    {isLastSection ? "Add to Cart" : "Next"}
                </button>
            </aside>
        </>
    );
}