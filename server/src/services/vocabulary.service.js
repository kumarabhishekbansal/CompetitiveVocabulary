import { Vocabulary } from '../models/Vocabulary.js';
import { normalizeTerm } from '../utils/normalize.js';

/**
 * Find a vocabulary entry by normalized term and content type
 */
export const findByNormalizedTerm = async (rawTerm, contentType = 'word') => {
  const normalized = normalizeTerm(rawTerm);
  return Vocabulary.findOne({ normalizedTerm: normalized, contentType });
};

/**
 * Create a new vocabulary item with 2-tier duplicate prevention and ownership tagging
 */
export const createVocabulary = async (vocabData, user = null) => {
  const rawTerm = vocabData.term;
  if (!rawTerm || typeof rawTerm !== 'string') {
    const err = new Error('A valid English term is required');
    err.statusCode = 400;
    throw err;
  }

  const normalized = normalizeTerm(rawTerm);
  const contentType = vocabData.contentType || 'word';

  // Tier 1: Application-level duplicate check
  const existing = await Vocabulary.findOne({ normalizedTerm: normalized, contentType });
  if (existing) {
    const error = new Error(`The word "${existing.term}" is already present in the vocabulary collection.`);
    error.statusCode = 409;
    error.isDuplicate = true;
    error.existingWord = {
      id: existing._id,
      term: existing.term,
      normalizedTerm: existing.normalizedTerm,
      contentType: existing.contentType,
      category: existing.category,
      difficulty: existing.difficulty,
      isSystem: existing.isSystem,
      primaryHindiMeaning: existing.hindiMeanings?.[0] || '',
      primaryDefinition: existing.englishDefinitions?.[0] || ''
    };
    throw error;
  }

  // Ownership configuration
  const isSystem = Boolean(vocabData.isSystem && !user);
  const createdBy = user ? user._id : null;

  try {
    const newWord = await Vocabulary.create({
      ...vocabData,
      normalizedTerm: normalized,
      contentType,
      isSystem,
      createdBy
    });
    return newWord;
  } catch (err) {
    // Tier 2: Database-level unique constraint collision (E11000)
    if (err.code === 11000) {
      const duplicateExisting = await Vocabulary.findOne({ normalizedTerm: normalized, contentType });
      const error = new Error(`The word "${rawTerm.trim()}" is already present in the vocabulary collection.`);
      error.statusCode = 409;
      error.isDuplicate = true;
      error.existingWord = duplicateExisting ? {
        id: duplicateExisting._id,
        term: duplicateExisting.term,
        normalizedTerm: duplicateExisting.normalizedTerm,
        contentType: duplicateExisting.contentType,
        category: duplicateExisting.category,
        difficulty: duplicateExisting.difficulty,
        isSystem: duplicateExisting.isSystem,
        primaryHindiMeaning: duplicateExisting.hindiMeanings?.[0] || '',
        primaryDefinition: duplicateExisting.englishDefinitions?.[0] || ''
      } : null;
      throw error;
    }
    throw err;
  }
};

/**
 * Update an existing vocabulary item with strict ownership validation
 */
export const updateVocabulary = async (id, updateData, user) => {
  const item = await Vocabulary.findById(id);
  if (!item) {
    const error = new Error('Vocabulary item not found');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check: Users can only modify their own items; system items are read-only
  if (!item.canModify(user?._id)) {
    const error = new Error('Forbidden: You cannot modify system vocabulary or content created by other users.');
    error.statusCode = 403;
    throw error;
  }

  Object.assign(item, updateData);
  if (updateData.term) {
    item.normalizedTerm = normalizeTerm(updateData.term);
  }
  await item.save();
  return item;
};

/**
 * Delete an existing vocabulary item with strict ownership validation
 */
export const deleteVocabulary = async (id, user) => {
  const item = await Vocabulary.findById(id);
  if (!item) {
    const error = new Error('Vocabulary item not found');
    error.statusCode = 404;
    throw error;
  }

  // Strict ownership check: Users can only delete their own items; system items are read-only
  if (!item.canModify(user?._id)) {
    const error = new Error('Forbidden: You cannot delete system vocabulary or content created by other users.');
    error.statusCode = 403;
    throw error;
  }

  await Vocabulary.findByIdAndDelete(id);
  return { id, deleted: true };
};
