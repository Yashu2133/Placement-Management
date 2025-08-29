const mongoose = require("mongoose");

const placementDriveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  companies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
  interviews: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    date: Date,
    mode: { type: String, enum: ["in-person", "virtual"], default: "virtual" }
  }],
  reports: {
    totalStudents: Number,
    totalInterviews: Number,
    offersMade: Number,
    offersAccepted: Number
  }
}, { timestamps: true });

module.exports = mongoose.model("PlacementDrive", placementDriveSchema, "PlacementDrives");
