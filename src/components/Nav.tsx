import { FunctionComponent, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Nav.module.css";

export type NavType = {
  className?: string;
};

const Nav: FunctionComponent<NavType> = ({ className = "" }) => {
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

  const onLinkTheClick = useCallback(() => navigateToSection("[data-scroll-to='section2']"), [navigateToSection]);
  const onLinkPoemsClick = useCallback(() => navigateToSection("[data-scroll-to='teaserPoems']"), [navigateToSection]);
  const onLinkAboutClick = useCallback(() => navigateToSection("[data-scroll-to='sectionContainer']"), [navigateToSection]);
  const onLinkReviewsClick = useCallback(() => navigateToSection("[data-scroll-to='section1']"), [navigateToSection]);
  const onLinkEnquiriesClick = useCallback(() => navigateToSection("[data-scroll-to='corporate']"), [navigateToSection]);
  const onBuyNowTextClick = useCallback(() => navigateToSection("[data-scroll-to='section']"), [navigateToSection]);


  const onLinkMediaClick = useCallback(() => {
    navigate("/media");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  return (
    <header className={[styles.nav, className].join(" ")}>
      <div 
        className={styles.linkTheRootedSoulWrapper} 
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (window.location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            navigate("/");
          }
        }}
      >
        <div className={styles.linkThe}>The Rooted Soul</div>
      </div>
      <div className={styles.frameParent}>
        <div className={styles.frameWrapper}>
          <nav className={styles.linkTheJourneyParent}>
            <div className={styles.linkThe2} onClick={onLinkTheClick}>
              The Journey
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
          </nav>
        </div>
        <button className={styles.link} onClick={onBuyNowTextClick}>
          <b className={styles.buyNow}>
            Buy Now
          </b>
        </button>
      </div>
    </header>
  );
};

export default Nav;
