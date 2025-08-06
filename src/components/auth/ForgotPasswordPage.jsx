import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { forgotPassword } from '../../services/authService';
import EmailIcon from '@mui/icons-material/Email';
import { Link } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/forgotpassword.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      toast.success('If this email exists, a reset link has been sent.');
    } catch (err) {
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="forgot-container-wrapper">
      <ToastContainer position="top-right" autoClose={2500} />

      <form className="forgot-form-container" onSubmit={handleSubmit}>
        <h2 className="forgot-title">Forgot Password</h2>
        <p className="forgot-subtitle">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        <div className="forgot-input-field d-flex align-items-center">
          <EmailIcon />
          <input
            type="email"
            name="email"
            placeholder="Registered Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="forgot-btn">Send Reset Link</button>

        <div className="forgot-redirect">
          Remembered your password? <Link to="/login">Go to Login</Link>
        </div>

        <div className="forgot-redirect mt-2">
          <span className="text-muted">or </span> <br/>
          <Link to="/login">Sign in</Link> instead
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
