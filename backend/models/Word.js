const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
  tagalog: {
    type: String,
    required: true,
    trim: true
  },
  baler: {
    type: String,
    required: true,
    trim: true
  },
  english: {
    type: String,
    required: true,
    trim: true
  },
  definition: {
    type: String,
    default: '',
    trim: true
  },
  audio: {
    type: String,
    default: ''
  },
  wordType: {
    type: [String],
    enum: [
      'noun',
      'verb', 
      'adjective',
      'adverb',
      'pronoun',
      'preposition',
      'conjunction',
      'interjection',
      'phrase',
      'expression'
    ],
    default: []
  },
  exampleSentence: {
    type: String,
    default: '',
    trim: true
  },
  
  verbForms: {
    present: { type: String, default: '' }, 
    past: { type: String, default: '' }
  },
  adjectiveForms: {
    descriptive: { type: String, default: '' },
    demonstrative: { type: String, default: '' },
    quantitative: { type: String, default: '' }
  },
  nounForms: {
    singular: { type: String, default: '' },
    plural: { type: String, default: '' }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Word', wordSchema);