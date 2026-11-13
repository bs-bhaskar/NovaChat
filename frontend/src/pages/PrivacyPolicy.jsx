
import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  const sectionStyle = { marginBottom: "24px" };

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "24px", color: "#333", lineHeight: 1.7 }}>
      <Link to="/user-login">← Back to NovaChat</Link>

      <h1>Privacy Policy</h1>
      <p>Last updated: November 13, 2026</p>

      <p>
        NovaChat ("we", "our", or "the app") respects your privacy.
        This Privacy Policy explains what information may be collected,
        how it is used, and how it is protected when you use NovaChat.
      </p>

      <section style={sectionStyle}>
        <h2>1. Information We Collect</h2>
        <p>Depending on how you use NovaChat, we may collect:</p>
        <ul>
          <li>Email address or phone number used for account verification.</li>
          <li>Account details such as username and profile information.</li>
          <li>Messages, conversations, reactions and status updates you create.</li>
          <li>Images and other media files you choose to upload.</li>
          <li>Basic technical information needed to operate and secure the service.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2>2. How We Use Your Information</h2>
        <p>We use information to:</p>
        <ul>
          <li>Create and verify user accounts.</li>
          <li>Send verification codes and account-related emails.</li>
          <li>Deliver messages and provide chat features.</li>
          <li>Display profiles, statuses and uploaded media.</li>
          <li>Maintain, troubleshoot and improve NovaChat.</li>
          <li>Protect the service against misuse and unauthorized access.</li>
        </ul>
      </section>

      <section style={sectionStyle}>
        <h2>3. Storage and Third-Party Services</h2>
        <p>
          NovaChat uses third-party infrastructure providers to operate the
          service. These may include MongoDB Atlas for database storage,
          Cloudinary for uploaded media, Render for backend hosting and
          Vercel for frontend hosting. Information handled by these providers
          is subject to their respective privacy policies and terms.
        </p>
        <p>
          Verification emails may be sent through Google services.
          We do not sell your personal information.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>4. Messages and Uploaded Content</h2>
        <p>
          Messages, profile details, status updates and media you submit
          are processed to provide NovaChat features. Please do not share
          passwords, financial details or other sensitive information in chats.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>5. Security</h2>
        <p>
          We use reasonable technical and organizational measures to help
          protect information. However, no online service or method of
          electronic storage can be guaranteed to be completely secure.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>6. Data Retention and Deletion</h2>
        <p>
          Information may be retained for as long as needed to provide
          NovaChat, maintain security, resolve disputes or meet applicable
          legal requirements. You may contact us to request account or
          personal data deletion. Some information may remain temporarily
          in backups or where retention is legally required.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>7. Children's Privacy</h2>
        <p>
          NovaChat is not intended for children under 13. We do not
          knowingly collect personal information from children under 13.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy when our service or practices
          change. The updated version will be published on this page.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2>9. Contact Us</h2>
        <p>
          For privacy questions or data deletion requests, contact:
          <br />
          <a href="mailto:shardayogi60@gmail.com">shardayogi60@gmail.com</a>
        </p>
      </section>

      <hr />
      <p>© 2026 NovaChat. All rights reserved.</p>
    </main>
  );
}
