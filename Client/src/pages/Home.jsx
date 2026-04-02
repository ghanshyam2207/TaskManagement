import React, { useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 default value set kiya (IMPORTANT)
  const [userType, setUserType] = useState("admin");

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

      // 🔥 admin login
      if (userType === "admin") {
        localStorage.setItem("admin", response.data.admin?.email);
        navigate("/admindashboard");
      } 
      
      // 🔥 user login
      else {
        localStorage.setItem("user", response.data.user?.email);
        navigate("/userdashboard");
      }

    } catch (error) {
      console.log("ERROR:", error.response?.data);
      alert(error.response?.data?.msg || "Login Failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-[#EBEDE8] flex flex-col justify-between">

      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Login Section */}
      <div className="flex justify-center items-center grow px-4">

        <div className="bg-white/80 backdrop-blur-lg shadow-2xl p-10 rounded-2xl 
        w-full max-w-md border border-[#333F3C]">

          {/* Heading */}
          <h1 className="text-3xl font-extrabold text-center mb-6 
          bg-linear-to-r from-[#004838] to-[#073127] 
          bg-clip-text text-transparent">
            Welcome Back
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email */}
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#004838]"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Enter your password"
              className="p-3 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-[#004838]"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* 🔥 User Type Select */}
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            {/* Button */}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] 
              text-[#004838] py-3 rounded-lg font-semibold 
              hover:from-[#004838] hover:to-[#073127] hover:text-white 
              transition duration-300"
            >
              Login
            </button>

          </form>

          {/* Footer text */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Manage your tasks efficiently 🚀
          </p>

        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}
    </div>
  );
};

export default Home;