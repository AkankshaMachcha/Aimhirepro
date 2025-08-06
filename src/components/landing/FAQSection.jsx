// src/components/landing/FAQSection.jsx

import React, { useState } from 'react';
import './css/FAQSection.css';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
    {
        question: 'Is AimHirePro free to use?',
        answer: 'Yes, you can create one resume and download it for free. To unlock multiple resumes, AI grammar checks, and PDF templates, consider our premium plans.'
    },
    {
        question: 'What’s included in the premium plan?',
        answer: 'Premium users can create unlimited resume versions, access advanced templates, use AI proofreading, track resume downloads, and more.'
    },
    {
        question: 'Can I edit or update my resume later?',
        answer: 'Absolutely! Just log in anytime to update your details, change the template, or download the latest version.'
    },
    {
        question: 'Is my personal data safe on AimHirePro?',
        answer: 'Yes, we use secure authentication and encryption practices. Your resume data is stored safely and never shared with third parties.'
    },
    {
        question: 'How do I upgrade to premium?',
        answer: 'Click on the "View Plans" button on the site or go to your dashboard. You can securely upgrade via Razorpay in seconds.'
    },
    {
        question: 'Can I use AimHirePro on my phone or tablet?',
        answer: 'Yes, AimHirePro is fully responsive and works smoothly across desktops, tablets, and smartphones.'
    },
    {
        question: 'Will my resume be ATS-friendly?',
        answer: 'Definitely! All our templates are optimized for Applicant Tracking Systems (ATS), so your resume won’t get filtered out by automated tools.'
    },
    {
        question: 'Can I change the template after creating a resume?',
        answer: 'Yes! You can switch between templates anytime without losing your data. Just choose a new style and preview instantly.'
    }

];

const FAQSection = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggle = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <div className="faq-container">
                <h2 className="faq-title">Got Questions? We’ve Got Answers.</h2>
                <p className="faq-subtext">
                    Everything you need to know about creating resumes, premium plans, and using AimHirePro efficiently.
                </p>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                        >
                            <div className="faq-question" onClick={() => toggle(index)}>
                                <span>{faq.question}</span>
                                {activeIndex === index ? <FaChevronUp className="faq-icon rotate" /> : <FaChevronDown className="faq-icon" />}
                            </div>
                            {activeIndex === index && (
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
