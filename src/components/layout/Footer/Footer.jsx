// src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand text-center">
          <img
            src="/aimhirepro-logo.png"
            alt="AimHirePro Logo"
            className="footer-logo mb-2"
          />
          <h4>AimHirePro</h4>
          <p>Build Resumes. Build Careers.</p>
        </div>


        {/* Navigation Links */}
        <div className="footer-links">
          <h5>Explore</h5>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/templates">Resume Templates</Link></li>
            <li><Link to="/dashboard/create">Create Resume</Link></li>
            <li><Link to="/pricing">View Plans</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h5>Company</h5>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            {/* <li><Link to="/careers">Careers</Link></li> */}
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Social + Credit */}
        <div className="footer-social">
          <h5>Connect</h5>
          <div className="social-icons">
            <a className="linkedin" href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
            <a className="github" href="https://github.com/AkankshaMachcha/" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a className="email" href="mailto:akankshamachcha29@gmail.com">
              <FaEnvelope />
            </a>
          </div>
          <p className="creator">
            Created By{' '}
            <a href="https://github.com/AkankshaMachcha/" target="_blank" rel="noreferrer">
              Akanksha Machcha
            </a>
          </p>
        </div>


      </div>
    </footer>
  );
};

export default Footer;
