import React, { useEffect } from 'react';
import './css/HowItWorks.css';
import { FaRegFileAlt, FaRobot, FaDownload } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const steps = [
  {
    icon: <FaRegFileAlt className="step-icon" />,
    title: 'Choose Template',
    description: 'Pick from professional, ATS-friendly templates tailored for every career level.',
  },
  {
    icon: <FaRobot className="step-icon" />,
    title: 'Fill Details with AI',
    description: 'Let our AI help craft compelling content that highlights your strengths.',
  },
  {
    icon: <FaDownload className="step-icon" />,
    title: 'Download Resume',
    description: 'Export your resume instantly in PDF format, ready to impress recruiters.',
  },
];

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      offset: 100, // ✅ trigger when section is ~100px inside viewport
    });
  }, []);

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="how-it-works-container">
        <h2 className="hiw-section-title" data-aos="fade-up">Build Like a Pro in 3 Easy Steps</h2>
        <p className="hiw-sub-section-subtext" data-aos="fade-up" data-aos-delay="200">
          No fluff, no fuss. Just pick a template, fill in your details, and download your job-ready resume.
        </p>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div
              key={index}
              className="step-card"
              data-aos="fade-up"
              data-aos-delay={300 + index * 200}
            >
              {step.icon}
              <h4 className="step-title">{step.title}</h4>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
