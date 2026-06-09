import { FunctionComponent } from "react";
import Nav from "../components/Nav";
import FrameComponent1 from "../components/FrameComponent1";
import Section from "../components/Section";
import Section1 from "../components/Section1";
import PoemTeaser from "../components/PoemTeaser";
import FrameComponent2 from "../components/FrameComponent2";
import FrameComponent3 from "../components/FrameComponent3";
import Section2 from "../components/Section2";
import CorporateEnquiries from "../components/CorporateEnquiries";
import Section3 from "../components/Section3";
import Section4 from "../components/Section4";
import Footer from "../components/Footer";
import styles from "./WDefault.module.css";

const WDefault: FunctionComponent = () => {
  return (
    <div className={styles.wDefault}>
      <main className={styles.background}>
        <main className={styles.section}>
          <div className={styles.gradient} />
          <Nav />
          <FrameComponent1 />
        </main>
        <Section />
        <Section1 />
        <PoemTeaser />
        <FrameComponent2 />
        <FrameComponent3 />
        <Section2 />
        <CorporateEnquiries />
        <Section3 />
        <Section4 />
        <Footer />
      </main>
    </div>
  );
};

export default WDefault;
