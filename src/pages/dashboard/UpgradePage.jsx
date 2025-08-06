import React from 'react';
import { useSelector } from 'react-redux';
import UpgradeAccountButton from '../../components/common/UpgradeAccountButton';
import '../../assets/css/upgrade.css';

import { CheckCircle, MinusCircle } from 'lucide-react';

const UpgradePage = () => {
  const user = useSelector((state) => state.auth.user);
  const authority = user?.authority || "";
  const isPremium = authority.includes("PREMIUM");

  const renderFeature = (label, isAvailable) => (
    <li>
      {isAvailable ? (
        <CheckCircle size={16} color="#34A853" className="me-2" />
      ) : (
        <MinusCircle size={16} color="#999" className="me-2" />
      )}
      {label}
    </li>
  );

  return (
    <div className="container upgrade-page">
      <h2 className="text-center fw-bold" style={{ color: '#0057D9' }}>
        Choose the plan that’s right for you
      </h2>
      <p className="text-center text-muted">Step 1 of 1 — Unlock your full career potential</p>

      <div className="row mt-1 g-4 justify-content-center">
        {/* FREE Plan */}
        <div className="col-md-5 col-lg-4">
          <div className="plan-box">
            <div className="plan-header">
              <h5>Free Plan</h5>
              {!isPremium && <span className="badge bg-secondary">Current Plan</span>}
            </div>
            <hr />
            <ul className="plan-features">
              {renderFeature("1 Resume", true)}
              {renderFeature("Restricted PDF Download", true)}
              {renderFeature("ATS Score & Grammar Tools", false)}
              {renderFeature("Resume History", false)}
              {renderFeature("AI Resume Suggestions", false)}
            </ul>
            <hr />
            <div className="plan-price">₹0 / lifetime</div>
          </div>
        </div>

        {/* PREMIUM Plan */}
        <div className="col-md-5 col-lg-4">
          <div className="plan-box border-primary">
            <div className="plan-header">
              <h5 className="text-primary">Premium Plan</h5>
              {isPremium && <span className="badge bg-success">Current Plan</span>}
            </div>
            <hr />
            <ul className="plan-features">
              {renderFeature("Unlimited Resumes", true)}
              {renderFeature("Unlimited Downloads", true)}
              {renderFeature("ATS Score Checker", true)}
              {renderFeature("Grammar Correction", true)}
              {renderFeature("Resume Version History", true)}
              {renderFeature("AI Resume Suggestions (Coming Soon)", true)}
            </ul>
            <hr />
            <div className="plan-price text-primary fw-semibold">₹499 / lifetime</div>
            {!isPremium && (
              <div className="text-center mt-3">
                <UpgradeAccountButton />
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-center text-muted mt-4 small">
        Secure payments powered by Razorpay.
      </p>
    </div>
  );
};

export default UpgradePage;
