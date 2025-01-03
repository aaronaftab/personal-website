'use client';

import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, useTexture, PointerLockControls, KeyboardControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

const Floor = () => {
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

interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  hasWindow?: boolean;
}

const Wall = ({ position, rotation, size, hasWindow = false }: WallProps) => {
  const textures = useTexture({
    colorMap: '/textures/wood084/color.jpg',
    normalMap: '/textures/wood084/normal.jpg',
  });

  React.useEffect(() => {
    [textures.colorMap, textures.normalMap].forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.25, 0.25); // Smaller repeat for walls
      }
    });
  }, [textures]);

  if (hasWindow) {
    return (
      <group position={position} rotation={rotation}>
        {/* Main wall with window hole */}
        <mesh>
          <planeGeometry args={size} />
          <meshStandardMaterial 
            map={textures.colorMap}
            normalMap={textures.normalMap}
            normalScale={new THREE.Vector2(0.8, 0.8)}
            roughness={0.7}
          />
        </mesh>
        
        {/* Window frame - slightly in front of wall */}
        <group position={[0, 0, 0.01]}>
          {/* Window glass */}
          <mesh>
            <planeGeometry args={[2.5, 3]} />
            <meshPhysicalMaterial 
              color="#FFFFFF"
              transparent
              opacity={0.1}
              transmission={0.9}
              thickness={0.05}
              roughness={0}
              metalness={0}
            />
          </mesh>
          
          {/* Window frame */}
          <mesh position={[0, 0, 0.02]}>
            <boxGeometry args={[2.7, 3.2, 0.1]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        </group>
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

const Ceiling = () => {
  const textures = useTexture({
    colorMap: '/textures/wood084/color.jpg',
    normalMap: '/textures/wood084/normal.jpg',
  });

  React.useEffect(() => {
    [textures.colorMap, textures.normalMap].forEach(texture => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.5, 0.4); // Adjusted for ceiling proportions
      }
    });
  }, [textures]);

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
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

// Define our keyboard controls schema
const controlSchema = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] }
];

const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const MOVEMENT_SPEED = 5;
  const JUMP_FORCE = 5;
  const GRAVITY = 9.81;
  
  const position = React.useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 0));
  const velocity = React.useRef<THREE.Vector3>(new THREE.Vector3());
  const isGrounded = React.useRef(true);

  const checkCollisions = (newPosition: THREE.Vector3): THREE.Vector3 => {
    // Room boundaries (adding 0.5 units as player "radius")
    const bounds = {
      minX: -4.5, // -5 + 0.5
      maxX: 4.5,  // 5 - 0.5
      minZ: -3.5, // -4 + 0.5
      maxZ: 3.5,  // 4 - 0.5
      minY: 1.6,  // Ground level for player
      maxY: 7.5   // Ceiling - 0.5
    } as const;

    // Clamp position within boundaries
    newPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPosition.x));
    newPosition.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, newPosition.z));
    newPosition.y = Math.max(bounds.minY, Math.min(bounds.maxY, newPosition.y));

    // Check if we're on the ground
    isGrounded.current = newPosition.y === bounds.minY;
    if (isGrounded.current) {
      velocity.current.y = 0;
    }

    return newPosition;
  };
  
  useFrame((state, delta) => {
    const { forward, backward, left, right, jump } = getKeys();
    
    // Get camera direction for movement
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();
    const rotation = state.camera.rotation;
    
    // Calculate movement direction based on camera rotation
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVEMENT_SPEED * delta)
      .applyEuler(rotation);
    
    // Apply gravity and handle jumping
    if (jump && isGrounded.current) {
      velocity.current.y = JUMP_FORCE;
    }
    
    velocity.current.y -= GRAVITY * delta;

    // Calculate new position
    const newPosition = position.current.clone();
    newPosition.x += direction.x;
    newPosition.z += direction.z;
    newPosition.y += velocity.current.y * delta;

    // Check collisions and update position
    position.current.copy(checkCollisions(newPosition));
    
    // Update camera position
    state.camera.position.copy(position.current);
  });

  return <PointerLockControls />;
};

const Scene = () => {
  return (
    <>
      <Floor />
      {/* Back wall with window */}
      <Wall 
        position={[0, 4, -4]} 
        rotation={[0, 0, 0]} 
        size={[10, 8]} 
        hasWindow={true}
      />
      {/* Front wall */}
      <Wall 
        position={[0, 4, 4]} 
        rotation={[0, Math.PI, 0]} 
        size={[10, 8]}
      />
      {/* Left wall */}
      <Wall 
        position={[-5, 4, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        size={[8, 8]}
      />
      {/* Right wall */}
      <Wall 
        position={[5, 4, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        size={[8, 8]}
      />
      <Ceiling />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <gridHelper args={[10, 10]} position={[0, 0.01, 0]} />
    </>
  );
};

const RoomScene = () => {
  return (
    <KeyboardControls map={controlSchema}>
      <div className="h-screen w-full relative">
        <Canvas camera={{ position: [0, 1.6, 0], fov: 70 }}>
          <Suspense fallback={null}>
            <Scene />
            <Player />
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>

        <div className="absolute bottom-4 left-4 bg-black/50 text-white p-4 rounded">
          <p>Click to start</p>
          <p>WASD or Arrow Keys to move</p>
          <p>Space to jump</p>
          <p>Mouse to look around</p>
          <p>ESC to exit</p>
        </div>
      </div>
    </KeyboardControls>
  );
};

export default RoomScene;