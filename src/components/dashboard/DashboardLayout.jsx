import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import "../../assets/css/dashboard.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";
import { fetchUserProfile } from "../../redux/slices/profileSlice";

const DashboardLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return (
    <div className="dashboard-layout-container">
      <Sidebar />
      <main className="dashboard-main-content">
        <ToastContainer position="top-right" autoClose={3000} />
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
