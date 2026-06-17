import { useEffect } from "react";
import "./App.scss";
import Experience from "./Experience/Experience";
import IntroScreen from "./components/IntroScreen/IntroScreen";
import PortfolioOverlay from "./components/PortfolioOverlay/PortfolioOverlay";
import ProjectModal from "./components/ProjectModal/ProjectModal";
import { usePortfolioStore } from "./store/usePortfolioStore";

function App() {
  const setIsMobile = usePortfolioStore((state) => state.setIsMobile);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile]);

  return (
    <>
      <IntroScreen />
      <Experience />
      <PortfolioOverlay />
      <ProjectModal />
    </>
  );
}

export default App;
