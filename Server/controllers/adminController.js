const AdminModel = require("../models/adminModel");
const randomPass = require("../middleware/randomPassword");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
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

const assigntask  = async(req,res)=>{
  console.log(req.body);
const   { task,days, userId} = req.body;

let adimtask  = await taskModel.create({
  task:task,
  days:days,
  userId:userId
});

res.send("Assign task succefully");
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

module.exports = {
    Login,
    CreateUSer,
    admindispaly,
    assigntask,
    getDashboardStats
}