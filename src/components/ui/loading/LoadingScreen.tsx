import { useEffect } from "react";
import { useProgress } from "@react-three/drei";
import styles from "./loading-screen.module.css";
import Logo from "../logo/Logo";

type LoadingScreenProps = {
    onLoaded: () => void;
};

export default function LoadingScreen({ onLoaded }: LoadingScreenProps) {
    const { progress } = useProgress();

    useEffect(() => {
        if (progress < 100) return;

        const timeout = window.setTimeout(onLoaded, 200);
        return () => window.clearTimeout(timeout);
    }, [onLoaded, progress]);

    return (
        <div
            className={`${styles.screen} ${
                progress === 100 ? styles.fading : ""
            }`}
            role="status"
            aria-label="Loading"
        >
            <Logo variant="loading" />
            <div
                className={styles.track}
                role="progressbar"
                aria-label="Loading 3D scene"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress)}
            >
                <div
                    className={`${styles.progress} ${
                        progress === 0 ? styles.indeterminate : ""
                    }`}
                    style={progress > 0 ? { width: `${progress}%` } : undefined}
                />
            </div>
        </div>
    );
}
