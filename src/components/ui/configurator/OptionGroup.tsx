import styles from "./configurator.module.css";

type Option<T> = { label: string; value: T; price?: number };

type OptionGroupProps<T> = {
    title: string;
    subtitle: string;
    name: string;
    options: readonly Option<T>[];
    value: T;
    onChange: (value: T) => void;
    showColorSwatches?: boolean;
};

export default function OptionGroup<T extends string | boolean>({
    title,
    subtitle,
    name,
    options,
    value,
    onChange,
    showColorSwatches = false,
}: OptionGroupProps<T>) {
    return (
        <div className={styles["configurator__section"]}>

            <h2 className={styles["configurator__section-heading"]}>{title}</h2>

            <p className={styles["configurator__section-subtitle"]}>{subtitle}</p>

            <div
                className={styles["configurator__options"]}
                role="radiogroup"
                aria-label={title}
            >

                {options.map((option) => (
                    <label
                        className={styles["configurator__option-label"]}
                        key={String(option.value)}
                    >
                        <span className={styles["configurator__option-name"]}>
                            {showColorSwatches && typeof option.value === "string" && (
                                <span
                                    className={styles["configurator__color-swatch"]}
                                    style={{ backgroundColor: option.value }}
                                    aria-hidden="true"
                                />
                            )}
                            {option.label}
                        </span>

                        <input
                            type="radio"
                            name={name}
                            checked={value === option.value}
                            onChange={() => onChange(option.value)}
                        />

                        {option.price !== undefined && (
                            <span className={styles["configurator__option-price"]}>
                                {option.price === 0
                                    ? ""
                                    : `+ € ${option.price}.00`}
                            </span>
                        )}
                    </label>
                ))}
            </div>

        </div>
    );
}
