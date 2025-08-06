import React from 'react';
import '../../assets/css/AboutPage.css';
import creatorImage from '../../assets/img/creator.jpg';

import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const AboutPage = () => {
    return (
        <div className="terms-page container">


            <div className='terms-container'>
                <h2 className="about-title text-primary mb-4">About AimHirePro</h2>


                <p className="about-intro mb-4">
                    AimHirePro is a next-generation resume-building platform, built with modern technologies and clean design principles.
                    It empowers users to build ATS-friendly, professional resumes that reflect their true potential — with the help of
                    AI, real-time preview, and customizable templates.
                </p>


                <div className="about-creator-box mt-5">
                    <h4 className="about-subtitle">Project Creator</h4>
                    <div className="creator-card shadow-sm border rounded-4 p-4 mt-3 d-flex align-items-center gap-4 bg-white">
                        <img src={creatorImage} alt="Akanksha Machcha" className="creator-image" />
                        <div>
                            <h5 className="mb-1 fw-bold">Akanksha Machcha</h5>
                            <p className="mb-2 text-muted">Full Stack Developer & Creator of AimHirePro</p>
                            <div className="creator-socials d-flex gap-3 mt-2">
                                <a href="https://github.com/AkankshaMachcha" target="_blank" rel="noreferrer" className="social-link github">
                                    <GitHubIcon fontSize="medium" />
                                </a>
                                <a href="https://www.linkedin.com/in/akanksha-machcha-4b1bbb306/" target="_blank" rel="noreferrer" className="social-link linkedin">
                                    <LinkedInIcon fontSize="medium" />
                                </a>
                                <a href="mailto:akankshamachcha29@gmail.com" className="social-link email">
                                    <EmailIcon fontSize="medium" />
                                </a>
                            </div>

                        </div>
                    </div>
                </div>


                <div className="about-section mb-5 mt-5">
                    <h4 className="about-subtitle">Our Mission</h4>
                    <p>
                        <RocketLaunchIcon fontSize="small" className="me-2 text-primary" />
                        To democratize career-building by providing powerful, intuitive, and accessible tools to everyone — regardless of their background.
                    </p>
                </div>

                <div className="about-section mb-5">
                    <h4 className="about-subtitle">Our Vision</h4>
                    <p>
                        <EmojiObjectsIcon fontSize="small" className="me-2 text-warning" />
                        To become the most trusted and intelligent resume platform that not only helps you get noticed but also makes you feel confident in every application.
                    </p>
                </div>

                <div className="about-section mb-5">
                    <h4 className="about-subtitle">Core Values</h4>
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                        <li><VerifiedUserIcon fontSize="small" className="me-2 text-success" /> Simplicity and Accessibility</li>
                        <li><VerifiedUserIcon fontSize="small" className="me-2 text-success" /> Privacy and User Empowerment</li>
                        <li><VerifiedUserIcon fontSize="small" className="me-2 text-success" /> Innovation through Technology</li>
                        <li><VerifiedUserIcon fontSize="small" className="me-2 text-success" /> Design-Driven User Experience</li>
                    </ul>
                </div>

                <div className="about-section mb-5">
                    <h4 className="about-subtitle">Technologies Used</h4>
                    <ul>
                        <li><strong>Frontend:</strong> React.js, Redux Toolkit, Bootstrap 5, MUI Icons</li>
                        <li><strong>Backend:</strong> Spring Boot (Java), REST APIs, Swagger Docs, JWT Auth</li>
                        <li><strong>Database:</strong> PostgreSQL</li>
                        <li><strong>Resume Export:</strong> html2pdf.js, html2canvas, html-docx</li>
                        <li><strong>Payments:</strong> Razorpay Integration (with verification)</li>
                    </ul>
                </div>


            </div>
        </div>
    );
};

export default AboutPage;
