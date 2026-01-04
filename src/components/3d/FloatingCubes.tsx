import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function GlassCube({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          color="#00d4aa"
          thickness={0.5}
          roughness={0.1}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.1}
          backside
        />
      </mesh>
    </Float>
  );
}

export default function FloatingCubes() {
  return (
    <div className="absolute inset-0 z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00d4aa" />
        <GlassCube position={[-3, 1, 0]} scale={0.8} />
        <GlassCube position={[3, -1, -2]} scale={1.2} />
        <GlassCube position={[0, 2, -3]} scale={0.6} />
      </Canvas>
    </div>
  );
}