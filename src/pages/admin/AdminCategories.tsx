import { FunctionComponent, useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./AdminCategories.module.css";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const AdminCategories: FunctionComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchCategories();
  }, [token]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/categories", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const url = editingId ? `${import.meta.env.VITE_API_URL || ""}/api/categories/${editingId}` : `${import.meta.env.VITE_API_URL || ""}/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setName("");
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? This might affect media items using this category.")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Admin <span className={styles.gold}>Categories</span></h1>
        </div>
        <div className={styles.headerRight}>
          <Link to="/admin/dashboard" className={styles.btnSecondary}>Back to Dashboard</Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.content}>
          
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>{editingId ? "Edit Category" : "Add New Category"}</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category Name</label>
                <div className={styles.inputRow}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder="e.g. Interviews"
                    required
                  />
                  <button type="submit" className={styles.submitBtn}>
                    {editingId ? "Update" : "Add"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={handleCancelEdit} className={styles.cancelBtn}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className={styles.listSection}>
            <h2 className={styles.sectionTitle}>Existing Categories</h2>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.id}>
                        <td>{cat.name}</td>
                        <td className={styles.slug}>{cat.slug}</td>
                        <td>
                          <div className={styles.actions}>
                            <button onClick={() => handleEdit(cat)} className={styles.actionBtn}>
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className={`${styles.actionBtn} ${styles.actionDelete}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={3} className={styles.empty}>No categories found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default AdminCategories;
