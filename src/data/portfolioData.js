export const profileData = {
  name: "Rahmat Yudi Burhanudin",
  title: "Full-Stack Mobile Developer Swift / Flutter",
  location: "Tangerang, Banten, Indonesia",
  email: "dewarahmat12334@gmail.com",
  phones: ["+6281387683819", "+6281380104340"],
  github: "https://github.com/MattYudha/",
  linkedin: "https://www.linkedin.com/in/rahmat-yudi-burhanudin/",
  about: "I enjoy tackling complex problems end to end, from system design and backend architecture to polished user experiences.\n\nAs a Full-Stack Mobile Developer based in Tangerang, I focus on building production-grade systems rather than just assignments. My expertise spans React, Next.js, Go, Swift, and Flutter.\n\nMy journey ranges from enterprise software at Telkom Indonesia to game development at Toge Productions. I also build impactful platforms like Elysian (AI audit) and Floodzy (disaster monitoring)—simply because I see problems worth solving.",
  education: {
    degree: "Bachelor of Informatics Engineering",
    school: "",
    period: "2022 - Present (8th Semester)",
    gpa: "3.50/4.00",
    details: "DBS Foundation Bootcamp (6 months), AWS Backend Academy (3 months), Microsoft elevAlte Program (6 months). Complemented by 12+ certifications from Dicoding, AWS, and Microsoft covering Advanced Web Development, Cloud & AI Fundamentals, Programming Logic, and Essential Development Tools."
  },
  skills: {
    languages: ["JavaScript", "TypeScript", "Go (Golang)", "Python", "Rust", "Lua", "PHP", "C#"],
    frontend: ["React.js", "Next.js", "Tailwind CSS", "Shadcn/UI", "Framer Motion", "Leaflet", "Three.js", "Recharts", "Radix UI", "Material UI"],
    backend: ["Node.js (Express/NestJS)", "FastAPI", "Go/Chi", "Supabase", "PostgreSQL/PostGIS", "MongoDB", "SQLite", "Redis (Upstash)", "Docker Compose", "Nginx", "GitHub CI/CD"],
    ai_blockchain: ["Gemini (Google AI)", "MiniMax AI", "Qdrant Vector DB", "Solidity/Hardhat", "AWS Bedrock", "Azure AI"],
    game_mobile: ["Roblox Studio", "Unity", "Blender", "Flutter", "Swift"]
  }
};

export const experiencesData = [
  {
    id: "aratech",
    role: "Mobile Developer (Flutter & Swift)",
    company: "PT Aratechnology",
    period: "January – June 2026",
    location: "Tangerang, Banten",
    description: "Developed and maintained scalable cross-platform mobile applications using Flutter and Swift.",
    bullets: [
      "Integrated backend APIs and optimized mobile application performance for seamless user experience.",
      "Collaborated with cross-functional teams (design, backend, QA) in an agile environment to plan sprints, review code, and deliver products on schedule."
    ]
  },
  {
    id: "telkom",
    role: "Software Engineer",
    company: "PT Telekomunikasi Indonesia (Telkom)",
    period: "June – September 2025",
    location: "Tangerang, Banten",
    description: "Involved in the development and maintenance of Telkom's internal enterprise applications using an agile approach.",
    bullets: [
      "Worked within cross-divisional teams to build scalable, secure, and high-performance digital solutions.",
      "Contributed to existing feature improvements, debugging, performance optimization, and API integration.",
      "Developed front-end and back-end modules using React/Next.js and Node.js."
    ]
  },
  {
    id: "emran",
    role: "Full-stack Mobile Developer Swift / Flutter",
    company: "PT Emran Ghanim Asahi",
    period: "March – May 2025",
    location: "Tangerang, Banten",
    description: "Led the end-to-end development of a full-stack company profile website and admin panels.",
    bullets: [
      "Designed and built comprehensive admin and user dashboards from scratch, establishing a robust and scalable database structure.",
      "Developed and integrated an innovative AI-powered chatbot with image recognition capabilities to enhance user interaction and streamline information retrieval.",
      "Led development using React, TypeScript, and Supabase for a fully responsive user interface."
    ]
  },
  {
    id: "toge",
    role: "Script & VFX Specialist Intern",
    company: "Toge Productions",
    period: "January – March 2025",
    location: "Tangerang, Banten",
    description: "Gained practical experience in a game production environment focusing on scripting and VFX workflows.",
    bullets: [
      "Contributed to scripting and visual effects design for various production projects, enhancing visual storytelling and immersive gameplay.",
      "Actively engaged in problem-solving related to script implementation and VFX asset management.",
      "Gained valuable insights into workflow integration, performance optimization, and asset pipelines."
    ]
  }
];

