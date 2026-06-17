import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "../../store/usePortfolioStore";

export default function Fireflies() {
  const isNightMode = usePortfolioStore((state) => state.isNightMode);
  const isMobile = usePortfolioStore((state) => state.isMobile);
  
  const lightRef1 = useRef();
  const lightRef2 = useRef();

  useFrame((state) => {
    if (!isNightMode) {
      if (lightRef1.current) lightRef1.current.intensity = 0;
      if (lightRef2.current) lightRef2.current.intensity = 0;
      return;
    }

    const t = state.clock.elapsedTime;

    // Slow organic drift path for light 1
    if (lightRef1.current) {
      lightRef1.current.position.x = -14 + Math.sin(t * 0.5) * 3;
      lightRef1.current.position.y = 1.5 + Math.cos(t * 0.8) * 0.7;
      lightRef1.current.position.z = -1.5 + Math.sin(t * 0.6) * 1.5;
      
      // Flickering intensity
      const baseIntensity = isMobile ? 1.5 : 3.0;
      lightRef1.current.intensity = baseIntensity + Math.sin(t * 8) * 0.5;
    }

    // Slow organic drift path for light 2
    if (lightRef2.current) {
      lightRef2.current.position.x = -8 + Math.cos(t * 0.4) * 2.5;
      lightRef2.current.position.y = 1.2 + Math.sin(t * 0.7) * 0.5;
      lightRef2.current.position.z = -2.2 + Math.cos(t * 0.5) * 1.0;

      // Flickering intensity
      const baseIntensity = isMobile ? 1.0 : 2.5;
      lightRef2.current.intensity = baseIntensity + Math.cos(t * 10) * 0.4;
    }
  });

  if (!isNightMode) return null;

  return (
    <group>
      {/* Sparkles Cluster 1 - Main grass area */}
      <Sparkles
        count={isMobile ? 25 : 50}
        speed={0.6}
        opacity={0.8}
        color="#a3e635"
        size={isMobile ? 3 : 5}
        scale={[8, 3, 4]}
        position={[-12, 1.2, -1.8]}
      />

      {/* Sparkles Cluster 2 - Near Mrs Panda & waterfall */}
      <Sparkles
        count={isMobile ? 15 : 30}
        speed={0.8}
        opacity={0.7}
        color="#d8f365"
        size={isMobile ? 2 : 4}
        scale={[6, 3, 3]}
        position={[-7, 1.5, -2.2]}
      />

      {/* Floating Light Source 1 */}
      <pointLight
        ref={lightRef1}
        color="#d8f365"
        distance={6}
        decay={2.0}
        intensity={0}
      />

      {/* Floating Light Source 2 */}
      <pointLight
        ref={lightRef2}
        color="#a3e635"
        distance={5}
        decay={2.0}
        intensity={0}
      />
    </group>
  );
}
