import React from "react";
import AdminNav from "../Components/AdminNav";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="h-screen flex">

      {/* Sidebar (20%) */}
      <AdminNav />

      {/* Main Content (80%) */}
      {/* <MainPart/> */}
      <Outlet />

    </div>
  );
};

export default AdminDashboard;