import styles from './navigation.module.css'
import {
    CONFIGURATOR_SECTIONS,
    type ConfiguratorSection,
} from "../../../config/configuratorSections";

type NavigationProps = {
    activeSection: ConfiguratorSection;
    onSelectSection: (section: ConfiguratorSection) => void;
};

export default function Navigation ({ activeSection, onSelectSection }: NavigationProps) {
    return (
        <nav className={styles.navigation}>
            {CONFIGURATOR_SECTIONS.map(({ id, label }, index) => (
                <button
                    className={`${styles["navigation__item"]} ${activeSection === id ? styles["navigation__item--active"] : ""}`}
                    key={id}
                    type="button"
                    aria-pressed={activeSection === id}
                    onClick={() => onSelectSection(id)}
                >
                    <span>{index + 1}</span>
                    {label}
                </button>
            ))}
        </nav>
    )
}