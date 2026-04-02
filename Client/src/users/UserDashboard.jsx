import React from "react";
import { Link, Outlet } from "react-router-dom";

const UserDashboard = () => {
  return (
    <div className="flex">

      {/* Sidebar */}
      <div className="w-64 h-screen bg-amber-200 p-5">
        <h1 className="text-xl font-bold mb-4">User Dashboard</h1>
              
        {/* ✅ Correct Link */}
        <Link to="usertask" className="block bg-black text-white p-2 rounded">
          User Task
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <Outlet />
      </div>

    </div>
  );
};

export default UserDashboard;