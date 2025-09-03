const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: {
    type: Date, validate: { validator: function(v){ return !v || v > this.startTime; }, message: "End time must be after start time" }
  },
 startTime: { type: Date, required: true }, 
  interviewType: { type: String, enum: ["Online","Offline","Hybrid"], default: "Online" },
  platform: { type: String },
  meetingLink: { type: String },
  location: { type: String },
  platform: String,         // e.g., Zoom, Meet
  meetingLink: String,      
  meetingId: String,
  meetingPassword: { type: String, select: false },
  interviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["Scheduled","Completed","Cancelled"], default: "Scheduled" },
   result: { type: String, enum: ["Pending", "Hired", "Rejected"], default: "Pending" },
   application: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  feedback: String,
  score: { type: Number, min: 0, max: 100 },
  result: { type: String, enum: ["Pending","Shortlisted","Rejected","Selected","Hired"], default: "Pending" },
  videoProvider: {
    providerName: String,        
    externalMeetingId: String,
    webhookStatus: { type: String, enum: ["pending","completed","failed","cancelled"], default: "pending" }
  }
}, { timestamps: true });

interviewSchema.index({ candidate: 1, startTime: 1 });
interviewSchema.index({ job: 1, startTime: 1 });
interviewSchema.index({ job: 1, status: 1 });

module.exports = mongoose.model("Interview", interviewSchema, "Interviews");
