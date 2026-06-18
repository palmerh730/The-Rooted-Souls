import { FunctionComponent, useEffect, useCallback } from "react";
import styles from "./VideoModal.module.css";

export type ImageModalType = {
  imageUrl: string;
  title: string;
  description?: string;
  onClose: () => void;
};

const ImageModal: FunctionComponent<ImageModalType> = ({
  imageUrl,
  title,
  description,
  onClose,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className={styles.container} style={{ maxWidth: '900px', width: '90vw' }}>
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#000', padding: '20px' }}>
          <img
            src={imageUrl}
            alt={title}
            style={{ maxHeight: '70vh', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className={styles.info}>
          <h3 className={styles.title}>{title}</h3>
          {description && (
            <p className={styles.description}>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
