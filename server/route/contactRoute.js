const express = require('express')
const {
  createContactMessage,
  getAllMessages,
  getMessageById,
  toggleRead,
  sendReply
} = require('../controller/contactController')
const router = express.Router()

router.post('/contact', createContactMessage)
router.get('/contact', getAllMessages)
router.get('/contact/:id', getMessageById)
router.patch('/contact/:id/read', toggleRead)
router.post('/contact/:id/reply', sendReply)

module.exports = router
