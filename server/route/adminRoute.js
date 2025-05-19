const express = require('express');
const router = express.Router();
const { getAdmins, createAdmin, deleteAdmin } = require('../controller/adminController.js');
const { login, logout } = require('../middleware/auth');
const { protect, restrictToAdmin } = require('../middleware/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', protect, restrictToAdmin, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

// Protected admin routes
router.use(protect); // Apply protection to all routes below
router.use(restrictToAdmin); // Ensure only admins can access these routes

router.get('/', getAdmins);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;
