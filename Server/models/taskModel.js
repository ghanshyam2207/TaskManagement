

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: String,
  days: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
});

module.exports = mongoose.model("task", taskSchema);