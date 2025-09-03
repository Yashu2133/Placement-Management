// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    status: {
      type: String,
      enum: [
        "submitted",
        "reviewed",
        "shortlisted",
        "interview_scheduled",
        "offered",
        "rejected",
        "Hired"
      ],
      default: "submitted",
    },
    resumeUrl: String,
    coverLetter: String,
    interviewDate: Date,
    feedback: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema, "Applications");
