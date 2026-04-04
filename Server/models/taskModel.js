const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  days: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Completed"], 
    default: "Pending" 
  }
}, { timestamps: true });

module.exports = mongoose.model("task", taskSchema);