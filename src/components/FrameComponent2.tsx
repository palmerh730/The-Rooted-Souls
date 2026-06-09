import { FunctionComponent, useCallback } from "react";
import styles from "./FrameComponent2.module.css";

export type FrameComponent2Type = {
  className?: string;
};

const FrameComponent2: FunctionComponent<FrameComponent2Type> = ({
  className = "",
}) => {
  const onGetTheBookClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='section']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  return (
    <section className={[styles.sectionWrapper, className].join(" ")}>
      <div className={styles.section} data-scroll-to="sectionContainer">
        <div className={styles.borderParent}>
          <div className={styles.border} />
          <div className={styles.borderGroup}>
            <div className={styles.border2} />
            <div className={styles.overlayblurParent}>
              <div className={styles.overlayblur} />
              <img
                className={styles.alanMcdonaldAuthorOfTheR}
                loading="lazy"
                alt=""
                src="/Alan-McDonald-author-of-The-Rooted-Soul@2x.png"
              />
            </div>
          </div>
        </div>
        <section className={styles.sectionInner}>
          <div className={styles.frameParent}>
            <div className={styles.theAuthorParent}>
              <div className={styles.theAuthor}>The Author</div>
              <div className={styles.heading2MeetAlanMcdonaldParent}>
                <div className={styles.heading2Container}>
                  <span className={styles.heading2Container2}>
                    <span>
                      Meet Alan
                      <br />
                    </span>
                    <span className={styles.mcdonald}>McDonald</span>
                  </span>
                </div>
                <div className={styles.horizontalDivider} />
                <div className={styles.alanWritesFrom}>
                  Alan writes from lived experience—navigating mental health
                  struggles, loss, and
                  <br />
                  personal growth.
                </div>
              </div>
            </div>
            <div className={styles.hisWorkReflectsTheRealityWrapper}>
              <div className={styles.hisWorkReflects}>
                His work reflects the reality that healing is not linear—but it
                is always possible.
              </div>
            </div>
            <div className={styles.paragraphverticalborderWrapper}>
              <div className={styles.paragraphverticalborder}>
                <i className={styles.theDownslopeOf}>
                  "The downslope of that hill is the most nourishing and
                  fulfilling."
                </i>
                <div className={styles.alanMcdonald}>— Alan McDonald</div>
              </div>
            </div>
            <button className={styles.link} onClick={onGetTheBookClick}>
              <div className={styles.getTheBook}>
                Get the Book
              </div>
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default FrameComponent2;
