import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignTask = () => {
  const [mydata, setMyData] = useState([]);
  const [userId, setUserId] = useState(null);
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
    let api = `${import.meta.env.VITE_API_URL}/admin/adminuserdisplay`;
    let res = await axios.get(api);
    setMyData(res.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  let myEdit = async (id) => {
    setIsEditOpen(true);
    setUserId(id);
  };
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let api = `${import.meta.env.VITE_API_URL}/admin/assigntask`;
      let res = await axios.post(api, { ...input, userId: userId });
      console.log(res.data);
      loadData();
      toast.success("Assign Task Successfully ✅");
      setTimeout(() => {
        setIsEditOpen(false);
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed ❌");
    }
  };

  return (
    <div className="p-6 bg-[#EBEDE8]  min-h-screen w-[90%]">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-gray-100 shadow-lg rounded-2xl p-6 mt-10">
        <h2 className="text-2xl font-bold mb-4">Assign Task</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            {/* HEADER */}
            <thead>
              <tr className="bg-gray-200 text-gray-700 uppercase text-sm">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {mydata.map((item, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-green-100 transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-medium">{item.name}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">
                      {item.post}
                    </span>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="p-3 text-center space-x-2">
                    <button
                      onClick={() => {
                        myEdit(item._id);
                      }}
                      className="px-3 py-2 text-sm bg-green-500 font-semibold cursor-pointer text-white rounded-lg hover:bg-blue-600"
                    >
                      Assign Task
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {mydata.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No users found.</p>
        )}
      </div>
      {isEditOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 bg-opacity-50 z-50">
          {/* MODAL BOX */}
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
            {/* CLOSE BUTTON (TOP RIGHT) */}
            <button
              onClick={() => setIsEditOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
            >
              ✖
            </button>

            <h1 className="text-2xl text-center font-bold text-blue-600 mb-6">
              Edit User
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {userId}
              <input
                type="text"
                name="task"
                value={input.task}
                onChange={handleInput}
                className="px-4 py-2 border rounded-lg"
                placeholder="Enter your task"
              />

              <input
                type="text"
                name="days"
                value={input.days}
                onChange={handleInput}
                className="px-4 py-2 border rounded-lg"
                placeholder="Enter days"
              />
              {/* BUTTONS */}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-lg"
                >
                  Submit
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="w-full bg-gray-400 cursor-pointer text-white py-2 rounded-lg"
                >
                  Cancel
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