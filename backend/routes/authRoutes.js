const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db"); // MySQL connection pool
const router = express.Router();

// Temporary in-memory OTP store
const otpStore = {}; 

// ------------------------ TOKEN GENERATION ------------------------
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "test_secret",
    { expiresIn: "1h" }
  );
};

// ------------------------ SIGNUP ------------------------
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 🚫 Limit to 3 sales or finance personnel
    if (["sales", "finance"].includes(role)) {
      const [rows] = await db.execute(
        "SELECT COUNT(*) AS count FROM users WHERE role = ?",
        [role]
      );
      if (rows[0].count >= 3) {
        return res.status(403).json({
          error: `Only 3 ${role} personnel allowed.`,
        });
      }
    }

    // ❌ Check if user already exists
    const [existing] = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // ✅ Insert new user with is_verified = 0
    await db.execute(
      "INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, role, 0]
    );

    // 🔐 Store OTP temporarily (mocked as 123456)
    otpStore[email] = "123456";

    res.status(201).json({
      message: "Signup successful. Use OTP 123456 to verify.",
      email,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ LOGIN ------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // 🔐 Generate OTP for verification (mocked)
    otpStore[email] = "123456";

    res.status(200).json({
      message: "OTP sent (use 123456)",
      email,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ VERIFY OTP ------------------------
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const expectedOtp = otpStore[email];

  if (!otp || otp !== expectedOtp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // ✅ Mark user as verified
    await db.execute("UPDATE users SET is_verified = 1 WHERE email = ?", [
      email,
    ]);

    const token = generateToken(user);
    delete otpStore[email]; // clear OTP

    return res.status(200).json({
      message: "OTP verified",
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export router
module.exports = router;
