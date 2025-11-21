import express from 'express';
import {
  addReview,
  getBookReviews,
  updateReview,
  deleteReview,
  markHelpful,
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/:bookId', getBookReviews);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
router.post('/:id/helpful', protect, markHelpful);

export default router;
