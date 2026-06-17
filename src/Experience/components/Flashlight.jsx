import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolioStore } from "../../store/usePortfolioStore";

export default function Flashlight() {
  const isNightMode = usePortfolioStore((state) => state.isNightMode);
  const isMobile = usePortfolioStore((state) => state.isMobile);
  const activeSection = usePortfolioStore((state) => state.activeSection);
  
  const lightRef = useRef();
  const targetRef = useRef();

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current;
    }
  }, []);

  useFrame((state) => {
    if (!lightRef.current || !targetRef.current) return;

    // The flashlight should only be active in Night Mode
    // And to make it feel extremely cool, we activate it in the Experience & Contact sections (Scene 3 & 4)
    // as well as the Project section (Scene 2) if desired, but let's make it active throughout Night Mode!
    if (!isNightMode) {
      lightRef.current.intensity = 0;
      return;
    }

    const pointer = state.pointer;

    // Map pointer [-1, 1] to target position in front of the camera
    // On mobile, we can make it point slightly lower or center it,
    // but on desktop it follows mouse client pointer coordinates.
    const targetX = pointer.x * (isMobile ? 3.0 : 6.0);
    const targetY = pointer.y * (isMobile ? 2.5 : 4.5);
    
    // Smoothly lerp target position
    targetRef.current.position.x = THREE.MathUtils.lerp(targetRef.current.position.x, targetX, 0.1);
    targetRef.current.position.y = THREE.MathUtils.lerp(targetRef.current.position.y, targetY, 0.1);
    targetRef.current.position.z = -12; // deep projection

    // Dynamic intensity transition
    // Active only in night mode, slightly lower intensity on mobile
    const baseIntensity = isMobile ? 12.0 : 25.0;
    lightRef.current.intensity = THREE.MathUtils.lerp(
      lightRef.current.intensity,
      baseIntensity,
      0.15
    );
  });


  return (
    <group>
      <spotLight
        ref={lightRef}
        color="#fef08a" // warm bright light
        intensity={0}
        distance={28}
        angle={isMobile ? Math.PI / 5 : Math.PI / 6} // slightly wider beam on mobile
        penumbra={0.7} // soft edges
        decay={1.2}
        castShadow={!isMobile}
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-far={28}
        shadow-camera-near={1}
        shadow-bias={-0.001}
      />

      {/* Target object */}
      <object3D ref={targetRef} position={[0, 0, -12]} />
    </group>
  );
}
