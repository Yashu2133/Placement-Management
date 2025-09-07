const Job = require('../models/Job');
const Company = require('../models/Company');
const Notification = require('../models/Notification');
const User = require('../models/User');            
const sendEmail = require('../utils/sendEmail'); 
const Application = require('../models/Application');


const jobController = {
  create: async (req, res) => {
    try {
      const company = await Company.findOne({ user: req.user.id });
      if (!company) {
        return res.status(400).json({ success: false, message: "Company profile not found" });
      }

      const { title, description, location, salary, type, requirements, deadline } = req.body;

      const job = await Job.create({
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

      // 🔔 Notify all admins that a new job needs approval
      const admins = await User.find({ role: "admin" }, "_id name email");
      if (admins && admins.length) {
        await Promise.all(
          admins.map(a =>
            Notification.create({
              userId: a._id,
              type: "system", 
              message: `New job "${job.title}" posted by ${company.name}. Please review.`,
            })
          )
        );
      }

      res.status(201).json({
        success: true,
        message: "Job posted successfully. Pending admin approval.",
        data: job,
      });
    } catch (err) {
      console.error("Job create error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ADMIN: approve
  approve: async (req, res) => {
    try {
      // populate company name + email + user (so we can notify the company user)
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { status: "approved" },
        { new: true }
      ).populate("company", "name email user");

      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      // 🔔 Notify the company user
      if (job.company?.user) {
        await Notification.create({
          userId: job.company.user,   // <-- notify the company USER, not the Company doc
          type: "system",
          message: `Your job "${job.title}" has been approved by the admin.`,
        });
      }

      // 📧 Email (optional)
      if (job.company?.email) {
        await sendEmail({
          to: job.company.email,
          subject: "Job Approved",
          text: `Hello ${job.company.name},\n\nYour job "${job.title}" has been approved by the admin. Students can now apply.`,
        });
      }

      res.json({ success: true, data: job, message: "Job approved and company notified" });
    } catch (err) {
      console.error("Job approve error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // ADMIN: reject
  reject: async (req, res) => {
    try {
      const job = await Job.findByIdAndUpdate(
        req.params.id,
        { status: "rejected" },
        { new: true }
      ).populate("company", "name email user");

      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      // 🔔 Notify the company user
      if (job.company?.user) {
        await Notification.create({
          userId: job.company.user,
          type: "system",
          message: `Your job "${job.title}" has been rejected by the admin.`,
        });
      }

      if (job.company?.email) {
        await sendEmail({
          to: job.company.email,
          subject: "Job Rejected",
          text: `Hello ${job.company.name},\n\nYour job "${job.title}" has been rejected by the admin.`,
        });
      }

      res.json({ success: true, data: job, message: "Job rejected and company notified" });
    } catch (err) {
      console.error("Job reject error:", err);
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

      // find jobs this student already applied for
      const applied = await Application.find({ student: req.user.id }).select("job");
      const appliedJobIds = applied.map(a => a.job.toString());

      jobs = jobs.map(job => ({
        ...job.toObject(),
        alreadyApplied: appliedJobIds.includes(job._id.toString()),
      }));
    } else if (req.user.role === "company") {
      const company = await Company.findOne({ user: req.user.id });
      jobs = company
        ? await Job.find({ company: company._id }).populate("company", "name")
        : [];
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
