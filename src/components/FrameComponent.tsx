import { FunctionComponent, useMemo, type CSSProperties } from "react";
import styles from "./FrameComponent.module.css";

export type FrameComponentType = {
  className?: string;
  aRawAndHonestCollectionThat?: string;
  s?: string;
  sarahM?: string;

  /** Style props */
  aRawAndFontSize?: CSSProperties["fontSize"];
  aRawAndDisplay?: CSSProperties["display"];
  overlayPadding?: CSSProperties["padding"];
  sarahMFontSize?: CSSProperties["fontSize"];
};

const FrameComponent: FunctionComponent<FrameComponentType> = ({
  className = "",
  aRawAndHonestCollectionThat,
  aRawAndFontSize,
  aRawAndDisplay,
  overlayPadding,
  s,
  sarahM,
  sarahMFontSize,
}) => {
  const aRawAndStyle: CSSProperties = useMemo(() => {
    return {
      fontSize: aRawAndFontSize,
      display: aRawAndDisplay,
    };
  }, [aRawAndFontSize, aRawAndDisplay]);

  const overlayStyle: CSSProperties = useMemo(() => {
    return {
      padding: overlayPadding,
    };
  }, [overlayPadding]);

  const sarahMStyle: CSSProperties = useMemo(() => {
    return {
      fontSize: sarahMFontSize,
    };
  }, [sarahMFontSize]);

  return (
    <div
      className={[styles.aRawAndHonestCollectionThParent, className].join(" ")}
    >
      <i className={styles.aRawAnd} style={aRawAndStyle}>
        {aRawAndHonestCollectionThat}
      </i>
      <div className={styles.horizontalborder}>
        <div className={styles.overlay} style={overlayStyle}>
          <div className={styles.s}>{s}</div>
        </div>
        <div className={styles.sarahMWrapper}>
          <div className={styles.sarahM} style={sarahMStyle}>
            {sarahM}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameComponent;
