import React from "react";
import { usePortfolioStore } from "../../store/usePortfolioStore";
import styles from "./ProjectModal.module.scss";

const ProjectModal = () => {
  const { selectedProject, setSelectedProject, selectedExperience, setSelectedExperience } = usePortfolioStore();

  if (!selectedProject && !selectedExperience) return null;

  const handleClose = () => {
    setSelectedProject(null);
    setSelectedExperience(null);
  };

  const isProject = !!selectedProject;
  const data = selectedProject || selectedExperience;

  return (
    <div className={styles.modalOverlay} onClick={handleClose} data-prevent-scroll="true">
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close modal">
          &times;
        </button>

        {isProject ? (
          // Project Details View
          <div className={styles.projectLayout}>
            {data.image && (
              <div className={styles.imageContainer}>
                <img src={data.image} alt={data.title} className={styles.projectImage} />
                <div className={styles.imageOverlay} />
              </div>
            )}
            <div className={styles.detailsContainer}>
              <span className={styles.badge}>{data.tagline}</span>
              <h2 className={styles.title}>{data.title}</h2>
              
              <div className={styles.section}>
                <h3>About the Project</h3>
                <p className={styles.description}>{data.description}</p>
              </div>

              <div className={styles.section}>
                <h3>Key Features</h3>
                <ul className={styles.featuresList}>
                  {data.features.map((feature, idx) => {
                    const [title, desc] = feature.split(": ");
                    return (
                      <li key={idx}>
                        <strong>{title}</strong>
                        {desc ? `: ${desc}` : ""}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {data.impact && (
                <div className={styles.section}>
                  <h3>Impact & Outcome</h3>
                  <p className={styles.impactText}>{data.impact}</p>
                </div>
              )}

              <div className={styles.section}>
                <h3>Tech Stack</h3>
                <div className={styles.techStack}>
                  {data.tech.map((t, idx) => (
                    <span key={idx} className={styles.techBadge}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className={styles.linksContainer}>
                {data.github && (
                  <a href={data.github} target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
                    View on GitHub
                  </a>
                )}
                {data.demo && (
                  <a href={data.demo} target="_blank" rel="noopener noreferrer" className={styles.secondaryButton}>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Experience Details View
          <div className={styles.experienceLayout}>
            <div className={styles.experienceHeader}>
              <span className={styles.dateBadge}>{data.period}</span>
              <h2 className={styles.roleTitle}>{data.role}</h2>
              <h3 className={styles.companyName}>
                {data.company} <span className={styles.location}>&bull; {data.location}</span>
              </h3>
            </div>

            <div className={styles.section}>
              <h3>Overview</h3>
              <p className={styles.expDescription}>{data.description}</p>
            </div>

            <div className={styles.section}>
              <h3>Key Responsibilities & Achievements</h3>
              <ul className={styles.expBullets}>
                {data.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
            
            <div className={styles.footerAccent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
