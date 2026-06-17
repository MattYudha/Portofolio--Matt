import React, { useState, useEffect } from "react";
import { usePortfolioStore } from "../../store/usePortfolioStore";
import { profileData, experiencesData, projectsData } from "../../data/portfolioData";
import styles from "./PortfolioOverlay.module.scss";

const GlassCard = ({ children, isCardMinimized, setIsCardMinimized }) => {
  return (
    <div className={`${styles.glassCard} ${isCardMinimized ? styles.minimizedCard : ""}`}>
      {isCardMinimized ? (
        <div className={styles.minimizedContent} onClick={() => setIsCardMinimized(false)}>
          <span className={styles.minimizedText}>Show Info 📖</span>
        </div>
      ) : (
        <>
          <button
            className={styles.minimizeBtn}
            onClick={() => setIsCardMinimized(true)}
            title="Minimize Info"
          >
            ➖
          </button>
          {children}
        </>
      )}
    </div>
  );
};

const PortfolioOverlay = () => {
  const { activeSection, scrollProgress, setSelectedProject, setSelectedExperience, isLoaded } = usePortfolioStore();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isCardMinimized, setIsCardMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [mobileConfirmations, setMobileConfirmations] = useState({
    home: null,
    "projects-1": null,
    experience: null,
    "projects-2": null,
    contact: null
  });

  const sectionPrompts = {
    home: "Ingin melihat info profil Rahmat?",
    "projects-1": "Ingin melihat daftar produk?",
    experience: "Ingin melihat riwayat pengalaman kerja?",
    "projects-2": "Ingin melihat detail proyek teknologi?",
    contact: "Ingin menghubungi Rahmat?"
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const hasSeenHint = localStorage.getItem("hasSeenSwipeHint");
    if (window.innerWidth <= 768 && !hasSeenHint) {
      setTimeout(() => setShowSwipeHint(true), 3000);
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!showSwipeHint) return;
    const dismissHint = () => {
      setShowSwipeHint(false);
      localStorage.setItem("hasSeenSwipeHint", "true");
    };
    window.addEventListener("touchmove", dismissHint, { once: true });
    return () => window.removeEventListener("touchmove", dismissHint);
  }, [showSwipeHint]);

  useEffect(() => {
    setIsCardMinimized(false);
    // Reset confirmation state when section changes so user is prompted on arrival
    setMobileConfirmations((prev) => ({
      ...prev,
      [activeSection]: null
    }));
  }, [activeSection]);

  const isPromptReady = activeSection !== "home" || scrollProgress >= 0.04;
  const shouldShowCard = !isMobile || mobileConfirmations[activeSection] === true;

  if (!isLoaded) return null;

  const jumpToSection = (progress) => {
    setIsCardMinimized(false);
    window.dispatchEvent(new CustomEvent("portfolio-jump", { detail: progress }));
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  // Nav menu configuration
  const navItems = [
    { label: "Profile", section: "home", target: 0.0 },
    { label: "Products", section: "projects-1", target: 0.35 },
    { label: "Experience", section: "experience", target: 0.60 },
    { label: "Key Tech", section: "projects-2", target: 0.80 },
    { label: "Contact", section: "contact", target: 0.98 },
  ];

  const currentActiveIndex = navItems.findIndex(item => item.section === activeSection);

  const goToNextSection = () => {
    const nextIndex = (currentActiveIndex + 1) % navItems.length;
    jumpToSection(navItems[nextIndex].target);
  };

  const goToPrevSection = () => {
    const prevIndex = (currentActiveIndex - 1 + navItems.length) % navItems.length;
    jumpToSection(navItems[prevIndex].target);
  };

  return (
    <div className={styles.overlayContainer} data-prevent-scroll="true">
      {/* Floating Header */}
      <header className={styles.header}>
        <div className={styles.logoContainer} onClick={() => jumpToSection(0)}>
          <span className={styles.logoPanda}>🐼</span>
          <div>
            <h1 className={styles.logoName}>{profileData.name}</h1>
            <p className={styles.logoTitle}>{profileData.title}</p>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`${styles.navItem} ${activeSection === item.section ? styles.navActive : ""}`}
              onClick={() => jumpToSection(item.target)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.socials}>
          <a href={profileData.github} target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          </a>
          <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
          </a>
          <a href={`mailto:${profileData.email}`} title="Email">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z" /></svg>
          </a>
        </div>
      </header>

      {/* Mobile Side Arrows */}
      {isMobile && (
        <>
          <button
            className={`${styles.slideArrow} ${styles.slideArrowLeft}`}
            onClick={goToPrevSection}
            title="Previous Section"
            data-prevent-scroll="true"
          >
            ◀
          </button>
          <button
            className={`${styles.slideArrow} ${styles.slideArrowRight}`}
            onClick={goToNextSection}
            title="Next Section"
            data-prevent-scroll="true"
          >
            ▶
          </button>
        </>
      )}

      {/* Main Dynamic Panel Overlays */}
      <main className={styles.mainContent}>
        {/* PROFILE SECTION (LEFT PANEL) */}
        {activeSection === "home" && shouldShowCard && (
          <section className={`${styles.panel} ${styles.panelLeft} ${styles.fadeIn} ${scrollProgress >= 0.10 ? styles.cardHidden : ""} ${scrollProgress < 0.04 ? styles.mobileStartHidden : ""}`}>
            <GlassCard isCardMinimized={isCardMinimized} setIsCardMinimized={setIsCardMinimized}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>Full-stack Mobile Developer Swift / Flutter</span>
                <h2>About Matt</h2>
              </div>
              <p className={styles.bioText}>{profileData.about}</p>

              <div className={styles.cardDivider} />

              <div className={styles.educationGroup}>
                <h4>Education</h4>
                <div className={styles.eduDetails}>
                  <strong>{profileData.education.degree}</strong>
                  <span>{profileData.education.school ? `${profileData.education.school} • ` : ""}{profileData.education.period}</span>
                  <span className={styles.gpa}>GPA: {profileData.education.gpa}</span>
                </div>
              </div>

              <div className={styles.skillsGroup}>
                <h4>Technical Arsenal</h4>
                <div className={styles.skillsTags}>
                  {profileData.skills.languages.slice(0, 5).map((lang) => (
                    <span key={lang} className={styles.langTag}>{lang}</span>
                  ))}
                  {profileData.skills.frontend.slice(0, 3).map((tech) => (
                    <span key={tech} className={styles.feTag}>{tech}</span>
                  ))}
                  {profileData.skills.backend.slice(0, 3).map((tech) => (
                    <span key={tech} className={styles.beTag}>{tech}</span>
                  ))}
                </div>
              </div>
            </GlassCard>
          </section>
        )}

        {/* PRODUCTS SECTION 1 (RIGHT PANEL) */}
        {activeSection === "projects-1" && shouldShowCard && (
          <section className={`${styles.panel} ${styles.panelRight} ${styles.fadeIn}`}>
            <GlassCard isCardMinimized={isCardMinimized} setIsCardMinimized={setIsCardMinimized}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>Web & ML Applications</span>
                <h2>Featured Products</h2>
                <p className={styles.instructionText}>Hover & click 3D signs/items or select below for details:</p>
              </div>

              <div className={styles.projectList}>
                {projectsData.filter(p => p.id === "kicau_finder" || p.id === "emran_profile").map((project) => (
                  <div
                    key={project.id}
                    className={styles.projectItemCard}
                    onClick={() => setSelectedProject(project)}
                  >
                    <h4>{project.title}</h4>
                    <p>{project.tagline}</p>
                    <div className={styles.projectCardFooter}>
                      <div className={styles.miniTags}>
                        {project.tech.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                      </div>
                      <span className={styles.arrowBtn}>Explore →</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        )}

        {/* EXPERIENCE SECTION (LEFT PANEL) */}
        {activeSection === "experience" && shouldShowCard && (
          <section className={`${styles.panel} ${styles.panelLeft} ${styles.fadeIn}`}>
            <GlassCard isCardMinimized={isCardMinimized} setIsCardMinimized={setIsCardMinimized}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>Industry Journey</span>
                <h2>Work Experience</h2>
                <p className={styles.instructionText}>Hover & click characters or select below:</p>
              </div>

              <div className={styles.timeline}>
                {experiencesData.map((exp) => (
                  <div
                    key={exp.id}
                    className={styles.timelineItem}
                    onClick={() => setSelectedExperience(exp)}
                  >
                    <div className={styles.timelineBullet} />
                    <div className={styles.timelineContent}>
                      <span className={styles.timelineDate}>{exp.period}</span>
                      <h4>{exp.role}</h4>
                      <h5>{exp.company}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        )}

        {/* PRODUCTS SECTION 2 (RIGHT PANEL) */}
        {activeSection === "projects-2" && shouldShowCard && (
          <section className={`${styles.panel} ${styles.panelRight} ${styles.fadeIn}`}>
            <GlassCard isCardMinimized={isCardMinimized} setIsCardMinimized={setIsCardMinimized}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>Autonomous & Spatial</span>
                <h2>Key Tech Projects</h2>
                <p className={styles.instructionText}>Hover & click 3D papers or select below for details:</p>
              </div>

              <div className={styles.projectList}>
                {projectsData.filter(p => p.id === "elysian" || p.id === "floodzy" || p.id === "greenpace" || p.id === "banyumas").map((project) => (
                  <div
                    key={project.id}
                    className={styles.projectItemCard}
                    onClick={() => setSelectedProject(project)}
                  >
                    <h4>{project.title}</h4>
                    <p>{project.tagline}</p>
                    <div className={styles.projectCardFooter}>
                      <div className={styles.miniTags}>
                        {project.tech.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
                      </div>
                      <span className={styles.arrowBtn}>Explore →</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </section>
        )}

        {/* CONTACT SECTION (LEFT PANEL) */}
        {activeSection === "contact" && shouldShowCard && (
          <section className={`${styles.panel} ${styles.panelLeft} ${styles.fadeIn}`}>
            <GlassCard isCardMinimized={isCardMinimized} setIsCardMinimized={setIsCardMinimized}>
              <div className={styles.cardHeader}>
                <span className={styles.badge}>Get in Touch</span>
                <h2>Contact Rahmat</h2>
              </div>

              <div className={styles.contactDetails}>
                <p>Feel free to reach out for project proposals, system design, or engineering roles.</p>
                <div className={styles.contactItem}>
                  <strong>Emails:</strong>
                  <a href={`mailto:${profileData.email}`}>{profileData.email}</a>
                </div>
                <div className={styles.contactItem}>
                  <strong>WhatsApp/WA:</strong>
                  <span>{profileData.phones.join(" / ")}</span>
                </div>
              </div>

              <div className={styles.cardDivider} />

              <form onSubmit={handleFormSubmit} className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                    placeholder="How can I help you?"
                  />
                </div>
                <button type="submit" className={styles.submitBtn}>
                  {formSubmitted ? "Message Sent! ✓" : "Send Message"}
                </button>
              </form>
            </GlassCard>
          </section>
        )}
      </main>

      {/* Mobile Scroll Confirmation Prompt */}
      {isMobile && mobileConfirmations[activeSection] === null && isPromptReady && sectionPrompts[activeSection] && (
        <div className={`${styles.mobilePromptContainer} ${styles.fadeIn}`}>
          <p className={styles.mobilePromptText}>{sectionPrompts[activeSection]}</p>
          <div className={styles.mobilePromptActions}>
            <button
              className={styles.promptBtnYes}
              onClick={() => setMobileConfirmations(prev => ({ ...prev, [activeSection]: true }))}
            >
              Ya
            </button>
            <button
              className={styles.promptBtnNo}
              onClick={() => setMobileConfirmations(prev => ({ ...prev, [activeSection]: false }))}
            >
              Tidak
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigator / Scroll Guide */}
      {showSwipeHint && (
        <div className={styles.swipeHintOverlay}>
          <span className={styles.handIcon}>👆</span>
          <p className={styles.swipeText}>Swipe up to journey!</p>
        </div>
      )}

      <footer className={styles.footer}>
        {isMobile ? (
          <div className={styles.mobileBottomNav} data-prevent-scroll="true">
            <div className={styles.paginationDots}>
              {navItems.map((item, index) => (
                <button
                  key={item.section}
                  className={`${styles.dot} ${activeSection === item.section ? styles.dotActive : ""}`}
                  onClick={() => jumpToSection(item.target)}
                  title={`Go to ${item.label}`}
                />
              ))}
            </div>
            <div className={styles.scrollIndicator}>
              <span>👈 Swipe or Tap Arrows to Slide 👉 ({currentActiveIndex + 1}/5)</span>
            </div>
          </div>
        ) : (
          <div className={styles.scrollIndicator}>
            <div className={styles.mouseWheel}>
              <div className={styles.wheelDot} />
            </div>
            <span>Scroll / Drag to Journey ({Math.round(scrollProgress * 100)}%)</span>
          </div>
        )}
      </footer>
    </div>
  );
};

export default PortfolioOverlay;
