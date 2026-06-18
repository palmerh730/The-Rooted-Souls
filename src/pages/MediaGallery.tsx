import { FunctionComponent } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MediaSection from "../components/MediaSection";
import styles from "./MediaGallery.module.css";

const MediaGallery: FunctionComponent = () => {
  return (
    <div className={styles.page}>
      <Nav />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div style={{ padding: '40px 0 0 0' }}></div>
        <MediaSection />
      </main>
      <Footer />
    </div>
  );
};

export default MediaGallery;
