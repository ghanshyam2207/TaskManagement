const userModel = require("../models/userModel");
const TaskModel = require("../models/taskModel");
const notificationModel = require("../models/notificationModel");

const Login = async (req,res)=>{
   console.log(req.body);

   const {email, password} = req.body;

   const user = await userModel.findOne({ email });

   if(!user){
    return res.status(400).send({msg: "Invalid email"})
   }

   if(user.password !== password){
    return res.status(400).send({msg: "Invalid password"})
   }

   res.status(200).send({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        post: user.post
      }, 
      msg: "User successfully Login"
   });
}

const getuserTask=async(req, res) =>{
    const {id} =req.query;
    const task= await TaskModel.find({userId:id})
    res.send(task);
}

const setTaskStatus=async(req, res) =>{
    const {taskID, taskStatus, compDay}=req.body;
    console.log(taskID);
    const task= await TaskModel.findByIdAndUpdate(taskID, {
        status:taskStatus,
        compday:compDay
    })
    console.log(task);
    res.status(201).send("Task Succefully Updated!!!");
}

const getUserStats = async (req, res) => {
    const { id } = req.query;
    try {
        const tasks = await TaskModel.find({ userId: id });
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === "Completed").length;
        const inProgress = tasks.filter(t => t.status === "In Progress").length;
        const pending = tasks.filter(t => t.status === "Pending").length;

        // Recently finished tasks
        const recentTasks = tasks
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 3);

        res.status(200).json({
            stats: { total, completed, inProgress, pending },
            recentTasks
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
}

const getNotifications = async (req, res) => {
    let { userId } = req.query;
    try {
        // If it's an admin request, find notifications for admin (userId: null)
        const filter = (userId === "admin") ? { userId: null } : { userId };
        const notifications = await notificationModel.find(filter).sort({ createdAt: -1 }).limit(10);
        res.status(200).send(notifications);
    } catch (error) {
        res.status(500).send({ msg: "Error fetching notifications", error: error.message });
    }
};

const markNotificationsAsRead = async (req, res) => {
    const { userId } = req.body;
    try {
        await notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
        res.status(200).send("Notifications marked as read");
    } catch (error) {
        res.status(500).send({ msg: "Error updating notifications", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    const { id, name, email, password } = req.body;
    try {
        await userModel.findByIdAndUpdate(id, { name, email, password });
        res.status(200).send("Profile updated successfully");
    } catch (error) {
        res.status(500).send({ msg: "Error updating profile", error: error.message });
    }
};

module.exports = {
    Login,
    getuserTask,
    setTaskStatus,
    getUserStats,
    getNotifications,
    markNotificationsAsRead,
    updateUserProfile
}