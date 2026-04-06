import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const userId = localStorage.getItem("userid");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/getnotifications?userId=${userId}`);
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const markRead = async () => {
    if (!userId) return;
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/user/mark-read-notifications`, { userId });
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="w-full flex justify-between items-center px-10 py-5 bg-[#004838] shadow-2xl border-b border-white/5 relative z-[100]">
      
      <h1 className="text-3xl font-black bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] bg-clip-text text-transparent italic tracking-tighter">
        TASKMASTER.
      </h1>

      <div className="flex items-center gap-4">
        <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/10 text-white"
        >
            {isDarkMode ? "☀️" : "🌙"}
        </button>

        {userId && (
        <div className="relative">
            <button 
                onClick={markRead}
                className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#E2FB6C]/20 transition-all border border-white/10 relative group"
            >
                <Bell size={20} className="text-white group-hover:rotate-12 transition-transform" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#004838] animate-bounce">
                        {unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                    <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="font-black text-[#004838] text-sm uppercase tracking-widest">Notifications</h3>
                        <span className="text-[10px] font-bold text-gray-400">{notifications.length} Recent</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            notifications.map((n, i) => (
                                <div key={i} className={`p-5 border-b border-gray-50 last:border-none transition-colors ${!n.isRead ? 'bg-[#E2FB6C]/5' : ''}`}>
                                    <p className="text-xs font-bold text-gray-700 leading-relaxed mb-1">{n.message}</p>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 text-center">
                                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">All Clear! 🚀</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Navbar;