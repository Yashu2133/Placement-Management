const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  name: { type: String, required: true },
  industry: { type: String },
  location: { type: String },
  website: { type: String },
  description: { type: String },
  employees: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
