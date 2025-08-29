const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const { JWT_SECRET } = require('../utils/config');

  const sign = (user) => jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

const authController = {
  register : async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    const user = new User({ name, email, password, role });
    await user.save();
    const token = sign(user);
    const { password: _, ...data } = user.toObject();
    res.status(201).json({ success: true, user: data, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

login : async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const token = sign(user);
    const { password: _, ...data } = user.toObject();

    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ success: true, user: data, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

logout : async (req, res) => {
  try {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

profile: async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let student = null;
    if (user.role === "student") {
      student = await Student.findOne({ userId: user._id }); 
    }

    res.status(200).json({ user, student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},


updateRole : async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
},

}

module.exports= authController;
