const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const sendEmail = require('../utils/sendEmail');

const interviewController ={
  
  create :async (req, res) => {
    try {
      const { jobId, studentId, startTime, interviewType, platform, meetingLink, location } = req.body;

      // Validation: location required only for Offline
      if (interviewType === "Offline" && !location) {
        return res.status(400).json({ success: false, message: "Location is required for offline interviews" });
      }

      // Validation: platform+link required only for Online/Hybrid
      if ((interviewType === "Online" || interviewType === "Hybrid") && (!platform || !meetingLink)) {
        return res.status(400).json({ success: false, message: "Platform and meeting link are required for online/hybrid interviews" });
      }

      // ✅ Check that the candidate has an application for this job and is shortlisted
      const application = await Application.findOne({ jobId, studentId })
      .populate("studentId", "name email")
  .populate("jobId", "title");

      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }

      if (application.status !== "shortlisted") {
        return res.status(400).json({ success: false, message: "Only shortlisted applicants can have interviews scheduled" });
      }
const interview = await Interview.create({
  job: jobId,
  candidate: studentId,
  application: application._id, // ✅ link to Application
  startTime,
  interviewType,
  platform: (interviewType !== "Offline") ? platform : undefined,
  meetingLink: (interviewType !== "Offline") ? meetingLink : undefined,
  location: (interviewType === "Offline") ? location : undefined,
});

      // ✅ Update application status to "interview_scheduled"
      application.status = "interview_scheduled";
      application.interviewDate = startTime;
      await application.save();

      // ✅ Send notification to the student
      await Notification.create({
        userId: studentId,
        message: `Your interview for the Job: ${application.jobId.title} has been scheduled on ${new Date(startTime).toLocaleString()}.`,
        type: "interview"
      });

      await sendEmail({
  to: application.studentId.email,
  subject: "Interview Scheduled",
  text: `Hello ${application.studentId.name},\n\nYour interview for the job "${application.jobId.title}" has been scheduled on ${new Date(startTime).toLocaleString()}. Please be on time.`,
});

      res.json({ success: true, data: interview, message: "Interview created and application updated" });

    } catch (err) {
      console.error("Create interview error:", err);
      res.status(500).json({ success: false, message: "Server error",error: err.message });
    }
  },


  all: async (req, res) => {
  try {
    const user = req.user; // { id, role }

    let query = {};
    let populateOptions = [
      { path: "candidate", select: "name email" },
      {
        path: "job",
        select: "title company",
        populate: { path: "company", select: "name" }
      }
    ];

    const docs = await Interview.find(query)
      .populate(populateOptions[0])
      .populate(populateOptions[1]);

    let filteredDocs = docs;

    if (user.role === "company" && user.companyId) {
  filteredDocs = docs.filter(
    (doc) =>
      doc.job &&
      doc.job.company &&
      doc.job.company._id.toString() === user.companyId.toString()
  );
}

    res.json({
      success: true,
      count: filteredDocs.length,
      data: filteredDocs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

   one : async (req, res) => {
  try {
    const doc = await Interview.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Interview not found" });
    res.json({ success: true, data: doc });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

  update : async (req, res) => {
  try {
    const doc = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ message: "Interview not found" });
    res.json({ success: true, data: doc, message: "Interview updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

  remove : async (req, res) => {
  try {
    const doc = await Interview.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Interview not found" });
    res.json({ success: true, message: "Interview deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

hireCandidate: async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    interview.result = "Hired";
    await interview.save();

    if (interview.application) {
      const app = await Application.findById(interview.application);
      if (app) {
        app.status = "Hired"; // ✅ now passes validation
        await app.save();
      }
    }

    res.json({ success: true, message: "Candidate hired successfully", interview });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


rejectCandidate: async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: "Interview not found" });

    interview.result = "Rejected";
    await interview.save();

    if (interview.application) {
      const app = await Application.findById(interview.application);
      if (app) {
        app.status = "Rejected";
        await app.save();
      }
    }

    res.json({ success: true, message: "Candidate rejected successfully", interview });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

}


module.exports = interviewController;