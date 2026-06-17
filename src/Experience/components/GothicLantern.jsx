import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "../../store/usePortfolioStore";

export default function GothicLantern(props) {
  const isNightMode = usePortfolioStore((state) => state.isNightMode);
  const isMobile = usePortfolioStore((state) => state.isMobile);
  const pandaRef = usePortfolioStore((state) => state.pandaRef);

  const bulbRef = useRef();
  const spotLightRef = useRef();
  const pointLightRef = useRef();
  const lanternWorldPos = useRef(new THREE.Vector3());
  const pandaWorldPos = useRef(new THREE.Vector3());

  const [lightTarget] = useState(() => new THREE.Object3D());

  useEffect(() => {
    // Point downward towards the ground/wall behind
    lightTarget.position.set(0, -4, -4);
  }, [lightTarget]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Subtle eerie pulsing for the green glow
    const pulse = Math.sin(t * 2) * 0.15 + Math.sin(t * 5.7) * 0.1;

    // Calculate proximity boost based on distance to Panda
    let proximityBoostSpot = 0;
    let proximityBoostPoint = 0;
    let proximityBoostEmissive = 0;

    if (pandaRef && pandaRef.current && spotLightRef.current && spotLightRef.current.parent) {
      spotLightRef.current.parent.getWorldPosition(lanternWorldPos.current);
      pandaRef.current.getWorldPosition(pandaWorldPos.current);
      
      const xDistance = Math.abs(lanternWorldPos.current.x - pandaWorldPos.current.x);
      
      // If panda is within 8 units horizontally, calculate a boost factor (0 to 1)
      if (xDistance < 8.0) {
        let factor = 1.0 - (xDistance / 8.0);
        factor = Math.pow(factor, 1.5); // Smoother exponential curve
        proximityBoostSpot = factor * (isMobile ? 50.0 : 100.0);
        proximityBoostPoint = factor * (isMobile ? 10.0 : 20.0);
        proximityBoostEmissive = factor * 4.0;
      }
    }

    // Animate bulb emissive
    if (bulbRef.current) {
      const targetEmissive = isNightMode
        ? new THREE.Color("#b2ff59")
        : new THREE.Color("#000000");
      bulbRef.current.emissive.lerp(targetEmissive, 0.08);
      bulbRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        bulbRef.current.emissiveIntensity,
        isNightMode ? 3.5 + pulse + proximityBoostEmissive : 0.0,
        0.08
      );

      const targetColor = isNightMode
        ? new THREE.Color("#ccff90")
        : new THREE.Color("#2a2624");
      bulbRef.current.color.lerp(targetColor, 0.08);
    }

    // SpotLight volumetric
    if (spotLightRef.current) {
      const baseIntensity = isMobile ? 15.0 : 30.0;
      const targetIntensity = isNightMode ? baseIntensity + pulse * 5 + proximityBoostSpot : 0;
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        targetIntensity,
        0.08
      );
    }

    // Ambient PointLight so nearby objects (like the panda or tombstone) get lit up
    if (pointLightRef.current) {
      const baseIntensity = isMobile ? 4.0 : 8.0;
      const targetIntensity = isNightMode ? baseIntensity + pulse * 2 + proximityBoostPoint : 0;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        targetIntensity,
        0.08
      );
    }
  });

  // Flat castle-matching palette (warm brownish dark grey)
  const ironDark = "#3a3634"; 
  const ironMid = "#4a4644";
  
  const d = 0.1; // thin 3D

  return (
    <group {...props}>
      <primitive object={lightTarget} />

      {/* --- Iron Base --- */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.35, 0.2, d]} />
        <meshStandardMaterial color={ironDark} roughness={0.9} />
      </mesh>

      {/* --- Iron Pole --- */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.1, 1.8, d]} />
        <meshStandardMaterial color={ironDark} roughness={0.9} />
      </mesh>

      {/* --- Horizontal Arm (extending left and right) --- */}
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[0.35, 0.06, d]} />
        <meshStandardMaterial color={ironMid} roughness={0.9} />
      </mesh>

      {/* --- Lantern Housing (dark cage) --- */}
      {/* Housing top */}
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[0.25, 0.08, d]} />
        <meshStandardMaterial color={ironDark} roughness={0.9} />
      </mesh>
      {/* Housing bottom */}
      <mesh position={[0, 1.75, 0]}>
        <boxGeometry args={[0.25, 0.06, d]} />
        <meshStandardMaterial color={ironDark} roughness={0.9} />
      </mesh>
      {/* Housing left bar */}
      <mesh position={[-0.1, 1.9, 0]}>
        <boxGeometry args={[0.04, 0.3, d]} />
        <meshStandardMaterial color={ironMid} roughness={0.9} />
      </mesh>
      {/* Housing right bar */}
      <mesh position={[0.1, 1.9, 0]}>
        <boxGeometry args={[0.04, 0.3, d]} />
        <meshStandardMaterial color={ironMid} roughness={0.9} />
      </mesh>

      {/* --- Toxic Green Bulb --- */}
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[0.12, 0.2, d]} />
        <meshStandardMaterial
          ref={bulbRef}
          color="#2a2624"
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.5}
        />
      </mesh>

      {/* --- PointLight (illuminate nearby objects) --- */}
      <pointLight
        ref={pointLightRef}
        color="#b2ff59"
        position={[0, 1.9, 0.3]}
        distance={25}
        decay={2}
        intensity={0}
      />

      {/* --- Volumetric SpotLight (eerie green beam) --- */}
      <SpotLight
        ref={spotLightRef}
        position={[0, 1.9, 0.2]}
        target={lightTarget}
        color="#b2ff59"
        distance={30}
        angle={Math.PI / 3.5}
        attenuation={5}
        anglePower={3}
        intensity={0}
        opacity={isNightMode ? 0.35 : 0}
        castShadow={false}
      />
    </group>
  );
}
