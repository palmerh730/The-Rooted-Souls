import { FunctionComponent, useCallback } from "react";
import styles from "./Nav.module.css";

export type NavType = {
  className?: string;
};

const Nav: FunctionComponent<NavType> = ({ className = "" }) => {
  const onLinkTheClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='section2']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onLinkPoemsClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='teaserPoems']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onLinkAboutClick = useCallback(() => {
    const anchor = document.querySelector(
      "[data-scroll-to='sectionContainer']",
    );
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onLinkReviewsClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='section1']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onLinkEnquiriesClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='corporate']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onBuyNowTextClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='section']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  return (
    <header className={[styles.nav, className].join(" ")}>
      <div className={styles.linkTheRootedSoulWrapper}>
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
