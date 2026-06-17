import "./App.scss";
import Experience from "./Experience/Experience";
import IntroScreen from "./components/IntroScreen/IntroScreen";
import PortfolioOverlay from "./components/PortfolioOverlay/PortfolioOverlay";
import ProjectModal from "./components/ProjectModal/ProjectModal";

function App() {
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
