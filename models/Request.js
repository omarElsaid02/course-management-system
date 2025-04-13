const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  message: String,
  semester: String,
  status: {
    type: String,
    enum: ["pending", "resolved", "rejected", "cancelled"],
    default: "pending"
  },
  note: String,
  createdAt: { type: Date, default: Date.now },
  estimatedProcessingTime: String
});

module.exports = mongoose.model("Request", requestSchema);
