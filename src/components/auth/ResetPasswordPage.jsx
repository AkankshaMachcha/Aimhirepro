import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import LockResetIcon from '@mui/icons-material/LockReset';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { resetPassword } from '../../services/authService';
import 'react-toastify/dist/ReactToastify.css';
import '../../assets/css/resetpassword.css';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isStrongPassword = (password) => {
    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return strongRegex.test(password);
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(newPassword)) {
      return toast.error(
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
      );
    }

    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    try {
      await resetPassword({ token, newPassword, confirmPassword });
      toast.success('Password reset successfully. Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to reset password.');
    }
  };

  return (
    <div className="reset-container-wrapper">
      <ToastContainer position="top-right" autoClose={2500} />

      <form className="reset-form-container" onSubmit={handleReset}>
        <h2 className="reset-title">Reset Password</h2>
        <p className="reset-subtitle">Enter and confirm your new password below.</p>

        {/* New Password Field */}
        <div className="reset-input-field d-flex align-items-center">
          <LockResetIcon />
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {showNewPassword ? (
            <VisibilityOffIcon
              className="toggle-password"
              onClick={() => setShowNewPassword(false)}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <VisibilityIcon
              className="toggle-password"
              onClick={() => setShowNewPassword(true)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="reset-input-field d-flex align-items-center">
          <LockResetIcon />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {showConfirmPassword ? (
            <VisibilityOffIcon
              className="toggle-password"
              onClick={() => setShowConfirmPassword(false)}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <VisibilityIcon
              className="toggle-password"
              onClick={() => setShowConfirmPassword(true)}
              style={{ cursor: 'pointer' }}
            />
          )}
        </div>

        <button type="submit" className="reset-btn">Reset Password</button>

        <div className="reset-redirect mt-2">
          <span className="text-muted">Back to </span>
          <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
