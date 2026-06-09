import { FunctionComponent } from "react";
import styles from "./Section.module.css";

export type SectionType = {
  className?: string;
};

const Section: FunctionComponent<SectionType> = ({ className = "" }) => {
  return (
    <section className={[styles.section, className].join(" ")} data-scroll-to="quoteSection">
      <div className={styles.vehlclesWrapper}>
        <h2 className={styles.vehlcles}>"</h2>
      </div>
      <section className={styles.quoteBlock}>
        <i className={styles.blockquoteWe}>
          We often define ourselves by our struggles—
          <br />
          but forget the strength it took to overcome them.
        </i>
        <div className={styles.quoteBlockInner}>
          <div className={styles.frameParent}>
            <div className={styles.frameWrapper}>
              <div className={styles.authorDetailParent}>
                <div className={styles.authorDetail}>
                  <div className={styles.horizontalDivider} />
                </div>
                <div className={styles.theRootedSoul}>The Rooted Soul</div>
              </div>
            </div>
            <div className={styles.theRootedSoul2}>
              The Rooted Soul is a journey through darkness, reflection, and
              ultimately, growth.
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Section;
