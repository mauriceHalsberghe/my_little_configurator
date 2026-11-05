import styles from "./configurator.module.css";

type Option<T> = { label: string; value: T };

type OptionGroupProps<T> = {
    title: string;
    name: string;
    options: readonly Option<T>[];
    value: T;
    onChange: (value: T) => void;
};

export default function OptionGroup<T extends string | boolean>({
    title,
    name,
    options,
    value,
    onChange,
}: OptionGroupProps<T>) {
    return (
        <div className={styles["configurator__section"]}>

            <h2 className={styles["configurator__section-heading"]}>{title}</h2>

            {options.map((option) => (
                <label
                    className={styles["configurator__option-label"]}
                    key={String(option.value)}
                >
                <span className={styles["configurator__option-name"]}>
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
    );
}
