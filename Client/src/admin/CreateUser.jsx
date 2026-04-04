import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateUser = () => {
  let [input, setInput] = useState({
    name: "",
    email: "",
    post: "programmer",
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const posts = [
    { value: "programmer", label: "Programmer" },
    { value: "designer", label: "Designer" },
    { value: "analyst", label: "Analyst" },
    { value: "teamleader", label: "Team Leader" },
    { value: "projectmanager", label: "Project Manager" },
    { value: "databasedesigner", label: "Database Designer" },
  ];

  const handleSelect = (val) => {
    setInput((prev) => ({ ...prev, post: val }));
    setIsDropdownOpen(false);
  };

  let handleInput = (e) => {
    let { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let api = `${import.meta.env.VITE_API_URL}/admin/createuser`;
      let res = await axios.post(api, input);
      toast.success(res.data.msg || "New User Created successful ✅");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Creation failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center p-4 md:p-8 bg-[#EBEDE8] min-h-[calc(100vh-2rem)]">
      
      {/* 🌟 Main Card Container */}
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-6 md:p-14 border border-white relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2FB6C]/20 rounded-bl-full -z-0"></div>

        {/* 🏷️ Form Header */}
        <div className="relative z-10 mb-12 text-center">
            <span className="px-4 py-1.5 bg-gray-100 text-[#004838] rounded-full text-[10px] font-black tracking-widest uppercase mb-4 inline-block">
                User Management
            </span>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#004838] to-[#073127] bg-clip-text text-transparent">
                Enroll New User
            </h1>
            <p className="text-gray-400 mt-2 text-sm font-medium">Add a new teammate to the project ecosystem.</p>
        </div>

        {/* 📝 Form Section */}
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8 text-[#004838]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#004838]">
            {/* Name Input */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group text-[#004838]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#004838] transition-colors">👤</span>
                    <input
                        type="text"
                        name="name"
                        autoComplete="off"
                        onChange={handleInput}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#004838] focus:ring-0 outline-none transition-all font-medium text-gray-700"
                    />
                </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2 text-[#004838]">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#004838] transition-colors">📧</span>
                    <input
                        type="email"
                        name="email"
                        autoComplete="off"
                        onChange={handleInput}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#004838] focus:ring-0 outline-none transition-all font-medium text-gray-700"
                    />
                </div>
            </div>
          </div>

          {/* Post Selection (CUSTOM DROPDOWN) */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Job Designation</label>
            <div className="relative">
                {/* Trigger */}
                <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex items-center justify-between w-full pl-6 pr-6 py-4 bg-gray-50 border-2 rounded-2xl cursor-pointer transition-all ${isDropdownOpen ? 'border-[#004838] bg-white ring-4 ring-[#004838]/5' : 'border-transparent'}`}
                >
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">🛠️</span>
                        <span className="font-bold text-gray-700 capitalize">
                            {input.post || "Select Post"}
                        </span>
                    </div>
                    <span className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar">
                            {posts.map((post) => (
                                <div 
                                    key={post.value}
                                    onClick={() => handleSelect(post.value)}
                                    className={`px-6 py-3.5 mx-2 rounded-2xl flex items-center gap-3 cursor-pointer transition-all group ${input.post === post.value ? 'bg-[#004838] text-white shadow-lg shadow-[#004838]/20' : 'hover:bg-[#E2FB6C] hover:text-[#004838]'}`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${input.post === post.value ? 'bg-[#E2FB6C]' : 'bg-gray-300 group-hover:bg-[#004838]'}`}></span>
                                    <span className="font-bold text-sm">{post.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
          </div>

          {/* 🚀 Submit Button */}
          <div className="pt-6">
            <button 
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-[#004838] to-[#073127] text-white font-black text-lg rounded-[2rem] shadow-xl shadow-[#004838]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 tracking-widest uppercase"
            >
                Confirm Enrollment <span className="text-2xl opacity-80">➜</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateUser;