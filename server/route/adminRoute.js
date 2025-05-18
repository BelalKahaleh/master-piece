const express = require('express');
const router = express.Router();
const { getAdmins, createAdmin, deleteAdmin } = require('../controller/adminController.js');
const { login } = require('../middleware/auth');

router.post('/',   createAdmin);
router.delete('/:id', deleteAdmin);
router.get('/', getAdmins);
router.post('/login', login);

module.exports = router;
