import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation middleware
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.get('/profile', protect, getProfile);

export default router;
