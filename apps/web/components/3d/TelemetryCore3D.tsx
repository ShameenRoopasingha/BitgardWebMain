"use client";

import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";

interface TelemetryCore3DProps {
  mode: "vigil" | "pos";
}

export function TelemetryCore3D({ mode }: TelemetryCore3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Target rotation for mouse parallax
  const targetRotation = useRef({ x: 0, y: 0 });

  // Generate particle coordinates once (Zero allocation in useFrame)
  const [particlesPos, particleColors] = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const orangeColor = new THREE.Color("#e8732a");
    const cyanColor = new THREE.Color("#38bdf8");
    const whiteColor = new THREE.Color("#ffffff");

    for (let i = 0; i < count; i++) {
      const radius = 2.0 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const chosenColor = Math.random() > 0.4 ? orangeColor : (Math.random() > 0.5 ? cyanColor : whiteColor);
      colors[i * 3] = chosenColor.r;
      colors[i * 3 + 1] = chosenColor.g;
      colors[i * 3 + 2] = chosenColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);

    // Smooth mouse parallax damping
    targetRotation.current.x = state.pointer.y * 0.35;
    targetRotation.current.y = state.pointer.x * 0.5;

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        4,
        dt
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        4,
        dt
      );
    }

    // Continuous orbital ring rotations
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += 0.4 * dt;
      ring1Ref.current.rotation.x += 0.2 * dt;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += 0.5 * dt;
      ring2Ref.current.rotation.z -= 0.3 * dt;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= 0.35 * dt;
      ring3Ref.current.rotation.y -= 0.25 * dt;
    }

    // Core pulsing rotation
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.6 * dt;
      coreRef.current.rotation.x += 0.3 * dt;
    }

    // Particle cloud slow drift
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.08 * dt;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Gentle floating physics */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        
        {/* Central Monolithic Glass Core */}
        <mesh ref={coreRef} castShadow receiveShadow>
          <octahedronGeometry args={[1.2, 0]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={1.5}
            chromaticAberration={0.06}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.2}
            temporalDistortion={0.1}
            iridescence={0.3}
            roughness={0.12}
            color={mode === "vigil" ? "#1e293b" : "#1f1d19"}
            attenuationColor={mode === "vigil" ? "#e8732a" : "#ea580c"}
            attenuationDistance={1.2}
          />
        </mesh>

        {/* Inner Glowing Amber Heart */}
        <mesh>
          <dodecahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#e8732a"
            emissive="#e8732a"
            emissiveIntensity={mode === "vigil" ? 2.5 : 3.2}
            roughness={0.2}
            metalness={0.8}
            toneMapped={false}
          />
        </mesh>

        {/* Telemetry Ring 1: Primary Equatorial Orbit */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[2.0, 0.025, 16, 100]} />
          <meshStandardMaterial
            color="#e8732a"
            emissive="#e8732a"
            emissiveIntensity={1.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Telemetry Ring 2: Polar Meridian Orbit */}
        <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[2.3, 0.02, 16, 100]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.6}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Telemetry Ring 3: Tilted Outer Sensor Rail */}
        <mesh ref={ring3Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
          <torusGeometry args={[2.6, 0.015, 16, 100]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#38bdf8"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Satellite Node Beacons (Representing connected vehicles / cashier terminals) */}
        {mode === "vigil" ? (
          <>
            {/* GPS Fleet Radar Beacons */}
            <mesh position={[2.0, 0.8, 0]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#e8732a" emissive="#e8732a" emissiveIntensity={3} />
            </mesh>
            <mesh position={[-1.7, -1.2, 0.6]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} />
            </mesh>
            <mesh position={[0.5, 2.1, -0.8]}>
              <sphereGeometry args={[0.09, 16, 16]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={3} />
            </mesh>
          </>
        ) : (
          <>
            {/* POS Cashier Register Data Blocks */}
            <mesh position={[1.8, 0.6, 0.5]} rotation={[0.2, 0.4, 0]}>
              <boxGeometry args={[0.18, 0.18, 0.18]} />
              <meshStandardMaterial color="#e8732a" emissive="#e8732a" emissiveIntensity={2.5} metalness={0.8} />
            </mesh>
            <mesh position={[-1.5, -0.9, -0.4]} rotation={[0.5, -0.2, 0]}>
              <boxGeometry args={[0.14, 0.14, 0.14]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} metalness={0.8} />
            </mesh>
            <mesh position={[0.3, -1.9, 0.9]} rotation={[-0.3, 0.5, 0]}>
              <boxGeometry args={[0.16, 0.16, 0.16]} />
              <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} metalness={0.8} />
            </mesh>
          </>
        )}

        {/* Ambient Orbiting Starfield / Telemetry Dust */}
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particlesPos.length / 3}
              array={particlesPos}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={particleColors.length / 3}
              array={particleColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.04}
            vertexColors
            transparent
            opacity={0.7}
            sizeAttenuation
            depthWrite={false}
          />
        </points>

      </Float>
    </group>
  );
}
