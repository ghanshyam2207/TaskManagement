const userModel = require("../models/userModel");
const TaskModel = require("../models/taskModel");

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

module.exports = {
    Login,
    getuserTask,
    setTaskStatus,
    getUserStats
}