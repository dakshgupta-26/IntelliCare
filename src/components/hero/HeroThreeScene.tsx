import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { AlertTriangle, Zap } from 'lucide-react';

// ==========================================
// 1. Stylized 3D Hospital Elements
// ==========================================

// Medical Bed Component (Frame, Mattress, Rails, Pillow, IV Stand)
const HospitalBed: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Bed Base Wheels / Casters */}
      <mesh position={[-0.9, -0.65, 0.45]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.9, -0.65, 0.45]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.9, -0.65, -0.45]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.9, -0.65, -0.45]}>
        <cylinderGeometry args={[0.07, 0.07, 0.08, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Bed Lower Hydraulic Chassis */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[1.8, 0.15, 0.9]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Bed Main Steel Frame */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[2.1, 0.18, 1.1]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.2} />
      </mesh>

      {/* Headboard and Footboard */}
      <mesh position={[-1.05, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.7, 1.1]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.3} />
      </mesh>
      <mesh position={[1.05, -0.05, 0]}>
        <boxGeometry args={[0.08, 0.45, 1.1]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.2} roughness={0.3} />
      </mesh>

      {/* Safety Side Rails */}
      <mesh position={[0, 0.02, 0.53]}>
        <boxGeometry args={[1.3, 0.35, 0.04]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.02, -0.53]}>
        <boxGeometry args={[1.3, 0.35, 0.04]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* High-Grade Medical Mattress */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.98, 0.22, 0.98]} />
        <meshStandardMaterial color="#0284c7" roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Patient Clean Sheet / Cover */}
      <mesh position={[0.2, 0.04, 0]}>
        <boxGeometry args={[1.4, 0.1, 1.0]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.8} />
      </mesh>

      {/* Ergonomic Pillow */}
      <mesh position={[-0.7, 0.08, 0]}>
        <boxGeometry args={[0.45, 0.14, 0.7]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.9} />
      </mesh>

      {/* Attached IV Drip Pole Stand */}
      <group position={[-1.0, 0.5, 0.5]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 1.6, 12]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* IV Hook Crossbar */}
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* IV Infusion Solution Bags */}
        <mesh position={[0.12, 0.65, 0]}>
          <boxGeometry args={[0.12, 0.22, 0.06]} />
          <meshStandardMaterial color="#38bdf8" transparent opacity={0.65} roughness={0.1} />
        </mesh>
        <mesh position={[-0.12, 0.62, 0]}>
          <boxGeometry args={[0.1, 0.2, 0.05]} />
          <meshStandardMaterial color="#2dd4bf" transparent opacity={0.65} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

// Bedside Vital Sign Monitor on Swivel Arm
const VitalMonitor: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Stand Support Column */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 12]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Heavy Base Plate */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.25, 0.25, 0.04, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Monitor Outer Chassis */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.55, 0.42, 0.08]} />
        <meshStandardMaterial color="#0f172a" roughness={0.4} />
      </mesh>

      {/* Glowing High-Resolution Vital Display Screen */}
      <mesh position={[0, 0.1, 0.045]}>
        <planeGeometry args={[0.5, 0.36]} />
        <meshStandardMaterial
          color="#064e3b"
          emissive="#10b981"
          emissiveIntensity={0.85}
          roughness={0.2}
        />
      </mesh>

      {/* Infusion Pump Module Attached Below */}
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[0.35, 0.18, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.3} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Ventilator & Medical Cart Console
const MedicalConsole: React.FC<{ position: [number, number, number]; rotation?: [number, number, number] }> = ({
  position,
  rotation = [0, 0, 0],
}) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Rolling Cart Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.9, 0.5]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Blue Medical Drawers */}
      <mesh position={[0, 0.1, 0.255]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.15, 0.255]}>
        <planeGeometry args={[0.5, 0.2]} />
        <meshStandardMaterial color="#0284c7" roughness={0.4} />
      </mesh>
      {/* Top Touchscreen Interface */}
      <mesh position={[0, 0.65, 0]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.45, 0.32, 0.05]} />
        <meshStandardMaterial color="#0f172a" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.65, 0.03]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.4, 0.26]} />
        <meshStandardMaterial color="#0369a1" emissive="#16c7f3" emissiveIntensity={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
};

