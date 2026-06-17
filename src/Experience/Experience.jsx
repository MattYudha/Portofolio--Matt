import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Scene from "./Scene";
import * as THREE from "three";
import normalizeWheel from "normalize-wheel";
import { usePortfolioStore } from "../store/usePortfolioStore";

const Experience = () => {
  const camera = useRef();
  const cameraGroup = useRef();
  const scrollProgress = useRef(0);
  const targetScrollProgress = useRef(0);
  const baseScrollSpeed = 0.0085;
  const scrollSpeedMultiplier = useRef(1);
  const lerpFactor = 0.1;
  const isSwiping = useRef(false);
  const mousePositionOffset = useRef(new THREE.Vector3());
  const mouseRotationOffset = useRef(new THREE.Euler());
  const lastTouchY = useRef(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  useEffect(() => {
    const handleWheel = (e) => {
      if (usePortfolioStore.getState().selectedProject || usePortfolioStore.getState().selectedExperience) return;
      if (e.target && e.target.closest && e.target.closest("[data-prevent-scroll]")) return;
      
      const normalized = normalizeWheel(e);

      targetScrollProgress.current +=
        Math.sign(normalized.pixelY) *
        baseScrollSpeed *
        scrollSpeedMultiplier.current *
        Math.min(Math.abs(normalized.pixelY) / 100, 1);
    };

    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = (e.clientY / window.innerHeight) * 2 - 1;

      const sensitivityX = 0.05;
      const sensitivityY = 0.05;

      mousePositionOffset.current.x = mouseX * sensitivityX;
      mousePositionOffset.current.y = mouseY * sensitivityY;

      const rotationSensitivityX = 0.05;
      const rotationSensitivityY = 0.05;

      mouseRotationOffset.current.x = mouseY * rotationSensitivityX;
      mouseRotationOffset.current.y = mouseX * rotationSensitivityY;
    };

    const handleTouchStart = (e) => {
      if (usePortfolioStore.getState().selectedProject || usePortfolioStore.getState().selectedExperience) return;
      if (e.target && e.target.closest && e.target.closest("[data-prevent-scroll]")) return;
      isSwiping.current = true;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
      lastTouchY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      // In mobile slide/swipe navigation mode, we do not perform continuous vertical scroll on drag.
    };

    const handleTouchEnd = (e) => {
      if (!isSwiping.current) return;
      isSwiping.current = false;
      lastTouchY.current = null;

      if (e.changedTouches && e.changedTouches.length > 0) {
        const diffX = e.changedTouches[0].clientX - touchStartX.current;
        const diffY = e.changedTouches[0].clientY - touchStartY.current;
        const elapsedTime = Date.now() - touchStartTime.current;

        // Swipe threshold: time < 350ms, horizontal delta > 40px, and horizontal delta is larger than vertical delta
        if (elapsedTime < 350 && Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          const targets = [0.0, 0.35, 0.60, 0.80, 0.98];
          let currentTargetVal = targetScrollProgress.current % 1;
          if (currentTargetVal < 0) currentTargetVal += 1;

          let closestIndex = 0;
          let minDiff = Infinity;
          for (let i = 0; i < targets.length; i++) {
            const diff = Math.abs(targets[i] - currentTargetVal);
            if (diff < minDiff) {
              minDiff = diff;
              closestIndex = i;
            }
          }

          if (diffX < 0) {
            // Swipe Left -> Next Section
            let targetVal;
            if (closestIndex < targets.length - 1) {
              targetVal = targets[closestIndex + 1];
              const integerPart = Math.floor(targetScrollProgress.current);
              targetScrollProgress.current = integerPart + targetVal;
            } else {
              const integerPart = Math.floor(targetScrollProgress.current);
              targetScrollProgress.current = integerPart + 1.0;
            }
          } else {
            // Swipe Right -> Previous Section
            let targetVal;
            if (closestIndex > 0) {
              targetVal = targets[closestIndex - 1];
              const integerPart = Math.floor(targetScrollProgress.current);
              targetScrollProgress.current = integerPart + targetVal;
            } else {
              const integerPart = Math.floor(targetScrollProgress.current);
              targetScrollProgress.current = integerPart - 0.02; // snaps to 0.98 of previous loop
            }
          }
        }
      }
    };

    const handleMouseDown = (e) => {
      if (usePortfolioStore.getState().selectedProject || usePortfolioStore.getState().selectedExperience) return;
      if (e.pointerType === "touch") return;
      if (e.target && e.target.closest && e.target.closest("[data-prevent-scroll]")) return;
      isSwiping.current = true;
    };

    const handleMouseDrag = (e) => {
      if (!isSwiping.current || e.pointerType === "touch") return;
      if (usePortfolioStore.getState().selectedProject || usePortfolioStore.getState().selectedExperience) return;
      
      const mouseMultiplier = 0.2;
      targetScrollProgress.current +=
        Math.sign(e.movementY) * baseScrollSpeed * mouseMultiplier;
    };

    const handleMouseUp = () => {
      isSwiping.current = false;
    };

    const handleJump = (e) => {
      if (typeof e.detail === "number") {
        targetScrollProgress.current = e.detail;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleMouseDrag);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("portfolio-jump", handleJump);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseDrag);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("portfolio-jump", handleJump);
    };
  }, []);

  return (
    <Canvas
      shadows
      flat={true}
      style={{ width: "100vw", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 1 }}
    >
      <Scene
        cameraGroup={cameraGroup}
        camera={camera}
        scrollProgress={scrollProgress}
        targetScrollProgress={targetScrollProgress}
        lerpFactor={lerpFactor}
        mousePositionOffset={mousePositionOffset}
        mouseRotationOffset={mouseRotationOffset}
        scrollSpeedMultiplier={scrollSpeedMultiplier}
      />

      <group ref={cameraGroup}>
        <PerspectiveCamera
          ref={camera}
          makeDefault
          fov={35}
          // position={[0, 0, 30]}
        />
        {/* <OrbitControls enableZoom={false} enableRotate={false} /> */}
      </group>
    </Canvas>
  );
};

export default Experience;
