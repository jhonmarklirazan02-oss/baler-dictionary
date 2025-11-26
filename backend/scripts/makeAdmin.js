const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const makeAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    const username = 'admin'; //username para sa admin

    const user = await User.findOneAndUpdate(
      { username },
      { isAdmin: true },
      { new: true }
    );

    if (user) {
      console.log(`✅ ${username} is now an admin!`);
    } else {
      console.log(`❌ User ${username} not found`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

makeAdmin();