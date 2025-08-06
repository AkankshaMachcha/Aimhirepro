import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Dropdown, Button, Modal } from 'react-bootstrap';
import {
  getUserByEmail,
  deleteUserByEmail,
  toggleUserEnabled,
  updateUserRole,
} from '../../services/adminService';
import {
  deleteResume,
  getResumeByVersionLabel,
} from '../../services/adminResumeService';
import { toast } from 'react-toastify';
import ResumeTemplateRenderer from '../../components/resumes/ResumeTemplateRenderer';
import '../../assets/css/AdminUserProfilePage.css';

const AdminUserProfilePage = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { layoutConfig } = useSelector((state) => state.resumeBuilder);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserByEmail(email);
        setUser(data);
      } catch {
        toast.error('User not found');
        navigate('/dashboard/admin/users');
      }
    };
    fetchUser();
  }, [email]);

  const handleToggleEnabled = async () => {
    const newStatus = !user.enabled;
    try {
      await toggleUserEnabled(user.email, newStatus);
      setUser({ ...user, enabled: newStatus });
      toast.success(`User ${newStatus ? 'unbanned' : 'banned'} successfully`);
    } catch {
      toast.error('Action failed');
    }
  };

  const handleToggleRole = async () => {
    const newRole = user.authority === 'PREMIUM' ? 'FREE' : 'PREMIUM';
    try {
      await updateUserRole(user.email, newRole);
      setUser({ ...user, authority: newRole });
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error('Role change failed');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUserByEmail(user.email);
      toast.success('User deleted successfully');
      navigate('/dashboard/admin/users');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleDeleteResume = async (versionLabel) => {
    try {
      await deleteResume(user.email, versionLabel);
      setUser({
        ...user,
        resumes: user.resumes.filter((r) => r.versionLabel !== versionLabel),
      });
      toast.success('Resume deleted');
    } catch {
      toast.error('Resume deletion failed');
    }
  };

  const handleViewResume = async (versionLabel) => {
    try {
      const resume = await getResumeByVersionLabel(user.email, versionLabel);
      setSelectedResume({
        ...resume,
        layoutConfig
      });
      setShowModal(true);
    } catch {
      toast.error('Failed to load resume');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container admin-user-profile-page mt-4 mb-5">
      {/* Top Container */}
      <div className="card shadow-sm p-4 mb-4 position-relative">
        <div className="position-absolute top-0 end-0 m-3">
          <Dropdown align="end">
            <Dropdown.Toggle variant="outline-primary" size="sm">
              User Actions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleToggleEnabled}>
                {user.enabled ? 'Ban User' : 'Unban User'}
              </Dropdown.Item>
              <Dropdown.Item onClick={handleToggleRole}>
                {user.authority?.includes('PREMIUM') ? 'Set to FREE' : 'Set to PREMIUM'}
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item className="text-danger" onClick={handleDeleteUser}>
                Delete User
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="d-flex align-items-center gap-4">
          <img
            src={
              user?.profileImage
                ? `${process.env.REACT_APP_API_BASE_URL.replace('/api/v1', '')}/${user.profileImage}`
                : '/default-profile.png'
            }
            alt="avatar"
            className="rounded-circle border"
            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
          />
          <div>
            <h4 className="mb-1">{user.firstName} {user.lastName}</h4>
            <p className="mb-0 text-muted">{user.email}</p>
            <span className={`badge ${user.authority?.includes('PREMIUM') ? 'bg-success' : 'bg-secondary'} mt-2`}>
              Account Type: {user.authority?.includes('PREMIUM') ? 'PREMIUM' : 'FREE'}
            </span>
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="card shadow-sm p-4 mb-4">
        <h5 className="mb-3">User Details</h5>
        <div className="row">
          <div className="col-md-4">
            <p><strong>Date of Birth:</strong> {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
            <p><strong>Nationality:</strong> {user.nationality || 'N/A'}</p>
          </div>
          <div className="col-md-4">
            <p><strong>City:</strong> {user.city || 'N/A'}</p>
            <p><strong>State:</strong> {user.state || 'N/A'}</p>
            <p><strong>Country:</strong> {user.country || 'N/A'}</p>
          </div>
          <div className="col-md-4">
            <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
            <p><strong>Address:</strong> {user.address || 'N/A'}</p>
            <p><strong>Joined:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Resumes Container */}
      <div className="card shadow-sm p-4">
        <h5 className="mb-3">User Resumes</h5>
        {user.resumes.length === 0 ? (
          <p>No resumes found.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {user.resumes.map((resume) => (
              <div key={resume.versionLabel} className="border rounded px-3 py-2 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{resume.title || 'Untitled'}</h6>
                  <small className="text-muted">{resume.versionLabel} | {resume.visibility} | {resume.templateName}</small>
                </div>
                <div className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary" onClick={() => handleViewResume(resume.versionLabel)}>
                    View
                  </Button>
                  <Button size="sm" variant="outline-danger" onClick={() => handleDeleteResume(resume.versionLabel)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume Preview Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="xl"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>Resume Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResume ? (
            <div className="p-3 bg-white">
              <ResumeTemplateRenderer
                resumeData={selectedResume}
                templateName={selectedResume.templateName || "DefaultTemplate"}
                themeColor={selectedResume.themeColor || "#0057d9"}
                layoutConfig={Array.isArray(selectedResume.layoutConfig) ? selectedResume.layoutConfig : []}
              />
            </div>
          ) : (
            <p>Loading resume...</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminUserProfilePage;
