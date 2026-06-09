import { FunctionComponent } from "react";
import styles from "./Section1.module.css";

export type Section1Type = {
  className?: string;
};

const Section1: FunctionComponent<Section1Type> = ({ className = "" }) => {
  return (
    <section
      className={[styles.section, className].join(" ")}
      data-scroll-to="section2"
    >
      <div className={styles.titleContainerWrapper}>
        <div className={styles.titleContainer}>
          <div className={styles.theStructureWrapper}>
            <div className={styles.theStructure}>The Structure</div>
          </div>
          <div className={styles.heading2AJourneyInFiveWrapper}>
            <h2 className={styles.heading2Container}>
              <span className={styles.heading2Container2}>
                <span>{`A Journey in `}</span>
                <span className={styles.fivePhases}>Five Phases</span>
              </span>
            </h2>
          </div>
          <div className={styles.structureDivider}>
            <div className={styles.horizontalDivider} />
          </div>
        </div>
      </div>
      <section className={styles.phaseContainers}>
        <div className={styles.backgroundborder}>
          <div className={styles.parent}>
            <h2 className={styles.h2}>◐</h2>
            <div className={styles.iWrapper}>
              <h2 className={styles.i}>I</h2>
            </div>
          </div>
          <div className={styles.infoContainers}>
            <div className={styles.phaseLabelsParent}>
              <div className={styles.phaseLabels}>
                <div className={styles.phaseI}>Phase I</div>
              </div>
              <div className={styles.echoesLabels}>
                <div className={styles.heading3}>The Descent</div>
              </div>
              <div className={styles.whereStruggleTakes}>
                Where struggle takes hold
              </div>
            </div>
          </div>
          <div className={styles.horizontalDivider2} />
        </div>
        <div className={styles.backgroundborder2}>
          <div className={styles.backgroundborderInner}>
            <div className={styles.frameParent}>
              <img
                className={styles.frameChild}
                loading="lazy"
                alt=""
                src="/Group-1.svg"
              />
              <h2 className={styles.ii}>II</h2>
            </div>
          </div>
          <div className={styles.backgroundborderChild}>
            <div className={styles.frameGroup}>
              <div className={styles.phaseIiWrapper}>
                <div className={styles.phaseIi}>Phase II</div>
              </div>
              <div className={styles.heading32}>The Echoes</div>
            </div>
          </div>
          <div className={styles.memoriesGriefAnd}>
            Memories, grief, and
            <br />
            reflection
          </div>
          <div className={styles.horizontalDivider2} />
        </div>
        <div className={styles.backgroundborder3}>
          <div className={styles.group}>
            <h2 className={styles.h22}>◈</h2>
            <div className={styles.iiiWrapper}>
              <h2 className={styles.iii}>III</h2>
            </div>
          </div>
          <div className={styles.outerPhaseContainers}>
            <div className={styles.phaseIii}>Phase III</div>
          </div>
          <div className={styles.turningLabels}>
            <div className={styles.pointLabels}>
              <div className={styles.heading33}>The Turning Point</div>
              <div className={styles.awarenessAndChangeWrapper}>
                <div className={styles.awarenessAndChange}>
                  Awareness and change
                </div>
              </div>
            </div>
          </div>
          <div className={styles.horizontalDivider2} />
        </div>
        <div className={styles.backgroundborder4}>
          <div className={styles.container}>
            <h2 className={styles.h23}>✦</h2>
            <div className={styles.ivWrapper}>
              <h2 className={styles.iv}>IV</h2>
            </div>
          </div>
          <div className={styles.frameDiv}>
            <div className={styles.frameContainer}>
              <div className={styles.phaseIvWrapper}>
                <div className={styles.phaseIv}>Phase IV</div>
              </div>
              <div className={styles.ascentLabel}>
                <div className={styles.heading34}>The Ascent</div>
              </div>
              <div className={styles.growthAndRebuilding}>
                Growth and rebuilding
              </div>
            </div>
          </div>
          <div className={styles.horizontalDivider2} />
        </div>
        <div className={styles.paragraphbackgroundborder}>
          <div className={styles.parent2}>
            <h2 className={styles.h2}>◉</h2>
            <div className={styles.romanFive}>
              <h2 className={styles.v}>V</h2>
            </div>
          </div>
          <div className={styles.phaseVWrapper}>
            <div className={styles.phaseV}>Phase V</div>
          </div>
          <div className={styles.paragraphbackgroundborderInner}>
            <div className={styles.heading3TheAwakeningParent}>
              <div className={styles.heading35}>The Awakening</div>
              <div className={styles.joyPeaceAnd}>Joy, peace, and clarity</div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Section1;
