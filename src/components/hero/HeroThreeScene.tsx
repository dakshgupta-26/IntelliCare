import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NodePoint {
  position: [number, number, number];
  color: string;
  size: number;
  label?: string;
}

const NetworkGraph: React.FC<{ prefersReducedMotion: boolean }> = ({ prefersReducedMotion }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Department and Hub Node coordinates
  const nodes: NodePoint[] = useMemo(
    () => [
      { position: [0, 0, 0], color: '#06b6d4', size: 0.35, label: 'AI Core' },
      { position: [-2.2, 1.3, -0.5], color: '#38bdf8', size: 0.22, label: 'Emergency' },
      { position: [2.3, 1.1, -0.8], color: '#14b8a6', size: 0.22, label: 'ICU' },
      { position: [-1.8, -1.4, 0.4], color: '#818cf8', size: 0.2, label: 'Surgery' },
      { position: [1.9, -1.3, 0.2], color: '#10b981', size: 0.2, label: 'General Ward' },
      { position: [0.2, 2.2, -1.2], color: '#6366f1', size: 0.18, label: 'EHR Ingest' },
      { position: [-0.4, -2.1, -0.6], color: '#0ea5e9', size: 0.18, label: 'Solver' },
    ],
    []
  );

  // Generate connection line geometry between nodes
  const linesGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const corePos = new THREE.Vector3(0, 0, 0);

    nodes.slice(1).forEach((node) => {
      const nodePos = new THREE.Vector3(...node.position);
      points.push(corePos, nodePos);

      // Connect perimeter adjacent nodes
      nodes.slice(1).forEach((other) => {
        if (node !== other) {
          const otherPos = new THREE.Vector3(...other.position);
          if (nodePos.distanceTo(otherPos) < 3.2) {
            points.push(nodePos, otherPos);
          }
        }
      });
    });

    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [nodes]);

  // Dynamic particle cloud flowing along network
  const particleCount = 120;
  const [particlePositions, particlePhases] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return [positions, phases];
  }, [particleCount]);

  useFrame((state, delta) => {
    if (prefersReducedMotion) return;

    if (groupRef.current) {
      // Gentle floating rotation
      groupRef.current.rotation.y += delta * 0.12;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;

      // Mouse Parallax
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = -(state.pointer.y * Math.PI) / 10;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX * 0.4, 0.05);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY * 0.4, 0.05);
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx + 1] += Math.sin(state.clock.elapsedTime * 0.8 + particlePhases[i]) * 0.003;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Node Spheres */}
      {nodes.map((node, i) => (
        <Float key={i} speed={prefersReducedMotion ? 0 : 1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={node.position}>
            {/* Core glowing sphere */}
            <Sphere args={[node.size, 24, 24]}>
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={1.2}
                roughness={0.2}
                metalness={0.8}
              />
            </Sphere>
            {/* Transparent outer halo */}
            <Sphere args={[node.size * 1.6, 16, 16]}>
              <meshBasicMaterial color={node.color} transparent opacity={0.15} wireframe />
            </Sphere>
          </group>
        </Float>
      ))}

      {/* Network Interconnection Wireframe */}
      {/* @ts-ignore */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial color="#0284c7" transparent opacity={0.22} linewidth={1} />
      </lineSegments>

      {/* Synaptic Particle Flow */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#38bdf8"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

export const HeroThreeScene: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-80">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[-10, -10, -5]} intensity={1} color="#6366f1" />
        <NetworkGraph prefersReducedMotion={prefersReducedMotion} />
      </Canvas>
    </div>
  );
};
