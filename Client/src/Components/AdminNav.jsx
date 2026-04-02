import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔥 Mobile Top Bar */}
      <div className="md:hidden  px-4 py-3 bg-[#004838] text-white shadow-md">
        <h2 className="text-lg font-semibold hidden md:flex">Admin Panel</h2>
        <button 
          onClick={() => setOpen(true)} 
          className="text-2xl to-0%"
        >
          ☰
        </button>
      </div>

      {/* 🔥 Overlay (click outside close) */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* 🔥 Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 
        bg-gradient-to-b from-[#004838] to-[#073127] text-white 
        p-6 shadow-2xl z-50 transform transition-transform duration-300
        
        ${open ? "translate-x-0" : "-translate-x-full"} 
        
        md:translate-x-0 md:static md:w-1/5`}
      >
        
        {/* ❌ Close button (mobile) */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setOpen(false)}>❌</button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-10 text-center 
        bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] 
        bg-clip-text text-transparent">
          Admin Panel
        </h2>

        {/* Menu */}
        <ul className="space-y-4 text-sm font-medium">

          <li>
            <Link to="/admindashboard/mainpart" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10">
              📊 Dashboard
            </Link>
          </li>

          <li>
            <Link to="/admindashboard/assigntask" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10">
              📝 Assign Tasks
            </Link>
          </li>

          <li>
            <Link to="/admindashboard/createuser" 
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10">
              ➕ Create User
            </Link>
          </li>

          <li className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
            👥 Users
          </li>

          <li className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/10 cursor-pointer">
            ⚙️ Settings
          </li>

        </ul>
      </div>
    </>
  );
};

export default AdminNav;