const express = require("express");
const Request = require("../models/Request");
const router = express.Router();

// View all queues (grouped by category)
router.get("/queues", async (req, res) => {
  const pendingRequests = await Request.find({ status: "pending" });

  const queues = {};
  pendingRequests.forEach((req) => {
    if (!queues[req.category]) queues[req.category] = [];
    queues[req.category].push(req);
  });

  res.json(queues);
});

// Get all requests from a specific queue
router.get("/queue/:category", async (req, res) => {
  const list = await Request.find({ category: req.params.category, status: "pending" });
  res.json(list);
});

// Get a random request from all queues
router.get("/random", async (req, res) => {
  const [randomRequest] = await Request.aggregate([
    { $match: { status: "pending" } },
    { $sample: { size: 1 } }
  ]);

  res.json(randomRequest);
});

// Resolve or reject request
router.post("/update/:id", async (req, res) => {
  const { note, status } = req.body;

  if (!["resolved", "rejected"].includes(status))
    return res.status(400).send("Invalid status");

  await Request.findByIdAndUpdate(req.params.id, {
    status,
    note
  });

  console.log(`Simulated Email: Request ${status}. Note: ${note}`);
  res.send("Request updated.");
});

module.exports = router;