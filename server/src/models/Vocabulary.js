import mongoose from 'mongoose';
import { normalizeTerm } from '../utils/normalize.js';

export const CONTENT_TYPES = ['word', 'idiom', 'phrase', 'phrasal_verb', 'one_word_substitution'];
export const DIFFICULTIES = ['easy', 'medium', 'hard'];
export const CATEGORIES = [
  'General',
  'Economy',
  'Governance',
  'Finance',
  'Society',
  'Science',
  'Politics'
];

const meaningWithExampleSchema = new mongoose.Schema({
  hindiMeaning: { type: String, required: true, trim: true },
  exampleSentence: { type: String, required: true, trim: true },
  exampleHindiTranslation: { type: String, required: true, trim: true }
}, { _id: false });

const vocabularySchema = new mongoose.Schema({
  // The primary display term (e.g., "Abundant")
  term: { 
    type: String, 
    required: [true, 'English term is required'], 
    trim: true 
  },

  // Case-insensitive, whitespace-collapsed normalized string (e.g., "abundant")
  normalizedTerm: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true,
    index: true 
  },

  // Linguistic content type (defaults to 'word')
  contentType: { 
    type: String, 
    enum: CONTENT_TYPES, 
    default: 'word',
    required: true, 
    index: true 
  },

  // Linguistic attributes
  partsOfSpeech: [{ 
    type: String, 
    lowercase: true, 
    trim: true 
  }],

  pronunciation: {
    ipa: { type: String, default: '' },
    phonetic: { type: String, default: '' },
    audioUrl: { type: String, default: '' }
  },

  // English definition(s)
  englishDefinitions: [{ 
    type: String, 
    required: true, 
    trim: true 
  }],

  // All relevant Hindi meanings
  hindiMeanings: [{ 
    type: String, 
    required: true, 
    trim: true 
  }],

  // One English example sentence for EACH Hindi meaning, with Hindi translation
  meaningsWithExamples: [meaningWithExampleSchema],

  // Associations
  synonyms: [{ type: String, trim: true }],
  antonyms: [{ type: String, trim: true }],
  relatedWords: [{ type: String, trim: true }],

  // Memory hooks & notes
  mnemonic: { type: String, default: '', trim: true },
  usageNotes: { type: String, default: '', trim: true },
  etymology: { type: String, default: '', trim: true },

  // Universal competitive-exam categorization
  difficulty: { 
    type: String, 
    enum: DIFFICULTIES, 
    default: 'medium', 
    index: true 
  },
  category: { 
    type: String, 
    enum: CATEGORIES, 
    default: 'General', 
    index: true 
  },

  // Enrichment metadata
  enrichment: {
    enrichedBy: { 
      type: String, 
      enum: ['system_curated', 'gemini_ai', 'user_manual'], 
      default: 'system_curated' 
    },
    enrichedAt: { type: Date, default: Date.now },
    isVerified: { type: Boolean, default: true }
  },

  // Type-specific extensibility for future content types (idioms, phrases, etc.)
  typeSpecific: {
    substituteFor: { type: String, default: '' },
    baseVerb: { type: String, default: '' },
    particle: { type: String, default: '' },
    literalMeaning: { type: String, default: '' }
  },

  // Ownership & Access Control
  isSystem: { 
    type: Boolean, 
    default: false, 
    index: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null, 
    index: true 
  }
}, { timestamps: true });

// Pre-save hook: auto-compute normalizedTerm if missing or modified
vocabularySchema.pre('validate', function(next) {
  if (this.term && (!this.normalizedTerm || this.isModified('term'))) {
    this.normalizedTerm = normalizeTerm(this.term);
  }
  next();
});

// DATABASE CONSTRAINT: Absolute duplicate prevention per content type
vocabularySchema.index({ normalizedTerm: 1, contentType: 1 }, { unique: true });

// Compound text search index for fast multilingual search
vocabularySchema.index({
  term: 'text',
  hindiMeanings: 'text',
  englishDefinitions: 'text',
  synonyms: 'text',
  mnemonic: 'text'
}, {
  weights: {
    term: 10,
    synonyms: 6,
    hindiMeanings: 5,
    englishDefinitions: 4,
    mnemonic: 2
  },
  name: 'VocabTextSearchIndex'
});

// Ownership Authorization Helper
vocabularySchema.methods.canModify = function(userId) {
  if (this.isSystem) return false;
  if (!this.createdBy || !userId) return false;
  return this.createdBy.toString() === userId.toString();
};

export const Vocabulary = mongoose.model('Vocabulary', vocabularySchema);
