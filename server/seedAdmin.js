require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGODB_URI } = require('./utils/config');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const email = process.env.SUPERADMIN_EMAIL || "superadmin@gmail.com";
    const password = "2025"; 
    await User.deleteOne({ email });

    // Hash new password
    const hashed = await bcrypt.hash(password, 10);

    // Create fresh superadmin
    const admin = new User({
      name: 'Super Admin',
      email,
      password: hashed,
      role: 'admin',
      isSuperAdmin: true
    });

    await admin.save();
    console.log(`✅ Superadmin created:
    Email: ${email}
    Password: ${password}`);

    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Error seeding superadmin:', err);
    mongoose.connection.close();
  }
})();
