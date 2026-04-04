import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/adminuserdisplay`);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#EBEDE8]">
        <div className="animate-bounce text-4xl">👥</div>
      </div>
    );
  }

  return (
    <div className="p-8 md:p-12 space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* 👑 Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-12 h-1 bg-[#004838] rounded-full"></span>
                <span className="text-[10px] uppercase font-black text-[#004838] tracking-[.4em]">Directory Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Staff <span className="bg-gradient-to-r from-[#004838] to-[#073127] bg-clip-text text-transparent">Profiles</span>
            </h1>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Nodes:</span>
             <span className="text-xl font-black text-[#004838]">{users.length}</span>
        </div>
      </div>

      {/* 👥 Users Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {users.map((user, index) => (
          <div 
            key={index} 
            className="group bg-white p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-50 hover:border-[#E2FB6C] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden relative"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E2FB6C]/10 rounded-bl-full translate-x-12 -translate-y-12 group-hover:translate-x-0 group-hover:-translate-y-0 transition-transform duration-700"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Profile Photo (Dummy) */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                    alt="profile" 
                    className="w-full h-full object-cover bg-gray-100"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#004838] border-4 border-white rounded-xl flex items-center justify-center text-[10px] text-[#E2FB6C]">
                    ✓
                </div>
              </div>

              {/* User Info */}
              <h3 className="text-xl font-black text-gray-800 tracking-tight group-hover:text-[#004838] transition-colors">
                {user.name}
              </h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[.2em] mb-4">
                Node ID: #{user._id.slice(-6).toUpperCase()}
              </p>

              {/* Job Badge */}
              <div className="px-5 py-2 bg-gray-50 rounded-2xl group-hover:bg-[#004838] transition-all duration-500">
                <p className="text-xs font-bold text-gray-400 group-hover:text-white uppercase tracking-widest">
                  {user.post || "Team Member"}
                </p>
              </div>

              {/* Contact Meta */}
              <div className="mt-8 pt-6 border-t border-gray-50 w-full">
                 <p className="text-[11px] font-medium text-gray-400 hover:text-[#004838] transition-colors cursor-pointer truncate px-2">
                    {user.email}
                 </p>
              </div>
            </div>

            {/* Hover Footer Action */}
            <div className="absolute bottom-[-100%] group-hover:bottom-0 left-0 w-full p-4 transition-all duration-500">
                <button className="w-full py-3 bg-[#E2FB6C] text-[#004838] font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg">
                    Full Profile Analytics
                </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="py-20 text-center">
            <p className="text-gray-400 font-bold uppercase tracking-widest">No profiles synchronized.</p>
        </div>
      )}

    </div>
  );
};

export default DisplayUsers;
