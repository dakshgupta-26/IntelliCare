import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

interface HospitalNode {
  id: string;
  name: string;
  code: string;
  position: [number, number, number];
  color: string;
  status: string;
  metric: string;
}

const HOSPITAL_NODES: HospitalNode[] = [
  { id: 'ed', name: 'Emergency Dept', code: 'ED-01', position: [-2.2, 0.9, 0.2], color: '#22D3EE', status: 'Surge +18%', metric: '44 Influx' },
  { id: 'diag', name: 'Imaging & Labs', code: 'DIAG', position: [-1.0, -0.2, -0.4], color: '#0EA5E9', status: 'Optimal', metric: '12m Turnaround' },
  { id: 'or', name: 'Surgical Suite', code: 'OR-04', position: [0.3, 1.4, 0.1], color: '#38BDF8', status: 'Active', metric: '6 Suites' },
  { id: 'icu', name: 'Intensive Care', code: 'ICU-3', position: [1.8, 0.6, 0.4], color: '#22D3EE', status: '92% Critical', metric: '29/32 Beds' },
  { id: 'ward', name: 'Inpatient Ward', code: 'WARD-B', position: [0.9, -1.1, -0.2], color: '#0EA5E9', status: 'Normal', metric: '84% Occupied' },
  { id: 'pharm', name: 'Pharmacy Core', code: 'PHARM', position: [-1.5, -1.3, 0.4], color: '#34D399', status: 'Automated', metric: '99.8% Dispense' },
  { id: 'staff', name: 'Clinical Staffing', code: 'STAFF', position: [-0.1, -0.2, 0.8], color: '#22D3EE', status: 'Allocated', metric: '82% Utilized' },
  { id: 'equip', name: 'Telemetry Fleet', code: 'EQUIP', position: [1.3, -0.3, -0.7], color: '#34D399', status: 'Online', metric: '250Hz Bus' }
];

// Node-to-node operational links
const NETWORK_LINKS: [number, number][] = [
  [0, 1], // ED -> Diagnostics
  [0, 6], // ED -> Staff
  [1, 2], // Diagnostics -> OR
  [1, 3], // Diagnostics -> ICU
  [2, 3], // OR -> ICU
  [3, 4], // ICU -> Ward
  [5, 3], // Pharmacy -> ICU
  [5, 4], // Pharmacy -> Ward
  [6, 3], // Staff -> ICU
  [6, 2], // Staff -> OR
  [7, 3], // Equipment -> ICU
  [7, 0]  // Equipment -> ED
];

