import { FunctionComponent, useState, FormEvent } from "react";
import { config } from "../config";
import styles from "./CorporateEnquiries.module.css";

export type CorporateEnquiriesType = {
  className?: string;
};

const CorporateEnquiries: FunctionComponent<CorporateEnquiriesType> = ({
  className = "",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    quantity: "50 - 100 books",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const accessKey = config.web3formsAccessKey;

    // Honeypot spam check
    if (honeypot) {
      console.warn("Spam submission blocked via honeypot.");
      setIsSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    if (!accessKey) {
      console.warn(
        "Web3Forms Access Key is not configured. Please add VITE_WEB3FORMS_ACCESS_KEY to your .env file or config.ts to receive actual emails."
      );
      // Simulate submission for local testing/dev environments
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
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
          subject: `Corporate & Wellness Enquiry from ${formData.company}`,
          name: formData.name,
          email: formData.email,
          company: formData.company,
          quantity: formData.quantity,
          message: formData.message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true);
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
    <section
      className={[styles.section, className].join(" ")}
      data-scroll-to="corporate"
    >
      <div className={styles.container}>
        <div className={styles.infoColumn}>
          <div className={styles.tagline}>Bulk & Partnerships</div>
          <h2 className={styles.title}>
            Wellness & Corporate <span className={styles.highlight}>Enquiries</span>
          </h2>
          <div className={styles.divider} />
          <p className={styles.description}>
            Bring the transformative message of <i>The Rooted Soul</i> to your organization,
            wellness workshop, retreat, or mental health initiative.
          </p>
          <div className={styles.pointsList}>
            <div className={styles.pointItem}>
              <span className={styles.pointCheck}>✓</span>
              <span>Bulk purchase discount packages for teams and wellness spaces.</span>
            </div>
            <div className={styles.pointItem}>
              <span className={styles.pointCheck}>✓</span>
              <span>Custom author speaking engagements, poetry readings, and discussions.</span>
            </div>
            <div className={styles.pointItem}>
              <span className={styles.pointCheck}>✓</span>
              <span>Wellness workshop integration materials based on the book's 5 phases.</span>
            </div>
          </div>
        </div>

        <div className={styles.formColumn}>
          {isSubmitted ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>Enquiry Received</h3>
              <p className={styles.successText}>
                Thank you for reaching out. Alan or a representative will get back to
                you within 24–48 hours to discuss tailored wellness options for your
                organization.
              </p>
              <button
                className={styles.resetButton}
                onClick={() => {
                  setFormData({
                    name: "",
                    company: "",
                    email: "",
                    quantity: "50 - 100 books",
                    message: "",
                  });
                  setIsSubmitted(false);
                  setErrorMsg("");
                  setHoneypot("");
                }}
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={handleSubmit}>
              {/* Honeypot anti-spam field */}
              <input
                type="checkbox"
                name="botcheck"
                style={{ display: "none" }}
                onChange={(e) => setHoneypot(e.target.checked ? "bot" : "")}
              />

              <div className={styles.formGroup}>
                <label htmlFor="corp-name" className={styles.label}>
                  Full Name
                </label>
                <input
                  id="corp-name"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="corp-company" className={styles.label}>
                  Company / Organization
                </label>
                <input
                  id="corp-company"
                  type="text"
                  required
                  className={styles.input}
                  placeholder="e.g. Wellness Co."
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="corp-email" className={styles.label}>
                  Email Address
                </label>
                <input
                  id="corp-email"
                  type="email"
                  required
                  className={styles.input}
                  placeholder="e.g. jane@company.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="corp-quantity" className={styles.label}>
                  Estimated Quantity
                </label>
                <select
                  id="corp-quantity"
                  className={styles.select}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  disabled={isSubmitting}
                >
                  <option value="50 - 100 books">50 - 100 books</option>
                  <option value="100 - 250 books">100 - 250 books</option>
                  <option value="250 - 500 books">250 - 500 books</option>
                  <option value="500+ books">500+ books</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="corp-message" className={styles.label}>
                  Tell us about your wellness event / initiative
                </label>
                <textarea
                  id="corp-message"
                  required
                  rows={4}
                  className={styles.textarea}
                  placeholder="Describe how you plan to share the poetry collection..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default CorporateEnquiries;
