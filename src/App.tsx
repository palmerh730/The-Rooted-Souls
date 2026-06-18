import { useEffect } from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";
import WDefault from "./pages/WDefault";
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";
import MediaGallery from "./pages/MediaGallery";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMediaForm from "./pages/admin/AdminMediaForm";
import AdminCategories from "./pages/admin/AdminCategories";


function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "The Rooted Soul";
        metaDescription = "";
        break;
      case "/media":
        title = "Media Gallery - The Rooted Soul";
        break;
      case "/admin/login":
      case "/admin/dashboard":
      case "/admin/media":
      case "/admin/categories":
        title = "Admin - The Rooted Soul";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag: HTMLMetaElement | null = document.querySelector(
        'head > meta[name="description"]',
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<WDefault />} />
        <Route path="/media" element={<MediaGallery />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/media"
          element={
            <ProtectedRoute>
              <AdminMediaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/media/:id"
          element={
            <ProtectedRoute>
              <AdminMediaForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
export default App;
