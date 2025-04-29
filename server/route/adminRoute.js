const express = require('express');
const router = express.Router();
const { getAdmins, createAdmin, deleteAdmin } = require('../controller/adminController.js');

router.get('/', getAdmins);
router.post('/', createAdmin);
router.delete('/:id', deleteAdmin);
module.exports = router;
