import { FunctionComponent, useState, useEffect } from "react";
import MediaCard from "./MediaCard";
import VideoModal from "./VideoModal";
import ImageModal from "./ImageModal";
import styles from "../pages/MediaGallery.module.css";
import type { MediaItem } from "./MediaCard";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export type MediaSectionType = {
  className?: string;
};

const MediaSection: FunctionComponent<MediaSectionType> = ({ className = "" }) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeVideo, setActiveVideo] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mediaRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL || ""}/api/media"),
          fetch(`${import.meta.env.VITE_API_URL || ""}/api/categories"),
        ]);
        if (mediaRes.ok) {
          const mediaData = await mediaRes.json();
          setItems(
            Array.isArray(mediaData) ? mediaData : mediaData.items || [],
          );
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(Array.isArray(catData) ? catData : []);
        }
      } catch {
        /* silent failure */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter(
          (item) =>
            item.categories?.name?.toLowerCase() === activeCategory.toLowerCase(),
        );

  return (
    <section className={[styles.content, className].join(" ")} data-scroll-to="mediaLibrary" id="media-section" style={{ borderTop: "var(--border-1)" }}>
      <div className={styles.header}>
        <div className={styles.tagline}>Media</div>
        <h2 className={styles.title} style={{ fontSize: "36px" }}>
          <span>{`See & Hear the `}</span>
          <span className={styles.highlight}>Author</span>
        </h2>
        <div className={styles.divider} />
      </div>

      <div className={styles.tabsContainer}>
        <button
          className={[
            styles.tab,
            activeCategory === "all" ? styles.activeTab : "",
          ].join(" ")}
          onClick={() => setActiveCategory("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={[
              styles.tab,
              activeCategory === cat.name ? styles.activeTab : "",
            ].join(" ")}
            onClick={() => setActiveCategory(cat.name)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loading}>Loading…</div>
      ) : filteredItems.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>◇</div>
          <div className={styles.emptyText}>
            COMING SOON...
          </div>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredItems.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              onVideoClick={(v) => setActiveVideo(v)}
            />
          ))}
        </div>
      )}

      {activeVideo && activeVideo.media_type === "video" && activeVideo.video_url && (
        <VideoModal
          videoUrl={activeVideo.video_url}
          title={activeVideo.title}
          description={activeVideo.description}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {activeVideo && activeVideo.media_type === "image" && activeVideo.thumbnail_path && (
        <ImageModal
          imageUrl={activeVideo.thumbnail_path}
          title={activeVideo.title}
          description={activeVideo.description}
          onClose={() => setActiveVideo(null)}
        />
      )}
    </section>
  );
};

export default MediaSection;
