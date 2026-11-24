"use client";

import React, { Suspense, useState, Component, ReactNode, ErrorInfo } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { TelemetryCore3D } from "./TelemetryCore3D";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("WebGL Context Encountered Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface Hero3DCanvasProps {
  mode: "vigil" | "pos";
}

export function Hero3DCanvas({ mode }: Hero3DCanvasProps) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <WebGLErrorBoundary
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-[#181818] border border-white/10 rounded-2xl">
          <div className="text-center p-6">
            <div className="w-3 h-3 rounded-full bg-primary mx-auto mb-2 animate-ping" />
            <span className="text-xs text-neutral-400 font-mono">Hardware Acceleration Standby</span>
          </div>
        </div>
      }
    >
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[540px] select-none touch-none">
        <Canvas
          shadows
          dpr={dpr}
          camera={{ position: [0, 0.5, 5.8], fov: 38, near: 0.1, far: 50 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.1,
          }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              console.warn("WebGL context lost, recovering gracefully...");
            });
          }}
        >
          {/* Automatic dynamic performance throttling */}
          <PerformanceMonitor
            onIncline={() => setDpr(2)}
            onDecline={() => setDpr(1)}
          />

          <Suspense fallback={null}>
            {/* Ambient Lighting */}
            <ambientLight intensity={0.4} />

            {/* Key Light */}
            <directionalLight
              position={[5, 8, 4]}
              intensity={1.8}
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-camera-near={0.5}
              shadow-camera-far={20}
              shadow-bias={-0.0001}
            />

            {/* Subtle Brand Accent Rim Light */}
            <pointLight position={[-4, -2, -3]} intensity={2.5} color="#e8732a" />

            {/* Studio Environment Reflections with Lightformer Strips (Zero external HDRI overhead) */}
            <Environment resolution={256} frames={1}>
              <Lightformer form="rect" intensity={3} position={[0, 6, -4]} scale={[12, 4, 1]} color="#ffffff" />
              <Lightformer form="ring" intensity={2} position={[-6, 3, 3]} scale={5} color="#fed7aa" />
              <Lightformer form="rect" intensity={1.5} position={[6, 0, 4]} scale={[4, 8, 1]} color="#38bdf8" />
            </Environment>

            {/* Interactive 3D Model Core */}
            <TelemetryCore3D mode={mode} />

            {/* Grounded Soft Contact Shadow */}
            <ContactShadows
              position={[0, -2.2, 0]}
              opacity={0.65}
              scale={8}
              blur={2.4}
              far={4}
              color="#000000"
            />

            {/* Interactive Orbit Controls - Never Hijack Vertical Page Scrolling */}
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              maxPolarAngle={Math.PI / 2 + 0.25}
              minPolarAngle={Math.PI / 2 - 0.35}
              rotateSpeed={0.6}
            />
          </Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
}
