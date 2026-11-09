import { useEffect } from "react";
import styles from "./order-modal.module.css";

type OrderModalProps = {
    items: { label: string; value: string }[];
    total: number;
    onPay: () => void;
    onClose: () => void;
};

export default function OrderModal({
    items,
    total,
    onPay,
    onClose,
}: OrderModalProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div
            className={styles.overlay}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-modal-title"
            >
                <button
                    type="button"
                    className={styles.close}
                    aria-label="Close order summary"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 id="order-modal-title" className={styles.title}>
                    Your custom <span>fry<i>day</i>™  Airfryer</span>
                </h2>
                <ul className={styles.items}>
                    {items.map(({ label, value }) => (
                        <li className={styles.item} key={label}>
                            <span>{label}</span>
                            <span>{value}</span>
                        </li>
                    ))}
                </ul>
                <div className={styles.total}>
                    <span>Total</span>
                    <span>€ {total}.00</span>
                </div>
                <button
                    type="button"
                    className={styles.pay}
                    onClick={onPay}
                >
                    Pay (reset)
                </button>
            </section>
        </div>
    );
}
