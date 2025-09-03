const PlacementDrive = require('../models/PlacementDrive');

const placementController = {

  create : async (req, res) => {
  try {
    const doc = await PlacementDrive.create(req.body);
    res.status(201).json({ success: true, data: doc, message: "Placement drive created" });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

  all : async (req, res) => {
  try {
    const list = await PlacementDrive.find();
    res.json({ success: true, count: list.length, data: list });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

   one : async (req, res) => {
  try {
    const doc = await PlacementDrive.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Placement drive not found" });
    res.json({ success: true, data: doc });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

  update : async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (startDate && endDate && new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: "End date must be later than start date" });
    }
    const doc = await PlacementDrive.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Placement drive not found" });
    Object.assign(doc, req.body);
    await doc.save();
    res.json({ success: true, data: doc, message: "Placement drive updated" });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

  remove : async (req, res) => {
  try {
    const doc = await PlacementDrive.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Placement drive not found" });
    res.json({ success: true, message: "Placement drive deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
},

}

module.exports = placementController;