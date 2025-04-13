const express = require("express");
const Request = require("../models/Request");

const router = express.Router();

// Create a request
router.post("/", async (req, res) => {
  const { studentId, category, message } = req.body;

  // Estimate time based on queue
  const count = await Request.countDocuments({ category, status: "pending" });
  const estimatedMinutes = 15 * count;
  const estimatedHours = Math.ceil(estimatedMinutes / 60);
  const estimate = `${estimatedHours} hour(s)`;

  const request = new Request({
    student: studentId,
    category,
    message,
    estimatedProcessingTime: estimate
  });

  await request.save();
  res.send("Request submitted successfully!");
});

// View student's requests
router.get("/student/:id", async (req, res) => {
  const requests = await Request.find({ student: req.params.id }).sort({ createdAt: -1 });
  res.json(requests);
});

// Cancel a request
router.put("/cancel/:id", async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, { status: "cancelled" });
  res.send("Request cancelled.");
});
