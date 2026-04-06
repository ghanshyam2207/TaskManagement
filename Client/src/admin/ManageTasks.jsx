import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { 
  CheckCircle, Clock, AlertTriangle, MessageSquare, Search, Filter, 
  Trash2, ArrowUpRight, TrendingUp, Calendar
} from "lucide-react";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const adminName = localStorage.getItem("admin") || "Admin";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/all-tasks-report`);
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openComments = async (tid) => {
    setSelectedTaskId(tid);
    setIsCommentModalOpen(true);
    fetchComments(tid);
  };

  const fetchComments = async (tid) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/getcomments?taskId=${tid}`);
      setComments(res.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!commentInput) return;
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/addcomment`, {
            taskId: selectedTaskId,
            senderName: adminName,
            message: commentInput
        });
        setCommentInput("");
        fetchComments(selectedTaskId);
    } catch (error) {
        toast.error("Failed to post message");
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = t.task.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 md:p-12 space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-12 h-1 bg-[#004838] rounded-full"></span>
                <span className="text-[10px] uppercase font-black text-[#004838] tracking-[.4em]">Operations Management</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Global <span className="bg-gradient-to-r from-[#004838] to-[#073127] bg-clip-text text-transparent">Task Registry</span>
            </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-4 bg-white p-2 px-6 rounded-2xl border border-gray-100 shadow-sm max-w-md">
           <Search size={18} className="text-gray-300" />
           <input 
             type="text" 
             placeholder="Search tasks or staff..." 
             className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-gray-700 py-2"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <select 
            className="px-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#004838] outline-none shadow-sm cursor-pointer hover:border-[#E2FB6C] transition-all"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
        >
            <option value="All">All Protocols</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Task List Table */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-[.25em]">
                <th className="px-8 py-6 text-left">#</th>
                <th className="px-8 py-6 text-left">Staff Member</th>
                <th className="px-8 py-6 text-left">Operation Task</th>
                <th className="px-8 py-6 text-left">Priority</th>
                <th className="px-8 py-6 text-left">Deadline</th>
                <th className="px-8 py-6 text-center">Status</th>
                <th className="px-8 py-6 text-center">Comm.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTasks.map((t, i) => (
                <tr key={i} className="group hover:bg-[#E2FB6C]/10 transition-all duration-300 transform">
                  <td className="px-8 py-6 text-gray-300 font-mono text-xs">{String(i+1).padStart(2,'0')}</td>
                  <td className="px-8 py-6 font-black text-gray-800 text-sm tracking-tight">{t.userId?.name || "Unassigned"}</td>
                  <td className="px-8 py-6 text-sm font-medium text-gray-500 line-clamp-1 mt-6">{t.task}</td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full ${
                        t.priority === 'High' ? 'bg-red-50 text-red-600' : 
                        t.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {t.priority || 'Medium'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full flex items-center justify-center gap-2 ${
                        t.status === 'Completed' ? 'bg-green-50 text-green-600' : 
                        t.status === 'In Progress' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${t.status === 'Completed' ? 'bg-green-500' : 'bg-current'} animate-pulse`}></div>
                      {t.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button 
                        onClick={() => openComments(t._id)}
                        className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-[#004838] hover:bg-[#E2FB6C]/20 transition-all active:scale-95 shadow-sm"
                    >
                        <MessageSquare size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="p-20 text-center space-y-4">
                <div className="text-6xl opacity-20">📭</div>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active task nodes discovered</p>
            </div>
          )}
        </div>
      </div>

      {/* Discussion Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCommentModalOpen(false)}></div>
            <div className="bg-white rounded-[3rem] w-full max-w-lg h-[600px] flex flex-col shadow-2xl relative z-[120] animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
                <div className="p-8 bg-gradient-to-r from-[#004838] to-[#073127] text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter">DISCUSSION NODE.</h2>
                        <p className="text-[10px] uppercase font-bold text-[#E2FB6C] tracking-[.3em]">Operational Oversight</p>
                    </div>
                    <button onClick={() => setIsCommentModalOpen(false)} className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-red-500 transition-colors">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-gray-50/50">
                    {comments.length > 0 ? (
                        comments.map((c, i) => (
                            <div key={i} className={`flex flex-col ${c.senderName === adminName ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-5 rounded-[2rem] shadow-sm ${
                                    c.senderName === adminName 
                                        ? 'bg-[#004838] text-white rounded-tr-none' 
                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                                }`}>
                                    <div className="flex justify-between items-center mb-1 gap-4">
                                        <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{c.senderName}</p>
                                        <ArrowUpRight size={10} className="opacity-30" />
                                    </div>
                                    <p className="text-sm font-bold leading-relaxed">{c.message}</p>
                                </div>
                                <span className="text-[8px] font-bold text-gray-400 mt-2 uppercase tracking-tighter ml-2">{new Date(c.createdAt).toLocaleTimeString()}</span>
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex items-center justify-center flex-col opacity-20">
                            <MessageSquare size={80} className="mb-4" />
                            <p className="text-xs font-black uppercase tracking-[.4em]">No active signal segments</p>
                        </div>
                    )}
                </div>

                <form onSubmit={postComment} className="p-8 bg-white border-t border-gray-100 flex gap-4">
                    <input 
                        type="text" 
                        placeholder="Broadcast message..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="flex-1 bg-gray-50 border-none rounded-3xl px-8 py-5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E2FB6C] outline-none transition-all shadow-inner"
                    />
                    <button type="submit" className="bg-[#004838] text-[#E2FB6C] w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-[#004838]/20 hover:scale-105 active:scale-95 transition-all">
                        🚀
                    </button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;
