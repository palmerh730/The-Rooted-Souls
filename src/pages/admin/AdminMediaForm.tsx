import { FunctionComponent, useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./AdminMediaForm.module.css";

interface Category {
  id: number;
  name: string;
}

const AdminMediaForm: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"video" | "article" | "image">("video");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [articleUrl, setArticleUrl] = useState("");
  const [source, setSource] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchMediaItem();
    }
  }, [id, token]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (data.length > 0 && !isEdit && !category) {
          setCategory(data[0].id.toString());
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMediaItem = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategory(data.category_id?.toString() || "");
        setType(data.media_type || "video");
        setArticleUrl(data.article_url || "");
        setSource(data.article_source || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleFetchMetadata = async () => {
    if (!articleUrl) return;
    setFetchingMeta(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: articleUrl })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.title && !title) setTitle(data.title);
        if (data.description && !description) setDescription(data.description);
        // Note: setting the actual file from an image URL requires downloading it. 
        // For now, auto-filling title and description is supported.
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingMeta(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (category) formData.append("category_id", category);
      formData.append("media_type", type);
      
      if (type === "video") {
        if (!isEdit && !videoFile) {
          throw new Error("Video file is required for new videos");
        }
        if (videoFile) {
          formData.append("video_file", videoFile);
        }
      } else if (type === "image") {
        if (!isEdit && !imageFile) {
          throw new Error("Image file is required");
        }
        if (imageFile) {
          // Send image as thumbnail so it uploads like other images
          formData.append("thumbnail", imageFile);
        }
      } else {
        formData.append("article_url", articleUrl);
        formData.append("article_source", source);
      }

      if (thumbnailFile && type !== "image") {
        formData.append("thumbnail", thumbnailFile);
      }

      const url = isEdit ? `${import.meta.env.VITE_API_URL || ""}/api/media/${id}` : `${import.meta.env.VITE_API_URL || ""}/api/media";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save media");
      }

      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>
            {isEdit ? "Edit" : "Add"} <span className={styles.gold}>Media</span>
          </h1>
        </div>
        <div className={styles.headerRight}>
          <Link to="/admin/dashboard" className={styles.btnSecondary}>Cancel</Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formCard}>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "video" | "article" | "image")}
                className={styles.input}
                disabled={isEdit}
              >
                <option value="video">Video</option>
                <option value="article">Article / External Link</option>
                <option value="image">Image / Screenshot</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.input}
              >
                <option value="">-- Select Category --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
                rows={4}
              />
            </div>

            {type === "video" ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>Video File (MP4, MOV)</label>
                {!isEdit ? (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className={styles.fileInput}
                    required
                  />
                ) : (
                  <p style={{color: '#c9a84c', fontSize: '14px'}}>Video file cannot be changed after initial upload.</p>
                )}
                <p style={{fontSize: '12px', color: '#888', marginTop: '4px'}}>
                  File will be processed in the background and automatically uploaded to YouTube.
                </p>
              </div>
            ) : type === "image" ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>Image File</label>
                {!isEdit ? (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInput}
                    required
                  />
                ) : (
                  <p style={{color: '#c9a84c', fontSize: '14px'}}>Image file cannot be changed after initial upload.</p>
                )}
              </div>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Article / Media URL (Google Drive, News, etc.)</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="url"
                      value={articleUrl}
                      onChange={(e) => setArticleUrl(e.target.value)}
                      className={styles.input}
                      required={type === "article"}
                    />
                    <button 
                      type="button" 
                      onClick={handleFetchMetadata}
                      disabled={fetchingMeta || !articleUrl}
                      className={styles.btnSecondary}
                      style={{ padding: '0 16px', whiteSpace: 'nowrap' }}
                    >
                      {fetchingMeta ? "Fetching..." : "Auto-fill details"}
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Source / Publication (Optional)</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </>
            )}

            {type !== "image" && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Thumbnail Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className={styles.fileInput}
                />
              </div>
            )}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Starting Upload..." : (isEdit ? "Update Media" : "Upload & Save")}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminMediaForm;
