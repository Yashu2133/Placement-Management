const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require('../models/Notification');
const sendEmail = require("../utils/sendEmail");


const applicationController = {
create: async (req, res) => {
    try {
      const { jobId } = req.body;
      const studentId = req.user.id;

      // Check job exists
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }

      // ❌ Block if deadline passed
      const now = new Date();
      if (job.deadline && now > job.deadline) {
        return res.status(400).json({ success: false, message: "Job application deadline has passed" });
      }

      // Check if already applied
      const existing = await Application.findOne({ jobId, studentId });
      if (existing) {
        return res.status(400).json({ success: false, message: "Already applied for this job" });
      }

      const application = await Application.create({
        jobId,
        studentId,
        status: "submitted",
        appliedAt: now,
      });

      res.status(201).json({ success: true, data: application, message: "Application submitted" });
    } catch (err) {
      console.error("Application create error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // STUDENT: get my applications
 my: async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.user.id })
      .populate({
        path: "jobId",
        select: "title company",   
        populate: { path: "company", select: "name" }, 
      });

    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


 // COMPANY: get applicants for this company's jobs
company: async (req, res) => {
  try {
    // find logged-in company
    const company = await require("../models/Company").findOne({ user: req.user.id });
    if (!company) {
      return res.status(400).json({ success: false, message: "Company profile not found" });
    }

    // only apps for jobs that belong to this company
    const apps = await Application.find()
      .populate("studentId", "name email")
      .populate({
        path: "jobId",
        match: { company: company._id }, 
        populate: { path: "company", select: "name" },
      });

    // filter out apps where jobId got nulled by the match
    const filtered = apps.filter(app => app.jobId !== null);

    res.json({ success: true, data: filtered });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


  // ADMIN: all applications
  all: async (req, res) => {
    try {
      const apps = await Application.find()
        .populate("studentId", "name email")
        .populate({
  path: "jobId",
  select: "title company",
  populate: { path: "company", select: "name" },
});

      res.json({ success: true, data: apps });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // get single
  one: async (req, res) => {
    try {
      const doc = await Application.findById(req.params.id)
        .populate("studentId", "name email")
        .populate({
  path: "jobId",
  select: "title company",
  populate: { path: "company", select: "name" },
})


      if (!doc) return res.status(404).json({ success: false, message: "Application not found" });
      res.json({ success: true, data: doc });
    } catch (err) {
      console.error("One application error:", err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

// PUT /applications/:id/status
updateStatus: async (req, res) => {
  try {
    const { status, interviewDate } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    // Only allow certain statuses
    const validStatuses = ["submitted", "shortlisted", "interview", "hired", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const app = await Application.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("jobId", "title");

    if (!app) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    app.status = status;
    if (status === "interview" && interviewDate) {
      app.interviewDate = interviewDate;
    }
    await app.save();

    // 🔔 Notifications + Email
    try {
      if (status === "shortlisted") {
        await Notification.create({
          userId: app.studentId._id,
          type: "application",
          message: `You have been shortlisted for the job: ${app.jobId.title}`,
        });

        await sendEmail({
          to: app.studentId.email,
          subject: "Shortlisted for Job",
          text: `Hello ${app.studentId.name},\n\nYou have been shortlisted for the job: ${app.jobId.title}. Please check your dashboard for more details.`,
        });
      }
    } catch (notifyErr) {
      console.error("⚠️ Notification/Email failed:", notifyErr.message);
    }

    res.json({ success: true, data: app, message: "Application status updated" });
  } catch (err) {
    console.error("Application updateStatus error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
}



};

module.exports = applicationController;
