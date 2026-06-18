import { FunctionComponent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./AdminDashboard.module.css";

interface MediaItem {
  id: number;
  title: string;
  media_type: string;
  published: boolean;
  status: string;
  categories: { name: string } | null;
}

const AdminDashboard: FunctionComponent = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedia();
  }, [token]);

  useEffect(() => {
    const hasProcessing = mediaItems.some(i => i.status === 'processing');
    if (hasProcessing) {
      const interval = setInterval(() => {
        fetchMedia();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [mediaItems, token]);

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/media/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setMediaItems(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/media/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !currentStatus }),
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/media/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Admin <span className={styles.gold}>Dashboard</span></h1>
        </div>
        <div className={styles.headerRight}>
          <Link to="/admin/categories" className={styles.navLink}>Categories</Link>
          <Link to="/admin/media" className={styles.btnPrimary}>+ Add Media</Link>
          <button onClick={handleLogout} className={styles.btnLogout}>Logout</button>
        </div>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Processing</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mediaItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td className={styles.capitalize}>{item.media_type}</td>
                    <td>{item.categories?.name || "Uncategorized"}</td>
                    <td>
                      <span className={item.published ? styles.statusPub : styles.statusDraft}>
                        {item.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td>
                      {item.status === 'processing' ? (
                        <span style={{ color: '#e6a23c', fontSize: '12px', fontWeight: 'bold' }}>⏳ Processing</span>
                      ) : item.status === 'failed' ? (
                        <span style={{ color: '#f56c6c', fontSize: '12px', fontWeight: 'bold' }}>❌ Failed</span>
                      ) : (
                        <span style={{ color: '#67c23a', fontSize: '12px', fontWeight: 'bold' }}>✅ Ready</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleTogglePublish(item.id.toString(), item.published)}
                          className={styles.actionBtn}
                        >
                          {item.published ? "Unpublish" : "Publish"}
                        </button>
                        {item.status === 'processing' ? (
                          <span className={styles.actionBtn} style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                            Edit
                          </span>
                        ) : (
                          <Link to={`/admin/media/${item.id}`} className={styles.actionBtn}>
                            Edit
                          </Link>
                        )}
                        <button
                          onClick={() => handleDelete(item.id.toString())}
                          className={`${styles.actionBtn} ${styles.actionDelete}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {mediaItems.length === 0 && (
                  <tr>
                    <td colSpan={6} className={styles.empty}>No media items found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
