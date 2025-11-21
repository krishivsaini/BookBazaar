import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(protect, getWishlist).post(protect, addToWishlist).delete(protect, clearWishlist);
router.post('/toggle', protect, toggleWishlist);
router.delete('/:bookId', protect, removeFromWishlist);

export default router;
