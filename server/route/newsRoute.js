// File: server/routes/newsRoutes.js
const express = require('express')
const multer = require('multer')
const controller = require('../controller/newsController')
const router = express.Router()

const upload = multer({ dest: 'uploads/' })

router.get('/', controller.getNews)
router.get('/:id', controller.getNewsById)
router.post('/', upload.array('images'), controller.createNews)
router.delete('/:id', controller.deleteNews)

module.exports = router
