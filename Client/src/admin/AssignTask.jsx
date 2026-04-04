import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AssignTask = () => {
  const [mydata, setMyData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);

  let [input, setInput] = useState({
    task: "",
    days: "",
  });

  let handleInput = (e) => {
    let { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const loadData = async () => {
    try {
        let api = `${import.meta.env.VITE_API_URL}/admin/adminuserdisplay`;
        let res = await axios.get(api);
        setMyData(res.data);
    } catch (err) {
        console.error("Error loading users:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  let openAssignModal = (id, name) => {
    setIsEditOpen(true);
    setUserId(id);
    setUserName(name);
    setInput({ task: "", days: "" });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.task || !input.days) {
        return toast.warn("Please fill all task details! ⚠️");
    }

    try {
      let api = `${import.meta.env.VITE_API_URL}/admin/assigntask`;
      let res = await axios.post(api, { ...input, userId: userId });
      toast.success("Task Assigned Successfully! ✅");
      setIsEditOpen(false);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to assign task ❌");
    }
  };

  return (
    <div className="p-8 md:p-12 space-y-10 animate-in fade-in duration-500">
      
      {/* 🚀 Header & Stats Preview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="w-12 h-1 bg-[#004838] rounded-full"></span>
                <span className="text-[10px] uppercase font-black text-[#004838] tracking-[.4em]">Resource Allocation</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                Workforce <span className="bg-gradient-to-r from-[#004838] to-[#073127] bg-clip-text text-transparent">Deployment</span>
            </h1>
        </div>
        <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 px-6 rounded-3xl border border-white">
             <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Staff</p>
                <p className="text-xl font-black text-[#004838]">{mydata.length}</p>
             </div>
             <span className="text-2xl opacity-40">👥</span>
        </div>
      </div>

      {/* 📋 User List Table Section */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-[.25em]">
                <th className="px-8 py-6 text-left">#</th>
                <th className="px-8 py-6 text-left">Internal Staff</th>
                <th className="px-8 py-6 text-left">Contact Node</th>
                <th className="px-8 py-6 text-left">Designation</th>
                <th className="px-8 py-6 text-center">Protocol</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {mydata.map((item, index) => (
                <tr
                  key={index}
                  className="group hover:bg-[#E2FB6C]/10 transition-all duration-300 transform"
                >
                  <td className="px-8 py-6 text-gray-300 font-mono text-xs">{String(index + 1).padStart(2, '0')}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#004838] text-[#E2FB6C] flex items-center justify-center font-black text-xs shadow-lg group-hover:scale-110 transition-transform">
                            {item.name[0].toUpperCase()}
                        </div>
                        <span className="font-black text-gray-800 tracking-tight group-hover:text-[#004838] transition-colors">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-medium text-gray-500">{item.email}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-gray-100 text-[#004838] group-hover:bg-[#004838] group-hover:text-white transition-all duration-300">
                      {item.post}
                    </span>
                  </td>

                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => openAssignModal(item._id, item.name)}
                      className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-[#004838] to-[#073127] text-white rounded-xl shadow-lg shadow-[#004838]/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Assign Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {mydata.length === 0 && (
          <div className="p-20 text-center space-y-4">
             <div className="text-6xl opacity-20">📂</div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active staff nodes discovered</p>
          </div>
        )}
      </div>

      {/* 📦 Assign Task Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditOpen(false)}></div>
          
          <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-6 md:p-12 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 overflow-hidden">
            
            {/* Modal Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2FB6C]/20 rounded-bl-full -z-0"></div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-2xl transition-all z-20"
            >
              ✖
            </button>

            <div className="text-center mb-10 relative z-10">
                <span className="px-4 py-1.5 bg-gray-100 text-[#004838] rounded-full text-[10px] font-black tracking-widest uppercase mb-4 inline-block">Task Protocol</span>
                <h1 className="text-3xl font-black text-gray-900 leading-tight">
                    Assigning to <br />
                    <span className="bg-gradient-to-r from-[#004838] to-[#073127] bg-clip-text text-transparent">{userName}</span>
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Payload (Task)</label>
                <div className="relative group">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale opacity-50 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">📝</span>
                    <input
                        type="text"
                        name="task"
                        autoComplete="off"
                        value={input.task}
                        onChange={handleInput}
                        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-[#004838] focus:ring-0 outline-none transition-all font-bold text-gray-700"
                        placeholder="Define the scope..."
                    />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Timeline Allocation (Days)</label>
                <div className="relative group">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg grayscale opacity-50 group-focus-within:grayscale-0 group-focus-within:opacity-100 transition-all">📅</span>
                  <input
                    type="number"
                    name="days"
                    autoComplete="off"
                    value={input.days}
                    onChange={handleInput}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-[#004838] focus:ring-0 outline-none transition-all font-bold text-gray-700"
                    placeholder="Duration"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#004838] to-[#073127] text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[.2em] shadow-xl shadow-[#004838]/20 hover:scale-[1.03] active:scale-[0.97] transition-all"
                >
                  Deploy Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignTask;