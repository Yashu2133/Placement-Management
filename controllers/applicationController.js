// controllers/applicationController.js
const Application = require("../models/Application");
const Job = require("../models/Job");
const Company = require("../models/Company");

const applicationController = {
create: async (req, res) => {
  try {
    const { jobId, coverLetter } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: "jobId is required" });

    // FIXED populate here
    const jobDoc = await Job.findById(jobId).populate("company", "name");
    if (!jobDoc) return res.status(404).json({ success: false, message: "Job not found" });
    if (jobDoc.status !== "approved") return res.status(400).json({ success: false, message: "Job is not approved yet" });

    // prevent duplicates
    const existing = await Application.findOne({ studentId: req.user.id, jobId: jobDoc._id });
    if (existing) return res.status(400).json({ success: false, message: "You already applied for this job" });

    const resumeUrl = (req.file && `/uploads/${req.file.filename}`) || req.body.resume || "";

    const app = new Application({
      studentId: req.user.id,
      jobId: jobDoc._id,
      resumeUrl,
      coverLetter: coverLetter || "",
      status: "submitted",
    });

    await app.save();

    const populated = await Application.findById(app._id)
      .populate("studentId", "name email")
      .populate({
        path: "jobId",
        select: "title company",
        populate: { path: "company", select: "name" },
      });

    res.status(201).json({ success: true, message: "Application submitted", data: populated });
  } catch (err) {
    console.error("Submit application error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
},


  // STUDENT: get my applications
 my: async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.user.id })
      .populate({
        path: "jobId",
        select: "title company",   // ✅ use company not companyId
        populate: { path: "company", select: "name" }, // ✅ match schema
      });

    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


  // COMPANY: get applicants for this company's jobs
  company: async (req, res) => {
    try {
      const apps = await Application.find()
        .populate("studentId", "name email")
        .populate({
  path: "jobId",
  select: "title company",
  populate: { path: "company", select: "name" },
})

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
  populate: { path: "company", select: "name" }, // ✅
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
 updateStatus : async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: "Not found" });

    if (app.status !== "submitted") {
      return res.status(400).json({ success: false, message: "Status already decided" });
    }

    const { status } = req.body;
    if (!["shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    app.status = status;
    await app.save();
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
},


};

module.exports = applicationController;
