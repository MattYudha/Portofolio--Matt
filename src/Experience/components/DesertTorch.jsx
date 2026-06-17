import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolioStore } from "../../store/usePortfolioStore";

export default function DesertTorch(props) {
  const isNightMode = usePortfolioStore((state) => state.isNightMode);
  const isMobile = usePortfolioStore((state) => state.isMobile);
  const pandaRef = usePortfolioStore((state) => state.pandaRef);

  const fireRef = useRef();
  const lightRef = useRef();
  const torchWorldPos = useRef(new THREE.Vector3());
  const pandaWorldPos = useRef(new THREE.Vector3());

  // Egyptian palette — warm sand and gold tones
  const sand = "#c4a265";
  const sandDark = "#a0824d";
  const gold = "#d4a843";

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Multi-sine chaotic flicker
    const flicker = Math.sin(t * 4) * 0.3
                  + Math.sin(t * 14) * 0.2
                  + Math.sin(t * 7.3) * 0.15;

    // Calculate proximity boost based on distance to Panda
    let proximityBoostPoint = 0;
    let proximityBoostEmissive = 0;

    if (pandaRef && pandaRef.current && lightRef.current && lightRef.current.parent) {
      lightRef.current.parent.getWorldPosition(torchWorldPos.current);
      pandaRef.current.getWorldPosition(pandaWorldPos.current);
      
      const xDistance = Math.abs(torchWorldPos.current.x - pandaWorldPos.current.x);
      
      if (xDistance < 8.0) {
        let factor = 1.0 - (xDistance / 8.0);
        factor = Math.pow(factor, 1.5); // Exponential curve
        proximityBoostPoint = factor * (isMobile ? 12.0 : 25.0);
        proximityBoostEmissive = factor * 4.0;
      }
    }

    // Animate fire emissive
    if (fireRef.current) {
      const targetEmissive = isNightMode
        ? new THREE.Color("#ff6d00")
        : new THREE.Color("#000000");
      fireRef.current.emissive.lerp(targetEmissive, 0.08);
      fireRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        fireRef.current.emissiveIntensity,
        isNightMode ? 3.0 + flicker + proximityBoostEmissive : 0.0,
        0.1
      );

      const targetColor = isNightMode
        ? new THREE.Color("#ffab40")
        : new THREE.Color("#d4a843");
      fireRef.current.color.lerp(targetColor, 0.08);
    }

    // PointLight with chaotic flicker (illuminates nearby objects)
    if (lightRef.current) {
      const baseIntensity = isMobile ? 6.0 : 12.0;
      const targetIntensity = isNightMode ? (baseIntensity + flicker * 4 + proximityBoostPoint) : 0;
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        targetIntensity,
        0.1
      );
    }
  });

  const d = 0.1; // Thin 3D to receive light

  return (
    <group {...props}>
      {/* --- Flat base (wide sandstone slab) --- */}
      <mesh position={[0, 0.06, 0]}>
        <boxGeometry args={[0.5, 0.12, d]} />
        <meshStandardMaterial color={sandDark} roughness={0.9} />
      </mesh>

      {/* --- Pillar (thin Egyptian column) --- */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.1, 1.45, d]} />
        <meshStandardMaterial color={sand} roughness={0.9} />
      </mesh>

      {/* --- Bowl / dish (wider top piece) --- */}
      <mesh position={[0, 1.62, 0]}>
        <boxGeometry args={[0.32, 0.1, d]} />
        <meshStandardMaterial color={sandDark} roughness={0.9} />
      </mesh>

      {/* --- Fire (small glowing piece on top) --- */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[0.18, 0.25, d]} />
        <meshStandardMaterial
          ref={fireRef}
          color={gold}
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.5}
        />
      </mesh>

      {/* --- PointLight (warm fire glow) --- */}
      <pointLight
        ref={lightRef}
        color="#ff8a50"
        position={[0, 1.8, 0.3]}
        distance={25}
        decay={2}
        intensity={0}
      />
    </group>
  );
}
