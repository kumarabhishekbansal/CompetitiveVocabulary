import mongoose from 'mongoose';

export const QUIZ_TYPES = [
  'word_to_meaning', 
  'meaning_to_word', 
  'synonym', 
  'antonym', 
  'one_word_sub', 
  'idiom_phrase', 
  'phrasal_verb',
  'weak_words', 
  'revision', 
  'mixed'
];

const questionItemSchema = new mongoose.Schema({
  vocabularyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vocabulary' },
  questionType: { type: String, required: true },
  prompt: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  userAnswer: { type: String, default: null },
  isCorrect: { type: Boolean, default: false }
}, { _id: false });

const quizSessionSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true, 
    index: true 
  },
  quizType: { 
    type: String, 
    required: true,
    enum: QUIZ_TYPES 
  },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, default: 0 },
  score: { type: Number, default: 0 }, // Percentage
  timeSpentSeconds: { type: Number, default: 0 },
  questions: [questionItemSchema]
}, { timestamps: true });

export const QuizSession = mongoose.model('QuizSession', quizSessionSchema);
