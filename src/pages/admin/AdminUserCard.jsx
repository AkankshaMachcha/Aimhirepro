// src/components/admin/AdminUserCard.jsx

import React from 'react';
import { Avatar } from '@mui/material';
import '../../assets/css/AdminUserCard.css';
import DEFAULT_AVATAR from '../../assets/img/default-profile.jpg';
import { useNavigate } from 'react-router-dom';


const AdminUserCard = ({ user }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/dashboard/admin/user/email/${encodeURIComponent(user.email)}`);

  };

  const roleLabel = user.authority.includes('ADMIN')
    ? 'Admin'
    : user.authority.includes('PREMIUM')
      ? 'Premium User'
      : 'Free User';

  const roleClass = user.authority.includes('ADMIN')
    ? 'admin'
    : user.authority.includes('PREMIUM')
      ? 'premium'
      : 'free';

  const statusClass = user.enabled ? 'enabled' : 'disabled';

  return (
    <div className="card admin-user-card-tile shadow-sm" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="card-body text-center">
        <Avatar
          src={
            user?.profileImage
              ? `${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}/${user.profileImage}`
              : DEFAULT_AVATAR
          }
          alt={`${user.firstName}`}
          className="admin-user-avatar mb-3"
        />
        <h5 className="admin-user-name mb-1">
          {user.firstName} {user.lastName}
        </h5>

        <p className="admin-user-email mb-2">{user.email}</p>

        <div className={`admin-user-role-label ${roleClass} mb-2`}>
          <strong>{roleLabel}</strong>
        </div>

      </div>
    </div>
  );
};

export default AdminUserCard;
