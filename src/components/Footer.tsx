import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Footer.module.css";

export type FooterType = {
  className?: string;
};

const Footer: FunctionComponent<FooterType> = ({ className = "" }) => {
  const navigate = useNavigate();

  const navigateToSection = useCallback((selector: string) => {
    if (window.location.pathname !== '/') {
      navigate("/");
      setTimeout(() => {
        const anchor = document.querySelector(selector);
        if (anchor) anchor.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 100);
    } else {
      const anchor = document.querySelector(selector);
      if (anchor) anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, [navigate]);

  const onLinkJourneyClick = useCallback(() => navigateToSection("[data-scroll-to='section2']"), [navigateToSection]);
  const onLinkPoemsClick = useCallback(() => navigateToSection("[data-scroll-to='teaserPoems']"), [navigateToSection]);
  const onLinkAboutClick = useCallback(() => navigateToSection("[data-scroll-to='sectionContainer']"), [navigateToSection]);
  const onLinkReviewsClick = useCallback(() => navigateToSection("[data-scroll-to='section1']"), [navigateToSection]);
  const onLinkEnquiriesClick = useCallback(() => navigateToSection("[data-scroll-to='corporate']"), [navigateToSection]);
  const onLinkBuyClick = useCallback(() => navigateToSection("[data-scroll-to='section']"), [navigateToSection]);


  const onLinkMediaClick = useCallback(() => {
    navigate("/media");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  return (
    <footer className={[styles.footer, className].join(" ")}>
      <div className={styles.footerContainer}>
        <div className={styles.brandSection}>
          <i 
            className={styles.theRootedSoul}
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (window.location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                navigate("/");
              }
            }}
          >The Rooted Soul</i>
          <div className={styles.aPoetryCollection}>
            A Poetry Collection by Alan McDonald · © 2026
          </div>
        </div>

        <div className={styles.navSection}>
          <div className={styles.journeyAbout}>
            <div className={styles.linkJourney} onClick={onLinkJourneyClick}>
              Journey
            </div>
            <div className={styles.linkPoems} onClick={onLinkPoemsClick}>
              Poems
            </div>
            <div className={styles.linkMedia} onClick={onLinkMediaClick}>
              Media
            </div>
            <div className={styles.linkAbout} onClick={onLinkAboutClick}>
              About
            </div>
            <div className={styles.linkReviews} onClick={onLinkReviewsClick}>
              Reviews
            </div>
            <div className={styles.linkEnquiries} onClick={onLinkEnquiriesClick}>
              Enquiries
            </div>
            <div className={styles.linkBuy} onClick={onLinkBuyClick}>
              Buy
            </div>
          </div>
        </div>

        <div className={styles.socialSection}>
          <a
            href="https://www.instagram.com/alanmcdonaldire/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://www.facebook.com/profile.php?id=61567344617878"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Facebook"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </a>
          <button 
            className={styles.adminButton}
            onClick={() => navigate("/admin/login")}
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
