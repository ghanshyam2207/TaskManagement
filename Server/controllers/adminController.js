const AdminModel = require("../models/adminModel");
const randomPass = require("../middleware/randomPassword");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const notificationModel = require("../models/notificationModel");
const commentModel = require("../models/commentModel");
const nodemailer = require("nodemailer");

const Login = async (req,res)=>{
   console.log(req.body);

   const {email, password} = req.body;

   const admin = await AdminModel.findOne({email:email});

   if(!admin){
    return res.status(400).send({msg: "Invalid email"})
   }
   if(admin.password != password){
    return res.status(400).send({msg: "Invalid password"})
    
   }

   res.send({admin, msg: "Admin succefully Login"});
}


const CreateUSer = async (req, res) => {
  console.log("Creating user with data:", req.body);
  try {
    const { name, email, post } = req.body;

    if (!name || !email || !post) {
      return res.status(400).send({ msg: "Please provide all required fields (name, email, post)" });
    }

    let userPassword = randomPass.randomPassword();

    // Create user in DB
    await userModel.create({
      name: name,
      email: email,
      post: post,
      password: userPassword
    });

    console.log("User created in DB, sending email...");

    // Transporter
    let mailTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_PASS, // App password (NOT your Gmail password)
      },
    });

    // Mail content
    let mailDetails = {
      from: `"Admin Panel" <${process.env.NODE_MAIL}>`,
      to: email,
      subject: "Your Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #4CAF50;">User Account Created ✅</h2>
          <p>Hello <b>${name}</b>,</p>
          <p>Your account has been created successfully. Below are your login credentials:</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Role:</b> ${post}</p>
          <p><b>Password:</b> <span style="background: #f4f4f4; padding: 5px; border-radius: 3px;">${userPassword}</span></p>
          <br/>
          <p style="color: #555;">Please login and change your password for security reasons.</p>
          <hr/>
          <p style="font-size: 12px; color: #888;">This is an automated email, please do not reply.</p>
        </div>
      `,
    };

    // Send Mail (Separate try-catch to avoid breaking user creation on email failure)
    try {
      await mailTransporter.sendMail(mailDetails);
      console.log("Email sent successfully to:", email);
      res.status(200).send({
        msg: "User created & email sent successfully ✅",
      });
    } catch (mailError) {
      console.error("User created but email failed:", mailError.message);
      res.status(201).send({
        msg: "User created successfully, but email notification failed ⚠️",
        error: mailError.message
      });
    }
  } catch (error) {
    console.error("Error in CreateUSer:", error);
    res.status(500).send({
      msg: "Failed to create user",
      error: error.message
    });
  }
};

const admindispaly = async(req,res)=>{
    //  console.log(res.body);
     let admin = await userModel.find();
     res.send(admin);
}

const assigntask = async (req, res) => {
  console.log(req.body);
  const { task, days, userId, priority, dueDate } = req.body;

  try {
    let adimtask = await taskModel.create({
      task: task,
      days: days,
      userId: userId,
      priority: priority || "Medium",
      dueDate: dueDate || new Date(Date.now() + (days || 1) * 24 * 60 * 60 * 1000)
    });

    // Create notification in DB
    console.log("Creating notification for userId:", userId);
    const newNotif = await notificationModel.create({
      userId: userId,
      message: `🚀 New Protocol: "${task.substring(0, 30)}..." assigned. Priority: ${priority || 'Medium'}`
    });
    console.log("Notification created successfully:", newNotif._id);

    // Send Email Notification
    const user = await userModel.findById(userId);
    if (user && user.email) {
      let mailTransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.NODE_MAIL,
          pass: process.env.NODE_PASS,
        },
      });

      let mailDetails = {
        from: `"Task Management" <${process.env.NODE_MAIL}>`,
        to: user.email,
        subject: "🚨 New Task Assignment",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; padding: 40px; color: #333;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
              <div style="background-color: #004838; padding: 30px; text-align: center;">
                <h1 style="color: #E2FB6C; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Task Assigned</h1>
              </div>
              <div style="padding: 40px;">
                <p style="font-size: 16px; line-height: 1.6;">Hello <b>${user.name}</b>,</p>
                <p style="font-size: 16px; line-height: 1.6;">A new operation has been assigned to you in the system:</p>
                <div style="background-color: #f0f4f1; border-left: 4px solid #004838; padding: 20px; margin: 25px 0;">
                  <p style="margin: 0; font-weight: bold; color: #004838;">Task: ${task}</p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Priority: <span style="color: ${priority === 'High' ? '#ef4444' : '#f59e0b'}; font-weight: 800;">${priority || 'Medium'}</span></p>
                  <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Submission Window: ${days || 1} Days</p>
                </div>
                <p style="font-size: 14px; color: #888;">Please login to your dashboard to begin the protocol.</p>
                <a href="${process.env.FRONTEND_URL || '#'}" style="display: inline-block; background-color: #004838; color: #E2FB6C; padding: 15px 35px; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 14px; margin-top: 20px;">Open Dashboard</a>
              </div>
            </div>
          </div>
        `,
      };

      try {
        await mailTransporter.sendMail(mailDetails);
        console.log("Task email sent to:", user.email);
      } catch (mailErr) {
        console.error("Task assigned but email failed:", mailErr.message);
      }
    }

    res.send("Assign task successfully");
  } catch (error) {
    res.status(500).send({ msg: "Error assigning task", error: error.message });
  }
}

const getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await taskModel.countDocuments();
    const completedTasks = await taskModel.countDocuments({ status: "Completed" });
    const pendingTasks = await taskModel.countDocuments({ status: "Pending" });
    const inProgressTasks = await taskModel.countDocuments({ status: "In Progress" });
    const totalUsers = await userModel.countDocuments();

    // Logic for overdue: (status != Completed AND current date > createdAt + days)
    // For simplicity, let's just count manually or use a more complex aggregation
    // For now, I'll count tasks that are not completed and have been created too long ago.
    
    const tasks = await taskModel.find({ status: { $ne: "Completed" } });
    const now = new Date();
    const overdueTasks = tasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      const dueDate = new Date(createdDate.getTime() + task.days * 24 * 60 * 60 * 1000);
      return now > dueDate;
    }).length;

    res.status(200).send({
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      totalUsers,
      overdueTasks
    });
  } catch (error) {
    res.status(500).send({ msg: "Error fetching stats", error: error.message });
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    await taskModel.deleteMany({ userId: id });
    res.status(200).send({ msg: "User and their tasks deleted successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Error deleting user", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, post } = req.body;
    await userModel.findByIdAndUpdate(id, { name, email, post });
    res.status(200).send({ msg: "User updated successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Error updating user", error: error.message });
  }
};

const getAllTasksForReport = async (req, res) => {
  try {
    const tasks = await taskModel.find().populate("userId", "name email post");
    res.status(200).send(tasks);
  } catch (error) {
    res.status(500).send({ msg: "Error fetching tasks for report", error: error.message });
  }
};

const addComment = async (req, res) => {
    const { taskId, senderName, message } = req.body;
    try {
        const comment = await commentModel.create({ taskId, senderName, message });
        
        // Find task to get user ID
        const task = await taskModel.findById(taskId);
        if (task) {
            const user = await userModel.findById(task.userId);
            // If admin sent it, notify user
            if (senderName !== user?.name && senderName !== "User") {
                await notificationModel.create({
                    userId: task.userId,
                    message: `🚀 New message on task: "${task.task.substring(0, 20)}..." from ${senderName}`
                });
            } 
            // If user sent it, notify admin (Admin doesn't have a userId, so we leave it null)
            else {
                await notificationModel.create({
                    userId: null, 
                    message: `📢 Staff [${senderName}] replied on task: "${task.task.substring(0, 20)}..."`
                });
            }
        }

        res.status(201).send(comment);
    } catch (error) {
        res.status(500).send({ msg: "Error adding comment", error: error.message });
    }
};

const getComments = async (req, res) => {
    const { taskId } = req.query;
    try {
        const comments = await commentModel.find({ taskId }).sort({ createdAt: 1 });
        res.status(200).send(comments);
    } catch (error) {
        res.status(500).send({ msg: "Error fetching comments", error: error.message });
    }
};

module.exports = {
    Login,
    CreateUSer,
    admindispaly,
    assigntask,
    getDashboardStats,
    deleteUser,
    updateUser,
    getAllTasksForReport,
    addComment,
    getComments
}