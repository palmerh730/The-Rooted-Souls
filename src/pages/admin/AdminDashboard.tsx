import { FunctionComponent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../supabase";
import styles from "./AdminDashboard.module.css";

interface MediaItem {
  id: number;
  title: string;
  media_type: "video" | "article" | "image";
  thumbnail_path?: string;
  published: boolean;
  category_id?: number;
  categories?: { name: string };
  isProcessing?: boolean;
}

const AdminDashboard: FunctionComponent = () => {
  const { logout } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("media_items")
        .select(`
          *,
          categories (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (data) setItems(data);
      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      await supabase
        .from("media_items")
        .update({ published: !currentStatus })
        .eq("id", id);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await supabase.from("media_items").delete().eq("id", id);
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Media Library <span className={styles.gold}>Admin</span></h1>
        </div>
        <div className={styles.headerRight}>
          <Link to="/" className={styles.btnSecondary} style={{ borderColor: 'var(--color-darkkhaki-100)', color: 'var(--color-darkkhaki-100)' }}>View Live Site</Link>
          <Link to="/admin/categories" className={styles.btnSecondary}>Manage Categories</Link>
          <Link to="/admin/media/new" className={styles.btnPrimary}>+ Add New</Link>
          <button onClick={logout} className={styles.btnLogout}>Logout</button>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>Loading library...</div>
          ) : items.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No media items yet. Click "Add New" to get started.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Thumbnail</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className={!item.published ? styles.unpublishedRow : ""}>
                      <td>
                        {item.thumbnail_path ? (
                          <div 
                            className={styles.thumb} 
                            style={{ backgroundImage: `url(${item.thumbnail_path})` }} 
                          />
                        ) : (
                          <div className={styles.thumbPlaceholder}>No Img</div>
                        )}
                      </td>
                      <td className={styles.itemTitle}>{item.title}</td>
                      <td className={styles.itemCategory}>
                        {(Array.isArray(item.categories) ? item.categories[0]?.name : item.categories?.name) || <span className={styles.uncategorized}>Uncategorized</span>}
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles['badge-' + item.media_type]}`}>
                          {item.media_type}
                        </span>
                      </td>
                      <td>
                        {item.isProcessing ? (
                          <span className={`${styles.badge} ${styles.badgeProcessing}`}>
                            Processing
                          </span>
                        ) : (
                          <button
                            onClick={() => handleTogglePublish(item.id, item.published)}
                            className={`${styles.statusToggle} ${item.published ? styles.statusPub : styles.statusUnpub}`}
                          >
                            {item.published ? "Published" : "Hidden"}
                          </button>
                        )}
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {!item.isProcessing ? (
                            <Link to={`/admin/media/${item.id}`} className={styles.actionBtn}>
                              Edit
                            </Link>
                          ) : (
                            <span className={`${styles.actionBtn} ${styles.actionDisabled}`}>Edit</span>
                          )}
                          <button 
                            onClick={() => handleDelete(item.id)} 
                            className={`${styles.actionBtn} ${styles.actionDelete}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
