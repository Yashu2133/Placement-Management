const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  placementDrive: { type: mongoose.Schema.Types.ObjectId, ref: "PlacementDrive", required: true, unique: true },
  participantCount: { type: Number, default: 0 },
  interviewCount: { type: Number, default: 0 },
  offersMade: { type: Number, default: 0 },
  studentsPlaced: { type: Number, default: 0 },
  startDate: { type: Date, required: true },
  endDate: {
    type: Date, required: true,
    validate: { validator: function(v){ return v >= this.startDate; }, message: "End date must be >= start date" }
  },
  summary: String
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema, "Reports");
