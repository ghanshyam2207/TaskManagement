import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserTask = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [taskStatus, setTaskStatus] = useState("");
  const [compDay, setCompDay] = useState("");
  const [selectedTaskID, setSelectedTaskID] = useState("");
  const [loading, setLoading] = useState(true);

  const handleClose = () => setShowModal(false);
  const handleShow = (id) => {
    setSelectedTaskID(id);
    setShowModal(true);
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

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!taskStatus || !compDay) {
      toast.warn("Please fill all details! ⚠️");
      return;
    }

    try {
      let api = `${import.meta.env.VITE_API_URL}/user/settaskstatus`;
      await axios.post(api, { 
        taskID: selectedTaskID, 
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
                  <th className="px-6 py-5 font-semibold text-sm uppercase tracking-wider">Target Days</th>
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
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-bold">
                        {task.days} Days
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
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => handleShow(task._id)}
                        className="bg-gradient-to-r from-[#004838] to-[#073127] text-white px-5 py-2.5 rounded-xl
                        hover:shadow-lg hover:shadow-[#004838]/20 transition-all duration-300 transform hover:scale-105 active:scale-95
                        text-sm font-semibold flex items-center gap-2 mx-auto"
                      >
                        🚀 Send Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] px-4">
          {/* Backdrop Animation */}
          <div 
            className="absolute inset-0 bg-[#004838]/40 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          ></div>
          
          {/* Modal Container */}
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative z-10 transform scale-100 transition-transform">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[#004838]">Task Completion Report</h2>
              <button 
                onClick={handleClose} 
                className="text-gray-400 hover:text-red-500 transition-colors p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTask} className="space-y-6">
              <div className="space-y-4">
                {/* Custom Styled Select */}
                <div>
                  <label className="block ml-2 text-sm font-bold text-gray-700 mb-2">
                    Current Progress
                  </label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#E2FB6C] focus:ring-0 outline-none transition-all appearance-none"
                  >
                    <option value="">Choose status...</option>
                    <option value="Completed">✅ Fully Completed</option>
                    <option value="In Progress">⏳ Partial Completed</option>
                    <option value="Pending">❌ Not Started</option>
                  </select>
                </div>

                {/* Styled Input */}
                <div>
                  <label className="block ml-2 text-sm font-bold text-gray-700 mb-2">
                    Total Days Taken
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5"
                    value={compDay}
                    onChange={(e) => setCompDay(e.target.value)}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-[#E2FB6C] focus:ring-0 outline-none transition-all font-medium"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-2 px-8 py-4 bg-gradient-to-r from-[#E2FB6C] to-[#A8FF78] text-[#004838] font-black rounded-2xl hover:shadow-xl hover:shadow-[#A8FF78]/40 transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  SUBMIT REPORT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTask;