import { FunctionComponent, useEffect, useCallback } from "react";
import styles from "./VideoModal.module.css";

export type VideoModalType = {
  videoUrl: string;
  title: string;
  description?: string;
  onClose: () => void;
};

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  const driveMatch1 = url.match(/(?:drive\.google\.com\/file\/d\/)([a-zA-Z0-9_-]+)/);
  if (driveMatch1) return `drive:${driveMatch1[1]}`;

  const driveMatch2 = url.match(/(?:drive\.google\.com\/.*[?&]id=)([a-zA-Z0-9_-]+)/);
  if (driveMatch2) return `drive:${driveMatch2[1]}`;

  return null;
}

const VideoModal: FunctionComponent<VideoModalType> = ({
  videoUrl,
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

  const videoId = extractYouTubeId(videoUrl);
  let embedUrl = videoUrl;
  if (videoId) {
    if (videoId.startsWith("drive:")) {
      embedUrl = `https://drive.google.com/file/d/${videoId.split(":")[1]}/preview`;
    } else {
      embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
    }
  }

  const isNativeVideo = videoUrl.includes(".supabase.co") || videoUrl.endsWith(".mp4") || videoUrl.endsWith(".mov");

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
      <div className={styles.container}>
        {isNativeVideo ? (
          <video
            className={styles.nativeVideo}
            src={videoUrl}
            controls
            autoPlay
            playsInline
          />
        ) : (
          <div className={styles.videoWrapper}>
            <iframe
              className={styles.iframe}
              src={embedUrl}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
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

export default VideoModal;
