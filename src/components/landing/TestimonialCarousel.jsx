// src/components/landing/TestimonialCarousel.jsx

import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './css/TestimonialCarousel.css';

const testimonials = [
  {
    quote: "AimHirePro helped me land 3 interviews within a week. It’s stupidly simple to use!",
    name: "Sarthak Jain",
    role: "B.Tech Final Year, GGSIPU"
  },
  {
    quote: "I made my resume in 5 minutes flat. It's like having a designer and HR expert in one app.",
    name: "Priya Mehta",
    role: "Fresher, Business Analyst Aspirant"
  },
  {
    quote: "Never thought resume making could be this easy and elegant. Highly recommended!",
    name: "Raj Malhotra",
    role: "Recent MBA Graduate"
  },
  {
    quote: "From boring to badass — AimHirePro made my resume pop and got me noticed!",
    name: "Divya Sharma",
    role: "Frontend Developer, Intern"
  }
];

const TestimonialCarousel = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <section className="testimonial-section" data-aos="fade-up">
      <div className="testimonial-container">
        <h2 className="test-section-title" data-aos="fade-up" data-aos-delay="100">What Users Say</h2>
        <p className="test-section-subtext" data-aos="fade-up" data-aos-delay="200">
          Professionals across fields use <strong>AimHirePro</strong> to craft standout resumes
          and land their dream jobs — here’s what they have to say.
        </p>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500 }}
          loop={true}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-card" data-aos="zoom-in" data-aos-delay={300 + index * 100}>
                <p className="quote">"{item.quote}"</p>
                <p className="author">— {item.name}, <span>{item.role}</span></p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
