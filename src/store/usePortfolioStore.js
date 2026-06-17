import { create } from "zustand";

const getSectionFromProgress = (progress) => {
  if (progress < 0.25) return "home";
  if (progress < 0.5) return "projects-1";
  if (progress < 0.72) return "experience";
  if (progress < 0.94) return "projects-2";
  return "contact";
};

export const usePortfolioStore = create((set) => ({
  scrollProgress: 0,
  activeSection: "home",
  selectedProject: null,
  selectedExperience: null,
  hoveredItem: null,

  setScrollProgress: (progress) =>
    set((state) => {
      // Normalize progress to be strictly between 0 and 1
      const normalized = Math.max(0, Math.min(1, progress));
      const section = getSectionFromProgress(normalized);
      
      // Only trigger state updates if values actually changed to prevent render loops
      if (
        state.scrollProgress === normalized &&
        state.activeSection === section
      ) {
        return {};
      }
      
      return {
        scrollProgress: normalized,
        activeSection: section,
      };
    }),

  setSelectedProject: (project) => set({ selectedProject: project }),
  setSelectedExperience: (experience) => set({ selectedExperience: experience }),
  setHoveredItem: (item) => set({ hoveredItem: item }),
  
  targetScrollProgress: null,
  setTargetScrollProgress: (progress) => set({ targetScrollProgress: progress }),
  clearTargetScrollProgress: () => set({ targetScrollProgress: null }),
  
  isLoaded: false,
  setIsLoaded: (status) => set({ isLoaded: status }),
  
  pandaRef: null,
  setPandaRef: (ref) => set({ pandaRef: ref }),
}));
