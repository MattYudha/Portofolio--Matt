import React, { useRef, useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import styles from "./IntroScreen.module.scss";
import { usePortfolioStore } from "../../store/usePortfolioStore";

const IntroScreen = () => {
  const { progress } = useProgress();
  const [shouldRender, setShouldRender] = useState(true);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const progressRef = useRef({ val: 0 });
  const introRef = useRef(null);

  // Smooth out the progress value
  useEffect(() => {
    gsap.to(progressRef.current, {
      val: progress,
      duration: 1.2, // Smooth duration
      ease: "power2.out",
      onUpdate: () => {
        setSmoothProgress(progressRef.current.val);
      }
    });
  }, [progress]);

  useGSAP(() => {
    if (Math.round(smoothProgress) >= 100) {
      const tl = gsap.timeline({
        onComplete: () => {
          setShouldRender(false);
          usePortfolioStore.getState().setIsLoaded(true);
        },
      });

      tl.to(introRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5, // Reduced delay as the smooth progress already takes time
      });
    }
  }, [Math.round(smoothProgress)]);

  const getLoadingMessage = (prog) => {
    const p = Math.round(prog);
    if (p < 20) return "⚙️ Menyiapkan ban sepeda Rahmat... (Biar ga bocor di jalan) 🚴‍♂️";
    if (p < 40) return "🎋 Menimbun stok bambu Panda... Panda lapar = sepeda mogok! 🐼";
    if (p < 60) return "🔌 Menghubungkan kabel-kabel kreativitas Rahmat ke server... ⚡";
    if (p < 80) return "🚴‍♂️ Panda sedang mengayuh sekuat tenaga menembus dimensi 3D... Semangatt!!";
    if (p < 99) return "📚 Merapikan lembaran kertas portofolio wobbly Rahmat... Hampir rapi!";
    return "✨ Semuanya siap! Rahmat & Panda siap menyambut Anda! 🐼🎉";
  };

  if (!shouldRender) return null;

  const displayProgress = Math.round(smoothProgress);

  return (
    <>
      <div ref={introRef} className={styles.introScreen}>
        <div className={styles.introScreenContent}>
          <div className={styles.premiumLoaderWrapper}>
            <div className={styles.spinnerRing}></div>
            <div className={styles.spinnerRingInner}></div>
            <div className={styles.pandaWrapper}>
              <span className={styles.pandaIcon}>🐼🚴‍♂️</span>
            </div>
          </div>

          <h1 className={styles.title}>Rahmat's Interactive Journey</h1>

          <div className={styles.progressBarContainer}>
            <div
              className={styles.progressBar}
              style={{ width: `${smoothProgress}%` }}
            ></div>
          </div>

          <div className={styles.progressPercentage}>
            {displayProgress}%
          </div>

          <div className={styles.loadingText}>
            {getLoadingMessage(smoothProgress)}
          </div>
          
          <div className={styles.instructionText}>
            💡 Desktop: Scroll/Drag to navigate | Mobile: Swipe Left/Right or Tap Arrows to Slide
          </div>
        </div>

        <a
          href="https://www.youtube.com/watch?v=zyWD2E8AHCg"
          className="tutorial-link"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "20%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "#6a5a4aff",
            fontFamily: "Shadows Into Light, cursive",
            textDecoration: "underline",
          }}
        >
          Watch tutorial here!!
        </a>
        <a
          href="https://github.com/andrewwoan/mr-pandas-psychologically-safe-portfolio"
          className="credits-link"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            left: "50%",
            bottom: "12%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            color: "#6a5a4aff",
            fontFamily: "Shadows Into Light, cursive",
            textDecoration: "underline",
          }}
        >
          See original credit page here!!
        </a>
      </div>
    </>
  );
};

export default IntroScreen;

