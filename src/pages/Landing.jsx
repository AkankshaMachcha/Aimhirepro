
import React from 'react';

import HeroSection from '../components/landing/HeroSection.jsx';
import TestimonialCarousel from '../components/landing/TestimonialCarousel.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import FeatureSection from '../components/landing/FeatureSection.jsx';
import CallToAction from '../components/landing/CallToAction.jsx';
import FAQSection from '../components/landing/FAQSection.jsx';

const Landing = () => (
  <>
    <HeroSection />
    <TestimonialCarousel />
    <HowItWorks />
    <FeatureSection /> 
    <CallToAction />
    <FAQSection/> 
   
  </>
);

export default Landing;
