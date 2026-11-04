import { COLORS } from "../../config/colors";
import { useConfig } from "../../store";
import Navigation, { type ConfiguratorSection } from "../navigation/Navigation";

import styles from "./configurator.module.css";

type ConfiguratorProps = {
  activeSection: ConfiguratorSection;
  onSelectSection: (section: ConfiguratorSection) => void;
};

export default function Configurator({
  activeSection,
  onSelectSection,
}: ConfiguratorProps) {
  const color = useConfig((s) => s.color);
  const setColor = useConfig((s) => s.setColor);

  const shiny = useConfig((s) => s.shiny);
  const setShiny = useConfig((s) => s.setShiny);

  const tray = useConfig((s) => s.tray);
  const setTray = useConfig((s) => s.setTray);

  const digital = useConfig((s) => s.digital);
  const setDigital = useConfig((s) => s.setDigital);

  const glass = useConfig((s) => s.glass);
  const setGlass = useConfig((s) => s.setGlass);

  return (
    <>
      <Navigation
        activeSection={activeSection}
        onSelectSection={onSelectSection}
      />

      <aside className={styles.configurator}>
        <h1 className={styles["configurator__title"]}>Customize your own</h1>

        {activeSection === "color" && (
          <div className={styles["configurator__section"]}>
            <h2 className={styles["configurator__section-heading"]}>Color</h2>
            {COLORS.map((c) => (
              <label
                className={styles["configurator__option-label"]}
                key={c.value}
              >
                <span className={styles["configurator__option-name"]}>
                  {c.label}
                </span>
                <input
                  type="radio"
                  name="color"
                  value={c.value}
                  checked={color === c.value}
                  onChange={() => setColor(c.value)}
                />
              </label>
            ))}
          </div>
        )}

        {activeSection === "finish" && (
          <div className={styles["configurator__section"]}>
            <h2 className={styles["configurator__section-heading"]}>Finish</h2>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>Shiny</span>
              <input
                type="radio"
                name="shiny"
                checked={shiny}
                onChange={() => setShiny(true)}
              />
            </label>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>Matte</span>
              <input
                type="radio"
                name="shiny"
                checked={!shiny}
                onChange={() => setShiny(false)}
              />
            </label>
          </div>
        )}

        {activeSection === "trays" && (
          <div className={styles["configurator__section"]}>
            <h2 className={styles["configurator__section-heading"]}>Trays</h2>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>
                Single
              </span>
              <input
                type="radio"
                name="tray"
                checked={!tray}
                onChange={() => setTray(false)}
              />
            </label>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>
                Double
              </span>
              <input
                type="radio"
                name="tray"
                checked={tray}
                onChange={() => setTray(true)}
              />
            </label>
          </div>
        )}

        {activeSection === "interface" && (
          <div
            className={`${styles["configurator__section"]} ${styles["configurator__section--last"]}`}
          >
            <h2 className={styles["configurator__section-heading"]}>
              Interface
            </h2>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>
                Analog
              </span>
              <input
                type="radio"
                name="digital"
                checked={!digital}
                onChange={() => setDigital(false)}
              />
            </label>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>
                Digital
              </span>
              <input
                type="radio"
                name="digital"
                checked={digital}
                onChange={() => setDigital(true)}
              />
            </label>
          </div>
        )}

        {activeSection === "glass" && (
          <div
            className={`${styles["configurator__section"]} ${styles["configurator__section--last"]}`}
          >
            <h2 className={styles["configurator__section-heading"]}>Glass</h2>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>
                No glass
              </span>
              <input
                type="radio"
                name="glass"
                checked={!glass}
                onChange={() => setGlass(false)}
              />
            </label>
            <label className={styles["configurator__option-label"]}>
              <span className={styles["configurator__option-name"]}>Glass</span>
              <input
                type="radio"
                name="glass"
                checked={glass}
                onChange={() => setGlass(true)}
              />
            </label>
          </div>
        )}
      </aside>
    </>
  );
}
