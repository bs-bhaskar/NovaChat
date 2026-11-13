
import React from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  const sectionStyle = { marginBottom: "24px" };

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "24px", color: "#333", lineHeight: 1.7 }}>
      <Link to="/user-login">← Back to NovaChat</Link>

      <h1>Terms of Service</h1>
      <p>Last updated: November 13, 2026</p>

      <p>
        Welcome to NovaChat. By accessing or using NovaChat, you agree
        to these Terms of Service. If you do not agree, please do not
        use the service.
      </p>

      <section style={sectionStyle}>
        <h2>1. About NovaChat</h2>
        <p>
          NovaChat is a messaging application that provides features such
          as account verification, one-to-one messaging, profiles, status
          updates, reactions and media sharing.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>2. Eligibility and Accounts</h2>
        <ul>
          <li>You must provide accurate information when creating an account.</li>
          <li>You are responsible for keeping your account credentials and verification codes secure.</li>
          <li>You are responsible for activity carried out through your account.</li>
          <li>Do not impersonate another person or create accounts for unlawful purposes.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2>3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use NovaChat for unlawful, fraudulent or harmful activities.</li>
          <li>Harass, threaten or abuse other users.</li>
          <li>Send spam, malicious links or harmful files.</li>
          <li>Attempt to access another user's account or private information without permission.</li>
          <li>Interfere with the security or operation of the service.</li>
          <li>Upload content that violates another person's rights or applicable laws.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2>4. User Content</h2>
        <p>
          You retain responsibility for the messages, images, profile
          information and other content you submit. You must have the
          necessary rights and permissions to share that content.
        </p>
        <p>
          You grant NovaChat permission to process and store your content
          only as reasonably necessary to operate and provide the service.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>5. Availability</h2>
        <p>
          We aim to keep NovaChat available, but we do not guarantee
          uninterrupted access. The service may be temporarily unavailable
          due to maintenance, technical issues or third-party service outages.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>6. Account Suspension or Termination</h2>
        <p>
          We may restrict or suspend access if an account is used in
          violation of these Terms, creates security risks or harms
          other users or the service.
        </p>
        <p>
          You may stop using NovaChat and contact us to request account
          deletion.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>7. Third-Party Services</h2>
        <p>
          NovaChat depends on third-party services for hosting, database
          storage, media storage and email delivery. Their availability
          and use are subject to their own terms and policies.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>8. Disclaimer</h2>
        <p>
          NovaChat is provided on an "as is" and "as available" basis,
          to the extent permitted by applicable law. We do not guarantee
          that the service will always be error-free, secure or uninterrupted.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>9. Changes to These Terms</h2>
        <p>
          We may update these Terms when necessary. Continued use of
          NovaChat after updated Terms are published means you accept
          the updated Terms, to the extent permitted by applicable law.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>10. Contact</h2>
        <p>
          For questions about these Terms, contact:
          <br />
          <a href="mailto:shardayogi60@gmail.com">shardayogi60@gmail.com</a>
        </p>
      </section>

      <hr />
      <p>© 2026 NovaChat. All rights reserved.</p>
    </main>
  );
}
