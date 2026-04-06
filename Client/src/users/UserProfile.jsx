import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    post: ""
  });
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editInput, setEditInput] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleEditOpen = () => {
    setEditInput({ name: user.name, email: user.email, password: "" });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const userid = localStorage.getItem("userid");
      await axios.post(`${import.meta.env.VITE_API_URL}/user/update-profile`, {
        id: userid,
        ...editInput
      });
      const updatedUser = { ...user, ...editInput };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      localStorage.setItem("user", editInput.name);
      setUser(updatedUser);
      setIsEditOpen(false);
      toast.success("Profile updated successfully! ✅");
    } catch (error) {
      toast.error("Failed to update profile ❌");
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-12 h-1 bg-[#004838] rounded-full"></span>
                <span className="text-[10px] uppercase font-black text-[#004838] tracking-[.4em]">Personal Node</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                My <span className="bg-gradient-to-r from-[#004838] to-[#073127] bg-clip-text text-transparent italic">Identity</span>
            </h1>
        </div>
        <button 
           onClick={handleEditOpen}
           className="px-8 py-4 bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] text-[#004838] font-black rounded-2xl hover:shadow-xl hover:shadow-[#A8FF78]/40 transition-all transform hover:-translate-y-1 active:translate-y-0 text-xs uppercase tracking-widest shadow-lg"
        >
           Refactor Profile ⚙️
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-[3rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2FB6C]/10 rounded-bl-full -z-0"></div>
            
            <div className="relative z-10">
                <div className="w-40 h-40 bg-gradient-to-br from-[#004838] to-[#073127] rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-6xl text-[#E2FB6C] border-8 border-white shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{user.name || "User Name"}</h3>
                <p className="text-[#004838] font-black uppercase tracking-[.3em] text-[10px] mt-2 mb-8 opacity-60">{user.post || "Position"}</p>
                
                <div className="pt-8 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Role</p>
                    <p className="font-bold text-gray-700 text-sm italic">Operator</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-2xl">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Status</p>
                    <p className="font-bold text-green-500 text-sm uppercase">Active</p>
                </div>
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[3rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 h-full relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#004838]/5 rounded-tr-full -z-0"></div>
            
            <div className="relative z-10">
                <h4 className="text-2xl font-black text-gray-900 mb-12 flex items-center gap-4">
                <span className="p-3 bg-gray-50 rounded-2xl text-xl shadow-inner">📜</span>
                Manifest Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-2">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[.4em]">Official Name</p>
                    <p className="text-xl font-bold text-gray-800 pb-4 border-b-2 border-gray-50 group-hover:border-[#E2FB6C] transition-colors">{user.name || "N/A"}</p>
                </div>
                
                <div className="space-y-2">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[.4em]">Mail Endpoint</p>
                    <p className="text-xl font-bold text-gray-800 pb-4 border-b-2 border-gray-50 transition-colors">{user.email || "N/A"}</p>
                </div>

                <div className="space-y-2">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[.4em]">Designation</p>
                    <p className="text-xl font-bold text-gray-800 pb-4 border-b-2 border-gray-50 transition-colors">{user.post || "N/A"}</p>
                </div>

                <div className="space-y-2">
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-[.4em]">Department</p>
                    <p className="text-xl font-bold text-gray-800 pb-4 border-b-2 border-gray-50 transition-colors">Operational Core</p>
                </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsEditOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-md p-12 shadow-2xl relative z-[120] animate-in zoom-in-95 duration-500">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-[#004838] tracking-tighter">Update Node</h2>
                <button onClick={() => setIsEditOpen(false)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">✕</button>
             </div>
             
             <form onSubmit={handleEditSubmit} className="space-y-8">
                <div>
                   <label className="block ml-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Identity Name</label>
                   <input
                     type="text"
                     value={editInput.name}
                     onChange={(e) => setEditInput({ ...editInput, name: e.target.value })}
                     className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[#E2FB6C]/30 outline-none transition-all font-bold text-gray-700"
                   />
                </div>
                <div>
                   <label className="block ml-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Communication Mail</label>
                   <input
                     type="email"
                     value={editInput.email}
                     onChange={(e) => setEditInput({ ...editInput, email: e.target.value })}
                     className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[#E2FB6C]/30 outline-none transition-all font-bold text-gray-700"
                   />
                </div>
                <div>
                   <label className="block ml-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Security Phrase (Password)</label>
                   <input
                     type="password"
                     placeholder="Deploy new password..."
                     value={editInput.password}
                     onChange={(e) => setEditInput({ ...editInput, password: e.target.value })}
                     className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-[#E2FB6C]/30 outline-none transition-all font-bold text-gray-700 shadow-inner"
                   />
                </div>
                <button type="submit" className="w-full py-6 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] font-black rounded-2xl hover:shadow-2xl shadow-[#004838]/20 transition-all uppercase tracking-[.3em] text-[10px] mt-6 active:scale-95">
                   Confirm Refactor
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
