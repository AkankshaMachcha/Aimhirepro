import React, { useState } from 'react';
import '../../assets/css/logincss.css';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/auth/authThunk';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const { email, password } = formData;
  const { loading, user } = useSelector((state) => state.auth);

  React.useEffect(() => {
    const existingToken = localStorage.getItem('token');
    if (user && user.email && existingToken) {
      navigate('/dashboard');
    }
  }, [user, navigate]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(loginUser({ email, password }));
      if (res?.payload?.token) {
        toast.success('Login successful');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        toast.error(res?.payload || 'Login failed');
      }
    } catch (err) {
      toast.error('Unexpected error. Please try again.');
    }
  };


  return (
    <div className="login-container-wrapper">
      <ToastContainer position="top-right" autoClose={2500} />
      <form
        id="login-form"
        className="login-form-aimhire-login-form"
        onSubmit={handleSubmit}
      >
        <h2 className="login-title">Log in</h2>
        <p className="login-subtitle">Welcome back! Please log in to continue.</p>

        <div className="login-input-field login-email">
          <i className="fas fa-envelope"></i>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="login-input-field login-password d-flex align-items-center">
          <i className="fas fa-lock"></i>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
          <i
            className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer', marginLeft: '10px' }}
            title={showPassword ? 'Hide password' : 'Show password'}
          ></i>
        </div>


        <input
          type="submit"
          value={loading ? 'Logging in...' : 'Login'}
          className="login-btn"
          disabled={loading}
        />

        <div className="login-links">
          <Link to="/forgot-password" className="forgot-password-link">
            <span role="button">Forgot password?</span>
          </Link>

          <p className="signup-redirect">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
