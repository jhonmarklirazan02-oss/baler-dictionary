const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const audioDir = path.join(__dirname, '../uploads/audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, audioDir);
  },
  filename: (req, file, cb) => {
    let originalName = file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    const nameWithoutExt = path.basename(originalName, ext);
    
    const uniqueName = `${Date.now()}-${nameWithoutExt}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.webm'];
  
  if (allowedExtensions.includes(ext)) {
    console.log('✅ File accepted:', file.originalname, 'Type:', file.mimetype);
    return cb(null, true);
  } else {
    console.log('❌ File rejected:', file.originalname, 'Type:', file.mimetype);
    cb(new Error(`Only audio files are allowed (${allowedExtensions.join(', ')}). You uploaded: ${ext}`));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, //10 mb
  fileFilter: fileFilter
});

// Admin-only route - requires authentication
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

    console.log('✅ Audio uploaded successfully:', req.file.filename);
    console.log('📁 Saved to:', path.join(audioDir, req.file.filename));

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  });
});

// Admin-only route - requires authentication
router.delete('/:filename', authMiddleware, adminAuth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(audioDir, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ File deleted:', filename);
      res.json({ message: 'File deleted successfully' });
    } else {
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