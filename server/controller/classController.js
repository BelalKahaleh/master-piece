const Class = require('../model/classModel');
const Student = require('../model/studentModel');

// Arabic alphabet for sorting (ابجد هوز)
const arabicAlphabet = ['أ', 'ب', 'ج', 'د', 'ه', 'و', 'ز', 'ح', 'ط', 'ي', 'ك', 'ل', 'م', 'ن', 'س', 'ع', 'ف', 'ص', 'ق', 'ر', 'ش', 'ت', 'ث', 'خ', 'ذ', 'ض', 'ظ', 'غ'];

// Get all classes
exports.getAllClasses = async (req, res) => {
  try {
    const { populate } = req.query;
    let query = Class.find().sort({ level: 1, grade: 1, section: 1 });

    // Handle population if requested
    if (populate) {
      const populateFields = populate.split(',');
      populateFields.forEach(field => {
        if (field === 'teacher') {
          query = query.populate('teacher');
        } else if (field === 'schedule.teacher') {
          query = query.populate('schedule.teacher');
        }
      });
    }

    const classes = await query;
    res.status(200).json(classes);
  } catch (error) {
    console.error('Error in getAllClasses:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create a new class
exports.createClass = async (req, res) => {
  try {
    const { level, grade, teacher, schedule } = req.body;
    
    console.log('Received class data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!level || !grade || !teacher) {
      console.log('Missing required fields:', { level, grade, teacher });
      return res.status(400).json({ message: 'Level, grade, and teacher are required' });
    }
    
    // Validate level
    if (!['ابتدائي', 'اعدادي', 'ثانوي'].includes(level)) {
      console.log('Invalid level:', level);
      return res.status(400).json({ message: 'Invalid level' });
    }

    // Validate grade
    if (typeof grade !== 'number' || grade < 1 || grade > 12) {
      console.log('Invalid grade:', grade);
      return res.status(400).json({ message: 'Grade must be a number between 1 and 12' });
    }

    // Teacher schedule conflict validation
    for (const slot of schedule) {
      if (!slot.teacher) continue;
      // Check if this teacher is already assigned to another class at the same period and startTime
      const conflict = await Class.findOne({
        'schedule': {
          $elemMatch: {
            period: slot.period,
            startTime: slot.startTime,
            teacher: slot.teacher
          }
        }
      });
      if (conflict) {
        return res.status(400).json({
          message: `المعلم مشغول في هذا الوقت (الحصة ${slot.period} من ${slot.startTime} إلى ${slot.endTime})`
        });
      }
    }

    // Find existing classes with the same level and grade
    const existingClasses = await Class.find({ level, grade }).sort({ section: 1 });

    // Determine the next letter
    let nextSection = 'ا';
    if (existingClasses.length > 0) {
      const lastClass = existingClasses[existingClasses.length - 1];
      const currentLetterIndex = arabicAlphabet.indexOf(lastClass.section);
      if (currentLetterIndex < arabicAlphabet.length - 1) {
        nextSection = arabicAlphabet[currentLetterIndex + 1];
      } else {
        return res.status(400).json({ message: 'Maximum number of classes reached for this level and grade' });
      }
    }

    // Create the class name
    const name = `${level} ${grade}${nextSection}`;

    // Create new class
    const newClass = new Class({
      level,
      grade,
      section: nextSection,
      name,
      teacher,
      schedule
    });

    console.log('Saving new class:', JSON.stringify(newClass, null, 2));

    const savedClass = await newClass.save();
    res.status(201).json(savedClass);
  } catch (error) {
    console.error('Error creating class:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(400).json({ message: error.message });
  }
};

// Get a single class by ID
exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    res.status(200).json(classItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a class
exports.updateClass = async (req, res) => {
  try {
    const { level, number } = req.body;
    const classItem = await Class.findById(req.params.id);

    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Parse number to integer
    const parsedGrade = parseInt(number);
    if (isNaN(parsedGrade)) {
      return res.status(400).json({ message: 'Number must be a valid integer' });
    }

    // If level or grade is being changed, we need to recalculate the section
    if (level !== classItem.level || parsedGrade !== classItem.grade) {
      const existingClasses = await Class.find({ level, grade: parsedGrade }).sort({ section: 1 });
      let nextSection = 'ا';
      if (existingClasses.length > 0) {
        const lastClass = existingClasses[existingClasses.length - 1];
        const currentLetterIndex = arabicAlphabet.indexOf(lastClass.section);
        if (currentLetterIndex < arabicAlphabet.length - 1) {
          nextSection = arabicAlphabet[currentLetterIndex + 1];
        } else {
          return res.status(400).json({ message: 'Maximum number of classes reached for this level and grade' });
        }
      }

      classItem.section = nextSection;
      classItem.name = `${level} ${parsedGrade}${nextSection}`;
    }

    classItem.level = level;
    classItem.grade = parsedGrade;

    const updatedClass = await classItem.save();
    res.status(200).json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a class
exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findById(req.params.id);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }
    await classItem.deleteOne();
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign students to a class
exports.assignStudents = async (req, res) => {
  try {
    const { studentIds } = req.body;
    const classId = req.params.id;

    // Validate input
    if (!studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({ message: 'Student IDs array is required' });
    }

    // Find the class
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Update all students to assign them to this class
    const updateResult = await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: { class: classId } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ message: 'No students were updated' });
    }

    res.status(200).json({ 
      message: 'Students assigned successfully',
      updatedCount: updateResult.modifiedCount
    });
  } catch (error) {
    console.error('Error assigning students:', error);
    res.status(500).json({ message: 'Failed to assign students' });
  }
};

// Get students for a specific class
exports.getClassStudents = async (req, res) => {
  try {
    const classId = req.params.id;
    
    // Find the class first to verify it exists
    const classItem = await Class.findById(classId);
    if (!classItem) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Find all students in this class
    const students = await Student.find({ class: classId })
      .select('-password') // Exclude password
      .sort({ fullName: 1 }); // Sort by name

    res.status(200).json(students);
  } catch (error) {
    console.error('Error in getClassStudents:', error);
    res.status(500).json({ message: 'Failed to fetch class students' });
  }
};
