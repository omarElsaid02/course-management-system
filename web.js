require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/requests");
const adminRoutes = require("./routes/admin");
const { generateCSRF, validateCSRF } = require("./middleware/csrf");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Serve static files from CoreUI
app.use(express.static(path.join(__dirname, "views/coreui")));

// Redirect root ("/") to login page
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// ===== STUDENT PAGES =====
app.get("/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/coreui/login.html"));
});

app.get("/register.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/coreui/register.html"));
});

app.get("/student-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/coreui/student-dashboard.html"));
});

app.get("/student-request.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/coreui/student-request.html"));
});

// ===== HEAD (ADMIN) PAGES =====
app.get("/head-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/coreui/head-dashboard.html"));
});

app.get("/head-queue.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/coreui/head-queue.html"));
});

app.get("/head-request.html", (req, res) => {
  res.sendFile(path.join(__dirname, "views/coreui/head-request.html"));
});

// ===== API ROUTES =====
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);

// ===== CSRF TESTING (optional demo) =====
app.get("/csrf-token", generateCSRF, (req, res) => {
  res.json({ token: req.csrfToken });
});

app.post("/api/protected", validateCSRF, (req, res) => {
  res.send("✅ CSRF-protected data received");
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
