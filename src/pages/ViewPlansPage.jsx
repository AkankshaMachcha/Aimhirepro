// src/pages/ViewPlansPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, MinusCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import '../assets/css/upgrade.css';

const ViewPlansPage = () => {
  const navigate = useNavigate();

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

  const handleFreeClick = () => navigate('/signup');

  const handlePremiumClick = () => {
    toast.info("Please log in to upgrade to Premium from your dashboard.");
    navigate('/login');
  };

  return (
    <div className="container upgrade-page">
      <h2 className="text-center fw-bold" style={{ color: '#0057D9' }}>
        Choose the plan that fits your career goals
      </h2>
      <p className="text-center text-muted">Lifetime access. One decision away from impact.</p>

      <div className="row mt-1 g-4 justify-content-center">
        {/* FREE Plan */}
        <div className="col-md-5 col-lg-4">
          <div className="plan-box">
            <div className="plan-header">
              <h5>Free Plan</h5>
              <span className="badge bg-secondary">Starter</span>
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
            <div className="text-center mt-3">
              <button className="btn btn-outline-primary w-100" onClick={handleFreeClick}>
                Sign Up Free
              </button>
            </div>
          </div>
        </div>

        {/* PREMIUM Plan */}
        <div className="col-md-5 col-lg-4">
          <div className="plan-box border-primary">
            <div className="plan-header">
              <h5 className="text-primary">Premium Plan</h5>
              <span className="badge bg-success">Most Popular</span>
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
            <div className="text-center mt-3">
              <button className="btn btn-primary w-100" onClick={handlePremiumClick}>
                Create Premium Account
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-muted mt-4 small">
        Secure payments and upgrade handled after login.
      </p>
    </div>
  );
};

export default ViewPlansPage;
