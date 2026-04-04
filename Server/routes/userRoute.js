const express = require("express");

const route = express.Router();

const userController = require("../controllers/userController");


route.post("/login",userController.Login );
route.get("/getusertask",  userController.getuserTask);
route.post("/settaskstatus",  userController.setTaskStatus);
route.get("/getuserstats", userController.getUserStats);



module.exports = route;