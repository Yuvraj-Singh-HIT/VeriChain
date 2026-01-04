import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Float } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedPlate = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial
          color="#22d3ee"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
};

const MovingPlate = () => {
  return (
    <div className="absolute inset-0 -z-20 w-full h-full">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
        <AnimatedPlate />
        <fog attach="fog" args={['#0a0f1a', 5, 20]} />
      </Canvas>
    </div>
  );
};

export default MovingPlate;