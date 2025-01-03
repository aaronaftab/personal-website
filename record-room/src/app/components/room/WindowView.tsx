import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

interface WindowViewProps {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
}

export const WindowView = ({ position, rotation, size }: WindowViewProps) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hdrMap, setHdrMap] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (RGBELoader) {
      const loader = new RGBELoader();
      loader.load('/textures/cityscapes/shanghai_bund_8k.hdr', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        setHdrMap(texture);
      });
    }
  }, []);

  // Custom shader to handle HDR texture and proper exposure
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D hdrTexture;
    uniform float exposure;
    varying vec2 vUv;

    // ACES tonemapping implementation
    vec3 ACESFilm(vec3 x) {
      float a = 2.51;
      float b = 0.03;
      float c = 2.43;
      float d = 0.59;
      float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    void main() {
      vec3 hdrColor = texture2D(hdrTexture, vUv).rgb;
      
      // Apply exposure adjustment
      hdrColor *= exposure;
      
      // Apply tonemapping
      vec3 color = ACESFilm(hdrColor);
      
      // Apply gamma correction
      color = pow(color, vec3(1.0 / 2.2));
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // Animate exposure based on time of day or other factors
  useFrame((state) => {
    if (materialRef.current) {
      // You can adjust these values to control the exposure
      const exposure = 1.0 + Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
      materialRef.current.uniforms.exposure.value = exposure;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* HDR View */}
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={size} />
        {hdrMap && (
          <shaderMaterial 
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={{
              hdrTexture: { value: hdrMap },
              exposure: { value: 1.0 }
            }}
          />
        )}
      </mesh>

      {/* Window frame */}
      <mesh position={[0, 0, 0.02]}>
        <boxGeometry args={[size[0] + 0.2, size[1] + 0.2, 0.1]} />
        <meshStandardMaterial color="#333333" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Window glass */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={size} />
        <meshPhysicalMaterial 
          transparent
          opacity={0.1}
          transmission={0.95}
          thickness={0.05}
          roughness={0}
          envMapIntensity={1.5}
          ior={1.5}
        />
      </mesh>
    </group>
  );
};