import { FunctionComponent, useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase";
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

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
        
      if (data) setCategories(data);
      if (error) console.error(error);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      if (editingId) {
        await supabase
          .from("categories")
          .update({ name, slug })
          .eq("id", editingId);
      } else {
        await supabase
          .from("categories")
          .insert([{ name, slug }]);
      }
      setName("");
      setEditingId(null);
      fetchCategories();
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
      await supabase.from("categories").delete().eq("id", id);
      fetchCategories();
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
        <div className={styles.headerRight} style={{ display: 'flex', gap: '16px' }}>
          <Link to="/" className={styles.btnSecondary} style={{ borderColor: 'var(--color-darkkhaki-100)', color: 'var(--color-darkkhaki-100)' }}>View Live Site</Link>
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
