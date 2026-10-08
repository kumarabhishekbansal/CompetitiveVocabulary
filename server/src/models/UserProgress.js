import mongoose from 'mongoose';

export const PROGRESS_STATUSES = ['unseen', 'learning', 'mastered', 'weak'];

const userProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  vocabularyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vocabulary', 
    required: true, 
    index: true 
  },
  status: { 
    type: String, 
    enum: PROGRESS_STATUSES, 
    default: 'learning',
    index: true 
  },
  isBookmarked: { 
    type: Boolean, 
    default: false, 
    index: true 
  },
  personalNotes: { 
    type: String, 
    default: '', 
    maxlength: 1000 
  },
  
  // Performance metrics
  stats: {
    attempts: { type: Number, default: 0 },
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
    lastAttemptedAt: { type: Date, default: null }
  },

  // Spaced Repetition (SM-2 Ready)
  spacedRepetition: {
    repetitionNumber: { type: Number, default: 0 },
    easeFactor: { type: Number, default: 2.5 },
    intervalDays: { type: Number, default: 1 },
    dueDate: { type: Date, default: Date.now, index: true }
  }
}, { timestamps: true });

// Strict 1-to-1 relationship per user per vocabulary item
userProgressSchema.index({ userId: 1, vocabularyId: 1 }, { unique: true });
userProgressSchema.index({ userId: 1, status: 1 });
userProgressSchema.index({ userId: 1, isBookmarked: 1 });
userProgressSchema.index({ userId: 1, 'spacedRepetition.dueDate': 1 });

export const UserProgress = mongoose.model('UserProgress', userProgressSchema);
