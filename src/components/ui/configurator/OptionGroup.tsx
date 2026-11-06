import styles from "./configurator.module.css";

type Option<T> = { label: string; value: T };

type OptionGroupProps<T> = {
    title: string;
    subtitle: string;
    name: string;
    options: readonly Option<T>[];
    value: T;
    onChange: (value: T) => void;
};

export default function OptionGroup<T extends string | boolean>({
    title,
    subtitle,
    name,
    options,
    value,
    onChange,
}: OptionGroupProps<T>) {
    return (
        <div className={styles["configurator__section"]}>

            <h2 className={styles["configurator__section-heading"]}>{title}</h2>

            <p className={styles["configurator__section-subtitle"]}>{subtitle}</p>

            <div className={styles["configurator__options"]}>

                {options.map((option) => (
                    <label
                        className={styles["configurator__option-label"]}
                        key={String(option.value)}
                    >
                    <span>
                        {option.label}
                    </span>
                    <input
                        type="radio"
                        name={name}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                    />
                    </label>
                ))}
            </div>

        </div>
    );
}
