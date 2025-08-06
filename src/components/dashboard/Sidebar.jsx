// src/components/dashboard/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/auth/authSlice";
import { deleteUserAccount } from "../../services/userService";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import {
  FilePlus,
  FileText,
  Files,
  Gauge,
  LayoutTemplate,
  UserCircle,
  ArrowUpRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Lock,
  Trash2,
  Brain
} from "lucide-react";

import "../../assets/css/dashboard.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (!isAuthenticated || !user) return null;

  const authorityString = user.authority || "";
  const authorities = authorityString.split(" ");
  const userType = authorities.find((auth) =>
    ["FREE", "PREMIUM", "ADMIN"].includes(auth)
  );

  const isFreeUser = userType === "FREE";
  const isPremiumUser = userType === "PREMIUM";
  const isAdminUser = userType === "ADMIN";

  const renderLabel = (label) =>
    isOpen ? <span className="sidebar-label">{label}</span> : null;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      toast.success("Your account has been deleted successfully");
      setShowDeleteModal(false);
      setTimeout(() => {
        dispatch(logoutUser());
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth <= 599) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <>

      <div
        className={`sidebar-wrapper ${isOpen ? "expanded" : "collapsed"} ${isMobileMenuOpen ? "mobile-open" : ""
          }`}
      >
        <div className="sidebar-header">
          <span className="sidebar-logo">{isOpen && "Dashboard"}</span>
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="sidebar-scroll-area">
          <nav className="sidebar-nav-links">
            {!isAdminUser && (
              <>
                <NavLink
                  to="/dashboard/create"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FilePlus size={20} /> {renderLabel("New Resume")}
                </NavLink>

                <NavLink
                  to="/dashboard/view-latest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sidebar-icon-wrapper">
                    <FileText size={20} strokeWidth={1.8} />
                  </span>
                  {renderLabel("Latest Version")}
                </NavLink>

                {isPremiumUser && (
                  <NavLink
                    to="/dashboard/view-all"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Files size={20} /> {renderLabel("All Versions")}
                  </NavLink>
                )}

                {isPremiumUser && (
                  <NavLink
                    to="/dashboard/match-jd"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Brain size={20} /> {renderLabel("Job Match")}
                  </NavLink>
                )}
              </>
            )}


            {isAdminUser && (
              <>
                <NavLink
                  to="/dashboard/admin"
                  end
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Gauge size={20} /> {renderLabel("Dashboard")}
                </NavLink>


                <NavLink
                  to="/dashboard/admin/users"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`sidebar-nav-link ${location.pathname.startsWith("/dashboard/admin/user") ? "active" : ""}`}
                >
                  <UserCircle size={20} /> {renderLabel("Users")}
                </NavLink>


                <NavLink
                  to="/dashboard/admin/contacts"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 20 }} />
                  {renderLabel("Contact Messages")}
                </NavLink>


                {/* <NavLink
                  to="/dashboard/admin/resumes"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Files size={20} /> {renderLabel("Resumes")}
                </NavLink> */}
              </>
            )}

            {!isAdminUser && (
              <NavLink
                to="/dashboard/templates"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LayoutTemplate size={20} /> {renderLabel("Templates")}
              </NavLink>
            )}

          </nav>

          <div
            className="sidebar-bottom-section"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <NavLink to="/dashboard/profile">
              <UserCircle size={20} /> {renderLabel("Profile")}
            </NavLink>

            {!isAdminUser && isFreeUser && (
              <NavLink
                to="/dashboard/upgrade"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ArrowUpRight size={20} /> {renderLabel("Upgrade")}
              </NavLink>
            )}

            {!isAdminUser && isPremiumUser && (
              <div
                className="sidebar-nav-link-like"
                onClick={() => setShowDeleteModal(true)}
                style={{ cursor: "pointer" }}
              >
                <Trash2 size={20} /> {renderLabel("Delete Account")}
              </div>
            )}

            {!isAdminUser && (
              <NavLink
                to="/dashboard/change-password"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Lock size={20} /> {renderLabel("Change Password")}
              </NavLink>
            )}


            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={20} /> {renderLabel("Logout")}
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h5>Confirm Deletion</h5>
            <p>
              Are you sure you want to delete your account? This action is
              irreversible.
            </p>
            <div className="modal-actions mt-3 d-flex justify-content-between">
              <button className="btn btn-danger" onClick={handleDeleteAccount}>
                Yes, Delete
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
