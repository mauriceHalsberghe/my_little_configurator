import { useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useConfig } from "../../store";

const setVisible = (root: THREE.Object3D, names: string[], visible: boolean) => {
  names.forEach((name) => {
    const obj = root.getObjectByName(name);
    if (obj) obj.visible = visible;
    else console.warn(`Object not found: ${name}`);
  });
};

const AirFryer = () => {

    const { scene, materials } = useGLTF('./models/airfryer_model_v003.glb');
    const color = useConfig((s) => s.color);
    const shiny = useConfig((s) => s.shiny);
    const tray = useConfig((s) => s.tray);
    const digital = useConfig((s) => s.digital);

    const redPlastic = materials["Red plastic"] as THREE.MeshPhysicalMaterial | undefined;

    useEffect(() => {
        scene.traverse((object) => {
            if (object instanceof THREE.Mesh) object.castShadow = true;
        });
    }, [scene]);

    //COLOR
    useEffect(() => {
        redPlastic?.color.set(color);
    }, [redPlastic, color]);

    // FINISH
    useEffect(() => {
        redPlastic?.setValues(
        shiny
            ? { roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03 }
            : { roughness: 0.5, clearcoat: 0 }
        );
    }, [redPlastic, shiny]);

    // TRAY
    useEffect(() => {
        setVisible(scene, ["Tray1_Handle", "Tray1_Container"], !tray);
        setVisible(scene, ["Tray2_Handle", "Tray2_Container"], tray);
    }, [scene, tray]);

    // PANEL
    useEffect(() => {
        setVisible(scene, ["Knob", "Interface_analog_screen"], !digital);
        setVisible(scene, ["Interface_digital", "Interface_digital_texture"], digital);
    }, [scene, digital]);

    return <primitive object={scene} position-y={-3} castShadow />;
}

export default AirFryer;