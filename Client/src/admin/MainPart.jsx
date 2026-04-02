import React from "react";

const MainPart = () => {
  return (
    <div className="w-full md:w-4/5 bg-[#EBEDE8] p-4 md:p-6">

      {/* Heading */}
      <div className="mb-8 md:mb-10 text-center">
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide leading-tight">
          
          <span className="bg-gradient-to-r from-[#004838] to-[#073127] 
          bg-clip-text text-transparent">
            Task Management
          </span>

          <br />

          <span className="bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] 
          bg-clip-text text-transparent drop-shadow-md">
            Dashboard
          </span>

        </h1>

        {/* underline */}
        <div className="w-24 md:w-40 h-1 mx-auto mt-3 md:mt-4 rounded-full 
        bg-gradient-to-r from-[#E2FB6C] via-[#A8FF78] to-[#004838] shadow-md"></div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md 
        hover:shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#004838]">Total Tasks</h2>
          <p className="text-xl md:text-2xl font-bold mt-2">120</p>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md 
        hover:shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#004838]">Completed</h2>
          <p className="text-xl md:text-2xl font-bold mt-2 text-green-600">80</p>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md 
        hover:shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#004838]">Pending</h2>
          <p className="text-xl md:text-2xl font-bold mt-2 text-red-500">40</p>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md 
        hover:shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#004838]">Users</h2>
          <p className="text-xl md:text-2xl font-bold mt-2">25</p>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md 
        hover:shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#004838]">In Progress</h2>
          <p className="text-xl md:text-2xl font-bold mt-2 text-yellow-500">15</p>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl shadow-md 
        hover:shadow-xl hover:scale-105 transition duration-300">
          <h2 className="text-base md:text-lg font-semibold text-[#004838]">Overdue</h2>
          <p className="text-xl md:text-2xl font-bold mt-2 text-red-600">5</p>
        </div>

      </div>

    </div>
  );
};

export default MainPart;