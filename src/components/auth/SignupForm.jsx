import React, { useState, useEffect } from 'react';
import '../../assets/css/signup.css';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/auth/authThunk';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { sendOtp, verifyOtp } from '../../services/authService';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const SignupForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (user && user.email) {
      toast.info("You're already logged in");
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [otp, setOtp] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [resending, setResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const { firstName, lastName, phoneNumber, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !phoneNumber || !email || !password || !confirmPassword)
      return toast.error('Please fill all required fields');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error('Invalid email format');

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPassword.test(password)) return toast.error('Password must include uppercase, lowercase, number & symbol');

    if (password !== confirmPassword) return toast.error('Passwords do not match');
    if (!isEmailVerified) return toast.error('Please verify your email first');

    return true;
  };

  const handleSendOtp = async () => {
    if (!formData.email) return toast.error('Enter your email first');
    try {
      setResending(true);
      await sendOtp(formData.email);
      toast.success('OTP sent to your email');
      setOtpSent(true);
      setOtpTimer(300);
    } catch (err) {
      toast.error(err.response?.data || 'Failed to send OTP');
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error('Enter the OTP');
    try {
      await verifyOtp(formData.email, otp);
      toast.success('Email verified successfully');
      setIsEmailVerified(true);
    } catch (err) {
      toast.error(err.response?.data || 'Invalid or expired OTP');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password
    };

    try {
      await dispatch(signupUser(payload)).unwrap();
      toast.success('Account created successfully!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const message =
        typeof err === 'string'
          ? err
          : err?.response?.data?.message || 'Signup failed. Please try again.';

      if (message.includes('already')) {
        toast.error('This email is already registered.');
      } else {
        toast.error(message);
      }
    }
  };

  return (
    <div className="signup-container col-md-12 mx-auto">
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
      <form onSubmit={handleSubmit} className="signup-form">
        <h2 className="signup-title">Sign Up</h2>
        <p className="signup-subtitle">
          Build professional resumes, track your career, and stand out.
        </p>

        <div className="row g-3">
          {/* Name Fields */}
          {['firstName', 'middleName', 'lastName'].map((field, idx) => (
            <div key={field} className="col-md-4">
              <div className="signup-input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name={field}
                  placeholder={field
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (s) => s.toUpperCase()) + (field !== 'middleName' ? ' *' : '')}
                  value={formData[field]}
                  onChange={handleChange}
                />
              </div>
            </div>
          ))}

          {/* Phone and Email */}
          <div className="col-md-6">
            <div className="signup-input-field">
              <i className="fas fa-phone"></i>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number *"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex align-items-center">
            <div className="signup-input-field flex-grow-1 me-2">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email *"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {isEmailVerified ? (
              <span className="text-success fw-bold d-flex align-items-center">
                <i className="fas fa-check-circle me-1"></i> Verified
              </span>
            ) : (
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleSendOtp}
                disabled={resending || otpTimer > 0}
              >
                {resending ? 'Sending...' : otpTimer > 0 ? `Resend (${otpTimer}s)` : 'Verify Email'}
              </button>
            )}

          </div>

          {/* OTP Fields */}
          {otpSent && !isEmailVerified && (
            <>
              <div className="col-md-6">
                <div className="signup-input-field">
                  <i className="fas fa-key"></i>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            </>
          )}

          {/* Password + Confirm */}
          <div className="col-md-6">
            <div className="signup-input-field d-flex align-items-center">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password *"
                value={formData.password}
                onChange={handleChange}
              />
              <i
                className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                onClick={() => setShowPassword(!showPassword)}
                style={{ marginLeft: 'auto', cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          <div className="col-md-6">
            <div className="signup-input-field d-flex align-items-center">
              <i className="fas fa-lock"></i>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password *"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <i
                className={`fas ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ marginLeft: 'auto', cursor: 'pointer' }}
              ></i>
            </div>
          </div>

          {/* Submit + Redirect */}
          <div className="col-12 mt-2">
            <button type="submit" className="signup-btn" disabled={!isEmailVerified}>
              Create Account
            </button>
          </div>

          <div className="col-12 signup-footer">
            Already have an account? <Link to="/login">Log in</Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
