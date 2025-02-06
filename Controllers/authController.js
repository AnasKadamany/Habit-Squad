const { pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
export const login = async (req, res) => {
  try{
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(401).json({ message: "Email and password are required" });
    }
    const userQuery = "SELECT * FROM users WHERE email=$1";
    const userRes = await pool.query(userQuery, [email]);
    if (userRes.rows.length === 0) {
      res.status(401).json({ message: "Wrong Credantials" });
    }
    const user = userRes.rows[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token=jwt.sign('userId'=user.id,process.env.JWT_SECRET,{expiresIn:"7d"})

    res.status(201).json({message:"login Successfully",token,user:{id:user.id,email:user.email}})
  }
  catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
