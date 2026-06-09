import { FunctionComponent, useCallback } from "react";
import styles from "./FrameComponent1.module.css";

export type FrameComponent1Type = {
  className?: string;
};

const FrameComponent1: FunctionComponent<FrameComponent1Type> = ({
  className = "",
}) => {
  const onBuyTheBookClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='section']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onReadASampleClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='teaserPoems']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onScrollClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='quoteSection']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  return (
    <div className={[styles.sectionInner, className].join(" ")}>
      <div className={styles.frameParent}>
        <section className={styles.frameWrapper}>
          <div className={styles.frameGroup}>
            <div className={styles.frameContainer}>
              <div className={styles.horizontalDividerWrapper}>
                <div className={styles.horizontalDivider} />
              </div>
              <div className={styles.aPoetryCollection}>
                A Poetry Collection by Alan McDonald
              </div>
            </div>
            <div className={styles.theParent}>
              <div className={styles.the}>The</div>
              <div className={styles.rooted}>Rooted</div>
              <div className={styles.soul}>Soul</div>
            </div>
            <div className={styles.aJourneyFromStruggleToJoyWrapper}>
              <i className={styles.aJourneyFrom}>
                A Journey From Struggle to Joy
              </i>
            </div>
            <div className={styles.aPowerfulCollectionOfPoetrWrapper}>
              <div className={styles.aPowerfulCollection}>
                A powerful collection of poetry and reflections exploring
                <br />
                mental struggle, healing, and the strength it takes to rise
                again.
              </div>
            </div>
            <div className={styles.callToAction}>
              <button className={styles.link} onClick={onBuyTheBookClick}>
                <b className={styles.buyTheBook}>
                  Buy the Book
                </b>
              </button>
              <button className={styles.link2} onClick={onReadASampleClick}>
                <div className={styles.readASample}>
                  Read a Sample
                </div>
              </button>
            </div>
          </div>
        </section>
        <div className={styles.scrollParent}>
          <div className={styles.imageAssets}>
            <div className={styles.overlayblur} />
            <img
              className={styles.bookCoverMockup1Icon}
              alt="The Rooted Soul Book Cover Mockup"
              src="/Book-Cover-Mockup-1@2x.png"
              onClick={() =>
                window.open(
                  "https://www.amazon.co.uk/dp/B0H2MXD5VR/ref=sr_1_1?crid=17I5EW3SZYOOW&dib=eyJ2IjoiMSJ9.DzoBqVjyPYfwHPpYbexpDA.HLPE5AqxCACmYPTkO73vhW25i3_7KWjOgRMSG5mTJ-o&dib_tag=se&keywords=the+rooted+soul+alan&qid=1779467628&s=books&sprefix=%2Cstripbooks%2C271&sr=1-1",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            />
          </div>
        </div>
      </div>
      <div className={styles.scrollIndicator} onClick={onScrollClick}>
        <span className={styles.scrollText}>Scroll</span>
        <img
          className={styles.scrollIcon}
          loading="lazy"
          alt=""
          src="/SVG.svg"
        />
      </div>
    </div>
  );
};

export default FrameComponent1;
