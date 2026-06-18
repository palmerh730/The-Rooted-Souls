import { FunctionComponent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MediaCard from "./MediaCard";
import VideoModal from "./VideoModal";
import styles from "./MediaTeaser.module.css";
import type { MediaItem } from "./MediaCard";

export type MediaTeaserType = {
  className?: string;
};

const MediaTeaser: FunctionComponent<MediaTeaserType> = ({
  className = "",
}) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/media?featured=true&limit=3");
        if (!res.ok) return;
        const data = await res.json();
        setItems(
          Array.isArray(data) ? data.slice(0, 3) : (data.items || []).slice(0, 3),
        );
      } catch {
        /* graceful degradation — render nothing */
      }
    };
    fetchMedia();
  }, []);



  return (
    <section
      className={[styles.section, className].join(" ")}
      data-scroll-to="mediaLibrary"
    >
      <div className={styles.header}>
        <div className={styles.tagline}>Media</div>
        <h2 className={styles.title}>
          <span>{`See & Hear the `}</span>
          <span className={styles.highlight}>Author</span>
        </h2>
        <div className={styles.divider} />
      </div>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>◇</div>
          <div className={styles.emptyText}>COMING SOON...</div>
        </div>
      ) : (
        <div className={styles.grid}>
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onVideoClick={(v) => setActiveVideo(v)}
            />
          ))}
        </div>
      )}

      <button
        className={styles.viewAll}
        onClick={() => navigate("/media")}
      >
        View All Media →
      </button>

      {activeVideo && activeVideo.video_url && (
        <VideoModal
          videoUrl={activeVideo.video_url}
          title={activeVideo.title}
          description={activeVideo.description}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
};

export default MediaTeaser;
