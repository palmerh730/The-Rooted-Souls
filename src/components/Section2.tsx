import { FunctionComponent } from "react";
import FrameComponent from "./FrameComponent";
import styles from "./Section2.module.css";

export type Section2Type = {
  className?: string;
};

const Section2: FunctionComponent<Section2Type> = ({ className = "" }) => {
  return (
    <section
      className={[styles.section, className].join(" ")}
      data-scroll-to="section1"
    >
      <div className={styles.readersContainer}>
        <div className={styles.frameParent}>
          <div className={styles.earlyReadersWrapper}>
            <div className={styles.earlyReaders}>Early Readers</div>
          </div>
          <div className={styles.heading2WhatReadersSayParent}>
            <h2 className={styles.heading2Container}>
              <span className={styles.heading2Container2}>
                <span>{`What Readers `}</span>
                <span className={styles.say}>Say</span>
              </span>
            </h2>
            <div className={styles.horizontalDividerWrapper}>
              <div className={styles.horizontalDivider} />
            </div>
          </div>
        </div>
      </div>
      <section className={styles.readerReview}>
        <div className={styles.backgroundborder}>
          <div className={styles.reviewStars}>
            <div className={styles.div}>★</div>
            <div className={styles.div}>★</div>
            <div className={styles.div}>★</div>
            <div className={styles.div}>★</div>
            <div className={styles.div}>★</div>
          </div>
          <h2 className={styles.emptySpace}>"</h2>
          <FrameComponent
            aRawAndHonestCollectionThat={`A raw and honest collection that left me feeling
understood and hopeful. Alan's words cut
straight to the heart.`}
            s="S"
            sarahM="— Sarah M."
          />
        </div>
        <div className={styles.backgroundborder}>
          <div className={styles.frameGroup}>
            <div className={styles.parent}>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
            </div>
            <h2 className={styles.emptySpace}>"</h2>
          </div>
          <FrameComponent
            aRawAndHonestCollectionThat={`I've never related to a book of poetry this
deeply. Every page felt like it was written just
for me.`}
            aRawAndFontSize="15.3px"
            aRawAndDisplay="flex"
            overlayPadding="6px 11.7px 6px 12.3px"
            s="J"
            sarahM="— James O."
            sarahMFontSize="13.1px"
          />
        </div>
        <div className={styles.backgroundborder3}>
          <div className={styles.frameContainer}>
            <div className={styles.parent}>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
              <div className={styles.div}>★</div>
            </div>
            <div className={styles.container}>
              <h2 className={styles.h2}>"</h2>
              <i className={styles.beautifullyWrittenThe}>
                Beautifully written. The journey from darkness
                <br />
                to light is handled with grace and authenticity.
              </i>
            </div>
          </div>
          <div className={styles.horizontalborder}>
            <div className={styles.overlay}>
              <div className={styles.r}>R</div>
            </div>
            <div className={styles.rachelTWrapper}>
              <div className={styles.rachelT}>— Rachel T.</div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Section2;
