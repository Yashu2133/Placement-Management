const Application = require('../models/Application');
const Interview = require('../models/Interview');
const PlacementDrive = require('../models/PlacementDrive');
const Job = require('../models/Job');
const Report = require('../models/Report');

const reportController = {
  
  generateForDrive : async (req, res) => {
  try {
    const driveId = req.params.driveId;
    const drive = await PlacementDrive.findById(driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    const jobs = await Job.find({ placementDrive: driveId }).select('_id');
    const jobIds = jobs.map(j => j._id);

    const participantCount = await Application.countDocuments({ job: { $in: jobIds } });
    const interviewCount = await Interview.countDocuments({ job: { $in: jobIds } });
    const offersMade = await Application.countDocuments({ job: { $in: jobIds }, status: "Hired" });
    const studentsPlaced = offersMade;

    const payload = {
      placementDrive: driveId,
      participantCount,
      interviewCount,
      offersMade,
      studentsPlaced,
      startDate: drive.startDate,
      endDate: drive.endDate,
      summary: `Drive ${drive.title} summary`
    };

    const report = await Report.findOneAndUpdate({ placementDrive: driveId }, payload, { upsert: true, new: true });
    res.json({ success: true, data: report });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

  overallSummary : async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();
    const totalHires = await Application.countDocuments({ status: "Hired" });

    const trendByMonth = await Application.aggregate([
      { $group: { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { "_id.y": 1, "_id.m": 1 } }
    ]);

    res.json({ success: true, data: { totalApplications, totalInterviews, totalHires, trendByMonth } });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

}






module.exports = reportController;