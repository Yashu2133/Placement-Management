const Interview = require('../models/Interview');
const Application = require('../models/Application');
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
      const application = await Application.findOne({ jobId, studentId });

      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }

      if (application.status !== "shortlisted") {
        return res.status(400).json({ success: false, message: "Only shortlisted applicants can have interviews scheduled" });
      }

      // ✅ Create the interview
      const interview = await Interview.create({
        job: jobId,
        candidate: studentId,
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

      res.json({ success: true, data: interview, message: "Interview created and application updated" });

    } catch (err) {
      console.error("Create interview error:", err);
      res.status(500).json({ success: false, message: "Server error",error: err.message });
    }
  },


   all : async (req, res) => {
  try {
    const docs = await Interview.find().populate('job', 'title').populate('candidate', 'name email');
    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) { res.status(500).json({ message: err.message }); }
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

}


module.exports = interviewController;