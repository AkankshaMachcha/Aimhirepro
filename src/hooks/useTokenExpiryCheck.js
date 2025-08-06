import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../redux/auth/authSlice';
import { toast } from 'react-toastify';

const useTokenExpiryCheck = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const expiresAt = localStorage.getItem('expiresAt');

    if (!expiresAt) return; 
    const expiryTime = new Date(expiresAt).getTime();
    const now = new Date().getTime();

    // Skip if expiry is NaN or invalid
    if (isNaN(expiryTime)) return;

    if (now >= expiryTime) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('expiresAt');

      dispatch(logoutUser());
      toast.warn('Session expired. Please log in again.');
      navigate('/login');
    }
  }, [dispatch, navigate]);
};

export default useTokenExpiryCheck;
