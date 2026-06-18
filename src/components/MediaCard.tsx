import { FunctionComponent } from "react";
import styles from "./MediaCard.module.css";

export interface MediaItem {
  id: number;
  title: string;
  description?: string;
  media_type: "video" | "article" | "image";
  video_url?: string;
  article_url?: string;
  thumbnail_path?: string;
  categories?: { name: string };
  publish_date?: string;
  featured?: boolean;
  published?: boolean;
  platform?: string;
  article_source?: string;
}

export type MediaCardType = {
  className?: string;
  item: MediaItem;
  onVideoClick?: (item: MediaItem) => void;
};

const MediaCard: FunctionComponent<MediaCardType> = ({
  className = "",
  item,
  onVideoClick,
}) => {
  const handleClick = () => {
    if (item.media_type === "video" && onVideoClick) {
      onVideoClick(item);
    } else if (item.media_type === "image" && onVideoClick) {
      onVideoClick(item);
    } else if (item.media_type === "article" && item.article_url) {
      if (item.article_url.includes("drive.google.com") && onVideoClick) {
        onVideoClick(item);
      } else {
        window.open(item.article_url, "_blank", "noopener,noreferrer");
      }
    }
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={[styles.card, className].join(" ")}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className={styles.thumbnailWrapper}>
        {item.thumbnail_path ? (
          <img
            className={styles.thumbnail}
            src={item.thumbnail_path}
            alt={item.title}
            loading="lazy"
          />
        ) : (
          <div className={styles.placeholderThumb}>
            {item.media_type === "video" ? "▶" : item.media_type === "image" ? "🖼️" : "↗"}
          </div>
        )}
        <div className={styles.thumbnailOverlay}>
          {item.media_type === "video" ? (
            <span className={styles.playIcon}>▶</span>
          ) : item.media_type === "image" ? (
            <span className={styles.linkIcon}>🔍</span>
          ) : (
            <span className={styles.linkIcon}>↗</span>
          )}
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <div className={styles.cardMeta}>
          {(Array.isArray(item.categories) ? item.categories[0]?.name : item.categories?.name) && (
            <span className={styles.categoryBadge}>{(Array.isArray(item.categories) ? item.categories[0]?.name : item.categories?.name)}</span>
          )}
          {item.publish_date && (
            <span className={styles.cardDate}>
              {formatDate(item.publish_date)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;
