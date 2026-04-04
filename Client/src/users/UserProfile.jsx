import React, { useEffect, useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    post: ""
  });

  useEffect(() => {
    // Try to get user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    const email = localStorage.getItem("user");
    
    if (storedUser) {
      setUser(storedUser);
    } else if (email) {
      // Fallback if full object isn't there yet
      setUser(prev => ({ ...prev, email }));
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Profile Header */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold tracking-tight text-[#004838] mb-2">
          My Profile
        </h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] rounded-full mx-auto md:mx-0"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-white text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-[#004838] to-[#073127] rounded-full mx-auto mb-6 flex items-center justify-center text-5xl text-[#E2FB6C] border-4 border-[#EBEDE8] shadow-inner">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <h3 className="text-2xl font-black text-gray-800">{user.name || "User Name"}</h3>
            <p className="text-[#004838] font-bold uppercase tracking-widest text-xs mt-1">{user.post || "Position"}</p>
            
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Role</p>
                <p className="font-bold text-gray-700">Employee</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400 font-bold uppercase">Status</p>
                <p className="font-bold text-green-500">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-white">
            <h4 className="text-xl font-black text-[#004838] mb-8 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#E2FB6C] rounded-lg flex items-center justify-center text-sm">👤</span>
              Personal Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Full Name</p>
                <p className="text-lg font-bold text-gray-800 border-b-2 border-gray-50 pb-2">{user.name || "N/A"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Address</p>
                <p className="text-lg font-bold text-gray-800 border-b-2 border-gray-50 pb-2">{user.email || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Designation</p>
                <p className="text-lg font-bold text-gray-800 border-b-2 border-gray-50 pb-2">{user.post || "N/A"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Department</p>
                <p className="text-lg font-bold text-gray-800 border-b-2 border-gray-50 pb-2">Operations</p>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#EBEDE8]/50 rounded-3xl border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">
                💡
              </div>
              <div>
                <p className="text-sm font-bold text-[#004838]">Need to update your info?</p>
                <p className="text-xs text-gray-500">Please contact your administrator to change your profile details.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
