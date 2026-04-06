import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userType, setUserType] = useState("admin");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let api = `${import.meta.env.VITE_API_URL}/${userType}/login`;

      console.log("API:", api);

      let response = await axios.post(api, {
        email,
        password
      });

      console.log("Response:", response.data);

      if (userType === "admin") {
        localStorage.setItem("admin", response.data.admin?.email);
        toast.success("Admin Login Successful! 🔓");
        navigate("/admindashboard");
      } 
      
      else {
        const userData = response.data.user;
        localStorage.setItem("user", userData?.email);
        localStorage.setItem("userid", userData?.id || userData?._id); 
        localStorage.setItem("userData", JSON.stringify(userData));
        toast.success("User Login Successful! 👋");
        navigate("/userdashboard");
      }

    } catch (error) {
      console.log("ERROR:", error.response?.data);
      toast.error(error.response?.data?.msg || "Login Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEDE8] flex flex-col justify-between relative overflow-hidden">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#E2FB6C] rounded-full blur-[150px] opacity-20 -z-0 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#004838] rounded-full blur-[150px] opacity-10 -z-0"></div>

      {/* Login Section */}
      <div className="flex justify-center items-center grow px-4 relative z-10">

        <div className="bg-white/90 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.1)] p-8 md:p-14 rounded-[3rem] 
        w-full max-w-lg border border-white/50 space-y-10 scale-95 md:scale-100 transition-all">

          {/* Heading */}
          <div className="text-center">
            <span className="px-4 py-1.5 bg-gray-100 text-[#004838] rounded-full text-[10px] font-black tracking-[.3em] uppercase mb-4 inline-block shadow-sm">
              Secure Access
            </span>
            <h1 className="text-5xl font-black bg-gradient-to-br from-[#004838] via-[#073127] to-black bg-clip-text text-transparent tracking-tight">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2 font-medium">Please enter your credentials to continue.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div className="space-y-4">
              {/* Email */}
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-gray-400 group-focus-within:text-[#004838] transition-colors">📧</span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] 
                  focus:outline-none focus:bg-white focus:border-[#004838] transition-all font-bold text-gray-700 shadow-sm"
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>

              {/* Password */}
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-gray-400 group-focus-within:text-[#004838] transition-colors">🔑</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] 
                  focus:outline-none focus:bg-white focus:border-[#004838] transition-all font-bold text-gray-700 shadow-sm"
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* 🔥 Custom Selection (GREEN instead of BLUE) */}
            <div className="flex flex-col gap-2 relative">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[.30em] ml-1">Login Identity</label>
                <div 
                    onClick={() => setIsOpen(!isOpen)}
                    className={`relative flex items-center justify-between w-full pl-14 pr-6 py-5 bg-gray-50 border-2 rounded-[1.5rem] cursor-pointer transition-all ${isOpen ? 'border-[#E2FB6C] bg-white ring-4 ring-[#E2FB6C]/20' : 'border-transparent shadow-sm'}`}
                >
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg opacity-50">🛡️</span>
                    <span className="font-bold text-[#004838] uppercase tracking-wide">
                        {userType}
                    </span>
                    <span className={`text-[10px] transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#004838]' : 'text-gray-400'}`}>▼</span>
                </div>

                {/* Options List (NO BLUE HERE!) */}
                {isOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div 
                           onClick={() => { setUserType("admin"); setIsOpen(false); }}
                           className={`px-6 py-4 mx-2 mt-2 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${userType === 'admin' ? 'bg-[#004838] text-[#E2FB6C]' : 'hover:bg-[#EBEDE8] text-[#004838] font-bold'}`}
                        >
                           <span className="text-sm font-black uppercase tracking-widest">Admin</span>
                        </div>
                        <div 
                           onClick={() => { setUserType("user"); setIsOpen(false); }}
                           className={`px-6 py-4 mx-2 mb-2 rounded-2xl flex items-center gap-3 cursor-pointer transition-all ${userType === 'user' ? 'bg-[#004838] text-[#E2FB6C]' : 'hover:bg-[#EBEDE8] text-[#004838] font-bold'}`}
                        >
                           <span className="text-sm font-black uppercase tracking-widest">User</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#004838] to-[#073127] 
              text-white py-5 rounded-[1.5rem] font-black text-xl 
              shadow-2xl shadow-[#004838]/20 hover:scale-[1.03] active:scale-[0.97]
              transition-all duration-300 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              Login In <span className="opacity-50 text-2xl">→</span>
            </button>

          </form>

          {/* Footer text */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-400 font-medium">
              Manage your tasks efficiently 🚀
            </p>
            <div className="h-0.5 w-10 bg-[#E2FB6C]/50 mx-auto mt-4 rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;