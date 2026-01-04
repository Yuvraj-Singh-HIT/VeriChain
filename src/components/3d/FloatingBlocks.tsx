import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface BlockProps {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
}

const FloatingBlock = ({ position, scale, color, speed }: BlockProps) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.5;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.5) * 0.3;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <MeshTransmissionMaterial
          color={color}
          thickness={0.5}
          roughness={0.1}
          transmission={0.9}
          ior={1.5}
          chromaticAberration={0.03}
        />
      </mesh>
      <mesh position={position} scale={scale * 1.05}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.2} />
      </mesh>
    </Float>
  );
};

const ConnectionLine = ({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) => {
  const points = useMemo(() => [start, end], [start, end]);
  const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...lineGeometry} />
      <lineBasicMaterial attach="material" color="#22d3ee" transparent opacity={0.3} />
    </line>
  );
};

const FloatingBlocks = () => {
  const blocks = useMemo(() => [
    { position: [-3, 2, 0] as [number, number, number], scale: 0.6, color: "#22d3ee", speed: 1.2 },
    { position: [3, -1, 1] as [number, number, number], scale: 0.8, color: "#a855f7", speed: 1.5 },
    { position: [-2, -2, -1] as [number, number, number], scale: 0.5, color: "#22d3ee", speed: 1 },
    { position: [2, 2, -2] as [number, number, number], scale: 0.7, color: "#a855f7", speed: 1.3 },
    { position: [0, 3, 1] as [number, number, number], scale: 0.4, color: "#22d3ee", speed: 1.8 },
    { position: [-4, 0, 0] as [number, number, number], scale: 0.5, color: "#a855f7", speed: 1.1 },
    { position: [4, 1, -1] as [number, number, number], scale: 0.6, color: "#22d3ee", speed: 1.4 },
  ], []);

  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />
        
        {blocks.map((block, i) => (
          <FloatingBlock key={i} {...block} />
        ))}
        
        <fog attach="fog" args={['#0a0f1a', 8, 25]} />
      </Canvas>
    </div>
  );
};

export default FloatingBlocks;
