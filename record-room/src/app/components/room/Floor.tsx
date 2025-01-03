import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const Floor = () => {
  const textures = useTexture({
    colorMap: '/textures/wood084/color.jpg',
    normalMap: '/textures/wood084/normal.jpg',
  });

  React.useEffect(() => {
    [textures.colorMap, textures.normalMap].forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.5, 0.5);
      }
    });
  }, [textures]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[10, 8]} />
      <meshStandardMaterial 
        map={textures.colorMap}
        normalMap={textures.normalMap}
        normalScale={new THREE.Vector2(0.8, 0.8)}
        roughness={0.7}
      />
    </mesh>
  );
};