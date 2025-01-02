'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Floor = () => {
  const textures = useTexture({
    colorMap: '/textures/wood084/color.jpg',
    normalMap: '/textures/wood084/normal.jpg',
  });

  React.useEffect(() => {
    // Configure texture settings
    [textures.colorMap, textures.normalMap].forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.5, 0.5)  // Try values between 0.5 and 10
        console.log(`Texture ${texture.source.data.src} configured`);
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

const Scene = () => {
  return (
    <>
      <Floor />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <gridHelper args={[10, 10]} position={[0, 0.01, 0]} />
    </>
  );
};

const FloorTestScene = () => {
  return (
    <div className="h-screen w-full relative">
      <Canvas camera={{ position: [4, 4, 4], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls minDistance={2} maxDistance={10} />
          <Environment preset="apartment" />
        </Suspense>
      </Canvas>

      <div className="absolute bottom-4 left-4 bg-black/50 text-white p-4 rounded">
        <p>Camera: Orbit to inspect the floor texture</p>
        <p>Grid: Each square = 1 unit</p>
      </div>
    </div>
  );
};

export default FloorTestScene;