// --------------------------------------------------------------------------
// 3D Hospital Network Scene
// --------------------------------------------------------------------------
const NetworkScene: React.FC<{ reducedMotion: boolean }> = ({ reducedMotion }) => {
  const groupRef = useRef<THREE.Group | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Mouse tilt tracking
  const mouse = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      mouse.current.targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
      mouse.current.targetY = (e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Compute static line geometries
  const lineGeometries = useMemo(() => {
    return NETWORK_LINKS.map(([sourceIdx, targetIdx]) => {
      const p1 = new THREE.Vector3(...HOSPITAL_NODES[sourceIdx].position);
      const p2 = new THREE.Vector3(...HOSPITAL_NODES[targetIdx].position);
      const geom = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      return { geom, p1, p2, sourceIdx, targetIdx };
    });
  }, []);

  // Data pulse positions along lines
  const pulseSpheres = useMemo(() => {
    return NETWORK_LINKS.map((_, i) => ({
      progress: (i * 0.15) % 1.0,
      speed: 0.15 + (i % 3) * 0.05
    }));
  }, []);

  const pulseMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth subtle mouse tilt
    mouse.current.x += (mouse.current.targetX - mouse.current.x) * 0.05;
    mouse.current.y += (mouse.current.targetY - mouse.current.y) * 0.05;

    if (!reducedMotion) {
      // Extremely slow, dignified organic rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.04 + mouse.current.x;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.05 - mouse.current.y;

      // Animate flowing data pulses along the hospital connections
      lineGeometries.forEach((link, idx) => {
        const mesh = pulseMeshRefs.current[idx];
        if (!mesh) return;

        const pulse = pulseSpheres[idx];
        pulse.progress = (pulse.progress + pulse.speed * delta) % 1.0;
        
        mesh.position.lerpVectors(link.p1, link.p2, pulse.progress);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. Subtle Structural Floor Grid in Background */}
      <gridHelper
        args={[8, 12, '#0c223d', '#071526']}
        position={[0, -1.8, 0]}
        rotation={[0, 0, 0]}
      />

      {/* 2. Connection Edges (Subtle low-opacity lines) */}
      {lineGeometries.map((link, idx) => (
        <primitive key={`line-${idx}`} object={new THREE.Line(
          link.geom,
          new THREE.LineBasicMaterial({
            color: '#164e63',
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending
          })
        )} />
      ))}

      {/* 3. Animated Data Pulses along Network Lines */}
      {lineGeometries.map((_link, idx) => (
        <mesh
          key={`pulse-${idx}`}
          ref={(el) => (pulseMeshRefs.current[idx] = el)}
        >
          <sphereGeometry args={[0.035, 8, 8]} />
          <meshBasicMaterial
            color="#22D3EE"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}

      {/* 4. Hospital Department Operational Nodes */}
      {HOSPITAL_NODES.map((node) => {
        const isHovered = hoveredNode === node.id;
        return (
          <group 
            key={node.id} 
            position={node.position}
            onPointerOver={() => setHoveredNode(node.id)}
            onPointerOut={() => setHoveredNode(null)}
          >
            {/* Core Node Sphere */}
            <mesh>
              <sphereGeometry args={[isHovered ? 0.12 : 0.09, 16, 16]} />
              <meshBasicMaterial 
                color={node.color} 
                toneMapped={false}
              />
            </mesh>

            {/* Subtle Translucent Aura Shell */}
            <mesh>
              <sphereGeometry args={[isHovered ? 0.22 : 0.17, 16, 16]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={isHovered ? 0.35 : 0.15}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Orbiting Subtle Ring */}
            <mesh rotation={[Math.PI / 3, 0, 0]}>
              <ringGeometry args={[0.16, 0.18, 24]} />
              <meshBasicMaterial
                color={node.color}
                transparent
                opacity={0.25}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Clinical Node Label */}
            <Html
              position={[0, 0.22, 0]}
              center
              distanceFactor={6}
              className="pointer-events-none select-none transition-opacity duration-200"
            >
              <div className="flex flex-col items-center">
                <div className="px-2 py-0.5 rounded bg-[#030712]/90 border border-white/[0.1] backdrop-blur-md whitespace-nowrap shadow-md flex items-center gap-1.5">
                  <span 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: node.color, boxShadow: `0 0 6px ${node.color}` }}
                  />
                  <span className="text-[10px] font-mono font-bold text-slate-200 tracking-wider uppercase">
                    {node.name}
                  </span>
                  <span className="text-[9px] font-mono text-cyan-400 font-semibold pl-1 border-l border-white/[0.1]">
                    {node.metric}
                  </span>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

// --------------------------------------------------------------------------
// Container Wrapper with Tab Visibility & Reduced Motion Handling
// --------------------------------------------------------------------------
export const ClinicalSpatialNetwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  // Pause rendering when tab is hidden to save GPU/battery
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      {isVisible ? (
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 46 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#22D3EE" />
          <NetworkScene reducedMotion={reducedMotion} />
        </Canvas>
      ) : (
        <div className="w-full h-full bg-transparent" />
      )}

      {/* Atmospheric vignette overlays to keep visual focus clean */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient-fade" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#020617] to-transparent pointer-events-none" />
    </div>
  );
};
