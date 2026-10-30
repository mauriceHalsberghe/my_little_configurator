import { useGLTF } from "@react-three/drei";


const Floor = () => {
    const { scene } = useGLTF('./models/floor.glb');

    return (

        <primitive object={scene} position-y={-3.001} castShadow />
    );
};

export default Floor;