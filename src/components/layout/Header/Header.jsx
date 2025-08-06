import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useSelector, useDispatch } from 'react-redux';
import defaultProfile from '../../../assets/img/default-profile.jpg';
import { logoutUser } from '../../../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import useTokenExpiryCheck from '../../../hooks/useTokenExpiryCheck';

const Header = () => {
  useTokenExpiryCheck();
  const location = useLocation();
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg header sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 pt-2" to="/">
          <img
            src="/assets/logo/aimhirepro-logo.png"
            alt="AimHirePro Logo"
            style={{ height: '3rem' }}
          />
          <div className="main-name">
            <div
              className="appname"
              style={{
                fontWeight: 800,
                color: '#112467',
                fontSize: '28px',
                letterSpacing: '2px'
              }}
            >
              AIMHIREPRO
            </div>
            <div className="slogan" style={{ color: '#0057D9', fontSize: '14px' }}>
              Build Resumes. Build Careers.
            </div>
          </div>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarContent">
          <ul className="navbar-nav align-items-center gap-3">
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                Resume
              </span>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item p-3" to="/templates">
                    <strong>Download Resume Templates</strong>
                    <br />
                    <small>Explore modern, ATS-friendly designs</small>
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-3" to="/dashboard/create">
                    <strong>Create Resume Instantly</strong>
                    <br />
                    <small>Start building with AI assistance now</small>
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === '/pricing' ? 'active' : ''}`}
                to="/pricing"
              >
                View Plans
              </Link>
            </li>

            <li className="nav-item text-muted px-2" style={{ pointerEvents: 'none', fontWeight: 'bold' }}>
              |
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle d-flex align-items-center" role="button" data-bs-toggle="dropdown">
                    <img
                      src={
                        user?.profileImage
                          ? `${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}/${user.profileImage}`
                          : defaultProfile
                      }
                      alt="profile"
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    {user?.firstName}{" "}{user?.lastName}

                  </span>
                  <ul className="dropdown-menu dropdown-menu-end p-3" style={{ minWidth: '200px', borderRadius: '12px' }}>
                    <li className="mb-2">
                      <Link className="dropdown-item py-2 px-3 rounded" style={{ fontSize: '15px' }} to="/dashboard/profile">
                        <i className="fas fa-user me-2"></i> Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        className="dropdown-item py-2 px-3 rounded text-danger"
                        style={{ fontSize: '15px' }}
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i> Logout
                      </button>
                    </li>
                  </ul>

                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                    to="/login"
                  >
                    Sign In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn-primary get-started-btn" to="/signup">
                    Get Started
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
