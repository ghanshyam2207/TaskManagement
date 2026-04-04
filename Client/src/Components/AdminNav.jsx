import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const AdminNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminEmail = localStorage.getItem("admin") || "Admin";

  const logout = () => {
    localStorage.removeItem("admin");
    toast.info("Logged out successfully! 👋");
    setTimeout(() => {
        navigate("/");
    }, 1000);
  };

  const menuItems = [
    { name: "Dashboard", path: "/admindashboard/mainpart", icon: "📊" },
    { name: "Assign Tasks", path: "/admindashboard/assigntask", icon: "📝" },
    { name: "Create User", path: "/admindashboard/createuser", icon: "➕" },
    { name: "Staff Profiles", path: "/admindashboard/displayusers", icon: "👥" },
  ];

  return (
    <>
      {/* 🔥 Mobile Top Bar */}
      <div className="md:hidden w-full px-6 py-4 bg-[#004838] text-white flex justify-between items-center shadow-xl relative z-40">
        <h2 className="text-xl font-black bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] bg-clip-text text-transparent italic">ADMIN.</h2>
        <button 
          onClick={() => setOpen(true)} 
          className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-2xl text-2xl active:scale-90 transition-transform"
        >
          ☰
        </button>
      </div>

      {/* 🔥 Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* 🔥 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] 
        bg-gradient-to-b from-[#004838] via-[#073127] to-[#041a15] text-white 
        p-8 shadow-[10px_0_40px_rgba(0,0,0,0.2)] z-[100] transform transition-all duration-500 ease-in-out
        border-r border-white/5
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:w-[280px] flex flex-col justify-between`}
      >
        <div>
            {/* Header / Logo Section */}
            <div className="flex items-center justify-between mb-12">
                <div className="flex flex-col">
                    <h2 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] bg-clip-text text-transparent">
                        ADMIN.
                    </h2>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[.4em] ml-1">Control Console</span>
                </div>
                <button onClick={() => setOpen(false)} className="md:hidden w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-xs">
                    ✖
                </button>
            </div>

            {/* Admin Profile Preview */}
            <div className="p-5 bg-white/5 border border-white/10 rounded-[2rem] mb-10 group overflow-hidden relative">
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-tr from-[#E2FB6C] to-[#A8FF78] rounded-2xl flex items-center justify-center text-[#004838] font-black text-xl shadow-lg shadow-[#E2FB6C]/10 border-2 border-white/20 group-hover:scale-110 transition-transform duration-500">
                        {adminEmail[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <p className="text-[10px] font-black text-[#E2FB6C] uppercase tracking-widest">Active Admin</p>
                        <p className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">{adminEmail.split('@')[0]}</p>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full -z-0 translate-x-4 -translate-y-4"></div>
            </div>

            {/* Menu */}
            <nav className="space-y-3">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 relative group
                            ${isActive 
                                ? "bg-[#E2FB6C] text-[#004838] font-black shadow-xl shadow-[#E2FB6C]/10" 
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-sm uppercase tracking-widest font-bold">{item.name}</span>
                            {isActive && (
                                <span className="absolute right-6 w-1.5 h-1.5 bg-[#004838] rounded-full animate-pulse"></span>
                            )}
                            <div className={`absolute left-0 w-1 h-0 bg-[#004838] rounded-full transition-all duration-300 ${isActive ? 'h-5' : 'group-hover:h-3'}`}></div>
                        </Link>
                    );
                })}
            </nav>
        </div>

        {/* Global Footer / Logout */}
        <div className="pt-8 border-t border-white/5">
            <button 
                onClick={logout} 
                className="w-full relative overflow-hidden group px-6 py-4 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-red-500 rounded-2xl transition-all duration-500 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <span className="text-xl group-hover:rotate-12 transition-transform">🚪</span>
                    <span className="text-[10px] font-black uppercase tracking-[.25em]">Terminate Session</span>
                </div>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <p className="text-center text-[9px] text-gray-500 font-bold uppercase tracking-[.5em] mt-6 opacity-30">
                v2.4.0 • Enterprise
            </p>
        </div>
      </div>
    </>
  );
};

export default AdminNav;
