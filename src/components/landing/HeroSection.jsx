import React from 'react';
import { Link } from 'react-router-dom';
import mainpageimage from '../../assets/illusration/resume-preview.jpg';
import './css/HeroSection.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const HeroSection = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,       // animation duration in ms
                   // whether animation should happen only once
        });
    }, []);

    return (
        <section className="hero-section p-0 m-0">
            <div className="container hero-content">
                <div className="hero-text" data-aos="fade-right">
                    <h1>
                        Ace Your Next Job With a <span className="highlight">Killer Resume</span>
                    </h1>
                    <p>
                        Create powerful, professional resumes in minutes with <strong>AimHirePro</strong>.
                        Zero stress, full control, and smart suggestions.
                    </p>
                    <div className="hero-buttons" data-aos="fade-up" data-aos-delay="300">
                        <Link to="/signup" className="btn btn-primary aimhire-btn-primary">Create Resume</Link>
                        <Link to="/templates" className="btn btn-outline-primary aimhire-btn-secondary">Browse Templates</Link>
                    </div>
                </div>

                <div className="hero-image" data-aos="zoom-in" data-aos-delay="500">
                    <img src={mainpageimage} alt="Resume Preview" />
                </div>
            </div>
        </section>

    );
};

export default HeroSection;