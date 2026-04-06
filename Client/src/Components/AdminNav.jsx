import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Moon, Sun, Bell } from "lucide-react";

const AdminNav = () => {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/getnotifications?userId=admin`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markRead = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/mark-read-notifications`, { userId: "admin" });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking read:", error);
        }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
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
    { name: "Ops Overview", path: "/admindashboard/managetasks", icon: "🌐" },
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
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <button 
                            onClick={markRead}
                            className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-xs hover:bg-[#E2FB6C]/20 transition-all border border-white/5 relative group"
                        >
                            <Bell size={14} className={unreadCount > 0 ? "animate-swing" : ""} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#004838]"></span>
                            )}
                        </button>
                        
                        {showNotifications && (
                            <div className="absolute left-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-[110] animate-in slide-in-from-top-2 duration-300">
                                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <span className="text-[9px] font-black uppercase text-[#004838]">Operational Alerts</span>
                                    <span className="text-[8px] font-bold text-gray-400">{notifications.length} Total</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                    {notifications.length > 0 ? (
                                        notifications.map((n, i) => (
                                            <div key={i} className={`p-4 border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-[#E2FB6C]/5' : ''}`}>
                                                <p className="text-[10px] font-bold text-gray-700 leading-tight mb-1">{n.message}</p>
                                                <p className="text-[8px] font-black text-gray-400 uppercase">{new Date(n.createdAt).toLocaleTimeString()}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center opacity-30">
                                            <Bell size={20} className="mx-auto mb-2" />
                                            <p className="text-[8px] font-black uppercase">No New Signals</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-xs hover:bg-white/10 transition-all border border-white/5"
                    >
                        {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
                    </button>
                    <button onClick={() => setOpen(false)} className="md:hidden w-8 h-8 flex items-center justify-center bg-white/5 rounded-lg text-xs">
                        ✖
                    </button>
                </div>
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
