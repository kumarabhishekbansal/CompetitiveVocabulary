import express from 'express';
import { 
  createWord, 
  checkDuplicate, 
  getWords, 
  getWordById, 
  updateWord, 
  deleteWord 
} from '../controllers/vocabulary.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/check-duplicate', checkDuplicate);
router.get('/', getWords);
router.post('/', optionalAuth, createWord);
router.get('/:id', getWordById);
router.put('/:id', optionalAuth, updateWord);
router.delete('/:id', optionalAuth, deleteWord);

export default router;
