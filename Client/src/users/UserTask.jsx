import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTask = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskStatus, setTaskStatus] = useState("");
  const [compDay, setCompDay] = useState("");
  const [loading, setLoading] = useState(true);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const user = JSON.parse(localStorage.getItem("userData")) || { name: localStorage.getItem("user") || "User" };
  const handleShow = (id) => {
    setTaskId(id);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const loadData = async () => {
    try {
      const userid = localStorage.getItem("userid");
      if (!userid) {
         setLoading(false);
         return;
      }

      let api = `${import.meta.env.VITE_API_URL}/user/getusertask/?id=${userid}`;
      const response = await axios.get(api);
      setTasks(response.data);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCommentModal = async (tid) => {
    setTaskId(tid);
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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput) return;
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/admin/addcomment`, {
            taskId,
            senderName: user.name,
            message: commentInput
        });
        setCommentInput("");
        fetchComments(taskId);
    } catch (error) {
        toast.error("Failed to post comment");
    }
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!taskStatus || !compDay) {
      toast.warn("Please fill all details! ⚠️");
      return;
    }

    try {
      let api = `${import.meta.env.VITE_API_URL}/user/settaskstatus`;
      await axios.post(api, { 
        taskID: taskId, 
        taskStatus, 
        compDay 
      });
      
      toast.success("Task Report Sent! ✅");
      setShowModal(false);
      
      // Clear inputs
      setTaskStatus("");
      setCompDay("");
      
      // Refresh list immediately
      loadData();
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit report ❌");
    }
  };

  return (
    <div className="p-4 md:p-8 bg-[#EBEDE8] min-h-screen">

      {/* Header Section */}
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-extrabold tracking-tight text-[#004838] mb-2">
          Your Assigned Tasks
        </h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] rounded-full mx-auto md:mx-0"></div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#004838]"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-white/50 backdrop-blur-sm">
          <div className="text-5xl mb-4">🎉</div>
          <h3 className="text-xl font-bold text-gray-800">No tasks assigned yet!</h3>
          <p className="text-gray-500 mt-2">Enjoy your day or contact your admin for new tasks.</p>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-white overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-[#004838] text-white">
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">#</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Task Description</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Status</th>
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tasks.map((task, index) => (
                  <tr 
                    key={task._id} 
                    className="hover:bg-white/40 transition-colors duration-200"
                  >
                    <td className="px-6 py-5 text-gray-600 font-medium">{index + 1}</td>
                    <td className="px-6 py-5 font-medium text-gray-800">{task.task}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        task.priority === 'High' ? 'bg-red-100 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {task.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-gray-500 font-bold text-sm">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        task.status === "Completed" ? "bg-green-100 text-green-700" :
                        task.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {task.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleShow(task._id)}
                          className="bg-gradient-to-r from-[#004838] to-[#073127] text-white px-5 py-2.5 rounded-xl
                          hover:shadow-lg hover:shadow-[#004838]/20 transition-all duration-300 transform hover:scale-105 active:scale-95
                          text-sm font-semibold flex items-center gap-2"
                        >
                          🚀 Report
                        </button>
                        <button
                          onClick={() => openCommentModal(task._id)}
                          className="bg-white border border-gray-100 text-gray-400 font-bold p-2.5 rounded-xl hover:bg-[#E2FB6C]/20 hover:text-[#004838] transition-all hover:scale-110 active:scale-95 shadow-sm"
                          title="Discussion"
                        >
                          💬
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose}></div>
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative z-[120] animate-in zoom-in-95 duration-300">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-[#004838]">Task Completion</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
             </div>
             <form onSubmit={handleSubmitTask} className="space-y-6">
                <div>
                   <label className="block ml-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Update Status</label>
                   <select
                     value={taskStatus}
                     onChange={(e) => setTaskStatus(e.target.value)}
                     className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#E2FB6C] outline-none transition-all font-bold text-gray-700"
                   >
                     <option value="">Status...</option>
                     <option value="Completed">✅ Completed</option>
                     <option value="In Progress">⏳ In Progress</option>
                     <option value="Pending">❌ Pending</option>
                   </select>
                </div>
                <div>
                   <label className="block ml-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Days Taken</label>
                   <input
                     type="number"
                     placeholder="e.g. 3"
                     value={compDay}
                     onChange={(e) => setCompDay(e.target.value)}
                     className="w-full p-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-[#E2FB6C] outline-none transition-all font-bold text-gray-700"
                   />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] text-[#004838] font-black rounded-2xl hover:shadow-xl transition-all uppercase tracking-widest text-xs">
                   Submit Report
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Discussion Modal */}
      {isCommentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCommentModalOpen(false)}></div>
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg h-[600px] flex flex-col shadow-2xl relative z-[120] animate-in slide-in-from-bottom-10 duration-500 overflow-hidden">
             <div className="p-6 bg-[#004838] text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-black">Task Discussion</h2>
                    <p className="text-[10px] uppercase font-bold text-[#E2FB6C]">Collaboration Node</p>
                </div>
                <button onClick={() => setIsCommentModalOpen(false)} className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-red-500 transition-colors">✕</button>
             </div>

             <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-50/50">
                {comments.length > 0 ? (
                    comments.map((c, i) => (
                        <div key={i} className={`flex flex-col ${c.senderName === user.name ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                                c.senderName === user.name 
                                    ? 'bg-[#004838] text-white rounded-tr-none' 
                                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                            }`}>
                                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">{c.senderName}</p>
                                <p className="text-sm font-medium leading-relaxed">{c.message}</p>
                            </div>
                            <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">{new Date(c.createdAt).toLocaleTimeString()}</span>
                        </div>
                    ))
                ) : (
                    <div className="h-full flex items-center justify-center flex-col opacity-20">
                        <span className="text-6xl mb-4">💬</span>
                        <p className="text-xs font-black uppercase tracking-[.3em]">No transmissions yet</p>
                    </div>
                )}
             </div>

             <form onSubmit={handleCommentSubmit} className="p-6 bg-white border-t border-gray-100 flex gap-3">
                <input 
                    type="text" 
                    placeholder="Type your message..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="flex-1 bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-[#E2FB6C] outline-none transition-all"
                />
                <button type="submit" className="bg-[#004838] text-[#E2FB6C] w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-[#004838]/20 active:scale-95 transition-all">
                    ➤
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTask;