import React from "react";
import AdminNav from "../Components/AdminNav";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#EBEDE8] overflow-hidden">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar (20%) */}
      <AdminNav />

      {/* Main Content (80%) */}
      <main className="flex-1 overflow-y-auto custom-scrollbar relative">
         {/* Subtle Background Glows */}
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E2FB6C]/5 rounded-full blur-[120px] -z-0 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#004838]/5 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
         
         <div className="relative z-10 w-full max-w-[1600px] mx-auto">
            <Outlet />
         </div>
      </main>

    </div>
  );
};

export default AdminDashboard;