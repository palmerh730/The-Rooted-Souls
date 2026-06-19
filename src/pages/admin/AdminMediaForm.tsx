import { FunctionComponent, useEffect, useState, FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabase";
import styles from "./AdminMediaForm.module.css";

interface Category {
  id: number;
  name: string;
}

const AdminMediaForm: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id && id !== "new";
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"video" | "direct_video" | "article" | "image">("direct_video");
  const [mediaUrl, setMediaUrl] = useState("");
  const [source, setSource] = useState("");
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [autoThumbnailFile, setAutoThumbnailFile] = useState<File | null>(null);
  const [autoThumbnailUrl, setAutoThumbnailUrl] = useState<string>("");
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingMeta, setFetchingMeta] = useState(false);
  const [error, setError] = useState("");

  // YouTube OAuth token
  const [ytAccessToken, setYtAccessToken] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchMediaItem();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from("categories").select("id, name");
      if (data) {
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
      const { data } = await supabase.from("media_items").select("*").eq("id", id).single();
      if (data) {
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCategory(data.category_id?.toString() || "");
        setType(data.media_type === "video" ? (data.video_url?.includes("supabase.co") ? "direct_video" : "video") : data.media_type || "video");
        setMediaUrl(data.media_type === "video" ? (data.video_url || "") : (data.article_url || ""));
        setSource(data.article_source || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generateVideoThumbnail = (file: File) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.playsInline = true;
    video.muted = true;
    
    video.onloadeddata = () => {
      // Seek to 1.5s or 25% of the duration if shorter
      video.currentTime = Math.min(1.5, video.duration * 0.25);
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const thumbFile = new File([blob], `auto-thumb-${Date.now()}.jpg`, { type: "image/jpeg" });
            setAutoThumbnailFile(thumbFile);
            setAutoThumbnailUrl(URL.createObjectURL(blob));
          }
        }, "image/jpeg", 0.85);
      }
      URL.revokeObjectURL(video.src); // Cleanup
    };

    video.src = URL.createObjectURL(file);
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      generateVideoThumbnail(file);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setThumbnailFile(e.target.files[0]);
  };

  const handleFetchMetadata = async () => {
    if (!mediaUrl) return;
    setFetchingMeta(true);
    try {
      // Use AllOrigins as a free CORS proxy
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(mediaUrl)}`);
      if (res.ok) {
        const data = await res.json();
        const html = data.contents;
        
        // Very basic regex parsing for title and description from HTML
        const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
        if (titleMatch && titleMatch[1] && !title) {
          setTitle(titleMatch[1].trim());
        }
        
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i) 
                       || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["'][^>]*>/i)
                       || html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
                       
        if (descMatch && descMatch[1] && !description) {
          setDescription(descMatch[1].trim());
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingMeta(false);
    }
  };

  const uploadToYouTube = async (token: string): Promise<string> => {
    if (!videoFile) throw new Error("Video file is missing.");
    
    // 1. Initialize resumable upload
    const initRes = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-Upload-Content-Length': videoFile.size.toString(),
        'X-Upload-Content-Type': videoFile.type
      },
      body: JSON.stringify({
        snippet: {
          title,
          description,
          categoryId: "22" // People & Blogs
        },
        status: {
          privacyStatus: "public",
          embeddable: true
        }
      })
    });

    if (!initRes.ok) {
      const err = await initRes.json();
      throw new Error(`YouTube init failed: ${err.error?.message || 'Unknown error'}`);
    }

    const locationUrl = initRes.headers.get('Location');
    if (!locationUrl) {
      throw new Error("YouTube API did not return an upload URL.");
    }

    // 2. Upload the physical file bytes
    const uploadRes = await fetch(locationUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': videoFile.type
      },
      body: videoFile
    });

    if (!uploadRes.ok) {
      throw new Error(`YouTube video upload failed: ${uploadRes.statusText}`);
    }

    const videoData = await uploadRes.json();
    return videoData.id;
  };

  const triggerUploadAndSave = async (ytToken?: string) => {
    try {
      let finalMediaUrl = mediaUrl;
      let finalThumbnailPath = null;

      // --- 1. UPLOAD IMAGE FILE (if type is image) ---
      if (type === "image" && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(`images/${fileName}`, imageFile);
          
        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(uploadData.path);
          
        finalThumbnailPath = publicUrl;
      }

      // --- 2. UPLOAD THUMBNAIL (if custom or auto provided) ---
      const fileToUpload = thumbnailFile || autoThumbnailFile;
      if (fileToUpload && type !== "image") {
        const fileExt = fileToUpload.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(`thumbnails/${fileName}`, fileToUpload);
          
        if (uploadError) throw new Error("Thumbnail upload failed: " + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(uploadData.path);
          
        finalThumbnailPath = publicUrl;
      }

      // --- 3. UPLOAD YOUTUBE VIDEO ---
      if (type === "video" && videoFile && !isEdit) {
        if (!ytToken) throw new Error("YouTube Access Token is missing.");
        const videoId = await uploadToYouTube(ytToken);
        finalMediaUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Auto-fetch YT thumbnail if no custom thumbnail was uploaded
        if (!finalThumbnailPath) {
          finalThumbnailPath = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
      }

      // --- 3b. UPLOAD DIRECT VIDEO ---
      if (type === "direct_video" && videoFile && !isEdit) {
        const fileExt = videoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('media')
          .upload(`videos/${fileName}`, videoFile);
          
        if (uploadError) throw new Error("Video upload failed: " + uploadError.message);
        
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(uploadData.path);
          
        finalMediaUrl = publicUrl;
      }

      // Fallback for auto-fetching YT thumbnail if just editing/pasting a link manually
      if (!finalThumbnailPath && type === "video" && finalMediaUrl.includes("youtu")) {
        const videoIdMatch = finalMediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (videoIdMatch && videoIdMatch[1]) {
          finalThumbnailPath = `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
        }
      }

      // --- 4. SAVE TO DATABASE ---
      const mediaData: any = {
        title,
        description,
        category_id: category ? parseInt(category) : null,
        media_type: type === "direct_video" ? "video" : type,
        published: true
      };

      if (type === "video" || type === "direct_video") {
        mediaData.video_url = finalMediaUrl;
      } else if (type === "article") {
        mediaData.article_url = finalMediaUrl;
        mediaData.article_source = source;
      }

      if (finalThumbnailPath) {
        mediaData.thumbnail_path = finalThumbnailPath;
      }

      if (isEdit) {
        const { error: updateError } = await supabase.from("media_items").update(mediaData).eq("id", id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("media_items").insert([mediaData]);
        if (insertError) throw insertError;
      }

      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred during save.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // If it's a new video upload, we need to trigger Google Identity Services first
    if (type === "video" && videoFile && !isEdit) {
      if (!import.meta.env.VITE_YOUTUBE_CLIENT_ID) {
        setError("VITE_YOUTUBE_CLIENT_ID environment variable is missing.");
        setLoading(false);
        return;
      }

      try {
        // @ts-ignore
        const client = google.accounts.oauth2.initTokenClient({
          client_id: import.meta.env.VITE_YOUTUBE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/youtube.upload',
          callback: (response: any) => {
            if (response.error) {
              setError(`Google Login failed: ${response.error}`);
              setLoading(false);
              return;
            }
            // Once we have the token, proceed with the actual upload and save process
            triggerUploadAndSave(response.access_token);
          },
        });
        client.requestAccessToken();
      } catch (err: any) {
        setError("Failed to initialize Google Login. Ensure 'https://accounts.google.com/gsi/client' is loaded in index.html.");
        setLoading(false);
      }
    } else {
      // For articles, images, or editing existing videos, just run it immediately
      await triggerUploadAndSave();
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
        <div className={styles.headerRight} style={{ display: 'flex', gap: '16px' }}>
          <Link to="/" className={styles.btnSecondary} style={{ borderColor: 'var(--color-darkkhaki-100)', color: 'var(--color-darkkhaki-100)' }}>View Live Site</Link>
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
                onChange={(e) => setType(e.target.value as any)}
                className={styles.input}
                disabled={isEdit}
              >
                {isEdit && type === "video" && (
                  <option value="video">YouTube Video (Legacy)</option>
                )}
                <option value="direct_video">Video</option>
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

            {type === "video" || type === "direct_video" ? (
              <div className={styles.formGroup}>
                <label className={styles.label}>Video File (MP4, MOV)</label>
                {!isEdit ? (
                  <>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className={styles.fileInput}
                      required
                    />
                    <p style={{fontSize: '12px', color: '#888', marginTop: '4px'}}>
                      {type === "video" ? "Video will be uploaded directly to your YouTube channel. A Google Login popup will appear when you click save." : "Video will be uploaded directly to your database. Limit 50MB per file."}
                    </p>
                    {autoThumbnailUrl && !thumbnailFile && (
                      <div style={{ marginTop: '10px' }}>
                        <p style={{ fontSize: '14px', color: 'var(--color-burlywood-400)', marginBottom: '4px' }}>Auto-generated Thumbnail:</p>
                        <img src={autoThumbnailUrl} alt="Preview" style={{ width: '200px', borderRadius: '8px', border: '1px solid var(--color-darkkhaki-500)' }} />
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{color: '#c9a84c', fontSize: '14px'}}>Video file cannot be changed after initial upload.</p>
                )}
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
                  <label className={styles.label}>Article / Media URL</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="url"
                      value={mediaUrl}
                      onChange={(e) => setMediaUrl(e.target.value)}
                      className={styles.input}
                      required={type === "article"}
                    />
                    <button 
                      type="button" 
                      onClick={handleFetchMetadata}
                      disabled={fetchingMeta || !mediaUrl}
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
                <label className={styles.label}>Custom Thumbnail Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className={styles.fileInput}
                />
              </div>
            )}

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? "Processing (Please do not close page)..." : (isEdit ? "Update Media" : "Upload & Save")}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminMediaForm;
