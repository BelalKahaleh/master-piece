// File: server/routes/newsRoutes.js
const express = require('express')
const multer = require('multer')
const controller = require('../controller/newsController')
const router = express.Router()
const upload = require('../middleware/uploadMiddleware')

// Serve static files from uploads directory
router.use('/uploads', express.static('uploads/news'))

// Get all news with pagination
router.get('/', controller.getAllNews)

// Create new news
router.post('/', upload.array('images'), controller.createNews)

// Get single news
router.get('/:id', controller.getNews)

// Update news
router.put('/:id', upload.array('images'), controller.updateNews)

// Delete news
router.delete('/:id', controller.deleteNews)

module.exports = router
