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

   res.send({admin, msg: "Amin succefully Login"});
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

    // Send Mail
    await mailTransporter.sendMail(mailDetails);
    
    console.log("Email sent successfully to:", email);

    res.status(200).send({
      msg: "User created & email sent successfully ✅",
    });
  } catch (error) {
    console.error("Error in CreateUSer:", error);
    res.status(500).send({
      msg: "Failed to create user or send email",
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

module.exports = {
    Login,
    CreateUSer,
    admindispaly,
    assigntask
}