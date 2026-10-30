import { ContactShadows, OrbitControls } from "@react-three/drei";
import AirFryer from "../airfryer/AirFryer";
import Floor from "../floor/Floor";
import LightSetup from "./LightSetup";

const Experience = () => {
  return (
    <>
      <OrbitControls makeDefault />
      
      <AirFryer />
      <Floor />
      <ContactShadows position={[0, -3, 0]} opacity={0.5} blur={2.5} far={3} scale={10} />
      <LightSetup />
    </>
  );
};

export default Experience;