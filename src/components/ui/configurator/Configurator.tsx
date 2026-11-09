import { COLORS } from "../../../config/colors";
import { PRICING } from "../../../config/pricing";
import { useConfig } from "../../../store";
import Logo from "../logo/Logo";
import Navigation, { type ConfiguratorSection } from "../navigation/Navigation";

import OptionGroup from "./OptionGroup";
import styles from "./configurator.module.css";

const FINISH_OPTIONS = [
    { label: "Shiny", value: true, price: PRICING.shinyFinish },
    { label: "Matte", value: false, price: 0 },
];

const TRAY_OPTIONS = [
    { label: "Single", value: false, price: 0 },
    { label: "Double", value: true, price: PRICING.doubleTray },
];

const INTERFACE_OPTIONS = [
    { label: "Analog", value: false, price: 0 },
    { label: "Digital", value: true, price: PRICING.digitalInterface },
];

const GLASS_OPTIONS = [
    { label: "No glass", value: false, price: 0 },
    { label: "Glass", value: true, price: PRICING.glassWindow },
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

    const activeStep = sectionOrder.indexOf(activeSection) + 1;
    const isFirstSection = activeStep === 1;
    const isLastSection = activeStep === sectionOrder.length;
    const previousSection = sectionOrder[activeStep - 2];
    const nextSection = sectionOrder[activeStep];
    const totalPrice =
        PRICING.base +
        (shiny ? PRICING.shinyFinish : 0) +
        (tray ? PRICING.doubleTray : 0) +
        (digital ? PRICING.digitalInterface : 0) +
        (glass ? PRICING.glassWindow : 0);

    return (
        <>

            <Logo />

            <Navigation
                activeSection={activeSection}
                onSelectSection={onSelectSection}
            />

            <aside className={styles.configurator}>

                <div className={styles["configurator__header"]} >
                    <h1 className={styles["configurator__title"]}>Customize your own</h1>
                    <h2 className={styles["configurator__subtitle"]}>Step {activeStep} / {sectionOrder.length}</h2>
                </div>

                <div
                    className={styles["configurator__steps"]}
                >
                    {sectionOrder.map((section, index) => (
                        <button
                            type="button"
                            key={section}
                            aria-label={`Go to step ${index + 1}: ${section}`}
                            aria-current={
                                index === activeStep - 1 ? "step" : undefined
                            }
                            className={[
                                styles["configurator__step"],
                                index === activeStep - 1
                                    ? styles["configurator__step--active"]
                                    : "",
                                index < activeStep - 1
                                    ? styles["configurator__step--completed"]
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(" ")}
                            onClick={() => onSelectSection(section)}
                        />
                    ))}
                </div>

                {activeSection === "color" && (
                    <OptionGroup
                        title="Choose your color"
                        subtitle="Pick a color that suits your kitchen and style."
                        name="color"
                        options={COLORS}
                        value={color}
                        onChange={setColor}
                        showColorSwatches
                    />
                )}

                {activeSection === "finish" && (
                    <OptionGroup
                        title="Select a finish"
                        subtitle="Choose a glossy shine or a smooth matte look."
                        name="shiny"
                        options={FINISH_OPTIONS}
                        value={shiny}
                        onChange={setShiny}
                    />
                )}

                {activeSection === "trays" && (
                    <OptionGroup
                        title="Tray configuration"
                        subtitle="Choose the capacity that works best for you."
                        name="tray"
                        options={TRAY_OPTIONS}
                        value={tray}
                        onChange={setTray}
                    />
                )}

                {activeSection === "interface" && (
                    <OptionGroup
                        title="Control type"
                        subtitle="Select the controls that feel right for your cooking."
                        name="digital"
                        options={INTERFACE_OPTIONS}
                        value={digital}
                        onChange={setDigital}
                    />
                )}

                {activeSection === "glass" && (
                    <OptionGroup
                        title="Viewing window"
                        subtitle="Add a glass window to see your food as it cooks."
                        name="glass"
                        options={GLASS_OPTIONS}
                        value={glass}
                        onChange={setGlass}
                    />
                )}

                <footer className={styles["configurator__footer"]}>

                    <div className={styles["configurator__price-row"]}>
                        <p className={styles["configurator__price-label"]}>Total</p>
                        <p className={styles["configurator__price-value"]}>€ {totalPrice}.00</p>
                    </div>

                    <div className={styles["configurator__actions"]}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles["button--previous"]}`}
                            aria-label="Previous step"
                            disabled={isFirstSection}
                            onClick={() => {
                                if (previousSection) {
                                    onSelectSection(previousSection);
                                }
                            }}
                        >
                            <img src="./src/assets/arrow-left.svg" alt="" />
                        </button>

                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => {
                                if (!isLastSection && nextSection) {
                                    onSelectSection(nextSection);
                                }
                            }}
                        >
                            { isLastSection ?
                                "Add to Cart" :
                                `Next Step: ${nextSection}`
                            }
                            <img src="./src/assets/arrow-right.svg" alt="" />
                        </button>
                    </div>

                </footer>

            </aside>
        </>
    );
}