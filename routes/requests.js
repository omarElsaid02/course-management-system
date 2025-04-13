const express = require("express");
const Request = require("../models/Request");
const moment = require("moment-business-time");

const router = express.Router();

// Create a request

router.post("/", async (req, res) => {
  const { category, message, semester, studentId } = req.body;

  if (!studentId || !category || !message || !semester) {
    return res.status(400).send("Missing required fields.");
  }

  try {
    const pendingCount = await Request.countDocuments({ category, status: "pending" });
    const minutesToAdd = pendingCount * 15;

    const now = moment();
    const estimatedDateTime = now.clone().addWorkingTime(minutesToAdd, 'minutes');

    const estimate = estimatedDateTime.format("dddd, MMM Do YYYY, h:mm A");

    const request = new Request({
      student: studentId,
      category,
      message,
      semester,
      estimatedProcessingTime: estimate
    });

    await request.save();
    res.send("Request submitted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving request.");
  }
});


// View student's requests
router.get("/student/:id", async (req, res) => {
  const studentId = req.params.id;

  if (!studentId || studentId === "null") {
    return res.status(400).send("Invalid student ID");
  }

  try {
    const requests = await Request.find({ student: studentId });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching requests");
  }
});


// Cancel a request
router.put("/cancel/:id", async (req, res) => {
  const request = await Request.findByIdAndUpdate(req.params.id, { status: "cancelled" });
  res.send("Request cancelled.");
});

module.exports = router;