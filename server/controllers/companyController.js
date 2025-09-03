const Company = require('../models/Company');


const companyController = {
  createOrUpdate: async (req, res) => {
    try {
      const { name, industry, location, website, description, employees } = req.body;
      let company = await Company.findOne({ user: req.user.id });

      if (company) {
        Object.assign(company, { name, industry, location, website, description, employees });
        await company.save();
        return res.json({ success: true, message: "Company profile updated", data: company });
      }

      company = new Company({ user: req.user.id, name, industry, location, website, description, employees });
      await company.save();
      res.status(201).json({ success: true, message: "Company profile created", data: company });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  me: async (req, res) => {
  try {
    const company = await Company.findOne({ user: req.user.id });
    if (!company) {
      return res.json({
        success: true,
        company: { name: "", website: "", location: "", description: "", employees: 0 },
      });
    }
    res.json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
},

   all: async (req, res) => {
    try {
      const list = await Company.find().populate('user', 'name email');
      res.json({ success: true, count: list.length, data: list });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  update: async (req, res) => {
    try {
      const company = await Company.findOneAndUpdate({ user: req.user.id }, req.body, { new: true });
      if (!company) return res.status(404).json({ success: false, message: "No company profile found" });
      res.json({ success: true, data: company });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  one: async (req, res) => {
    try {
      const doc = await Company.findById(req.params.id).populate('userId', 'name email');
      if (!doc) return res.status(404).json({ message: "Company not found" });
      res.json({ success: true, data: doc });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  remove: async (req, res) => {
    try {
      const doc = await Company.findByIdAndDelete(req.params.id);
      if (!doc) return res.status(404).json({ message: "Company not found" });
      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};


module.exports = companyController;