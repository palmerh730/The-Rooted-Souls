import { FunctionComponent } from "react";
import styles from "./FrameComponent3.module.css";

export type FrameComponent3Type = {
  className?: string;
};

const FrameComponent3: FunctionComponent<FrameComponent3Type> = ({
  className = "",
}) => {
  return (
    <section className={[styles.backgroundborderWrapper, className].join(" ")}>
      <div className={styles.backgroundborder}>
        <div className={styles.forYou}>For You</div>
        <div className={styles.bookMattersHeading}>
          <h2 className={styles.heading2Container}>
            <span className={styles.heading2Container2}>
              <span>{`Why This Book `}</span>
              <span className={styles.matters}>Matters</span>
            </span>
          </h2>
        </div>
        <section className={styles.thisBookIsForYouIfYouveParent}>
          <div className={styles.thisBookIs}>
            This book is for you if you've ever:
          </div>
          <div className={styles.frameParent}>
            <div className={styles.paragraphoverlayborderParent}>
              <div className={styles.paragraphoverlayborder}>
                <div className={styles.wrapper}>
                  <div className={styles.div}>◆</div>
                </div>
                <div className={styles.feltStuckIn}>
                  Felt stuck in your own thoughts
                </div>
              </div>
              <div className={styles.paragraphoverlayborder}>
                <div className={styles.wrapper}>
                  <div className={styles.div}>◆</div>
                </div>
                <div className={styles.struggledWithAnxiety}>
                  Struggled with anxiety or loss
                </div>
              </div>
            </div>
            <div className={styles.paragraphoverlayborderParent}>
              <div className={styles.paragraphoverlayborder}>
                <div className={styles.wrapper}>
                  <div className={styles.div}>◆</div>
                </div>
                <div className={styles.foundItHard}>
                  Found it hard to open up
                </div>
              </div>
              <div className={styles.paragraphoverlayborder}>
                <div className={styles.wrapper}>
                  <div className={styles.div}>◆</div>
                </div>
                <div className={styles.wonderedIfThings}>
                  Wondered if things truly get better
                </div>
              </div>
            </div>
          </div>
          <div className={styles.horizontalborder}>
            <h3 className={styles.thisIsntAboutContainer}>
              <span className={styles.heading2Container2}>
                <span>{`This isn't about perfection, it's about `}</span>
                <span className={styles.progress}>progress.</span>
              </span>
            </h3>
          </div>
        </section>
      </div>
    </section>
  );
};

export default FrameComponent3;
