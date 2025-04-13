require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const adminRoutes = require("./routes/admin");
const { generateCSRF, validateCSRF } = require("./middleware/csrf");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Dummy route to test
app.get("/", (req, res) => {
  res.send("Course Management System API is working!");
});
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);

// For routes that need CSRF protection
app.get("/csrf-token", generateCSRF, (req, res) => {
  res.json({ token: req.csrfToken });
});

// Example protected POST
app.post("/api/protected", validateCSRF, (req, res) => {
  res.send("✅ CSRF-protected data received");
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
