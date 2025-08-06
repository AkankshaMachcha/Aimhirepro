// src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import '../../assets/css/PrivacyPolicyPage.css';

const PrivacyPage = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1 className="mb-4 text-primary fw-bold">Privacy Policy</h1>

        <div className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            AimHirePro is committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, and safeguard your information when you use our platform.
          </p>
        </div>

        <div className="privacy-section">
          <h2>2. Information We Collect</h2>
          <ul>
            <li>Personal Information: name, email, phone number, and location.</li>
            <li>Account Data: login credentials, resume data, profile image.</li>
            <li>Usage Data: how you interact with our platform and features.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve our services.</li>
            <li>To personalize your user experience.</li>
            <li>To communicate updates, offers, or important notices.</li>
            <li>To maintain platform security and compliance.</li>
          </ul>
        </div>

        <div className="privacy-section">
          <h2>4. Sharing Your Data</h2>
          <p>
            We do not sell your data. We may share limited data with trusted partners for analytics, infrastructure,
            or legal compliance purposes under strict confidentiality agreements.
          </p>
        </div>

        <div className="privacy-section">
          <h2>5. Data Security</h2>
          <p>
            We implement best practices in data encryption, access control, and secure storage to protect your personal information.
          </p>
        </div>

        <div className="privacy-section">
          <h2>6. Your Rights</h2>
          <p>
            You have the right to view, update, or delete your personal data at any time. Contact us at
            <strong> support@aimhirepro.com </strong> for assistance.
          </p>
        </div>

        <div className="privacy-section">
          <h2>7. Updates to This Policy</h2>
          <p>
            We may revise this policy periodically. Updates will be posted here, and major changes will be
            communicated via email or platform notification.
          </p>
        </div>

        <div className="privacy-section">
          <h2>8. Contact</h2>
          <p>
            For questions or concerns about this policy, contact us at <strong>privacy@aimhirepro.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
