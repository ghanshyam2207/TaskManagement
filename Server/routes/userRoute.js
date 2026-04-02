const express = require("express");

const route = express.Router();

const userController = require("../controllers/userController");


route.post("/login",userController.Login );


module.exports = route;