// src/components/landing/FeatureSection.jsx

import React, { useEffect } from 'react';
import './css/FeatureSection.css';
import { FaBrain, FaPalette, FaChartBar, FaSpellCheck ,FaChartLine} from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const features = [
  {
    icon: <FaBrain className="feature-icon" />,
    title: 'Smart AI Suggestions',
    description: 'Get tailored bullet points & skills based on your role and experience.'
  },
  {
    icon: <FaPalette className="feature-icon" />,
    title: 'Designer Templates',
    description: 'ATS-friendly, modern, and pixel-perfect resume designs.'
  },
  {
    icon: <FaChartBar className="feature-icon" />,
    title: 'ATS Score Insights',
    description: 'See how your resume scores on readability, keywords, and formatting.'
  },
  {
    icon: <FaSpellCheck className="feature-icon" />,
    title: 'Built-in Proofreader',
    description: 'Grammar & tone checker to keep your resume mistake-free and professional.'
  },
  {
    icon: <FaChartLine className="feature-icon" />,
    title: 'ATS Score Insights',
    description: 'Get instant feedback on how well your resume performs with Applicant Tracking Systems.'
  }

];

const FeatureSection = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <section className="feature-section">
      <div className="feature-container">
        <h2 className="feature-title" data-aos="fade-up">
          Everything You Need to Land the Job
        </h2>
        <p className="feature-subtext" data-aos="fade-up" data-aos-delay="200">
          AI-powered tools, recruiter-approved templates, and expert guidance  everything you need to stand out and get hired.
        </p>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              data-aos="zoom-in"
              data-aos-delay={index * 200}
            >
              {feature.icon}
              <h4 className="feature-card-title">{feature.title}</h4>
              <p className="feature-card-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
