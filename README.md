# 🐼 Rahmat Yudi Burhanudin - Interactive 3D Paper Portfolio 📝

An immersive, highly interactive 3D personal portfolio website themed as a hand-drawn "paper notebook." Built using **React**, **Three.js**, and **React Three Fiber (R3F)**, this site guides the user through an artistic notebook timeline featuring a 3D Panda riding a bicycle along a custom curve path synchronized with the page scroll.

![Page screenshot](public/media/og-image.webp "Interactive 3D Paper Portfolio")

---

## 🚀 Key Features

* **🚲 Scroll-Synced 3D Path Navigation**: A custom Catmull-Rom curve path guides the camera and the 3D bicycle-riding Panda character as the user scrolls, creating a smooth and interactive visual journey.
* **📝 3D Depth Blending Sticky Notes**: Drei's `<Html occlude="blending">` components are projected directly onto the 3D notebook pages, allowing crisp, HTML/CSS text cards to sit naturally inside the WebGL depth buffer—correctly covered when the Panda rides in front.
* **🎨 Custom SVG Sketch Shaders**: Custom turbulence and displacement SVG filters (`#sketchy` and `#sketchy-subtle`) are applied to DOM components, giving menus and buttons a signature hand-drawn wobbly sketch outline.
* **📐 Adaptive Mobile Layout & Collapsible Cards**: 
  - Main overlay cards feature a collapsible toggle (**➖ / Show Info 📖**) on mobile viewports to clear screen space and reveal the 3D scene.
  - Overlay panels stack neatly at the bottom with adaptive heights and custom touch drag event scroll locks.
  - Navigation links wrap into a swipeable horizontal list to fit smaller screens.
* **✒️ Hand-Drawn Paper UI Design**: Incorporates marker-style handwritten typography (Caveat, Kalam, Shadows Into Light, Patrick Hand) with jagged paper margins, wobbly borders, tape overlays, and hard comic-style drop-shadows.

---

## 🛠️ Tech Stack

* **Core**: React • Vite • JavaScript
* **3D Engine**: Three.js • React Three Fiber (R3F) • `@react-three/drei` (Drei)
* **Animations**: GSAP (GreenSock) for 3D state transitions
* **State Management**: Zustand
* **Styling**: SASS / SCSS (CSS Modules)
* **Hosting**: Vercel

---

## ⚙️ Development & Installation

Follow these steps to run the project locally on your machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/MattYudha/Portofolio--Matt.git

# Enter the project directory
cd Portofolio--Matt

# Install dependencies
npm install
```

### 3. Run Local Server
```bash
# Start development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser to inspect the site.

### 4. Build for Production
```bash
# Build production bundle
npm run build
```
The compiled output will be generated inside the `dist/` directory, ready to deploy.

---

## 🌐 Deployment on Vercel

This project is pre-configured for automatic deployment on Vercel:

1. Connect your GitHub account to **Vercel**.
2. Select **"Import Project"** and point to the **`Portofolio--Matt`** repository.
3. Keep the default settings (Vercel automatically detects the Vite configuration).
4. Click **"Deploy"**!

---

## 💖 Credits & References

* **Aesthetics Concept**: Based on a Codrops 3D Paper Portfolio concept.
* **Intro Screen Font**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans)
* **Handwriting Fonts**: Google Fonts (Caveat, Kalam, Patrick Hand, Shadows Into Light)
* **Assets & Materials**: Crafted using Blender, Krita, and texture loader utilities.
