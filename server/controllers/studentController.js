const Student = require('../models/Student');

const studentController = {
  // Create profile only if not exists
create : async (req, res) => {
  try {
    // check if already exists
    const exists = await Student.findOne({ user: req.user.id });
    if (exists) {
      return res.status(400).json({ message: "Profile already exists for this user" });
    }

    const student = new Student({
      ...req.body,
      userId: req.user.id, 
    });

    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

  // Get all students
  all: async (req, res) => {
    try {
      const list = await Student.find().populate('userId', 'name email');
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get my profile (based on logged-in user)
  me : async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!student) return res.status(404).json({ message: "Profile not found" });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

// fetch profile by student _id
one : async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId', 'name email');
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

  // Update profile by user
 update : async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { userId: req.user.id }, 
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!student) return res.status(404).json({ message: "Profile not found" });

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

  // Admin remove student
  remove: async (req, res) => {
    try {
      const doc = await Student.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Student not found" });
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = studentController;
