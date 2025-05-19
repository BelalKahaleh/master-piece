const Admin = require('../model/adminModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' });
    
    // Set the token cookie with proper options
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour in milliseconds
    });

    // Set user data in a separate cookie
    const userData = {
      email: admin.email,
      fullName: admin.fullName,
      role: admin.role
    };
    res.cookie('userData', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000 // 1 hour in milliseconds
    });

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add logout handler
exports.logout = (req, res) => {
  // Clear both cookies
  res.clearCookie('token');
  res.clearCookie('userData');
  res.json({ message: 'Logged out successfully' });
};