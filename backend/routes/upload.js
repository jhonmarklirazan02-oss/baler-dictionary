const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'baler-dictionary/audio', // Folder in Cloudinary
    resource_type: 'auto', // Automatically detect file type
    allowed_formats: ['mp3', 'wav', 'ogg', 'm4a', 'webm'],
    public_id: (req, file) => {
      // Generate unique filename
      const nameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
      return `${Date.now()}-${nameWithoutExt}`;
    }
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'audio/mpeg',       // mp3
    'audio/wav',        // wav
    'audio/wave',       // wav
    'audio/ogg',        // ogg
    'audio/mp4',        // m4a
    'audio/x-m4a',      // m4a
    'audio/webm'        // webm
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    console.log('✅ File accepted:', file.originalname, 'Type:', file.mimetype);
    return cb(null, true);
  } else {
    console.log('❌ File rejected:', file.originalname, 'Type:', file.mimetype);
    cb(new Error(`Only audio files are allowed. You uploaded: ${file.mimetype}`));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: fileFilter
});

// Admin-only route - Upload audio to Cloudinary
router.post('/', authMiddleware, adminAuth, (req, res) => {
  upload.single('audio')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      console.error('❌ Upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('✅ Audio uploaded to Cloudinary:', req.file.filename);
    console.log('🌐 Cloudinary URL:', req.file.path);

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename, // Cloudinary public_id
      url: req.file.path, // Full Cloudinary URL
      originalName: req.file.originalname,
      size: req.file.size
    });
  });
});

// Admin-only route - Delete audio from Cloudinary
router.delete('/:filename', authMiddleware, adminAuth, async (req, res) => {
  try {
    const filename = req.params.filename;
    // The public_id includes the folder path
    const publicId = `baler-dictionary/audio/${filename}`;

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });

    if (result.result === 'ok') {
      console.log('✅ File deleted from Cloudinary:', filename);
      res.json({ message: 'File deleted successfully' });
    } else {
      console.log('⚠️ File not found in Cloudinary:', filename);
      res.status(404).json({ message: 'File not found' });
    }

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      message: 'File deletion failed',
      error: error.message
    });
  }
});

module.exports = router;
