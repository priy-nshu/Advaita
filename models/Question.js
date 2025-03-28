const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  category: {
    type: String,
    required: true,
    enum: ['HISTORY', 'MAGIC', 'CREATURES', 'SPELLS', 'POTIONS', 'CHARACTERS']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['EASY', 'MEDIUM', 'HARD'],
    default: 'MEDIUM'
  },
  points: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  explanation: {
    type: String,
    trim: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ usageCount: 1 });

module.exports = mongoose.model('Question', questionSchema); 