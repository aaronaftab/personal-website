import React from 'react';
import { Floor } from './Floor';
import { Wall } from './Wall';
import { Ceiling } from './Ceiling';

export const Scene = () => {
  return (
    <>
      <Floor />
      <Wall 
        position={[0, 4, -4]} 
        rotation={[0, 0, 0]} 
        size={[10, 8]} 
        hasWindow={true}
      />
      <Wall 
        position={[0, 4, 4]} 
        rotation={[0, Math.PI, 0]} 
        size={[10, 8]}
      />
      <Wall 
        position={[-5, 4, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        size={[8, 8]}
      />
      <Wall 
        position={[5, 4, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        size={[8, 8]}
      />
      <Ceiling />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <gridHelper args={[10, 10]} position={[0, 0.01, 0]} />
    </>
  );
};