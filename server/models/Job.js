const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true }, // unified field
  title: { type: String, required: true },
  description: String,
  location: String,
  salary: String,
  type: { type: String, enum: ["Full-Time", "Part-Time", "Internship"], default: "Full-Time" },
  requirements: [String],
  postedAt: { type: Date, default: Date.now },
  deadline: Date,
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema, "Jobs");
