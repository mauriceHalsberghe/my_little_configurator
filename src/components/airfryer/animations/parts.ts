import * as THREE from "three";

export type Part = {
  obj: THREE.Object3D;
  position: THREE.Vector3; // rest position
  scale: THREE.Vector3;    // rest scale
  mats: { material: THREE.Material; opacity: number }[];
};

export function collectParts(scene: THREE.Object3D, names: string[]): Part[] {
  return names.flatMap((name) => {
    const obj = scene.getObjectByName(name);
    if (!obj) {
      console.warn(`Object not found: ${name}`);
      return [];
    }

    const mats: Part["mats"] = [];
    obj.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      // Own copy of every material, so fading this part never affects other meshes
      if (!child.userData.cloned) {
        child.material = Array.isArray(child.material)
          ? child.material.map((m: THREE.Material) => m.clone())
          : child.material.clone();
        child.userData.cloned = true;
      }

      for (const material of [child.material].flat() as THREE.Material[]) {
        material.transparent = true;
        material.needsUpdate = true; // required if the material was already compiled as opaque
        mats.push({ material, opacity: material.opacity });
      }
    });

    return [{ obj, position: obj.position.clone(), scale: obj.scale.clone(), mats }];
  });
}

// All materials with a given name, including the clones made above
export function getMaterials<T extends THREE.Material>(scene: THREE.Object3D, name: string): T[] {
  const found = new Set<T>();
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    for (const m of [o.material].flat() as THREE.Material[]) {
      if (m.name === name) found.add(m as T);
    }
  });
  return [...found];
}
