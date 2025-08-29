const mongoose = require("mongoose");

const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: [true, "Student name is required"] },
  rollNo: { type: String, trim: true },
  department: { type: String, trim: true },
  cgpa: { type: Number, min: 0, max: 10 },
  achievements: [String],
  resumeUrl: { type: String, match: [urlRegex, "Invalid URL"] },
  portfolioLinks: [{ type: String, match: [urlRegex, "Invalid URL"] }],
  skills: [String],
  education: [{
    institution: String,
    degree: String,
    fieldOfStudy: String,
    startYear: Number,
    endYear: Number
  }],
  experience: [{
    company: String,
    role: String,
    startDate: Date,
    endDate: Date,
    description: String
  }]
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema, "Students");
