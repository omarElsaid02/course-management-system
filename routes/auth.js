const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
    try {
      const { name, email, password, role, degree } = req.body;
      const hash = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hash, role, degree });
  
      await user.save();
  
      // Generate verification link (you can adjust the port if needed)
      const verificationLink = `http://localhost:3000/api/auth/verify/${encodeURIComponent(email)}`;
  
      console.log(`\n=== EMAIL SIMULATION ===`);
      console.log(`To verify your account, visit: ${verificationLink}\n`);
  
      res.send("Registration successful. Check console for email verification link.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error registering user.");
    }
  });

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).send("User not found.");
    if (!user.isVerified) return res.status(403).send("Email not verified.");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send("Invalid password.");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    res.json({
      token,
      role: user.role,
      userId: user._id // ✅ INCLUDE THIS!
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error.");
  }
});

module.exports = router;

// Email verification route (simulated)
router.get("/verify/:email", async (req, res) => {
  await User.findOneAndUpdate({ email: req.params.email }, { isVerified: true });
  res.send("Email verified successfully!");
});

module.exports = router;