export const projectsData = [
  {
    id: "elysian",
    title: "Elysian – Autonomous Multi-Agent Swarm Intelligence",
    tagline: "Government Financial Audit Infrastructure",
    description: "Elysian Rebirth is an advanced autonomous financial audit infrastructure utilizing Multi-Agent Swarm Intelligence. Designed to detect and prevent budget markups in regional governments, it orchestrates a distributed ecosystem—integrating a Go/Next.js orchestrator, a Python-based cognitive swarm, a Rust RAG parser, and an immutable Ethereum blockchain trust layer.",
    tech: ["Next.js 14", "Go (Gin)", "Python (FastAPI)", "Rust", "Solidity (Hardhat)", "Qdrant Vector DB", "Redis", "PostgreSQL", "MongoDB"],
    features: [
      "Multi-Agent Swarm Intelligence: Autonomous debate between Auditor, Compliance, and Manager agents to reach consensus on financial reviews.",
      "Immutable Blockchain Audit Trail: Hashing swarm decisions and audit logs onto a Public EVM Testnet for 100% data provenance.",
      "Advanced Hybrid RAG Pipeline: High-performance semantic parsing of complex government regulation PDFs using Rust and Qdrant.",
      "Live Event Streaming: Real-time visualization of agent debates and processing steps via Server-Sent Events (SSE)."
    ],
    impact: "Revolutionized regional government procurement audits by replacing manual verification with an autonomous AI swarm, significantly accelerating review times and ensuring a transparent, tamper-proof audit trail.",
    github: "https://github.com/MattYudha/Frontend-Elysian-Rebirth",
    demo: "https://elissyan.vercel.app/",
    image: "/media/elysian_project.png"
  },
  {
    id: "floodzy",
    title: "Floodzy – Real-Time Flood & Weather Monitoring",
    tagline: "Disaster Monitoring & AI Analytics for Indonesia",
    description: "Real-time flood and weather monitoring platform for Indonesia, integrating multi-source data (BMKG, OpenWeatherMap, PetaBencana) with AI-powered analytics. Built not because of an assignment, but to address a critical real-world problem.",
    tech: ["Next.js (App Router)", "TypeScript", "Supabase", "Upstash Redis", "Leaflet Maps", "Gemini AI", "Vercel", "Sentry"],
    features: [
      "Real-time Dashboard: District-level interactive maps and weather monitoring.",
      "AI-Powered Analysis: Automated disaster alerts and news summarization via Gemini.",
      "Community Reports: User flood reporting flow, Evacuation Info, and Q&A Chatbot.",
      "Reliability: Upstash Redis caching (TTL 60s), rate-limiting (60 rpm/IP), and Sentry error monitoring."
    ],
    impact: "Provides a socially impactful digital solution that helps communities and stakeholders make quick, informed decisions during disaster events.",
    github: "https://github.com/MattYudha/Floodzy",
    demo: "https://floodzy.id/",
    image: "/media/floodzy_project.png"
  },
  {
    id: "greenpace",
    title: "Greenpace – Precision Agritech Digital Twin",
    tagline: "B2B Palm Oil Supply Chain Traceability",
    description: "Greenpace (SAWIT SHIELD) is a next-generation Agritech platform serving as a precision digital twin for Indonesia's agricultural lands, resolving inefficiencies in the palm oil supply chain.",
    tech: ["Next.js 14", "Go (Chi Router)", "PostgreSQL/PostGIS", "Leaflet", "GeoJSON", "Three.js", "Swarm AI"],
    features: [
      "Interactive Spatial Mapping: Real-time rendering of estate polygons, crop maturity phases, and tree telemetry using GeoJSON.",
      "B2B Marketplace & Escrow Locks: Secure wallet-driven ordering enabling large off-takers to lock harvest pools and execute B2B transactions.",
      "Cognitive Swarm AI Console: Specialized agents forecasting yields via NDVI satellite data, detecting pest outbreaks, and optimizing delivery logistics.",
      "Geofenced Verification: Strict GPS tracking requiring field officers to be physically inside polygon boundaries before submitting updates."
    ],
    impact: "Replaced slow manual field surveys with precise digital twins, accelerating raw material aggregation, verifying crop maturity, and ensuring compliant, transparent B2B transactions.",
    github: "https://github.com/MattYudha/SAWIT.git",
    demo: "https://sawitmenyawit.vercel.app/",
    image: "/media/greenpace_project.png"
  },
  {
    id: "banyumas",
    title: "Banyumas UMKM Explorer",
    tagline: "MSME Directory & Tiered Verification Workflow",
    description: "A centralized digital directory and administrative hub for Micro, Small, and Medium Enterprises (MSMEs) in Purbalingga/Banyumas, featuring spatial mapping across 18 sub-districts.",
    tech: ["Next.js (App Router)", "React 19", "TypeScript", "Supabase (Auth & PG)", "Upstash Redis", "Leaflet Maps", "Cloudinary"],
    features: [
      "Role-Based Access Control (RBAC): Custom consoles for 5 roles (Super Admin, Dinas Admin, Kecamatan Operator, UMKM Owner, Public) with strict Row Level Security (RLS).",
      "Tiered Verification Workflow: Secure dashboard for business owners to submit profiles and government officials to approve/reject listings.",
      "Interactive Maps: Spatial clustering and search of local enterprises.",
      "Media Optimization: Cloudinary integration for fast storefront media delivery."
    ],
    impact: "Centralized local business data, boosting MSME visibility, and streamlining government administrative monitoring.",
    github: "https://github.com/MattYudha/Purbalingga-UMKM-.git",
    demo: "https://kemutuglor.vercel.app/",
    image: "/media/banyumas_project.png"
  },
  {
    id: "kicau_finder",
    title: "Kicau Finder – Bird Sound Detection Platform",
    tagline: "Machine Learning Audio Classification Capstone",
    description: "A full-stack bird sound identification platform developed as a group capstone project during the DBS Foundation Coding Camp at Dicoding, featuring automated audio machine learning inference.",
    tech: ["React (Vite)", "NestJS", "Prisma ORM", "PostgreSQL", "Python", "Keras/TensorFlow (H5 Model)", "Docker Compose", "Nginx"],
    features: [
      "ML Inference: Python inference service utilizing specialized neural networks for bird audio classification.",
      "Containerization: Multi-service setup using Docker Compose (Frontend, API, ML Service, PG, pgAdmin) with health checks.",
      "Database Lifecycle: Structured schema migrations, database seeding, and Prisma Studio integration."
    ],
    impact: "Provides a clean, containerized pipeline for uploading audio files, running model inference, and displaying structured historic records in a user-friendly UI.",
    github: "https://github.com/DBS-Capstone/KicauFinder",
    demo: "https://kicau-finder.stegripe.org/history",
    image: "/media/kicau_finder_project.png"
  },
  {
    id: "emran_profile",
    title: "PT Emran Ghanim Asahi Company Profile",
    tagline: "Freelance Industrial Profile with AI Chatbot",
    description: "An end-to-end full-stack business platform for PT Emran Ghanim Asahi (printing solutions) built as an independent developer.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Gemini AI", "Deno Edge Functions", "PWA"],
    features: [
      "Product & Service Catalog: Modern, responsive catalog showing custom printing products.",
      "AI Chatbot: Gemini-powered client assistance chatbot with image recognition and feedback loops.",
      "Dashboards: Custom admin and user dashboard workflows for request-for-quotes (RFQ) and user notifications."
    ],
    impact: "Greatly improved the company's digital branding and streamlined internal quotation workflows by automated customer engagement.",
    github: "https://github.com/MattYudha/emran-9.git",
    demo: "https://emranghanimasahi.com",
    image: "/media/banyumas_project.png" // Fallback project image
  }
];

export const pandaDialogue = [
  { threshold: 0, text: "Welcome to my portfolio! Swipe or scroll to explore!" },
  { threshold: 0.136, text: "Check out my featured products here!" },
  { threshold: 0.306, text: "Let's review my industry experience!" },
  { threshold: 0.501, text: "Here are some of my key technical projects!" },
  { threshold: 0.603, text: "Need a system architect? Let's get in touch!" },
  { threshold: 0.705, text: "Thanks for dropping by!" }
];
