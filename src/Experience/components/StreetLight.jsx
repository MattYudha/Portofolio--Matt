import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { SpotLight } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "../../store/usePortfolioStore";

export default function StreetLight(props) {
  const isNightMode = usePortfolioStore((state) => state.isNightMode);
  const isMobile = usePortfolioStore((state) => state.isMobile);
  const pandaRef = usePortfolioStore((state) => state.pandaRef);

  const bulbRef = useRef();
  const spotLightRef = useRef();
  const pointLightRef = useRef();
  const lampWorldPos = useRef(new THREE.Vector3());
  const pandaWorldPos = useRef(new THREE.Vector3());

  const [lightTarget] = useState(() => new THREE.Object3D());

  useEffect(() => {
    lightTarget.position.set(-2, -3, -5);
  }, [lightTarget]);

  useFrame(() => {
    // Calculate proximity boost based on distance to Panda
    let proximityBoostSpot = 0;
    let proximityBoostPoint = 0;
    let proximityBoostEmissive = 0;

    if (pandaRef && pandaRef.current && spotLightRef.current && spotLightRef.current.parent) {
      spotLightRef.current.parent.getWorldPosition(lampWorldPos.current);
      pandaRef.current.getWorldPosition(pandaWorldPos.current);
      
      const xDistance = Math.abs(lampWorldPos.current.x - pandaWorldPos.current.x);
      
      if (xDistance < 8.0) {
        let factor = 1.0 - (xDistance / 8.0);
        factor = Math.pow(factor, 1.5); // Exponential curve
        proximityBoostSpot = factor * (isMobile ? 30.0 : 60.0);
        proximityBoostPoint = factor * (isMobile ? 12.0 : 25.0);
        proximityBoostEmissive = factor * 4.0;
      }
    }

    // Animate bulb glow
    if (bulbRef.current) {
      const targetColor = isNightMode
        ? new THREE.Color("#ffe082")
        : new THREE.Color("#c9a84c");
      bulbRef.current.color.lerp(targetColor, 0.08);
      
      // Emissive glow for realism
      const targetEmissive = isNightMode
        ? new THREE.Color("#ffcc00")
        : new THREE.Color("#000000");
      bulbRef.current.emissive.lerp(targetEmissive, 0.08);
      bulbRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        bulbRef.current.emissiveIntensity,
        isNightMode ? 2.0 + proximityBoostEmissive : 0.0,
        0.08
      );
    }

    // Spotlight beam
    if (spotLightRef.current) {
      const targetIntensity = isNightMode ? (isMobile ? 25.0 : 45.0) + proximityBoostSpot : 0.0;
      spotLightRef.current.intensity = THREE.MathUtils.lerp(
        spotLightRef.current.intensity,
        targetIntensity,
        0.08
      );
    }

    // Ambient glow around the lantern
    if (pointLightRef.current) {
      const targetIntensity = isNightMode ? (isMobile ? 8.0 : 15.0) + proximityBoostPoint : 0.0;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        targetIntensity,
        0.08
      );
    }
  });

  // Style colors matching the hand-drawn scene
  const woodDark = "#5d4037";
  const woodMid = "#795548";
  const stoneDark = "#616161";

  return (
    <group {...props}>
      <primitive object={lightTarget} />

      {/* --- Stone Base --- */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.5, 0.16, 0.35]} />
        <meshStandardMaterial color={stoneDark} roughness={0.95} />
      </mesh>

      {/* --- Wooden Pole --- */}
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[0.12, 1.5, 0.1]} />
        <meshStandardMaterial color={woodDark} roughness={0.9} />
      </mesh>

      {/* --- Lantern Housing (lower platform) --- */}
      <mesh position={[0, 1.72, 0]}>
        <boxGeometry args={[0.55, 0.08, 0.4]} />
        <meshStandardMaterial color={woodDark} roughness={0.85} />
      </mesh>

      {/* --- Glowing Paper Lantern Body --- */}
      <mesh position={[0, 2.0, 0]}>
        <boxGeometry args={[0.38, 0.5, 0.28]} />
        <meshStandardMaterial
          ref={bulbRef}
          color="#c9a84c"
          emissive="#000000"
          emissiveIntensity={0}
          roughness={0.6}
        />
      </mesh>

      {/* --- Roof --- */}
      <mesh position={[0, 2.33, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.45]} />
        <meshStandardMaterial color={woodMid} roughness={0.85} />
      </mesh>
      {/* Roof cap */}
      <mesh position={[0, 2.42, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.22]} />
        <meshStandardMaterial color={woodDark} roughness={0.85} />
      </mesh>
      {/* Roof tip */}
      <mesh position={[0, 2.52, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.06]} />
        <meshStandardMaterial color={woodDark} roughness={0.85} />
      </mesh>

      {/* --- Ambient PointLight (warm glow around the lantern) --- */}
      <pointLight
        ref={pointLightRef}
        color="#ffcc80"
        position={[0, 2.0, 0.3]}
        distance={25}
        decay={2}
        intensity={0}
      />

      {/* --- Volumetric Spotlight (beam downward) --- */}
      <SpotLight
        ref={spotLightRef}
        position={[0, 2.0, 0.3]}
        target={lightTarget}
        color="#ffcc80"
        distance={30}
        angle={Math.PI / 3.5}
        attenuation={6}
        anglePower={3}
        intensity={0}
        opacity={isNightMode ? 0.5 : 0}
        castShadow={false}
      />
    </group>
  );
}
