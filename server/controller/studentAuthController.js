// server/controllers/studentAuthController.js
const jwt    = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student= require("../model/studentModel");

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

  console.log('Login attempt for student with email:', email);

  try {
    const student = await Student.findOne({ email });

    if (!student) {
      console.log('Student not found for email:', email);
      return res.status(401).json({ message: "بيانات غير صحيحة" });
    }

    console.log('Student found. Comparing passwords...');
    const match = await bcrypt.compare(password, student.password);

    console.log('Password comparison result:', match);
    if (!match) return res.status(401).json({ message: "بيانات غير صحيحة" });

    const token = signToken({ id: student._id, role: "student" });
    res.cookie("studentToken", token, COOKIE_OPTS);
    res.json({ message: "success", student });
  } catch (err) {
    console.error("loginStudent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const decodeToken = token => jwt.verify(token, JWT_SECRET);

module.exports = { loginStudent, decodeToken };
