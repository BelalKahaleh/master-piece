// server/controllers/studentAuthController.js
const jwt    = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student= require("../models/studentModel");

const JWT_SECRET    = process.env.JWT_SECRET || "supersecret";
const COOKIE_OPTS   = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 1000 * 60 * 60 * 8,
};

const signToken = payload => jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(401).json({ message: "بيانات غير صحيحة" });

    const match = await bcrypt.compare(password, student.password);
    if (!match) return res.status(401).json({ message: "بيانات غير صحيحة" });

    const token = signToken({ id: student._id, role: "student" });
    res.cookie("studentToken", token, COOKIE_OPTS);
    res.json({ message: "success" });
  } catch (err) {
    console.error("loginStudent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const decodeToken = token => jwt.verify(token, JWT_SECRET);

module.exports = { loginStudent, decodeToken };
