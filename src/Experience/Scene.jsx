import { React, Suspense, useState, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import MovingObjects from "./models/Moving_Objects";
import SceneOne from "./models/SceneOne";
import SceneTwo from "./models/SceneTwo";
import SceneThree from "./models/SceneThree";
import SceneFour from "./models/SceneFour";
import SingleSheet from "./models/SingleSheet";
import Panda from "./models/Panda";
import Campfire from "./components/Campfire";
import Fireflies from "./components/Fireflies";
import {
  cameraCurve as initialCameraCurve,
  initialCameraPoints,
  SHIFT_X_AMOUNT,
  rotationTargets,
} from "./components/curve";
import { useScrollCurve } from "./hooks/useScrollCurve";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { globalMaterialsRegistry } from "./utils/ktxLoader";


const WORLD_FORWARD_TRIGGER = 0.92;
const WORLD_BACK_TRIGGER = 0.91;
const SINGLE_FORWARD_TRIGGER = 0.5;
const SINGLE_BACK_TRIGGER = 0.35;

const Scene = ({
  cameraGroup,
  camera,
  scrollProgress,
  targetScrollProgress,
  lerpFactor,
  mousePositionOffset,
  mouseRotationOffset,
  scrollSpeedMultiplier,
}) => {
  const { size } = useThree();
  const aspect = size.width / size.height;
  const isMobile = usePortfolioStore((state) => state.isMobile);
  const isNightMode = usePortfolioStore((state) => state.isNightMode);

  const cameraScrollCurve = useScrollCurve(
    initialCameraCurve,
    initialCameraPoints,
    SHIFT_X_AMOUNT,
  );

  const masterGroupRef = useRef();
  const sceneGroupRef = useRef();
  const singleSheetRef = useRef();
  const ambientLightRef = useRef();
  const dirLightRef = useRef();
  const currentTintRef = useRef(new THREE.Color("#ffffff"));


  const shiftWorld = (direction = "forward") => {
    if (!sceneGroupRef.current) return;
    const offset =
      direction === "forward"
        ? SHIFT_X_AMOUNT * cameraScrollCurve.loopCounter.current
        : SHIFT_X_AMOUNT * (cameraScrollCurve.loopCounter.current - 1);
    sceneGroupRef.current.position.x = offset;
  };

  const shiftSingleSheet = (direction = "forward") => {
    if (!singleSheetRef.current) return;
    const offset =
      direction === "forward"
        ? SHIFT_X_AMOUNT * cameraScrollCurve.loopCounter.current
        : SHIFT_X_AMOUNT * (cameraScrollCurve.loopCounter.current - 1);
    singleSheetRef.current.position.x = offset;
  };

  const [rotationBufferQuat] = useState(
    new THREE.Quaternion().setFromEuler(rotationTargets[0].rotation),
  );

  const getLerpedRotation = (progress) => {
    if (cameraScrollCurve.transitionCurveActive.current) {
      const lerpFactor = (progress - 0) / (1 - 0);
      const startQuaternion = new THREE.Quaternion().setFromEuler(
        rotationTargets[rotationTargets.length - 1].rotation,
      );
      const endQuaternion = new THREE.Quaternion().setFromEuler(
        rotationTargets[0].rotation,
      );
      const lerpingQuaternion = new THREE.Quaternion();
      lerpingQuaternion.slerpQuaternions(
        startQuaternion,
        endQuaternion,
        lerpFactor,
      );
      return lerpingQuaternion;
    } else {
      for (let i = 0; i < rotationTargets.length - 1; i++) {
        const start = rotationTargets[i];
        const end = rotationTargets[i + 1];
        if (progress >= start.progress && progress <= end.progress) {
          const lerpFactor =
            (progress - start.progress) / (end.progress - start.progress);
          const startQuaternion = new THREE.Quaternion().setFromEuler(
            start.rotation,
          );
          const endQuaternion = new THREE.Quaternion().setFromEuler(
            end.rotation,
          );
          const lerpingQuaternion = new THREE.Quaternion();
          lerpingQuaternion.slerpQuaternions(
            startQuaternion,
            endQuaternion,
            lerpFactor,
          );
          return lerpingQuaternion;
        }
      }
    }
    return new THREE.Quaternion().setFromEuler(
      rotationTargets[rotationTargets.length - 1].rotation,
    );
  };

  useFrame((state) => {
    if (camera.current) {
      const targetFov = aspect < 1 ? 52 : 35;
      if (camera.current.fov !== targetFov) {
        camera.current.fov = targetFov;
        camera.current.updateProjectionMatrix();
      }
    }

    // Animate background color
    const targetBg = isNightMode ? new THREE.Color("#1e1b4b") : new THREE.Color("#fdfbf7"); // Deep Dusk Indigo vs Cream
    if (!state.scene.background) state.scene.background = new THREE.Color("#fdfbf7");
    state.scene.background.lerp(targetBg, 0.15);

    // Animate all materials (Night Mode Tint)
    const targetTint = isNightMode ? new THREE.Color("#475569") : new THREE.Color("#ffffff"); // slate-600 for twilight
    
    // Check if we actually need to update material colors (optimization to avoid traverse overhead)
    if (!currentTintRef.current.equals(targetTint)) {
      currentTintRef.current.lerp(targetTint, 0.15);
      
      // If color is very close to target, snap it to avoid precision drift
      const rDiff = Math.abs(currentTintRef.current.r - targetTint.r);
      const gDiff = Math.abs(currentTintRef.current.g - targetTint.g);
      const bDiff = Math.abs(currentTintRef.current.b - targetTint.b);
      if (rDiff + gDiff + bDiff < 0.01) {
        currentTintRef.current.copy(targetTint);
      }

      // Fast iteration over just the registered materials
      globalMaterialsRegistry.forEach((material) => {
        if (material.color) {
          material.color.copy(currentTintRef.current);
        }
      });
    }

    // Animate global lights for Panda (since it's now MeshStandardMaterial)
    if (ambientLightRef.current) {
      ambientLightRef.current.intensity = THREE.MathUtils.lerp(
        ambientLightRef.current.intensity,
        isNightMode ? 0.35 : 1.5,
        0.15
      );
    }
    if (dirLightRef.current) {
      dirLightRef.current.intensity = THREE.MathUtils.lerp(
        dirLightRef.current.intensity,
        isNightMode ? 0.2 : 2.5,
        0.15
      );
    }


    let newProgress = THREE.MathUtils.lerp(
      scrollProgress.current,
      targetScrollProgress.current,
      lerpFactor,
    );

    if (newProgress >= 1) {
      if (cameraScrollCurve.transitionCurveActive.current) {
        cameraScrollCurve.transitionCurveActive.current = false;
        cameraScrollCurve.shiftCurvePoints("forward");
        cameraScrollCurve.loopCounter.current++;
      } else {
        cameraScrollCurve.transitionCurveActive.current = true;
        cameraScrollCurve.initiateTransitionCurve();
      }
      scrollProgress.current -= 1;
      targetScrollProgress.current -= 1;
      newProgress -= 1;
    } else if (newProgress < 0) {
      if (cameraScrollCurve.transitionCurveActive.current) {
        cameraScrollCurve.transitionCurveActive.current = false;
        cameraScrollCurve.shiftCurvePoints("backward");
      } else {
        cameraScrollCurve.loopCounter.current--;
        cameraScrollCurve.transitionCurveActive.current = true;
        cameraScrollCurve.initiateTransitionCurve();
      }
      scrollProgress.current += 1;
      targetScrollProgress.current += 1;
      newProgress += 1;
    }

    scrollProgress.current = newProgress;
    usePortfolioStore.getState().setScrollProgress(newProgress);

    if (cameraScrollCurve.transitionCurveActive.current) {
      scrollSpeedMultiplier.current = newProgress <= 0.95 ? 6 : 1;
    } else {
      scrollSpeedMultiplier.current = 1;
    }

    if (
      newProgress > WORLD_FORWARD_TRIGGER &&
      !cameraScrollCurve.transitionCurveActive.current
    ) {
      shiftWorld("forward");
    }
    if (
      newProgress <= WORLD_BACK_TRIGGER &&
      !cameraScrollCurve.transitionCurveActive.current
    ) {
      shiftWorld("backward");
    }
    if (
      newProgress >= SINGLE_FORWARD_TRIGGER &&
      !cameraScrollCurve.transitionCurveActive.current
    ) {
      shiftSingleSheet("forward");
    }
    if (
      newProgress <= SINGLE_BACK_TRIGGER &&
      !cameraScrollCurve.transitionCurveActive.current
    ) {
      shiftSingleSheet("backward");
    }

    const basePoint = cameraScrollCurve.getCurrentPoint(newProgress);

    // console.log(basePoint);

    cameraGroup.current.position.x = THREE.MathUtils.lerp(
      cameraGroup.current.position.x,
      basePoint.x,
      0.1,
    );
    cameraGroup.current.position.y = THREE.MathUtils.lerp(
      cameraGroup.current.position.y,
      basePoint.y,
      0.1,
    );
    cameraGroup.current.position.z = THREE.MathUtils.lerp(
      cameraGroup.current.position.z,
      basePoint.z,
      0.1,
    );

    camera.current.position.x = THREE.MathUtils.lerp(
      camera.current.position.x,
      mousePositionOffset.current.x,
      0.1,
    );
    camera.current.position.y = THREE.MathUtils.lerp(
      camera.current.position.y,
      -mousePositionOffset.current.y,
      0.1,
    );
    camera.current.position.z = 0;

    const targetRotation = getLerpedRotation(newProgress);
    rotationBufferQuat.slerp(targetRotation, 0.05);
    cameraGroup.current.quaternion.copy(rotationBufferQuat);

    camera.current.rotation.x = THREE.MathUtils.lerp(
      camera.current.rotation.x,
      -mouseRotationOffset.current.x,
      0.1,
    );
    camera.current.rotation.y = THREE.MathUtils.lerp(
      camera.current.rotation.y,
      -mouseRotationOffset.current.y,
      0.1,
    );
  });

  return (
    <group ref={masterGroupRef} dispose={null}>
      <ambientLight ref={ambientLightRef} intensity={1.5} color="#ffffff" />
      <directionalLight ref={dirLightRef} intensity={2.5} color="#ffffff" position={[5, 10, 5]} castShadow />
      
      <Suspense fallback={null}>
        <group position={[isMobile ? 0.8 : 0, 0, 0]}>
          <group ref={sceneGroupRef}>
            <MovingObjects scrollProgress={scrollProgress} />
            <SceneOne />
            <Fireflies />
            <Campfire position={[-18, 0.6, -1.5]} scale={[1.5, 1.5, 1.5]} />
            <Campfire position={[-28, 0.6, 1]} scale={[1.2, 1.2, 1.2]} />
            <SceneTwo />
            <SceneThree scrollProgress={scrollProgress} />
            <Campfire position={[-40, 0.6, -2]} scale={[1.8, 1.8, 1.8]} />
            <SceneFour />
          </group>


          <Panda
            scrollProgress={scrollProgress}
            cameraScrollCurve={cameraScrollCurve}
          />
          <group ref={singleSheetRef}>
            <SingleSheet scrollProgress={scrollProgress} />
          </group>
        </group>
      </Suspense>
    </group>
  );
};

export default Scene;
