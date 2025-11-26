const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/audio', express.static('uploads/audio'));

//routes
const authRoutes = require('./routes/auth'); // Admin login only
const wordRoutes = require('./routes/words');
const userRoutes = require('./routes/user'); // Disabled - kept for future admin features
const uploadRoutes = require('./routes/upload'); // Admin-only protected

app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/user', userRoutes); // Routes disabled in user.js
app.use('/api/upload', uploadRoutes);  

app.get('/', (req, res) => {
  res.json({ message: 'Baler Dictionary API is running! 🚀' });
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});