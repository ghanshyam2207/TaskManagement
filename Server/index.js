const express = require("express");

const app = express();

const cors = require("cors");

const mongoose = require("mongoose");

const bodyparser = require("body-parser");

const adminRoute = require("./routes/adminRoute");

const userRoute = require("./routes/userRoute");

require("dotenv").config();

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({ extended: true}));

app.use("/admin", adminRoute);

app.use("/user", userRoute);

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Db are connected succesfully");
})


app.listen(PORT, ()=>{
    console.log(`server are running in port ${PORT}`);
})