// Stylized Medical Personnel (Doctor / Nurse Figures in Professional Attire)
const MedicalStaffFigure: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  role: 'doctor' | 'nurse';
}> = ({ position, rotation = [0, 0, 0], role }) => {
  const coatColor = role === 'doctor' ? '#f8fafc' : '#0284c7';
  const pantsColor = role === 'doctor' ? '#0f172a' : '#0369a1';

  return (
    <group position={position} rotation={rotation}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.6} />
      </mesh>

      {/* Medical Stethoscope / Lanyard on Doctor */}
      {role === 'doctor' && (
        <mesh position={[0, 1.25, 0.12]}>
          <torusGeometry args={[0.09, 0.015, 8, 16]} />
          <meshStandardMaterial color="#16c7f3" metalness={0.7} roughness={0.2} />
        </mesh>
      )}

      {/* Torso / Lab Coat */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.36, 0.65, 0.22]} />
        <meshStandardMaterial color={coatColor} roughness={0.5} />
      </mesh>

      {/* ID Badge Tag */}
      <mesh position={[0.1, 1.12, 0.115]}>
        <planeGeometry args={[0.07, 0.09]} />
        <meshStandardMaterial color="#16c7f3" emissive="#16c7f3" emissiveIntensity={0.6} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, 0.35, 0]}>
        <boxGeometry args={[0.13, 0.7, 0.16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.1, 0.35, 0]}>
        <boxGeometry args={[0.13, 0.7, 0.16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.6} />
      </mesh>
    </group>
  );
};

