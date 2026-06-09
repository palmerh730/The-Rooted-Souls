import { FunctionComponent, useState, FormEvent } from "react";
import { config } from "../config";
import styles from "./Section4.module.css";

export type Section4Type = {
  className?: string;
};

const Section4: FunctionComponent<Section4Type> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const accessKey = config.web3formsAccessKey;

    if (!accessKey) {
      console.warn(
        "Web3Forms Access Key is not configured. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file or config.ts to receive actual emails."
      );
      // Simulate success for local testing/dev environments
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubscribed(true);
        setEmail("");
      }, 1000);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "The Rooted Soul Web Portal",
          subject: `New Newsletter Subscription: ${email}`,
          email: email,
          message: `Add ${email} to the mailing list for updates.`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSubscribed(true);
        setEmail("");
      } else {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={[styles.section, className].join(" ")}>
      <div className={styles.sectionInner}>
        <div className={styles.frameParent}>
          <div className={styles.stayConnectedWrapper}>
            <div className={styles.stayConnected}>Stay Connected</div>
          </div>
          <div className={styles.heading2JoinTheJourneyWrapper}>
            <h2 className={styles.heading2Container}>
              <span className={styles.heading2Container2}>
                <span>{`Join the `}</span>
                <span className={styles.journey}>Journey</span>
              </span>
            </h2>
          </div>
          <div className={styles.receiveUpdatesOn}>
            Receive updates on new poems, reflections, and the author's next chapter.
          </div>
        </div>
      </div>
      
      {isSubscribed ? (
        <div className={styles.successMessage}>
          ✓ Thank you for subscribing! Welcome to the journey.
        </div>
      ) : (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <form className={styles.subscribeField} onSubmit={handleSubmit}>
            <div className={styles.input}>
              <input
                className={styles.yourEmailAddress}
                placeholder="Your email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <button className={styles.button} type="submit" disabled={isSubmitting}>
              <b className={styles.subscribe}>
                {isSubmitting ? "Subscribed" : "Subscribe"}
              </b>
            </button>
          </form>
          {errorMsg && <div className={styles.errorMessage}>{errorMsg}</div>}
        </div>
      )}
    </section>
  );
};

export default Section4;
