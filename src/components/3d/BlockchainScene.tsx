import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, OrbitControls } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function BlockchainCube({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + delay) * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3 + delay;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#00d4aa"
          emissive="#00d4aa"
          emissiveIntensity={0.2}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function CentralSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 1]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
          distort={0.2}
          speed={1}
        />
      </mesh>
    </Float>
  );
}

function Scene() {
  const cubePositions: [number, number, number][] = [
    [-3, 1, -1],
    [3, -1, -1],
  ];

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00d4aa" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <spotLight position={[0, 10, 0]} intensity={0.8} angle={0.5} penumbra={1} color="#ffffff" />

      <CentralSphere />

      {cubePositions.map((pos, i) => (
        <BlockchainCube key={i} position={pos} delay={i * 0.5} />
      ))}

      <OrbitControls enableZoom={false} enablePan={false} />
    </>
  );
}

export default function BlockchainScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <Scene />
      </Canvas>
    </div>
  );
}