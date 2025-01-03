import React from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { WindowView } from './WindowView';

interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  hasWindow?: boolean;
}

export const Wall = ({ position, rotation, size, hasWindow = false }: WallProps) => {
  const textures = useTexture({
    colorMap: '/record-room/textures/wood084/color.jpg',
    normalMap: '/record-room/textures/wood084/normal.jpg',
  });

  React.useEffect(() => {
    [textures.colorMap, textures.normalMap].forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.25, 0.25);
      }
    });
  }, [textures]);

  if (hasWindow) {
    return (
      <group position={position} rotation={rotation}>
        {/* Main wall */}
        <mesh>
          <planeGeometry args={size} />
          <meshStandardMaterial 
            map={textures.colorMap}
            normalMap={textures.normalMap}
            normalScale={new THREE.Vector2(0.8, 0.8)}
            roughness={0.7}
          />
        </mesh>
        
        {/* Window section */}
        <WindowView 
          position={[0, 0, 0.01]} 
          rotation={[0, 0, 0]} 
          size={[4, 6]}
        />
      </group>
    );
  }

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial 
        map={textures.colorMap}
        normalMap={textures.normalMap}
        normalScale={new THREE.Vector2(0.8, 0.8)}
        roughness={0.7}
      />
    </mesh>
  );
};
