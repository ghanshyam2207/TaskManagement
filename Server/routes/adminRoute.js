const express = require("express");

const route = express.Router();

const adminController = require("../controllers/adminController");

route.post("/login",adminController.Login );
route.post("/createuser", adminController.CreateUSer);
route.get("/adminuserdisplay", adminController.admindispaly);
route.post("/assigntask", adminController.assigntask);
route.get("/dashboard-stats", adminController.getDashboardStats);


module.exports = route;