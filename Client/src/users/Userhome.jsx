import React, { useEffect, useState } from "react";
import axios from "axios";

const UserHome = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ total: 0, completed: 0, inProgress: 0, pending: 0 });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editInput, setEditInput] = useState({ name: "", email: "", password: "" });
  
  const user = JSON.parse(localStorage.getItem("userData")) || { name: localStorage.getItem("user") || "User", email: "", id: localStorage.getItem("userid") };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchStats();
    return () => clearInterval(timer);
  }, []);

  const fetchStats = async () => {
    try {
      const userid = localStorage.getItem("userid");
      if (!userid) return;

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/getuserstats?id=${userid}`);
      setStats(response.data.stats);
      setRecentTasks(response.data.recentTasks);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    setEditInput({ name: user.name, email: user.email, password: user.password || "" });
    setIsEditProfileOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
        const userid = localStorage.getItem("userid");
        await axios.post(`${import.meta.env.VITE_API_URL}/user/update-profile`, {
            id: userid,
            ...editInput
        });
        localStorage.setItem("userData", JSON.stringify({ ...user, ...editInput }));
        localStorage.setItem("user", editInput.name);
        setIsEditProfileOpen(false);
        // Toast notification would be nice, but I don't have it imported here.
        // Assuming user will see changes on next reload or state update.
        window.location.reload(); 
    } catch (error) {
        console.error("Error updating profile:", error);
    }
  };

  const greetings = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 🚀 Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#004838] to-[#073127] rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl border border-white/10">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase border border-white/10 text-[#E2FB6C]">
              User Dashboard
            </span>
            <span className="w-2 h-2 rounded-full bg-[#E2FB6C] animate-pulse"></span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            {greetings()}, <br />
            <span className="bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] bg-clip-text text-transparent">
              {user.name?.split(' ')[0]}
            </span>
          </h1>
          
          <p className="text-gray-300 max-w-xl text-lg font-medium leading-relaxed">
            Welcome back to your workspace. You have <span className="text-[#E2FB6C] font-black">{stats.pending + stats.inProgress} tasks</span> waiting for your attention today.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <button 
                onClick={handleEditProfile}
                className="bg-[#E2FB6C] text-[#004838] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl hover:shadow-[#E2FB6C]/20 transition-all active:scale-95"
            >
                Edit Profile ⚙️
            </button>
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/5">
              <span className="text-2xl">🕒</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Current Time</p>
                <p className="font-mono text-sm">{currentTime.toLocaleTimeString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-black/20 backdrop-blur-xl px-5 py-3 rounded-2xl border border-white/5">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Date</p>
                <p className="font-mono text-sm">{currentTime.toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#E2FB6C] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-[#A8FF78] rounded-full blur-[150px] opacity-10"></div>
      </div>

      {/* 📊 Status Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            📋
          </div>
          <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Tasks</h3>
          <p className="text-3xl font-black text-gray-800">{stats.total}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            ✅
          </div>
          <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Completed</h3>
          <p className="text-3xl font-black text-gray-800">{stats.completed}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            ⏳
          </div>
          <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">In Progress</h3>
          <p className="text-3xl font-black text-gray-800">{stats.inProgress}</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-xl mb-4 group-hover:scale-110 transition-transform">
            🔴
          </div>
          <h3 className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Pending</h3>
          <p className="text-3xl font-black text-gray-800">{stats.pending}</p>
        </div>

      </div>

      {/* ⚡ Recent Activity & News Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Tasks */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-[#004838]">Recent Activity</h3>
              <button className="text-xs font-bold text-[#A8FF78] bg-[#004838] px-4 py-2 rounded-full hover:bg-[#073127] transition-colors">
                View All
              </button>
           </div>
           
           <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 hover:bg-[#EBEDE8]/50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      task.status === 'Completed' ? 'bg-green-100' : 
                      task.status === 'In Progress' ? 'bg-amber-100' : 'bg-gray-100'
                    }`}>
                      {task.status === 'Completed' ? '✅' : task.status === 'In Progress' ? '⏳' : '📋'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800 text-sm line-clamp-1">{task.task}</p>
                        <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                          task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                          task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {task.priority || 'Medium'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Status</p>
                      <p className="text-[10px] font-black text-gray-600">{task.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                   <p className="text-gray-400 font-medium">No recent activity yet.</p>
                </div>
              )}
           </div>
        </div>

        {/* Motivational Card */}
        <div className="bg-gradient-to-br from-[#E2FB6C] to-[#A8FF78] rounded-[2.5rem] p-8 shadow-lg flex flex-col justify-between relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-2xl font-black text-[#004838] mb-4">Start your streak! 🚀</h3>
              <p className="text-[#004838]/80 font-bold leading-relaxed mb-6">
                Completing tasks on time increases your performance score and helps the team move faster. Focus on your pending tasks today!
              </p>
              <div className="bg-white/30 backdrop-blur-md p-4 rounded-2xl border border-white/20 inline-block">
                <p className="text-[#004838] font-black text-xs uppercase tracking-widest mb-1">Tip of the day</p>
                <p className="text-[#004838] text-sm italic font-medium">"Small progress is still progress. Keep going!"</p>
              </div>
           </div>
           
           {/* Decorative Element */}
           <div className="absolute bottom-[-20px] right-[-20px] text-[150px] opacity-10 rotate-12 select-none">
              🔥
           </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsEditProfileOpen(false)}></div>
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 shadow-2xl relative z-[120] animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-[#004838]">Update Profile</h2>
                <button onClick={() => setIsEditProfileOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
             </div>
             
             <form onSubmit={handleEditSubmit} className="space-y-6">
                <div>
                   <label className="block ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                   <input
                     type="text"
                     value={editInput.name}
                     onChange={(e) => setEditInput({ ...editInput, name: e.target.value })}
                     className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#E2FB6C] outline-none transition-all font-bold text-gray-700"
                   />
                </div>
                <div>
                   <label className="block ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                   <input
                     type="email"
                     value={editInput.email}
                     onChange={(e) => setEditInput({ ...editInput, email: e.target.value })}
                     className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#E2FB6C] outline-none transition-all font-bold text-gray-700"
                   />
                </div>
                <div>
                   <label className="block ml-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Change Password</label>
                   <input
                     type="password"
                     placeholder="New password..."
                     value={editInput.password}
                     onChange={(e) => setEditInput({ ...editInput, password: e.target.value })}
                     className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#E2FB6C] outline-none transition-all font-bold text-gray-700"
                   />
                </div>
                <button type="submit" className="w-full py-5 bg-[#004838] text-[#E2FB6C] font-black rounded-2xl hover:shadow-xl transition-all uppercase tracking-widest text-xs mt-4">
                   Save Changes
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserHome;