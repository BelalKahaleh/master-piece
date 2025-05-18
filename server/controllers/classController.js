exports.createClass = async (req, res) => {
  try {
    const { level, grade, teacher, name, schedule } = req.body;

    // Validate required fields
    if (!level || !grade || !teacher || !name) {
      return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }

    // Validate grade number
    if (grade < 1 || grade > 12) {
      return res.status(400).json({ message: 'Grade must be a number between 1 and 12' });
    }

    // Check if teacher is already assigned to another class
    const existingClass = await Class.findOne({ teacher });
    if (existingClass) {
      return res.status(400).json({ 
        message: 'هذا المعلم مسؤول بالفعل عن فصل آخر',
        existingClass: existingClass.name 
      });
    }

    // Create new class
    const newClass = new Class({
      level,
      grade,
      teacher,
      name,
      schedule
    });

    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error creating class:', error);
    res.status(500).json({ message: 'فشل في إنشاء الفصل' });
  }
}; 