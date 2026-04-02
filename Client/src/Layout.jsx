import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EBEDE8]">

    
      <Navbar />

      
      <main className="grow p-4">
        <Outlet />
      </main>

   
      <Footer />

    </div>
  );
};

export default Layout;