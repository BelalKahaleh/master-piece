// File: server/controllers/newsController.js
const News = require('../model/newsModel')

exports.getAllNews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const [news, totalCount] = await Promise.all([
      News.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      News.countDocuments({ isDeleted: false })
    ]);

    res.json({
      news,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (err) {
    console.error('Error in getAllNews:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getNews = async (req, res) => {
  try {
    const item = await News.findById(req.params.id);
    if (!item || item.isDeleted) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(item);
  } catch (err) {
    console.error('Error in getNews:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.createNews = async (req, res) => {
  try {
    const { title, details, tags } = req.body;
    const tagsArr = tags ? tags.split(',').map(t => t.trim()) : [];
    const images = req.files ? req.files.map(f => f.filename) : [];
    
    const news = await News.create({ 
      title, 
      details, 
      tags: tagsArr, 
      images 
    });
    
    res.status(201).json(news);
  } catch (err) {
    console.error('Error in createNews:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.updateNews = async (req, res) => {
  try {
    const { title, details, tags } = req.body;
    const tagsArr = tags ? tags.split(',').map(t => t.trim()) : [];
    
    const updateData = {
      title,
      details,
      tags: tagsArr
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => f.filename);
    }

    const news = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    res.json(news);
  } catch (err) {
    console.error('Error in updateNews:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error in deleteNews:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

