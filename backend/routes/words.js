const express = require('express');
const Word = require('../models/Word');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const words = await Word.find().sort({ baler: 1 });
    res.json(words);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const word = await Word.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.json(word);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/', authMiddleware, adminAuth, async (req, res) => {
  try {
    const {
      tagalog,
      baler,
      english,
      audio,
      definition,
      wordType,
      exampleSentence,
      verbForms,
      adjectiveForms,
      nounForms
    } = req.body;

    if (!tagalog || !baler || !english) {
      return res.status(400).json({ message: 'Tagalog, Baler, and English fields are required' });
    }

    const word = new Word({
      tagalog,
      baler,
      english,
      audio: audio || '',
      definition: definition || '',
      wordType: wordType || [],
      exampleSentence: exampleSentence || '',
      verbForms: verbForms || { present: '', past: '' },
      adjectiveForms: adjectiveForms || { descriptive: '', demonstrative: '', quantitative: '' },
      nounForms: nounForms || { singular: '', plural: '' }
    });

    await word.save();
    res.status(201).json({ message: 'Word added successfully', word });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const {
      tagalog,
      baler,
      english,
      audio,
      definition,
      wordType,
      exampleSentence,
      verbForms,
      adjectiveForms,
      nounForms
    } = req.body;

    const word = await Word.findByIdAndUpdate(
      req.params.id,
      {
        tagalog,
        baler,
        english,
        audio,
        definition,
        wordType,
        exampleSentence,
        verbForms,
        adjectiveForms,
        nounForms
      },
      { new: true, runValidators: true }
    );

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json({ message: 'Word updated successfully', word });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const word = await Word.findByIdAndDelete(req.params.id);

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.json({ message: 'Word deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;