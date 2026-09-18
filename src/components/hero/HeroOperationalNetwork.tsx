import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface NodeData {
  id: string;
  name: string;
  pos: [number, number, number];
  color: string;
  size: number;
}

const NETWORK_NODES: NodeData[] = [
  { id: 'icu', name: 'ICU', pos: [-2.0, 1.3, -0.5], color: '#22D3EE', size: 0.12 },
  { id: 'ed', name: 'ED', pos: [-3.0, 0.1, 0.6], color: '#38BDF8', size: 0.13 },
  { id: 'ward', name: 'WARD', pos: [-0.8, 0.9, -0.8], color: '#2DD4BF', size: 0.11 },
  { id: 'staff', name: 'STAFF', pos: [-1.8, -0.3, 0.3], color: '#818CF8', size: 0.12 },
  { id: 'beds', name: 'BEDS', pos: [-1.4, -1.1, 0.1], color: '#34D399', size: 0.11 },
  { id: 'equip', name: 'EQUIPMENT', pos: [-0.4, -1.3, -0.6], color: '#22D3EE', size: 0.1 }
];

const NETWORK_EDGES: [number, number][] = [
  [0, 1], // ICU <-> ED
  [0, 2], // ICU <-> WARD
  [1, 2], // ED <-> WARD
  [1, 3], // ED <-> STAFF
  [0, 3], // ICU <-> STAFF
  [2, 3], // WARD <-> STAFF
  [3, 4], // STAFF <-> BEDS
  [4, 5], // BEDS <-> EQUIPMENT
  [2, 5]  // WARD <-> EQUIPMENT
];

const OperationalGraph: React.FC<{ prefersReducedMotion: boolean; isTabActive: boolean }> = ({
  prefersReducedMotion,
  isTabActive
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRidersRef = useRef<THREE.InstancedMesh>(null);

  // Line segments for the operational graph
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    NETWORK_EDGES.forEach(([i, j]) => {
      points.push(new THREE.Vector3(...NETWORK_NODES[i].pos));
      points.push(new THREE.Vector3(...NETWORK_NODES[j].pos));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  // Soft depth background particles
  const particleGeometry = useMemo(() => {
    const count = 35;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8 - 1;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1.5;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  // Dynamic telemetry packet pulse matrices
  const dummyMatrix = useMemo(() => new THREE.Matrix4(), []);

  useFrame((state) => {
    if (prefersReducedMotion || !isTabActive) return;

    const time = state.clock.getElapsedTime();

    // Gentle restrained pointer parallax
    if (groupRef.current) {
      const targetRotY = (state.pointer.x * Math.PI) / 45;
      const targetRotX = (-state.pointer.y * Math.PI) / 55;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.04);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.04);
      groupRef.current.position.y = Math.sin(time * 0.4) * 0.04;
    }

    // Move data packet pulses along edges
    if (pulseRidersRef.current) {
      NETWORK_EDGES.forEach(([i, j], edgeIdx) => {
        const speed = 0.35 + (edgeIdx % 3) * 0.1;
        const progress = ((time * speed + edgeIdx * 0.22) % 1);
        const p1 = NETWORK_NODES[i].pos;
        const p2 = NETWORK_NODES[j].pos;

        const x = THREE.MathUtils.lerp(p1[0], p2[0], progress);
        const y = THREE.MathUtils.lerp(p1[1], p2[1], progress);
        const z = THREE.MathUtils.lerp(p1[2], p2[2], progress);

        dummyMatrix.setPosition(x, y, z);
        pulseRidersRef.current?.setMatrixAt(edgeIdx, dummyMatrix);
      });
      pulseRidersRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[-0.2, 0, -0.4]}>
      {/* Background Soft Depth Particles */}
      <points geometry={particleGeometry}>
        <pointsMaterial
          size={0.035}
          color="#22D3EE"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Network Edges / Connections */}
      {/* @ts-ignore */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#0EA5E9"
          transparent
          opacity={0.18}
          linewidth={1}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Network Nodes */}
      {NETWORK_NODES.map((node) => (
        <group key={node.id} position={node.pos}>
          {/* Central core node */}
          <mesh>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshBasicMaterial color={node.color} transparent opacity={0.65} />
          </mesh>
          {/* Subtle outer halo ring */}
          <mesh>
            <sphereGeometry args={[node.size * 1.55, 12, 12]} />
            <meshBasicMaterial
              color={node.color}
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}

      {/* Moving Telemetry Signal Packets along edges */}
      <instancedMesh
        ref={pulseRidersRef}
        args={[undefined, undefined, NETWORK_EDGES.length]}
      >
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#67E8F9" transparent opacity={0.8} />
      </instancedMesh>
    </group>
  );
};

export const HeroOperationalNetwork: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isTabActive, setIsTabActive] = useState(true);
  const [isInView, setIsInView] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // IntersectionObserver to avoid rendering when scrolled down
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Don't render on reduced motion or mobile viewports
  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-[1] overflow-hidden opacity-30 select-none hidden md:block"
    >
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 4.2], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        >
          <OperationalGraph
            prefersReducedMotion={prefersReducedMotion}
            isTabActive={isTabActive}
          />
        </Canvas>
      )}
    </div>
  );
};
