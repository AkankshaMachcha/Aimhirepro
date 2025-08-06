// src/pages/public/ContactUsPage.jsx
import React, { useState } from 'react';
import '../../assets/css/ContactPage.css';
import { submitContactForm } from '../../services/contactService';
import { toast, ToastContainer } from 'react-toastify';
// import EmailIcon from '@mui/icons-material/Email';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitContactForm(formData);
      toast.success('Message sent successfully!');
      setFormData({
        fullName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      toast.error('Failed to send message. Try again later.');
    }
  };

  return (
    <div className="contact-container container py-5">
      <ToastContainer />
      <div className="row g-5">
        {/* LEFT INFO BOX */}


        <div className="col-md-7 contact-left-box p-5 rounded shadow-sm bg-light-blue">
          {/* Heading */}
          <h2 className="contact-heading mb-3">Let’s Connect</h2>
          <p className="contact-subtext mb-4">
            I’m always open to opportunities, feedback, or meaningful conversations. Reach out below!
          </p>

         
          <p className="text-muted mb-4">
            Whether you're a recruiter, collaborator, or just someone who appreciates well-built platforms — I'm glad you're here!
            Let's create something impactful together.
          </p>

          {/* Social Links Icons Row */}
          <div className="contact-social mb-5 d-flex flex-wrap gap-4">
            <div className="d-flex align-items-center">
              <LinkedInIcon className="me-2 text-primary" />
              <a href="https://www.linkedin.com/public-profile/settings?trk=d_flagship3_profile_self_view_public_profile" target="_blank" rel="noreferrer" className="text-dark">
                LinkedIn
              </a>
            </div>
            <div className="d-flex align-items-center">
              <GitHubIcon className="me-2 text-dark" />
              <a href="https://github.com/AkankshaMachcha/" target="_blank" rel="noreferrer" className="text-dark">
                GitHub
              </a>
            </div>
            <div className="d-flex align-items-center">
              <EmailIcon className="me-2 text-danger" />
              <a href="mailto:akankshamachcha29@gmail.com" className="text-dark">
                Email
              </a>
            </div>
          </div>

          {/* 3-Block Flex Grid */}
          <div className="row">
            <div className="col-md-4 mb-4">
              <h6 className="fw-bold">Contact Akanksha</h6>
              <p className="text-muted small">
                I’d love to hear from you—whether it’s a quick question or a long-term collaboration.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <h6 className="fw-bold">Feedback</h6>
              <p className="text-muted small">
                Have thoughts or ideas to improve AimHirePro? I’m listening and always improving.
              </p>
            </div>
            <div className="col-md-4 mb-4">
              <h6 className="fw-bold">Media</h6>
              <p className="text-muted small">
                For interviews, partnerships email<br />
                <strong>ahimhirepropayments@gmail.com</strong>
              </p>
            </div>
          </div>
        </div>





        {/* RIGHT FORM */}
        <div className="col-md-5">
          <div className="contact-form-box rounded">
            <h4 className="mb-3">Send Us a Message</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Your Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="Subject (Optional)"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <textarea
                  name="message"
                  rows="5"
                  className="form-control"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
