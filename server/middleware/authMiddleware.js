const jwt = require('jsonwebtoken');
const Admin = require('../model/adminModel');

exports.protect = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة'
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // 3. Check if admin still exists
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({
        message: 'المستخدم غير موجود'
      });
    }

    // 4. Grant access to protected route
    req.user = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      message: 'غير مصرح بالوصول'
    });
  }
}; 