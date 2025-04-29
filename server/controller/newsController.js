// File: server/controllers/newsController.js
const News = require('../model/newsModel')

exports.getNews = async (req, res) => {
  try {
    const list = await News.find({ isDeleted: false })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.getNewsById = async (req, res) => {
  try {
    const item = await News.findById(req.params.id)
    if (!item || item.isDeleted) return res.status(404).json({ message: 'Not found' })
    res.json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.createNews = async (req, res) => {
  try {
    const { title, details, tags } = req.body
    const tagsArr = tags ? tags.split(',').map(t => t.trim()) : []
    const images = req.files ? req.files.map(f => f.filename) : []
    const news = await News.create({ title, details, tags: tagsArr, images })
    res.status(201).json(news)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

exports.deleteNews = async (req, res) => {
  try {
    await News.findByIdAndUpdate(req.params.id, { isDeleted: true })
    res.json({ message: 'Deleted' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}