// Hospital Architectural Room Boundary (Floors, Walls, Glass Partitions, Overhead Lights)
const HospitalRoomEnvironment: React.FC = () => {
  return (
    <group>
      {/* Clean Hospital Floor with Subtle Grid Tiles */}
      <mesh position={[0, -1.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.25}
          metalness={0.4}
        />
      </mesh>

      {/* Floor Tile Grid Line Details */}
      <gridHelper
        args={[10, 10, '#16c7f3', '#1e293b']}
        position={[0, -1.24, 0]}
      />

      {/* Back Hospital Wall with Soft Clean Medical Tone */}
      <mesh position={[0, 1.25, -3.2]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#090e1a" roughness={0.7} />
      </mesh>

      {/* Glass Partition Wall for ICU Isolation Room */}
      <mesh position={[-1.8, 0.5, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4.5, 3.5]} />
        <meshStandardMaterial
          color="#38bdf8"
          transparent
          opacity={0.12}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      {/* Glass Partition Frame */}
      <mesh position={[-1.8, 0.5, -0.5]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[4.52, 0.08, 0.04]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Hospital Wayfinding Wall Sign: ICU CRITICAL CARE */}
      <group position={[-0.8, 2.3, -3.15]}>
        <mesh>
          <planeGeometry args={[1.6, 0.35]} />
          <meshStandardMaterial color="#0B1224" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[1.54, 0.29]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      </group>

      {/* Overhead LED Panel Lighting Fixtures */}
      <mesh position={[0, 2.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 1.2]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={1.4}
        />
      </mesh>
    </group>
  );
};

// ==========================================
// 2. Interactive Hospital Scene with Holographic Overlays
// ==========================================
const HospitalSceneContent: React.FC<{ prefersReducedMotion: boolean; isTabActive: boolean }> = ({
  prefersReducedMotion,
  isTabActive,
}) => {
  const sceneGroupRef = useRef<THREE.Group>(null);
  const dataLineRef = useRef<THREE.Line>(null);

  // Dynamic Data Stream Waveform Line from Bedside Monitor to AI Core
  const dataLineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const p1 = new THREE.Vector3(0.9, 0.4, -0.8);
    const p2 = new THREE.Vector3(0.5, 1.2, -0.4);
    const p3 = new THREE.Vector3(-0.2, 1.8, 0.2);
    const p4 = new THREE.Vector3(-1.0, 1.4, 0.6);

    const curve = new THREE.CatmullRomCurve3([p1, p2, p3, p4]);
    return new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
  }, []);

  useFrame((state, delta) => {
    if (prefersReducedMotion || !isTabActive) return;

    if (sceneGroupRef.current) {
      // Gentle cinematic breathing tilt
      sceneGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.y,
        (state.pointer.x * Math.PI) / 22 - 0.25,
        0.04
      );
      sceneGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sceneGroupRef.current.rotation.x,
        (-state.pointer.y * Math.PI) / 28 + 0.12,
        0.04
      );
    }
  });

  return (
    <group ref={sceneGroupRef} position={[0.6, -0.2, 0]}>
      {/* Hospital Architectural Boundary */}
      <HospitalRoomEnvironment />

      {/* 1. Primary Hospital Patient Bed (Foreground / Focus) */}
      <HospitalBed position={[0.2, -0.55, 0]} rotation={[0, -0.3, 0]} />

      {/* 2. Bedside Vital Signs Monitor */}
      <VitalMonitor position={[1.4, -0.05, -0.5]} rotation={[0, -0.6, 0]} />

      {/* 3. Medical Console / Ventilator Cart */}
      <MedicalConsole position={[-1.1, -0.7, -0.8]} rotation={[0, 0.4, 0]} />

      {/* 4. Secondary General Ward Bed (Midground) */}
      <HospitalBed position={[2.5, -0.55, -2.0]} rotation={[0, -0.3, 0]} />

      {/* 5. Medical Staff: Doctor examining telemetry */}
      <MedicalStaffFigure position={[-0.8, -1.25, 0.8]} rotation={[0, 0.8, 0]} role="doctor" />

      {/* 6. Medical Staff: Charge Nurse near console */}
      <MedicalStaffFigure position={[1.7, -1.25, -1.2]} rotation={[0, -0.9, 0]} role="nurse" />

      {/* 7. Cyan Synaptic Data Stream Line connecting ICU Telemetry */}
      {/* @ts-ignore */}
      <line geometry={dataLineGeometry}>
        <lineBasicMaterial color="#16c7f3" transparent opacity={0.6} linewidth={2} />
      </line>

      {/* ==========================================
          AR-Style Floating Holographic UI Overlays
          ========================================== */}
      {/* Overlay 1: ICU Bed Telemetry */}
      <Html position={[0.3, 0.95, 0]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-950/90 border border-cyan-500/50 backdrop-blur-md text-white shadow-[0_0_20px_rgba(22,199,243,0.3)] select-none pointer-events-none whitespace-nowrap font-mono text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-cyan-300">ICU BED 01</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-300">92% OCCUPIED</span>
        </div>
      </Html>

      {/* Overlay 2: Real-time Rebalancing Optimization Advisory */}
      <Html position={[-1.1, 0.8, -0.8]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-950/90 border border-teal-500/50 backdrop-blur-md text-white shadow-[0_0_20px_rgba(45,212,191,0.25)] select-none pointer-events-none whitespace-nowrap font-mono text-[11px]">
          <Zap className="w-3.5 h-3.5 text-teal-400" />
          <span className="font-bold text-teal-300">MILP ADVISORY</span>
          <span className="text-slate-500">:</span>
          <span className="text-slate-200">+2 Floaters &rarr; ICU</span>
        </div>
      </Html>

      {/* Overlay 3: Hospital Surge Proximity Alert */}
      <Html position={[2.2, 0.8, -2.0]} center distanceFactor={8} zIndexRange={[100, 0]}>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-navy-950/90 border border-rose-500/50 backdrop-blur-md text-white shadow-[0_0_15px_rgba(244,63,94,0.25)] select-none pointer-events-none whitespace-nowrap font-mono text-[10px]">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          <span className="text-rose-300 font-bold">ED SURGE +18.4%</span>
        </div>
      </Html>
    </group>
  );
};

export const HeroThreeScene: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [isTabActive, setIsTabActive] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Tab visibility detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabActive(document.visibilityState === 'visible');
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // IntersectionObserver to pause rendering when hero is scrolled out of viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[460px] sm:min-h-[580px] lg:min-h-[640px] relative pointer-events-auto overflow-hidden select-none"
    >
      {isVisible && (
        <Canvas
          camera={{ position: [-1.2, 1.8, 5.2], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          {/* Hospital Realistic Soft Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 4]} intensity={1.5} color="#ffffff" />
          <pointLight position={[-3, 4, -2]} intensity={1.2} color="#16c7f3" />
          <pointLight position={[3, 2, 2]} intensity={0.9} color="#2dd4bf" />

          {/* 3D Hospital Operations Ward */}
          <HospitalSceneContent
            prefersReducedMotion={prefersReducedMotion}
            isTabActive={isTabActive}
          />
        </Canvas>
      )}
    </div>
  );
};
