import { useState } from "react";
import arrowLeft from "../../../assets/arrow-left.svg";
import arrowRight from "../../../assets/arrow-right.svg";
import { COLORS } from "../../../config/colors";
import {
    CONFIGURATOR_SECTIONS,
    type ConfiguratorSection,
} from "../../../config/configuratorSections";
import { PRICING } from "../../../config/pricing";
import { useConfig } from "../../../store";

import Logo from "../logo/Logo";
import Navigation from "../navigation/Navigation";

import OptionGroup from "./OptionGroup";
import OrderModal from "../order-modal/OrderModal";
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
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
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
        reset,
    } = useConfig();

    const activeSectionIndex = CONFIGURATOR_SECTIONS.findIndex(
        ({ id }) => id === activeSection,
    );
    const activeStep = activeSectionIndex + 1;
    const isFirstSection = activeSectionIndex === 0;
    const isLastSection = activeSectionIndex === CONFIGURATOR_SECTIONS.length - 1;
    const previousSection = CONFIGURATOR_SECTIONS[activeSectionIndex - 1]?.id;
    const nextSection = CONFIGURATOR_SECTIONS[activeSectionIndex + 1]?.id;
    const totalPrice =
        PRICING.base +
        (shiny ? PRICING.shinyFinish : 0) +
        (tray ? PRICING.doubleTray : 0) +
        (digital ? PRICING.digitalInterface : 0) +
        (glass ? PRICING.glassWindow : 0);
    const orderItems = [
        { label: "Color", value: COLORS.find((option) => option.value === color)?.label ?? color },
        { label: "Finish", value: shiny ? "Shiny" : "Matte" },
        { label: "Tray", value: tray ? "Double" : "Single" },
        { label: "Interface", value: digital ? "Digital" : "Analog" },
        { label: "Viewing window", value: glass ? "Glass" : "No glass" },
    ];

    const completeOrder = () => {
        reset();
        onSelectSection("color");
        setHasStarted(false);
        setIsOrderModalOpen(false);
    };

    return (
        <>

            <Logo onReset={completeOrder} />

            {hasStarted && (
                <Navigation
                    activeSection={activeSection}
                    onSelectSection={onSelectSection}
                />
            )}

            <aside className={styles.configurator}>
                {!hasStarted ? (
                    <section className={styles["welcome"]}>
                        <div>
                            <p className={styles["welcome__eyebrow"]}>
                                fryday™ airfryer
                            </p>
                            <h1 className={styles["welcome__title"]}>
                                Make it <span>yours</span>.
                            </h1>
                            <p className={styles["welcome__description"]}>
                                Create an air fryer that fits your style. 
                                <br />
                                Choose its color, finish, tray, controls, and viewing
                                window, then preview your choices live on the 3D model.
                            </p>
                        </div>
                        <button
                            type="button"
                            className={`${styles.button} ${styles["welcome__start"]}`}
                            onClick={() => {
                                onSelectSection("color");
                                setHasStarted(true);
                            }}
                        >
                            Start customizing
                        </button>
                    </section>
                ) : (
                    <>

                <div className={styles["configurator__header"]} >
                    <h1 className={styles["configurator__title"]}>Customize your own</h1>
                    <h2 className={styles["configurator__subtitle"]}>Step {activeStep} / {CONFIGURATOR_SECTIONS.length}</h2>
                </div>

                <div
                    className={styles["configurator__steps"]}
                >
                    {CONFIGURATOR_SECTIONS.map((section, index) => (
                        <button
                            type="button"
                            key={section.id}
                            aria-label={`Go to step ${index + 1}: ${section.id}`}
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
                            onClick={() => onSelectSection(section.id)}
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
                            <img src={arrowLeft} alt="" />
                        </button>

                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => {
                                if (!isLastSection && nextSection) {
                                    onSelectSection(nextSection);
                                } else if (isLastSection) {
                                    setIsOrderModalOpen(true);
                                }
                            }}
                        >
                            { isLastSection ?
                                "Add to Cart" :
                                `Next Step: ${nextSection}`
                            }
                            <img src={arrowRight} alt="" />
                        </button>
                    </div>

                </footer>

                    </>
                )}
            </aside>
            {isOrderModalOpen && (
                <OrderModal
                    items={orderItems}
                    total={totalPrice}
                    onPay={completeOrder}
                    onClose={() => setIsOrderModalOpen(false)}
                />
            )}
        </>
    );
}