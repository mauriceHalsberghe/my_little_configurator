import styles from './navigation.module.css'

export type ConfiguratorSection = "color" | "finish" | "trays" | "interface" | "glass";

type NavigationProps = {
    activeSection: ConfiguratorSection;
    onSelectSection: (section: ConfiguratorSection) => void;
};

const sections: { id: ConfiguratorSection; label: string }[] = [
    { id: "color", label: "Color" },
    { id: "finish", label: "Finish" },
    { id: "trays", label: "Trays" },
    { id: "interface", label: "Interface" },
    { id: "glass", label: "Glass" },
];

export default function Navigation ({ activeSection, onSelectSection }: NavigationProps) {
    return (
        <nav className={styles.navigation}>
            {sections.map(({ id, label }, index) => (
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