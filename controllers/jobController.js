// controllers/jobController.js
const Job = require('../models/Job');
const Company = require('../models/Company');

const jobController = {
  create: async (req, res) => {
    try {
      // find company attached to this user (company must create their company profile first)
      const company = await Company.findOne({ user: req.user.id });
      if (!company) return res.status(400).json({ success: false, message: "Company profile not found" });

      const { title, description, location, salary, type, requirements, deadline } = req.body;
      const job = new Job({
        company: company._id,
        title,
        description,
        location,
        salary,
        type,
        requirements,
        deadline,
        status: "pending",
      });
      await job.save();
      res.status(201).json({ success: true, message: "Job posted successfully", data: job });
    } catch (err) {
      console.error("Job create error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  all: async (req, res) => {
    try {
      let jobs;
      if (req.user.role === "admin") {
        jobs = await Job.find().populate("company", "name");
      } else if (req.user.role === "student") {
        jobs = await Job.find({ status: "approved" }).populate("company", "name");
      } else if (req.user.role === "company") {
        const company = await Company.findOne({ user: req.user.id });
        jobs = company ? await Job.find({ company: company._id }).populate("company", "name") : [];
      }
      res.json({ success: true, count: jobs.length, data: jobs });
    } catch (err) {
      console.error("Jobs fetch error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  one: async (req, res) => {
    try {
      const doc = await Job.findById(req.params.id).populate("company", "name");
      if (!doc) return res.status(404).json({ message: "Job not found" });
      res.json({ success: true, data: doc });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  approve: async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, { status: "approved" }, { new: true }).populate("company", "name");
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      res.json({ success: true, data: job });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  reject: async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(req.params.id, { status: "rejected" }, { new: true }).populate("company", "name");
      if (!job) return res.status(404).json({ success: false, message: "Job not found" });
      res.json({ success: true, data: job });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const doc = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("company", "name");
      if (!doc) return res.status(404).json({ message: "Job not found" });
      res.json({ success: true, data: doc, message: "Updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  remove: async (req, res) => {
    try {
      const doc = await Job.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Job not found" });
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = jobController;
