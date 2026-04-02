import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateUser = () => {
 
  let [input, setInput] = useState({
    name: "",
    email: "",
    post: "",
  });

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
      console.log(res.data);

      toast.success("New User Created successful ✅");
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed ❌");
    }
  };

  return (
    <div className="flex items-center justify-center p-6 bg-[#EBEDE8] w-full">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <h1 className="text-3xl text-center font-extrabold bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] bg-clip-text text-transparent tracking-wider">
          Create User Form
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              type="name"
              name="name"
              onChange={handleInput}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              onChange={handleInput}
              placeholder="Enter your email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-600 ml-1">
              Assign Post
            </label>
            <select
              name="post"
              onChange={handleInput}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="programmer">Programmer</option>
              <option value="designer">Designer</option>
              <option value="analyst">Analyst</option>
              <option value="teamleader">Team Leader</option>
              <option value="projectmanager">Project Manager</option>
              <option value="databasedesigner">Database Designer</option>
            </select>
          </div>

            <button className="bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] 
              text-[#004838] py-3 rounded-lg font-semibold 
              hover:from-[#004838] hover:to-[#073127] hover:text-white 
              transition duration-300 shadow-md transform hover:scale-105" type="submit">
              Submit
            </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;