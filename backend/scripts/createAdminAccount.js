const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const createAdminAccount = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');

    const username = 'admin';
    const password = 'admin123';
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Username: ${username}`);
      console.log(`isAdmin: ${existingUser.isAdmin}`);

      console.log('🔒 Updating password and admin status...');
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
      existingUser.isAdmin = true;
      await existingUser.save();

      console.log('\n✅ ================================');
      console.log('✅ ADMIN ACCOUNT UPDATED!');
      console.log('✅ ================================');
      console.log(`\n📧 Username: ${username}`);
      console.log(`🔑 Password: ${password}`);
      console.log(`🔐 Admin: true`);
      console.log('\n🌐 Login at: http://localhost:5173/admin-login');
      console.log('================================\n');

      process.exit(0);
      return;
    }

    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('👤 Creating admin user...');
    const adminUser = new User({
      username: username,
      password: hashedPassword,
      isAdmin: true
    });

    await adminUser.save();

    console.log('\n✅ ================================');
    console.log('✅ ADMIN ACCOUNT CREATED!');
    console.log('✅ ================================');
    console.log(`\n📧 Username: ${username}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`🔐 Admin: true`);
    console.log('\n🌐 Login at: http://localhost:5173/admin-login');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    console.log('================================\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
    process.exit(1);
  }
};

createAdminAccount();
