// File: backend/controllers/contactController.js
require('dotenv').config()
const Contact = require('../model/contactModel')
const nodemailer = require('nodemailer')

// create new message
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const msg = new Contact({ name, email, message })
    await msg.save()
    res.status(201).json({ message: 'Message sent successfully' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// list all messages
exports.getAllMessages = async (req, res) => {
  try {
    const list = await Contact.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// get one message
exports.getMessageById = async (req, res) => {
  try {
    const msg = await Contact.findById(req.params.id)
    if (!msg) return res.status(404).json({ message: 'Not found' })
    res.json(msg)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// mark read/unread
exports.toggleRead = async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: req.body.read },
      { new: true }
    )
    if (!msg) return res.status(404).json({ message: 'Not found' })
    res.json(msg)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// send reply email
exports.sendReply = async (req, res) => {
  try {
    const { reply } = req.body
    const msg = await Contact.findById(req.params.id)
    if (!msg) return res.status(404).json({ message: 'Not found' })

    // configure transporter using EMAIL_* env vars
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false, // use STARTTLS on port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    // verify SMTP connection
    await transporter.verify()

    // send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: msg.email,
      subject: `رد على رسالتك من ${msg.name}`,
      text: reply
    })

    res.json({ message: 'Reply sent' })
  } catch (err) {
    console.error('sendReply error:', err)
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}
