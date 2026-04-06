const express = require("express");

const route = express.Router();

const adminController = require("../controllers/adminController");

route.post("/login",adminController.Login );
route.post("/createuser", adminController.CreateUSer);
route.get("/adminuserdisplay", adminController.admindispaly);
route.post("/assigntask", adminController.assigntask);
route.get("/dashboard-stats", adminController.getDashboardStats);
route.delete("/deleteuser/:id", adminController.deleteUser);
route.put("/updateuser/:id", adminController.updateUser);
route.get("/all-tasks-report", adminController.getAllTasksForReport);
route.post("/addcomment", adminController.addComment);
route.get("/getcomments", adminController.getComments);

module.exports = route;