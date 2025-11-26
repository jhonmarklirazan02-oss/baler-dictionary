const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// User routes disabled - Admin-only access
// Profile, password change, and security questions removed

/* DISABLED - User profile route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -securityAnswer');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/security-question', authMiddleware, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedAnswer = await bcrypt.hash(answer.toLowerCase().trim(), 10);
    
    user.securityQuestion = question;
    user.securityAnswer = hashedAnswer;
    await user.save();

    res.json({ message: 'Security question set successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/security-question/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.securityQuestion) {
      return res.status(404).json({ message: 'No security question set' });
    }

    res.json({ question: user.securityQuestion });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
router.post('/reset-password', async (req, res) => {
  try {
    const { username, answer, newPassword } = req.body;

    if (!username || !answer || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.securityAnswer) {
      return res.status(400).json({ message: 'No security question set for this user' });
    }

    const isAnswerValid = await bcrypt.compare(answer.toLowerCase().trim(), user.securityAnswer);
    if (!isAnswerValid) {
      return res.status(401).json({ message: 'Incorrect security answer' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
*/

module.exports = router;