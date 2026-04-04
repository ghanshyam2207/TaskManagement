import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserDashboard = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userid");
    localStorage.removeItem("userData");
    toast.info("Logged Out Successfully. Bye! 👋");
    setTimeout(() => {
        navigate("/");
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#EBEDE8] overflow-hidden">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* 🔥 Mobile Top Bar */}
      <div className="md:hidden w-full px-6 py-4 bg-[#004838] text-white flex justify-between items-center shadow-xl relative z-40">
        <h1 className="text-xl font-black bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] bg-clip-text text-transparent italic">USER PANEL</h1>
        <button 
          onClick={() => setOpen(true)} 
          className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-xl text-xl active:scale-90 transition-transform"
        >
          ☰
        </button>
      </div>

      {/* 🔥 Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-[#004838] to-[#073127] text-white p-6 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static ${open ? "translate-x-0" : "-translate-x-full"} flex flex-col justify-between`}>
        
        <div>
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div className="text-center w-full">
              <h1 className="text-2xl font-black bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] bg-clip-text text-transparent">
                USER PANEL
              </h1>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Dashboard</p>
            </div>
            <button onClick={() => setOpen(false)} className="md:hidden text-white/50 hover:text-white">✕</button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link 
              to="" 
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
            >
              <span className="text-xl">🏠</span>
              <span className="font-semibold text-sm">Dashboard</span>
            </Link>

            <Link 
              to="usertask" 
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
            >
              <span className="text-xl">📋</span>
              <span className="font-semibold text-sm">My Tasks</span>
            </Link>

            <Link 
              to="profile" 
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5"
            >
              <span className="text-xl">👤</span>
              <span className="font-semibold text-sm">My Profile</span>
            </Link>
          </nav>
        </div>

        {/* Global Footer / Logout */}
        <div className="pt-6 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 
            text-white font-bold py-4 rounded-3xl shadow-lg shadow-red-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#E2FB6C]/5 rounded-full blur-[100px] -z-0 pointer-events-none"></div>
          <div className="relative z-10 max-w-6xl mx-auto">
            <Outlet />
          </div>
      </div>

    </div>
  );
};

export default UserDashboard;