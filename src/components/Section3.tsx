import { FunctionComponent, useCallback } from "react";
import styles from "./Section3.module.css";

export type Section3Type = {
  className?: string;
};

const Section3: FunctionComponent<Section3Type> = ({ className = "" }) => {
  const onReadASampleClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='teaserPoems']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  const onBulkEnquiriesClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='corporate']");
    if (anchor) {
      anchor.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

  return (
    <section
      className={[styles.section, className].join(" ")}
      data-scroll-to="section"
    >
      <div className={styles.backgroundborder}>
        <div className={styles.gradient} />
        <div className={styles.overlayblurParent}>
          <div className={styles.overlayblur} />
          <img
            className={styles.theRootedSoul}
            loading="lazy"
            alt="The Rooted Soul Cover"
            src="/The-Rooted-Soul@2x.png"
            onClick={() =>
              window.open(
                "https://www.amazon.co.uk/dp/B0H2MXD5VR/ref=sr_1_1?crid=17I5EW3SZYOOW&dib=eyJ2IjoiMSJ9.DzoBqVjyPYfwHPpYbexpDA.HLPE5AqxCACmYPTkO73vhW25i3_7KWjOgRMSG5mTJ-o&dib_tag=se&keywords=the+rooted+soul+alan&qid=1779467628&s=books&sprefix=%2Cstripbooks%2C271&sr=1-1",
                "_blank",
                "noopener,noreferrer"
              )
            }
          />
        </div>
        <section className={styles.copyHeaderParent}>
          <div className={styles.copyHeader}>
            <div className={styles.getYourCopy}>Get Your Copy</div>
            <div className={styles.headingBegin}>
              <div className={styles.heading2Container}>
                <span className={styles.heading2Container2}>
                  <span>
                    Begin Your
                    <br />
                  </span>
                  <span className={styles.journeyToday}>Journey Today</span>
                </span>
              </div>
              <div className={styles.theRootedSoul2}>
                The Rooted Soul is available now. A book that will stay with you
                long
                <br />
                after the final page.
              </div>
            </div>
          </div>
          <div className={styles.actionLinks}>
            <button
              className={styles.link}
              onClick={() =>
                window.open(
                  "https://www.amazon.co.uk/dp/B0H2MXD5VR/ref=sr_1_1?crid=17I5EW3SZYOOW&dib=eyJ2IjoiMSJ9.DzoBqVjyPYfwHPpYbexpDA.HLPE5AqxCACmYPTkO73vhW25i3_7KWjOgRMSG5mTJ-o&dib_tag=se&keywords=the+rooted+soul+alan&qid=1779467628&s=books&sprefix=%2Cstripbooks%2C271&sr=1-1",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <b className={styles.orderOnAmazon}>Order on Amazon</b>
            </button>
            <button className={styles.link2} onClick={onReadASampleClick}>
              <div className={styles.readASample}>
                Read a Sample
              </div>
            </button>
            <button className={styles.link2} onClick={onBulkEnquiriesClick}>
              <div className={styles.readASample}>
                Bulk Enquiries
              </div>
            </button>
          </div>
        </section>
      </div>
    </section>
  );
};

export default Section3;
