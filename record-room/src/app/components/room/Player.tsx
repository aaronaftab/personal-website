import React from 'react';
import { useFrame } from '@react-three/fiber';
import { PointerLockControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';

export const controlSchema = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] }
] as const;

export const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const MOVEMENT_SPEED = 5;
  const JUMP_FORCE = 5;
  const GRAVITY = 9.81;
  
  const position = React.useRef<THREE.Vector3>(new THREE.Vector3(0, 1.6, 0));
  const velocity = React.useRef<THREE.Vector3>(new THREE.Vector3());
  const isGrounded = React.useRef(true);

  const checkCollisions = (newPosition: THREE.Vector3): THREE.Vector3 => {
    const bounds = {
      minX: -4.5,
      maxX: 4.5,
      minZ: -3.5,
      maxZ: 3.5,
      minY: 1.6,
      maxY: 7.5
    } as const;

    newPosition.x = Math.max(bounds.minX, Math.min(bounds.maxX, newPosition.x));
    newPosition.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, newPosition.z));
    newPosition.y = Math.max(bounds.minY, Math.min(bounds.maxY, newPosition.y));

    isGrounded.current = newPosition.y === bounds.minY;
    if (isGrounded.current) {
      velocity.current.y = 0;
    }

    return newPosition;
  };
  
  useFrame((state, delta) => {
    const { forward, backward, left, right, jump } = getKeys();
    
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3();
    const sideVector = new THREE.Vector3();
    const rotation = state.camera.rotation;
    
    frontVector.set(0, 0, Number(backward) - Number(forward));
    sideVector.set(Number(left) - Number(right), 0, 0);
    
    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(MOVEMENT_SPEED * delta)
      .applyEuler(rotation);
    
    if (jump && isGrounded.current) {
      velocity.current.y = JUMP_FORCE;
    }
    
    velocity.current.y -= GRAVITY * delta;

    const newPosition = position.current.clone();
    newPosition.x += direction.x;
    newPosition.z += direction.z;
    newPosition.y += velocity.current.y * delta;

    position.current.copy(checkCollisions(newPosition));
    state.camera.position.copy(position.current);
  });

  return <PointerLockControls />;
};