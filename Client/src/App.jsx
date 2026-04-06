import React from "react";
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from "./pages/Home";
import Layout from "./Layout";
import AdminDashboard from "./admin/AdminDashboard";
import CreateUser from "./admin/CreateUser";
import MainPart from "./admin/MainPart";
import AssignTask from "./admin/AssignTask";
import DisplayUsers from "./admin/DisplayUsers";
import UserDashboard from "./users/UserDashboard";
import UserTask from "./users/UserTask";
import UserHome from "./users/Userhome";
import UserProfile from "./users/UserProfile";
import ManageTasks from "./admin/ManageTasks";


const App = ()=>{
  return(
    <>
        <BrowserRouter>
          <Routes>
            {/* User Facing Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="home" element={<Home />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="/admindashboard" element={<AdminDashboard />}>
              <Route index element={<MainPart />} />
              <Route path="mainpart" element={<MainPart />} />
              <Route path="createuser" element={<CreateUser />} />
              <Route path="assigntask" element={<AssignTask />} />
              <Route path="displayusers" element={<DisplayUsers />} />
              <Route path="managetasks" element={<ManageTasks />} />
            </Route>

            {/* User Dashboard Routes */}
            <Route path="/userdashboard" element={<UserDashboard />}>
              <Route index element={<UserHome />} />
              <Route path="usertask" element={<UserTask />} />
              <Route path="profile" element={<UserProfile />} />
            </Route>
          </Routes>
        </BrowserRouter>
    </>
  )
}

export default App;