const crypto = require("crypto");

const tokens = {}; // In-memory store (you can use Redis in real apps)

// Generate CSRF token and store it
function generateCSRF(req, res, next) {
  const token = crypto.randomBytes(24).toString("hex");
  tokens[token] = true;

  res.setHeader("x-csrf-token", token); // Can be read from frontend
  req.csrfToken = token;
  next();
}

// Validate incoming CSRF token
function validateCSRF(req, res, next) {
  const token = req.headers["x-csrf-token"];

  if (!token || !tokens[token]) {
    return res.status(403).send("Invalid CSRF token");
  }

  delete tokens[token]; // Token is one-time use
  next();
}

module.exports = { generateCSRF, validateCSRF };
