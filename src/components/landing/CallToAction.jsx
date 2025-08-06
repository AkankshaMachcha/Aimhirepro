// src/components/landing/CallToAction.jsx

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/CallToAction.css';

const CallToAction = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="cta-section">
      <div className="cta-container" data-aos="zoom-in">
        <h2 className="cta-title">Ready to Build Your Dream Resume?</h2>
        <p className="cta-subtext">
          Sign up for free and create a professional resume in minutes — or explore our premium features.
        </p>
        <div className="cta-buttons">
          <Link to="/signup" className="btn btn-light cta-btn-primary">Get Started</Link>
          <Link to="/pricing" className="btn btn-outline-light cta-btn-secondary">View Plans</Link>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
