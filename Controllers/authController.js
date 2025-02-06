const pool = require("../db"); // Reuse database connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 🔹 Check if user already exists
    const userQuery = "SELECT * FROM users WHERE email=$1";
    const userRes = await pool.query(userQuery, [email]);

    if (userRes.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔹 Hash the password (Fix: Added `await`)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔹 Insert user into database
    await pool.query(
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email;",
      [email, hashedPassword]
    );

    // 🔹 Send response (Fix: Added `return` after `res.json`)
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 🔹 Check if user exists
    const userQuery = "SELECT * FROM users WHERE email=$1";
    const userRes = await pool.query(userQuery, [email]);

    if (userRes.rows.length === 0) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    const user = userRes.rows[0];

    // 🔹 Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔹 Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 🔹 Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Exporting function correctly for Node.js
module.exports = { login, register };
