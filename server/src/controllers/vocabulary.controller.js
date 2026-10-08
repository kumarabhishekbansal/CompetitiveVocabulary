import { 
  createVocabulary, 
  findByNormalizedTerm, 
  updateVocabulary, 
  deleteVocabulary 
} from '../services/vocabulary.service.js';
import { Vocabulary } from '../models/Vocabulary.js';

export const createWord = async (req, res, next) => {
  try {
    const newWord = await createVocabulary(req.body, req.user || null);
    res.status(201).json({
      success: true,
      data: newWord
    });
  } catch (err) {
    if (err.isDuplicate || err.statusCode === 409) {
      return res.status(409).json({
        success: false,
        isDuplicate: true,
        statusCode: 409,
        message: err.message,
        existingWord: err.existingWord || null
      });
    }
    next(err);
  }
};

export const checkDuplicate = async (req, res, next) => {
  try {
    const { term, contentType = 'word' } = req.query;
    if (!term) {
      return res.status(400).json({ success: false, message: 'Term query parameter is required' });
    }

    const existing = await findByNormalizedTerm(term, contentType);
    if (existing) {
      return res.status(200).json({
        success: true,
        isDuplicate: true,
        message: `The term "${existing.term}" is already in the vocabulary collection.`,
        existingWord: {
          id: existing._id,
          term: existing.term,
          normalizedTerm: existing.normalizedTerm,
          contentType: existing.contentType,
          category: existing.category,
          difficulty: existing.difficulty,
          isSystem: existing.isSystem,
          primaryHindiMeaning: existing.hindiMeanings?.[0] || '',
          primaryDefinition: existing.englishDefinitions?.[0] || ''
        }
      });
    }

    res.status(200).json({
      success: true,
      isDuplicate: false,
      message: 'Word is available to add.'
    });
  } catch (err) {
    next(err);
  }
};

export const getWords = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.contentType) filter.contentType = req.query.contentType;
    if (req.query.difficulty) filter.difficulty = req.query.difficulty;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.isSystem !== undefined) filter.isSystem = req.query.isSystem === 'true';

    const [words, total] = await Promise.all([
      Vocabulary.find(filter).sort({ normalizedTerm: 1 }).skip(skip).limit(limit),
      Vocabulary.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: words.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: words
    });
  } catch (err) {
    next(err);
  }
};

export const getWordById = async (req, res, next) => {
  try {
    const word = await Vocabulary.findById(req.params.id);
    if (!word) {
      return res.status(404).json({ success: false, message: 'Vocabulary item not found' });
    }
    res.status(200).json({ success: true, data: word });
  } catch (err) {
    next(err);
  }
};

export const updateWord = async (req, res, next) => {
  try {
    const updated = await updateVocabulary(req.params.id, req.body, req.user || null);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    next(err);
  }
};

export const deleteWord = async (req, res, next) => {
  try {
    const result = await deleteVocabulary(req.params.id, req.user || null);
    res.status(200).json({ success: true, message: 'Vocabulary item deleted successfully', ...result });
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ success: false, message: err.message });
    }
    next(err);
  }
};
