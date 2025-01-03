'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls, Environment } from '@react-three/drei';
import { Scene } from './components/room/Scene';
import { Player } from './components/room/Player';

type Controls = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
}

const controlSchema: { name: keyof Controls; keys: string[] }[] = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] }
];

export default function RoomScene() {
  return (
    <KeyboardControls map={controlSchema}>
      <div className="h-screen w-full relative">
        <Canvas camera={{ position: [0, 1.6, 0], fov: 70 }}>
          <Suspense fallback={null}>
            <Scene />
            <Player />
            <Environment preset="city" />
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
}