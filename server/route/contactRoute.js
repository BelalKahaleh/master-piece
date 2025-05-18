// routes/contactRoute.js
const express = require("express");
const {
  createContactMessage,
  getAllMessages,
  getMessageById,
  toggleRead,
  sendReply,
} = require("../controller/contactController");
const router = express.Router();

// now all paths are relative, e.g. POST /api/contact/
router.post("/", createContactMessage);
router.get("/", getAllMessages);
router.get("/:id", getMessageById);
router.patch("/:id/read", toggleRead);
router.post("/:id/reply", sendReply);

module.exports = router;
