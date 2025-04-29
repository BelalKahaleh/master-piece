// File: server/controllers/adminController.js
const Admin = require("../model/adminModel");

exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.createAdmin = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (await Admin.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });
    const admin = new Admin({ fullName, email, password });
    await admin.save();
    res
      .status(201)
      .json({
        admin: {
          _id: admin._id,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    await Admin.findByIdAndDelete(id);
    res.json({ message: "Admin removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
