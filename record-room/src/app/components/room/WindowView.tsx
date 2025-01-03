import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

interface WindowViewProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}

export const WindowView = ({ position, rotation, size }: WindowViewProps) => {
  const [envMap, setEnvMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new RGBELoader();
    loader.setDataType(THREE.HalfFloatType);
    loader.load('/record-room/textures/cityscapes/shanghai_bund_8k.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.needsUpdate = true;
      texture.flipY = true;
      setEnvMap(texture);
    });
  }, []);

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={size} />
        <meshPhysicalMaterial 
          envMap={envMap}
          envMapIntensity={3.5}
          metalness={0}
          roughness={0}
          transmission={1}
          thickness={0.1}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};